// ============================================================
// Static / demo data used across the Admin (trainer) portal.
// Pulled out of Dashboard.jsx so the main component stays small.
// ============================================================

export const TITAN_LOGO = 'https://i.ibb.co/q3c3CkLS/titan-logo.jpg';
export const TITAN_LOGO_BG = 'https://i.ibb.co/Zz3Hk1Q5/titan-logo-bg.jpg';
export const SIR_YASIR_PHOTO = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
export const PROFILE_BG_IMG = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const courses = [
  { id: "CRS-001", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Male", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 4, schedule: "Sat 04:00 PM - 06:00 PM | Sun 04:00 PM - 06:00 PM", startedOn: "1 Jun 2026", bgHeader: "#e6fdf4", accentColor: "#10b981" },
  { id: "CRS-002", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 8, schedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM", startedOn: "1 Jun 2026", bgHeader: "#eff2fe", accentColor: "#4f46e5" },
  { id: "CRS-003", title: "Little Geniuses: Coding, Design & AI Fun Lab", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 1", progress: 0, enrolled: 0, schedule: "Sat 10:00 AM - 12:00 PM | Sun 10:00 AM - 12:00 PM", startedOn: "1 Jun 2026", bgHeader: "#f8fafc", accentColor: "#64748b" },
  { id: "CRS-004", title: "Modern Web Application Development", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 3", progress: 25, enrolled: 30, schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM", startedOn: "1 Jan 2026", bgHeader: "#ffebe9", accentColor: "#ef4444" },
  { id: "CRS-005", title: "Modern Web Application Development", type: "LAB | Male", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 3", progress: 30, enrolled: 28, schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM", startedOn: "1 Jan 2026", bgHeader: "#e3f2fd", accentColor: "#2563eb" },
  { id: "CRS-006", title: "Modern Web Application Development", type: "LAB | Male", campus: "Saylani TITAN Sukkur Campus (Sukkur)", batch: "Batch 1", progress: 40, enrolled: 32, schedule: "Mon 06:00 PM - 08:00 PM | Wed 06:00 PM - 08:00 PM | Fri 06:00 PM - 08:00 PM", startedOn: "1 Jan 2026", bgHeader: "#ede9fe", accentColor: "#7c3aed" },
  { id: "CRS-007", title: "Graphic Designing", type: "LAB | Male", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 2", progress: 55, enrolled: 18, schedule: "Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM", startedOn: "1 Mar 2026", bgHeader: "#fff7ed", accentColor: "#f97316" },
  { id: "CRS-008", title: "Graphic Designing", type: "LAB | Female", campus: "TITAN Ghotki Campus (Ghotki)", batch: "Batch 2", progress: 50, enrolled: 15, schedule: "Mon 02:00 PM - 04:00 PM | Wed 02:00 PM - 04:00 PM | Fri 02:00 PM - 04:00 PM", startedOn: "1 Mar 2026", bgHeader: "#fdf4ff", accentColor: "#a855f7" },
];

export const studentNames = [
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

export const studentsData = studentNames.map(([name, code, email]) => ({
  name, code, email, status: "ENROLLED",
  img: "https://img.jsdesign.hk/assets/img/6620ca9b6bda6fa0060cf476.jpg"
}));

export const TOTAL_STUDENT_RECORDS = 106;
export const PAGE_SIZE = 10;

export const studentAttendanceLog = [
  ["Mon, Jun 1, 2026", "Present"], ["Wed, Jun 3, 2026", "Present"], ["Fri, Jun 5, 2026", "Absent"],
  ["Mon, Jun 8, 2026", "Present"], ["Wed, Jun 10, 2026", "Present"], ["Fri, Jun 12, 2026", "Present"],
  ["Mon, Jun 15, 2026", "Present"], ["Wed, Jun 17, 2026", "Present"]
];

// ========== ASSIGNMENTS DATA (Course-level) ==========
export const courseAssignmentsData = [
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

export const studentAssignmentsLog = [
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
export const courseQuizzesData = [
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

export const studentQuizzesLog = [
  ["Javascript (Quiz-4)", 33, 40, 1, "Mon, Jun 15, 2026"],
  ["Javascript (Quiz-3)", 32, 40, 1, "Fri, May 22, 2026"],
  ["Javascript (Quiz-2)", 32, 40, 1, "Fri, May 8, 2026"],
  ["Javascript (Quiz-1)", 28, 40, 1, "Fri, May 8, 2026"],
  ["HTML Quiz", 29, 40, 1, "Wed, Nov 12, 2025"],
  ["CSS Quiz", 28, 40, 1, "Wed, Nov 12, 2025"]
];

// ========== COURSE PROGRESS DATA ==========
export const courseProgressData = {
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

export const courseAttendanceByDate = [
  ["382282", "Waqar Ali", "PRESENT"], ["463342", "Qaimudin Khuwaja", "NOT MARKED"],
  ["464127", "Muhammad yaseen", "PRESENT"], ["465184", "Muhammad Masood", "PRESENT"],
  ["465921", "Muhammad Bin Azam", "NOT MARKED"], ["466584", "Shoaib Ahmed", "PRESENT"],
  ["466824", "Muhammad Hassan Memon", "PRESENT"], ["467551", "Shahbaz Ali", "PRESENT"],
  ["467643", "Syed Hasnain Zaidi", "PRESENT"], ["467709", "M.Mujtaba khan", "PRESENT"],
  ["467789", "Abdullah indhar", "PRESENT"], ["468384", "Faizan khan", "PRESENT"],
  ["468491", "Tanveer", "PRESENT"], ["468526", "Alyan Mehmood Shah Syed", "PRESENT"]
];

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
