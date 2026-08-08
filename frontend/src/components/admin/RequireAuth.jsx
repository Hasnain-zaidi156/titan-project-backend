import { Navigate, useLocation } from "react-router-dom";

// Super Admin-only routes ki list (path App.jsx ke Route tree ke hisaab se)
const SUPER_ADMIN_ONLY_PATHS = [
  "/admin/dashboard/administration",
  "/admin/dashboard/updation",
  "/admin/dashboard/trainers/attendance/request",
];

// /admin/dashboard (exact, index) sirf Super Admin ka hai — Sub Admin login
// ke baad seedha /admin/dashboard/students par land karta hai (nav bhi
// Dashboard link nahi dikhata)
function isSuperAdminOnly(pathname) {
  if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") return true;
  return SUPER_ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p));
}

// AdminDashboard layout Route ke around wrap karo: login na ho to /admin
// (login page) bhej do, Sub Admin restricted page kholne ki koshish kare to
// /admin/dashboard/students par bhej do
export function RequireAuth({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "Sub Admin" && isSuperAdminOnly(location.pathname)) {
    return <Navigate to="/admin/dashboard/students" replace />;
  }

  return children;
}
