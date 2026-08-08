"use client"

// Course progress page - modules ki completion

export default function ProgressSection({ studentCourse, setStudentView, progressData, openFeedbackModal }) {
  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Progress</span>
        </div>
        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>
      </div>
      <div className="workspace-card-view">
        <h3 style={{ marginTop: 0 }}>Course Progress</h3>
        <div className="s-progress-topics-row">
          <div className="s-topic-chip s-topic-done">Completed: {progressData.doneTopics}</div>
          <div className="s-topic-chip s-topic-pending">Pending: {progressData.pendingTopics}</div>
          <div className="s-topic-chip s-topic-total">Total Topics: {progressData.totalTopics}</div>
        </div>
        <div className="s-progress-label-row"><span>Overall Progress</span><strong style={{ color: "var(--primary-color)" }}>{progressData.overallPct}%</strong></div>
        <div className="progress-bar-rail" style={{ height: 10, marginBottom: 24 }}><div className="progress-bar-fill-track" style={{ width: `${progressData.overallPct}%` }} /></div>
        <div className="s-modules-list">
          {progressData.modules.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No modules assigned yet.</p>
          )}
          {progressData.modules.map((mod, i) => (
            <div key={i} className={`s-module-row s-module-${mod.status}`}>
              <div className="s-module-left">
                <div className={`s-module-check ${mod.status === "done" ? "s-check-done" : mod.status === "active" ? "s-check-active" : "s-check-pending"}`}>
                  {mod.status === "done" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : mod.status === "active" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>}
                </div>
                <div><p className="s-module-name">{mod.name}</p><p className="s-module-topics">{mod.done} / {mod.total} topics</p></div>
              </div>
              <div className="s-module-right">
                <div className="s-module-pct-badge" style={{ color: mod.pct === 100 ? "var(--green-color)" : mod.pct >= 50 ? "var(--primary-color)" : "var(--amber-color)", background: mod.pct === 100 ? "#e6fdf4" : mod.pct >= 50 ? "var(--primary-light)" : "#fffbeb" }}>{mod.pct}%</div>
                <div className="progress-bar-rail" style={{ height: 6, width: 80, marginBottom: 0 }}><div className="progress-bar-fill-track" style={{ width: `${mod.pct}%`, backgroundColor: mod.pct === 100 ? "var(--green-color)" : mod.pct >= 50 ? "var(--primary-color)" : "var(--amber-color)" }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
