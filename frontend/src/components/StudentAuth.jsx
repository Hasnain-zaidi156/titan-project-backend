import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentAuth.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LOGO_URL = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg";
const BG_URL = "https://i.ibb.co/3mPG35mK/titan-logo-bg.jpg";

const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];

// Three flows in one screen, matching how a real student ends up with a
// working login:
//  - "login"    : Roll Number/CNIC + password (normal day-to-day use)
//  - "enroll"   : brand-new student fills their own application — creates
//                 the record AND the password together, shows up as
//                 "pending" in admin. Profile photo is required here.
//  - "activate" : admin already added this student manually (no password
//                 yet) — student proves CNIC + DOB, then sets a password
export default function StudentAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleLoginSuccess = (role, data) => {
    onLoginSuccess(role, data);
    navigate("/student");
  };

  return (
    <div className="ta-page" style={{ backgroundImage: `url(${BG_URL})` }}>
      <div className="ta-overlay" />

      <div className="ta-wrap">
        <div className="ta-header">
          <div className="ta-logo-frame">
            <img src={LOGO_URL} alt="TITAN Logo" className="ta-logo-img" />
          </div>
          <p className="ta-fullname">Taj Institute of Technology and Applied Networks</p>
          <h1 className="ta-title">Student Portal</h1>
        </div>

        <div className="ta-card">
          <div className="ta-tabs">
            <button type="button" className={`ta-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={`ta-tab ${mode === "activate" ? "active" : ""}`} onClick={() => setMode("activate")}>Create Password</button>
            <button type="button" className={`ta-tab ${mode === "enroll" ? "active" : ""}`} onClick={() => setMode("enroll")}>New? Enroll</button>
          </div>

          <div className="ta-form-area">
            {mode === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} />}
            {mode === "activate" && <ActivateForm onDone={() => setMode("login")} />}
            {mode === "enroll" && <EnrollForm onDone={() => setMode("login")} />}
          </div>
        </div>

        <p className="ta-footer-note">© TITAN — Taj Institute of Technology and Applied Networks</p>
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
    <form onSubmit={submit} className="ta-form">
      <h3>Login</h3>
      <p className="ta-instruction">Enter the Roll Number or CNIC and password used during registration.</p>

      <label className="ta-label">Roll Number or CNIC</label>
      <input className="ta-input" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />

      <label className="ta-label">Password</label>
      <input type="password" className="ta-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

      {error && <p className="ta-error">{error}</p>}
      <button className="ta-submit-btn" disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
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
    <form onSubmit={submit} className="ta-form">
      <h3>Create Password</h3>
      <p className="ta-instruction">
        For students already registered by admin — enter the CNIC and Date of Birth on your record to verify it's you, then set your own password.
      </p>

      <label className="ta-label">CNIC</label>
      <input className="ta-input" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} placeholder="XXXXX-XXXXXXX-X" required />

      <label className="ta-label">Date of Birth</label>
      <input type="date" className="ta-input" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />

      <label className="ta-label">New Password</label>
      <input type="password" className="ta-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />

      <label className="ta-label">Confirm Password</label>
      <input type="password" className="ta-input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required minLength={6} />

      {error && <p className="ta-error">{error}</p>}
      {success && <p className="ta-success">{success}</p>}
      <button className="ta-submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Password"}</button>
    </form>
  );
}

function EnrollForm({ onDone }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    studentName: "", fatherName: "", cnic: "", phone: "", fatherPhone: "", email: "",
    dob: "", address: "", gender: "Male", course: COURSES[0], campus: CAMPUSES[0], batch: "",
    computerProficiency: "", lastQualification: "", hearAboutUs: "", laptop: "No",
    password: "", confirm: "", photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handlePhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Photo must be under 3MB");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPhotoPreview(dataUrl);
      setForm((prev) => ({ ...prev, photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.photo) {
      setError("Profile photo is required");
      return;
    }
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
    <form onSubmit={submit} className="ta-form">
      <h3>New? Enroll</h3>
      <p className="ta-instruction">Fill your details to apply. Your application goes straight to the admin portal for review.</p>

      <div className="ta-photo-row">
        <button
          type="button"
          className="ta-photo-circle"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload profile photo"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Profile preview" className="ta-photo-img" />
          ) : (
            <span className="ta-photo-placeholder">Add Photo</span>
          )}
          <span className="ta-photo-badge">📷</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoPick}
          className="ta-photo-input-hidden"
        />
        <div className="ta-photo-caption">
          <span>Profile Photo *</span>
          <small>Required — tap the circle to upload</small>
        </div>
      </div>

      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">Full Name *</label><input className="ta-input" value={form.studentName} onChange={update("studentName")} required /></div>
        <div className="ta-col"><label className="ta-label">Father Name *</label><input className="ta-input" value={form.fatherName} onChange={update("fatherName")} required /></div>
      </div>

      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">CNIC *</label><input className="ta-input" value={form.cnic} onChange={update("cnic")} placeholder="XXXXX-XXXXXXX-X" required /></div>
        <div className="ta-col"><label className="ta-label">Date of Birth *</label><input type="date" className="ta-input" value={form.dob} onChange={update("dob")} required /></div>
      </div>

      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">Phone *</label><input className="ta-input" value={form.phone} onChange={update("phone")} required /></div>
        <div className="ta-col"><label className="ta-label">Father's Phone</label><input className="ta-input" value={form.fatherPhone} onChange={update("fatherPhone")} /></div>
      </div>

      <label className="ta-label">Email</label>
      <input type="email" className="ta-input" value={form.email} onChange={update("email")} />

      <label className="ta-label">Address</label>
      <input className="ta-input" value={form.address} onChange={update("address")} />

      <div className="ta-row">
        <div className="ta-col">
          <label className="ta-label">Gender *</label>
          <select className="ta-input" value={form.gender} onChange={update("gender")}>
            <option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="ta-col">
          <label className="ta-label">Have a Laptop? *</label>
          <select className="ta-input" value={form.laptop} onChange={update("laptop")}>
            <option>No</option><option>Yes</option>
          </select>
        </div>
      </div>

      <div className="ta-row">
        <div className="ta-col">
          <label className="ta-label">Course *</label>
          <select className="ta-input" value={form.course} onChange={update("course")}>
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="ta-col">
          <label className="ta-label">Campus *</label>
          <select className="ta-input" value={form.campus} onChange={update("campus")}>
            {CAMPUSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <label className="ta-label">Last Qualification</label>
      <input className="ta-input" value={form.lastQualification} onChange={update("lastQualification")} />

      <label className="ta-label">Computer Proficiency</label>
      <input className="ta-input" value={form.computerProficiency} onChange={update("computerProficiency")} placeholder="Beginner / Intermediate / Advanced" />

      <label className="ta-label">Where did you hear about us?</label>
      <input className="ta-input" value={form.hearAboutUs} onChange={update("hearAboutUs")} />

      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">Create Password *</label><input type="password" className="ta-input" value={form.password} onChange={update("password")} required minLength={6} /></div>
        <div className="ta-col"><label className="ta-label">Confirm Password *</label><input type="password" className="ta-input" value={form.confirm} onChange={update("confirm")} required minLength={6} /></div>
      </div>

      {error && <p className="ta-error">{error}</p>}
      {success && <p className="ta-success">{success}</p>}
      <button className="ta-submit-btn" disabled={loading}>{loading ? "Submitting…" : "Submit Application"}</button>
    </form>
  );
}