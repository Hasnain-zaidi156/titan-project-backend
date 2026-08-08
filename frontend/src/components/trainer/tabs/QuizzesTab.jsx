import React from 'react';

const QuizzesTab = ({
  displayedQuizzes, quizzesLoading, openNewQuizModal,
  selectedQuiz, setSelectedQuiz,
}) => {
  // ===== List view =====
  if (!selectedQuiz) {
    return (
      <div className="workspace-card-view">
        <div className="tab-action-header-row">
          <h3>Quizzes {quizzesLoading && <span className="muted-small-text">(refreshing…)</span>}</h3>
          <button className="new-item-action-btn" onClick={openNewQuizModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Quiz
          </button>
        </div>
        <div className="table-responsive-wrapper" style={{ marginTop: '4px' }}>
          <table className="client-data-table">
            <thead>
              <tr><th>Quiz</th><th>Course(s)</th><th>Date</th><th>Expiry</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {displayedQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td style={{ fontWeight: '600' }}>{quiz.title}{quiz._isLive && <span className="hackathon-tag-badge" style={{ background: '#dcfce7', color: '#059669', marginLeft: 6 }}>LIVE</span>}</td>
                  <td className="quiz-courses-cell">{quiz.courses}</td>
                  <td>{quiz.date}</td>
                  <td>{quiz.expiry}</td>
                  <td><span className="badge-quiz-active">{quiz.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button className="icon-edit-btn" title="Edit">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className="eye-action-btn" title="View Results" onClick={() => setSelectedQuiz(quiz)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===== Results view =====
  return (
    <div className="animated-fade">
      <div className="submission-view-breadcrumb">
        <span className="breadcrumb-nav-link" onClick={() => setSelectedQuiz(null)}>Quizzes</span> &gt; <span className="current-crumb">quiz</span>
      </div>
      <h2 className="submission-view-title">Quiz Results</h2>
      <div className="table-responsive-wrapper">
        <table className="client-data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Quiz Title</th><th>Status</th><th>Score</th><th>Attempts</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {selectedQuiz.results.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No results yet for this quiz.</td></tr>
            )}
            {selectedQuiz.results.map((res, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '600' }}>{res.name}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{res.email}</td>
                <td>{res.status === 'FAILED' ? <span className="badge-quiz-failed">{res.status}</span> : <span className="badge-quiz-passed">{res.status}</span>}</td>
                <td style={{ fontWeight: '600' }}>{res.score}</td>
                <td>{res.attempts}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{res.date}</td>
                <td>
                  <button className="sub-delete-btn" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedQuiz.results.length > 0 && (
          <div className="table-pagination-footer-row">
            <span className="muted-small-text">Showing 1-10 of 10 records</span>
            <div className="pagination-buttons-group">
              <button className="pagination-nav-btn">Previous</button>
              <button className="pagination-page-num active-page">1</button>
              <button className="pagination-page-num">2</button>
              <button className="pagination-page-num">3</button>
              <button className="pagination-page-num">4</button>
              <button className="pagination-nav-btn">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesTab;
