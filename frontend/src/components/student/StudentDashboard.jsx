"use client"

import { useState, useRef, useEffect } from "react"
import "./StudentDashboard.css"
import "./ThemeToggle.css"

import FeedbackModal from "./FeedbackModal"
import AssignmentModal from "./AssignmentModal"
import Sidebar from "./Sidebar"
import HomeView from "./HomeView"
import DashboardHome from "./DashboardHome"
import AttendanceSection from "./AttendanceSection"
import ProgressSection from "./ProgressSection"
import PaymentSection from "./PaymentSection"
import AssignmentSection from "./AssignmentSection"
import QuizSection from "./QuizSection"
import ProfileSection from "./ProfileSection"

const TITAN_LOGO = "https://i.ibb.co/q3c3CkLS/titan-logo.jpg"
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

// studentId = Mongo _id of the logged-in student (from DB record).
// Ab koi hardcoded demo student nahi — jo bhi naya student CNIC/DOB se
// login karay, sirf usi ka real data (props se) dikhta hai. Jo field
// admin ne DB mein set nahi ki (naya student), wahan "Not provided" /
// khali state show hoti hai, purana demo data nahi.
export default function StudentDashboard({
  studentName = "Student",
  studentId = null,
  rollNumber = "",
  course = "",
  campus = "",
  cnic = "",
  dob = "",
  email = "",
  phone = "",
  onLogout,
}) {
  // ===== Theme (dark / light mode) =====
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light"
    return localStorage.getItem("titan-theme") || "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("titan-theme", theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  // ===== Payment method (chosen before voucher generation) =====
  const [paymentMethod, setPaymentMethod] = useState("JazzCash")

  // ===== Live voucher / invoices (backend-synced) =====
  const [liveInvoices, setLiveInvoices] = useState(null) // null = not fetched yet
  const [generatingVoucher, setGeneratingVoucher] = useState(false)
  const [voucherError, setVoucherError] = useState("")

  // ===== Live assignments / quizzes created by trainers (backend-synced) =====
  const [liveAssignments, setLiveAssignments] = useState([])
  const [liveQuizzes, setLiveQuizzes] = useState([])

  // ===== Assignment Detail modal (view + submit) =====
  const [assignmentModal, setAssignmentModal] = useState(null) // the assignment object, or null when closed
  const [submitForm, setSubmitForm] = useState({ link: "", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const openAssignmentModal = (a) => {
    const mySub = a.submissions.find((s) => s.rollNumber === rollNumber)
    setSubmitForm({ link: mySub?.link || "", description: mySub?.description || "" })
    setSubmitError("")
    setAssignmentModal(a)
  }

  const submitAssignment = async () => {
    if (!submitForm.link.trim()) {
      setSubmitError("Please add a submission link.")
      return
    }
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch(`${API_BASE}/api/assignments/${assignmentModal.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, studentName, link: submitForm.link.trim(), description: submitForm.description.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Submission failed")
      setLiveAssignments((prev) => prev.map((x) => (x.id === data.id ? data : x)))
      setAssignmentModal(data)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

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

  const generateVoucher = async (method) => {
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
        body: JSON.stringify({ paymentMethod: method || paymentMethod }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to generate voucher")
      setLiveInvoices(data.student.invoices)
    } catch (err) {
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

  // Profile — sirf real login props se banta hai. Jo field admin ne DB
  // mein set nahi ki (naya student), wahan "Not provided" dikhega, koi
  // purani demo detail nahi.
  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    studentName || "Student",
  )}&background=1a3c6e&color=fff&size=200`

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: studentName || "Student",
    email: email || "Not provided",
    phone: phone || "Not provided",
    address: "Not provided",
    gender: "Not provided",
    dob: dob || "Not provided",
    qualification: "Not provided",
    cnic: cnic || "Not provided",
  })
  const [profileDraft, setProfileDraft] = useState(profileData)
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_AVATAR)
  const [profilePhotoDraft, setProfilePhotoDraft] = useState(DEFAULT_AVATAR)
  const profileFileRef = useRef(null)

  // ========== CURRENT MONTH (dynamic, hardcoded "June 2026" nahi) ==========
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const now = new Date()
  // Pichle 6 mahine ki list, sabse naya month pehle — koi attendance record
  // abhi tak nahi hoga is liye sirf dropdown ke liye labels hain.
  const attMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
  })

  // Attendance
  const [attSelectedMonth, setAttSelectedMonth] = useState(attMonths[0])

  // Assignment pagination
  const [assignPage, setAssignPage] = useState(1)
  const ASSIGN_PER_PAGE = 10

  // Naya student — abhi tak koi enrollment/progress/attendance nahi, is
  // liye course card khali/zero state mein dikhta hai jab tak admin
  // panel se course, roll number, attendance wagera set nahi hoti.
  const studentCourse = {
    title: course || "No Course Assigned Yet",
    status: course ? "ENROLLED" : "PENDING",
    progress: 0,
    batch: "—",
    roll: rollNumber || "—",
    campus: campus || "—",
    city: "—",
    schedule: [],
    attendance: "0/0",
    assignments: "0/0",
  }

  // Current week ke din — bina kisi fake "present" highlighting ke,
  // kyunke naye student ki abhi koi class attend nahi hui.
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const studentWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return { d, n: day.getDate(), active: false }
  })

  // ========== ATTENDANCE DATA (khali — koi backend record abhi nahi) ==========
  const attStats = { total: 0, present: 0, leave: 0, absent: 0 }
  const attPercent = attStats.total > 0 ? Math.round((attStats.present / attStats.total) * 100) : 0
  const attendanceLog = {}

  // ========== PROGRESS DATA (khali — naya student, koi module start nahi hua) ==========
  const progressData = {
    totalTopics: 0,
    doneTopics: 0,
    pendingTopics: 0,
    overallPct: 0,
    modules: [],
  }

  // ========== PAYMENT DATA (khali — koi voucher generate nahi hua abhi) ==========
  const feeRecords = []

  // ========== ASSIGNMENT DATA (khali demo list — sirf liveAssignments backend se aayenge) ==========
  const assignmentsData = []

  const assignStats = {
    total: assignmentsData.length,
    submitted: assignmentsData.filter((a) => a.status === "APPROVED").length,
    approved: assignmentsData.filter((a) => a.status === "APPROVED").length,
    notApproved: 0,
  }

  const totalAssignPages = Math.max(1, Math.ceil(assignmentsData.length / ASSIGN_PER_PAGE))
  const paginatedAssignments = assignmentsData.slice((assignPage - 1) * ASSIGN_PER_PAGE, assignPage * ASSIGN_PER_PAGE)

  // ========== QUIZ DATA (khali demo list — sirf liveQuizzes backend se aayenge) ==========
  const quizzesData = []

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

  // ========== MAIN RENDER ==========
  return (
    <div className="portal-container">
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackType={feedbackType}
        setFeedbackType={setFeedbackType}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        feedbackImages={feedbackImages}
        onImageChange={handleFeedbackImageChange}
        onRemoveImage={removeFeedbackImage}
        feedbackFileRef={feedbackFileRef}
        onSend={sendFeedback}
      />

      <AssignmentModal
        assignmentModal={assignmentModal}
        onClose={() => setAssignmentModal(null)}
        rollNumber={rollNumber}
        submitForm={submitForm}
        setSubmitForm={setSubmitForm}
        submitError={submitError}
        submitting={submitting}
        onSubmit={submitAssignment}
      />

      <div className="mobile-header-notch-bar">
        <button className="mobile-hamburger-btn" onClick={() => setStudentSidebarOpen(!studentSidebarOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <img
          src={TITAN_LOGO || "/placeholder.svg"}
          alt="TITAN"
          className="mobile-brand-logo-img"
          style={theme === "dark" ? { background: "#fff", borderRadius: "8px", padding: "3px" } : undefined}
        />
      </div>

      {studentView === "home" ? (
        <HomeView
          studentCourse={studentCourse}
          openFeedbackModal={openFeedbackModal}
          setStudentView={setStudentView}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogoutClick}
        />
      ) : (
        <>
          {studentSidebarOpen && <div className="sidebar-mobile-overlay-shade" onClick={() => setStudentSidebarOpen(false)} />}

          <Sidebar
            studentSidebarOpen={studentSidebarOpen}
            setStudentSidebarOpen={setStudentSidebarOpen}
            studentActiveMenu={studentActiveMenu}
            goToMenu={goToMenu}
            studentProfileMenuOpen={studentProfileMenuOpen}
            setStudentProfileMenuOpen={setStudentProfileMenuOpen}
            profilePhoto={profilePhoto}
            profileData={profileData}
            onLogout={handleLogoutClick}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          <main className={`main-content ${studentSidebarOpen ? "offset-expanded" : "offset-collapsed"}`}>
            {studentActiveMenu === "dashboard" && (
              <DashboardHome
                studentCourse={studentCourse}
                openFeedbackModal={openFeedbackModal}
                goToMenu={goToMenu}
                studentWeekDays={studentWeekDays}
                studentWidgetTab={studentWidgetTab}
                setStudentWidgetTab={setStudentWidgetTab}
                feeRecords={feeRecords}
                setStudentView={setStudentView}
              />
            )}

            {studentActiveMenu === "attendance" && (
              <AttendanceSection
                studentCourse={studentCourse}
                setStudentView={setStudentView}
                attMonths={attMonths}
                attStats={attStats}
                attPercent={attPercent}
                attSelectedMonth={attSelectedMonth}
                setAttSelectedMonth={setAttSelectedMonth}
                attendanceLog={attendanceLog}
              />
            )}

            {studentActiveMenu === "progress" && (
              <ProgressSection
                studentCourse={studentCourse}
                setStudentView={setStudentView}
                progressData={progressData}
                openFeedbackModal={openFeedbackModal}
              />
            )}

            {studentActiveMenu === "payment" && (
              <PaymentSection
                studentCourse={studentCourse}
                setStudentView={setStudentView}
                feeRecords={feeRecords}
                liveInvoices={liveInvoices}
                generatingVoucher={generatingVoucher}
                voucherError={voucherError}
                generateVoucher={generateVoucher}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}

            {studentActiveMenu === "assignment" && (
              <AssignmentSection
                studentCourse={studentCourse}
                setStudentView={setStudentView}
                openFeedbackModal={openFeedbackModal}
                assignStats={assignStats}
                liveAssignments={liveAssignments}
                rollNumber={rollNumber}
                openAssignmentModal={openAssignmentModal}
                paginatedAssignments={paginatedAssignments}
                assignPage={assignPage}
                setAssignPage={setAssignPage}
                totalAssignPages={totalAssignPages}
                assignmentsData={assignmentsData}
                ASSIGN_PER_PAGE={ASSIGN_PER_PAGE}
              />
            )}

            {studentActiveMenu === "quiz" && (
              <QuizSection
                studentCourse={studentCourse}
                setStudentView={setStudentView}
                liveQuizzes={liveQuizzes}
                rollNumber={rollNumber}
                quizzesData={quizzesData}
                API_BASE={API_BASE}
                setLiveQuizzes={setLiveQuizzes}
                studentName={studentName}
              />
            )}

            {studentActiveMenu === "profile" && (
              <ProfileSection
                setStudentView={setStudentView}
                isEditingProfile={isEditingProfile}
                profileData={profileData}
                profileDraft={profileDraft}
                setProfileDraft={setProfileDraft}
                profilePhoto={profilePhoto}
                profilePhotoDraft={profilePhotoDraft}
                profileFileRef={profileFileRef}
                handleProfilePhotoChange={handleProfilePhotoChange}
                startEditProfile={startEditProfile}
                saveProfile={saveProfile}
                cancelEditProfile={cancelEditProfile}
                studentCourse={studentCourse}
              />
            )}
          </main>
        </>
      )}
    </div>
  )
}
