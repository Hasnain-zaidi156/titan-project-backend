import { Routes, Route, Navigate } from "react-router-dom";

import { AdminLogin } from "../components/AdminLogin";
import { RequireAuth } from "../components/RequireAuth";
import { AdminDashboard } from "../components/AdminDashboard";

import { DashboardPage } from "../components/DashboardPage";
import { StudentsPage } from "../components/StudentsPage";
import { MarkAttendancePage } from "../components/MarkAttendancePage";
import { ViewAttendancePage } from "../components/ViewAttendancePage";
import { MultiAttendancePage } from "../components/MultiAttendancePage";
import { TrainersListPage } from "../components/TrainersListPage";
import { MarkTrainerAttendancePage } from "../components/MarkTrainerAttendancePage";
import { ViewTrainerAttendancePage } from "../components/ViewTrainerAttendancePage";
import { TrainerAttendanceRequestPage } from "../components/TrainerAttendanceRequestPage";
import { SlotsPage } from "../components/SlotsPage";
import { UpdationPage } from "../components/UpdationPage";
import { ProfilePage } from "../components/ProfilePage";

// user + onLoginSuccess/onLogout App.jsx se aate hain (login state wahan
// rehta hai). Sub Admin restricted routes kholne ki koshish kare to
// RequireAuth usko /admin/students par bhej deta hai.
export function AdminRoutes({ user, onLoginSuccess, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/admin" : "/login"} replace />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/admin" replace /> : <AdminLogin onLoginSuccess={onLoginSuccess} />}
      />

      <Route
        path="/admin"
        element={
          <RequireAuth user={user}>
            <AdminDashboard user={user} onLogout={onLogout} />
          </RequireAuth>
        }
      >
        {/* index = Dashboard, Super Admin only (RequireAuth Sub Admin ko students par bhej deta hai) */}
        <Route index element={<DashboardPage user={user} />} />

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
        <Route path="profile" element={<ProfilePage user={user} onLogout={onLogout} />} />

        {/* Koi unknown sub-route AdminDashboard ke andar aaye to students par bhej do */}
        <Route path="*" element={<Navigate to="/admin/students" replace />} />
      </Route>

      {/* Bilkul unknown top-level route */}
      <Route path="*" element={<Navigate to={user ? "/admin" : "/login"} replace />} />
    </Routes>
  );
}
