import React from 'react';
import { courseAttendanceByDate, monthNames } from '../mockData';

const formatCourseAttendanceHeading = (isoDate) => {
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return isoDate;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[d.getDay()]} ${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()} ${d.getFullYear()}`;
};

const CourseAttendanceTab = ({ courseAttendanceDate, setCourseAttendanceDate }) => {
  const courseAttPresentCount = courseAttendanceByDate.filter(r => r[2] === 'PRESENT').length;
  const courseAttNotMarkedCount = courseAttendanceByDate.filter(r => r[2] === 'NOT MARKED').length;
  const courseAttAbsentCount = Math.max(0, courseAttendanceByDate.length - courseAttPresentCount - courseAttNotMarkedCount);

  return (
    <div className="attendance-view-block">
      <div className="attendance-date-picker-row">
        <label>Select a Date</label>
        <input type="date" className="attendance-date-picker-input" value={courseAttendanceDate} onChange={(e) => setCourseAttendanceDate(e.target.value)} />
      </div>
      <div className="attendance-summary-cards-row">
        <div className="summary-pill-card gray-theme-box"><h5>{courseAttendanceByDate.length}</h5><p>Total Students</p></div>
        <div className="summary-pill-card green-theme-box"><h5>{courseAttPresentCount}</h5><p>Present</p></div>
        <div className="summary-pill-card gray-theme-box"><h5>{courseAttNotMarkedCount}</h5><p>Leave</p></div>
        <div className="summary-pill-card red-theme-box"><h5>{courseAttAbsentCount}</h5><p>Absent</p></div>
      </div>
      <div className="table-responsive-wrapper">
        <div className="attendance-for-date-heading">Attendance for {formatCourseAttendanceHeading(courseAttendanceDate)}</div>
        <table className="client-data-table plain-table">
          <thead><tr><th>Roll #</th><th>Full Name</th><th>Status</th></tr></thead>
          <tbody>{courseAttendanceByDate.map((row, index) => <tr key={index}><td>{row[0]}</td><td>{row[1]}</td><td><span className={row[2] === 'PRESENT' ? 'badge-present-status' : 'badge-notmarked-status'}>{row[2]}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseAttendanceTab;
