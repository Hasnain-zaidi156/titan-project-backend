"use client"

// Feedback Modal - student feedback dene ka popup
// Parent (StudentDashboard.jsx) se sara state props ki tarhan aata hy

export default function FeedbackModal({
  show,
  onClose,
  feedbackType,
  setFeedbackType,
  feedbackText,
  setFeedbackText,
  feedbackImages,
  onImageChange,
  onRemoveImage,
  feedbackFileRef,
  onSend,
}) {
  if (!show) return null

  return (
    <div className="s-modal-overlay" onClick={onClose}>
      <div className="s-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="s-modal-header">
          <h2>Share Your Feedback</h2>
          <button className="s-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <p className="s-modal-desc">Let us know if we could do anything to improve your learning experience</p>

        <div className="s-feedback-type-label">Select Type *</div>
        <div className="s-feedback-types">
          {[
            { key: "Bug", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
            { key: "Idea", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
            { key: "Other", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
          ].map((t) => (
            <div key={t.key} className={`s-feedback-type-card ${feedbackType === t.key ? "s-fb-type-active" : ""}`} onClick={() => setFeedbackType(t.key)}>
              {t.icon}
              <span>{t.key}</span>
            </div>
          ))}
        </div>

        <div className="s-feedback-type-label">Your feedback</div>
        <textarea className="s-feedback-textarea" placeholder="Write your feedback here..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={4} />

        <div className="s-feedback-type-label">Reference Images</div>
        <div className="s-feedback-images">
          {feedbackImages.map((img, i) => (
            <div key={i} className="s-fb-img-preview">
              <img src={img || "/placeholder.svg"} alt="" />
              <button className="s-fb-img-remove" onClick={() => onRemoveImage(i)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          ))}
          <button className="s-fb-add-img" onClick={() => feedbackFileRef.current?.click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span>Add Image</span>
          </button>
          <input ref={feedbackFileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onImageChange} />
        </div>

        <div className="s-modal-actions">
          <button className="s-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="s-btn-send" onClick={onSend} disabled={!feedbackType || !feedbackText.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            Send feedback
          </button>
        </div>
      </div>
    </div>
  )
}
