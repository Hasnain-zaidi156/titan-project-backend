"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import "./SuperAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg";

/* =========================================================================
   AUTH — DEMO ONLY
   -------------------------------------------------------------------------
   These credentials live in the JS bundle, so anyone can read them from
   devtools / "View Source". This is fine for a local demo but is NOT real
   auth. Before this goes anywhere near production:
     1. Move login to a real backend (Firebase Auth, a JWT-issuing API, etc).
     2. Never distinguish roles by password case (the old version used
        "2008hasnain" vs "2008Hasnain" — a stray Caps Lock silently logs
        someone into the wrong role). Roles are now separate usernames.
   ========================================================================= */
const ADMIN_USERS = [
  { email: "superadmin@example.com", password: "super", role: "Super Admin" },
  { email: "subadmin@example.com", password: "sub", role: "Sub Admin" },
];

/* ---- small shared utilities -------------------------------------------- */

// Safe incremental id generator: derives the next id from the current list
// instead of relying on a module-level mutable counter (which can drift or
// get reused twice under React StrictMode's double-invoke in dev).
function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

// Closes a modal / popover on Escape. Usage: useEscapeKey(onClose)
function useEscapeKey(onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
}

// Shared toast-stack hook so multiple toasts can queue instead of the
// newest one silently replacing whatever was already on screen.
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const showToast = useCallback((message, variant = "default") => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return { toasts, showToast };
}

