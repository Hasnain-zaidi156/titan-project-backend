import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { ICONS } from "./Icon";
import { TITAN_LOGO } from "../../constants/config";
import { navItemsForRole, findActiveNavLabel, navGroupHasActive } from "../../constants/navItems";
import "./SuperAdmin.css";

// Poore admin portal ka layout (sidebar + topbar). Route badalne ke liye
// activePage state ki jagah ab navigate(path) use hota hai — har sidebar
// item apna route (relative to /admin) le kar aata hai (dekho constants/navItems.js)
export function AdminDashboard({ user, onLogout }) {
  const isSubAdmin = user?.role === "Sub Admin";
  const navItems = navItemsForRole(user?.role);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // desktop: expanded/collapsed
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile: slide in/out
  const [openGroups, setOpenGroups] = useState(() => ({
    "attendance-group": false,
    "administration-group": false,
    "trainers-group": false,
    "trainer-attendance-subgroup": false,
  }));

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const toggleMobileSidebar = () => setIsMobileOpen((p) => !p);
  const toggleGroup = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // Top-level group (Attendance/Trainers/Administration) par click: agar
  // sidebar collapsed hai to ek hi click mein sidebar expand + wo group
  // open ho jaye — alag se arrow click na karna pade
  const handleGroupClick = (key) => {
    if (!isSidebarOpen && !isMobileOpen) {
      setIsSidebarOpen(true);
      setOpenGroups((prev) => ({ ...prev, [key]: true }));
    } else {
      toggleGroup(key);
    }
  };

  const goTo = (relativePath) => {
    // "" (dashboard/index) ke liye seedha /admin/dashboard, baaki sab /admin/dashboard/<path>
    navigate(relativePath ? `/admin/dashboard/${relativePath}` : "/admin/dashboard");
    setIsMobileOpen(false);
  };

  const isActivePath = (relativePath) => {
    const full = relativePath ? `/admin/dashboard/${relativePath}` : "/admin/dashboard";
    if (relativePath === "") return location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard/";
    return location.pathname.startsWith(full);
  };

  const activeNavLabel = findActiveNavLabel(location.pathname, navItems);

  return (
    <div className="ta-root">
      <div className="ta-dash">
        {/* Mobile top bar */}
        <div className="ta-mobile-bar">
          <button className="ta-mobile-hamburger" onClick={toggleMobileSidebar} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img src={TITAN_LOGO} alt="TITAN" className="ta-mobile-logo" />
        </div>

        {isMobileOpen && (
          <div className="ta-mobile-overlay" onClick={() => setIsMobileOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`ta-sidebar ${isSidebarOpen ? "expanded" : "collapsed"} ${
            isMobileOpen ? "mobile-open" : ""
          }`}
        >
          <button
            type="button"
            className="ta-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              {isSidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
          </button>

          <div className="ta-sidebar-brand">
            <img src={TITAN_LOGO} alt="TITAN" />
            {(isSidebarOpen || isMobileOpen) && (
              <div className="ta-sidebar-brand-text">
                <strong>TITAN</strong>
                <span>{isSubAdmin ? "SUB ADMIN PORTAL" : "ADMIN PORTAL"}</span>
              </div>
            )}
          </div>

          <nav className="ta-nav">
            {navItems.map((item) => {
              const showLabels = isSidebarOpen || isMobileOpen;

              if (item.type === "link") {
                return (
                  <div
                    key={item.key}
                    className={`ta-nav-item ${isActivePath(item.path) ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => goTo(item.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(item.path);
                      }
                    }}
                  >
                    <Icon path={item.icon} />
                    {showLabels && <span>{item.label}</span>}
                  </div>
                );
              }

              const isOpen = !!openGroups[item.key];
              const groupHasActiveChild = navGroupHasActive(item, location.pathname);

              return (
                <div key={item.key} className="ta-nav-group">
                  <div
                    className={`ta-nav-item ta-nav-group-header ${groupHasActiveChild ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => handleGroupClick(item.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleGroupClick(item.key);
                      }
                    }}
                  >
                    <Icon path={item.icon} />
                    {showLabels && <span>{item.label}</span>}
                    {showLabels && (
                      <span
                        className="ta-nav-chevron"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <Icon path={ICONS.chevronDown} size={14} />
                      </span>
                    )}
                  </div>

                  {showLabels && isOpen && (
                    <div className="ta-nav-children">
                      {item.children.map((child) => {
                        if (child.type === "subgroup") {
                          const subOpen = !!openGroups[child.key];
                          const subHasActive = child.children.some((sc) => isActivePath(sc.path));
                          return (
                            <div key={child.key} className="ta-nav-group">
                              <div
                                className={`ta-nav-subgroup-header ${subHasActive ? "active" : ""}`}
                                role="button"
                                tabIndex={0}
                                aria-expanded={subOpen}
                                onClick={() => toggleGroup(child.key)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleGroup(child.key);
                                  }
                                }}
                              >
                                <span>{child.label}</span>
                                <span
                                  className="ta-nav-chevron"
                                  style={{ transform: subOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                >
                                  <Icon path={ICONS.chevronDown} size={12} />
                                </span>
                              </div>
                              {subOpen && (
                                <div className="ta-nav-subchildren">
                                  {child.children.map((sc) => (
                                    <div
                                      key={sc.key}
                                      className={`ta-nav-item ta-nav-subchild ${isActivePath(sc.path) ? "active" : ""}`}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => goTo(sc.path)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          goTo(sc.path);
                                        }
                                      }}
                                    >
                                      <span>{sc.label}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={child.key}
                            className={`ta-nav-item ta-nav-child ${isActivePath(child.path) ? "active" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => goTo(child.path)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                goTo(child.path);
                              }
                            }}
                          >
                            <span>{child.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <button className="ta-sidebar-logout" onClick={onLogout}>
            <Icon path={ICONS.logout} size={16} />
            {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
          </button>
        </aside>

        <main
          className={`ta-main ${
            isSidebarOpen ? "offset-expanded" : "offset-collapsed"
          }`}
        >
          {/* Yahan react-router har route ke hisaab se page render karega —
             dekho src/routes/AdminRoutes.jsx */}
          <Outlet context={{ user, activeNavLabel }} />
        </main>
      </div>
    </div>
  );
}
