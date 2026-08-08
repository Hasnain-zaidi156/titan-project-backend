import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import './ThemeToggle.css';

import { API_BASE, SIR_YASIR_PHOTO, TITAN_LOGO, courses, courseAssignmentsData, courseQuizzesData } from './mockData';
import Sidebar from './Sidebar';
import ProfilePage from './ProfilePage';
import CalendarPage from './CalendarPage';
import AttendancePage from './AttendancePage';
import CoursesHome from './CoursesHome';
import StudentDetailView from './StudentDetailView';
import CourseDetailView from './CourseDetailView';
import NewAssignmentModal from './NewAssignmentModal';
import NewQuizModal from './NewQuizModal';

const Dashboard = ({ onLogout }) => {
  // ===== Theme (dark / light mode) =====
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('titan-trainer-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('titan-trainer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeCourseTab, setActiveCourseTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentTab, setStudentTab] = useState('attendance');
  const [studentsPage, setStudentsPage] = useState(1);

  // Calendar state
  const [calMonth, setCalMonth] = useState(5);
  const [calYear, setCalYear] = useState(2026);

  // Attendance (top-level)
  const [attendanceCourseFilter, setAttendanceCourseFilter] = useState(0);
  const [attendanceView, setAttendanceView] = useState('overall');
  const [attCourseDropdownOpen, setAttCourseDropdownOpen] = useState(false);
  const [courseAttendanceDate, setCourseAttendanceDate] = useState('2026-06-17');

  // Gender section
  const [genderSection, setGenderSection] = useState(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  // Assignment submission view
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedSubmissionIdx, setSelectedSubmissionIdx] = useState(-1);
  const [submissionFeedback, setSubmissionFeedback] = useState({}); // `${assignId}-${idx}` -> text

  // Quiz view
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Course Progress comparison toggle
  const [showComparison, setShowComparison] = useState(false);

  // Profile editing + photo upload
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [trainerProfile, setTrainerProfile] = useState({
    name: 'Sir Yasir Ali (SUK)',
    email: 'yasirlashari131@gmail.com',
    employeeId: '15353',
    hourlyRate: '*******/hr',
    phone: '03033742231'
  });
  const [profileDraft, setProfileDraft] = useState(trainerProfile);
  const [profilePhoto, setProfilePhoto] = useState(SIR_YASIR_PHOTO);
  const [profilePhotoDraft, setProfilePhotoDraft] = useState(SIR_YASIR_PHOTO);
  const photoInputRef = useRef(null);

  // ===== Live Assignments / Quizzes (synced with the Student Portal via the backend) =====
  const [liveAssignments, setLiveAssignments] = useState([]);
  const [liveQuizzes, setLiveQuizzes] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [assignmentFormError, setAssignmentFormError] = useState('');

  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [newQuizForm, setNewQuizForm] = useState({ title: '', date: '', expiry: '', totalQuestions: 40 });
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [quizFormError, setQuizFormError] = useState('');

  const fetchLiveAssignments = async (course) => {
    if (!course) return;
    setAssignmentsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/assignments?course=${encodeURIComponent(course)}`);
      const data = await res.json();
      setLiveAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setLiveAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchLiveQuizzes = async (course) => {
    if (!course) return;
    setQuizzesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/quizzes?course=${encodeURIComponent(course)}`);
      const data = await res.json();
      setLiveQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
      setLiveQuizzes([]);
    } finally {
      setQuizzesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && activeCourseTab === 'assignments') fetchLiveAssignments(selectedCourse.title);
    if (selectedCourse && activeCourseTab === 'quizzes') fetchLiveQuizzes(selectedCourse.title);
  }, [selectedCourse, activeCourseTab]);

  // Maps a backend Assignment doc onto the same shape the existing demo
  // table/detail UI already expects, so no rendering code has to change.
  const mapLiveAssignment = (a) => ({
    id: a.id,
    _isLive: true,
    title: a.title,
    description: a.description || 'No description provided.',
    topics: 'No topics',
    dueDate: a.dueDate,
    submissions: (a.submissions || []).map((s) => ({
      id: s.id,
      name: s.studentName,
      email: s.rollNumber,
      status: s.status,
      approved: s.approved,
      link: s.link,
      description: s.description,
      files: false,
    })),
  });

  const mapLiveQuiz = (q) => ({
    id: q.id,
    _isLive: true,
    title: q.title,
    courses: q.course,
    date: q.date,
    expiry: q.expiry,
    status: q.status,
    results: (q.results || []).map((r) => ({
      name: r.studentName,
      email: r.rollNumber,
      status: r.status,
      score: `${r.score} / ${r.totalQuestions}`,
      attempts: r.attempts,
      date: r.date,
    })),
  });

  const openNewAssignmentModal = () => {
    setNewAssignmentForm({ title: '', description: '', dueDate: '' });
    setAssignmentFormError('');
    setShowNewAssignmentModal(true);
  };

  const submitNewAssignment = async () => {
    if (!newAssignmentForm.title.trim() || !newAssignmentForm.dueDate) {
      setAssignmentFormError('Title and due date are required.');
      return;
    }
    setCreatingAssignment(true);
    setAssignmentFormError('');
    try {
      const res = await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssignmentForm.title.trim(),
          description: newAssignmentForm.description.trim(),
          dueDate: newAssignmentForm.dueDate,
          course: selectedCourse.title,
          campus: selectedCourse.campus,
          batch: selectedCourse.batch,
          createdBy: trainerProfile.employeeId,
          createdByName: trainerProfile.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create assignment');
      setLiveAssignments((prev) => [data, ...prev]);
      setShowNewAssignmentModal(false);
    } catch (err) {
      setAssignmentFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setCreatingAssignment(false);
    }
  };

  const openNewQuizModal = () => {
    setNewQuizForm({ title: '', date: '', expiry: '', totalQuestions: 40 });
    setQuizFormError('');
    setShowNewQuizModal(true);
  };

  const submitNewQuiz = async () => {
    if (!newQuizForm.title.trim() || !newQuizForm.date || !newQuizForm.expiry) {
      setQuizFormError('Title, date and expiry are required.');
      return;
    }
    setCreatingQuiz(true);
    setQuizFormError('');
    try {
      const res = await fetch(`${API_BASE}/api/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newQuizForm.title.trim(),
          date: newQuizForm.date,
          expiry: newQuizForm.expiry,
          totalQuestions: Number(newQuizForm.totalQuestions) || 40,
          course: selectedCourse.title,
          campus: selectedCourse.campus,
          createdBy: trainerProfile.employeeId,
          createdByName: trainerProfile.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create quiz');
      setLiveQuizzes((prev) => [data, ...prev]);
      setShowNewQuizModal(false);
    } catch (err) {
      setQuizFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setCreatingQuiz(false);
    }
  };

  // Approve / reject a submission — updates the backend for live
  // assignments, and falls back to local-only state for the demo rows.
  const setSubmissionApproval = async (assignment, subIdx, approved) => {
    if (assignment._isLive) {
      const submission = assignment.submissions[subIdx];
      try {
        const res = await fetch(`${API_BASE}/api/assignments/${assignment.id}/submissions/${submission.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved }),
        });
        const data = await res.json();
        if (res.ok) {
          setLiveAssignments((prev) => prev.map((a) => (a.id === data.id ? data : a)));
          setSelectedAssignment(mapLiveAssignment(data));
          setSelectedSubmission(mapLiveAssignment(data).submissions[subIdx]);
        }
      } catch (err) {
        console.error('Failed to update submission:', err);
      }
    } else {
      setSubApproval(assignment.id, subIdx, approved);
    }
  };

  const submitFeedback = async (assignment, subIdx) => {
    const key = `${assignment.id}-${subIdx}`;
    const text = window.prompt('Feedback for this submission:', submissionFeedback[key] || '');
    if (text === null) return;
    setSubmissionFeedback((prev) => ({ ...prev, [key]: text }));
    if (assignment._isLive) {
      const submission = assignment.submissions[subIdx];
      try {
        await fetch(`${API_BASE}/api/assignments/${assignment.id}/submissions/${submission.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback: text }),
        });
      } catch (err) {
        console.error('Failed to save feedback:', err);
      }
    }
  };

  // ===== Live students (from the admin database) for the selected course =====
  const [liveStudents, setLiveStudents] = useState([]);
  const [liveStudentsLoading, setLiveStudentsLoading] = useState(false);

  const fetchLiveStudents = async (course) => {
    if (!course) return;
    setLiveStudentsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students`);
      const data = await res.json();
      const forCourse = (Array.isArray(data) ? data : []).filter((s) => s.course === course);
      setLiveStudents(forCourse);
    } catch (err) {
      console.error('Failed to load students:', err);
      setLiveStudents([]);
    } finally {
      setLiveStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && activeCourseTab === 'students') fetchLiveStudents(selectedCourse.title);
  }, [selectedCourse, activeCourseTab]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const goTo = (menu) => {
    setCurrentMenu(menu);
    setSelectedCourse(null);
    setSelectedStudent(null);
    setGenderSection(null);
    setCourseSearchQuery('');
    setIsSidebarOpen(false);
    setProfileMenuOpen(false);
    setSelectedAssignment(null);
    setSelectedQuiz(null);
  };

  const handleLogoutAction = () => {
    setIsSidebarOpen(false);
    setSelectedCourse(null);
    setGenderSection(null);
    setCourseSearchQuery('');
    setCurrentMenu('dashboard');
    setProfileMenuOpen(false);
    if (onLogout) onLogout();
  };

  const startEditingProfile = () => {
    setProfileDraft(trainerProfile);
    setProfilePhotoDraft(profilePhoto);
    setIsEditingProfile(true);
  };

  const saveProfileEdits = () => {
    setTrainerProfile(profileDraft);
    setProfilePhoto(profilePhotoDraft);
    setIsEditingProfile(false);
  };

  const cancelEditingProfile = () => {
    setProfileDraft(trainerProfile);
    setProfilePhotoDraft(profilePhoto);
    setIsEditingProfile(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhotoDraft(ev.target.result);
    reader.readAsDataURL(file);
  };

  const downloadTrainerCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    const drawRoundedRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1e40af');
    grad.addColorStop(1, '#4338ca');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(30, 30, 640, 360, 16);
    ctx.fill();
    const initials = trainerProfile.name.replace(/\(.*?\)/g, '').trim().split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    ctx.beginPath();
    ctx.arc(115, 130, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#1e40af';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 115, 134);
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(trainerProfile.name, 190, 112);
    ctx.fillStyle = '#eff6ff';
    drawRoundedRect(190, 124, 78, 26, 6);
    ctx.fill();
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('Trainer', 203, 142);
    ctx.strokeStyle = '#eaeaea';
    ctx.beginPath();
    ctx.moveTo(60, 210);
    ctx.lineTo(640, 210);
    ctx.stroke();
    const details = [['Email', trainerProfile.email], ['Employee ID', trainerProfile.employeeId], ['Hourly Rate', trainerProfile.hourlyRate], ['Phone', trainerProfile.phone]];
    let y = 245;
    details.forEach(([label, value]) => {
      ctx.fillStyle = '#666666';
      ctx.font = '13px Arial, sans-serif';
      ctx.fillText(label, 60, y);
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillText(String(value), 230, y);
      y += 34;
    });
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText('TITAN — Taj Institute of Technology and Applied Networks', 60, 372);
    const link = document.createElement('a');
    link.download = `${trainerProfile.name.replace(/[^a-zA-Z0-9]+/g, '_')}_TITAN_Card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const changeMonth = (dir) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCalMonth(m); setCalYear(y);
  };

  // Live (real, teacher-created) items first, then the original demo rows —
  // so the page never looks empty even before any real data exists.
  const displayedAssignments = [...liveAssignments.map(mapLiveAssignment), ...courseAssignmentsData];
  const displayedQuizzes = [...liveQuizzes.map(mapLiveQuiz), ...courseQuizzesData];

  // Submission state management
  const [submissionApprovals, setSubmissionApprovals] = useState({});
  const getSubApproval = (assignId, subIdx) => {
    const liveMatch = liveAssignments.find((a) => a.id === assignId);
    if (liveMatch) return liveMatch.submissions[subIdx]?.approved ?? null;
    const key = `${assignId}-${subIdx}`;
    if (submissionApprovals[key] !== undefined) return submissionApprovals[key];
    return courseAssignmentsData.find(a => a.id === assignId)?.submissions[subIdx]?.approved ?? null;
  };
  const setSubApproval = (assignId, subIdx, val) => {
    setSubmissionApprovals(prev => ({ ...prev, [`${assignId}-${subIdx}`]: val }));
  };

  return (
    <div className="portal-container">
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        )}
      </button>

      <div className="mobile-header-notch-bar">
        <button className="mobile-hamburger-btn" onClick={toggleSidebar} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <img
          src={TITAN_LOGO}
          alt="TITAN"
          className="mobile-brand-logo-img"
          style={theme === 'dark' ? { background: '#fff', borderRadius: '8px', padding: '3px' } : undefined}
        />
      </div>

      {isSidebarOpen && <div className="sidebar-mobile-overlay-shade" onClick={() => setIsSidebarOpen(false)}></div>}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentMenu={currentMenu}
        goTo={goTo}
        profileMenuOpen={profileMenuOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        handleLogoutAction={handleLogoutAction}
        profilePhoto={profilePhoto}
        trainerProfile={trainerProfile}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className={`main-content ${isSidebarOpen ? 'offset-expanded' : 'offset-collapsed'}`}>

        {currentMenu === 'profile' && (
          <ProfilePage
            trainerProfile={trainerProfile}
            profilePhoto={profilePhoto}
            isEditingProfile={isEditingProfile}
            profileDraft={profileDraft}
            setProfileDraft={setProfileDraft}
            profilePhotoDraft={profilePhotoDraft}
            photoInputRef={photoInputRef}
            handlePhotoChange={handlePhotoChange}
            startEditingProfile={startEditingProfile}
            saveProfileEdits={saveProfileEdits}
            cancelEditingProfile={cancelEditingProfile}
            downloadTrainerCard={downloadTrainerCard}
          />
        )}

        {currentMenu === 'calendar' && (
          <CalendarPage calMonth={calMonth} calYear={calYear} changeMonth={changeMonth} />
        )}

        {currentMenu === 'attendance' && (
          <AttendancePage
            attendanceCourseFilter={attendanceCourseFilter}
            setAttendanceCourseFilter={setAttendanceCourseFilter}
            attCourseDropdownOpen={attCourseDropdownOpen}
            setAttCourseDropdownOpen={setAttCourseDropdownOpen}
            attendanceView={attendanceView}
            setAttendanceView={setAttendanceView}
          />
        )}

        {currentMenu === 'dashboard' && (
          <>
            {!selectedCourse ? (
              <CoursesHome
                genderSection={genderSection}
                setGenderSection={setGenderSection}
                courseSearchQuery={courseSearchQuery}
                setCourseSearchQuery={setCourseSearchQuery}
                setSelectedCourse={setSelectedCourse}
                setActiveCourseTab={setActiveCourseTab}
                setStudentsPage={setStudentsPage}
                setSelectedAssignment={setSelectedAssignment}
                setSelectedQuiz={setSelectedQuiz}
              />
            ) : selectedStudent ? (
              <StudentDetailView
                selectedCourse={selectedCourse}
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
                setSelectedCourse={setSelectedCourse}
                setGenderSection={setGenderSection}
                studentTab={studentTab}
                setStudentTab={setStudentTab}
              />
            ) : (
              <CourseDetailView
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                genderSection={genderSection}
                activeCourseTab={activeCourseTab}
                setActiveCourseTab={setActiveCourseTab}
                setSelectedAssignment={setSelectedAssignment}
                setSelectedQuiz={setSelectedQuiz}

                liveStudents={liveStudents}
                liveStudentsLoading={liveStudentsLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                studentsPage={studentsPage}
                setStudentsPage={setStudentsPage}
                setSelectedStudent={setSelectedStudent}
                setStudentTab={setStudentTab}

                courseAttendanceDate={courseAttendanceDate}
                setCourseAttendanceDate={setCourseAttendanceDate}

                displayedAssignments={displayedAssignments}
                assignmentsLoading={assignmentsLoading}
                openNewAssignmentModal={openNewAssignmentModal}
                selectedAssignment={selectedAssignment}
                selectedSubmission={selectedSubmission}
                setSelectedSubmission={setSelectedSubmission}
                selectedSubmissionIdx={selectedSubmissionIdx}
                setSelectedSubmissionIdx={setSelectedSubmissionIdx}
                getSubApproval={getSubApproval}
                setSubmissionApproval={setSubmissionApproval}
                submitFeedback={submitFeedback}
                submissionFeedback={submissionFeedback}

                displayedQuizzes={displayedQuizzes}
                quizzesLoading={quizzesLoading}
                openNewQuizModal={openNewQuizModal}
                selectedQuiz={selectedQuiz}

                showComparison={showComparison}
                setShowComparison={setShowComparison}
              />
            )}
          </>
        )}
      </main>

      <NewAssignmentModal
        show={showNewAssignmentModal}
        setShow={setShowNewAssignmentModal}
        selectedCourse={selectedCourse}
        newAssignmentForm={newAssignmentForm}
        setNewAssignmentForm={setNewAssignmentForm}
        assignmentFormError={assignmentFormError}
        creatingAssignment={creatingAssignment}
        submitNewAssignment={submitNewAssignment}
      />

      <NewQuizModal
        show={showNewQuizModal}
        setShow={setShowNewQuizModal}
        selectedCourse={selectedCourse}
        newQuizForm={newQuizForm}
        setNewQuizForm={setNewQuizForm}
        quizFormError={quizFormError}
        creatingQuiz={creatingQuiz}
        submitNewQuiz={submitNewQuiz}
      />
    </div>
  );
};

export default Dashboard;
