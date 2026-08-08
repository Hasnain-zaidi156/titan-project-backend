"use client"

// Attendance page - stats + monthly log table

export default function AttendanceSection({
  studentCourse,
  setStudentView,
  attMonths,
  attStats,
  attPercent,
  attSelectedMonth,
  setAttSelectedMonth,
  attendanceLog,
}) {
  const currentLog = attendanceLog[attSelectedMonth] || []
  const monthPresent = currentLog.filter((r) => r[2] === "PRESENT").length
  const monthLeave = currentLog.filter((r) => r[2] === "LEAVE").length
  const monthAbsent = currentLog.filter((r) => r[2] === "ABSENT").length
  const monthPct = currentLog.length > 0 ? Math.round((monthPresent / currentLog.length) * 100) : 0

  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Attendance</span>
        </div>
      </div>
      <div className="s-att-stats-row">
        <div className="stat-card"><div className="stat-content"><h3>{attStats.total}</h3><p>Total Classes</p></div><div className="stat-badge-icon s-icon-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{attStats.present}</h3><p>Present</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{attStats.leave}</h3><p>Leave</p></div><div className="stat-badge-icon s-icon-amber"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{attStats.absent}</h3><p>Absent</p></div><div className="stat-badge-icon s-icon-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></div></div>
      </div>
      <div className="workspace-card-view">
        <h3 style={{ marginTop: 0 }}>Attendance Overview</h3>
        <div className="s-progress-label-row"><span>Overall Attendance</span><strong style={{ color: "var(--primary-color)" }}>{attPercent}%</strong></div>
        <div className="progress-bar-rail" style={{ marginBottom: 8 }}><div className="progress-bar-fill-track" style={{ width: `${attPercent}%` }} /></div>
        <p className="s-att-good-text">Your attendance is good. Keep it up!</p>
      </div>
      <div className="workspace-card-view" style={{ marginTop: 20 }}>
        <div className="s-att-month-header">
          <h3 style={{ margin: 0 }}>Monthly Attendance</h3>
          <select className="s-month-select" value={attSelectedMonth} onChange={(e) => setAttSelectedMonth(e.target.value)}>
            {attMonths.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="s-month-stats-row">
          <div className="s-month-stat"><span>Classes</span><strong>{currentLog.length}</strong></div>
          <div className="s-month-stat"><span>Present</span><strong style={{ color: "var(--green-color)" }}>{monthPresent}</strong></div>
          <div className="s-month-stat"><span>Leave</span><strong style={{ color: "var(--amber-color)" }}>{monthLeave}</strong></div>
          <div className="s-month-stat"><span>Absent</span><strong style={{ color: "var(--red-color)" }}>{monthAbsent}</strong></div>
          <div className="s-month-stat"><span>Percentage</span><strong style={{ color: "var(--primary-color)" }}>{monthPct}%</strong></div>
        </div>
        <div className="table-responsive-wrapper" style={{ marginTop: 16 }}>
          <table className="client-data-table s-att-table">
            <thead><tr><th>Class</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {currentLog.length > 0 ? (
                currentLog.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td><span className={`s-att-badge s-att-${row[2].toLowerCase()}`}>{row[2]}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)" }}>No attendance record yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
