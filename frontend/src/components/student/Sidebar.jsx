"use client"

// Left sidebar - nav menu, profile popup, logout

const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg"

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></> },
  { key: "progress", label: "Progress", icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  { key: "attendance", label: "Attendance", icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
  { key: "payment", label: "Payment", icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
  { key: "assignment", label: "Assignment", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
  { key: "quiz", label: "Quiz", icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
]

export default function Sidebar({
  studentSidebarOpen,
  setStudentSidebarOpen,
  studentActiveMenu,
  goToMenu,
  studentProfileMenuOpen,
  setStudentProfileMenuOpen,
  profilePhoto,
  profileData,
  onLogout,
  theme = "light",
  toggleTheme,
}) {
  return (
    <aside className={`sidebar ${studentSidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="toggle-trigger-action" onClick={() => setStudentSidebarOpen(!studentSidebarOpen)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
          {studentSidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </div>
      <div className="logo-container-vertical">
        <div className="titan-brand-wrapper">
          <span
            style={
              theme === "dark"
                ? { display: "inline-flex", background: "#fff", borderRadius: "10px", padding: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" }
                : undefined
            }
          >
            <img src={TITAN_LOGO || "/placeholder.svg"} alt="TITAN" className="titan-logo-img" style={{ display: "block" }} />
          </span>
          {studentSidebarOpen && <h3 className="logo-text-bottom">TITAN</h3>}
        </div>
      </div>

      <nav className="nav-menu">
        {NAV_ITEMS.map((item) => (
          <div key={item.key} className={`nav-item ${studentActiveMenu === item.key ? "active" : ""}`} onClick={() => goToMenu(item.key)}>
            <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
            {studentSidebarOpen && <span className="nav-text">{item.label}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {studentProfileMenuOpen && (
          <div className="profile-popup-menu">
            <div className="profile-popup-item" onClick={() => { setStudentProfileMenuOpen(false); goToMenu("profile") }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span>Profile</span>
            </div>
            {toggleTheme && (
              <div className="profile-popup-item theme-popup-item" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                )}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                <span className={`mini-theme-switch ${theme === "dark" ? "on" : ""}`}><span className="mini-theme-knob" /></span>
              </div>
            )}
            <div className="profile-popup-item logout-popup-item" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              <span>Log out</span>
            </div>
          </div>
        )}
        <div className="user-profile-wrapper" onClick={() => setStudentProfileMenuOpen(!studentProfileMenuOpen)}>
          <img src={profilePhoto || "/placeholder.svg"} alt="Avatar" className="table-avatar-img" />
          {studentSidebarOpen && (
            <div className="trainer-info">
              <h4>{profileData.name}</h4>
              <p>Student</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
