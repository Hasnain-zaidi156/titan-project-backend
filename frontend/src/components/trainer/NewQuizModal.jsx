import React from 'react';
import {
  modalOverlayStyle, modalCardStyle, modalHeaderStyle, modalCloseBtnStyle,
  modalLabelStyle, modalInputStyle, modalActionsStyle, modalCancelBtnStyle, modalPrimaryBtnStyle,
} from './modalStyles';

const NewQuizModal = ({
  show, setShow, selectedCourse,
  newQuizForm, setNewQuizForm,
  quizFormError, creatingQuiz, submitNewQuiz,
}) => {
  if (!show) return null;

  return (
    <div style={modalOverlayStyle} onClick={() => !creatingQuiz && setShow(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>New Quiz</h2>
          <button style={modalCloseBtnStyle} onClick={() => setShow(false)}>✕</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          For {selectedCourse?.title} — visible to students the moment you save it.
        </p>

        <label style={modalLabelStyle}>Quiz Title *</label>
        <input
          style={modalInputStyle}
          value={newQuizForm.title}
          onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
          placeholder="e.g. Javascript (Quiz-5)"
        />

        <label style={modalLabelStyle}>Total Questions</label>
        <input
          type="number"
          min="1"
          style={modalInputStyle}
          value={newQuizForm.totalQuestions}
          onChange={(e) => setNewQuizForm({ ...newQuizForm, totalQuestions: e.target.value })}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Date *</label>
            <input
              type="date"
              style={modalInputStyle}
              value={newQuizForm.date}
              onChange={(e) => setNewQuizForm({ ...newQuizForm, date: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Expiry *</label>
            <input
              type="date"
              style={modalInputStyle}
              value={newQuizForm.expiry}
              onChange={(e) => setNewQuizForm({ ...newQuizForm, expiry: e.target.value })}
            />
          </div>
        </div>

        {quizFormError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{quizFormError}</p>}

        <div style={modalActionsStyle}>
          <button style={modalCancelBtnStyle} onClick={() => setShow(false)} disabled={creatingQuiz}>Cancel</button>
          <button style={modalPrimaryBtnStyle} onClick={submitNewQuiz} disabled={creatingQuiz}>
            {creatingQuiz ? 'Publishing…' : 'Publish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewQuizModal;
