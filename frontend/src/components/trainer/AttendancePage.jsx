import React from 'react';
import { courses } from './mockData';

const AttendancePage = ({
  attendanceCourseFilter, setAttendanceCourseFilter,
  attCourseDropdownOpen, setAttCourseDropdownOpen,
  attendanceView, setAttendanceView,
}) => {
  return (
    <div className="attendance-page-wrapper animated-fade">
      <div className="attendance-top-header-row">
        <h1>Attendance</h1>
        <div className="course-selector-dropdown-wrap">
          <div className="course-selector-trigger" onClick={() => setAttCourseDropdownOpen(!attCourseDropdownOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <div><strong>{courses[attendanceCourseFilter].title}</strong><p>{courses[attendanceCourseFilter].schedule}</p></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {attCourseDropdownOpen && (
            <div className="course-selector-options-list">
              {courses.map((c, idx) => (
                <div key={c.id} className="course-selector-option-item" onClick={() => { setAttendanceCourseFilter(idx); setAttCourseDropdownOpen(false); }}>{c.title} — {c.type}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="attendance-stats-header-row">
        <div><h3>Overall Stats</h3><p className="muted-small-text">20 May 2026 — 20 Jun 2026</p></div>
        <div className="overall-slot-toggle-group">
          <button className={`toggle-pill-btn ${attendanceView === 'overall' ? 'toggle-active' : ''}`} onClick={() => setAttendanceView('overall')}>Overall</button>
          <button className={`toggle-pill-btn ${attendanceView === 'slot' ? 'toggle-active' : ''}`} onClick={() => setAttendanceView('slot')}>This Slot</button>
        </div>
      </div>
      <section className="attendance-stat-cards-row">
        <div className="attendance-stat-card"><div><h3>0</h3><p>Total Classes</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg></div></div>
        <div className="attendance-stat-card"><div><h3>0m</h3><p>Total Time Served</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></div>
        <div className="attendance-stat-card"><div><h3>0m</h3><p>Total Late Time</p></div><div className="stat-badge-icon red-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></div>
      </section>
      <div className="attendance-records-card-frame">
        <div className="attendance-records-header-row">
          <div><h3>Attendance Records</h3><p className="muted-small-text">Course: {courses[attendanceCourseFilter].title} - {courses[attendanceCourseFilter].schedule}</p></div>
          <div className="date-range-inputs-row">
            <div className="date-input-block"><label>START DATE</label><input type="text" defaultValue="May 20" readOnly /></div>
            <span className="date-range-arrow">→</span>
            <div className="date-input-block"><label>END DATE</label><input type="text" defaultValue="Jun 20" readOnly /></div>
          </div>
        </div>
        <div className="no-records-found-state">No attendance records found.</div>
        <div className="table-pagination-footer-row">
          <span className="muted-small-text">Showing 1-0 of 0 records</span>
          <div className="pagination-buttons-group">
            <button className="pagination-nav-btn" disabled>Previous</button>
            <button className="pagination-page-num active-page">1</button>
            <button className="pagination-nav-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
