import React, { useEffect, useState } from 'react';
import { API_BASE } from './constants';

const AttendancePage = ({
  courses,
  attendanceCourseFilter, setAttendanceCourseFilter,
  attCourseDropdownOpen, setAttCourseDropdownOpen,
  attendanceView, setAttendanceView,
}) => {
  const courseList = courses || [];
  const activeCourse = courseList[attendanceCourseFilter] || null;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!activeCourse?.title) { setRows([]); return; }
    setLoading(true);
    fetch(`${API_BASE}/api/attendance/by-course?course=${encodeURIComponent(activeCourse.title)}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setRows(Array.isArray(data.students) ? data.students : []); })
      .catch((err) => { console.error('Failed to load attendance:', err); if (!cancelled) setRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeCourse?.title]);

  const totalClasses = rows.length ? Math.max(...rows.map((r) => r.totalClasses || 0)) : 0;
  const avgPct = rows.length ? Math.round(rows.reduce((s, r) => s + (r.percentage || 0), 0) / rows.length) : 0;

  if (!courseList.length) {
    return (
      <div className="attendance-page-wrapper animated-fade">
        <div className="attendance-top-header-row"><h1>Attendance</h1></div>
        <div className="no-records-found-state">No courses assigned to you yet — ask admin to assign a course.</div>
      </div>
    );
  }

  return (
    <div className="attendance-page-wrapper animated-fade">
      <div className="attendance-top-header-row">
        <h1>Attendance</h1>
        <div className="course-selector-dropdown-wrap">
          <div className="course-selector-trigger" onClick={() => setAttCourseDropdownOpen(!attCourseDropdownOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <div><strong>{activeCourse?.title}</strong><p>{activeCourse?.schedule}</p></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {attCourseDropdownOpen && (
            <div className="course-selector-options-list">
              {courseList.map((c, idx) => (
                <div key={c.id} className="course-selector-option-item" onClick={() => { setAttendanceCourseFilter(idx); setAttCourseDropdownOpen(false); }}>{c.title} — {c.type}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="attendance-stats-header-row">
        <div><h3>Overall Stats</h3></div>
        <div className="overall-slot-toggle-group">
          <button className={`toggle-pill-btn ${attendanceView === 'overall' ? 'toggle-active' : ''}`} onClick={() => setAttendanceView('overall')}>Overall</button>
          <button className={`toggle-pill-btn ${attendanceView === 'slot' ? 'toggle-active' : ''}`} onClick={() => setAttendanceView('slot')}>This Slot</button>
        </div>
      </div>
      <section className="attendance-stat-cards-row">
        <div className="attendance-stat-card"><div><h3>{totalClasses}</h3><p>Total Classes Held</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg></div></div>
        <div className="attendance-stat-card"><div><h3>{rows.length}</h3><p>Enrolled Students</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></div>
        <div className="attendance-stat-card"><div><h3>{avgPct}%</h3><p>Average Attendance</p></div><div className="stat-badge-icon red-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></div>
      </section>
      <div className="attendance-records-card-frame">
        <div className="attendance-records-header-row">
          <div><h3>Attendance Records</h3><p className="muted-small-text">Course: {activeCourse?.title} - {activeCourse?.schedule}</p></div>
        </div>
        {loading ? (
          <div className="no-records-found-state">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="no-records-found-state">No attendance records found.</div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="client-data-table">
              <thead><tr><th>Roll No</th><th>Student</th><th>Present</th><th>Leave</th><th>Absent</th><th>%</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.rollNumber}>
                    <td>{r.rollNumber}</td><td>{r.studentName}</td>
                    <td>{r.present}</td><td>{r.leave}</td><td>{r.absent}</td>
                    <td>{r.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
