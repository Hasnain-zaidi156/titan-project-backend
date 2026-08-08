"use client"

// Assignment ka detail + submit modal
// assignmentModal = jis assignment ka data dikhana hy (null = band)

export default function AssignmentModal({
  assignmentModal,
  onClose,
  rollNumber,
  submitForm,
  setSubmitForm,
  submitError,
  submitting,
  onSubmit,
}) {
  if (!assignmentModal) return null
  const a = assignmentModal
  const mySub = a.submissions.find((s) => s.rollNumber === rollNumber)
  const status = mySub ? (mySub.approved === true ? "APPROVED" : mySub.approved === false ? "NOT APPROVED" : mySub.status.toUpperCase()) : "NOT SUBMITTED"
  const statusClass = status === "APPROVED" ? "badge-present-status" : status === "NOT APPROVED" ? "s-att-badge s-att-absent" : "s-att-badge s-att-leave"

  return (
    <div className="s-modal-overlay" onClick={onClose}>
      <div className="s-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="s-modal-header">
          <h2>Assignment Information</h2>
          <button className="s-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="s-feedback-type-label">Title</div>
        <p style={{ fontWeight: 700, fontSize: "1.05rem", margin: "2px 0 14px" }}>{a.title}</p>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="s-feedback-type-label">Due Date</div>
            <p style={{ margin: 0 }}>{a.dueDate}</p>
          </div>
          <div>
            <div className="s-feedback-type-label">Status</div>
            <span className={statusClass}>{status}</span>
          </div>
        </div>

        {a.description && (
          <>
            <div className="s-feedback-type-label" style={{ marginTop: 16 }}>Description</div>
            <div className="sub-detail-description-box">{a.description}</div>
          </>
        )}

        <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid var(--border-color, #eee)" }} />

        <div className="s-feedback-type-label" style={{ fontSize: "0.95rem", fontWeight: 700 }}>Submission Details</div>

        {mySub && (
          <div style={{ marginTop: 8 }}>
            <div className="s-feedback-type-label">Submitted On</div>
            <p style={{ margin: "0 0 10px" }}>{mySub.submittedAt ? new Date(mySub.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}</p>
          </div>
        )}

        <div className="s-feedback-type-label">Submission Link *</div>
        <input
          className="s-feedback-textarea"
          style={{ minHeight: "auto", padding: "10px 12px" }}
          placeholder="https://github.com/... or Google Drive link"
          value={submitForm.link}
          onChange={(e) => setSubmitForm({ ...submitForm, link: e.target.value })}
        />

        <div className="s-feedback-type-label">Submission Notes</div>
        <textarea
          className="s-feedback-textarea"
          placeholder="Anything you'd like your trainer to know..."
          rows={3}
          value={submitForm.description}
          onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
        />

        {submitError && <p style={{ color: "var(--red-color, #ef4444)", fontSize: "0.85rem", marginTop: 8 }}>{submitError}</p>}

        <div className="s-modal-actions">
          <button className="s-btn-cancel" onClick={onClose}>Close</button>
          <button className="s-btn-send" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : mySub ? "Update Submission" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}
