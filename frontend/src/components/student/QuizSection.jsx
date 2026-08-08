"use client"

// Quiz list page - live (backend) quizzes ka result submit + demo quizzes

export default function QuizSection({
  studentCourse,
  setStudentView,
  liveQuizzes,
  rollNumber,
  quizzesData,
  API_BASE,
  setLiveQuizzes,
  studentName,
}) {
  const submitQuizResult = async (q, myResult) => {
    const scoreStr = window.prompt(`Enter your score out of ${q.totalQuestions}:`, myResult?.score || "")
    if (scoreStr === null) return
    const score = Number(scoreStr)
    if (Number.isNaN(score)) return
    try {
      const res = await fetch(`${API_BASE}/api/quizzes/${q.id}/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, studentName, score, totalQuestions: q.totalQuestions }),
      })
      const data = await res.json()
      if (res.ok) setLiveQuizzes((prev) => prev.map((x) => (x.id === data.id ? data : x)))
    } catch (err) {
      console.error("Submit result failed:", err)
    }
  }

  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Quiz</span>
        </div>
      </div>
      <div className="s-quiz-info-box">
        <div className="s-quiz-info-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          Important Information
        </div>
        <ul className="s-quiz-info-list">
          <li>Quiz must be completed in a single session. You cannot pause and resume later.</li>
          <li>Switching to another tab or window during the quiz will be recorded and may be flagged.</li>
          <li>Each quiz can only be attempted once unless otherwise specified by the instructor.</li>
          <li>Make sure you have a stable internet connection before starting.</li>
          <li>If you face any issue, contact your instructor immediately.</li>
        </ul>
      </div>
      <div className="workspace-card-view">
        <h3>Quizzes — Module 3: Modern Web Application Development</h3>
        <div className="table-responsive-wrapper">
          <table className="client-data-table s-quiz-table">
            <thead><tr><th>Module</th><th>Title</th><th>Questions</th><th>Attempts</th><th>Score</th><th>Percentage</th><th>Status</th><th>Note</th><th>Action</th></tr></thead>
            <tbody>
              {liveQuizzes.map((q) => {
                const myResult = q.results.find((r) => r.rollNumber === rollNumber)
                const pct = myResult ? Math.round((myResult.score / myResult.totalQuestions) * 100) : 0
                return (
                  <tr key={q.id}>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.course} <span className="s-att-badge s-att-present" style={{ marginLeft: 6 }}>LIVE</span></td>
                    <td className="s-quiz-title">{q.title}</td>
                    <td>{q.totalQuestions}</td>
                    <td>{myResult?.attempts || 0}</td>
                    <td>{myResult ? `${myResult.score} / ${myResult.totalQuestions}` : "—"}</td>
                    <td>{myResult ? <span className={`s-quiz-pct s-quiz-${myResult.status.toLowerCase()}`}>{pct}%</span> : "—"}</td>
                    <td>{myResult ? <span className={`s-quiz-badge s-quiz-${myResult.status.toLowerCase()}`}>{myResult.status}</span> : <span className="s-quiz-badge">PENDING</span>}</td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>—</td>
                    <td>
                      <button
                        className="s-btn-outline"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                        onClick={() => submitQuizResult(q, myResult)}
                      >
                        {myResult ? "Retry" : "Submit"}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {quizzesData.map((q, i) => (
                <tr key={i}><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.module}</td><td className="s-quiz-title">{q.title}</td><td>{q.questions}</td><td>{q.attempts}</td><td>{q.score}</td><td><span className={`s-quiz-pct s-quiz-${q.status.toLowerCase()}`}>{q.pct}%</span></td><td><span className={`s-quiz-badge s-quiz-${q.status.toLowerCase()}`}>{q.status}</span></td><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.note || "—"}</td><td><span className="s-action-completed">Completed</span></td></tr>
              ))}
              {liveQuizzes.length === 0 && quizzesData.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text-muted)" }}>No quizzes yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>If you have any questions about your quiz results, please contact your instructor.</p>
      </div>
    </div>
  )
}
