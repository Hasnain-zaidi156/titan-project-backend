import React from 'react';
import { modalOverlayStyle, modalCardStyle, modalCloseBtnStyle, modalLabelStyle } from '../modalStyles';

const AssignmentsTab = ({
  displayedAssignments, assignmentsLoading, openNewAssignmentModal, openEditAssignmentModal,
  selectedAssignment, setSelectedAssignment,
  selectedSubmission, setSelectedSubmission,
  selectedSubmissionIdx, setSelectedSubmissionIdx,
  getSubApproval, setSubmissionApproval, submitFeedback, submissionFeedback,
}) => {
  // ===== List view =====
  if (!selectedAssignment) {
    return (
      <div className="workspace-card-view">
        <div className="tab-action-header-row">
          <h3>Assignments {assignmentsLoading && <span className="muted-small-text">(refreshing…)</span>}</h3>
          <button className="new-item-action-btn" onClick={openNewAssignmentModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Assignment
          </button>
        </div>
        <div className="table-responsive-wrapper" style={{ marginTop: '4px' }}>
          <table className="client-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Topics</th>
                <th>Due Date</th>
                <th>View</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAssignments.map((asgn) => (
                <tr key={asgn.id} className={asgn.isHackathon ? 'hackathon-row' : ''}>
                  <td>
                    <div className="assignment-title-cell">
                      <span className={asgn.isHackathon ? 'hackathon-title-text' : ''}>{asgn.title}</span>
                      {asgn.isHackathon && <span className="hackathon-tag-badge">HACKATHON</span>}
                      {asgn._isLive && <span className="hackathon-tag-badge" style={{ background: '#dcfce7', color: '#059669' }}>LIVE</span>}
                    </div>
                  </td>
                  <td className="desc-truncate-cell">{asgn.description.split('\n')[0]}{asgn.description.includes('\n') ? <span className="desc-more">...</span> : ''}</td>
                  <td><span className="no-topics-text">{asgn.topics}</span></td>
                  <td className={asgn.isHackathon ? 'hackathon-date-text' : ''}>{asgn.dueDate}</td>
                  <td>
                    <button className="eye-action-btn" onClick={() => { setSelectedAssignment(asgn); setSelectedSubmission(asgn.submissions[0] || null); setSelectedSubmissionIdx(asgn.submissions.length ? 0 : -1); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                  </td>
                  <td>
                    <button className="icon-edit-btn" title="Edit" onClick={() => openEditAssignmentModal && openEditAssignmentModal(asgn)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-pagination-footer-row">
            <span className="muted-small-text">Showing 1-8 of 16 records</span>
            <div className="pagination-buttons-group">
              <button className="pagination-nav-btn">Previous</button>
              <button className="pagination-page-num active-page">1</button>
              <button className="pagination-page-num">2</button>
              <button className="pagination-nav-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Submission detail view =====
  return (
    <div className="submission-view-layout animated-fade">
      <div className="submission-view-breadcrumb">
        <span className="breadcrumb-nav-link" onClick={() => setSelectedAssignment(null)}>Assignments</span> &gt; <span className="current-crumb">Submissions</span>
      </div>
      <h2 className="submission-view-title">Assignment Submissions</h2>
      <p className="submission-view-sub">{selectedAssignment.title}.</p>

      <div className="submission-stats-row">
        <div className="submission-stat-card">
          <div><span className="sub-stat-num">{selectedAssignment.submissions.length}</span><p>Submissions</p></div>
          <div className="stat-badge-icon blue-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
        </div>
        <div className="submission-stat-card">
          <div><span className="sub-stat-num">{selectedAssignment.submissions.filter(s => s.approved === true).length}</span><p>Approved</p></div>
          <div className="stat-badge-icon green-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /><circle cx="12" cy="12" r="10" /></svg></div>
        </div>
        <div className="submission-stat-card">
          <div><span className="sub-stat-num">{selectedAssignment.submissions.filter(s => s.approved === false).length}</span><p>Not Approved</p></div>
          <div className="stat-badge-icon red-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg></div>
        </div>
      </div>

      <div className="submission-split-layout">
        <div className="submission-list-panel">
          <div className="submission-list-header">
            <h4>Submissions</h4>
            <input type="text" placeholder="Search..." className="submission-search-input" />
          </div>
          <div className="submission-list-items">
            {selectedAssignment.submissions.length === 0 && <p className="muted-italic-text" style={{ padding: '16px' }}>No submissions yet.</p>}
            {selectedAssignment.submissions.map((sub, idx) => {
              const approval = getSubApproval(selectedAssignment.id, idx);
              const isActive = selectedSubmissionIdx === idx;
              return (
                <div key={idx} className={`submission-list-item ${isActive ? 'sub-item-active' : ''}`} onClick={() => { setSelectedSubmission(sub); setSelectedSubmissionIdx(idx); }}>
                  <div className="sub-item-avatar-initials">{sub.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
                  <span className="sub-item-name">{sub.name}</span>
                  <span className={`sub-item-badge ${sub.status === 'Late Submitted' ? 'sub-badge-late' : approval === true ? 'sub-badge-approved' : approval === false ? 'sub-badge-notapproved' : 'sub-badge-submitted'}`}>
                    {sub.status === 'Late Submitted' ? '⏱ Late Submitted' : approval === true ? '✓ Approved' : approval === false ? '✗ Not Approved' : '✓ Submitted'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {selectedSubmission && (
          <div style={modalOverlayStyle} onClick={() => setSelectedSubmission(null)}>
            <div style={{ ...modalCardStyle, maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
              <div className="submission-detail-panel animated-fade" style={{ padding: 0 }}>
                <div className="submission-detail-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Assignment Information</h3>
                  </div>
                  <button style={modalCloseBtnStyle} onClick={() => setSelectedSubmission(null)}>✕</button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <label style={modalLabelStyle}>Title</label>
                  <p style={{ margin: '2px 0 10px', fontWeight: 700 }}>{selectedAssignment.title}</p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div>
                      <label style={modalLabelStyle}>Due Date</label>
                      <p style={{ margin: 0 }}>{selectedAssignment.dueDate}</p>
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Status</label>
                      {(() => {
                        const subIdx = selectedSubmissionIdx;
                        const approval = getSubApproval(selectedAssignment.id, subIdx);
                        return (
                          <span className={`sub-status-pill ${approval === true ? 'sub-pill-approved' : approval === false ? 'sub-pill-notapproved' : 'sub-pill-pending'}`}>
                            {approval === true ? '✓ Approved' : approval === false ? '✗ Not Approved' : 'Pending'}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  {selectedAssignment.description && (
                    <>
                      <label style={modalLabelStyle}>Description</label>
                      <div className="sub-detail-description-box">{selectedAssignment.description}</div>
                    </>
                  )}
                </div>

                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 8px' }}>Submission Details</p>

                <div className="submission-detail-header" style={{ marginTop: 0 }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{selectedSubmission.name}</h4>
                    <p className="sub-detail-email">{selectedSubmission.email}</p>
                  </div>
                  <button className="feedback-btn" onClick={() => submitFeedback(selectedAssignment, selectedSubmissionIdx)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    {submissionFeedback[`${selectedAssignment.id}-${selectedSubmissionIdx}`] ? 'Edit Feedback' : 'Feedback'}
                  </button>
                </div>

                {submissionFeedback[`${selectedAssignment.id}-${selectedSubmissionIdx}`] && (
                  <div className="submission-detail-row">
                    <span className="sub-detail-label">Feedback</span>
                    <div className="sub-detail-description-box">{submissionFeedback[`${selectedAssignment.id}-${selectedSubmissionIdx}`]}</div>
                  </div>
                )}

                {selectedSubmission.link && (
                  <div className="submission-detail-row">
                    <span className="sub-detail-label">Submission Link</span>
                    <a href={selectedSubmission.link} className="sub-detail-link" target="_blank" rel="noopener noreferrer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      {selectedSubmission.link}
                    </a>
                  </div>
                )}

                {selectedSubmission.description && (
                  <div className="submission-detail-row">
                    <span className="sub-detail-label">Submission Notes</span>
                    <div className="sub-detail-description-box">{selectedSubmission.description}</div>
                  </div>
                )}

                <div className="submission-detail-row">
                  <span className="sub-detail-label">Decision</span>
                  <div className="sub-approval-toggle">
                    {(() => {
                      const subIdx = selectedSubmissionIdx;
                      const approval = getSubApproval(selectedAssignment.id, subIdx);
                      return (
                        <>
                          <button className={`sub-toggle-btn ${approval === true ? 'sub-toggle-approved-active' : ''}`} onClick={() => setSubmissionApproval(selectedAssignment, subIdx, true)}>Approved</button>
                          <button className={`sub-toggle-btn ${approval === false ? 'sub-toggle-notapproved-active' : ''}`} onClick={() => setSubmissionApproval(selectedAssignment, subIdx, false)}>Not Approved</button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTab;
