import React from 'react';
import {
  modalOverlayStyle, modalCardStyle, modalHeaderStyle, modalCloseBtnStyle,
  modalLabelStyle, modalInputStyle, modalActionsStyle, modalCancelBtnStyle, modalPrimaryBtnStyle,
} from './modalStyles';

const NewAssignmentModal = ({
  show, setShow, selectedCourse,
  newAssignmentForm, setNewAssignmentForm,
  assignmentFormError, creatingAssignment, submitNewAssignment,
}) => {
  if (!show) return null;

  return (
    <div style={modalOverlayStyle} onClick={() => !creatingAssignment && setShow(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>New Assignment</h2>
          <button style={modalCloseBtnStyle} onClick={() => setShow(false)}>✕</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          For {selectedCourse?.title} — visible to students the moment you save it.
        </p>

        <label style={modalLabelStyle}>Title *</label>
        <input
          style={modalInputStyle}
          value={newAssignmentForm.title}
          onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
          placeholder="e.g. React Router Assignment"
        />

        <label style={modalLabelStyle}>Description</label>
        <textarea
          style={{ ...modalInputStyle, minHeight: '90px', resize: 'vertical' }}
          value={newAssignmentForm.description}
          onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
          placeholder="Instructions for students..."
        />

        <label style={modalLabelStyle}>Due Date *</label>
        <input
          type="date"
          style={modalInputStyle}
          value={newAssignmentForm.dueDate}
          onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
        />

        {assignmentFormError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{assignmentFormError}</p>}

        <div style={modalActionsStyle}>
          <button style={modalCancelBtnStyle} onClick={() => setShow(false)} disabled={creatingAssignment}>Cancel</button>
          <button style={modalPrimaryBtnStyle} onClick={submitNewAssignment} disabled={creatingAssignment}>
            {creatingAssignment ? 'Publishing…' : 'Publish Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAssignmentModal;
