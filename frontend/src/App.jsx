import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import TitanPortal from "./components/TitanPortal";
import Dashboard from "./components/Dashboard";
import StudentDashboard from "./components/StudentDashboard";
import { AdminLogin, AdminDashboard } from "./components/SuperAdmin";

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
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/student"
          element={
            user.isLoggedIn && user.role === "student" ? (
              <StudentDashboard
                studentName={user.data?.studentName}
                studentId={user.data?.id}
                rollNumber={user.data?.rollNumber}
                course={user.data?.course}
                campus={user.data?.campus}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ---- Admin Portal ---- */}
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

        <Route
          path="/admin/dashboard"
          element={
            admin.isLoggedIn ? (
              <AdminDashboard user={admin.data} onLogout={handleAdminLogout} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;