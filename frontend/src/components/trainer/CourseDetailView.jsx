import React from 'react';
import StudentsTab from './tabs/StudentsTab';
import CourseAttendanceTab from './tabs/CourseAttendanceTab';
import AssignmentsTab from './tabs/AssignmentsTab';
import QuizzesTab from './tabs/QuizzesTab';
import ProgressTab from './tabs/ProgressTab';

const CourseDetailView = ({
  selectedCourse, setSelectedCourse, genderSection,
  activeCourseTab, setActiveCourseTab,
  setSelectedAssignment, setSelectedQuiz,

  // students tab
  liveStudents, liveStudentsLoading, searchQuery, setSearchQuery,
  studentsPage, setStudentsPage, setSelectedStudent, setStudentTab,

  // attendance tab
  courseAttendanceDate, setCourseAttendanceDate,

  // assignments tab
  displayedAssignments, assignmentsLoading, openNewAssignmentModal,
  selectedAssignment, selectedSubmission, setSelectedSubmission,
  selectedSubmissionIdx, setSelectedSubmissionIdx,
  getSubApproval, setSubmissionApproval, submitFeedback, submissionFeedback,

  // quizzes tab
  displayedQuizzes, quizzesLoading, openNewQuizModal, selectedQuiz,

  // progress tab
  showComparison, setShowComparison,
}) => {
  const switchTab = (tab) => {
    setActiveCourseTab(tab);
    setSelectedAssignment(null);
    setSelectedQuiz(null);
  };

  return (
    <div className="expanded-course-workspace-card animated-fade">
      <div className="breadcrumbs">
        <span className="breadcrumb-nav-link" onClick={() => { setSelectedCourse(null); }}>Dashboard</span> &gt;
        <span className="breadcrumb-nav-link" onClick={() => setSelectedCourse(null)}> {genderSection}</span> &gt;
        <span className="current-crumb"> {selectedCourse.title}</span>
      </div>
      <div className="course-header-interactive-row"><h2>{selectedCourse.title}</h2></div>
      <div className="tabs-header-navigation-bar">
        <button className={`nav-tab-item-btn ${activeCourseTab === 'students' ? 'tab-active' : ''}`} onClick={() => switchTab('students')}>Students</button>
        <button className={`nav-tab-item-btn ${activeCourseTab === 'attendance' ? 'tab-active' : ''}`} onClick={() => switchTab('attendance')}>Attendance</button>
        <button className={`nav-tab-item-btn ${activeCourseTab === 'assignments' ? 'tab-active' : ''}`} onClick={() => switchTab('assignments')}>Assignments</button>
        <button className={`nav-tab-item-btn ${activeCourseTab === 'quizzes' ? 'tab-active' : ''}`} onClick={() => switchTab('quizzes')}>Quizzes</button>
        <button className={`nav-tab-item-btn ${activeCourseTab === 'progress' ? 'tab-active' : ''}`} onClick={() => switchTab('progress')}>Course Progress</button>
      </div>

      <div className="tab-render-container">
        {activeCourseTab === 'students' && (
          <StudentsTab
            liveStudents={liveStudents}
            liveStudentsLoading={liveStudentsLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            studentsPage={studentsPage}
            setStudentsPage={setStudentsPage}
            setSelectedStudent={setSelectedStudent}
            setStudentTab={setStudentTab}
          />
        )}

        {activeCourseTab === 'attendance' && (
          <CourseAttendanceTab
            courseAttendanceDate={courseAttendanceDate}
            setCourseAttendanceDate={setCourseAttendanceDate}
          />
        )}

        {activeCourseTab === 'assignments' && (
          <AssignmentsTab
            displayedAssignments={displayedAssignments}
            assignmentsLoading={assignmentsLoading}
            openNewAssignmentModal={openNewAssignmentModal}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={setSelectedAssignment}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
            selectedSubmissionIdx={selectedSubmissionIdx}
            setSelectedSubmissionIdx={setSelectedSubmissionIdx}
            getSubApproval={getSubApproval}
            setSubmissionApproval={setSubmissionApproval}
            submitFeedback={submitFeedback}
            submissionFeedback={submissionFeedback}
          />
        )}

        {activeCourseTab === 'quizzes' && (
          <QuizzesTab
            displayedQuizzes={displayedQuizzes}
            quizzesLoading={quizzesLoading}
            openNewQuizModal={openNewQuizModal}
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
          />
        )}

        {activeCourseTab === 'progress' && (
          <ProgressTab showComparison={showComparison} setShowComparison={setShowComparison} />
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;
