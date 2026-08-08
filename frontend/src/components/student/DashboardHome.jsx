"use client"

// "Dashboard" tab ka content - jab sidebar wale full portal main dashboard select ho

export default function DashboardHome({
  studentCourse,
  openFeedbackModal,
  goToMenu,
  studentWeekDays,
  studentWidgetTab,
  setStudentWidgetTab,
  feeRecords,
  setStudentView,
}) {
  return (
    <>
      <div className="student-page-top-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span>
        </div>
        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>
      </div>

      <section className="student-stats-top-row">
        <div className="stat-card s-clickable-stat" onClick={() => goToMenu("attendance")}>
          <div className="stat-content"><h3>{studentCourse.attendance}</h3><p>Attendance</p></div>
          <div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
        </div>
        <div className="stat-card s-clickable-stat" onClick={() => goToMenu("assignment")}>
          <div className="stat-content"><h3>{studentCourse.assignments}</h3><p>Assignment</p></div>
          <div className="stat-badge-icon purple-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg></div>
        </div>
        <div className="schedule-compact-widget">
          <div className="schedule-title-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            Class Schedule
          </div>
          <div className="schedule-days-flex">
            {studentWeekDays.map((day) => (
              <div key={day.d} className={`day-pill ${day.active ? "present" : ""}`}>{day.d} <span>{day.n}</span></div>
            ))}
          </div>
        </div>
      </section>

      <div className="student-widget-card">
        <div className="student-widget-tabs">
          <button className={studentWidgetTab === "assignments" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("assignments")}>Assignments</button>
          <button className={studentWidgetTab === "quizzes" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("quizzes")}>Quizzes</button>
          <button className={studentWidgetTab === "events" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("events")}>Events</button>
        </div>
        <p className="widget-empty-text">No upcoming {studentWidgetTab}.</p>
      </div>

      <div className="student-course-card" style={{ marginTop: "20px", maxWidth: "none" }}>
        <div className="student-course-card-header"><h2>{studentCourse.title}</h2><span className="enrolled-badge-pill">{studentCourse.status}</span></div>
        <div className="student-schedule-pills-row">{studentCourse.schedule.map((s, i) => <span key={i} className="schedule-time-pill">{s}</span>)}</div>
        <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}% Completed</strong></div>
        <div className="progress-bar-rail"><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
        <div className="student-info-grid-2col">
          <div>Batch: <strong>{studentCourse.batch}</strong></div>
          <div>Roll: <strong>{studentCourse.roll}</strong></div>
          <div>Campus: <strong>{studentCourse.campus}</strong></div>
          <div>City: <strong>{studentCourse.city}</strong></div>
        </div>
      </div>

      <div className="workspace-card-view" style={{ marginTop: "20px" }}>
        <h3 style={{ marginTop: 0 }}>Fee</h3>
        <div className="table-responsive-wrapper">
          <table className="client-data-table plain-table">
            <thead><tr><th>Month</th><th>Amount</th><th>Type</th><th>Due date</th><th>Voucher ID</th><th>Status</th></tr></thead>
            <tbody>
              {feeRecords.length > 0 ? (
                <tr><td>{feeRecords[0].month}</td><td>{feeRecords[0].amount}</td><td>{feeRecords[0].type}</td><td>{feeRecords[0].dueDate}</td><td>{feeRecords[0].voucherId}</td><td><span className="badge-present-status">{feeRecords[0].status}</span></td></tr>
              ) : (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No fee record yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
