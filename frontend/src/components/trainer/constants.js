// ============================================================
// Static UI constants for the Trainer portal (logo URLs, API base,
// calendar labels). No application/demo data lives here anymore —
// courses, students, assignments, quizzes, attendance and progress
// are all fetched live from the backend/MongoDB.
// ============================================================

export const TITAN_LOGO = 'https://i.ibb.co/q3c3CkLS/titan-logo.jpg';
export const TITAN_LOGO_BG = 'https://i.ibb.co/Zz3Hk1Q5/titan-logo-bg.jpg';
export const PROFILE_BG_IMG = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
