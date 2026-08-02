import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitanPortal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];

export default function TitanPortal({ onLoginSuccess }) {
  const [view, setView] = useState('enroll'); // enroll | student-login | teacher-login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (email === 'drhasnain953@gmail.com' && password === '2008hasanin') {
      onLoginSuccess('trainer', { name: "Dr. Hasnain", email });
    } else {
      alert("Invalid Trainer Email or Password!");
    }
  };

  const headerTitle =
    view === 'teacher-login' ? 'Trainer Portal' :
    view === 'student-login' ? 'Student Login' :
    'Student Admission';

  return (
    <div className="titan-container">
      <div className="titan-header">
        <div className="titan-logo-container">
          <img src="https://i.ibb.co/q3c3CkLS/titan-logo.jpg" alt="TITAN Logo" className="titan-logo-img" />
        </div>
        <p className="titan-fullname">Taj Institute of Technology and Applied Networks</p>
        <h2 className="titan-portal-title">{headerTitle}</h2>
      </div>

      {view !== 'teacher-login' && (
        <div style={{ display: 'flex', gap: 8, margin: '0 0 14px' }}>
          <button type="button" onClick={() => setView('enroll')}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
              border: view === 'enroll' ? '2px solid #1e3a8a' : '1px solid #d1d5db',
              background: view === 'enroll' ? '#eef2ff' : '#fff',
              color: view === 'enroll' ? '#1e3a8a' : '#555' }}>
            New Admission
          </button>
          <button type="button" onClick={() => setView('student-login')}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
              border: view === 'student-login' ? '2px solid #1e3a8a' : '1px solid #d1d5db',
              background: view === 'student-login' ? '#eef2ff' : '#fff',
              color: view === 'student-login' ? '#1e3a8a' : '#555' }}>
            Student Login
          </button>
        </div>
      )}

      <div className="titan-card">
        {view === 'enroll' && <EnrollGate />}
        {view === 'student-login' && <StudentLogin onLoginSuccess={onLoginSuccess} />}

        {view === 'teacher-login' && (
          <form onSubmit={handleTeacherSubmit} className="titan-form">
            <h3>Login</h3>
            <p className="form-instruction">Kindly provide your email and password to access the trainer portal.</p>
            <div className="input-group">
              <label>Email *</label>
              <input type="email" placeholder="trainer@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group password-group">
              <label>Password *</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="toggle-password-text" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn">LOGIN</button>
            <span className="forgot-password-link">Forgot Password?</span>
          </form>
        )}
      </div>

      <div className="portal-switcher-box">
        {view === 'teacher-login' ? (
          <button type="button" className="switch-portal-btn" onClick={() => setView('enroll')}>Back to Enrollment</button>
        ) : (
          <button type="button" className="switch-portal-btn" onClick={() => setView('teacher-login')}>Login as teacher</button>
        )}
      </div>
    </div>
  );
}

function StudentLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password) { setError("Roll Number/CNIC and password are required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      window.dispatchEvent(new CustomEvent("titan-auto-login", { detail: data.student }));
      if (onLoginSuccess) onLoginSuccess('student', data.student);
      navigate("/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="titan-form">
      <h3>Student Login</h3>
      <p className="form-instruction">Already enrolled? Log in with your Roll Number or CNIC and your password.</p>
      <div className="input-group">
        <label>Roll Number or CNIC *</label>
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="e.g. 827544 or 45504-0805007-3" required />
      </div>
      <div className="input-group password-group">
        <label>Password *</label>
        <div className="password-wrapper">
          <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="toggle-password-text" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {error && <p className="titan-error-text">{error}</p>}
      <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Logging in…" : "LOGIN"}</button>
    </form>
  );
}

function EnrollGate() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admission-status`);
        const data = await res.json();
        if (!cancelled) setStatus(data.open ? "open" : "closed");
      } catch {
        if (!cancelled) setStatus("open");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") {
    return <div className="titan-form"><p className="form-instruction">Checking admission status…</p></div>;
  }
  if (status === "closed") {
    return (
      <div className="titan-closed-box">
        <div className="titan-closed-icon">⛔</div>
        <h3>Admission Not Open</h3>
        <p className="form-instruction">Admissions are currently closed. Please check back later or contact the campus office.</p>
      </div>
    );
  }
  return <EnrollForm />;
}

function EnrollForm() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: "", fatherName: "", cnic: "", phone: "", fatherPhone: "", email: "",
    dob: "", address: "", gender: "Male", course: COURSES[0], campus: CAMPUSES[0], batch: "",
    computerProficiency: "", lastQualification: "", hearAboutUs: "", laptop: "No",
    password: "", confirm: "", photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handlePhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose a valid image file"); return; }
    if (file.size > 3 * 1024 * 1024) { setError("Photo must be under 3MB"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.photo) { setError("Profile photo is required"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, country: "Pakistan" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Application failed");

      const loginRes = await fetch(`${API_BASE}/api/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.student.cnic, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        window.dispatchEvent(new CustomEvent("titan-auto-login", { detail: loginData.student }));
      }
      navigate("/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="titan-form">
      <h3>New Admission</h3>
      <p className="form-instruction">Fill your details to apply. Your application goes straight to the admin portal for review.</p>

      <div className="titan-photo-row">
        <button type="button" className="titan-photo-circle" onClick={() => fileInputRef.current?.click()} aria-label="Upload profile photo">
          {photoPreview ? <img src={photoPreview} alt="Profile preview" className="titan-photo-img" /> : <span className="titan-photo-placeholder">Add Photo</span>}
          <span className="titan-photo-badge">📷</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoPick} className="titan-photo-input-hidden" />
        <div className="titan-photo-caption">
          <span>Profile Photo *</span>
          <small>Required — tap the circle to upload</small>
        </div>
      </div>

      <div className="titan-row">
        <div className="input-group titan-col"><label>Full Name *</label><input value={form.studentName} onChange={update("studentName")} required /></div>
        <div className="input-group titan-col"><label>Father Name *</label><input value={form.fatherName} onChange={update("fatherName")} required /></div>
      </div>
      <div className="titan-row">
        <div className="input-group titan-col"><label>CNIC *</label><input value={form.cnic} onChange={update("cnic")} placeholder="XXXXX-XXXXXXX-X" required /></div>
        <div className="input-group titan-col"><label>Date of Birth *</label><input type="date" value={form.dob} onChange={update("dob")} required /></div>
      </div>
      <div className="titan-row">
        <div className="input-group titan-col"><label>Phone *</label><input value={form.phone} onChange={update("phone")} required /></div>
        <div className="input-group titan-col"><label>Father's Phone</label><input value={form.fatherPhone} onChange={update("fatherPhone")} /></div>
      </div>

      <div className="input-group"><label>Email</label><input type="email" value={form.email} onChange={update("email")} /></div>
      <div className="input-group"><label>Address</label><input value={form.address} onChange={update("address")} /></div>

      <div className="titan-row">
        <div className="input-group titan-col">
          <label>Gender *</label>
          <select value={form.gender} onChange={update("gender")}><option>Male</option><option>Female</option></select>
        </div>
        <div className="input-group titan-col">
          <label>Have a Laptop? *</label>
          <select value={form.laptop} onChange={update("laptop")}><option>No</option><option>Yes</option></select>
        </div>
      </div>

      <div className="titan-row">
        <div className="input-group titan-col">
          <label>Course *</label>
          <select value={form.course} onChange={update("course")}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="input-group titan-col">
          <label>Campus *</label>
          <select value={form.campus} onChange={update("campus")}>{CAMPUSES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </div>

      <div className="input-group"><label>Last Qualification</label><input value={form.lastQualification} onChange={update("lastQualification")} /></div>
      <div className="input-group"><label>Computer Proficiency</label><input value={form.computerProficiency} onChange={update("computerProficiency")} placeholder="Beginner / Intermediate / Advanced" /></div>
      <div className="input-group"><label>Where did you hear about us?</label><input value={form.hearAboutUs} onChange={update("hearAboutUs")} /></div>

      <div className="titan-row">
        <div className="input-group titan-col"><label>Create Password *</label><input type="password" value={form.password} onChange={update("password")} required minLength={6} /></div>
        <div className="input-group titan-col"><label>Confirm Password *</label><input type="password" value={form.confirm} onChange={update("confirm")} required minLength={6} /></div>
      </div>

      {error && <p className="titan-error-text">{error}</p>}
      <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Submitting…" : "Submit Application"}</button>
    </form>
  );
}