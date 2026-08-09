import React from 'react';
import { courses as allMockCourses } from './mockData';

const CoursesHome = ({
  courses, // trainer ke assigned courses (Dashboard se aata hai); na aaye to sab mock courses dikhte hain
  genderSection, setGenderSection,
  courseSearchQuery, setCourseSearchQuery,
  setSelectedCourse, setActiveCourseTab, setStudentsPage,
  setSelectedAssignment, setSelectedQuiz,
}) => {
  const courseList = courses || allMockCourses;
  const maleCourses = courseList.filter(c => c.type.includes('Male'));
  const femaleCourses = courseList.filter(c => c.type.includes('Female'));
  const maleEnrolledTotal = maleCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const femaleEnrolledTotal = femaleCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const totalEnrolled = maleEnrolledTotal + femaleEnrolledTotal;

  const sectionCourses = (genderSection ? courseList.filter(c => c.type.includes(genderSection)) : []).filter(c => {
    const q = courseSearchQuery.toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || c.campus.toLowerCase().includes(q) || c.batch.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="dashboard-title-row"><h1>Dashboard</h1></div>
      <section className="stats-grid-row">
        <div className="stat-card"><div className="stat-content"><h3>{courseList.length}</h3><p>Active Courses</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{totalEnrolled}</h3><p>Enrolled Students</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>0</h3><p>Total Assignments</p></div><div className="stat-badge-icon purple-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div></div>
        <div className="schedule-compact-widget">
          <div className="schedule-title-row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>Teaching Schedule</div>
          <div className="schedule-days-flex">
            <div className="day-pill present">Sun <span>14</span></div>
            <div className="day-pill present">Mon <span>15</span></div>
            <div className="day-pill">Tue <span>16</span></div>
            <div className="day-pill current">Wed <span>17</span></div>
            <div className="day-pill">Thu <span>18</span></div>
            <div className="day-pill present">Fri <span>19</span></div>
            <div className="day-pill present">Sat <span>20</span></div>
          </div>
        </div>
      </section>

      {!genderSection ? (
        <>
          <div className="section-title-bar"><h3>Active Courses</h3></div>
          <section className="gender-section-grid">
            <div className="gender-section-card male-section-card" onClick={() => { setGenderSection('Male'); setCourseSearchQuery(''); }}>
              <div className="gender-section-icon-badge blue-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></svg></div>
              <h3>Male Courses</h3>
              <p className="gender-section-meta">{maleCourses.length} active courses · {maleEnrolledTotal} students</p>
              <span className="gender-section-arrow">View courses →</span>
            </div>
            <div className="gender-section-card female-section-card" onClick={() => { setGenderSection('Female'); setCourseSearchQuery(''); }}>
              <div className="gender-section-icon-badge purple-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></svg></div>
              <h3>Female Courses</h3>
              <p className="gender-section-meta">{femaleCourses.length} active courses · {femaleEnrolledTotal} students</p>
              <span className="gender-section-arrow">View courses →</span>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="breadcrumbs">
            <span className="breadcrumb-nav-link" onClick={() => { setGenderSection(null); setCourseSearchQuery(''); }}>Active Courses</span> &gt; <span className="current-crumb">{genderSection}</span>
          </div>
          <div className="section-title-bar gender-section-header-row">
            <h3>{genderSection} Courses</h3>
            <input type="text" className="table-search-input-box gender-course-search-box" placeholder="Search course, campus or batch..." value={courseSearchQuery} onChange={(e) => setCourseSearchQuery(e.target.value)} />
          </div>
          <section className="courses-responsive-grid">
            {sectionCourses.length === 0 && <p className="muted-italic-text">No courses match your search.</p>}
            {sectionCourses.map((course) => (
              <div key={course.id} className="course-clean-card" onClick={() => { setSelectedCourse(course); setActiveCourseTab('students'); setStudentsPage(1); setSelectedAssignment(null); setSelectedQuiz(null); }}>
                <div className="card-top-accent" style={{ backgroundColor: course.bgHeader }}>
                  <div><h4>{course.title}</h4><span className="subtitle-tag">{course.type}</span></div>
                  <span className="batch-outline-pill">{course.batch}</span>
                </div>
                <div className="card-body-content">
                  <p className="location-text">{course.campus}</p>
                  <div className="progress-container-box">
                    <div className="flex-space-between text-small"><span>Progress</span><span>{course.progress}% Completed</span></div>
                    <div className="progress-bar-rail"><div className="progress-bar-fill-track" style={{ width: `${course.progress}%`, backgroundColor: course.accentColor }}></div></div>
                  </div>
                  <div className="meta-footer-info">
                    <div>Enrolled: {course.enrolled} students</div>
                    <div>Schedule: {course.schedule}</div>
                    <div>Started On: {course.startedOn}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
};

export default CoursesHome;
