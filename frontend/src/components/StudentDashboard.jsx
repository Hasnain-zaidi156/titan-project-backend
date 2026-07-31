"use client"

import { useState, useRef, useEffect } from "react"
import "./StudentDashboard.css"

const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg"
const SIR_YASIR_PHOTO = "https://i.ibb.co/pB0qFxpB/new-pic-2.jpg"
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export default function StudentDashboard({
  studentName = "Syed Hasnain Zaidi",
  studentId = null,
  rollNumber = "467643",
  course = "Modern Web Application Development",
  campus = "Saylani TITAN Sukkur Campus",
  onLogout,
}) {
  // ===== Live voucher / invoices (backend-synced) =====
  const [liveInvoices, setLiveInvoices] = useState(null)
  const [generatingVoucher, setGeneratingVoucher] = useState(false)
  const [voucherError, setVoucherError] = useState("")

  // ===== Live assignments / quizzes created by trainers =====
  const [liveAssignments, setLiveAssignments] = useState([])
  const [liveQuizzes, setLiveQuizzes] = useState([])

  const fetchLiveAssignments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments?course=${encodeURIComponent(course)}`)
      const data = await res.json()
      setLiveAssignments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load assignments:", err)
    }
  }

  const fetchLiveQuizzes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/quizzes?course=${encodeURIComponent(course)}`)
      const data = await res.json()
      setLiveQuizzes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load quizzes:", err)
    }
  }

  useEffect(() => {
    fetchLiveAssignments()
    fetchLiveQuizzes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  // ===== Generate Voucher =====
  const generateVoucher = async () => {
    if (!studentId) {
      setVoucherError("Voucher generation needs your account to be linked. Please contact admin.")
      return
    }
    setGeneratingVoucher(true)
    setVoucherError("")
    try {
      const res = await fetch(`${API_BASE}/api/students/${studentId}/generate-voucher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          alert(data.message)
          setVoucherError(data.message)
        } else {
          throw new Error(data.message || "Failed to generate voucher")
        }
        setGeneratingVoucher(false)
        return
      }
      const voucher = data.invoice
      setLiveInvoices(data.student.invoices)
      alert(
        `✅ Voucher Generated!\n\n` +
        `Voucher ID: ${voucher.invoiceNumber}\n` +
        `Amount: Rs. ${voucher.amount}\n` +
        `Month: ${voucher.month}\n` +
        `Due Date: ${voucher.dueDate}\n\n` +
        `📱 Please send EXACTLY Rs. 50 to:\n` +
        `JazzCash/Easypaisa: 03273911082 (Sadapay)\n\n` +
        `⚠️ IMPORTANT: Include your Voucher ID (${voucher.invoiceNumber}) in the payment remarks.\n` +
        `Payment will be verified manually by the admin.`
      )
    } catch (err) {
      console.error('Generate voucher error:', err)
      setVoucherError(err.message || "Something went wrong. Please try again.")
    } finally {
      setGeneratingVoucher(false)
    }
  }

  const [studentView, setStudentView] = useState("home")
  const [studentActiveMenu, setStudentActiveMenu] = useState("dashboard")
  const [studentSidebarOpen, setStudentSidebarOpen] = useState(false)
  const [studentProfileMenuOpen, setStudentProfileMenuOpen] = useState(false)
  const [studentWidgetTab, setStudentWidgetTab] = useState("quizzes")

  // Feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackType, setFeedbackType] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackImages, setFeedbackImages] = useState([])
  const feedbackFileRef = useRef(null)

  // Profile
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: studentName || "Syed Hasnain Zaidi",
    email: "drzaidil56@gmail.com",
    phone: "03273911082",
    address: "Not provided",
    gender: "Male",
    dob: "2008-09-24",
    qualification: "Not provided",
    cnic: "4550208563967",
  })
  const [profileDraft, setProfileDraft] = useState(profileData)
  const [profilePhoto, setProfilePhoto] = useState(SIR_YASIR_PHOTO)
  const [profilePhotoDraft, setProfilePhotoDraft] = useState(SIR_YASIR_PHOTO)
  const profileFileRef = useRef(null)

  // Attendance
  const [attSelectedMonth, setAttSelectedMonth] = useState("June 2026")

  // Assignment pagination
  const [assignPage, setAssignPage] = useState(1)
  const ASSIGN_PER_PAGE = 10

  const studentCourse = {
    title: course || "Modern Web Application Development",
    status: "ENROLLED",
    progress: 80,
    batch: 1,
    roll: rollNumber || "467643",
    campus: campus || "Saylani TITAN Sukkur Campus",
    city: "Sukkur",
    schedule: ["Mon 02:00 PM - 04:00 PM", "Wed 02:00 PM - 04:00 PM", "Fri 02:00 PM - 04:00 PM"],
    attendance: "103/127",
    assignments: "13/16",
  }

  const studentWeekDays = [
    { d: "Sun", n: 21, active: false },
    { d: "Mon", n: 22, active: true },
    { d: "Tue", n: 23, active: false },
    { d: "Wed", n: 24, active: true },
    { d: "Thu", n: 25, active: false },
    { d: "Fri", n: 26, active: true },
    { d: "Sat", n: 27, active: false },
  ]

  // ========== ATTENDANCE DATA ==========
  const attMonths = ["June 2026", "May 2026", "April 2026", "March 2026", "February 2026", "January 2026"]
  const attStats = { total: 127, present: 103, leave: 12, absent: 12 }
  const attPercent = Math.round((attStats.present / attStats.total) * 100)

  const attendanceLog = {
    "June 2026": [
      [1, "Mon, Jun 1, 2026", "PRESENT"],
      [2, "Wed, Jun 3, 2026", "PRESENT"],
      [3, "Fri, Jun 5, 2026", "LEAVE"],
      [4, "Mon, Jun 8, 2026", "PRESENT"],
      [5, "Wed, Jun 10, 2026", "PRESENT"],
      [6, "Fri, Jun 12, 2026", "PRESENT"],
      [7, "Mon, Jun 15, 2026", "PRESENT"],
      [8, "Wed, Jun 17, 2026", "PRESENT"],
      [9, "Fri, Jun 19, 2026", "ABSENT"],
      [10, "Mon, Jun 22, 2026", "PRESENT"],
    ],
    "May 2026": [
      [1, "Fri, May 1, 2026", "PRESENT"],
      [2, "Mon, May 4, 2026", "PRESENT"],
      [3, "Wed, May 6, 2026", "PRESENT"],
      [4, "Fri, May 8, 2026", "LEAVE"],
      [5, "Mon, May 11, 2026", "PRESENT"],
      [6, "Wed, May 13, 2026", "ABSENT"],
      [7, "Fri, May 15, 2026", "PRESENT"],
      [8, "Mon, May 18, 2026", "PRESENT"],
      [9, "Wed, May 20, 2026", "PRESENT"],
      [10, "Fri, May 22, 2026", "PRESENT"],
      [11, "Mon, May 25, 2026", "LEAVE"],
      [12, "Wed, May 27, 2026", "PRESENT"],
      [13, "Fri, May 29, 2026", "PRESENT"],
    ],
    "April 2026": [
      [1, "Wed, Apr 1, 2026", "PRESENT"],
      [2, "Fri, Apr 3, 2026", "PRESENT"],
      [3, "Mon, Apr 6, 2026", "ABSENT"],
      [4, "Wed, Apr 8, 2026", "PRESENT"],
      [5, "Fri, Apr 10, 2026", "PRESENT"],
      [6, "Mon, Apr 13, 2026", "PRESENT"],
      [7, "Wed, Apr 15, 2026", "LEAVE"],
      [8, "Fri, Apr 17, 2026", "PRESENT"],
      [9, "Mon, Apr 20, 2026", "PRESENT"],
      [10, "Wed, Apr 22, 2026", "PRESENT"],
      [11, "Fri, Apr 24, 2026", "PRESENT"],
      [12, "Mon, Apr 27, 2026", "PRESENT"],
      [13, "Wed, Apr 29, 2026", "PRESENT"],
    ],
    "March 2026": [
      [1, "Mon, Mar 2, 2026", "PRESENT"],
      [2, "Wed, Mar 4, 2026", "PRESENT"],
      [3, "Fri, Mar 6, 2026", "LEAVE"],
      [4, "Mon, Mar 9, 2026", "PRESENT"],
      [5, "Wed, Mar 11, 2026", "PRESENT"],
      [6, "Fri, Mar 13, 2026", "PRESENT"],
      [7, "Mon, Mar 16, 2026", "ABSENT"],
      [8, "Wed, Mar 18, 2026", "PRESENT"],
      [9, "Fri, Mar 20, 2026", "PRESENT"],
      [10, "Mon, Mar 23, 2026", "PRESENT"],
      [11, "Wed, Mar 25, 2026", "PRESENT"],
      [12, "Fri, Mar 27, 2026", "LEAVE"],
      [13, "Mon, Mar 30, 2026", "PRESENT"],
    ],
    "February 2026": [
      [1, "Mon, Feb 2, 2026", "PRESENT"],
      [2, "Wed, Feb 4, 2026", "PRESENT"],
      [3, "Fri, Feb 6, 2026", "PRESENT"],
      [4, "Mon, Feb 9, 2026", "LEAVE"],
      [5, "Wed, Feb 11, 2026", "PRESENT"],
      [6, "Fri, Feb 13, 2026", "ABSENT"],
      [7, "Mon, Feb 16, 2026", "PRESENT"],
      [8, "Wed, Feb 18, 2026", "PRESENT"],
      [9, "Fri, Feb 20, 2026", "PRESENT"],
      [10, "Mon, Feb 23, 2026", "PRESENT"],
      [11, "Wed, Feb 25, 2026", "PRESENT"],
      [12, "Fri, Feb 27, 2026", "PRESENT"],
    ],
    "January 2026": [
      [1, "Fri, Jan 2, 2026", "PRESENT"],
      [2, "Mon, Jan 5, 2026", "PRESENT"],
      [3, "Wed, Jan 7, 2026", "PRESENT"],
      [4, "Fri, Jan 9, 2026", "PRESENT"],
      [5, "Mon, Jan 12, 2026", "LEAVE"],
      [6, "Wed, Jan 14, 2026", "PRESENT"],
      [7, "Fri, Jan 16, 2026", "PRESENT"],
      [8, "Mon, Jan 19, 2026", "ABSENT"],
      [9, "Wed, Jan 21, 2026", "PRESENT"],
      [10, "Fri, Jan 23, 2026", "PRESENT"],
      [11, "Mon, Jan 26, 2026", "PRESENT"],
      [12, "Wed, Jan 28, 2026", "PRESENT"],
      [13, "Fri, Jan 30, 2026", "PRESENT"],
    ],
  }

  // ========== PROGRESS DATA ==========
  const progressData = {
    totalTopics: 81,
    doneTopics: 65,
    pendingTopics: 16,
    overallPct: 80,
    modules: [
      { name: "Web Designing Module", done: 20, total: 20, pct: 100, status: "done" },
      { name: "Front-End Development", done: 31, total: 31, pct: 100, status: "done" },
      { name: "Modern Front-End Development", done: 13, total: 14, pct: 93, status: "active" },
      { name: "Back-End Development", done: 1, total: 16, pct: 6, status: "pending" },
    ],
  }

  // ========== PAYMENT DATA ==========
  const feeRecords = [
    { month: "Jun 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Jun-2026", voucherId: "202606467643", status: "PAID" },
    { month: "May 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-May-2026", voucherId: "202605467643", status: "PAID" },
    { month: "Apr 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Apr-2026", voucherId: "202604467643", status: "PAID" },
    { month: "Mar 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Mar-2026", voucherId: "202603467643", status: "PAID" },
    { month: "Feb 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Feb-2026", voucherId: "202602467643", status: "PAID" },
    { month: "Jan 2026", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Jan-2026", voucherId: "202601467643", status: "PAID" },
    { month: "Dec 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Dec-2025", voucherId: "202512467643", status: "PAID" },
    { month: "Nov 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Nov-2025", voucherId: "202511467643", status: "PAID" },
    { month: "Oct 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Oct-2025", voucherId: "202510467643", status: "PAID" },
    { month: "Sep 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Sep-2025", voucherId: "202509467643", status: "PAID" },
    { month: "Aug 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Aug-2025", voucherId: "202508467643", status: "PAID" },
    { month: "Jul 2025", amount: "Rs: 1000 /-", type: "Monthly", dueDate: "08-Jul-2025", voucherId: "202507467643", status: "PAID" },
  ]

  // ========== ASSIGNMENT DATA ==========
  const assignmentsData = [
    { title: "Mongodb assignmnet", course: "Modern Web Application Development", dueDate: "Jun 20, 2026", status: "NOT SUBMITTED" },
    { title: "File managment vs dbms (theory)", course: "Modern Web Application Development", dueDate: "Jun 12, 2026", status: "APPROVED" },
    { title: "Galary_App_API_ASSIGNMENT", course: "Modern Web Application Development", dueDate: "Jun 2, 2026", status: "APPROVED" },
    { title: "React js Assignment Using Routing", course: "Modern Web Application Development", dueDate: "May 7, 2026", status: "APPROVED" },
    { title: "REACT JS ASSIGNMENT", course: "Modern Web Application Development", dueDate: "Apr 8, 2026", status: "APPROVED" },
    { title: "JAVASCRIPT DOM", course: "Modern Web Application Development", dueDate: "Mar 14, 2026", status: "APPROVED" },
    { title: "Web & App Hackathon", course: "Modern Web Application Development", dueDate: "Dec 27, 2025", status: "APPROVED" },
    { title: "java script assesment test", course: "Modern Web Application Development", dueDate: "Dec 1, 2025", status: "NOT SUBMITTED" },
    { title: "If else 8 questions java script", course: "Modern Web Application Development", dueDate: "Nov 28, 2025", status: "APPROVED" },
    { title: "Grand CSS Assignment oct 20", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "Grid Assignment oct 10", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "Animation and transition oct 8", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "Portfolio Card Assignment oct 6", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "Tribute page sep 24", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "Class Assignment sep 14", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "HTML Assignment 3 sep", course: "Modern Web Application Development", dueDate: "Oct 27, 2025", status: "APPROVED" },
    { title: "HTML Assignment 2 aug 28", course: "Modern Web Application Development", dueDate: "Aug 30, 2025", status: "APPROVED" },
  ]

  const assignStats = {
    total: assignmentsData.length,
    submitted: assignmentsData.filter((a) => a.status === "APPROVED").length,
    approved: assignmentsData.filter((a) => a.status === "APPROVED").length,
    notApproved: 0,
  }

  const totalAssignPages = Math.ceil(assignmentsData.length / ASSIGN_PER_PAGE)
  const paginatedAssignments = assignmentsData.slice((assignPage - 1) * ASSIGN_PER_PAGE, assignPage * ASSIGN_PER_PAGE)

  // ========== QUIZ DATA ==========
  const quizzesData = [
    { module: "Modern Front-End Development", title: "Javascript (Quiz-4)", questions: 40, attempts: 1, score: "13 / 40", pct: 33, status: "FAILED", note: "" },
    { module: "Modern Front-End Development", title: "Javascript (Quiz-3)", questions: 40, attempts: 1, score: "32 / 40", pct: 80, status: "PASSED", note: "" },
    { module: "Modern Front-End Development", title: "Javascript (Quiz-2)", questions: 40, attempts: 1, score: "32 / 40", pct: 80, status: "PASSED", note: "" },
    { module: "Modern Front-End Development", title: "Javascript (Quiz-1)", questions: 40, attempts: 1, score: "28 / 40", pct: 70, status: "PASSED", note: "" },
    { module: "Web Designing Module", title: "HTML Quiz", questions: 40, attempts: 1, score: "29 / 40", pct: 73, status: "PASSED", note: "" },
    { module: "Front-End Development", title: "CSS Quiz", questions: 40, attempts: 1, score: "28 / 40", pct: 70, status: "PASSED", note: "" },
  ]

  // ========== HANDLERS ==========
  const handleLogoutClick = () => {
    setStudentView("home")
    setStudentActiveMenu("dashboard")
    setStudentProfileMenuOpen(false)
    if (onLogout) onLogout()
  }

  const goToMenu = (key) => {
    setStudentActiveMenu(key)
    setStudentSidebarOpen(false)
    setStudentProfileMenuOpen(false)
  }

  const openFeedbackModal = () => {
    setFeedbackType("")
    setFeedbackText("")
    setFeedbackImages([])
    setShowFeedbackModal(true)
  }

  const handleFeedbackImageChange = (e) => {
    const files = Array.from(e.target.files)
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target.result)
          reader.readAsDataURL(file)
        }),
    )
    Promise.all(readers).then((results) => setFeedbackImages((prev) => [...prev, ...results]))
  }

  const removeFeedbackImage = (idx) => {
    setFeedbackImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const sendFeedback = () => {
    if (!feedbackType || !feedbackText.trim()) return
    setShowFeedbackModal(false)
  }

  const startEditProfile = () => {
    setProfileDraft(profileData)
    setProfilePhotoDraft(profilePhoto)
    setIsEditingProfile(true)
  }

  const saveProfile = () => {
    setProfileData(profileDraft)
    setProfilePhoto(profilePhotoDraft)
    setIsEditingProfile(false)
  }

  const cancelEditProfile = () => {
    setProfileDraft(profileData)
    setProfilePhotoDraft(profilePhoto)
    setIsEditingProfile(false)
  }

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfilePhotoDraft(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ========== RENDER: FEEDBACK MODAL ==========
  const renderFeedbackModal = () => {
    if (!showFeedbackModal) return null
    return (
      <div className="s-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
        <div className="s-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="s-modal-header">
            <h2>Share Your Feedback</h2>
            <button className="s-modal-close" onClick={() => setShowFeedbackModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <p className="s-modal-desc">Let us know if we could do anything to improve your learning experience</p>

          <div className="s-feedback-type-label">Select Type *</div>
          <div className="s-feedback-types">
            {[
              { key: "Bug", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
              { key: "Idea", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
              { key: "Other", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
            ].map((t) => (
              <div key={t.key} className={`s-feedback-type-card ${feedbackType === t.key ? "s-fb-type-active" : ""}`} onClick={() => setFeedbackType(t.key)}>
                {t.icon}
                <span>{t.key}</span>
              </div>
            ))}
          </div>

          <div className="s-feedback-type-label">Your feedback</div>
          <textarea className="s-feedback-textarea" placeholder="Write your feedback here..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={4} />

          <div className="s-feedback-type-label">Reference Images</div>
          <div className="s-feedback-images">
            {feedbackImages.map((img, i) => (
              <div key={i} className="s-fb-img-preview">
                <img src={img || "/placeholder.svg"} alt="" />
                <button className="s-fb-img-remove" onClick={() => removeFeedbackImage(i)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            ))}
            <button className="s-fb-add-img" onClick={() => feedbackFileRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <span>Add Image</span>
            </button>
            <input ref={feedbackFileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFeedbackImageChange} />
          </div>

          <div className="s-modal-actions">
            <button className="s-btn-cancel" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
            <button className="s-btn-send" onClick={sendFeedback} disabled={!feedbackType || !feedbackText.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Send feedback
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ========== RENDER: ATTENDANCE ==========
  const renderAttendance = () => {
    const currentLog = attendanceLog[attSelectedMonth] || []
    const monthPresent = currentLog.filter((r) => r[2] === "PRESENT").length
    const monthLeave = currentLog.filter((r) => r[2] === "LEAVE").length
    const monthAbsent = currentLog.filter((r) => r[2] === "ABSENT").length
    const monthPct = currentLog.length > 0 ? Math.round((monthPresent / currentLog.length) * 100) : 0

    return (
      <div className="s-section animated-fade">
        <div className="s-breadcrumb-row">
          <div className="breadcrumbs">
            <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Attendance</span>
          </div>
        </div>
        <div className="s-att-stats-row">
          <div className="stat-card"><div className="stat-content"><h3>{attStats.total}</h3><p>Total Classes</p></div><div className="stat-badge-icon s-icon-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div></div>
          <div className="stat-card"><div className="stat-content"><h3>{attStats.present}</h3><p>Present</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
          <div className="stat-card"><div className="stat-content"><h3>{attStats.leave}</h3><p>Leave</p></div><div className="stat-badge-icon s-icon-amber"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></div></div>
          <div className="stat-card"><div className="stat-content"><h3>{attStats.absent}</h3><p>Absent</p></div><div className="stat-badge-icon s-icon-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></div></div>
        </div>
        <div className="workspace-card-view">
          <h3 style={{ marginTop: 0 }}>Attendance Overview</h3>
          <div className="s-progress-label-row"><span>Overall Attendance</span><strong style={{ color: "var(--primary-color)" }}>{attPercent}%</strong></div>
          <div className="progress-bar-rail" style={{ marginBottom: 8 }}><div className="progress-bar-fill-track" style={{ width: `${attPercent}%` }} /></div>
          <p className="s-att-good-text">Your attendance is good. Keep it up!</p>
        </div>
        <div className="workspace-card-view" style={{ marginTop: 20 }}>
          <div className="s-att-month-header">
            <h3 style={{ margin: 0 }}>Monthly Attendance</h3>
            <select className="s-month-select" value={attSelectedMonth} onChange={(e) => setAttSelectedMonth(e.target.value)}>
              {attMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="s-month-stats-row">
            <div className="s-month-stat"><span>Classes</span><strong>{currentLog.length}</strong></div>
            <div className="s-month-stat"><span>Present</span><strong style={{ color: "var(--green-color)" }}>{monthPresent}</strong></div>
            <div className="s-month-stat"><span>Leave</span><strong style={{ color: "var(--amber-color)" }}>{monthLeave}</strong></div>
            <div className="s-month-stat"><span>Absent</span><strong style={{ color: "var(--red-color)" }}>{monthAbsent}</strong></div>
            <div className="s-month-stat"><span>Percentage</span><strong style={{ color: "var(--primary-color)" }}>{monthPct}%</strong></div>
          </div>
          <div className="table-responsive-wrapper" style={{ marginTop: 16 }}>
            <table className="client-data-table s-att-table">
              <thead><tr><th>Class</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {currentLog.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td><span className={`s-att-badge s-att-${row[2].toLowerCase()}`}>{row[2]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ========== RENDER: PROGRESS ==========
  const renderProgress = () => (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Progress</span>
        </div>
        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>
      </div>
      <div className="workspace-card-view">
        <h3 style={{ marginTop: 0 }}>Course Progress</h3>
        <div className="s-progress-topics-row">
          <div className="s-topic-chip s-topic-done">Completed: {progressData.doneTopics}</div>
          <div className="s-topic-chip s-topic-pending">Pending: {progressData.pendingTopics}</div>
          <div className="s-topic-chip s-topic-total">Total Topics: {progressData.totalTopics}</div>
        </div>
        <div className="s-progress-label-row"><span>Overall Progress</span><strong style={{ color: "var(--primary-color)" }}>{progressData.overallPct}%</strong></div>
        <div className="progress-bar-rail" style={{ height: 10, marginBottom: 24 }}><div className="progress-bar-fill-track" style={{ width: `${progressData.overallPct}%` }} /></div>
        <div className="s-modules-list">
          {progressData.modules.map((mod, i) => (
            <div key={i} className={`s-module-row s-module-${mod.status}`}>
              <div className="s-module-left">
                <div className={`s-module-check ${mod.status === "done" ? "s-check-done" : mod.status === "active" ? "s-check-active" : "s-check-pending"}`}>
                  {mod.status === "done" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : mod.status === "active" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>}
                </div>
                <div><p className="s-module-name">{mod.name}</p><p className="s-module-topics">{mod.done} / {mod.total} topics</p></div>
              </div>
              <div className="s-module-right">
                <div className="s-module-pct-badge" style={{ color: mod.pct === 100 ? "var(--green-color)" : mod.pct >= 50 ? "var(--primary-color)" : "var(--amber-color)", background: mod.pct === 100 ? "#e6fdf4" : mod.pct >= 50 ? "var(--primary-light)" : "#fffbeb" }}>{mod.pct}%</div>
                <div className="progress-bar-rail" style={{ height: 6, width: 80, marginBottom: 0 }}><div className="progress-bar-fill-track" style={{ width: `${mod.pct}%`, backgroundColor: mod.pct === 100 ? "var(--green-color)" : mod.pct >= 50 ? "var(--primary-color)" : "var(--amber-color)" }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ========== RENDER: PAYMENT ==========
  const renderPayment = () => (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Payment</span>
        </div>
      </div>

      <div className="workspace-card-view" style={{ marginBottom: 20, borderLeft: '4px solid var(--primary-color)' }}>
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.3rem' }}>📱</span> Payment Instructions
        </h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '2', color: 'var(--text-muted)' }}>
          <li><strong>Amount:</strong> Rs. 50 (Monthly Fee)</li>
          <li><strong>Payment Method:</strong> JazzCash or Easypaisa</li>
          <li><strong>Account Number:</strong> 03273911082 (Sadapay)</li>
          <li><strong>⚠️ Important:</strong> Your <strong>Voucher ID</strong> MUST be included in the payment remarks.</li>
          <li>Payment will be verified manually by the admin. Please allow 24-48 hours.</li>
        </ul>
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          background: 'var(--primary-light)', 
          borderRadius: '8px',
          border: '1px solid rgba(13, 71, 161, 0.2)'
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            <strong>Example Remarks:</strong> <code style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>202606827544</code> (Your Voucher ID)
          </p>
        </div>
      </div>

      <div className="workspace-card-view">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Fee Records</h3>
          <button
            className="student-view-details-btn"
            style={{ 
              opacity: generatingVoucher ? 0.7 : 1,
              maxWidth: '220px',
              padding: '10px 16px',
              fontSize: '0.85rem'
            }}
            onClick={generateVoucher}
            disabled={generatingVoucher || !studentId}
          >
            {generatingVoucher ? "Generating..." : "Generate Voucher"}
          </button>
        </div>
        {voucherError && <p style={{ color: "var(--red-color, #ef4444)", fontSize: "0.85rem", marginTop: 8 }}>{voucherError}</p>}

        <div className="table-responsive-wrapper" style={{ marginTop: 12 }}>
          <table className="client-data-table s-fee-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Due date</th>
                <th>Voucher ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(liveInvoices || []).map((inv, i) => (
                <tr key={`live-${i}`}>
                  <td>{inv.month}</td>
                  <td>Rs. {inv.amount} /-</td>
                  <td>{inv.type}</td>
                  <td>{inv.dueDate}</td>
                  <td style={{ fontSize: "0.8rem", fontWeight: 'bold', color: 'var(--primary-color)' }}>{inv.invoiceNumber}</td>
                  <td>
                    <span className={inv.status === "PAID" ? "badge-present-status" : "s-att-badge s-att-leave"}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(liveInvoices || []).length === 0 && feeRecords.slice(0, 3).map((r, i) => (
                <tr key={i}>
                  <td>{r.month}</td>
                  <td>{r.amount}</td>
                  <td>{r.type}</td>
                  <td>{r.dueDate}</td>
                  <td style={{ fontSize: "0.8rem" }}>{r.voucherId}</td>
                  <td><span className="badge-present-status">{r.status}</span></td>
                </tr>
              ))}
              {(liveInvoices || []).length === 0 && feeRecords.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
                    No payment records found. Generate a voucher to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ========== RENDER: ASSIGNMENT ==========
  const renderAssignment = () => (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Assignment</span>
        </div>
        <button className="student-feedback-btn" onClick={openFeedbackModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          Feedback
        </button>
      </div>
      <div className="s-assign-stats-row">
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.total}</h3><p>Total</p></div><div className="stat-badge-icon s-icon-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.submitted}</h3><p>Submitted</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.approved}</h3><p>Approved</p></div><div className="stat-badge-icon s-icon-green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-color)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{assignStats.notApproved}</h3><p>Not Approved</p></div><div className="stat-badge-icon s-icon-red"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg></div></div>
      </div>
      <div className="workspace-card-view">
        <h3>Assignments</h3>
        <div className="table-responsive-wrapper">
          <table className="client-data-table s-assign-table">
            <thead><tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {liveAssignments.map((a) => {
                const mySub = a.submissions.find((s) => s.rollNumber === rollNumber)
                const status = mySub ? (mySub.approved === true ? "APPROVED" : mySub.approved === false ? "NOT APPROVED" : mySub.status.toUpperCase()) : "NOT SUBMITTED"
                return (
                  <tr key={a.id}>
                    <td className="s-assign-title">{a.title} <span className="s-att-badge s-att-present" style={{ marginLeft: 6 }}>LIVE</span></td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.course}</td>
                    <td>{a.dueDate}</td>
                    <td><span className={`s-assign-badge s-assign-${status.replace(/\s/g, "").toLowerCase()}`}>{status}</span></td>
                    <td>
                      <button
                        className="s-btn-outline"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                        onClick={async () => {
                          const link = window.prompt("Paste your submission link (Google Drive, GitHub, etc.):", mySub?.link || "")
                          if (link === null) return
                          try {
                            const res = await fetch(`${API_BASE}/api/assignments/${a.id}/submit`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ rollNumber, studentName, link, description: "" }),
                            })
                            const data = await res.json()
                            if (res.ok) setLiveAssignments((prev) => prev.map((x) => (x.id === data.id ? data : x)))
                          } catch (err) { console.error("Submit failed:", err) }
                        }}
                      >
                        {mySub ? "Re-submit" : "Submit"}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {paginatedAssignments.map((a, i) => (
                <tr key={i}><td className="s-assign-title">{a.title}</td><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.course}</td><td>{a.dueDate}</td><td><span className={`s-assign-badge s-assign-${a.status.replace(/\s/g, "").toLowerCase()}`}>{a.status}</span></td><td><span className="s-action-completed">Completed</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="s-pagination-row">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Showing {(assignPage - 1) * ASSIGN_PER_PAGE + 1}-{Math.min(assignPage * ASSIGN_PER_PAGE, assignmentsData.length)} of {assignmentsData.length} records</span>
          <div className="s-pagination-btns">
            <button className="s-page-btn" disabled={assignPage <= 1} onClick={() => setAssignPage((p) => p - 1)}>Previous</button>
            {Array.from({ length: totalAssignPages }, (_, i) => (
              <button key={i} className={`s-page-num ${assignPage === i + 1 ? "s-page-active" : ""}`} onClick={() => setAssignPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="s-page-btn" disabled={assignPage >= totalAssignPages} onClick={() => setAssignPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ========== RENDER: QUIZ ==========
  const renderQuiz = () => (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Quiz</span>
        </div>
      </div>
      <div className="s-quiz-info-box">
        <div className="s-quiz-info-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          Important Information
        </div>
        <ul className="s-quiz-info-list">
          <li>Quiz must be completed in a single session. You cannot pause and resume later.</li>
          <li>Switching to another tab or window during the quiz will be recorded and may be flagged.</li>
          <li>Each quiz can only be attempted once unless otherwise specified by the instructor.</li>
          <li>Make sure you have a stable internet connection before starting.</li>
          <li>If you face any issue, contact your instructor immediately.</li>
        </ul>
      </div>
      <div className="workspace-card-view">
        <h3>Quizzes — Module 3: Modern Web Application Development</h3>
        <div className="table-responsive-wrapper">
          <table className="client-data-table s-quiz-table">
            <thead><tr><th>Module</th><th>Title</th><th>Questions</th><th>Attempts</th><th>Score</th><th>Percentage</th><th>Status</th><th>Note</th><th>Action</th></tr></thead>
            <tbody>
              {liveQuizzes.map((q) => {
                const myResult = q.results.find((r) => r.rollNumber === rollNumber)
                const pct = myResult ? Math.round((myResult.score / myResult.totalQuestions) * 100) : 0
                return (
                  <tr key={q.id}>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.course} <span className="s-att-badge s-att-present" style={{ marginLeft: 6 }}>LIVE</span></td>
                    <td className="s-quiz-title">{q.title}</td>
                    <td>{q.totalQuestions}</td>
                    <td>{myResult?.attempts || 0}</td>
                    <td>{myResult ? `${myResult.score} / ${myResult.totalQuestions}` : "—"}</td>
                    <td>{myResult ? <span className={`s-quiz-pct s-quiz-${myResult.status.toLowerCase()}`}>{pct}%</span> : "—"}</td>
                    <td>{myResult ? <span className={`s-quiz-badge s-quiz-${myResult.status.toLowerCase()}`}>{myResult.status}</span> : <span className="s-quiz-badge">PENDING</span>}</td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>—</td>
                    <td>
                      <button
                        className="s-btn-outline"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                        onClick={async () => {
                          const scoreStr = window.prompt(`Enter your score out of ${q.totalQuestions}:`, myResult?.score || "")
                          if (scoreStr === null) return
                          const score = Number(scoreStr)
                          if (Number.isNaN(score)) return
                          try {
                            const res = await fetch(`${API_BASE}/api/quizzes/${q.id}/result`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ rollNumber, studentName, score, totalQuestions: q.totalQuestions }),
                            })
                            const data = await res.json()
                            if (res.ok) setLiveQuizzes((prev) => prev.map((x) => (x.id === data.id ? data : x)))
                          } catch (err) { console.error("Submit result failed:", err) }
                        }}
                      >
                        {myResult ? "Retry" : "Submit"}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {quizzesData.map((q, i) => (
                <tr key={i}><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.module}</td><td className="s-quiz-title">{q.title}</td><td>{q.questions}</td><td>{q.attempts}</td><td>{q.score}</td><td><span className={`s-quiz-pct s-quiz-${q.status.toLowerCase()}`}>{q.pct}%</span></td><td><span className={`s-quiz-badge s-quiz-${q.status.toLowerCase()}`}>{q.status}</span></td><td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{q.note || "—"}</td><td><span className="s-action-completed">Completed</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>If you have any questions about your quiz results, please contact your instructor.</p>
      </div>
    </div>
  )

  // ========== RENDER: PROFILE ==========
  const renderProfile = () => (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">Profile</span>
        </div>
      </div>

      <div className="s-profile-card">
        <div className="s-profile-top">
          <div className="s-profile-avatar-wrap">
            <img src={isEditingProfile ? profilePhotoDraft : profilePhoto} alt="Avatar" className="s-profile-avatar" />
            {isEditingProfile && (
              <button className="s-avatar-edit-btn" onClick={() => profileFileRef.current?.click()} title="Change photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              </button>
            )}
            <input ref={profileFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePhotoChange} />
          </div>
          <div className="s-profile-identity">
            {isEditingProfile ? (
              <input type="text" className="s-profile-name-input" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
            ) : (
              <h1 className="s-profile-name">{profileData.name}</h1>
            )}
            <span className="s-role-pill">Student</span>
          </div>
          <div className="s-profile-actions">
            {isEditingProfile ? (
              <>
                <button className="s-btn-outline" onClick={cancelEditProfile}>Cancel</button>
                <button className="s-btn-primary" onClick={saveProfile}>Save Changes</button>
              </>
            ) : (
              <button className="s-btn-outline" onClick={startEditProfile}>Edit Profile</button>
            )}
          </div>
        </div>

        <div className="s-profile-grid">
          <div className="s-profile-section">
            <h3>Contact Information</h3>
            {isEditingProfile ? (
              <div className="s-profile-fields">
                <div className="s-profile-field"><label>Email</label><input value={profileDraft.email} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} /></div>
                <div className="s-profile-field"><label>Phone</label><input value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} /></div>
                <div className="s-profile-field"><label>Address</label><input value={profileDraft.address} onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })} /></div>
              </div>
            ) : (
              <div className="s-profile-info-list">
                <div className="s-info-row"><span className="s-info-label">Email</span><span className="s-info-value">{profileData.email}</span></div>
                <div className="s-info-row"><span className="s-info-label">Phone</span><span className="s-info-value">{profileData.phone}</span></div>
                <div className="s-info-row"><span className="s-info-label">Address</span><span className="s-info-value s-info-muted">{profileData.address}</span></div>
              </div>
            )}
          </div>

          <div className="s-profile-section">
            <h3>Personal Information</h3>
            {isEditingProfile ? (
              <div className="s-profile-fields">
                <div className="s-profile-field"><label>Gender</label>
                  <select value={profileDraft.gender} onChange={(e) => setProfileDraft({ ...profileDraft, gender: e.target.value })}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className="s-profile-field"><label>Date of Birth</label><input type="date" value={profileDraft.dob} onChange={(e) => setProfileDraft({ ...profileDraft, dob: e.target.value })} /></div>
                <div className="s-profile-field"><label>Last Qualification</label><input value={profileDraft.qualification} onChange={(e) => setProfileDraft({ ...profileDraft, qualification: e.target.value })} /></div>
                <div className="s-profile-field"><label>CNIC</label><input value={profileDraft.cnic} onChange={(e) => setProfileDraft({ ...profileDraft, cnic: e.target.value })} /></div>
              </div>
            ) : (
              <div className="s-profile-info-list">
                <div className="s-info-row"><span className="s-info-label">Gender</span><span className="s-info-value">{profileData.gender}</span></div>
                <div className="s-info-row"><span className="s-info-label">Date of Birth</span><span className="s-info-value">{profileData.dob}</span></div>
                <div className="s-info-row"><span className="s-info-label">Last Qualification</span><span className="s-info-value s-info-muted">{profileData.qualification}</span></div>
                <div className="s-info-row"><span className="s-info-label">CNIC</span><span className="s-info-value">{profileData.cnic}</span></div>
              </div>
            )}
          </div>

          <div className="s-profile-section">
            <h3>Enrolled Courses</h3>
            <div className="s-enrolled-course-card">
              <div className="s-ec-top">
                <div><h4>{studentCourse.title}</h4><p className="s-ec-meta">Batch {studentCourse.batch} · {studentCourse.campus}</p></div>
                <span className="enrolled-badge-pill">{studentCourse.status}</span>
              </div>
              <div className="s-ec-progress">
                <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}%</strong></div>
                <div className="progress-bar-rail" style={{ marginBottom: 0 }}><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ========== MAIN RENDER ==========
  return (
    <div className="portal-container">
      {renderFeedbackModal()}

      <div className="mobile-header-notch-bar">
        <button className="mobile-hamburger-btn" onClick={() => setStudentSidebarOpen(!studentSidebarOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <img src={TITAN_LOGO || "/placeholder.svg"} alt="TITAN" className="mobile-brand-logo-img" />
      </div>

      {studentView === "home" ? (
        <div className="student-simple-page">
          <div className="student-top-bar">
            <div className="student-top-logo-block">
              <img src={TITAN_LOGO || "/placeholder.svg"} alt="TITAN" className="titan-logo-img" />
              <span className="titan-word-below">TITAN</span>
            </div>
            <div className="student-search-wrap">
              <input type="text" placeholder="Search Course" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <div className="student-enrolled-dropdown">ENROLLED<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>
            <button className="student-feedback-btn" onClick={openFeedbackModal}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              Feedback
            </button>
          </div>
          <div className="student-course-card">
            <div className="student-course-card-header"><h2>{studentCourse.title}</h2><span className="enrolled-badge-pill">{studentCourse.status}</span></div>
            <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}% Completed</strong></div>
            <div className="progress-bar-rail"><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
            <div className="student-info-grid-2col">
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg> Batch: <strong>{studentCourse.batch}</strong></div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg> Roll: <strong>{studentCourse.roll}</strong></div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> Campus: <strong>{studentCourse.campus}</strong></div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> City: <strong>{studentCourse.city}</strong></div>
            </div>
            <button className="student-view-details-btn" onClick={() => setStudentView("full")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              View Details
            </button>
          </div>
        </div>
      ) : (
        <>
          {studentSidebarOpen && <div className="sidebar-mobile-overlay-shade" onClick={() => setStudentSidebarOpen(false)} />}

          <aside className={`sidebar ${studentSidebarOpen ? "expanded" : "collapsed"}`}>
            <div className="toggle-trigger-action" onClick={() => setStudentSidebarOpen(!studentSidebarOpen)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
                {studentSidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
              </svg>
            </div>
            <div className="logo-container-vertical">
              <div className="titan-brand-wrapper">
                <img src={TITAN_LOGO || "/placeholder.svg"} alt="TITAN" className="titan-logo-img" />
                {studentSidebarOpen && <h3 className="logo-text-bottom">TITAN</h3>}
              </div>
            </div>

            <nav className="nav-menu">
              {[
                { key: "dashboard", label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></> },
                { key: "progress", label: "Progress", icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
                { key: "attendance", label: "Attendance", icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
                { key: "payment", label: "Payment", icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
                { key: "assignment", label: "Assignment", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
                { key: "quiz", label: "Quiz", icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
              ].map((item) => (
                <div key={item.key} className={`nav-item ${studentActiveMenu === item.key ? "active" : ""}`} onClick={() => goToMenu(item.key)}>
                  <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
                  {studentSidebarOpen && <span className="nav-text">{item.label}</span>}
                </div>
              ))}
            </nav>

            <div className="sidebar-footer">
              {studentProfileMenuOpen && (
                <div className="profile-popup-menu">
                  <div className="profile-popup-item" onClick={() => { setStudentProfileMenuOpen(false); goToMenu("profile") }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span>Profile</span>
                  </div>
                  <div className="profile-popup-item logout-popup-item" onClick={handleLogoutClick}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    <span>Log out</span>
                  </div>
                </div>
              )}
              <div className="user-profile-wrapper" onClick={() => setStudentProfileMenuOpen(!studentProfileMenuOpen)}>
                <img src={profilePhoto || "/placeholder.svg"} alt="Avatar" className="table-avatar-img" />
                {studentSidebarOpen && (
                  <div className="trainer-info">
                    <h4>{profileData.name}</h4>
                    <p>Student</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className={`main-content ${studentSidebarOpen ? "offset-expanded" : "offset-collapsed"}`}>
            {studentActiveMenu === "dashboard" && (
              <>
                <div className="student-page-top-row">
                  <div className="breadcrumbs">
                    <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span>
                  </div>
                  <button className="student-feedback-btn" onClick={openFeedbackModal}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    Feedback
                  </button>
                </div>

                <section className="student-stats-top-row">
                  <div className="stat-card s-clickable-stat" onClick={() => goToMenu("attendance")}>
                    <div className="stat-content"><h3>{studentCourse.attendance}</h3><p>Attendance</p></div>
                    <div className="stat-badge-icon green-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                  </div>
                  <div className="stat-card s-clickable-stat" onClick={() => goToMenu("assignment")}>
                    <div className="stat-content"><h3>{studentCourse.assignments}</h3><p>Assignment</p></div>
                    <div className="stat-badge-icon purple-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg></div>
                  </div>
                  <div className="schedule-compact-widget">
                    <div className="schedule-title-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      Class Schedule
                    </div>
                    <div className="schedule-days-flex">
                      {studentWeekDays.map((day) => (
                        <div key={day.d} className={`day-pill ${day.active ? "present" : ""}`}>{day.d} <span>{day.n}</span></div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="student-widget-card">
                  <div className="student-widget-tabs">
                    <button className={studentWidgetTab === "assignments" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("assignments")}>Assignments</button>
                    <button className={studentWidgetTab === "quizzes" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("quizzes")}>Quizzes</button>
                    <button className={studentWidgetTab === "events" ? "active-widget-tab" : ""} onClick={() => setStudentWidgetTab("events")}>Events</button>
                  </div>
                  <p className="widget-empty-text">No upcoming {studentWidgetTab}.</p>
                </div>

                <div className="student-course-card" style={{ marginTop: "20px", maxWidth: "none" }}>
                  <div className="student-course-card-header"><h2>{studentCourse.title}</h2><span className="enrolled-badge-pill">{studentCourse.status}</span></div>
                  <div className="student-schedule-pills-row">{studentCourse.schedule.map((s, i) => <span key={i} className="schedule-time-pill">{s}</span>)}</div>
                  <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}% Completed</strong></div>
                  <div className="progress-bar-rail"><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
                  <div className="student-info-grid-2col">
                    <div>Batch: <strong>{studentCourse.batch}</strong></div>
                    <div>Roll: <strong>{studentCourse.roll}</strong></div>
                    <div>Campus: <strong>{studentCourse.campus}</strong></div>
                    <div>City: <strong>{studentCourse.city}</strong></div>
                  </div>
                </div>

                <div className="workspace-card-view" style={{ marginTop: "20px" }}>
                  <h3 style={{ marginTop: 0 }}>Fee</h3>
                  <div className="table-responsive-wrapper">
                    <table className="client-data-table plain-table">
                      <thead><tr><th>Month</th><th>Amount</th><th>Type</th><th>Due date</th><th>Voucher ID</th><th>Status</th></tr></thead>
                      <tbody>
                        {(liveInvoices || []).length > 0 ? (
                          liveInvoices.slice(0, 1).map((inv, i) => (
                            <tr key={i}>
                              <td>{inv.month}</td>
                              <td>Rs. {inv.amount} /-</td>
                              <td>{inv.type}</td>
                              <td>{inv.dueDate}</td>
                              <td>{inv.invoiceNumber}</td>
                              <td><span className={inv.status === "PAID" ? "badge-present-status" : "s-att-badge s-att-leave"}>{inv.status}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td>{feeRecords[0].month}</td><td>{feeRecords[0].amount}</td><td>{feeRecords[0].type}</td><td>{feeRecords[0].dueDate}</td><td>{feeRecords[0].voucherId}</td><td><span className="badge-present-status">{feeRecords[0].status}</span></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {studentActiveMenu === "attendance" && renderAttendance()}
            {studentActiveMenu === "progress" && renderProgress()}
            {studentActiveMenu === "payment" && renderPayment()}
            {studentActiveMenu === "assignment" && renderAssignment()}
            {studentActiveMenu === "quiz" && renderQuiz()}
            {studentActiveMenu === "profile" && renderProfile()}
          </main>
        </>
      )}
    </div>
  )
}