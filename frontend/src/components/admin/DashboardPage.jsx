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

  // Admission open/close — controls whether the public "New Admission"
  // form (StudentAuth) accepts applications. Super Admin toggles it here;
  // Sub Admin sees it read-only.


  const [admissionsOpen, setAdmissionsOpen] = useState(true);
  const [admissionLoading, setAdmissionLoading] = useState(true);
  const [admissionSaving, setAdmissionSaving] = useState(false);
  const canManageAdmissions = user?.role === "Super Admin";

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

    const loadAdmissionStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admission-status`, { cache: "no-store" });
        const data = await response.json();
        if (response.ok) setAdmissionsOpen(data.admissionsOpen !== false);
      } catch (error) {
        console.error("Failed to load admission status", error);
      } finally {
        setAdmissionLoading(false);
      }
    };

    loadStats();
    loadAdmissionStatus();
  }, []);

  const toggleAdmissions = async () => {
    if (!canManageAdmissions || admissionSaving) return;
    const next = !admissionsOpen;
    setAdmissionSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/admission-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionsOpen: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");
      setAdmissionsOpen(data.admissionsOpen);
    } catch (error) {
      console.error("Failed to update admission status", error);
    } finally {
      setAdmissionSaving(false);
    }
  };

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
        <h3>Admissions</h3>
        <p>
          Control whether the public "New Admission" form on the portal is
          accepting new applications right now.
        </p>
        <div className="ta-panel-divider" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <span>
            Admissions are currently{" "}
            <strong style={{ color: admissionLoading ? "inherit" : admissionsOpen ? "#16a34a" : "#dc2626" }}>
              {admissionLoading ? "loading…" : admissionsOpen ? "OPEN" : "CLOSED"}
            </strong>
          </span>
          <button
            type="button"
            className="ta-btn-primary"
            disabled={!canManageAdmissions || admissionLoading || admissionSaving}
            onClick={toggleAdmissions}
            title={!canManageAdmissions ? "Only Super Admin can change this" : undefined}
            style={admissionsOpen ? { background: "#dc2626", borderColor: "#dc2626" } : { background: "#16a34a", borderColor: "#16a34a" }}
          >
            {admissionSaving ? "Saving…" : admissionsOpen ? "Close Admissions" : "Open Admissions"}
          </button>
        </div>
        {!canManageAdmissions && (
          <p style={{ marginTop: 8, fontSize: "0.8rem", opacity: 0.7 }}>
            Only Super Admin can open or close admissions.
          </p>
        )}
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
