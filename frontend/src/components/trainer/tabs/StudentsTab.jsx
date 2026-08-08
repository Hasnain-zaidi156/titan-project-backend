import React from 'react';
import { studentsData, TOTAL_STUDENT_RECORDS, PAGE_SIZE } from '../mockData';

const StudentsTab = ({
  liveStudents, liveStudentsLoading,
  searchQuery, setSearchQuery,
  studentsPage, setStudentsPage,
  setSelectedStudent, setStudentTab,
}) => {
  const liveStudentsMapped = liveStudents.map((s) => ({
    id: s.id, name: s.studentName, code: s.rollNumber, email: s.email || '—',
    status: (s.status || 'pending').toUpperCase(), img: 'https://img.jsdesign.hk/assets/img/6620ca9b6bda6fa0060cf476.jpg',
  }));
  const effectiveStudentsData = liveStudentsMapped.length > 0 ? liveStudentsMapped : studentsData;
  const totalPages = Math.ceil(TOTAL_STUDENT_RECORDS / PAGE_SIZE);

  const filteredStudents = effectiveStudentsData.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.code.includes(searchQuery)
  );

  return (
    <div className="table-responsive-wrapper">
      {liveStudentsMapped.length > 0 && (
        <p className="muted-small-text" style={{ marginBottom: 8 }}>
          Showing {liveStudentsMapped.length} registered student{liveStudentsMapped.length === 1 ? '' : 's'} from the admin database{liveStudentsLoading ? ' (refreshing…)' : ''}.
        </p>
      )}
      <div className="table-filter-header-flex">
        <input type="text" placeholder="Search students..." className="table-search-input-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select className="status-filter-dropdown" defaultValue="All"><option>All</option><option>Enrolled</option><option>Pending</option></select>
      </div>
      <table className="client-data-table">
        <thead><tr><th>Name</th><th>Roll Number</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {filteredStudents.map((st, index) => (
            <tr key={index}>
              <td><div className="user-profile-table-cell"><img src={st.img} alt="" className="avatar-circle-sm" /><span>{st.name}</span></div></td>
              <td>{st.code}</td><td>{st.email}</td>
              <td><span className="badge-enrolled-status">{st.status}</span></td>
              <td><button className="eye-action-btn" onClick={() => { setSelectedStudent(st); setStudentTab('attendance'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-pagination-footer-row">
        <span className="muted-small-text">
          {liveStudentsMapped.length > 0
            ? `Showing ${filteredStudents.length} of ${liveStudentsMapped.length} records`
            : `Showing ${(studentsPage - 1) * PAGE_SIZE + 2}-${Math.min(studentsPage * PAGE_SIZE, TOTAL_STUDENT_RECORDS)} of ${TOTAL_STUDENT_RECORDS} records`}
        </span>
        <div className="pagination-buttons-group">
          <button className="pagination-nav-btn" disabled={studentsPage === 1} onClick={() => setStudentsPage(p => Math.max(1, p - 1))}>Previous</button>
          {[1, 2].map(p => <button key={p} className={`pagination-page-num ${studentsPage === p ? 'active-page' : ''}`} onClick={() => setStudentsPage(p)}>{p}</button>)}
          <span className="pagination-ellipsis">...</span>
          <button className={`pagination-page-num ${studentsPage === totalPages ? 'active-page' : ''}`} onClick={() => setStudentsPage(totalPages)}>{totalPages}</button>
          <button className="pagination-nav-btn" disabled={studentsPage === totalPages} onClick={() => setStudentsPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default StudentsTab;
