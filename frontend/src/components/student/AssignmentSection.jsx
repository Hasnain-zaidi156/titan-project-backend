"use client"

// Assignment list page - live (backend) + demo assignments + pagination

export default function AssignmentSection({
  studentCourse,
  setStudentView,
  openFeedbackModal,
  assignStats,
  liveAssignments,
  rollNumber,
  openAssignmentModal,
  paginatedAssignments,
  assignPage,
  setAssignPage,
  totalAssignPages,
  assignmentsData,
  ASSIGN_PER_PAGE,
}) {
  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Assignment</span>
        </div>
        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>
      </div>
      <div className="s-assign-stats-row">
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.total}</h3><p>Total</p></div><div className="stat-badge-icon s-icon-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.submitted}</h3><p>Submitted</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.approved}</h3><p>Approved</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.notApproved}</h3><p>Not Approved</p></div><div className="stat-badge-icon s-icon-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></div></div>
      </div>
      <div className="workspace-card-view">
        <h3>Assignments</h3>
        <div className="table-responsive-wrapper">
          <table className="client-data-table s-assign-table">
            <thead><tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {liveAssignments.map((a) => {
                const mySub = a.submissions.find((s) => s.rollNumber === rollNumber)
                const status = mySub ? (mySub.approved === true ? "APPROVED" : mySub.approved === false ? "NOT APPROVED" : mySub.status.toUpperCase()) : "NOT SUBMITTED"
                return (
                  <tr key={a.id}>
                    <td className="s-assign-title" style={{ cursor: "pointer" }} onClick={() => openAssignmentModal(a)}>
                      {a.title} <span className="s-att-badge s-att-present" style={{ marginLeft: 6 }}>LIVE</span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.course}</td>
                    <td>{a.dueDate}</td>
                    <td><span className={`s-assign-badge s-assign-${status.replace(/\s/g, "").toLowerCase()}`}>{status}</span></td>
                    <td>
                      <button className="s-btn-outline" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => openAssignmentModal(a)}>
                        {mySub ? "View" : "Submit"}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {paginatedAssignments.map((a, i) => (
                <tr key={i}><td className="s-assign-title">{a.title}</td><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.course}</td><td>{a.dueDate}</td><td><span className={`s-assign-badge s-assign-${a.status.replace(/\s/g, "").toLowerCase()}`}>{a.status}</span></td><td><span className="s-action-completed">Completed</span></td></tr>
              ))}
              {liveAssignments.length === 0 && paginatedAssignments.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No assignments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="s-pagination-row">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Showing {(assignPage - 1) * ASSIGN_PER_PAGE + 1}-{Math.min(assignPage * ASSIGN_PER_PAGE, assignmentsData.length)} of {assignmentsData.length} records</span>
          <div className="s-pagination-btns">
            <button className="s-page-btn" disabled={assignPage <= 1} onClick={() => setAssignPage((p) => p - 1)}>Previous</button>
            {Array.from({ length: totalAssignPages }, (_, i) => (
              <button key={i} className={`s-page-num ${assignPage === i + 1 ? "s-page-active" : ""}`} onClick={() => setAssignPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="s-page-btn" disabled={assignPage >= totalAssignPages} onClick={() => setAssignPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
