// Sab files ke liye ek jagah se API URL / logo — kahin bhi hardcode nahi karna
export const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg";

/* =========================================================================
   AUTH — DEMO ONLY (ab use nahi ho raha, sirf reference ke liye rakha hai)
   -------------------------------------------------------------------------
   Ye hardcoded credentials JS bundle mein visible hote, is liye asli login
   ab backend API (/api/admin/login) se hota hai — dekho src/auth/AdminLogin.jsx
   ========================================================================= */
export const ADMIN_USERS_DEMO_REFERENCE = [
  { email: "superadmin@example.com", password: "super", role: "Super Admin" },
  { email: "subadmin@example.com", password: "sub", role: "Sub Admin" },
];