function ToastStack({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="ta-toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`ta-toast ${t.variant === "error" ? "ta-toast-error" : ""}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// "Today" for demo/attendance purposes. Uses the real current date rather
// than a hardcoded value, so calendars and stats stay correct as time
// passes. If you ever need a fixed date for testing, swap the line below,
// but don't ship a hardcoded date.
function getToday() {
  return new Date();
}
const TODAY_REF = getToday();

const Icon = ({ path, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {path}
  </svg>
);

const ICONS = {
  mail: (
    <>
      <path d="M3 6.5h18v11H3z" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.5-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17.5" cy="9" r="2.4" />
      <path d="M16 14.3c2.6.4 4.5 2.3 4.5 5.7" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M8.5 14.5l2 2 4-4.5" />
    </>
  ),
  shield: <path d="M12 3l8 3.5v5.5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6.5L12 3Z" />,
  cap: (
    <>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 4v4h-4" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 20v-4h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0v4.5l1.5 3H4.5L6 13.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M16 6h4v4" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5C4 3.7 4.7 3 5.5 3H12v17H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M20 4.5C20 3.7 19.3 3 18.5 3H12v17h6.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V6l8-3 8 3v15" />
      <path d="M9 21v-5h6v5M9 10h.01M14 10h.01M9 14h.01M14 14h.01" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 9.5 6 4h12l3 5.5" />
      <path d="M3 9.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5" />
      <path d="M3 9.5h5.2a1 1 0 0 1 .95.68L9.7 12.5h4.6l.55-2.32a1 1 0 0 1 .95-.68H21" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </>
  ),
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  camera: (
    <>
      <path d="M4 8h3l2-2.5h6L17 8h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
};

export function AdminLogin({ onLoginSuccess }) {
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

const STATUS_OPTIONS = [
  "pending",
  "approved",
  "rejected",
  "passed",
  "failed",
  "enrolled",
  "completed",
  "eliminated",
  "dropout",
  "cancelled",
  "certified",
  "blacklisted",
];

const PAYMENT_STATUS_OPTIONS = ["Paid", "Pending", "Not Generated"];
const COUNTRIES = ["Pakistan"];
const CITIES = ["Sukkur", "Karachi", "Lahore", "Islamabad"];
const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];
const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
const BATCHES = ["Batch 1", "Batch 2", "Batch 3"];
const SLOTS = ["Morning", "Evening"];
const GENDERS = ["Male", "Female"];
const LAPTOP_OPTIONS = ["Yes", "No"];

const FILTER_FIELDS = [
  { key: "dateRange", label: "Start date  →  End date", type: "date-range" },
  { key: "country", label: "Country", type: "select", options: COUNTRIES },
  { key: "city", label: "City", type: "select", options: CITIES },
  { key: "campus", label: "Campus", type: "select", options: CAMPUSES },
  { key: "course", label: "Course", type: "select", options: COURSES },
  { key: "batch", label: "Batch", type: "select", options: BATCHES },
  { key: "slot", label: "Slot", type: "select", options: SLOTS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  { key: "laptop", label: "Laptop", type: "select", options: LAPTOP_OPTIONS },
  { key: "sponsorship", label: "Sponsorship Status", type: "select", options: ["Sponsored", "Self Paid"] },
  { key: "year", label: "Year", type: "select", options: ["2026", "2025", "2024"] },
  { key: "paymentMonth", label: "Payment Month", type: "select", options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
  { key: "paymentStatus", label: "Payment Status", type: "select", options: PAYMENT_STATUS_OPTIONS },
  { key: "gender", label: "Gender", type: "select", options: GENDERS },
];

const TABLE_COLUMNS = [
  "Photo",
  "Roll No",
  "Student name",
  "Father name",
  "CNIC",
  "Phone",
  "Course",
  "Status",
  "Payment Status",
  "Action",
];

const SEED_STUDENTS = [
  {
    id: 1,
    admissionNo: "ADM844226",
    rollNumber: "827544",
    photo: "",
    studentName: "Muhammad Hassan",
    fatherName: "Muhammad Afzal",
    cnic: "45504-0805007-3",
    phone: "0310-3589178",
    course: "Mobile App Development",
    status: "enrolled",
    paymentStatus: "Not Generated",
    country: "Pakistan",
    city: "Sukkur",
    campus: "TITAN Sukkur Campus",
    batch: "Batch 1",
    slot: "Morning",
    gender: "Male",
    laptop: "No",
    invoices: [
      {
        invoiceNumber: "ADM844226",
        jazzCashId: "",
        type: "Registration",
        month: "May-2026",
        dueDate: "10-May-2026",
        amount: 1000,
        status: "PENDING",
      },
    ],
  },
  {
    id: 2,
    admissionNo: "ADM844227",
    rollNumber: "827545",
    photo: "",
    studentName: "Ayesha Khan",
    fatherName: "Imran Khan",
    cnic: "45201-1234567-8",
    phone: "0300-1234567",
    course: "Graphic Designing",
    status: "pending",
    paymentStatus: "Pending",
    country: "Pakistan",
    city: "Karachi",
    campus: "TITAN Karachi Campus",
    batch: "Batch 2",
    slot: "Evening",
    gender: "Female",
    laptop: "Yes",
    invoices: [],
  },
  {
    id: 3,
    admissionNo: "ADM844228",
    rollNumber: "827546",
    photo: "",
    studentName: "Bilal Ahmed",
    fatherName: "Tariq Ahmed",
    cnic: "45100-9876543-2",
    phone: "0321-1234567",
    course: "Web Development",
    status: "completed",
    paymentStatus: "Paid",
    country: "Pakistan",
    city: "Lahore",
    campus: "TITAN Lahore Campus",
    batch: "Batch 1",
    slot: "Morning",
    gender: "Male",
    laptop: "No",
    invoices: [
      {
        invoiceNumber: "ADM844228",
        jazzCashId: "JC998877",
        type: "Registration",
        month: "April-2026",
        dueDate: "10-Apr-2026",
        amount: 1000,
        status: "PAID",
      },
    ],
  },
];

const EMPTY_FORM = {
  rollNumber: "",
  photo: "",
  studentName: "",
  fatherName: "",
  cnic: "",
  phone: "",
  country: "Pakistan",
  city: CITIES[0],
  campus: CAMPUSES[0],
  course: COURSES[0],
  batch: BATCHES[0],
  slot: SLOTS[0],
  status: "pending",
  paymentStatus: "Not Generated",
  gender: GENDERS[0],
  laptop: "No",
};

// Pakistani CNIC: 12345-1234567-1 (dashes optional while typing).
const CNIC_PATTERN = /^\d{5}-?\d{7}-?\d{1}$/;
// Pakistani mobile: 03XX-XXXXXXX (dash optional).
const PHONE_PATTERN = /^03\d{2}-?\d{7}$/;

function validateStudentForm(form) {
  const errors = {};
  if (!form.studentName.trim()) errors.studentName = "Required";
  if (!form.fatherName.trim()) errors.fatherName = "Required";
  if (!CNIC_PATTERN.test(form.cnic.trim())) errors.cnic = "Format: 00000-0000000-0";
  if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = "Format: 03XXXXXXXXX";
  return errors;
}

function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (["enrolled", "approved", "passed"].includes(s)) return "ta-badge-blue";
  if (["completed", "certified"].includes(s)) return "ta-badge-green";
  if (["rejected", "failed", "eliminated", "cancelled", "blacklisted"].includes(s)) return "ta-badge-red";
  return "ta-badge-gray";
}

function paymentBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "ta-badge-green";
  if (s === "pending") return "ta-badge-orange";
  return "ta-badge-red";
}

// Shared circular avatar — used for Student photo and Trainer photo
// previews/thumbnails everywhere in the portal. Falls back to a plain
// user icon when no photo has been uploaded yet.
function Avatar({ src, alt, size = 34 }) {
  const dim = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        style={{
          ...dim,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--ta-border, #d9d9d9)",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        ...dim,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ta-bg-muted, #f0f0f0)",
        color: "var(--ta-text-muted, #999)",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <Icon path={ICONS.user} size={Math.round(size * 0.55)} />
    </div>
  );
}

// Reads an <input type="file"> image and hands back a base64 data URL via
// callback. Used by both the student and trainer photo upload fields.
function readImageAsDataUrl(file, onLoaded, onError) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    onError?.("Please choose an image file");
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    onError?.("Image must be smaller than 3MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoaded(reader.result);
  reader.onerror = () => onError?.("Could not read image");
  reader.readAsDataURL(file);
}

// Small reusable "upload photo" control: circular preview + file input +
// remove button. Shared by StudentFormModal and TrainerFormModal.
function PhotoUploadField({ label = "Photo", value, onChange }) {
  const [error, setError] = useState("");
  const inputId = useRef(`photo-upload-${Math.random().toString(36).slice(2)}`).current;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setError("");
    readImageAsDataUrl(
      file,
      (dataUrl) => onChange(dataUrl),
      (msg) => setError(msg)
    );
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="ta-filter-field">
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar src={value} alt={label} size={48} />
        <label
          htmlFor={inputId}
          className="ta-btn-outline"
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Icon path={ICONS.camera} size={14} />
          {value ? "Change" : "Upload"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        {value && (
          <button
            type="button"
            className="ta-icon-action"
            title="Remove photo"
            aria-label="Remove photo"
            onClick={() => onChange("")}
          >
            <Icon path={ICONS.trash} size={14} />
          </button>
        )}
      </div>
      {error && <p className="ta-field-error-msg">{error}</p>}
    </div>
  );
}

/* =========================================================================
   CustomSelect — one reusable dropdown used everywhere a styled <select>
   is needed (Filters modal, Updation page). Replaces what used to be two
   near-identical components (FilterSelect + UpdationDropdown).
   ========================================================================= */
function CustomSelect({ label, value, placeholder, options, onChange, allowClear = true }) {
  const [open, setOpen] = useState(false);
  const shownPlaceholder = placeholder || label;

  return (
    <div className="ta-filter-field">
      {label && <label>{label}</label>}
      <div
        className="ta-select-wrap"
        onClick={() => setOpen((p) => !p)}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((p) => !p);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className={value ? "" : "ta-select-placeholder"}>{value || shownPlaceholder}</span>
        <Icon path={ICONS.chevronDown} size={15} />
        {open && (
          <>
            <div className="ta-select-backdrop" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <div className="ta-select-menu" role="listbox">
              {allowClear && (
                <div
                  className="ta-select-option ta-select-option-clear"
                  onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
                >
                  {shownPlaceholder}
                </div>
              )}
              {options.length === 0 && <div className="ta-select-empty">No options</div>}
              {options.map((opt) => (
                <div
                  key={opt}
                  className="ta-select-option"
                  role="option"
                  aria-selected={value === opt}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FiltersModal({ onClose, onApply, initialValues }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close filters">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>{FILTER_FIELDS[0].label}</label>
            <div className="ta-date-range-wrap">
              <input
                type="date"
                aria-label="Start date"
                value={values.startDate || ""}
                onChange={(e) => setField("startDate", e.target.value)}
              />
              <span style={{ color: "var(--ta-text-muted)", fontSize: "11px" }}>to</span>
              <input
                type="date"
                aria-label="End date"
                value={values.endDate || ""}
                onChange={(e) => setField("endDate", e.target.value)}
              />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>

          {FILTER_FIELDS.slice(1).map((field) => (
            <CustomSelect
              key={field.key}
              label={field.label}
              value={values[field.key]}
              options={field.options}
              onChange={(val) => setField(field.key, val)}
            />
          ))}
        </div>

        <div className="ta-modal-footer">
          <button
            className="ta-btn-outline"
            onClick={() => {
              setValues({});
              onApply({});
            }}
          >
            Reset
          </button>
          <button className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="ta-btn-primary"
            onClick={() => {
              onApply(values);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentFormModal({ title, initialValues, onClose, onSave, saving, serverError }) {
  const [form, setForm] = useState(initialValues || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  useEscapeKey(onClose);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateStudentForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(form);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ta-modal-header">
          <h3>{title}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          <PhotoUploadField label="Student Photo" value={form.photo} onChange={(val) => set("photo", val)} />

          <div className="ta-filter-field">
            <label>Roll Number</label>
            <input
              className="ta-form-input"
              value={form.rollNumber}
              onChange={(e) => set("rollNumber", e.target.value)}
              placeholder="Leave blank to auto-generate"
            />
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Blank chor dein to unique roll number khud generate ho jayega.
            </p>
          </div>

          <div className="ta-filter-field">
            <label>Student name *</label>
            <input className="ta-form-input" required value={form.studentName} onChange={(e) => set("studentName", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Father name *</label>
            <input className="ta-form-input" required value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>CNIC *</label>
            <input
              className={`ta-form-input ${errors.cnic ? "ta-form-input-error" : ""}`}
              required
              value={form.cnic}
              onChange={(e) => set("cnic", e.target.value)}
              placeholder="00000-0000000-0"
            />
            {errors.cnic && <p className="ta-field-error-msg">{errors.cnic}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Phone *</label>
            <input
              className={`ta-form-input ${errors.phone ? "ta-form-input-error" : ""}`}
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="03XX-XXXXXXX"
            />
            {errors.phone && <p className="ta-field-error-msg">{errors.phone}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Country</label>
            <select className="ta-form-select" value={form.country} onChange={(e) => set("country", e.target.value)}>
              {COUNTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={form.city} onChange={(e) => set("city", e.target.value)}>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Campus</label>
            <select className="ta-form-select" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
              {CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Course</label>
            <select className="ta-form-select" value={form.course} onChange={(e) => set("course", e.target.value)}>
              {COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Batch</label>
            <select className="ta-form-select" value={form.batch} onChange={(e) => set("batch", e.target.value)}>
              {BATCHES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Slot</label>
            <select className="ta-form-select" value={form.slot} onChange={(e) => set("slot", e.target.value)}>
              {SLOTS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Status</label>
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Payment Status</label>
            <select className="ta-form-select" value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)}>
              {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Gender</label>
            <select className="ta-form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Laptop</label>
            <select className="ta-form-select" value={form.laptop} onChange={(e) => set("laptop", e.target.value)}>
              {LAPTOP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {serverError && (
            <div className="ta-error" role="alert" style={{ gridColumn: "1 / -1" }}>
              {serverError}
            </div>
          )}
        </div>

        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function ViewStudentModal({ student, onClose }) {
  useEscapeKey(onClose);
  const FIELDS = [
    ["Roll Number", student.rollNumber],
    ["Admission No", student.admissionNo],
    ["Student name", student.studentName],
    ["Father name", student.fatherName],
    ["CNIC", student.cnic],
    ["Phone", student.phone],
    ["Country", student.country],
    ["City", student.city],
    ["Campus", student.campus],
    ["Course", student.course],
    ["Batch", student.batch],
    ["Slot", student.slot],
    ["Status", student.status],
    ["Payment Status", student.paymentStatus],
    ["Gender", student.gender],
    ["Laptop", student.laptop],
  ];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-view-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Student details">
        <div className="ta-modal-header">
          <h3>Student Details</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 4px" }}>
          <Avatar src={student.photo} alt={student.studentName} size={84} />
        </div>
        <div className="ta-view-grid">
          {FIELDS.map(([label, val]) => (
            <div className="ta-view-row" key={label}>
              <span className="ta-view-label">{label}</span>
              <span className="ta-view-value">{val || "—"}</span>
            </div>
          ))}
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function PaymentsModal({ student, onClose, onGenerate, onMarkPaid }) {
  const [month, setMonth] = useState("");
  useEscapeKey(onClose);

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-payments-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Payments for ${student.studentName}`}>
        <div className="ta-modal-header">
          <h3>Payments — {student.studentName}</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-table-wrap ta-payments-table-wrap">
          <table className="ta-table">
            <thead>
              <tr>
                <th>Invoice number</th>
                <th>JazzCash ID</th>
                <th>Type</th>
                <th>Month</th>
                <th>Due date</th>
                <th>Amount (Rs)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {student.invoices.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="ta-empty-state">
                      <Icon path={ICONS.inbox} size={36} />
                      <p>No invoices yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                student.invoices.map((inv, i) => (
                  <tr key={i}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{inv.jazzCashId || "—"}</td>
                    <td>{inv.type}</td>
                    <td>{inv.month}</td>
                    <td>{inv.dueDate}</td>
                    <td>{inv.amount}</td>
                    <td>
                      <span className={`ta-badge ${inv.status === "PAID" ? "ta-badge-green" : "ta-badge-orange"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      {inv.status !== "PAID" && (
                        <button
                          type="button"
                          className="ta-icon-action"
                          title="Mark as paid"
                          aria-label="Mark as paid"
                          onClick={() => onMarkPaid(i)}
                        >
                          <Icon path={ICONS.check} size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ta-modal-body ta-payments-generate-row">
          <div className="ta-filter-field" style={{ flex: 1 }}>
            <label>Select month</label>
            <div className="ta-date-range-wrap">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
        </div>

        <div className="ta-modal-footer ta-payments-footer">
          <button
            type="button"
            className="ta-btn-primary ta-generate-btn"
            disabled={!month}
            onClick={() => {
              if (!month) return;
              onGenerate(month);
              setMonth("");
            }}
          >
            GENERATE
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmPopover({ message, onCancel, onConfirm }) {
  useEscapeKey(onCancel);
  return (
    <div className="ta-confirm-popover" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
      <div className="ta-confirm-popover-msg">
        <Icon path={ICONS.alert} size={15} />
        <span>{message}</span>
      </div>
      <div className="ta-confirm-popover-actions">
        <button className="ta-btn-outline ta-confirm-btn-sm" onClick={onCancel}>Cancel</button>
        <button className="ta-btn-primary ta-confirm-btn-sm" onClick={onConfirm}>OK</button>
      </div>
    </div>
  );
}

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { toasts, showToast } = useToasts();

  const [formModal, setFormModal] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [paymentsStudent, setPaymentsStudent] = useState(null);
  const [confirmFor, setConfirmFor] = useState(null);

  // ---- Load students from MongoDB (via backend API) on mount ----
  useEffect(() => {
    let cancelled = false;

    const loadStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/students`);
        const data = await response.json();
        if (!cancelled) {
          if (response.ok && Array.isArray(data) && data.length > 0) {
            setStudents(data);
          } else if (response.ok && Array.isArray(data)) {
            // DB reachable but empty -> fall back to demo rows so the UI
            // isn't blank; these won't exist in Mongo until re-added.
            setStudents(SEED_STUDENTS);
          } else {
            setStudents(SEED_STUDENTS);
          }
        }
      } catch (error) {
        console.error("Failed to load students from API", error);
        if (!cancelled) setStudents(SEED_STUDENTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStudents();
    return () => {
      cancelled = true;
    };
  }, []);

  const matchesFilters = (s) => {
    const f = appliedFilters;
    if (f.country && s.country !== f.country) return false;
    if (f.city && s.city !== f.city) return false;
    if (f.campus && s.campus !== f.campus) return false;
    if (f.course && s.course !== f.course) return false;
    if (f.batch && s.batch !== f.batch) return false;
    if (f.slot && s.slot !== f.slot) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.laptop && s.laptop !== f.laptop) return false;
    if (f.paymentStatus && s.paymentStatus !== f.paymentStatus) return false;
    if (f.gender && s.gender !== f.gender) return false;
    return true;
  };

  const matchesSearch = (s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return [s.admissionNo, s.rollNumber, s.studentName, s.fatherName, s.cnic, s.phone, s.course]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q));
  };

  const filteredRows = students.filter((s) => matchesFilters(s) && matchesSearch(s));
  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const runSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleExport = () => {
    const header = TABLE_COLUMNS.filter((c) => c !== "Action" && c !== "Photo").join(",");
    const lines = filteredRows.map((s) =>
      [s.rollNumber, s.studentName, s.fatherName, s.cnic, s.phone, s.course, s.status, s.paymentStatus]
        .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Export downloaded");
  };

  // ---- Add student: POST to MongoDB cluster via backend API ----
  const handleAddStudent = async (form) => {
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoices: [] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save student");
      }
      setStudents((prev) => [data, ...prev]);
      setFormModal(null);
      showToast("Student added");
    } catch (error) {
      console.error("Add student error:", error);
      setFormError(error.message || "Could not add student");
      showToast(error.message || "Could not add student", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Edit student: PUT to MongoDB cluster via backend API ----
  const handleEditStudent = async (form) => {
    const target = formModal.student;
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/students/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update student");
      }
      setStudents((prev) => prev.map((s) => (s.id === target.id ? data : s)));
      setFormModal(null);
      showToast("Student updated");
    } catch (error) {
      console.error("Edit student error:", error);
      setFormError(error.message || "Could not update student");
      showToast(error.message || "Could not update student", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Delete student: DELETE from MongoDB cluster via backend API ----
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student");
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setConfirmFor(null);
      showToast("Student deleted");
    } catch (error) {
      console.error("Delete student error:", error);
      showToast(error.message || "Could not delete student", "error");
    }
  };

  const handleSendEmail = () => {
    setConfirmFor(null);
    showToast("Email sent");
  };

  const handleDownloadRow = (s) => {
    showToast(`Downloaded record for ${s.studentName}`);
  };

  // ---- Generate invoice: PUT updated invoices array to MongoDB ----
  const handleGenerateInvoice = async (month) => {
    if (!paymentsStudent) return;
    const newInvoice = {
      invoiceNumber: paymentsStudent.admissionNo,
      jazzCashId: "",
      type: "Registration",
      month,
      dueDate: "10-" + month,
      amount: 1000,
      status: "PENDING",
    };
    const updatedInvoices = [...paymentsStudent.invoices, newInvoice];

    try {
      const response = await fetch(`${API_URL}/api/students/${paymentsStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: updatedInvoices, paymentStatus: "Pending" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate invoice");
      }
      setStudents((prev) => prev.map((s) => (s.id === paymentsStudent.id ? data : s)));
      setPaymentsStudent(data);
      showToast("Invoice generated");
    } catch (error) {
      console.error("Generate invoice error:", error);
      showToast(error.message || "Could not generate invoice", "error");
    }
  };

  // ---- Mark invoice paid: PUT updated invoices array to MongoDB ----
  const handleMarkPaid = async (invIdx) => {
    if (!paymentsStudent) return;
    const updatedInvoices = paymentsStudent.invoices.map((inv, i) =>
      i === invIdx ? { ...inv, status: "PAID" } : inv
    );

    try {
      const response = await fetch(`${API_URL}/api/students/${paymentsStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: updatedInvoices, paymentStatus: "Paid" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update invoice");
      }
      setStudents((prev) => prev.map((s) => (s.id === paymentsStudent.id ? data : s)));
      setPaymentsStudent(data);
      showToast("Marked as paid");
    } catch (error) {
      console.error("Mark paid error:", error);
      showToast(error.message || "Could not mark as paid", "error");
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="View options" aria-label="View options">
          <Icon path={ICONS.sliders} size={16} />
        </button>

        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>

        <input
          className="ta-search-input"
          type="text"
          placeholder="Search"
          aria-label="Search students"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />

        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
        <button className="ta-btn-primary" onClick={handleExport}>Export</button>
        <button
          className="ta-btn-primary ta-add-new-btn"
          onClick={() => { setFormError(""); setFormModal({ mode: "add" }); }}
        >
          <Icon path={ICONS.plus} size={15} />
          Add new
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length}>
                  <div className="ta-empty-state">
                    <p>Loading students…</p>
                  </div>
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((s) => (
                <tr key={s.id}>
                  <td><Avatar src={s.photo} alt={s.studentName} size={32} /></td>
                  <td><span className="ta-badge ta-badge-blue">{s.rollNumber || "—"}</span></td>
                  <td><span className="ta-link-text">{s.studentName}</span></td>
                  <td>{s.fatherName}</td>
                  <td>{s.cnic}</td>
                  <td>{s.phone}</td>
                  <td>{s.course}</td>
                  <td>
                    <span className={`ta-badge ${statusBadgeClass(s.status)}`}>
                      {s.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`ta-badge ${paymentBadgeClass(s.paymentStatus)}`}>
                      {s.paymentStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="ta-action-row">
                      <button className="ta-icon-action" title="View" aria-label={`View ${s.studentName}`} onClick={() => setViewStudent(s)}>
                        <Icon path={ICONS.eye} size={15} />
                      </button>
                      <button className="ta-icon-action" title="Payments" aria-label={`Payments for ${s.studentName}`} onClick={() => setPaymentsStudent(s)}>
                        <Icon path={ICONS.receipt} size={15} />
                      </button>
                      <button
                        className="ta-icon-action"
                        title="Edit"
                        aria-label={`Edit ${s.studentName}`}
                        onClick={() => { setFormError(""); setFormModal({ mode: "edit", student: s }); }}
                      >
                        <Icon path={ICONS.pencil} size={15} />
                      </button>
                      <div className="ta-action-popover-anchor">
                        <button
                          className="ta-icon-action"
                          title="Send email"
                          aria-label={`Send email to ${s.studentName}`}
                          onClick={() => setConfirmFor({ id: s.id, action: "send" })}
                        >
                          <Icon path={ICONS.send} size={15} />
                        </button>
                        {confirmFor?.id === s.id && confirmFor.action === "send" && (
                          <ConfirmPopover
                            message="Sure to send email again?"
                            onCancel={() => setConfirmFor(null)}
                            onConfirm={handleSendEmail}
                          />
                        )}
                      </div>
                      <button className="ta-icon-action" title="Download" aria-label={`Download record for ${s.studentName}`} onClick={() => handleDownloadRow(s)}>
                        <Icon path={ICONS.download} size={15} />
                      </button>
                      <div className="ta-action-popover-anchor">
                        <button
                          className="ta-icon-action ta-icon-action-danger"
                          title="Delete"
                          aria-label={`Delete ${s.studentName}`}
                          onClick={() => setConfirmFor({ id: s.id, action: "delete" })}
                        >
                          <Icon path={ICONS.trash} size={15} />
                        </button>
                        {confirmFor?.id === s.id && confirmFor.action === "delete" && (
                          <ConfirmPopover
                            message="Delete this student?"
                            onCancel={() => setConfirmFor(null)}
                            onConfirm={() => handleDelete(s.id)}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="ta-pagination">
          <span className="ta-pagination-info">
            {startIdx}-{endIdx} of {totalItems} items
          </span>
          <div className="ta-pagination-controls">
            <button
              className="ta-page-btn"
              disabled={safePage <= 1}
              aria-label="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <Icon path={ICONS.chevronLeft} size={14} />
            </button>
            <span className="ta-page-current">{safePage}</span>
            <button
              className="ta-page-btn"
              disabled={safePage >= totalPages}
              aria-label="Next page"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <Icon path={ICONS.chevronRight} size={14} />
            </button>
            <select
              className="ta-page-size-select"
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      )}

      {filtersOpen && (
        <FiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={(vals) => { setAppliedFilters(vals); setPage(1); }}
        />
      )}

      {formModal?.mode === "add" && (
        <StudentFormModal
          title="Add New Student"
          initialValues={EMPTY_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAddStudent}
          saving={formSaving}
          serverError={formError}
        />
      )}

      {formModal?.mode === "edit" && (
        <StudentFormModal
          title="Edit Student"
          initialValues={formModal.student}
          onClose={() => setFormModal(null)}
          onSave={handleEditStudent}
          saving={formSaving}
          serverError={formError}
        />
      )}

      {viewStudent && (
        <ViewStudentModal student={viewStudent} onClose={() => setViewStudent(null)} />
      )}

      {paymentsStudent && (
        <PaymentsModal
          student={paymentsStudent}
          onClose={() => setPaymentsStudent(null)}
          onGenerate={handleGenerateInvoice}
          onMarkPaid={handleMarkPaid}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CLASS_WEEKDAYS = [2, 4]; // Tuesday & Thursday are scheduled class days

function pad2(n) { return String(n).padStart(2, "0"); }
function toYMD(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekdayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
function isSameYMD(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

/* ---------------------------------------------------------------
   Trainer directory + Trainer attendance (scan card / view / request)
------------------------------------------------------------------ */

const TRAINER_STATUS_OPTIONS = ["Active", "Inactive"];

const TRAINERS_FULL_LIST = [
  {
    id: 1,
    name: "Sir Rajesh Kumar(SUK)",
    email: "rajesh.kumar@titan.edu",
    employeeId: "15354",
    photo: "",
    courses: ["Web Development"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM",
    status: "Active",
  },
  {
    id: 2,
    name: "Miss Maham",
    email: "maham@titan.edu",
    employeeId: "15360",
    photo: "",
    courses: ["Graphic Designing"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    status: "Active",
  },
  {
    id: 3,
    name: "Sir ARSLAN AHMED (SUK)",
    email: "arslan.ahmed@titan.edu",
    employeeId: "15349",
    photo: "",
    courses: ["Artificial Intelligence and Data Science"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    status: "Active",
  },
];

const SEED_TRAINER_ATTENDANCE = [
  {
    id: 1,
    employeeId: "15354",
    trainerName: "Sir Rajesh Kumar(SUK)",
    slotSchedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-12T12:28:00",
    checkOut: "2026-04-12T16:36:00",
    lateMinutes: 28,
    status: "default",
  },
  {
    id: 2,
    employeeId: "15360",
    trainerName: "Miss Maham",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-12T08:03:00",
    checkOut: "2026-04-12T11:10:00",
    lateMinutes: 3,
    status: "default",
  },
  {
    id: 3,
    employeeId: "15360",
    trainerName: "Miss Maham",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-11T08:04:00",
    checkOut: "",
    lateMinutes: 4,
    status: "default",
  },
];

const SEED_TRAINER_ATTENDANCE_REQUESTS = [];

function parseScheduleTimes(schedule) {
  if (!schedule) return [];
  const parts = schedule.split("|").map((p) => p.trim());
  const times = [];
  parts.forEach((part) => {
    const match = part.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i);
    if (match) times.push({ start: match[1], end: match[2] });
  });
  return times;
}

function to24hMinutes(t) {
  const m = t.trim().match(/(\d{1,2}):(\d{2})\s?([AP]M)/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function isWithinCheckInWindow(schedule, now = new Date()) {
  const times = parseScheduleTimes(schedule);
  if (times.length === 0) return true;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return times.some(({ start }) => {
    const startMin = to24hMinutes(start);
    if (startMin == null) return false;
    // allow check-in from 30 min before to 90 min after the scheduled start
    return nowMinutes >= startMin - 30 && nowMinutes <= startMin + 90;
  });
}

function formatDateTimeLabel(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const min = pad2(d.getMinutes());
  return `${weekday}, ${month} ${d.getDate()}, ${d.getFullYear()}, ${pad2(h)}:${min} ${ampm}`;
}

function durationLabel(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0m";
  const diffMs = new Date(checkOut) - new Date(checkIn);
  if (diffMs <= 0) return "0m";
  const totalMin = Math.round(diffMs / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function attendanceStats(record) {
  const present = record.presentDates.length;
  const leave = record.leaveDates.length;
  const absent = Math.max(0, record.totalClasses - present - leave);
  const percentage = record.totalClasses > 0 ? ((present + leave) / record.totalClasses) * 100 : 0;
  return { present, leave, absent, percentage };
}

function dayStatus(record, dateStr, dateObj) {
  if (record.presentDates.includes(dateStr)) return "present";
  if (record.leaveDates.includes(dateStr)) return "leave";
  const weekday = dateObj.getDay();
  if (CLASS_WEEKDAYS.includes(weekday) && dateObj <= TODAY_REF) return "absent";
  return "none";
}

function LeaveReasonModal({ onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  useEscapeKey(onCancel);

  return (
    <div className="ta-modal-overlay" onClick={onCancel}>
      <div className="ta-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Reason for leave">
        <div className="ta-modal-header">
          <h3>Reason for leave</h3>
          <button className="ta-modal-close" onClick={onCancel} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <input
            className="ta-form-input"
            autoFocus
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="ta-btn-primary" onClick={() => onConfirm(reason)}>Ok</button>
        </div>
      </div>
    </div>
  );
}

function AttendanceDetailsModal({ record, onClose, onMarkLeave }) {
  const [viewMode, setViewMode] = useState("Month");
  const [year, setYear] = useState(TODAY_REF.getFullYear());
  const [month, setMonth] = useState(TODAY_REF.getMonth());
  const [pendingDate, setPendingDate] = useState(null);
  useEscapeKey(onClose);

  const stats = attendanceStats(record);

  const cells = [];
  const firstWeekday = firstWeekdayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-attendance-details-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Attendance details">
        <div className="ta-modal-header">
          <h3>Attendance Details</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body ta-attendance-details-body">
          <div className="ta-attendance-identity-row">
            <span><strong>Student Name:</strong> {record.studentName}</span>
            <span><strong>Roll Number:</strong> {record.rollNumber}</span>
          </div>

          <div className="ta-attendance-summary-cards">
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Total Classes</p>
              <p className="ta-attendance-summary-value">{record.totalClasses}</p>
            </div>
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Present · Leave · Absent</p>
              <p className="ta-attendance-summary-value ta-attendance-summary-pla">
                <span className="ta-pla-present">{stats.present}</span>
                <span className="ta-pla-sep">/</span>
                <span className="ta-pla-leave">{stats.leave}</span>
                <span className="ta-pla-sep">/</span>
                <span className="ta-pla-absent">{stats.absent}</span>
              </p>
            </div>
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Attendance %</p>
              <p className="ta-attendance-summary-value">{stats.percentage.toFixed(2)}%</p>
            </div>
          </div>

          <div className="ta-attendance-calendar-toolbar">
            <div className="ta-attendance-month-nav">
              <button className="ta-icon-action" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                <Icon path={ICONS.chevronLeft} size={14} />
              </button>
              <select className="ta-form-select" aria-label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="ta-form-select" aria-label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m.slice(0, 3)}</option>)}
              </select>
              <button className="ta-icon-action" aria-label="Next month" onClick={() => changeMonth(1)}>
                <Icon path={ICONS.chevronRight} size={14} />
              </button>
            </div>
            <div className="ta-attendance-view-toggle-group">
              <button
                className={`ta-view-toggle-btn ${viewMode === "Month" ? "active" : ""}`}
                onClick={() => setViewMode("Month")}
              >
                Month
              </button>
              <button
                className={`ta-view-toggle-btn ${viewMode === "Year" ? "active" : ""}`}
                onClick={() => setViewMode("Year")}
              >
                Year
              </button>
            </div>
          </div>

          {viewMode === "Month" ? (
            <>
              <div className="ta-cal-grid">
                {WEEKDAY_LABELS.map((w) => (
                  <div key={w} className="ta-cal-weekday-lbl">{w}</div>
                ))}
                {cells.map((d, idx) => {
                  if (!d) return <div key={idx} />;
                  const dateStr = toYMD(year, month, d);
                  const dateObj = new Date(year, month, d);
                  const status = dayStatus(record, dateStr, dateObj);
                  const clickable = status === "absent";
                  const isToday = isSameYMD(dateObj, TODAY_REF);
                  const classNames = [
                    "ta-cal-cell",
                    `ta-cal-cell-${status}`,
                    clickable ? "ta-cal-cell-clickable" : "",
                    isToday ? "ta-cal-cell-today" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <div
                      key={idx}
                      className={classNames}
                      onClick={() => clickable && setPendingDate(dateStr)}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      title={isToday ? "Today" : undefined}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <p className="ta-attendance-cal-hint">Click a red (absent) day to mark it as leave.</p>
            </>
          ) : (
            <div className="ta-table-wrap">
              <table className="ta-table">
                <thead>
                  <tr><th>Month</th><th>Present</th><th>Leave</th></tr>
                </thead>
                <tbody>
                  {MONTH_NAMES.map((m, i) => {
                    const monthPresent = record.presentDates.filter((ds) => Number(ds.split("-")[0]) === year && Number(ds.split("-")[1]) - 1 === i).length;
                    const monthLeave = record.leaveDates.filter((ds) => Number(ds.split("-")[0]) === year && Number(ds.split("-")[1]) - 1 === i).length;
                    if (monthPresent === 0 && monthLeave === 0) return null;
                    return (
                      <tr key={m}>
                        <td>{m}</td>
                        <td>{monthPresent}</td>
                        <td>{monthLeave}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pendingDate && (
        <LeaveReasonModal
          onCancel={() => setPendingDate(null)}
          onConfirm={(reason) => {
            onMarkLeave(record.rollNumber, pendingDate, reason);
            setPendingDate(null);
          }}
        />
      )}
    </div>
  );
}

function MarkAttendancePage() {
  const [rollInput, setRollInput] = useState("");
  const [studentInfo, setStudentInfo] = useState(null); // { student, history, error }
  const [feed, setFeed] = useState([]); // recent marks, newest first
  const [marking, setMarking] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Mark attendance: POST to MongoDB, then pull the roll number's
  // recent history back so the panel reflects real saved records. ----
  const handleMark = async () => {
    const roll = rollInput.trim();
    if (!roll || marking) return;
    setMarking(true);

    try {
      const response = await fetch(`${API_URL}/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: roll }),
      });
      const data = await response.json();

      if (!response.ok) {
        // 404 = no such roll number, 409 = student exists but blocked status
        setStudentInfo({ student: data.student, error: data.message || "Could not mark attendance." });
        return;
      }

      const historyRes = await fetch(`${API_URL}/api/attendance/history/${encodeURIComponent(roll)}`);
      const historyData = await historyRes.json();
      const history = historyRes.ok && Array.isArray(historyData)
        ? historyData.map((r) => ({ label: `${r.date} — ${r.status === "leave" ? "Leave" : "Present"}` }))
        : [];

      setStudentInfo({ student: data.student, history, error: null });
      setFeed((prev) => [{ student: data.student, time: new Date() }, ...prev]);
      showToast(`Attendance marked for ${data.student.studentName}`);
      setRollInput("");
    } catch (error) {
      console.error("Mark attendance error:", error);
      setStudentInfo({ error: "Could not reach the server. Please try again." });
      showToast("Could not mark attendance", "error");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="ta-attendance-page">
      <div className="ta-attendance-grid">
        <div className="ta-attendance-main">
          <h3>Student Attendance</h3>

          <div className="ta-attendance-scan-input">
            <div className="ta-input-wrap">
              <Icon path={ICONS.search} size={15} />
              <input
                type="text"
                placeholder="Scan or Enter Roll Number..."
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMark()}
              />
            </div>
          </div>

          <button className="ta-btn-primary ta-mark-btn" onClick={handleMark} disabled={marking}>
            {marking ? "Marking…" : "Mark Attendance"}
          </button>

          <div className="ta-attendance-cards">
            <div className="ta-attendance-card">
              <h4 className="ta-attendance-card-title">Student Information</h4>
              {!studentInfo ? (
                <div className="ta-attendance-placeholder">
                  Scan or enter a roll number to view student details.
                </div>
              ) : studentInfo.error && !studentInfo.student ? (
                <div className="ta-attendance-placeholder ta-attendance-error">
                  {studentInfo.error}
                </div>
              ) : (
                <div className="ta-attendance-student">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Avatar src={studentInfo.student.photo} alt={studentInfo.student.studentName} size={64} />
                  </div>
                  <h4>{studentInfo.student.studentName}</h4>
                  <p className="ta-attendance-roll">Roll Number: {studentInfo.student.rollNumber}</p>
                  <p className="ta-attendance-course">{studentInfo.student.course}</p>
                  <p className="ta-attendance-payment">
                    Payment Status: {studentInfo.student.paymentStatus || "N/A"}
                  </p>

                  {studentInfo.error ? (
                    <div className="ta-attendance-invalid">{studentInfo.error}</div>
                  ) : (
                    <div className="ta-attendance-success">
                      <Icon path={ICONS.check} size={14} /> Attendance Marked
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ta-attendance-card">
              <h4 className="ta-attendance-card-title">Attendance History</h4>
              {!studentInfo || !studentInfo.student || !studentInfo.history?.length ? (
                <div className="ta-attendance-placeholder">No attendance history found.</div>
              ) : (
                <ul className="ta-attendance-history-list">
                  {studentInfo.history.map((h, i) => (
                    <li key={i}>{h.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="ta-attendance-feed-panel">
          {feed.length === 0 ? (
            <div className="ta-attendance-feed-empty">No recent scans yet.</div>
          ) : (
            <div className="ta-attendance-feed">
              {feed.map((f, i) => (
                <div className="ta-attendance-feed-item" key={i}>
                  <Avatar src={f.student.photo} alt={f.student.studentName} size={32} />
                  <div className="ta-attendance-feed-info">
                    <p className="ta-attendance-feed-name">
                      {f.student.studentName} ({f.student.rollNumber})
                    </p>
                    <p className="ta-attendance-feed-course">{f.student.course}</p>
                  </div>
                  <span className="ta-attendance-feed-time">a few seconds ago</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}

function ViewAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rollInput, setRollInput] = useState("");
  const [query, setQuery] = useState("");
  const [detailsFor, setDetailsFor] = useState(null);
  const { toasts, showToast } = useToasts();

  // ---- Load the per-student attendance summary from MongoDB on mount ----
  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/attendance/summary`);
        const data = await response.json();
        if (!cancelled && response.ok && Array.isArray(data)) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load attendance summary", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = records.filter(
    (r) =>
      !query.trim() ||
      r.rollNumber.includes(query.trim()) ||
      r.studentName.toLowerCase().includes(query.trim().toLowerCase())
  );

  const runSearch = () => setQuery(rollInput);

  // ---- Mark a specific absent day as leave: POST to MongoDB, then patch
  // local state (bump leave count / drop absent count) without a full reload. ----
  const handleMarkLeave = async (rollNumber, dateStr, reason) => {
    try {
      const response = await fetch(`${API_URL}/api/attendance/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, date: dateStr, reason }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark leave");
      }

      const patch = (r) =>
        r.rollNumber === rollNumber
          ? {
              ...r,
              leaveDates: [...r.leaveDates, dateStr],
              leave: r.leave + 1,
              absent: Math.max(0, r.absent - 1),
            }
          : r;

      setRecords((prev) => prev.map(patch));
      setDetailsFor((prev) => (prev && prev.rollNumber === rollNumber ? patch(prev) : prev));
      showToast("Marked as leave");
    } catch (error) {
      console.error("Mark leave error:", error);
      showToast(error.message || "Could not mark leave", "error");
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <input
          className="ta-search-input"
          type="text"
          placeholder="Search by roll number or name"
          aria-label="Search by roll number or name"
          value={rollInput}
          onChange={(e) => setRollInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Leave</th>
              <th>Absent</th>
              <th>Percentage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <div className="ta-empty-state">
                    <p>Loading attendance…</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const stats = attendanceStats(r);
                return (
                  <tr key={r.rollNumber}>
                    <td>{r.rollNumber}</td>
                    <td><span className="ta-link-text">{r.studentName}</span></td>
                    <td>{r.course}</td>
                    <td>{r.totalClasses}</td>
                    <td>{stats.present}</td>
                    <td>{stats.leave}</td>
                    <td>{stats.absent}</td>
                    <td>{stats.percentage.toFixed(2)}%</td>
                    <td>
                      <button className="ta-icon-action" title="View" aria-label={`View attendance for ${r.studentName}`} onClick={() => setDetailsFor(r)}>
                        <Icon path={ICONS.eye} size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detailsFor && (
        <AttendanceDetailsModal
          record={detailsFor}
          onClose={() => setDetailsFor(null)}
          onMarkLeave={handleMarkLeave}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ---- Trainers list page (Trainers > Trainers) ---- */

const EMPTY_TRAINER_FORM = {
  name: "",
  email: "",
  employeeId: "",
  photo: "",
  courses: COURSES[0],
  cities: CITIES[0],
  campus: CAMPUSES[0],
  slotSchedule: "",
  status: "Active",
};

function TrainerFormModal({ title, initialValues, onClose, onSave, saving, serverError }) {
  const [form, setForm] = useState(initialValues || EMPTY_TRAINER_FORM);
  useEscapeKey(onClose);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.employeeId.trim()) return;
    onSave(form);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ta-modal-header">
          <h3>{title}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <PhotoUploadField label="Trainer Photo" value={form.photo} onChange={(val) => set("photo", val)} />

          <div className="ta-filter-field">
            <label>Trainer name *</label>
            <input className="ta-form-input" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Email *</label>
            <input className="ta-form-input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Employee ID (Roll No) *</label>
            <input className="ta-form-input" required value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Course</label>
            <select className="ta-form-select" value={form.courses} onChange={(e) => set("courses", e.target.value)}>
              {COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={form.cities} onChange={(e) => set("cities", e.target.value)}>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Campus</label>
            <select className="ta-form-select" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
              {CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Slot Schedule</label>
            <input
              className="ta-form-input"
              placeholder="Sat 09:00 AM - 11:00 AM | Sun 09:00 AM - 11:00 AM"
              value={form.slotSchedule}
              onChange={(e) => set("slotSchedule", e.target.value)}
            />
          </div>
          <div className="ta-filter-field">
            <label>Status</label>
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {TRAINER_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {serverError && (
            <div className="ta-error" role="alert" style={{ gridColumn: "1 / -1" }}>
              {serverError}
            </div>
          )}
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function TrainersListPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { toasts, showToast } = useToasts();

  // ---- Load trainers from MongoDB (via backend API) on mount ----
  useEffect(() => {
    let cancelled = false;

    const loadTrainers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/trainers`);
        const data = await response.json();
        if (!cancelled) {
          if (response.ok && Array.isArray(data) && data.length > 0) {
            setTrainers(data);
          } else {
            // DB reachable but empty, or unreachable -> fall back to demo rows.
            setTrainers(TRAINERS_FULL_LIST);
          }
        }
      } catch (error) {
        console.error("Failed to load trainers from API", error);
        if (!cancelled) setTrainers(TRAINERS_FULL_LIST);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTrainers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = trainers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.employeeId.includes(q);
  });

  const runSearch = () => setSearchQuery(searchInput);
  const handleExport = () => showToast("Export downloaded");

  // ---- Add trainer: POST to MongoDB cluster via backend API ----
  const handleAdd = async (form) => {
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/trainers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courses: [form.courses], cities: [form.cities] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save trainer");
      }
      setTrainers((prev) => [data, ...prev]);
      setFormModal(null);
      showToast("Trainer added");
    } catch (error) {
      console.error("Add trainer error:", error);
      setFormError(error.message || "Could not add trainer");
      showToast(error.message || "Could not add trainer", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Edit trainer: PUT to MongoDB cluster via backend API ----
  const handleEdit = async (form) => {
    const target = formModal.trainer;
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/trainers/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courses: [form.courses], cities: [form.cities] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update trainer");
      }
      setTrainers((prev) => prev.map((t) => (t.id === target.id ? data : t)));
      setFormModal(null);
      showToast("Trainer updated");
    } catch (error) {
      console.error("Edit trainer error:", error);
      setFormError(error.message || "Could not update trainer");
      showToast(error.message || "Could not update trainer", "error");
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
        </button>
        <input
          className="ta-search-input"
          placeholder="Search"
          aria-label="Search trainers"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
        <button className="ta-btn-primary" onClick={handleExport}>Export</button>
        <button
          className="ta-btn-primary ta-add-new-btn"
          onClick={() => { setFormError(""); setFormModal({ mode: "add" }); }}
        >
          <Icon path={ICONS.plus} size={15} />
          Add new
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Trainer name</th>
              <th>Email</th>
              <th>Employee ID (Roll No)</th>
              <th>Courses</th>
              <th>Cities</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><p>Loading trainers…</p></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td><Avatar src={t.photo} alt={t.name} size={32} /></td>
                  <td><span className="ta-link-text">{t.name}</span></td>
                  <td>{t.email}</td>
                  <td><span className="ta-badge ta-badge-blue">{t.employeeId}</span></td>
                  <td>{(t.courses || []).join(", ")}</td>
                  <td>{(t.cities || []).join(", ")}</td>
                  <td><span className={`ta-badge ${t.status === "Active" ? "ta-badge-blue" : "ta-badge-gray"}`}>{t.status}</span></td>
                  <td>
                    <button
                      className="ta-icon-action"
                      title="Edit"
                      aria-label={`Edit ${t.name}`}
                      onClick={() => {
                        setFormError("");
                        setFormModal({
                          mode: "edit",
                          trainer: {
                            ...t,
                            courses: t.courses?.[0] || COURSES[0],
                            cities: t.cities?.[0] || CITIES[0],
                          },
                        });
                      }}
                    >
                      <Icon path={ICONS.pencil} size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <div className="ta-modal-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainer filters">
            <div className="ta-modal-header">
              <h3>Filters</h3>
              <button className="ta-modal-close" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <Icon path={ICONS.close} size={18} />
              </button>
            </div>
            <div className="ta-modal-body">
              <p style={{ fontSize: 13, color: "var(--ta-text-muted)" }}>
                Filter trainers by city, campus, course, or status.
              </p>
            </div>
            <div className="ta-modal-footer">
              <button className="ta-btn-primary" onClick={() => setFiltersOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {formModal?.mode === "add" && (
        <TrainerFormModal
          title="Add new trainer"
          initialValues={EMPTY_TRAINER_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAdd}
          saving={formSaving}
          serverError={formError}
        />
      )}
      {formModal?.mode === "edit" && (
        <TrainerFormModal
          title="Edit trainer"
          initialValues={formModal.trainer}
          onClose={() => setFormModal(null)}
          onSave={handleEdit}
          saving={formSaving}
          serverError={formError}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ---- Mark Trainer Attendance (Scan Trainer Card) ---- */

function MarkTrainerAttendancePage() {
  const [employeeId, setEmployeeId] = useState("");
  const [verifiedTrainer, setVerifiedTrainer] = useState(null);
  const [searched, setSearched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Verify: look the trainer up against the real MongoDB collection
  // instead of the hardcoded demo list. ----
  const handleVerify = async () => {
    const id = employeeId.trim();
    if (!id || verifying) return;
    setVerifying(true);
    try {
      const response = await fetch(`${API_URL}/api/trainers`);
      const data = await response.json();
      const trainer = response.ok && Array.isArray(data) ? data.find((t) => t.employeeId === id) : null;
      setVerifiedTrainer(trainer || null);
      setSearched(true);
    } catch (error) {
      console.error("Verify trainer error:", error);
      setVerifiedTrainer(null);
      setSearched(true);
      showToast("Could not reach the server", "error");
    } finally {
      setVerifying(false);
    }
  };

  // ---- Check in: POST creates a TrainerAttendance record in MongoDB.
  // Backend validates the check-in window and rejects a duplicate open check-in. ----
  const handleCheckIn = async () => {
    if (!verifiedTrainer || actionBusy) return;
    setActionBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: verifiedTrainer.employeeId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Check-in failed");
      }
      showToast(`Checked in: ${verifiedTrainer.name}`);
    } catch (error) {
      console.error("Trainer check-in error:", error);
      showToast(error.message || "Check-in failed", "error");
    } finally {
      setActionBusy(false);
    }
  };

  // ---- Check out: closes today's open TrainerAttendance record ----
  const handleCheckOut = async () => {
    if (!verifiedTrainer || actionBusy) return;
    setActionBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: verifiedTrainer.employeeId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Check-out failed");
      }
      showToast(`Checked out: ${verifiedTrainer.name}`);
    } catch (error) {
      console.error("Trainer check-out error:", error);
      showToast(error.message || "Check-out failed", "error");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-panel ta-trainer-scan-panel">
        <h3 style={{ marginBottom: 14 }}>Scan Trainer Card</h3>
        <div className="ta-trainer-scan-row">
          <div className="ta-trainer-scan-input-col">
            <input
              className="ta-form-input ta-full-width"
              placeholder="Scan or enter Employee ID"
              aria-label="Employee ID"
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <button className="ta-btn-primary ta-full-width ta-verify-btn" onClick={handleVerify} disabled={verifying}>
              {verifying ? "Verifying…" : "Verify Trainer"}
            </button>
          </div>

          <div className="ta-trainer-info-card">
            <p className="ta-trainer-info-title">Trainer Information</p>
            {!searched && (
              <p className="ta-trainer-info-placeholder">Scan or enter Employee ID to see trainer details</p>
            )}
            {searched && !verifiedTrainer && (
              <p className="ta-trainer-info-placeholder">Trainer not found</p>
            )}
            {verifiedTrainer && (
              <div className="ta-trainer-info-body">
                <div className="ta-trainer-avatar">
                  <Avatar src={verifiedTrainer.photo} alt={verifiedTrainer.name} size={56} />
                </div>
                <p className="ta-trainer-info-name">{verifiedTrainer.name}</p>
                <p className="ta-trainer-info-id">Employee ID: {verifiedTrainer.employeeId}</p>
                <div className="ta-trainer-info-actions">
                  <button className="ta-btn-primary" onClick={handleCheckIn} disabled={actionBusy}>
                    <Icon path={ICONS.refresh} size={14} /> Check In
                  </button>
                  <button className="ta-btn-outline ta-checkout-btn" onClick={handleCheckOut} disabled={actionBusy}>
                    <Icon path={ICONS.refresh} size={14} /> Check Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ---- View Trainer Attendance ---- */

function TrainerAttendanceFiltersModal({ onClose, onApply, initialValues, trainers }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const trainerList = trainers?.length ? trainers : TRAINERS_FULL_LIST;
  const trainerNames = trainerList.map((t) => t.name);
  const courseNames = [...new Set(trainerList.flatMap((t) => t.courses))];
  const scheduleOptions = [...new Set(trainerList.map((t) => t.slotSchedule))];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainer attendance filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={values.city || ""} onChange={(e) => set("city", e.target.value)}>
              <option value="">City</option>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Campus</label>
            <select className="ta-form-select" value={values.campus || ""} onChange={(e) => set("campus", e.target.value)}>
              <option value="">Campus</option>
              {CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Course</label>
            <select className="ta-form-select" value={values.course || ""} onChange={(e) => set("course", e.target.value)}>
              <option value="">Course</option>
              {courseNames.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Trainer</label>
            <select className="ta-form-select" value={values.trainer || ""} onChange={(e) => set("trainer", e.target.value)}>
              <option value="">Trainer</option>
              {trainerNames.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Slot Schedule</label>
            <select className="ta-form-select" value={values.slotSchedule || ""} onChange={(e) => set("slotSchedule", e.target.value)}>
              <option value="">Slot Schedule</option>
              {scheduleOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Start date  →  End date</label>
            <div className="ta-date-range-wrap">
              <input type="date" aria-label="Start date" value={values.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
              <span style={{ color: "var(--ta-text-muted)", fontSize: 11 }}>to</span>
              <input type="date" aria-label="End date" value={values.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-outline" onClick={() => { setValues({}); onApply({}); }}>Reset</button>
          <button className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button className="ta-btn-primary" onClick={() => { onApply(values); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function TrainerAttendanceEditModal({ record, onClose, onSave }) {
  const initialDate = record.checkIn ? record.checkIn.slice(0, 10) : toYMD(TODAY_REF.getFullYear(), TODAY_REF.getMonth(), TODAY_REF.getDate());
  const [date, setDate] = useState(initialDate);
  const [checkIn, setCheckIn] = useState(record.checkIn ? record.checkIn.slice(11, 16) : "");
  const [checkOut, setCheckOut] = useState(record.checkOut ? record.checkOut.slice(11, 16) : "");
  useEscapeKey(onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      checkIn: checkIn ? `${date}T${checkIn}:00` : record.checkIn,
      checkOut: checkOut ? `${date}T${checkOut}:00` : record.checkOut,
    });
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={`Edit attendance for ${record.trainerName}`}>
        <div className="ta-modal-header">
          <h3>Edit Attendance — {record.trainerName}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>Date</label>
            <div className="ta-date-range-wrap">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
          <div className="ta-filter-field">
            <label>Check In</label>
            <input className="ta-form-input" type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Check Out</label>
            <input className="ta-form-input" type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}

function ViewTrainerAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const { toasts, showToast } = useToasts();

  // ---- Load attendance records + trainer list (for filter dropdowns) from MongoDB ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [recRes, trainerRes] = await Promise.all([
          fetch(`${API_URL}/api/trainer-attendance`),
          fetch(`${API_URL}/api/trainers`),
        ]);
        const recData = await recRes.json();
        const trainerData = await trainerRes.json();
        if (!cancelled) {
          setRecords(recRes.ok && Array.isArray(recData) ? recData : SEED_TRAINER_ATTENDANCE);
          setTrainers(trainerRes.ok && Array.isArray(trainerData) ? trainerData : []);
        }
      } catch (error) {
        console.error("Failed to load trainer attendance", error);
        if (!cancelled) setRecords(SEED_TRAINER_ATTENDANCE);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const matchesFilters = (r) => {
    const f = appliedFilters;
    if (f.campus && r.campus !== f.campus) return false;
    if (f.trainer && r.trainerName !== f.trainer) return false;
    if (f.slotSchedule && r.slotSchedule !== f.slotSchedule) return false;
    return true;
  };

  const matchesSearch = (r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return r.trainerName.toLowerCase().includes(q) || r.employeeId.includes(q);
  };

  const filteredRows = records.filter((r) => matchesFilters(r) && matchesSearch(r));
  const runSearch = () => setSearchQuery(searchInput);
  const handleExport = () => showToast("Export downloaded");

  // ---- Save a correction: PUT to MongoDB ----
  const handleSaveEdit = async (updated) => {
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/${editRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update attendance");
      }
      setRecords((prev) => prev.map((r) => (r.id === editRecord.id ? data : r)));
      setEditRecord(null);
      showToast("Attendance updated");
    } catch (error) {
      console.error("Update trainer attendance error:", error);
      showToast(error.message || "Could not update attendance", "error");
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="View options" aria-label="View options">
          <Icon path={ICONS.sliders} size={16} />
        </button>
        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>
        <input
          className="ta-search-input"
          placeholder="Search"
          aria-label="Search trainer attendance"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
        <button className="ta-btn-primary" onClick={handleExport}>Export</button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Trainer</th>
              <th>Slot Schedule</th>
              <th>Campus</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><p>Loading attendance…</p></div></td></tr>
            ) : filteredRows.length === 0 ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              filteredRows.map((r) => (
                <tr key={r.id}>
                  <td><span className="ta-link-text">{r.trainerName}</span></td>
                  <td>{r.slotSchedule}</td>
                  <td>{r.campus}</td>
                  <td>
                    {formatDateTimeLabel(r.checkIn)}
                    {r.lateMinutes > 0 && <div className="ta-late-tag">Late: {r.lateMinutes}m</div>}
                  </td>
                  <td>{formatDateTimeLabel(r.checkOut)}</td>
                  <td>{durationLabel(r.checkIn, r.checkOut)}</td>
                  <td><span className="ta-badge ta-badge-gray">{r.status}</span></td>
                  <td>
                    <button className="ta-icon-action" title="Edit" aria-label={`Edit attendance for ${r.trainerName}`} onClick={() => setEditRecord(r)}>
                      <Icon path={ICONS.pencil} size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <TrainerAttendanceFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
          trainers={trainers}
        />
      )}

      {editRecord && (
        <TrainerAttendanceEditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ---- Trainer Attendance Request (correction requests) ---- */

function AttendanceRequestFormModal({ onClose, onSubmit, trainers, submitting }) {
  const [employeeId, setEmployeeId] = useState(trainers?.[0]?.employeeId || "");
  const [date, setDate] = useState(toYMD(TODAY_REF.getFullYear(), TODAY_REF.getMonth(), TODAY_REF.getDate()));
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");
  useEscapeKey(onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trainer = trainers?.find((t) => t.employeeId === employeeId);
    if (!trainer) return;
    onSubmit({ trainer, date, checkIn, checkOut, reason });
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label="Attendance request">
        <div className="ta-modal-header">
          <h3>Attendance Request</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>Trainer *</label>
            <select className="ta-form-select" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Select trainer</option>
              {(trainers || []).map((t) => (
                <option key={t.employeeId} value={t.employeeId}>{t.name} ({t.employeeId})</option>
              ))}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Date</label>
            <div className="ta-date-range-wrap">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
          <div className="ta-filter-field">
            <label>Check In</label>
            <input className="ta-form-input" type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Check Out</label>
            <input className="ta-form-input" type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Reason</label>
            <textarea
              className="ta-updation-textarea"
              style={{ minHeight: 80 }}
              placeholder="Enter reason for correction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary" disabled={submitting || !trainers?.length}>
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TrainerAttendanceRequestPage() {
  const [requests, setRequests] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [generateOpen, setGenerateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Load correction requests + trainer list from MongoDB ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [reqRes, trainerRes] = await Promise.all([
          fetch(`${API_URL}/api/trainer-attendance-requests`),
          fetch(`${API_URL}/api/trainers`),
        ]);
        const reqData = await reqRes.json();
        const trainerData = await trainerRes.json();
        if (!cancelled) {
          setRequests(reqRes.ok && Array.isArray(reqData) ? reqData : []);
          setTrainers(trainerRes.ok && Array.isArray(trainerData) ? trainerData : []);
        }
      } catch (error) {
        console.error("Failed to load attendance requests", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Submit a new correction request: POST to MongoDB ----
  const handleGenerate = async (vals) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: vals.trainer.id,
          trainerName: vals.trainer.name,
          campus: vals.trainer.campus,
          schedule: vals.trainer.slotSchedule,
          checkIn: vals.checkIn,
          checkOut: vals.checkOut,
          type: "Correction",
          status: "pending",
          reason: vals.reason,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }
      setRequests((prev) => [data, ...prev]);
      setGenerateOpen(false);
      showToast("Request submitted");
    } catch (error) {
      console.error("Submit attendance request error:", error);
      showToast(error.message || "Could not submit request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="View options" aria-label="View options">
          <Icon path={ICONS.sliders} size={16} />
        </button>
        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>
        <div style={{ flex: 1 }} />
        <button className="ta-btn-primary" onClick={() => showToast("Searched")}>Search</button>
        <button className="ta-btn-primary ta-generate-request-btn" onClick={() => setGenerateOpen(true)}>
          Generate Request
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}><input type="checkbox" aria-label="Select all requests" /></th>
              <th>Trainer</th>
              <th>Campus</th>
              <th>Schedule</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="ta-empty-state"><p>Loading requests…</p></div></td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={9}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td><input type="checkbox" aria-label={`Select request for ${r.trainerName}`} /></td>
                  <td>{r.trainerName}</td>
                  <td>{r.campus}</td>
                  <td>{r.schedule}</td>
                  <td>{r.checkIn || "—"}</td>
                  <td>{r.checkOut || "—"}</td>
                  <td>{r.type}</td>
                  <td><span className="ta-badge ta-badge-orange">{r.status}</span></td>
                  <td>—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <TrainerAttendanceFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
          trainers={trainers}
        />
      )}

      {generateOpen && (
        <AttendanceRequestFormModal
          onClose={() => setGenerateOpen(false)}
          trainers={trainers}
          submitting={submitting}
          onSubmit={handleGenerate}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

const SLOT_TRAINERS = ["Shehzad Iqbal", "Miss Muskan", "Shumaila Shiwani", "Miss Hanifa Asad", "Waqas Ahmed", "Sana Malik", "Faisal Raza"];
const SLOT_COURSES = [
  "Modern Web Application Development | Batch (1)",
  "AI & Game Creators | Batch (1)",
  "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)",
];
const SLOT_CAMPUSES = ["Bahria College 1 Majeed...", "Bahria College Hanif...", "Bahria Subh-e-Nau Se..."];
const FACILITY_OPTIONS = ["Lab", "Non-Lab"];
const SLOT_STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];
const ONLINE_OPTIONS = ["YES", "NO"];
const CERT_OPTIONS = ["FREE", "PAID"];

const SEED_SLOTS = [
  {
    id: 1,
    schedule: "Sat 11:00 PM - 01:00 AM",
    trainer: "Shehzad Iqbal",
    course: "Modern Web Application Development | Batch (1)",
    city: "Sukkur",
    campus: "Bahria College 1 Majeed...",
    enrolled: 15,
    capacity: 50,
    classType: "Lab",
    gender: "Male",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2025-08-01",
    endDate: "",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
  {
    id: 2,
    schedule: "Sat 09:00 AM - 11:00 AM",
    trainer: "Shehzad Iqbal",
    course: "Modern Web Application Development | Batch (1)",
    city: "Sukkur",
    campus: "Bahria College 1 Majeed...",
    enrolled: 19,
    capacity: 63,
    classType: "Lab",
    gender: "Female",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2025-08-01",
    endDate: "",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
  {
    id: 3,
    schedule: "Mon 09:00 AM - 11:00 AM",
    trainer: "Miss Muskan",
    course: "AI & Game Creators | Batch (1)",
    city: "Karachi",
    campus: "Bahria College Hanif...",
    enrolled: 0,
    capacity: 50,
    classType: "Lab",
    gender: "Female",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2026-06-08",
    endDate: "2026-08-01",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
  {
    id: 4,
    schedule: "Mon 11:00 AM - 01:00 PM",
    trainer: "Miss Muskan",
    course: "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)",
    city: "Karachi",
    campus: "Bahria College Hanif...",
    enrolled: 0,
    capacity: 70,
    classType: "Lab",
    gender: "Female",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2026-06-08",
    endDate: "2026-08-01",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
  {
    id: 5,
    schedule: "Mon 11:00 AM - 01:00 PM",
    trainer: "Shumaila Shiwani",
    course: "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)",
    city: "Lahore",
    campus: "Bahria Subh-e-Nau Se...",
    enrolled: 0,
    capacity: 80,
    classType: "Lab",
    gender: "Female",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2026-06-08",
    endDate: "2026-08-01",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
  {
    id: 6,
    schedule: "Tue 09:00 AM - 11:00 AM",
    trainer: "Miss Hanifa Asad",
    course: "AI & Game Creators | Batch (1)",
    city: "Karachi",
    campus: "Bahria College Hanif...",
    enrolled: 0,
    capacity: 60,
    classType: "Lab",
    gender: "Female",
    status: "ACTIVE",
    onlineOffline: "NO",
    startDate: "2026-06-08",
    endDate: "2026-06-10",
    cert: "FREE",
    hourlyRate: "",
    whatsappLink: "",
  },
];

const EMPTY_SLOT_FORM = {
  schedule: "",
  city: "",
  campus: SLOT_CAMPUSES[0],
  course: SLOT_COURSES[0],
  trainer: SLOT_TRAINERS[0],
  classType: FACILITY_OPTIONS[0],
  status: "ACTIVE",
  gender: GENDERS[0],
  startDate: "",
  endDate: "",
  onlineOffline: "NO",
  hourlyRate: "",
  cert: "Paid",
  whatsappLink: "",
  enrolled: 0,
  capacity: 50,
};

function formatSlotDate(d) {
  if (!d) return "—";
  const dateObj = new Date(d + "T00:00:00");
  return `${String(dateObj.getDate()).padStart(2, "0")} ${MONTH_NAMES[dateObj.getMonth()].slice(0, 3)} ${dateObj.getFullYear()}`;
}

function SlotFormModal({ title, initialValues, onClose, onSave }) {
  const [form, setForm] = useState(initialValues || EMPTY_SLOT_FORM);
  useEscapeKey(onClose);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal ta-slot-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ta-modal-header">
          <h3>{title}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          <div className="ta-slot-format-hint">
            Format: Mon 09:00 AM - 11:00 AM | Wed 09:00 AM - 11:00 AM | Fri 09:00 AM - 11:00 AM
          </div>

          <input
            className="ta-form-input ta-full-width"
            placeholder="schedule"
            value={form.schedule}
            onChange={(e) => set("schedule", e.target.value)}
          />

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.city} onChange={(e) => set("city", e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
              <option value="">Select campus</option>
              {SLOT_CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <select className="ta-form-select ta-full-width" value={form.course} onChange={(e) => set("course", e.target.value)}>
            <option value="">Select course</option>
            {SLOT_COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.trainer} onChange={(e) => set("trainer", e.target.value)}>
              <option value="">Select trainer</option>
              {SLOT_TRAINERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.classType} onChange={(e) => set("classType", e.target.value)}>
              <option value="">Class type</option>
              {FACILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="">Select status</option>
              {SLOT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select gender</option>
              {GENDERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="ta-slot-form-row">
            <input className="ta-form-input" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            <input className="ta-form-input" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.onlineOffline} onChange={(e) => set("onlineOffline", e.target.value)}>
              <option value="">Class Type</option>
              {ONLINE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              className="ta-form-input"
              type="number"
              min="0"
              placeholder="Trainer hourly rate"
              value={form.hourlyRate}
              onChange={(e) => set("hourlyRate", e.target.value)}
            />
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.cert} onChange={(e) => set("cert", e.target.value)}>
              <option value="Paid">Paid</option>
              <option value="Free">Free</option>
            </select>
            <input
              className="ta-form-input"
              placeholder="Whatsapp Group link"
              value={form.whatsappLink}
              onChange={(e) => set("whatsappLink", e.target.value)}
            />
          </div>

          <div className="ta-filter-field ta-full-width">
            <label>Capacity</label>
            <div className="ta-slot-capacity-row">
              <input
                type="range"
                min="0"
                max="200"
                aria-label="Capacity"
                value={form.capacity}
                onChange={(e) => set("capacity", Number(e.target.value))}
                className="ta-slot-capacity-slider"
              />
              <span className="ta-slot-capacity-value">{form.capacity}</span>
            </div>
          </div>
        </div>

        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

function SlotsFiltersModal({ onClose, onApply, initialValues }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const FIELDS = [
    { key: "trainer", label: "Trainer", options: SLOT_TRAINERS },
    { key: "course", label: "Course", options: SLOT_COURSES },
    { key: "campus", label: "Campus", options: SLOT_CAMPUSES },
    { key: "facility", label: "Facility", options: FACILITY_OPTIONS },
    { key: "gender", label: "Gender", options: GENDERS },
    { key: "status", label: "Status", options: SLOT_STATUS_OPTIONS },
    { key: "online", label: "Online", options: ONLINE_OPTIONS },
    { key: "cert", label: "Certificate", options: CERT_OPTIONS },
  ];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Slot filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          {FIELDS.map((f) => (
            <div className="ta-filter-field" key={f.key}>
              <label>{f.label}</label>
              <select className="ta-form-select" value={values[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">{f.label}</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="ta-modal-footer">
          <button className="ta-btn-outline" onClick={() => { setValues({}); onApply({}); }}>Reset</button>
          <button className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button className="ta-btn-primary" onClick={() => { onApply(values); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function SlotsPage() {
  const [slots, setSlots] = useState(SEED_SLOTS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [formModal, setFormModal] = useState(null);
  const { toasts, showToast } = useToasts();

  const matchesFilters = (s) => {
    const f = appliedFilters;
    if (f.trainer && s.trainer !== f.trainer) return false;
    if (f.course && s.course !== f.course) return false;
    if (f.campus && s.campus !== f.campus) return false;
    if (f.facility && s.classType !== f.facility) return false;
    if (f.gender && s.gender !== f.gender) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.online && s.onlineOffline !== f.online) return false;
    if (f.cert && s.cert !== f.cert) return false;
    return true;
  };

  const filteredRows = slots.filter(matchesFilters);

  const handleAdd = (form) => {
    setSlots((prev) => [{ id: nextId(prev), ...form }, ...prev]);
    setFormModal(null);
    showToast("Slot added");
  };

  const handleEdit = (form) => {
    setSlots((prev) => prev.map((s) => (s.id === formModal.slot.id ? { ...s, ...form } : s)));
    setFormModal(null);
    showToast("Slot updated");
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="Export" aria-label="Export slots">
          <Icon path={ICONS.download} size={16} />
        </button>

        <div style={{ flex: 1 }} />

        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>

        <button className="ta-btn-primary ta-add-new-btn" onClick={() => setFormModal({ mode: "add" })}>
          <Icon path={ICONS.plus} size={15} />
          Add new
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Schedule</th>
              <th>Trainer</th>
              <th>Course</th>
              <th>Campus</th>
              <th>Seats</th>
              <th>Facility</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Online</th>
              <th>Start</th>
              <th>End</th>
              <th>Cert.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((s) => (
                <tr key={s.id}>
                  <td>{s.schedule}</td>
                  <td>{s.trainer}</td>
                  <td>{s.course}</td>
                  <td>{s.campus}</td>
                  <td>{s.enrolled}/{s.capacity}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon path={ICONS.building} size={13} /> {s.classType}
                    </span>
                  </td>
                  <td>{s.gender}</td>
                  <td>
                    <span className={`ta-badge ${s.status === "ACTIVE" ? "ta-badge-blue" : "ta-badge-gray"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.onlineOffline}</td>
                  <td>{formatSlotDate(s.startDate)}</td>
                  <td>{formatSlotDate(s.endDate)}</td>
                  <td>
                    <span className={`ta-badge ${(s.cert || "").toUpperCase() === "FREE" ? "ta-badge-orange" : "ta-badge-green"}`}>
                      {s.cert}
                    </span>
                  </td>
                  <td>
                    <button className="ta-icon-action" title="Edit" aria-label={`Edit slot ${s.schedule}`} onClick={() => setFormModal({ mode: "edit", slot: s })}>
                      <Icon path={ICONS.pencil} size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <SlotsFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
        />
      )}

      {formModal?.mode === "add" && (
        <SlotFormModal
          title="Add new slot"
          initialValues={EMPTY_SLOT_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAdd}
        />
      )}

      {formModal?.mode === "edit" && (
        <SlotFormModal
          title="Edit slot"
          initialValues={formModal.slot}
          onClose={() => setFormModal(null)}
          onSave={handleEdit}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ---------------------------------------------------------------
   Updation page — bulk status update by comma-separated roll numbers
------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   Multi Attendance page — mark attendance in bulk for a given date by
   pasting comma-separated roll numbers (mirrors admin.saylanimit.com's
   /add-multi-attendance screen).
------------------------------------------------------------------ */

function toInputDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function MultiAttendancePage() {
  const [date, setDate] = useState(() => toInputDate(TODAY_REF));
  const [rollNumbers, setRollNumbers] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toasts, showToast } = useToasts();

  const canSubmit = date && rollNumbers.trim().length > 0 && !submitting;

  // ---- Bulk mark: POST the whole roll-number list to MongoDB in one call ----
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const numbers = rollNumbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    if (numbers.length === 0) {
      showToast("Please enter at least one roll number.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/attendance/mark-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, rollNumbers: numbers }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark attendance");
      }

      if (data.notFound?.length) {
        showToast(`Marked ${data.marked} · Not found: ${data.notFound.join(", ")}`, "error");
      } else {
        showToast(`Attendance marked for ${data.marked} student(s) on ${date}`);
      }
      setRollNumbers("");
    } catch (error) {
      console.error("Bulk mark attendance error:", error);
      showToast(error.message || "Could not mark attendance", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ta-updation-page">
      <form className="ta-updation-form ta-multi-attendance-form" onSubmit={handleUpdate}>
        <input
          className="ta-updation-input"
          type="date"
          aria-label="Attendance date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <textarea
          className="ta-updation-textarea ta-multi-attendance-roll"
          placeholder="Roll numbers example: 1122,1123,1124,1125"
          aria-label="Roll numbers"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
        />

        <button type="submit" className="ta-updation-submit" disabled={!canSubmit}>
          {submitting ? "UPDATING…" : "UPDATE"}
        </button>

        <p className="ta-updation-hint">
          Use this link for comma separated values{" "}
          <a href="https://arraythis.com" target="_blank" rel="noreferrer">
            https://arraythis.com
          </a>
        </p>
      </form>

      <ToastStack toasts={toasts} />
    </div>
  );
}

const UPDATION_TYPES = ["results"];

function UpdationPage() {
  const [type, setType] = useState("results");
  const [rollNumbers, setRollNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const { toasts, showToast } = useToasts();

  const canSubmit = rollNumbers.trim().length > 0 && !!status;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const numbers = rollNumbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    showToast(`Updated ${numbers.length} record(s) to "${status}"`);
    setRollNumbers("");
    setMessage("");
    setStatus("");
  };

  return (
    <div className="ta-updation-page">
      <form className="ta-updation-form" onSubmit={handleUpdate}>
        <CustomSelect
          value={type}
          placeholder="results"
          options={UPDATION_TYPES}
          onChange={setType}
          allowClear={false}
        />

        <textarea
          className="ta-updation-textarea ta-updation-roll"
          placeholder="Roll numbers example: 1122,1123,1124,1125"
          aria-label="Roll numbers"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
        />

        <input
          className="ta-updation-input"
          type="text"
          placeholder="Message"
          aria-label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <CustomSelect
          value={status}
          placeholder="Select status"
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />

        <button type="submit" className="ta-updation-submit" disabled={!canSubmit}>
          UPDATE
        </button>

        <p className="ta-updation-hint">
          Use this link for comma seprated values{" "}
          <a href="https://arraythis.com" target="_blank" rel="noreferrer">
            Text to Array Converter
          </a>
        </p>
      </form>

      <ToastStack toasts={toasts} />
    </div>
  );
}

const PERMISSION_GROUPS = [
  { key: "DASHBOARD", perms: ["READ"] },
  { key: "STUDENT", perms: ["READ", "UPDATE", "WRITE", "EXPORT"] },
  { key: "ATTENDANCE_VIEW", perms: ["READ", "UPDATE", "WRITE", "EXPORT"] },
  { key: "ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "UPDATION", perms: ["READ", "UPDATE", "WRITE"] },
  { key: "ADMINISTRATION_SLOT", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_VIEW", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_REQUEST", perms: ["READ", "WRITE", "UPDATE"] },
];

// Sub Admin gets a restricted permission set (mirrors the reference
// portal's limited-role profile: attendance + students + read-only trainers).
const SUB_ADMIN_PERMISSION_GROUPS = [
  { key: "ATTENDANCE_VIEW", perms: ["READ", "WRITE"] },
  { key: "ATTENDANCE_MARK", perms: ["READ", "UPDATE", "WRITE"] },
  { key: "ATTENDANCE_ADD_MULTI", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "STUDENT", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER", perms: ["READ"] },
  { key: "TRAINER_ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_VIEW", perms: ["READ", "WRITE"] },
];

function permissionGroupsForRole(role) {
  return role === "Sub Admin" ? SUB_ADMIN_PERMISSION_GROUPS : PERMISSION_GROUPS;
}

function roleSlug(role) {
  return (role || "").toUpperCase().replace(/\s+/g, "_");
}

function ProfilePage({ user, onLogout }) {
  return (
    <div className="ta-profile-page">
      <div className="ta-profile-top-row">
        <h2 className="ta-profile-title">
          <Icon path={ICONS.user} size={18} />
          Profile Information
        </h2>
        <button className="ta-btn-primary ta-profile-logout-btn" onClick={onLogout}>
          <Icon path={ICONS.refresh} size={15} />
          Logout
        </button>
      </div>

      <div className="ta-profile-field-block">
        <label>Email</label>
        <p>{user?.email}</p>
      </div>

      <div className="ta-profile-field-block">
        <label>Role</label>
        <span className="ta-role-pill-outline">{roleSlug(user?.role)}</span>
      </div>

      <div className="ta-profile-grid-row">
        <div>
          <label><Icon path={ICONS.building} size={13} /> Country</label>
          <p>Pakistan</p>
        </div>
        <div>
          <label><Icon path={ICONS.building} size={13} /> City</label>
          <p>Sukkur</p>
        </div>
        <div>
          <label><Icon path={ICONS.building} size={13} /> Campus</label>
          <p>Saylani TITAN Sukkur Campus</p>
        </div>
      </div>

      <h3 className="ta-permissions-title">
        <Icon path={ICONS.shield} size={15} />
        Permissions
      </h3>

      {permissionGroupsForRole(user?.role).map((g) => (
        <div key={g.key} className="ta-permission-row">
          <p className="ta-permission-key">{g.key}</p>
          <div className="ta-permission-badges">
            {g.perms.map((p) => (
              <span key={p} className="ta-permission-badge">{p}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const SUPER_ADMIN_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: ICONS.grid, type: "link" },
  { key: "students", label: "Students", icon: ICONS.users, type: "link" },
  {
    key: "attendance-group",
    label: "Attendance",
    icon: ICONS.calendar,
    type: "group",
    children: [
      { key: "mark-attendance", label: "Mark Attendance" },
      { key: "view-attendance", label: "View Attendance" },
      { key: "multi-attendance", label: "Multi Attendance" },
    ],
  },
  {
    key: "administration-group",
    label: "Administration",
    icon: ICONS.shield,
    type: "group",
    children: [{ key: "administration", label: "Slots" }],
  },
  {
    key: "trainers-group",
    label: "Trainers",
    icon: ICONS.cap,
    type: "group",
    children: [
      { key: "trainers", label: "Trainers" },
      {
        key: "trainer-attendance-subgroup",
        label: "Attendance",
        type: "subgroup",
        children: [
          { key: "mark-trainer-attendance", label: "Mark Attendance" },
          { key: "view-trainer-attendance", label: "View Attendance" },
          { key: "trainer-attendance-request", label: "Attendance Request" },
        ],
      },
    ],
  },
  { key: "updation", label: "Updation", icon: ICONS.refresh, type: "link" },
  { key: "profile", label: "Profile", icon: ICONS.user, type: "link" },
];

// Sub Admin sidebar mirrors the reference portal's limited layout:
// Students, Attendance (Mark / View / Multi), Trainers (list + attendance),
// and Profile. No Dashboard, Administration, Updation or Attendance Request.
const SUB_ADMIN_NAV_ITEMS = [
  { key: "students", label: "Students", icon: ICONS.users, type: "link" },
  {
    key: "attendance-group",
    label: "Attendance",
    icon: ICONS.calendar,
    type: "group",
    children: [
      { key: "mark-attendance", label: "Mark Attendance" },
      { key: "view-attendance", label: "View Attendance" },
      { key: "multi-attendance", label: "Multi Attendance" },
    ],
  },
  {
    key: "trainers-group",
    label: "Trainers",
    icon: ICONS.cap,
    type: "group",
    children: [
      { key: "trainers", label: "Trainers" },
      {
        key: "trainer-attendance-subgroup",
        label: "Attendance",
        type: "subgroup",
        children: [
          { key: "mark-trainer-attendance", label: "Mark Attendance" },
          { key: "view-trainer-attendance", label: "View Attendance" },
        ],
      },
    ],
  },
  { key: "profile", label: "Profile", icon: ICONS.user, type: "link" },
];

function navItemsForRole(role) {
  return role === "Sub Admin" ? SUB_ADMIN_NAV_ITEMS : SUPER_ADMIN_NAV_ITEMS;
}

function findActiveNavLabel(activePage, navItems) {
  for (const item of navItems) {
    if (item.type === "link" && item.key === activePage) return item.label;
    if (item.type === "group") {
      for (const child of item.children) {
        if (child.type === "subgroup") {
          const sub = child.children.find((sc) => sc.key === activePage);
          if (sub) return sub.label;
        } else if (child.key === activePage) {
          return child.label;
        }
      }
    }
  }
  return "Dashboard";
}

function navGroupHasActive(item, activePage) {
  return item.children.some((c) => {
    if (c.type === "subgroup") return c.children.some((sc) => sc.key === activePage);
    return c.key === activePage;
  });
}

const STAT_CARDS = [
  { label: "Total Students", key: "totalStudents", icon: ICONS.users },
  { label: "Enrolled Students", key: "enrolledStudents", icon: ICONS.trend },
  { label: "Courses", key: "courses", icon: ICONS.book },
  { label: "Campuses", key: "campuses", icon: ICONS.building },
];

export function AdminDashboard({ user, onLogout }) {
  const isSubAdmin = user?.role === "Sub Admin";
  const navItems = navItemsForRole(user?.role);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // desktop: expanded/collapsed
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile: slide in/out
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    enrolledStudents: 0,
    courses: 0,
    campuses: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  // Sub Admin has no Dashboard page, so land on Students instead.
  const [activePage, setActivePage] = useState(isSubAdmin ? "students" : "dashboard");
//   const [openGroups, setOpenGroups] = useState(() => ({
//     "attendance-group": true,
//     "administration-group": true,
//     "trainers-group": true,
//     "trainer-attendance-subgroup": true,
//   }));

// AB YE KAREIN (sab false — dropdowns band rehte hain):
const [openGroups, setOpenGroups] = useState(() => ({
  "attendance-group": false,
  "administration-group": false,
  "trainers-group": false,
  "trainer-attendance-subgroup": false,
}));

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const toggleMobileSidebar = () => setIsMobileOpen((p) => !p);
  const toggleGroup = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/dashboard`);
        const data = await response.json();
        if (response.ok) {
          setDashboardStats({
            totalStudents: data.totalStudents ?? 0,
            enrolledStudents: data.enrolledStudents ?? 0,
            courses: data.courses ?? 0,
            campuses: data.campuses ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  const activeNavLabel = findActiveNavLabel(activePage, navItems);

  return (
    <div className="ta-root">
      <div className="ta-dash">
        {/* Mobile top bar */}
        <div className="ta-mobile-bar">
          <button className="ta-mobile-hamburger" onClick={toggleMobileSidebar} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img src={TITAN_LOGO} alt="TITAN" className="ta-mobile-logo" />
        </div>

        {isMobileOpen && (
          <div className="ta-mobile-overlay" onClick={() => setIsMobileOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`ta-sidebar ${isSidebarOpen ? "expanded" : "collapsed"} ${
            isMobileOpen ? "mobile-open" : ""
          }`}
        >
          <button
            type="button"
            className="ta-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              {isSidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
          </button>

          <div className="ta-sidebar-brand">
            <img src={TITAN_LOGO} alt="TITAN" />
            {(isSidebarOpen || isMobileOpen) && (
              <div className="ta-sidebar-brand-text">
                <strong>TITAN</strong>
                <span>{isSubAdmin ? "SUB ADMIN PORTAL" : "ADMIN PORTAL"}</span>
              </div>
            )}
          </div>

          <nav className="ta-nav">
            {navItems.map((item) => {
              const showLabels = isSidebarOpen || isMobileOpen;

              if (item.type === "link") {
                return (
                  <div
                    key={item.key}
                    className={`ta-nav-item ${activePage === item.key ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActivePage(item.key);
                      setIsMobileOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActivePage(item.key);
                        setIsMobileOpen(false);
                      }
                    }}
                  >
                    <Icon path={item.icon} />
                    {showLabels && <span>{item.label}</span>}
                  </div>
                );
              }

              const isOpen = !!openGroups[item.key];
              const groupHasActiveChild = navGroupHasActive(item, activePage);

              return (
                <div key={item.key} className="ta-nav-group">
                  <div
                    className={`ta-nav-item ta-nav-group-header ${groupHasActiveChild ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggleGroup(item.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleGroup(item.key);
                      }
                    }}
                  >
                    <Icon path={item.icon} />
                    {showLabels && <span>{item.label}</span>}
                    {showLabels && (
                      <span
                        className="ta-nav-chevron"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <Icon path={ICONS.chevronDown} size={14} />
                      </span>
                    )}
                  </div>

                  {showLabels && isOpen && (
                    <div className="ta-nav-children">
                      {item.children.map((child) => {
                        if (child.type === "subgroup") {
                          const subOpen = !!openGroups[child.key];
                          const subHasActive = child.children.some((sc) => sc.key === activePage);
                          return (
                            <div key={child.key} className="ta-nav-group">
                              <div
                                className={`ta-nav-subgroup-header ${subHasActive ? "active" : ""}`}
                                role="button"
                                tabIndex={0}
                                aria-expanded={subOpen}
                                onClick={() => toggleGroup(child.key)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleGroup(child.key);
                                  }
                                }}
                              >
                                <span>{child.label}</span>
                                <span
                                  className="ta-nav-chevron"
                                  style={{ transform: subOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                >
                                  <Icon path={ICONS.chevronDown} size={12} />
                                </span>
                              </div>
                              {subOpen && (
                                <div className="ta-nav-subchildren">
                                  {child.children.map((sc) => (
                                    <div
                                      key={sc.key}
                                      className={`ta-nav-item ta-nav-subchild ${activePage === sc.key ? "active" : ""}`}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => {
                                        setActivePage(sc.key);
                                        setIsMobileOpen(false);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          setActivePage(sc.key);
                                          setIsMobileOpen(false);
                                        }
                                      }}
                                    >
                                      <span>{sc.label}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={child.key}
                            className={`ta-nav-item ta-nav-child ${activePage === child.key ? "active" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setActivePage(child.key);
                              setIsMobileOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActivePage(child.key);
                                setIsMobileOpen(false);
                              }
                            }}
                          >
                            <span>{child.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <button className="ta-sidebar-logout" onClick={onLogout}>
            <Icon path={ICONS.logout} size={16} />
            {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
          </button>
        </aside>

        <main
          className={`ta-main ${
            isSidebarOpen ? "offset-expanded" : "offset-collapsed"
          }`}
        >
          {activePage === "dashboard" && (
            <>
              <div className="ta-topbar">
                <div>
                  <p className="ta-welcome-eyebrow">Welcome back</p>
                  <h1 className="ta-welcome-title">{user?.role ?? "Admin"}</h1>
                  <p className="ta-welcome-sub">{user?.email}</p>
                </div>
                <span className="ta-role-badge">
                  <Icon path={ICONS.shield} size={14} />
                  {user?.role}
                </span>
              </div>

              <div className="ta-stat-grid">
                {STAT_CARDS.map((card) => (
                  <div className="ta-stat-card" key={card.label}>
                    <div className="ta-stat-icon">
                      <Icon path={card.icon} size={20} />
                    </div>
                    <p className="ta-stat-value">
                      {statsLoading ? "—" : dashboardStats[card.key].toLocaleString()}
                    </p>
                    <p className="ta-stat-label">{card.label}</p>
                  </div>
                ))}
              </div>

              <div className="ta-panel">
                <h3>Role-Based Access</h3>
                <p>
                  Super Admin has full portal access including Dashboard, Administration
                  and Updation. Sub Admin signs in with its own password and gets a
                  restricted portal: Students, Attendance (Mark / View / Multi),
                  Trainers and Profile.
                </p>
                <div className="ta-panel-divider" />
                <p>
                  You're signed in as <strong style={{ color: "var(--ta-royal-blue)" }}>{user?.role}</strong>.
                  Use the navigation on the left to explore portal sections.
                </p>
              </div>
            </>
          )}

          {activePage === "students" && <StudentsPage />}
          {activePage === "mark-attendance" && <MarkAttendancePage />}
          {activePage === "view-attendance" && <ViewAttendancePage />}
          {activePage === "multi-attendance" && <MultiAttendancePage />}
          {activePage === "trainers" && <TrainersListPage />}
          {activePage === "mark-trainer-attendance" && <MarkTrainerAttendancePage />}
          {activePage === "view-trainer-attendance" && <ViewTrainerAttendancePage />}
          {activePage === "trainer-attendance-request" && <TrainerAttendanceRequestPage />}
          {activePage === "administration" && <SlotsPage />}
          {activePage === "updation" && <UpdationPage />}
          {activePage === "profile" && <ProfilePage user={user} onLogout={onLogout} />}

          {![
            "dashboard",
            "students",
            "mark-attendance",
            "view-attendance",
            "multi-attendance",
            "trainers",
            "mark-trainer-attendance",
            "view-trainer-attendance",
            "trainer-attendance-request",
            "administration",
            "updation",
            "profile",
          ].includes(activePage) && (
            <div className="ta-panel ta-coming-soon">
              <h3>{activeNavLabel}</h3>
              <p>This section is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={setCurrentUser} />;
  }

  return (
    <AdminDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
  );
}