import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];

// Three flows in one screen, matching how a real student ends up with a
// working login:
//  - "login"    : Roll Number/CNIC + password (normal day-to-day use)
//  - "enroll"   : brand-new student fills their own application (mirrors
//                 the SMIT public enroll form) — creates the record AND
//                 the password together, shows up as "pending" in admin
//  - "activate" : admin already added this student manually (no password
//                 yet) — student proves Roll Number + CNIC, then sets DOB
//                 + a password to unlock login
export default function StudentAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleLoginSuccess = (role, data) => {
    onLoginSuccess(role, data);
    navigate("/student");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ margin: 0, fontSize: "22px" }}>TITAN Student Portal</h1>
        <div style={tabRowStyle}>
          <button style={tabStyle(mode === "login")} onClick={() => setMode("login")}>Login</button>
          <button style={tabStyle(mode === "activate")} onClick={() => setMode("activate")}>Create Password</button>
          <button style={tabStyle(mode === "enroll")} onClick={() => setMode("enroll")}>New? Enroll</button>
        </div>

        {mode === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} />}
        {mode === "activate" && <ActivateForm onDone={() => setMode("login")} />}
        {mode === "enroll" && <EnrollForm onDone={() => setMode("login")} />}
      </div>
    </div>
  );
}

function LoginForm({ onLoginSuccess }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      onLoginSuccess("student", data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label style={labelStyle}>Roll Number or CNIC</label>
      <input style={inputStyle} value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />
      <label style={labelStyle}>Password</label>
      <input type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      {error && <p style={errorStyle}>{error}</p>}
      <button style={primaryBtnStyle} disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
    </form>
  );
}

function ActivateForm({ onDone }) {
  const [form, setForm] = useState({ cnic: "", dob: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnic: form.cnic, dob: form.dob, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create password");
      setSuccess("Password created! You can log in now.");
      setTimeout(onDone, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <p style={{ fontSize: "13px", color: "#64748b", marginTop: 0 }}>
        For students already registered by admin — enter the CNIC and Date of Birth on your record to verify it's you, then set your own password.
      </p>
      <label style={labelStyle}>CNIC</label>
      <input style={inputStyle} value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} placeholder="XXXXX-XXXXXXX-X" required />
      <label style={labelStyle}>Date of Birth</label>
      <input type="date" style={inputStyle} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
      <label style={labelStyle}>New Password</label>
      <input type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
      <label style={labelStyle}>Confirm Password</label>
      <input type="password" style={inputStyle} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required minLength={6} />
      {error && <p style={errorStyle}>{error}</p>}
      {success && <p style={{ ...errorStyle, color: "#059669" }}>{success}</p>}
      <button style={primaryBtnStyle} disabled={loading}>{loading ? "Creating…" : "Create Password"}</button>
    </form>
  );
}

function EnrollForm({ onDone }) {
  const [form, setForm] = useState({
    studentName: "", fatherName: "", cnic: "", phone: "", fatherPhone: "", email: "",
    dob: "", address: "", gender: "Male", course: COURSES[0], campus: CAMPUSES[0], batch: "",
    computerProficiency: "", lastQualification: "", hearAboutUs: "", laptop: "No",
    password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, country: "Pakistan" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Application failed");
      setSuccess(`Application submitted! Your Roll Number is ${data.student.rollNumber}. You can log in now — your admission is pending admin review.`);
      setTimeout(onDone, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <p style={{ fontSize: "13px", color: "#64748b", marginTop: 0 }}>
        Fill your details to apply. Your application goes straight to the admin portal for review.
      </p>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.studentName} onChange={update("studentName")} required /></div>
        <div style={{ flex: 1 }}><label style={labelStyle}>Father Name *</label><input style={inputStyle} value={form.fatherName} onChange={update("fatherName")} required /></div>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}><label style={labelStyle}>CNIC *</label><input style={inputStyle} value={form.cnic} onChange={update("cnic")} placeholder="XXXXX-XXXXXXX-X" required /></div>
        <div style={{ flex: 1 }}><label style={labelStyle}>Date of Birth *</label><input type="date" style={inputStyle} value={form.dob} onChange={update("dob")} required /></div>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={update("phone")} required /></div>
        <div style={{ flex: 1 }}><label style={labelStyle}>Father's Phone</label><input style={inputStyle} value={form.fatherPhone} onChange={update("fatherPhone")} /></div>
      </div>

      <label style={labelStyle}>Email</label>
      <input type="email" style={inputStyle} value={form.email} onChange={update("email")} />

      <label style={labelStyle}>Address</label>
      <input style={inputStyle} value={form.address} onChange={update("address")} />

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Gender *</label>
          <select style={inputStyle} value={form.gender} onChange={update("gender")}>
            <option>Male</option><option>Female</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Have a Laptop? *</label>
          <select style={inputStyle} value={form.laptop} onChange={update("laptop")}>
            <option>No</option><option>Yes</option>
          </select>
        </div>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Course *</label>
          <select style={inputStyle} value={form.course} onChange={update("course")}>
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Campus *</label>
          <select style={inputStyle} value={form.campus} onChange={update("campus")}>
            {CAMPUSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <label style={labelStyle}>Last Qualification</label>
      <input style={inputStyle} value={form.lastQualification} onChange={update("lastQualification")} />

      <label style={labelStyle}>Computer Proficiency</label>
      <input style={inputStyle} value={form.computerProficiency} onChange={update("computerProficiency")} placeholder="Beginner / Intermediate / Advanced" />

      <label style={labelStyle}>Where did you hear about us?</label>
      <input style={inputStyle} value={form.hearAboutUs} onChange={update("hearAboutUs")} />

      <div style={rowStyle}>
        <div style={{ flex: 1 }}><label style={labelStyle}>Create Password *</label><input type="password" style={inputStyle} value={form.password} onChange={update("password")} required minLength={6} /></div>
        <div style={{ flex: 1 }}><label style={labelStyle}>Confirm Password *</label><input type="password" style={inputStyle} value={form.confirm} onChange={update("confirm")} required minLength={6} /></div>
      </div>

      {error && <p style={errorStyle}>{error}</p>}
      {success && <p style={{ ...errorStyle, color: "#059669" }}>{success}</p>}
      <button style={primaryBtnStyle} disabled={loading}>{loading ? "Submitting…" : "Submit Application"}</button>
    </form>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" };
const cardStyle = { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "460px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", maxHeight: "90vh", overflowY: "auto" };
const tabRowStyle = { display: "flex", gap: "8px", margin: "16px 0 20px" };
const tabStyle = (active) => ({
  flex: 1, padding: "8px 6px", borderRadius: "8px", border: active ? "none" : "1px solid #e2e8f0",
  background: active ? "#4f46e5" : "#fff", color: active ? "#fff" : "#475569",
  fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
});
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginTop: "12px", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", fontFamily: "inherit" };
const rowStyle = { display: "flex", gap: "12px" };
const errorStyle = { color: "#ef4444", fontSize: "13px", marginTop: "10px" };
const primaryBtnStyle = { width: "100%", marginTop: "18px", padding: "11px", borderRadius: "9px", border: "none", background: "#4f46e5", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" };