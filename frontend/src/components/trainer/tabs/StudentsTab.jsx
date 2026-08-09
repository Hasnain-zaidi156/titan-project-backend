import React from 'react';
import { studentsData, TOTAL_STUDENT_RECORDS, PAGE_SIZE } from '../mockData';

const StudentsTab = ({
  liveStudents, liveStudentsLoading,
  searchQuery, setSearchQuery,
  studentsPage, setStudentsPage,
  setSelectedStudent, setStudentTab,
}) => {
  const liveStudentsMapped = (liveStudents || []).map((s) => ({
    id: s.id || s._id,
    name: s.studentName || s.name || 'Student',
    code: s.rollNumber || s.admissionNo || '—',
    email: s.email || '—',
    status: (s.status || 'enrolled').toUpperCase(),
    img: s.photo || 'https://img.jsdesign.hk/assets/img/6620ca9b6bda6fa0060cf476.jpg',
  }));

  const filteredStudents = liveStudentsMapped.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.code.includes(searchQuery)
  );

  return (
    <div className="table-responsive-wrapper">
      <div className="table-filter-header-flex">
        <input type="text" placeholder="Search students..." className="table-search-input-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select className="status-filter-dropdown" defaultValue="All"><option>All</option><option>ENROLLED</option><option>PENDING</option></select>
      </div>
      <table className="client-data-table">
        <thead><tr><th>Name</th><th>Roll Number</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {liveStudentsLoading ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>Loading students from database…</td></tr>
          ) : filteredStudents.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No registered students found for this course and shift.</td></tr>
          ) : (
            filteredStudents.map((st, index) => (
              <tr key={st.id || index}>
                <td><div className="user-profile-table-cell"><img src={st.img} alt="" className="avatar-circle-sm" /><span>{st.name}</span></div></td>
                <td>{st.code}</td><td>{st.email}</td>
                <td><span className="badge-enrolled-status">{st.status}</span></td>
                <td><button className="eye-action-btn" onClick={() => { setSelectedStudent(st); setStudentTab('attendance'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="table-pagination-footer-row">
        <span className="muted-small-text">
          Showing {filteredStudents.length} of {liveStudentsMapped.length} records
        </span>
      </div>
    </div>
  );
};

export default StudentsTab;
