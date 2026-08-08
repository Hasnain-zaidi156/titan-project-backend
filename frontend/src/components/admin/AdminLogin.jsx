import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, ICONS } from "./Icon";
import { API_URL, TITAN_LOGO } from "../../constants/config";
import "./SuperAdmin.css";

// Login screen — Super Admin aur Sub Admin, dono ka role backend
// (/api/admin/login) decide karta hai, is component mein hardcode nahi hai.
export function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      onLoginSuccess({ ...data, email: data.email, role: data.role });
      // Login ke baad seedha dashboard route par bhej dena — role-based
      // sidebar AdminDashboard layout khud sambhal lega
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ta-root">
      <div className="ta-login-page">
        <form className="ta-login-card" onSubmit={handleLogin}>
          <div className="ta-logo-wrap">
            <div className="ta-logo-ring">
              <img src={TITAN_LOGO} alt="TITAN Institute logo" />
            </div>
            <p className="ta-portal-label">Titan Institute</p>
            <h1 className="ta-portal-title">Admin Portal</h1>
            <p className="ta-portal-sub">Sign in to manage your campus</p>
          </div>

          <div className="ta-field">
            <label htmlFor="ta-login-email">Email Address</label>
            <div className="ta-input-wrap">
              <Icon path={ICONS.mail} />
              <input
                id="ta-login-email"
                type="email"
                placeholder="you@titan.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="ta-field">
            <label htmlFor="ta-login-password">Password</label>
            <div className="ta-input-wrap">
              <Icon path={ICONS.lock} />
              <input
                id="ta-login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="ta-eye-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon path={showPassword ? ICONS.eyeOff : ICONS.eye} size={16} />
              </button>
            </div>
          </div>

          <div className="ta-row-between">
            <label className="ta-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a className="ta-forgot" href="#">Forgot password?</a>
          </div>

          {error && (
            <div className="ta-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="ta-submit" disabled={submitting}>
            {submitting ? "SIGNING IN…" : "SIGN IN"}
          </button>

          <p className="ta-login-footer">TITAN Institute &copy; 2026 — Secure Admin Access</p>
        </form>
      </div>
    </div>
  );
}
