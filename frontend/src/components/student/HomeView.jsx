"use client"

// Simple "home" landing card - jab studentView === "home" hota hy
const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg"

export default function HomeView({ studentCourse, openFeedbackModal, setStudentView, theme = "light", toggleTheme, onLogout }) {
  return (
    <div className="student-simple-page">
      <div className="student-top-bar">
        <div className="student-top-logo-block">
          <span
            style={
              theme === "dark"
                ? { display: "inline-flex", background: "#fff", borderRadius: "10px", padding: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" }
                : undefined
            }
          >
            <img src={TITAN_LOGO || "/placeholder.svg"} alt="TITAN" className="titan-logo-img" style={{ display: "block" }} />
          </span>
          <span className="titan-word-below">TITAN</span>
        </div>
        <div className="student-search-wrap">
          <input type="text" placeholder="Search Course" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <div className="student-enrolled-dropdown">ENROLLED<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>

        {toggleTheme && (
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
        )}

        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>

        {onLogout && (
          <button type="button" className="student-logout-nav-btn" onClick={onLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </button>
        )}
      </div>
      <div className="student-course-card">
        <div className="student-course-card-header"><h2>{studentCourse.title}</h2><span className="enrolled-badge-pill">{studentCourse.status}</span></div>
        <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}% Completed</strong></div>
        <div className="progress-bar-rail"><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
        <div className="student-info-grid-2col">
          <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg> Batch: <strong>{studentCourse.batch}</strong></div>
          <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg> Roll: <strong>{studentCourse.roll}</strong></div>
          <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> Campus: <strong>{studentCourse.campus}</strong></div>
          <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> City: <strong>{studentCourse.city}</strong></div>
        </div>
        <button className="student-view-details-btn" onClick={() => setStudentView("full")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          View Details
        </button>
      </div>
    </div>
  )
}
