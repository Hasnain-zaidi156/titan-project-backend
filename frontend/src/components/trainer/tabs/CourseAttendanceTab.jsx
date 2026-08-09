import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE, monthNames } from '../mockData';

// Format "2026-08-09" → "Sat Aug 9 2026"
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]} ${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()} ${d.getFullYear()}`;
};

const todayISO = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
};

const StatusBadge = ({ status }) => {
  const map = {
    PRESENT:       { cls: 'badge-present-status',     label: 'PRESENT' },
    LEAVE:         { cls: 'badge-notmarked-status',   label: 'LEAVE' },
    ABSENT:        { cls: 'badge-failed-status',      label: 'ABSENT' },
    'NOT MARKED':  { cls: 'badge-notsubmitted-status',label: 'NOT MARKED' },
  };
  const { cls, label } = map[status] || map['NOT MARKED'];
  return <span className={cls}>{label}</span>;
};

const PctBar = ({ pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
      <div style={{
        height: '100%', borderRadius: 3, transition: 'width 0.4s ease',
        background: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444',
        width: `${pct}%`,
      }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, minWidth: 34, color: pct >= 75 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626' }}>
      {pct}%
    </span>
  </div>
);

const CourseAttendanceTab = ({ course }) => {
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [data, setData] = useState({ students: [], classDates: [], totalClassDays: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const courseName = course?.title || '';

  const fetchData = useCallback(async () => {
    if (!courseName) return;
    setLoading(true);
    setError('');
    try {
      const url = `${API_BASE}/api/attendance/by-course?course=${encodeURIComponent(courseName)}&date=${selectedDate}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Server error');
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [courseName, selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { students, classDates, totalClassDays } = data;
  const isClassDay = classDates.includes(selectedDate);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.studentName.toLowerCase().includes(q) || s.rollNumber.includes(search);
    const matchStatus = filterStatus === 'ALL' || s.dateStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const presentCount = students.filter(s => s.dateStatus === 'PRESENT').length;
  const leaveCount   = students.filter(s => s.dateStatus === 'LEAVE').length;
  const absentCount  = students.filter(s => s.dateStatus === 'ABSENT').length;

  return (
    <div className="attendance-view-block animated-fade">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Student Attendance</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {courseName} — {totalClassDays} class{totalClassDays !== 1 ? 'es' : ''} held total
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="date"
            className="attendance-date-picker-input"
            style={{ margin: 0 }}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
          <button onClick={fetchData} className="btn-dark-action" style={{ padding: '8px 14px', fontSize: 13 }}>
            ↻
          </button>
        </div>
      </div>

      {/* Read-only notice */}
      <div style={{
        background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)',
        border: '1px solid #bfdbfe', borderRadius: 8,
        padding: '10px 14px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 13, color: '#1e40af', fontWeight: 600,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Attendance is marked by the Admin. This is a read-only view.
      </div>

      {/* Summary cards */}
      <div className="attendance-summary-cards-row">
        <div className="summary-pill-card gray-theme-box"><h5>{students.length}</h5><p>Total Students</p></div>
        <div className="summary-pill-card" style={{ background: '#eff6ff', border: '1px solid var(--border-color)' }}>
          <h5 style={{ color: '#1e40af' }}>{totalClassDays}</h5><p style={{ color: '#64748b' }}>Classes Held</p>
        </div>
        <div className="summary-pill-card green-theme-box"><h5>{presentCount}</h5><p>Present</p></div>
        <div className="summary-pill-card gray-theme-box"><h5>{leaveCount}</h5><p>Leave</p></div>
        <div className="summary-pill-card red-theme-box"><h5>{absentCount}</h5><p>Absent</p></div>
      </div>

      {/* No-class-day warning */}
      {!isClassDay && selectedDate && !loading && students.length > 0 && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 8, padding: '9px 14px', marginBottom: 14,
          fontSize: 13, color: '#92400e', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Admin ne {formatDate(selectedDate)} ko koi attendance mark nahi ki — ye class nahi thi ya record nahi aya.
        </div>
      )}

      {/* Table */}
      <div className="table-responsive-wrapper">
        <div className="table-filter-header-flex">
          <input
            className="table-search-input-box"
            placeholder="Search by name or roll #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="status-filter-dropdown" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
            <option value="NOT MARKED">Not Marked</option>
          </select>
        </div>

        <div className="attendance-for-date-heading">
          {isClassDay
            ? `Class Attendance — ${formatDate(selectedDate)}`
            : selectedDate
              ? `No attendance recorded for ${formatDate(selectedDate)}`
              : 'Select a date to view'}
        </div>

        {error && (
          <div style={{ padding: 20, textAlign: 'center', color: '#dc2626', fontSize: 13 }}>⚠ {error}</div>
        )}

        <table className="client-data-table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Roll No</th>
              <th>Student</th>
              <th>Status on {formatDate(selectedDate) || '—'}</th>
              <th>Overall Attendance</th>
              <th style={{ textAlign: 'center' }}>P / L / A</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#6b7280' }}>
                  <div style={{
                    display: 'inline-block', width: 20, height: 20,
                    border: '2px solid #e5e7eb', borderTopColor: '#2563eb',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: 10,
                    verticalAlign: 'middle',
                  }} />
                  Loading attendance records from database…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#9ca3af' }}>
                  {students.length === 0
                    ? `"${courseName}" mein koi student registered nahi hai abhi.`
                    : 'Koi student filter se match nahi karta.'}
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => (
                <tr key={s.id || s.rollNumber}>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>{idx + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{s.rollNumber}</td>
                  <td>
                    <div className="user-profile-table-cell">
                      <img
                        src={s.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.studentName)}&backgroundColor=1e40af&textColor=ffffff`}
                        alt=""
                        className="avatar-circle-sm"
                        onError={e => { e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=S&backgroundColor=1e40af&textColor=ffffff'; }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.studentName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.fatherName ? `S/O ${s.fatherName}` : s.batch}</div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={s.dateStatus} /></td>
                  <td style={{ minWidth: 140 }}><PctBar pct={s.percentage} /></td>
                  <td style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ color: '#059669' }}>{s.present}P</span>
                    {' / '}
                    <span style={{ color: '#d97706' }}>{s.leave}L</span>
                    {' / '}
                    <span style={{ color: '#dc2626' }}>{s.absent}A</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="table-pagination-footer-row">
          <span className="muted-small-text">
            {filtered.length} of {students.length} students shown
            {totalClassDays > 0 && ` · ${totalClassDays} total classes held`}
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CourseAttendanceTab;

