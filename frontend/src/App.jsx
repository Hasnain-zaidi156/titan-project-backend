import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import TitanPortal from "./components/TitanPortal";
import Dashboard from "./components/Dashboard";
import StudentDashboard from "./components/StudentDashboard";
import { AdminLogin, AdminDashboard } from "./components/SuperAdmin";

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: "",
    data: null,
  });

  const [admin, setAdmin] = useState({
    isLoggedIn: false,
    role: "",
    data: null,
  });

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
                studentName={user.data?.name}
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