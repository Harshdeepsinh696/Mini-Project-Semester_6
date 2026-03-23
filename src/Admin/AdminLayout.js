// src/Admin/AdminLayout.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const NAV = [
  { id:"dashboard",     label:"Dashboard",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>, path:"/admin" },
  { id:"users",         label:"Users",         icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/users" },
  { id:"medicines",     label:"Medicines",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/medicines" },
  { id:"reminders",     label:"Reminders",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/reminders" },
  { id:"reports",       label:"Reports",       icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/reports" },
  { id:"notifications", label:"Notifications", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/notifications" },
  { id:"emergency",     label:"Emergency",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/emergency" },
  { id:"feedback",      label:"Feedback",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/feedback" },
  { id:"settings",      label:"Settings",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, path:"/admin/settings" },
];

export default function AdminLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const activeId = NAV.find(n =>
    n.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(n.path)
  )?.id;

  const activeLabel = NAV.find(n => n.id === activeId)?.label || "Admin";

  return (
    <div className="al-root">
      {open && <div className="al-overlay" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`al-sidebar ${open ? "al-sidebar--open" : ""}`}>
        <div className="al-brand">
          <div className="al-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white"/>
            </svg>
          </div>
          <div className="al-brand-text">
            <div className="al-brand-name">Medi<span>Care</span></div>
            <div className="al-brand-sub">Admin Panel</div>
          </div>
        </div>

        <div className="al-nav-group-label">Main Menu</div>
        <nav className="al-nav">
          {NAV.slice(0,6).map(n => (
            <button key={n.id}
              className={`al-nav-btn ${activeId === n.id ? "al-nav-btn--active" : ""}`}
              onClick={() => { navigate(n.path); setOpen(false); }}>
              {activeId === n.id && <span className="al-active-bar" />}
              <span className="al-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="al-nav-group-label">System</div>
        <nav className="al-nav">
          {NAV.slice(6).map(n => (
            <button key={n.id}
              className={`al-nav-btn ${activeId === n.id ? "al-nav-btn--active" : ""}`}
              onClick={() => { navigate(n.path); setOpen(false); }}>
              {activeId === n.id && <span className="al-active-bar" />}
              <span className="al-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <div className="al-admin-info">
            <div className="al-admin-av">A</div>
            <div>
              <div className="al-admin-name">Super Admin</div>
              <div className="al-admin-role">admin@medicare.app</div>
            </div>
          </div>
          <button className="al-logout" onClick={() => navigate("/")}
            title="Back to App">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="al-main">
        <header className="al-topbar">
          <button className="al-hamburger" onClick={() => setOpen(p => !p)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="al-topbar-title">{activeLabel}</div>
          <div className="al-topbar-right">
            <button className="al-topbar-notif">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="al-notif-dot" />
            </button>
            <div className="al-topbar-badge">🛡️ Admin</div>
            <button className="al-topbar-back" onClick={() => navigate("/")}>← Back to App</button>
          </div>
        </header>
        <main className="al-content">{children}</main>
      </div>
    </div>
  );
}