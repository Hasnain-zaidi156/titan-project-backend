import React, { useMemo } from 'react';
import { parseScheduleDays } from './scheduleUtils';

const now = new Date();
// Is week (Sun-Sat) ke real calendar dates, current weekday ke sath.
const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay());
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(startOfWeek);
  d.setDate(startOfWeek.getDate() + i);
  return d;
});
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CoursesHome = ({
  courses, // trainer ke live-computed courses (Dashboard se real student data se banti hain)
  coursesLoading,
  trainer, // logged-in trainer record — Teaching Schedule isi ke slotSchedule se driven hai
  courseSearchQuery, setCourseSearchQuery,
  setSelectedCourse, setActiveCourseTab, setStudentsPage,
  setSelectedAssignment, setSelectedQuiz,
}) => {
  const courseList = courses || [];

  // Teaching Schedule widget — ADMIN NE JO trainer.slotSchedule diya hai
  // sirf wahi din yahan mark hote hain (koi aggregation/guess nahi), taake
  // admin jab bhi days change kare, ye khud-ba-khud sahi din dikhaye.
  const assignedWeekdays = useMemo(() => parseScheduleDays(trainer?.slotSchedule), [trainer?.slotSchedule]);
  const assignedCourseNames = (trainer?.courses && trainer.courses.length > 0)
    ? trainer.courses
    : [...new Set(courseList.map((c) => c.title))];

  if (coursesLoading) {
    return (
      <>
        <div className="dashboard-title-row"><h1>Dashboard</h1></div>
        <p className="muted-italic-text">Loading your courses…</p>
      </>
    );
  }

  const totalEnrolled = courseList.reduce((sum, c) => sum + c.enrolled, 0);

  const filteredCourses = courseList.filter(c => {
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
            {weekDates.map((d, i) => {
              const isTeachingDay = assignedWeekdays.includes(i);
              const isCurrent = d.toDateString() === now.toDateString();
              return (
                <div
                  key={i}
                  className={`day-pill${isTeachingDay ? ' present' : ''}${isCurrent ? ' current' : ''}`}
                  title={isTeachingDay ? assignedCourseNames.join(', ') : 'No class'}
                >
                  {WEEKDAY_LABELS[i]} <span>{d.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-title-bar gender-section-header-row">
        <h3>All Courses</h3>
        <input type="text" className="table-search-input-box gender-course-search-box" placeholder="Search course, campus or batch..." value={courseSearchQuery} onChange={(e) => setCourseSearchQuery(e.target.value)} />
      </div>
      <section className="courses-responsive-grid">
        {filteredCourses.length === 0 && <p className="muted-italic-text">No courses match your search.</p>}
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-clean-card" onClick={() => { setSelectedCourse(course); setActiveCourseTab('students'); setStudentsPage(1); setSelectedAssignment(null); setSelectedQuiz(null); }}>
            <div className="card-top-accent" style={{ backgroundColor: course.bgHeader }}>
              <div><h4>{course.title}</h4><span className="subtitle-tag">All Students</span></div>
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
  );
};

export default CoursesHome;
