// Mock Database for TITAN (Taj Institute of Technology and Applied Networks)

export const studentProfile = {
  name: "Muhammad Bilal",
  cnic: "42101-1234567-9",
  dob: "2002-05-15",
  email: "muhammad.bilal@titan.edu.pk",
  phone: "+92 300 1234567",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
  campus: "TITAN Main Campus (Karachi)",
  rollNo: "TITAN-2026-9812",
  gender: "Male"
};

export const studentCourses = [
  {
    id: "mwad-101",
    title: "Modern Web Application Development",
    batch: "Batch 3",
    instructor: "Sir Yasir Ali",
    progress: 26,
    schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    started: "01 Jan 2026",
    enrolled: 30,
    campus: "TITAN Ghatki Campus (Ghotki)",
    syllabus: [
      "HTML5 Semantics & CSS3 Layouts",
      "Modern JavaScript & ES6+ Features",
      "React JS Foundations",
      "Dynamic States & Custom Hooks",
      "Routing & Context API State Management",
      "Production Deployments & Optimization"
    ],
    lectures: [
      { id: 1, title: "Lecture 1: Introduction to React and Vite Scaffolding", duration: "1h 10m", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 2, title: "Lecture 2: JSX Syntax, Props and Render Mechanics", duration: "1h 25m", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 3, title: "Lecture 3: State Hook (useState) and Event Handling", duration: "1h 40m", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 4, title: "Lecture 4: Custom Layouts and Flex/Grid Integration", duration: "1h 15m", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    materials: [
      { name: "Syllabus_Outline_Web_Dev.pdf", size: "1.2 MB", type: "PDF" },
      { name: "React_Cheat_Sheet_v1.pdf", size: "3.4 MB", type: "PDF" },
      { name: "JavaScript_ES6_Exercises.zip", size: "8.7 MB", type: "ZIP" }
    ]
  },
  {
    id: "cdai-202",
    title: "Little Geniuses: Coding, Design & AI Fun Lab",
    batch: "Batch 1",
    instructor: "Sir Yasir Ali",
    progress: 0,
    schedule: "Sat 04:00 PM - 06:00 PM | Sun 04:00 PM - 06:00 PM",
    started: "01 Jun 2026",
    enrolled: 4,
    campus: "TITAN Ghatki Campus (Ghotki)",
    syllabus: [
      "Scratch Block Programming Mechanics",
      "Visual UI/UX Sketching Basics",
      "AI Prompting & Creative Writing",
      "Interactive Smart Bots & Games"
    ],
    lectures: [
      { id: 1, title: "Lecture 1: Getting Started with Block Controls", duration: "45m", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    materials: [
      { name: "Scratch_Project_Guide.pdf", size: "4.1 MB", type: "PDF" }
    ]
  }
];

export const initialStudentAssignments = [
  {
    id: "assign-1",
    courseId: "mwad-101",
    courseTitle: "Modern Web Application Development",
    title: "Responsive Flexbox/Grid Page Layout",
    deadline: "2026-06-25",
    points: 100,
    status: "Submitted",
    submittedDate: "2026-06-12",
    fileUrl: "portfolio_project.zip",
    grade: 92,
    feedback: "Exceptional grid layout and attention to color balance. Good job!"
  },
  {
    id: "assign-2",
    courseId: "mwad-101",
    courseTitle: "Modern Web Application Development",
    title: "React Todo List with LocalStorage Persistence",
    deadline: "2026-06-30",
    points: 100,
    status: "Pending",
    submittedDate: null,
    fileUrl: null,
    grade: null,
    feedback: null
  },
  {
    id: "assign-3",
    courseId: "cdai-202",
    courseTitle: "Little Geniuses: Coding, Design & AI Fun Lab",
    title: "Create a Custom Interactive Sprite Game",
    deadline: "2026-07-05",
    points: 100,
    status: "Pending",
    submittedDate: null,
    fileUrl: null,
    grade: null,
    feedback: null
  }
];

export const initialStudentAttendance = {
  "mwad-101": [
    { date: "2026-06-01", status: "Present" },
    { date: "2026-06-03", status: "Present" },
    { date: "2026-06-05", status: "Present" },
    { date: "2026-06-07", status: "Absent" },
    { date: "2026-06-08", status: "Present" },
    { date: "2026-06-10", status: "Present" },
    { date: "2026-06-12", status: "Present" },
    { date: "2026-06-14", status: "Present" },
    { date: "2026-06-15", status: "Present" }
  ],
  "cdai-202": [
    { date: "2026-06-02", status: "Present" },
    { date: "2026-06-09", status: "Present" },
    { date: "2026-06-16", status: "Present" }
  ]
};

export const trainerProfile = {
  name: "Sir Yasir Ali (SUK)",
  email: "yasirlashari131@gmail.com",
  role: "Trainer",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
  designation: "Senior Software Architect & IT Instructor",
  campus: "TITAN Sukkur & Ghatki Campuses"
};

export const trainerBatches = [
  {
    id: "batch-lg-male-1",
    course: "Little Geniuses: Coding, Design & AI Fun Lab",
    gender: "Male",
    campus: "TITAN Ghatki Campus (Ghotki)",
    batch: "Batch 1",
    enrolled: 4,
    schedule: "Sat 04:00 PM - 06:00 PM | Sun 04:00 PM - 06:00 PM",
    started: "01 Jun 2026",
    progress: 0
  },
  {
    id: "batch-lg-female-1",
    course: "Little Geniuses: Coding, Design & AI Fun Lab",
    gender: "Female",
    campus: "TITAN Ghatki Campus (Ghotki)",
    batch: "Batch 1",
    enrolled: 8,
    schedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM",
    started: "01 Jun 2026",
    progress: 0
  },
  {
    id: "batch-lg-female-empty",
    course: "Little Geniuses: Coding, Design & AI Fun Lab",
    gender: "Female",
    campus: "TITAN Ghatki Campus (Ghotki)",
    batch: "Batch 1",
    enrolled: 0,
    schedule: "Sat 10:00 AM - 12:00 PM | Sun 10:00 AM - 12:00 PM",
    started: "01 Jun 2026",
    progress: 0
  },
  {
    id: "batch-mwad-female-3",
    course: "Modern Web Application Development",
    gender: "Female",
    campus: "TITAN Ghatki Campus (Ghotki)",
    batch: "Batch 3",
    enrolled: 30,
    schedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    started: "01 Jan 2026",
    progress: 26
  },
  {
    id: "batch-mwad-male-3",
    course: "Modern Web Application Development",
    gender: "Male",
    campus: "TITAN Ghatki Campus (Ghotki)",
    batch: "Batch 3",
    enrolled: 25,
    schedule: "Sat 10:00 AM - 12:00 PM | Sun 10:00 AM - 12:00 PM",
    started: "01 Jun 2026",
    progress: 0
  },
  {
    id: "batch-mwad-male-suk-1",
    course: "Modern Web Application Development",
    gender: "Male",
    campus: "TITAN Sukkur Campus (Sukkur)",
    batch: "Batch 1",
    enrolled: 18,
    schedule: "Sat 02:00 PM - 04:00 PM | Sun 02:00 PM - 04:00 PM",
    started: "01 Jun 2026",
    progress: 0
  }
];

export const initialTrainerStudents = [
  { id: "stud-1", name: "Muhammad Bilal", rollNo: "TITAN-2026-9812", batchId: "batch-mwad-female-3", attendance: "Present", submittedAssignment: true, grade: 92, feedback: "Exceptional grid layout and attention to color balance. Good job!" },
  { id: "stud-2", name: "Ayesha Ahmed", rollNo: "TITAN-2026-1209", batchId: "batch-mwad-female-3", attendance: "Present", submittedAssignment: true, grade: null, feedback: null },
  { id: "stud-3", name: "Zainab Fatima", rollNo: "TITAN-2026-7789", batchId: "batch-mwad-female-3", attendance: "Present", submittedAssignment: false, grade: null, feedback: null },
  { id: "stud-4", name: "Fatima Noor", rollNo: "TITAN-2026-3029", batchId: "batch-mwad-female-3", attendance: "Absent", submittedAssignment: true, grade: 85, feedback: "Nicely built, but needs minor responsive corrections." },
  
  { id: "stud-5", name: "Syed Hamza", rollNo: "TITAN-2026-5561", batchId: "batch-mwad-male-3", attendance: "Present", submittedAssignment: false, grade: null, feedback: null },
  { id: "stud-6", name: "Ali Raza", rollNo: "TITAN-2026-6672", batchId: "batch-mwad-male-3", attendance: "Absent", submittedAssignment: false, grade: null, feedback: null },
  
  { id: "stud-7", name: "Abdul Wahab", rollNo: "TITAN-2026-1100", batchId: "batch-lg-male-1", attendance: "Present", submittedAssignment: true, grade: 95, feedback: "Awesome game design!" },
  { id: "stud-8", name: "Muhammad Anas", rollNo: "TITAN-2026-2244", batchId: "batch-lg-male-1", attendance: "Present", submittedAssignment: false, grade: null, feedback: null }
];

export const announcements = [
  { id: 1, tag: "Urgent", title: "Project Submission Deadline Extended", text: "Due to server maintenance, the deadline for Assignment 2 (React Dynamic Portfolio) has been extended until June 30, 2026. Make sure to commit and upload your work on time." },
  { id: 2, tag: "Notification", title: "Eid Holidays Announcement", text: "TITAN campuses will remain closed from June 18 to June 22 on the occasion of Eid-ul-Adha. Classes will resume regular schedules on June 23, 2026." },
  { id: 3, tag: "Seminar", title: "Guest Lecture on Generative AI & Next.js", text: "Join us for an exclusive tech talk by industry experts on Next.js 15 routing mechanics and prompt engineering on June 24 at 02:00 PM." }
];
