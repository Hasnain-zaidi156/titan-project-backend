import React, { useState, useRef } from 'react';
import './Dashboard.css';

const TITAN_LOGO = 'https://i.ibb.co/q3c3CkLS/titan-logo.jpg';
const TITAN_LOGO_BG = 'https://i.ibb.co/Zz3Hk1Q5/titan-logo-bg.jpg';
const SIR_YASIR_PHOTO = 'https://i.ibb.co/wF2jCyRH/WhatsApp-Image-2026-03-18-at-5-47-44-PM.jpg';
const PROFILE_BG_IMG = 'https://i.ibb.co/0FqY1Z2/Whats-App-Image-2026-03-18-at-5-47-44-PM.jpg';

  const Dashboard = ({ onLogout }) => {
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

  // Attendance
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

  const courses = [
    { id: "CRS-001", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Male", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 4, schedule: "Sat 04:00 PM - 06:00 PM | Sun 04:00 PM - 06:00 PM", startedOn: "1 Jun 2026", bgHeader: "#e6fdf4", accentColor: "#10b981" },
    { id: "CRS-002", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 8, schedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM", startedOn: "1 Jun 2026", bgHeader: "#eff2fe", accentColor: "#4f46e5" },
    { id: "CRS-003", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 0, schedule: "Sat 10:00 AM - 12:00 PM | Sun 10:00 AM - 12:00 PM", startedOn: "1 Jun 2026", bgHeader: "#f8fafc", accentColor: "#64748b" },
    { id: "CRS-004", title: "Modern Web Application Development", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 3", progress: 25, enrolled: 30, schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM", startedOn: "1 Jan 2026", bgHeader: "#ffebe9", accentColor: "#ef4444" },
    { id: "CRS-005", title: "Modern Web Application Development", type: "LAB | Male", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 3", progress: 30, enrolled: 28, schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM", startedOn: "1 Jan 2026", bgHeader: "#e3f2fd", accentColor: "#2563eb" },
    { id: "CRS-006", title: "Modern Web Application Development", type: "LAB | Male", campus: "Saylani TITAN Sukkur Campus (Sukkur)", batch: "Batch 1", progress: 40, enrolled: 32, schedule: "Mon 06:00 PM - 08:00 PM | Wed 06:00 PM - 08:00 PM | Fri 06:00 PM - 08:00 PM", startedOn: "1 Jan 2026", bgHeader: "#ede9fe", accentColor: "#7c3aed" }
  ];

  const studentNames = [
    ["Abdul Jabbar", "477526", "abjabbargopang@gmail.com"],
    ["Abdul rafay", "469955", "rafaygameti0345@gmail.com"],
    ["Abdul salam shaikh", "475436", "abdulsalam06699@gmail.com"],
    ["Abdullah Khan", "470278", "ak1636802@gmail.com"],
    ["Abdullah indhar", "467789", "indharabdullah30@gmail.com"],
    ["Ajmal", "472623", "dharejoajmal7@gmail.com"],
    ["Alyan Mehmood Shah Syed", "468526", "alyaly3036@gmail.com"],
    ["Ashraf Ali", "472345", "hamad@1947gmail.com"],
    ["Ayan Arain", "525033", "msayanarain846@gmai.com"],
    ["Faizan khan", "468384", "faizanlala712@gmail.com"]
  ];

  const studentsData = studentNames.map(([name, code, email]) => ({
    name, code, email, status: "ENROLLED",
    img: "https://img.jsdesign.hk/assets/img/6620ca9b6bda6fa0060cf476.jpg"
  }));

  const TOTAL_STUDENT_RECORDS = 106;
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(TOTAL_STUDENT_RECORDS / PAGE_SIZE);

  const studentAttendanceLog = [
    ["Mon, Jun 1, 2026", "Present"], ["Wed, Jun 3, 2026", "Present"], ["Fri, Jun 5, 2026", "Absent"],
    ["Mon, Jun 8, 2026", "Present"], ["Wed, Jun 10, 2026", "Present"], ["Fri, Jun 12, 2026", "Present"],
    ["Mon, Jun 15, 2026", "Present"], ["Wed, Jun 17, 2026", "Present"]
  ];

  // ========== ASSIGNMENTS DATA (Course-level) ==========
  const courseAssignmentsData = [
    {
      id: 1, title: "File managment vs dbms (theory)", description: "theory assignment", topics: "No topics",
      dueDate: "Jun 12, 2026",
      submissions: [
        { name: "Muhammad Talha", email: "talha@gmail.com", status: "Late Submitted", approved: null, link: "https://drive.google.com/file/example1", description: "", files: false },
        { name: "Waqar Ali", email: "waqar@gmail.com", status: "Late Submitted", approved: null, link: "https://drive.google.com/file/example2", description: "waqar submission", files: false },
        { name: "Syed Dawood hashmi", email: "dawood@gmail.com", status: "Late Submitted", approved: null, link: "", description: "", files: false },
        { name: "Salman khan", email: "salman@gmail.com", status: "Submitted", approved: true, link: "https://drive.google.com/file/example3", description: "salman work", files: false },
        { name: "Qaimudin Khuwaja", email: "qaimudin@gmail.com", status: "Submitted", approved: false, link: "https://drive.google.com/file/example4", description: "dbms", files: false },
        { name: "Saqib Ali", email: "saqib@gmail.com", status: "Submitted", approved: true, link: "https://drive.google.com/file/example5", description: "good work", files: false },
        { name: "Abdul Jabbar", email: "abjabbargopang@gmail.com", status: "Submitted", approved: true, link: "https://drive.google.com/file/example6", description: "", files: false },
        { name: "M Hussain", email: "Salmantapali70@gmail.com", status: "Submitted", approved: false, link: "https://drive.google.com/file/d/1nynPyrL5Y_JlCwTL56Yutuy6CZsns-Fn/view?usp=drive_link", description: "dbms", files: false },
      ]
    },
    { id: 2, title: "Galary_App_API_ASSIGNMENT", description: "Tasks to Complete\nAdd Loading State: Display a loading message or spinner while images are...", topics: "No topics", dueDate: "Jun 2, 2026", submissions: [] },
    { id: 3, title: "React js Assignment Using Routing", description: "Home\nAbout...", topics: "No topics", dueDate: "May 7, 2026", submissions: [] },
    { id: 4, title: "REACT JS ASSIGNMENT", description: "https://drive.google.com/file/d/1q6V4w6v9RhJWwtpxjye7gXDsJtvLEyFd/view?usp=sharing", topics: "No topics", dueDate: "Apr 8, 2026", submissions: [] },
    { id: 5, title: "JAVASCRIPT DOM", description: "https://drive.google.com/file/d/1JlwYstIjn4eZg28yPuaHk5FvwUeNXC6x/view?usp=sharing", topics: "No topics", dueDate: "Mar 14, 2026", submissions: [] },
    { id: 6, title: "Web & App Hackathon", description: "Hackathon Guide: View Your Task and Submit Your Work\n...", topics: "No topics", dueDate: "Dec 27, 2025", isHackathon: true, submissions: [] },
    { id: 7, title: "java script assesment test", description: "Check air for share and start your test", topics: "No topics", dueDate: "Dec 1, 2025", submissions: [] },
    { id: 8, title: "If else 8 questions java script", description: "Practice if else conditions", topics: "No topics", dueDate: "Nov 28, 2025", submissions: [] },
  ];

  const studentAssignmentsLog = [
    ["File managment vs dbms (theory)", "Fri, Jun 12, 2026", "Approved", "", null],
    ["Galary_App_API_ASSIGNMENT", "Tue, Jun 2, 2026", "Approved", "", null],
    ["React js Assignment Using Routing", "Thu, May 7, 2026", "Approved", "", null],
    ["REACT JS ASSIGNMENT", "Wed, Apr 8, 2026", "Approved", "", null],
    ["JAVASCRIPT DOM", "Sat, Mar 14, 2026", "Approved", "", null],
    ["Web & App Hackathon", "Sat, Dec 27, 2025", "Approved", "", "Hackathon"],
    ["java script assesment test", "Mon, Dec 1, 2025", "Not Submitted", "", null],
    ["If else 8 questions java script", "Fri, Nov 28, 2025", "Approved", "", null],
    ["Grand CSS Assignment oct 20", "Mon, Oct 27, 2025", "Approved", "", null],
    ["Grid Assignment oct 10", "Mon, Oct 27, 2025", "Approved", "", null],
    ["Animation and transition oct 8", "Mon, Oct 27, 2025", "Approved", "", null],
    ["Portfolio Card Assignment oct 6", "Mon, Oct 27, 2025", "Approved", "", null],
    ["Tribute page sep 24", "Mon, Oct 27, 2025", "Approved", "", null],
    ["Class Assignment sep 14", "Mon, Oct 27, 2025", "Approved", "", null],
    ["HTML Assignmwnt 3 sep", "Mon, Oct 27, 2025", "Approved", "very good work", null]
  ];

  // ========== QUIZZES DATA ==========
  const courseQuizzesData = [
    {
      id: 1, title: "Javascript (Quiz-4)", courses: "Modern Web Application Development, Web and Mobile App Development",
      date: "Jun 15, 2026", expiry: "Jun 15, 2026", status: "ACTIVE",
      results: [
        { name: "Shahbaz Ali", email: "Ahmedshahbazsoomro@gmail.com", status: "FAILED", score: "10 / 40", attempts: 1, date: "Jun 15, 2026, 3:57:02 PM" },
        { name: "Ayan Arain", email: "msayanarain846@gmai.com", status: "FAILED", score: "11 / 40", attempts: 1, date: "Jun 15, 2026, 3:56:51 PM" },
        { name: "Abdul Jabbar", email: "abjabbargopang@gmail.com", status: "FAILED", score: "7 / 40", attempts: 1, date: "Jun 15, 2026, 3:56:45 PM" },
        { name: "Alyan Mehmood Shah Syed", email: "alyaly3036@gmail.com", status: "FAILED", score: "22 / 40", attempts: 1, date: "Jun 15, 2026, 3:56:40 PM" },
        { name: "Muhammad Hassan Memon", email: "hm0078275@gmail.com", status: "FAILED", score: "17 / 40", attempts: 1, date: "Jun 15, 2026, 3:53:25 PM" },
        { name: "Ashraf Ali", email: "Hamad@1947gmail.com", status: "FAILED", score: "16 / 40", attempts: 1, date: "Jun 15, 2026, 3:52:44 PM" },
        { name: "Hameed Ud din", email: "hameeduddinbuttsuk@gmail.com", status: "FAILED", score: "9 / 40", attempts: 1, date: "Jun 15, 2026, 3:52:33 PM" },
        { name: "Shoaib Ahmed", email: "shoaibahmedlaghari34@gmail.com", status: "FAILED", score: "20 / 40", attempts: 1, date: "Jun 15, 2026, 3:52:25 PM" },
        { name: "Muhammad badal", email: "my4089082@gemail.com", status: "FAILED", score: "9 / 40", attempts: 1, date: "Jun 15, 2026, 3:52:09 PM" },
        { name: "Syed Hasnain Zaidi", email: "drzaidil56@gmail.com", status: "FAILED", score: "10 / 40", attempts: 1, date: "Jun 15, 2026, 3:48:53 PM" },
      ]
    },
    { id: 2, title: "Javascript (Quiz-3)", courses: "Modern Web Application Development, Web and Mobile App Development", date: "May 22, 2026", expiry: "May 22, 2026", status: "ACTIVE", results: [] },
    { id: 3, title: "Javascript (Quiz-1)", courses: "Modern Web Application Development, Web and Mobile App Development, JavaScript Crash Course", date: "May 8, 2026", expiry: "May 8, 2026", status: "ACTIVE", results: [] },
    { id: 4, title: "Javascript (Quiz-2)", courses: "Modern Web Application Development, Web and Mobile App Development", date: "May 8, 2026", expiry: "May 8, 2026", status: "ACTIVE", results: [] },
    { id: 5, title: "HTML Quiz", courses: "Modern Web Application Development, Web & Mobile Application Development (Female), Web and Mobile App Development, Techno Kids Course", date: "Nov 12, 2025", expiry: "Nov 12, 2025", status: "ACTIVE", results: [] },
    { id: 6, title: "CSS Quiz", courses: "Modern Web Application Development, Web & Mobile Application Development (Female), Web and Mobile App Development, Techno Kids Course", date: "Nov 12, 2025", expiry: "Nov 12, 2025", status: "ACTIVE", results: [] },
  ];

  const studentQuizzesLog = [
    ["Javascript (Quiz-4)", 33, 40, 1, "Mon, Jun 15, 2026"],
    ["Javascript (Quiz-3)", 32, 40, 1, "Fri, May 22, 2026"],
    ["Javascript (Quiz-2)", 32, 40, 1, "Fri, May 8, 2026"],
    ["Javascript (Quiz-1)", 28, 40, 1, "Fri, May 8, 2026"],
    ["HTML Quiz", 29, 40, 1, "Wed, Nov 12, 2025"],
    ["CSS Quiz", 28, 40, 1, "Wed, Nov 12, 2025"]
  ];

  // ========== COURSE PROGRESS DATA ==========
  const courseProgressData = {
    mySlot: {
      trainer: "Sir Yasir Ali (SUK) - Saylani TITAN Sukkur Campus",
      batch: "Batch 1",
      schedule: "Mon 02:00 PM - 04:00 PM | Wed 02:00 PM - 04:00 PM | Fri 02:00 PM - 04:00 PM",
      overall: 80,
      topicsTotal: 81,
      topicsDone: 65,
      modules: [
        { name: "Web Designing Module", topicsDone: 20, topicsTotal: 20, pct: 100, done: true },
        { name: "Front-End Development", topicsDone: 31, topicsTotal: 31, pct: 100, done: true },
        { name: "Modern Front-End Development", topicsDone: 13, topicsTotal: 14, pct: 93, done: false },
        { name: "Back-End Development", topicsDone: 1, topicsTotal: 16, pct: 6, done: false },
      ]
    },
    otherSlots: [
      { trainer: "Sir SAMMAR ABBAS (SUK) - Saylani TIT...", schedule: "SS 02PM-04PM", pct: 74, topicsDone: 60, topicsTotal: 81 },
      { trainer: "Sir Rajesh Kumar(SUK) - Saylani TITAN...", schedule: "MWF 04PM-06PM", pct: 27, topicsDone: 22, topicsTotal: 81 },
    ]
  };

  const courseAttendanceByDate = [
    ["382282", "Waqar Ali", "PRESENT"], ["463342", "Qaimudin Khuwaja", "NOT MARKED"],
    ["464127", "Muhammad yaseen", "PRESENT"], ["465184", "Muhammad Masood", "PRESENT"],
    ["465921", "Muhammad Bin Azam", "NOT MARKED"], ["466584", "Shoaib Ahmed", "PRESENT"],
    ["466824", "Muhammad Hassan Memon", "PRESENT"], ["467551", "Shahbaz Ali", "PRESENT"],
    ["467643", "Syed Hasnain Zaidi", "PRESENT"], ["467709", "M.Mujtaba khan", "PRESENT"],
    ["467789", "Abdullah indhar", "PRESENT"], ["468384", "Faizan khan", "PRESENT"],
    ["468491", "Tanveer", "PRESENT"], ["468526", "Alyan Mehmood Shah Syed", "PRESENT"]
  ];

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.code.includes(searchQuery)
  );

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const buildCalendarGrid = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const getDayEvents = (day) => {
    if (!day) return [];
    const weekday = new Date(calYear, calMonth, day).getDay();
    const events = [];
    if (weekday === 1 || weekday === 3 || weekday === 5) events.push({ label: "MODERN WEB APPLICATION DEVELO...", color: "#dcfce7" });
    if (weekday === 0 || weekday === 6) {
      events.push({ label: "LITTLE GENIUSES: CODING, DESIGN...", color: "#dcfce7" });
      events.push({ label: "LITTLE GENIUSES: CODING, DESIGN...", color: "#dcfce7" });
    }
    return events;
  };

  const changeMonth = (dir) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCalMonth(m); setCalYear(y);
  };

  const todayMarker = 17;

  const formatCourseAttendanceHeading = (isoDate) => {
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d.getTime())) return isoDate;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[d.getDay()]} ${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()} ${d.getFullYear()}`;
  };

  const courseAttPresentCount = courseAttendanceByDate.filter(r => r[2] === 'PRESENT').length;
  const courseAttNotMarkedCount = courseAttendanceByDate.filter(r => r[2] === 'NOT MARKED').length;
  const courseAttAbsentCount = Math.max(0, courseAttendanceByDate.length - courseAttPresentCount - courseAttNotMarkedCount);

  const maleCourses = courses.filter(c => c.type.includes('Male'));
  const femaleCourses = courses.filter(c => c.type.includes('Female'));
  const maleEnrolledTotal = maleCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const femaleEnrolledTotal = femaleCourses.reduce((sum, c) => sum + c.enrolled, 0);

  const sectionCourses = (genderSection ? courses.filter(c => c.type.includes(genderSection)) : []).filter(c => {
    const q = courseSearchQuery.toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || c.campus.toLowerCase().includes(q) || c.batch.toLowerCase().includes(q);
  });

  // Circular progress SVG helper
  const CircularProgress = ({ pct, size = 44, stroke = 4, color = '#4f46e5' }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pct === 100 ? '#10b981' : pct >= 50 ? color : '#f59e0b'} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill={pct === 100 ? '#10b981' : pct >= 50 ? color : '#f59e0b'} style={{ transform: `rotate(90deg) translate(0, -${size}px)` }}>{pct}%</text>
      </svg>
    );
  };

  // Submission state management
  const [submissionApprovals, setSubmissionApprovals] = useState({});
  const getSubApproval = (assignId, subIdx) => {
    const key = `${assignId}-${subIdx}`;
    if (submissionApprovals[key] !== undefined) return submissionApprovals[key];
    return courseAssignmentsData.find(a => a.id === assignId)?.submissions[subIdx]?.approved ?? null;
  };
  const setSubApproval = (assignId, subIdx, val) => {
    setSubmissionApprovals(prev => ({ ...prev, [`${assignId}-${subIdx}`]: val }));
  };

  return (
    <div className="portal-container">
      <div className="mobile-header-notch-bar">
        <button className="mobile-hamburger-btn" onClick={toggleSidebar} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <img src={TITAN_LOGO} alt="TITAN" className="mobile-brand-logo-img" />
      </div>

      {isSidebarOpen && <div className="sidebar-mobile-overlay-shade" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="toggle-trigger-action" onClick={toggleSidebar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
            {isSidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
          </svg>
        </div>
        <div className="logo-container-vertical">
          <div className="titan-brand-wrapper">
            <img src={TITAN_LOGO} alt="TITAN" className="titan-logo-img" />
            {isSidebarOpen && <h3 className="logo-text-bottom">TITAN</h3>}
          </div>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${currentMenu === 'dashboard' ? 'active' : ''}`} onClick={() => goTo('dashboard')}>
            <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
            {isSidebarOpen && <span className="nav-text">Dashboard</span>}
          </div>
          <div className={`nav-item ${currentMenu === 'calendar' ? 'active' : ''}`} onClick={() => goTo('calendar')}>
            <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {isSidebarOpen && <span className="nav-text">Calendar</span>}
          </div>
          <div className={`nav-item ${currentMenu === 'attendance' ? 'active' : ''}`} onClick={() => goTo('attendance')}>
            <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            {isSidebarOpen && <span className="nav-text">Attendance</span>}
          </div>
        </nav>
        <div className="sidebar-footer">
          {profileMenuOpen && (
            <div className="profile-popup-menu">
              <div className="profile-popup-item" onClick={() => goTo('profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span>Profile</span>
              </div>
              <div className="profile-popup-item logout-popup-item" onClick={handleLogoutAction}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                <span>Log out</span>
              </div>
            </div>
          )}
          <div className="user-profile-wrapper" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <img src={profilePhoto} alt="Avatar" className="table-avatar-img" />
            {isSidebarOpen && (
              <div className="trainer-info">
                <h4>{trainerProfile.name}</h4>
                <p>Trainer</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`main-content ${isSidebarOpen ? 'offset-expanded' : 'offset-collapsed'}`}>

        {/* ===== PROFILE PAGE ===== */}
        {currentMenu === 'profile' && (
          <div className="profile-page-wrapper animated-fade">
            <div className="profile-cover-banner" style={{ backgroundImage: `url(${PROFILE_BG_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="profile-cover-overlay"></div>
              {/* Photo upload wrapper */}
              <div className="profile-cover-avatar-wrap">
                <img src={isEditingProfile ? profilePhotoDraft : profilePhoto} alt="Avatar" className="profile-cover-avatar" />
                {isEditingProfile && (
                  <button className="profile-photo-upload-btn" onClick={() => photoInputRef.current?.click()} title="Change photo">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                  </button>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              </div>
            </div>

            <div className="profile-identity-row">
              <div>
                {isEditingProfile ? (
                  <input type="text" className="profile-name-edit-input" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
                ) : (
                  <h1>{trainerProfile.name}</h1>
                )}
                <span className="role-pill-tag">Trainer</span>
              </div>
              <div className="profile-action-buttons">
                {isEditingProfile ? (
                  <>
                    <button className="btn-outline-action" onClick={cancelEditingProfile}>Cancel</button>
                    <button className="btn-dark-action" onClick={saveProfileEdits}>Save Changes</button>
                  </>
                ) : (
                  <>
                    <button className="btn-outline-action" onClick={startEditingProfile}>Edit Profile</button>
                    <button className="btn-dark-action" onClick={downloadTrainerCard}>Download Card</button>
                  </>
                )}
              </div>
            </div>

            <div className="profile-grid-layout">
              <div className="profile-info-card">
                <h3>Personal Information</h3>
                {isEditingProfile ? (
                  <>
                    <div className="info-row-item"><span className="info-label">Email</span><input className="info-edit-input" value={profileDraft.email} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} /></div>
                    <div className="info-row-item"><span className="info-label">Employee ID</span><input className="info-edit-input" value={profileDraft.employeeId} onChange={(e) => setProfileDraft({ ...profileDraft, employeeId: e.target.value })} /></div>
                    <div className="info-row-item"><span className="info-label">Hourly Rate</span><input className="info-edit-input" value={profileDraft.hourlyRate} onChange={(e) => setProfileDraft({ ...profileDraft, hourlyRate: e.target.value })} /></div>
                    <div className="info-row-item"><span className="info-label">Phone</span><input className="info-edit-input" value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} /></div>
                  </>
                ) : (
                  <>
                    <div className="info-row-item"><span className="info-label">Email</span><span className="info-value">{trainerProfile.email}</span></div>
                    <div className="info-row-item"><span className="info-label">Employee ID</span><span className="info-value">{trainerProfile.employeeId}</span></div>
                    <div className="info-row-item"><span className="info-label">Hourly Rate</span><span className="info-value">{trainerProfile.hourlyRate}</span></div>
                    <div className="info-row-item"><span className="info-label">Phone</span><span className="info-value">{trainerProfile.phone}</span></div>
                  </>
                )}
              </div>
              <div className="profile-info-card">
                <h3>Bio</h3>
                <p className="muted-italic-text">No bio added yet.</p>
              </div>
              <div className="profile-info-card">
                <h3>Social Links</h3>
                <p className="muted-italic-text">No social links added yet.</p>
              </div>
              <div className="profile-info-card">
                <h3>Security</h3>
                <button className="btn-outline-action">Update Password</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== CALENDAR ===== */}
        {currentMenu === 'calendar' && (
          <div className="calendar-page-wrapper animated-fade">
            <h1>Calendar</h1>
            <div className="calendar-card-frame">
              <div className="calendar-month-nav-row">
                <button className="cal-nav-btn" onClick={() => changeMonth(-1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg></button>
                <h3>{monthNames[calMonth]} {calYear}</h3>
                <button className="cal-nav-btn" onClick={() => changeMonth(1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg></button>
              </div>
              <div className="calendar-weekday-header-row">{weekDays.map(d => <div key={d} className="cal-weekday-cell">{d}</div>)}</div>
              <div className="calendar-grid-body">
                {buildCalendarGrid(calMonth, calYear).map((day, idx) => (
                  <div key={idx} className={`cal-day-cell ${day === todayMarker && calMonth === 5 ? 'cal-today' : ''} ${!day ? 'cal-empty' : ''}`}>
                    {day && (<>
                      <div className="cal-day-number-row"><span>{day}</span>{getDayEvents(day).length > 0 && <span className="cal-day-dot"></span>}</div>
                      <div className="cal-events-stack">{getDayEvents(day).slice(0, 2).map((ev, i) => <div key={i} className="cal-event-pill" style={{ background: ev.color }}>{ev.label}</div>)}</div>
                    </>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ATTENDANCE PAGE ===== */}
        {currentMenu === 'attendance' && (
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
        )}

        {/* ===== DASHBOARD ===== */}
        {currentMenu === 'dashboard' && (
          <>
            {!selectedCourse ? (
              <>
                <div className="dashboard-title-row"><h1>Dashboard</h1></div>
                <section className="stats-grid-row">
                  <div className="stat-card"><div className="stat-content"><h3>6</h3><p>Active Courses</p></div><div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg></div></div>
                  <div className="stat-card"><div className="stat-content"><h3>102</h3><p>Enrolled Students</p></div><div className="stat-badge-icon blue-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div></div>
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
            ) : selectedStudent ? (
              /* ===== STUDENT DETAIL VIEW ===== */
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
            ) : (
              /* ===== COURSE DETAIL VIEW ===== */
              <div className="expanded-course-workspace-card animated-fade">
                <div className="breadcrumbs">
                  <span className="breadcrumb-nav-link" onClick={() => { setSelectedCourse(null); setGenderSection(null); }}>Dashboard</span> &gt;
                  <span className="breadcrumb-nav-link" onClick={() => setSelectedCourse(null)}> {genderSection}</span> &gt;
                  <span className="current-crumb"> {selectedCourse.title}</span>
                </div>
                <div className="course-header-interactive-row"><h2>{selectedCourse.title}</h2></div>
                <div className="tabs-header-navigation-bar">
                  <button className={`nav-tab-item-btn ${activeCourseTab === 'students' ? 'tab-active' : ''}`} onClick={() => { setActiveCourseTab('students'); setSelectedAssignment(null); setSelectedQuiz(null); }}>Students</button>
                  <button className={`nav-tab-item-btn ${activeCourseTab === 'attendance' ? 'tab-active' : ''}`} onClick={() => { setActiveCourseTab('attendance'); setSelectedAssignment(null); setSelectedQuiz(null); }}>Attendance</button>
                  <button className={`nav-tab-item-btn ${activeCourseTab === 'assignments' ? 'tab-active' : ''}`} onClick={() => { setActiveCourseTab('assignments'); setSelectedAssignment(null); setSelectedQuiz(null); }}>Assignments</button>
                  <button className={`nav-tab-item-btn ${activeCourseTab === 'quizzes' ? 'tab-active' : ''}`} onClick={() => { setActiveCourseTab('quizzes'); setSelectedAssignment(null); setSelectedQuiz(null); }}>Quizzes</button>
                  <button className={`nav-tab-item-btn ${activeCourseTab === 'progress' ? 'tab-active' : ''}`} onClick={() => { setActiveCourseTab('progress'); setSelectedAssignment(null); setSelectedQuiz(null); }}>Course Progress</button>
                </div>

                <div className="tab-render-container">
                  {/* STUDENTS TAB */}
                  {activeCourseTab === 'students' && (
                    <div className="table-responsive-wrapper">
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
                        <span className="muted-small-text">Showing {(studentsPage - 1) * PAGE_SIZE + 2}-{Math.min(studentsPage * PAGE_SIZE, TOTAL_STUDENT_RECORDS)} of {TOTAL_STUDENT_RECORDS} records</span>
                        <div className="pagination-buttons-group">
                          <button className="pagination-nav-btn" disabled={studentsPage === 1} onClick={() => setStudentsPage(p => Math.max(1, p - 1))}>Previous</button>
                          {[1, 2].map(p => <button key={p} className={`pagination-page-num ${studentsPage === p ? 'active-page' : ''}`} onClick={() => setStudentsPage(p)}>{p}</button>)}
                          <span className="pagination-ellipsis">...</span>
                          <button className={`pagination-page-num ${studentsPage === totalPages ? 'active-page' : ''}`} onClick={() => setStudentsPage(totalPages)}>{totalPages}</button>
                          <button className="pagination-nav-btn" disabled={studentsPage === totalPages} onClick={() => setStudentsPage(p => Math.min(totalPages, p + 1))}>Next</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ATTENDANCE TAB */}
                  {activeCourseTab === 'attendance' && (
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
                  )}

                  {/* ===== ASSIGNMENTS TAB (Course-level) ===== */}
                  {activeCourseTab === 'assignments' && !selectedAssignment && (
                    <div className="workspace-card-view">
                      <div className="tab-action-header-row">
                        <h3>Assignments</h3>
                        <button className="new-item-action-btn" onClick={() => alert('New Assignment form coming soon!')}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          New Assignment
                        </button>
                      </div>
                      <div className="table-responsive-wrapper" style={{ marginTop: '4px' }}>
                        <table className="client-data-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Topics</th>
                              <th>Due Date</th>
                              <th>View</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseAssignmentsData.map((asgn) => (
                              <tr key={asgn.id} className={asgn.isHackathon ? 'hackathon-row' : ''}>
                                <td>
                                  <div className="assignment-title-cell">
                                    <span className={asgn.isHackathon ? 'hackathon-title-text' : ''}>{asgn.title}</span>
                                    {asgn.isHackathon && <span className="hackathon-tag-badge">HACKATHON</span>}
                                  </div>
                                </td>
                                <td className="desc-truncate-cell">{asgn.description.split('\n')[0]}{asgn.description.includes('\n') ? <span className="desc-more">...</span> : ''}</td>
                                <td><span className="no-topics-text">{asgn.topics}</span></td>
                                <td className={asgn.isHackathon ? 'hackathon-date-text' : ''}>{asgn.dueDate}</td>
                                <td>
                                  <button className="eye-action-btn" onClick={() => { setSelectedAssignment(asgn); setSelectedSubmission(asgn.submissions[0] || null); }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                  </button>
                                </td>
                                <td>
                                  <button className="icon-edit-btn" title="Edit">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="table-pagination-footer-row">
                          <span className="muted-small-text">Showing 1-8 of 16 records</span>
                          <div className="pagination-buttons-group">
                            <button className="pagination-nav-btn">Previous</button>
                            <button className="pagination-page-num active-page">1</button>
                            <button className="pagination-page-num">2</button>
                            <button className="pagination-nav-btn">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== ASSIGNMENT SUBMISSION VIEW ===== */}
                  {activeCourseTab === 'assignments' && selectedAssignment && (
                    <div className="submission-view-layout animated-fade">
                      <div className="submission-view-breadcrumb">
                        <span className="breadcrumb-nav-link" onClick={() => setSelectedAssignment(null)}>Assignments</span> &gt; <span className="current-crumb">Submissions</span>
                      </div>
                      <h2 className="submission-view-title">Assignment Submissions</h2>
                      <p className="submission-view-sub">{selectedAssignment.title}.</p>

                      {/* Stats */}
                      <div className="submission-stats-row">
                        <div className="submission-stat-card">
                          <div><span className="sub-stat-num">{selectedAssignment.submissions.length}</span><p>Submissions</p></div>
                          <div className="stat-badge-icon blue-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
                        </div>
                        <div className="submission-stat-card">
                          <div><span className="sub-stat-num">{selectedAssignment.submissions.filter(s => s.approved === true).length}</span><p>Approved</p></div>
                          <div className="stat-badge-icon green-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /><circle cx="12" cy="12" r="10" /></svg></div>
                        </div>
                        <div className="submission-stat-card">
                          <div><span className="sub-stat-num">{selectedAssignment.submissions.filter(s => s.approved === false).length}</span><p>Not Approved</p></div>
                          <div className="stat-badge-icon red-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg></div>
                        </div>
                      </div>

                      {/* Split layout */}
                      <div className="submission-split-layout">
                        {/* Left: list */}
                        <div className="submission-list-panel">
                          <div className="submission-list-header">
                            <h4>Submissions</h4>
                            <input type="text" placeholder="Search..." className="submission-search-input" />
                          </div>
                          <div className="submission-list-items">
                            {selectedAssignment.submissions.length === 0 && <p className="muted-italic-text" style={{ padding: '16px' }}>No submissions yet.</p>}
                            {selectedAssignment.submissions.map((sub, idx) => {
                              const approval = getSubApproval(selectedAssignment.id, idx);
                              const isActive = selectedSubmission === sub;
                              return (
                                <div key={idx} className={`submission-list-item ${isActive ? 'sub-item-active' : ''}`} onClick={() => setSelectedSubmission(sub)}>
                                  <div className="sub-item-avatar-initials">{sub.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
                                  <span className="sub-item-name">{sub.name}</span>
                                  <span className={`sub-item-badge ${sub.status === 'Late Submitted' ? 'sub-badge-late' : approval === true ? 'sub-badge-approved' : approval === false ? 'sub-badge-notapproved' : 'sub-badge-submitted'}`}>
                                    {sub.status === 'Late Submitted' ? '⏱ Late Submitted' : approval === true ? '✓ Approved' : approval === false ? '✗ Not Approved' : '✓ Submitted'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: detail */}
                        {selectedSubmission && (
                          <div className="submission-detail-panel animated-fade">
                            <div className="submission-detail-header">
                              <div>
                                <h3>{selectedSubmission.name}</h3>
                                <p className="sub-detail-email">{selectedSubmission.email}</p>
                              </div>
                              <div className="sub-detail-actions">
                                {(() => {
                                  const subIdx = selectedAssignment.submissions.indexOf(selectedSubmission);
                                  const approval = getSubApproval(selectedAssignment.id, subIdx);
                                  return (
                                    <>
                                      <span className={`sub-status-pill ${approval === true ? 'sub-pill-approved' : approval === false ? 'sub-pill-notapproved' : 'sub-pill-pending'}`}>
                                        {approval === true ? '✓ Approved' : approval === false ? '✗ Not Approved' : 'Pending'}
                                      </span>
                                      <button className="feedback-btn">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Feedback
                                      </button>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Approve/Reject */}
                            <div className="submission-detail-row">
                              <span className="sub-detail-label">Submission</span>
                              <div className="sub-approval-toggle">
                                {(() => {
                                  const subIdx = selectedAssignment.submissions.indexOf(selectedSubmission);
                                  const approval = getSubApproval(selectedAssignment.id, subIdx);
                                  return (
                                    <>
                                      <button className={`sub-toggle-btn ${approval === true ? 'sub-toggle-approved-active' : ''}`} onClick={() => setSubApproval(selectedAssignment.id, subIdx, true)}>Approved</button>
                                      <button className={`sub-toggle-btn ${approval === false ? 'sub-toggle-notapproved-active' : ''}`} onClick={() => setSubApproval(selectedAssignment.id, subIdx, false)}>Not Approved</button>
                                      <button className="sub-delete-btn" title="Delete">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                                      </button>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {selectedSubmission.link && (
                              <div className="submission-detail-row">
                                <span className="sub-detail-label">Link</span>
                                <a href={selectedSubmission.link} className="sub-detail-link" target="_blank" rel="noopener noreferrer">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                  {selectedSubmission.link}
                                </a>
                              </div>
                            )}

                            {selectedSubmission.description && (
                              <div className="submission-detail-row">
                                <span className="sub-detail-label">Description</span>
                                <div className="sub-detail-description-box">{selectedSubmission.description}</div>
                              </div>
                            )}

                            <div className="submission-detail-row">
                              <span className="sub-detail-label">Files</span>
                              <div className="sub-no-files-box">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9l4-4 4 4 4-4 4 4" /></svg>
                                <p>No files found for this submission.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== QUIZZES TAB ===== */}
                  {activeCourseTab === 'quizzes' && !selectedQuiz && (
                    <div className="workspace-card-view">
                      <div className="tab-action-header-row">
                        <h3>Quizzes</h3>
                        <button className="new-item-action-btn" onClick={() => alert('New Quiz form coming soon!')}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          New Quiz
                        </button>
                      </div>
                      <div className="table-responsive-wrapper" style={{ marginTop: '4px' }}>
                        <table className="client-data-table">
                          <thead>
                            <tr><th>Quiz</th><th>Course(s)</th><th>Date</th><th>Expiry</th><th>Status</th><th>Action</th></tr>
                          </thead>
                          <tbody>
                            {courseQuizzesData.map((quiz) => (
                              <tr key={quiz.id}>
                                <td style={{ fontWeight: '600' }}>{quiz.title}</td>
                                <td className="quiz-courses-cell">{quiz.courses}</td>
                                <td>{quiz.date}</td>
                                <td>{quiz.expiry}</td>
                                <td><span className="badge-quiz-active">{quiz.status}</span></td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button className="icon-edit-btn" title="Edit">
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    </button>
                                    <button className="eye-action-btn" title="View Results" onClick={() => setSelectedQuiz(quiz)}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ===== QUIZ RESULTS VIEW ===== */}
                  {activeCourseTab === 'quizzes' && selectedQuiz && (
                    <div className="animated-fade">
                      <div className="submission-view-breadcrumb">
                        <span className="breadcrumb-nav-link" onClick={() => setSelectedQuiz(null)}>Quizzes</span> &gt; <span className="current-crumb">quiz</span>
                      </div>
                      <h2 className="submission-view-title">Quiz Results</h2>
                      <div className="table-responsive-wrapper">
                        <table className="client-data-table">
                          <thead>
                            <tr><th>Name</th><th>Email</th><th>Quiz Title</th><th>Status</th><th>Score</th><th>Attempts</th><th>Date</th><th>Actions</th></tr>
                          </thead>
                          <tbody>
                            {selectedQuiz.results.length === 0 && (
                              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No results yet for this quiz.</td></tr>
                            )}
                            {selectedQuiz.results.map((res, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: '600' }}>{res.name}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{res.email}</td>
                                <td>{res.status === 'FAILED' ? <span className="badge-quiz-failed">{res.status}</span> : <span className="badge-quiz-passed">{res.status}</span>}</td>
                                <td style={{ fontWeight: '600' }}>{res.score}</td>
                                <td>{res.attempts}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{res.date}</td>
                                <td>
                                  <button className="sub-delete-btn" title="Delete">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {selectedQuiz.results.length > 0 && (
                          <div className="table-pagination-footer-row">
                            <span className="muted-small-text">Showing 1-10 of 10 records</span>
                            <div className="pagination-buttons-group">
                              <button className="pagination-nav-btn">Previous</button>
                              <button className="pagination-page-num active-page">1</button>
                              <button className="pagination-page-num">2</button>
                              <button className="pagination-page-num">3</button>
                              <button className="pagination-page-num">4</button>
                              <button className="pagination-nav-btn">Next</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== COURSE PROGRESS ===== */}
                  {activeCourseTab === 'progress' && (
                    <div className="course-progress-overview-block">
                      <div className="progress-compare-header">
                        <div>
                          <p className="progress-compare-label">COMPARE PROGRESS</p>
                          <h3>Course Progress Overview</h3>
                        </div>
                        <button className="progress-compare-toggle-btn" onClick={() => setShowComparison(!showComparison)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                          {showComparison ? 'Only My Progress' : 'Show Comparison'}
                        </button>
                      </div>

                      <div className={`progress-content-layout ${showComparison ? 'progress-split-layout' : ''}`}>
                        {/* My Progress */}
                        <div className="my-progress-panel">
                          <div className="my-progress-panel-header">
                            <div>
                              <p className="my-progress-label">MY PROGRESS</p>
                              <h4>{courseProgressData.mySlot.trainer} <span className="batch-outline-pill">{courseProgressData.mySlot.batch}</span></h4>
                              <p className="muted-small-text">{courseProgressData.mySlot.schedule}</p>
                            </div>
                            <span className="topics-count-badge">Topics: {courseProgressData.mySlot.topicsDone}/{courseProgressData.mySlot.topicsTotal}</span>
                          </div>
                          <div className="overall-progress-label-row">
                            <span>Overall progress</span>
                            <span className="overall-progress-pct">{courseProgressData.mySlot.overall}%</span>
                          </div>
                          <div className="overall-progress-bar-blue">
                            <div style={{ width: `${courseProgressData.mySlot.overall}%` }}></div>
                          </div>
                          <div className="modules-list-new">
                            {courseProgressData.mySlot.modules.map((mod, idx) => (
                              <div key={idx} className="module-row-item">
                                <div className="module-row-left">
                                  {mod.done
                                    ? <span className="module-check-done"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /><circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" /></svg></span>
                                    : <span className="module-check-pending"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>
                                  }
                                  <div>
                                    <p className="module-name">{mod.name}</p>
                                    <p className="module-topics-text">Topics: {mod.topicsDone}/{mod.topicsTotal}</p>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <CircularProgress pct={mod.pct} />
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ cursor: 'pointer' }}><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Other Slots */}
                        {showComparison && (
                          <div className="other-slots-panel">
                            <p className="other-slots-label">OTHER SLOTS OF {courseProgressData.mySlot.batch}</p>
                            <div className="other-slots-grid">
                              {courseProgressData.otherSlots.map((slot, idx) => (
                                <div key={idx} className="other-slot-card">
                                  <div className="other-slot-header">
                                    <span className="other-slot-trainer">{slot.trainer}</span>
                                    <span className="other-slot-pct-badge" style={{ color: slot.pct >= 60 ? '#4f46e5' : '#f59e0b', background: slot.pct >= 60 ? '#eff2fe' : '#fffbeb' }}>{slot.pct}%</span>
                                  </div>
                                  <p className="muted-small-text">{slot.schedule}</p>
                                  <p className="other-slot-covered-label">Covered topics</p>
                                  <div className="other-slot-progress-bar">
                                    <div style={{ width: `${slot.pct}%`, background: slot.pct >= 60 ? '#4f46e5' : '#f59e0b' }}></div>
                                  </div>
                                  <p className="muted-small-text" style={{ marginTop: '4px' }}>{slot.topicsDone}/{slot.topicsTotal}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;