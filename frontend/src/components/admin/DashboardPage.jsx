import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { API_URL } from "../../constants/config";

const STAT_CARDS = [
  { label: "Total Students", key: "totalStudents", icon: ICONS.users },
  { label: "Enrolled Students", key: "enrolledStudents", icon: ICONS.trend },
  { label: "Courses", key: "courses", icon: ICONS.book },
  { label: "Campuses", key: "campuses", icon: ICONS.building },
];

export function DashboardPage({ user }) {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    enrolledStudents: 0,
    courses: 0,
    campuses: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/dashboard`);
        const data = await response.json();
        if (response.ok) {
          setDashboardStats({
            totalStudents: data.totalStudents ?? 0,
            enrolledStudents: data.enrolledStudents ?? 0,
            courses: data.courses ?? 0,
            campuses: data.campuses ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <div className="ta-topbar">
        <div>
          <p className="ta-welcome-eyebrow">Welcome back</p>
          <h1 className="ta-welcome-title">{user?.role ?? "Admin"}</h1>
          <p className="ta-welcome-sub">{user?.email}</p>
        </div>
        <span className="ta-role-badge">
          <Icon path={ICONS.shield} size={14} />
          {user?.role}
        </span>
      </div>

      <div className="ta-stat-grid">
        {STAT_CARDS.map((card) => (
          <div className="ta-stat-card" key={card.label}>
            <div className="ta-stat-icon">
              <Icon path={card.icon} size={20} />
            </div>
            <p className="ta-stat-value">
              {statsLoading ? "—" : dashboardStats[card.key].toLocaleString()}
            </p>
            <p className="ta-stat-label">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="ta-panel">
        <h3>Role-Based Access</h3>
        <p>
          Super Admin has full portal access including Dashboard, Administration
          and Updation. Sub Admin signs in with its own password and gets a
          restricted portal: Students, Attendance (Mark / View / Multi),
          Trainers and Profile.
        </p>
        <div className="ta-panel-divider" />
        <p>
          You're signed in as <strong style={{ color: "var(--ta-royal-blue)" }}>{user?.role}</strong>.
          Use the navigation on the left to explore portal sections.
        </p>
      </div>
    </>
  );
}
