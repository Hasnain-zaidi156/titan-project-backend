"use client"

// TrainerPortal.jsx
// Entry point for the trainer side. Shows a real login form, calls the
// backend /api/trainer-login, and only then renders Dashboard — with the
// ACTUAL trainer record that was returned (name, photo, courses, campus,
// etc). No hardcoded "Sir Yasir" data anywhere in this flow: whichever
// trainer the admin added and who logs in with their email+password sees
// their own portal.

import { useState, useEffect } from "react"
import Dashboard from "./Dashboard"
import { API_BASE, TITAN_LOGO } from "./constants"

const STORAGE_KEY = "titan-trainer-session"

export default function TrainerPortal() {
  const [trainer, setTrainer] = useState(() => {
    if (typeof window === "undefined") return null
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    if (trainer) localStorage.setItem(STORAGE_KEY, JSON.stringify(trainer))
    else localStorage.removeItem(STORAGE_KEY)
  }, [trainer])

  // Trainer ka record ek dafa login par mil kar localStorage mein cache ho
  // jata hai — agar admin baad mein uske assigned days/courses/campus change
  // kare to wo yahan khud-ba-khud nazar nahi aata jab tak dobara login na ho.
  // Isliye login ke baad turant (page refresh/reload par bhi) aur phir har
  // 15 second mein backend se latest record laa kar silently sync karte hain
  // (session/UI disturb kiye baghair) — admin ka koi bhi change (days,
  // courses, campus, photo) turant reflect ho jayega, reload par bhi purana
  // cached data nahi dikhega.
  useEffect(() => {
    if (!trainer?.employeeId) return
    let cancelled = false

    const refreshTrainer = () => {
      fetch(`${API_BASE}/api/trainers`, { cache: "no-store" })
        .then((r) => r.json())
        .then((list) => {
          if (cancelled) return
          const fresh = (Array.isArray(list) ? list : []).find((t) => t.employeeId === trainer.employeeId)
          if (fresh) {
            setTrainer((prev) => (prev ? { ...prev, ...fresh } : fresh))
          }
        })
        .catch((err) => console.error("Failed to refresh trainer record:", err))
    }

    refreshTrainer()
    const interval = setInterval(refreshTrainer, 15000)
    return () => { cancelled = true; clearInterval(interval) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainer?.employeeId])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setLoginError("Email and password are required.")
      return
    }
    setLoggingIn(true)
    setLoginError("")
    try {
      const res = await fetch(`${API_BASE}/api/trainer-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")
      // data.trainer = real record from the admin DB (id, name, email,
      // employeeId, photo, courses[], cities[], campus, slotSchedule, status)
      setTrainer(data.trainer)
    } catch (err) {
      setLoginError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = () => {
    setTrainer(null)
    setEmail("")
    setPassword("")
  }

  if (trainer) {
    return <Dashboard trainer={trainer} onLogout={handleLogout} />
  }

  return (
    <div style={styles.wrap}>
      <form style={styles.card} onSubmit={handleLogin}>
        <img src={TITAN_LOGO} alt="TITAN" style={styles.logo} />
        <h2 style={styles.title}>Trainer Login</h2>
        <p style={styles.subtitle}>Login with the email and password your admin set up for you.</p>

        <label style={styles.label}>Email</label>
        <input
          type="email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="username"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {loginError && <p style={styles.error}>{loginError}</p>}

        <button type="submit" style={styles.button} disabled={loggingIn}>
          {loggingIn ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  logo: { width: 64, height: 64, objectFit: "contain", alignSelf: "center", marginBottom: 12, borderRadius: 8 },
  title: { textAlign: "center", margin: "0 0 4px", fontSize: 20 },
  subtitle: { textAlign: "center", color: "#6b7280", fontSize: 13, margin: "0 0 20px" },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 4, marginTop: 12, color: "#374151" },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 },
  error: { color: "#dc2626", fontSize: 12, marginTop: 10, marginBottom: 0 },
  button: {
    marginTop: 20,
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#1e40af",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
}
