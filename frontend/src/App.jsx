import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import TitanPortal from "./components/TitanPortal";
import Dashboard from "./components/trainer/Dashboard";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentAuth from "./components/StudentAuth";

// ---- Admin Portal — ab split hai, sub-routes ke sath (Students, Attendance,
// Trainers, Slots, Updation, Profile). Sab files src/components/ mein hain. ----
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RequireAuth } from "./components/admin/RequireAuth";
import { DashboardPage } from "./components/admin/DashboardPage";
import { StudentsPage } from "./components/admin/StudentsPage";
import { MarkAttendancePage } from "./components/admin/MarkAttendancePage";
import { ViewAttendancePage } from "./components/admin/ViewAttendancePage";
import { MultiAttendancePage } from "./components/admin/MultiAttendancePage";
import { TrainersListPage } from "./components/admin/TrainersListPage";
import { MarkTrainerAttendancePage } from "./components/admin/MarkTrainerAttendancePage";
import { ViewTrainerAttendancePage } from "./components/admin/ViewTrainerAttendancePage";
import { TrainerAttendanceRequestPage } from "./components/admin/TrainerAttendanceRequestPage";
import { SlotsPage } from "./components/admin/SlotsPage";
import { UpdationPage } from "./components/admin/UpdationPage";
import { ProfilePage } from "./components/admin/ProfilePage";

// Session is kept in localStorage so a page refresh doesn't kick the
// person back to the login screen — it stays on whichever portal
// (student / trainer / admin) they were last logged into.
const USER_SESSION_KEY = "titan_user_session";
const ADMIN_SESSION_KEY = "titan_admin_session";

function loadSession(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { isLoggedIn: false, role: "", data: null };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.isLoggedIn) return parsed;
    return { isLoggedIn: false, role: "", data: null };
  } catch {
    return { isLoggedIn: false, role: "", data: null };
  }
}

function App() {
  const [user, setUser] = useState(() => loadSession(USER_SESSION_KEY));
  const [admin, setAdmin] = useState(() => loadSession(ADMIN_SESSION_KEY));

  // Keep localStorage in sync whenever either session changes.
  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (admin.isLoggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [admin]);

  const handleLoginSuccess = (role, data) => {
    setUser({
      isLoggedIn: true,
      role,
      data,
    });
  };

  const handleUpdateUser = (updatedData) => {
    setUser((prev) => {
      if (!prev.isLoggedIn) return prev;
      return {
        ...prev,
        data: { ...prev.data, ...updatedData },
      };
    });
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      role: "",
      data: null,
    });
  };

  const handleAdminLoginSuccess = (matchedAdmin) => {
    setAdmin({
      isLoggedIn: true,
      role: matchedAdmin.role,
      data: matchedAdmin,
    });
  };

  const handleAdminLogout = () => {
    setAdmin({
      isLoggedIn: false,
      role: "",
      data: null,
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !user.isLoggedIn ? (
              <TitanPortal onLoginSuccess={handleLoginSuccess} />
            ) : user.role === "trainer" ? (
              <Navigate to="/trainer" replace />
            ) : (
              <Navigate to="/student" replace />
            )
          }
        />

        <Route
          path="/trainer"
          element={
            user.isLoggedIn && user.role === "trainer" ? (
              // trainer={user.data} = real admin-saved record jo TitanPortal
              // login se aaya (id, name, email, photo, courses[], cities[],
              // campus, slotSchedule, status) — pehle yeh prop pass hi nahi
              // ho rahi thi, isliye Dashboard hamesha apna purana/hardcoded
              // fallback data dikha raha tha.
              <Dashboard trainer={user.data} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Dedicated admission/enroll page — reachable from the "New
           Admission" button on the home portal. Login itself stays on
           TitanPortal (/), this page no longer has a login section.
           Temporarily commented out — admission section hidden. */}

{/* Ye apply form wala section */}

        <Route path="/student-login" element={<StudentAuth />} />
        <Route path="/apply" element={<StudentAuth />} />

        <Route
          path="/student"
          element={
            user.isLoggedIn && user.role === "student" ? (
              <StudentDashboard
                studentName={user.data?.name || user.data?.studentName}
                studentId={user.data?.id || user.data?._id || null}
                rollNumber={user.data?.rollNumber}
                course={user.data?.course}
                campus={user.data?.campus}
                cnic={user.data?.cnic}
                dob={user.data?.dob}
                email={user.data?.email}
                phone={user.data?.phone}
                photo={user.data?.photo}
                timing={user.data?.timing}
                fatherName={user.data?.fatherName}
                admissionNo={user.data?.admissionNo}
                batch={user.data?.batch}
                createdAt={user.data?.createdAt}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ---- Admin Portal ---- */}

        {/* /admin = login screen. Login ho chuka ho to seedha dashboard par */}
        <Route
          path="/admin"
          element={
            !admin.isLoggedIn ? (
              <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />

        {/* /admin/dashboard = sidebar+topbar layout (AdminDashboard), andar
           Outlet se har module (Students/Attendance/Trainers/Slots/...)
           apne route par render hota hai. RequireAuth login + Sub Admin
           role-restriction dono sambhalta hai. */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth user={admin.isLoggedIn ? admin.data : null}>
              <AdminDashboard user={admin.data} onLogout={handleAdminLogout} />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage user={admin.data} />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="attendance/mark" element={<MarkAttendancePage />} />
          <Route path="attendance/view" element={<ViewAttendancePage />} />
          <Route path="attendance/multi" element={<MultiAttendancePage />} />
          <Route path="trainers" element={<TrainersListPage />} />
          <Route path="trainers/attendance/mark" element={<MarkTrainerAttendancePage />} />
          <Route path="trainers/attendance/view" element={<ViewTrainerAttendancePage />} />
          <Route path="trainers/attendance/request" element={<TrainerAttendanceRequestPage />} />
          <Route path="administration" element={<SlotsPage />} />
          <Route path="updation" element={<UpdationPage />} />
          <Route path="profile" element={<ProfilePage user={admin.data} onLogout={handleAdminLogout} />} />
          {/* Koi unknown sub-route AdminDashboard ke andar aaye to students par bhej do */}
          <Route path="*" element={<Navigate to="/admin/dashboard/students" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;