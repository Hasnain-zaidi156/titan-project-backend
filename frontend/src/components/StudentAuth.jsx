import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentAuth.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LOGO_URL = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg";
const BG_URL = "https://i.ibb.co/3mPG35mK/titan-logo-bg.jpg";

const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];

// Dedicated Admission / Enroll page — login and "Create Password" ka kaam
// ab yahan nahi, wo TitanPortal (home page) par hota hai. Yeh page sirf
// naya student apply karne ke liye hai. Admin "Administration" page se
// admissions band/khula kar sakta hai — jab band ho to yahan form ki jagah
// ek clean "closed" message dikhta hai.
export default function StudentAuth() {
  const navigate = useNavigate();
  const [admissionsOpen, setAdmissionsOpen] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/admission-status`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setAdmissionsOpen(data.admissionsOpen !== false); })
      .catch(() => { if (!cancelled) setAdmissionsOpen(true); })
      .finally(() => { if (!cancelled) setStatusLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="ta-page" style={{ backgroundImage: `url(${BG_URL})` }}>
      <div className="ta-overlay" />

      <div className="ta-wrap">
        <div className="ta-header">
          <div className="ta-logo-frame">
            <img src={LOGO_URL} alt="TITAN Logo" className="ta-logo-img" />
          </div>
          <p className="ta-fullname">Taj Institute of Technology and Applied Networks</p>
          <h1 className="ta-title">Admission Form</h1>
        </div>

        <div className="ta-card">
          <div className="ta-form-area">
            {statusLoading ? (
              <div className="ta-status-loading">Checking admission status…</div>
            ) : admissionsOpen ? (
              <EnrollForm onDone={() => navigate("/")} />
            ) : (
              <ClosedNotice onBack={() => navigate("/")} />
            )}
          </div>
        </div>

        <button type="button" className="ta-back-link" onClick={() => navigate("/")}>
          ← Back to Portal
        </button>

        <p className="ta-footer-note">© TITAN — Taj Institute of Technology and Applied Networks</p>
      </div>
    </div>
  );
}

function ClosedNotice({ onBack }) {
  return (
    <div className="ta-closed">
      <div className="ta-closed-icon">🚫</div>
      <h3>Admissions Are Currently Closed</h3>
      <p className="ta-instruction">
        We're not accepting new applications right now. Please check back later or contact the campus for more information.
      </p>
      <button type="button" className="ta-submit-btn" onClick={onBack}>Back to Portal</button>
    </div>
  );
}

function EnrollForm({ onDone }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    studentName: "", fatherName: "", cnic: "", phone: "", fatherPhone: "", email: "",
    dob: "", address: "", gender: "Male", course: COURSES[0], campus: CAMPUSES[0], batch: "",
    computerProficiency: "", lastQualification: "", hearAboutUs: "", laptop: "No", photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5MB");
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
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions to continue");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, country: "Pakistan", agreedToTerms: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Application failed");
      setSuccess(`Application submitted! Your Roll Number is ${data.student.rollNumber}. Once your admission is approved, use "Create Password" on the portal (with your CNIC + Date of Birth) to log in.`);
      setTimeout(onDone, 3200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="ta-form">
      <h3>New Admission</h3>
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
          <small>Required — tap the circle to upload (max 5MB)</small>
        </div>
      </div>

      <p className="ta-section-title">Personal Information</p>
      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">Full Name *</label><input className="ta-input" value={form.studentName} onChange={update("studentName")} required /></div>
        <div className="ta-col"><label className="ta-label">Father Name *</label><input className="ta-input" value={form.fatherName} onChange={update("fatherName")} required /></div>
      </div>

      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">CNIC *</label><input className="ta-input" value={form.cnic} onChange={update("cnic")} placeholder="XXXXX-XXXXXXX-X" required /></div>
        <div className="ta-col"><label className="ta-label">Date of Birth *</label><input type="date" className="ta-input" value={form.dob} onChange={update("dob")} required /></div>
      </div>

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

      <p className="ta-section-title">Contact Details</p>
      <div className="ta-row">
        <div className="ta-col"><label className="ta-label">Phone *</label><input className="ta-input" value={form.phone} onChange={update("phone")} required /></div>
        <div className="ta-col"><label className="ta-label">Father's Phone</label><input className="ta-input" value={form.fatherPhone} onChange={update("fatherPhone")} /></div>
      </div>

      <label className="ta-label">Email</label>
      <input type="email" className="ta-input" value={form.email} onChange={update("email")} />

      <label className="ta-label">Address</label>
      <input className="ta-input" value={form.address} onChange={update("address")} />

      <p className="ta-section-title">Course Details</p>
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

      <p className="ta-section-title">Terms &amp; Conditions</p>
      <div className="ta-terms-box">
        <ul className="ta-terms-list">
          <li>A minimum of <strong>75% attendance</strong> is mandatory throughout the course. Falling below this may affect your certification.</li>
          <li>Students must show <strong>respectful behavior</strong> at all times toward trainers, staff and fellow students. Misconduct, misbehavior or indiscipline of any kind will not be tolerated.</li>
          <li>Fee vouchers must be paid by the due date each month to keep your admission active.</li>
          <li>Any damage to institute property or violation of the code of conduct may result in suspension or cancellation of admission.</li>
          <li>All information provided in this form is accurate to the best of my knowledge.</li>
        </ul>
      </div>

      <label className="ta-checkbox-row">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <span>I have read and agree to the Terms &amp; Conditions above.</span>
      </label>

      {error && <p className="ta-error">{error}</p>}
      {success && <p className="ta-success">{success}</p>}
      <button className="ta-submit-btn" disabled={loading || !agreedToTerms}>{loading ? "Submitting…" : "Submit Application"}</button>
    </form>
  );
}

