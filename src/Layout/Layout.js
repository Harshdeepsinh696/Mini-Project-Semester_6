// ══════════════════════════════════════════════════════════
//  Layout.jsx  |  src/Layout/Layout.jsx
//  Updated: avatar replaced with ProfileDropdown
// ══════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "../Profile/ProfileDropdown";
import "./Layout.css";

/* ── Route map ── */
const NAV_ROUTES = {
  Today:    "/today",
  Upcoming: "/upcoming",
  History:  "/history",
  Settings: "/settings",
};

/* ── Nav items ── */
const navItems = [
  {
    label: "Today",
    group: "main",
    count: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Upcoming",
    group: "main",
    count: 6,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "History",
    group: "main",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    ),
  },
  {
    label: "Settings",
    group: "more",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M21 12h-2M5 12H3M18.66 18.66l-1.41-1.41M6.34 5.34L4.93 3.93M12 21v-2M12 5V3" />
      </svg>
    ),
  },
];

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Sidebar inner content ── */
function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeLabel = Object.entries(NAV_ROUTES).find(
    ([, path]) => location.pathname === path
  )?.[0] ?? null;

  const go = (label) => {
    navigate(NAV_ROUTES[label] ?? "/today");
    if (onClose) onClose();
  };

  const mainItems = navItems.filter((n) => n.group === "main");
  const moreItems = navItems.filter((n) => n.group === "more");

  return (
    <>
      {/* Brand + Profile dropdown */}
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M10.5 2.343a7 7 0 0 1 9.9 9.9l-9 9a7 7 0 1 1-9.9-9.9z" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </div>
          <span className="brand-name">Medi<span>Care</span></span>
        </div>

        {/* ← ProfileDropdown replaces the old plain avatar button */}
        <ProfileDropdown />
      </div>

      {/* Main nav */}
      <div className="nav-label">Navigation</div>
      {mainItems.map((item) => (
        <button
          key={item.label}
          className={`nav-btn ${activeLabel === item.label ? "active" : ""}`}
          onClick={() => go(item.label)}
        >
          {activeLabel === item.label && <div className="nav-active-bar" />}
          {item.icon}
          {item.label}
          {item.count != null && (
            <span className="nav-count">{item.count}</span>
          )}
        </button>
      ))}

      <div className="nav-divider" />
      <div className="nav-label">More</div>
      {moreItems.map((item) => (
        <button
          key={item.label}
          className={`nav-btn ${activeLabel === item.label ? "active" : ""}`}
          onClick={() => go(item.label)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}

      {/* Streak */}
      <div className="streak-box">
        <span className="streak-fire">🔥</span>
        <div className="streak-text">
          <strong>7-Day Streak!</strong>
          Keep it up, great job!
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   LAYOUT  —  exported, wraps every page
   ══════════════════════════════════════════════════════════ */
export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageLabel = Object.entries(NAV_ROUTES).find(
    ([, path]) => location.pathname === path
  )?.[0] ?? "MediCare";

  return (
    <div className="page-wrapper">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app">
        {/* ── Sidebar ── */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </div>

        {/* ── Page content area ── */}
        <div className="layout-main">
          {/* Mobile topbar */}
          <div className="mobile-topbar">
            <div className="mobile-brand">
              <div className="mobile-brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M10.5 2.343a7 7 0 0 1 9.9 9.9l-9 9a7 7 0 1 1-9.9-9.9z" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                </svg>
              </div>
              {pageLabel}
            </div>
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

          {/* Page content injected here */}
          {children}
        </div>
      </div>
    </div>
  );
}