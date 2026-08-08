// Shared inline styles for the New Assignment / New Quiz / Submission
// detail modals — kept in one place so every modal file looks the same.

export const modalOverlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
};

export const modalCardStyle = {
  background: '#fff', borderRadius: '14px', padding: '24px', width: '100%', maxWidth: '440px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto',
};

export const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

export const modalCloseBtnStyle = {
  background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '28px', height: '28px',
  cursor: 'pointer', fontSize: '14px', color: '#475569',
};

export const modalLabelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '14px', marginBottom: '6px' };

export const modalInputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
  fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit',
};

export const modalActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' };

export const modalCancelBtnStyle = {
  padding: '9px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff',
  cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#334155',
};

export const modalPrimaryBtnStyle = {
  padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#4f46e5',
  cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff',
};
