import React from 'react';
import { studentAttendanceLog, studentAssignmentsLog, studentQuizzesLog } from './mockData';

const StudentDetailView = ({
  selectedCourse, selectedStudent, setSelectedStudent, setSelectedCourse, setGenderSection,
  studentTab, setStudentTab,
}) => {
  return (
    <div className="expanded-course-workspace-card animated-fade">
      <div className="breadcrumbs">
        <span className="breadcrumb-nav-link" onClick={() => { setSelectedCourse(null); setSelectedStudent(null); setGenderSection(null); }}>Dashboard</span> &gt;
        <span className="breadcrumb-nav-link" onClick={() => setSelectedStudent(null)}> {selectedCourse.title}</span> &gt;
        <span className="current-crumb"> {selectedStudent.name}</span>
      </div>
      <div className="tabs-header-navigation-bar">
        <button className={`nav-tab-item-btn ${studentTab === 'attendance' ? 'tab-active' : ''}`} onClick={() => setStudentTab('attendance')}>Attendance</button>
        <button className={`nav-tab-item-btn ${studentTab === 'assignments' ? 'tab-active' : ''}`} onClick={() => setStudentTab('assignments')}>Assignments</button>
        <button className={`nav-tab-item-btn ${studentTab === 'quizzes' ? 'tab-active' : ''}`} onClick={() => setStudentTab('quizzes')}>Quizzes</button>
      </div>

      {studentTab === 'attendance' && (() => {
        const totalClasses = 125, present = 111, leave = 5, absent = 9;
        const attPercent = Math.round((present / totalClasses) * 100);
        const isGood = attPercent >= 75;
        return (
          <div className="tab-render-container">
            <section className="attendance-stat-cards-row student-stats-row">
              <div className="attendance-stat-card"><div><h3>{totalClasses}</h3><p>Total Classes</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{present}</h3><p>Present</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{leave}</h3><p>Leave</p></div><div className="stat-badge-icon amber-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{absent}</h3><p>Absent</p></div><div className="stat-badge-icon red-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg></div></div>
            </section>
            <div className="attendance-overview-card">
              <h3>Attendance Overview</h3>
              <div className="overview-progress-rail"><div className="overview-progress-fill" style={{ width: `${attPercent}%`, background: isGood ? '#10b981' : '#ef4444' }}></div></div>
              {isGood ? <p className="attendance-good-text">Your attendance is good. Keep it up!</p> : <p className="attendance-warning-text">Your attendance is below 75%. Please improve your attendance.</p>}
            </div>
            <div className="attendance-month-table-card">
              <div className="attendance-month-header-row">
                <h3>Attendance: Jun 2026</h3>
                <select className="month-select-dropdown" defaultValue="Jun 2026"><option>Jun 2026</option></select>
              </div>
              <div className="table-responsive-wrapper">
                <table className="client-data-table plain-table">
                  <thead><tr><th>Date</th><th>Status</th></tr></thead>
                  <tbody>{studentAttendanceLog.map((row, idx) => <tr key={idx}><td>{row[0]}</td><td><span className={row[1] === 'Present' ? 'badge-present-status' : 'badge-notmarked-status'}>{row[1]}</span></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {studentTab === 'assignments' && (() => {
        const total = studentAssignmentsLog.length;
        const submitted = studentAssignmentsLog.filter(a => a[2] !== 'Not Submitted').length;
        const approved = studentAssignmentsLog.filter(a => a[2] === 'Approved').length;
        const notApproved = studentAssignmentsLog.filter(a => a[2] === 'Not Approved').length;
        return (
          <div className="tab-render-container">
            <section className="attendance-stat-cards-row student-stats-row">
              <div className="attendance-stat-card"><div><h3>{total}</h3><p>Total Assignments</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{submitted}</h3><p>Submitted</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{approved}</h3><p>Approved</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
              <div className="attendance-stat-card"><div><h3>{notApproved}</h3><p>Not Approved</p></div><div className="stat-badge-icon red-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg></div></div>
            </section>
            <div className="attendance-month-table-card">
              <div className="attendance-month-header-row"><h3>Assignments</h3></div>
              <div className="table-responsive-wrapper">
                <table className="client-data-table">
                  <thead><tr><th>#</th><th>Title</th><th>Due Date</th><th>Submission</th><th>Feedback</th></tr></thead>
                  <tbody>
                    {studentAssignmentsLog.map((row, idx) => {
                      const [title, dueDate, submission, feedback, tag] = row;
                      let badgeClass = 'badge-notsubmitted-status';
                      if (submission === 'Approved') badgeClass = 'badge-approved-status';
                      else if (submission === 'Not Approved') badgeClass = 'badge-notapproved-status';
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td><div className="assignment-title-cell"><span>{title}</span>{tag && <span className="hackathon-tag-badge">{tag}</span>}</div></td>
                          <td>{dueDate}</td>
                          <td><span className={badgeClass}>{submission}</span></td>
                          <td className="feedback-text-cell">{feedback ? feedback : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {studentTab === 'quizzes' && (
        <div className="tab-render-container">
          <div className="quiz-results-card-frame">
            <h3>Quiz Results</h3>
            <div className="table-responsive-wrapper">
              <table className="client-data-table">
                <thead><tr><th>#</th><th>Quiz Title</th><th>Score</th><th>Total Questions</th><th>Percentage</th><th>Attempts</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {studentQuizzesLog.map((row, idx) => {
                    const [title, score, totalQ, attempts, date] = row;
                    const pct = Math.round((score / totalQ) * 100);
                    const passed = pct >= 50;
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td><td>{title}</td><td>{score}</td><td>{totalQ}</td>
                        <td><span className={passed ? 'quiz-percentage-passed' : 'quiz-percentage-failed'}>{pct}%</span></td>
                        <td>{attempts}</td>
                        <td><span className={passed ? 'badge-passed-status' : 'badge-failed-status'}>{passed ? 'Passed' : 'Failed'}</span></td>
                        <td>{date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailView;
