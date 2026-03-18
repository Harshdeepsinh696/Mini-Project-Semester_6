// ══════════════════════════════════════════════════════════
//  ProfileDropdown.jsx  |  src/Profile/ProfileDropdown.jsx
//  Avatar click → dropdown with user info + nav options
// ══════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";

const MENU_ITEMS = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    label: "My Profile",
    route: "/profile",
    accent: false,
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "Edit Profile",
    route: "/profile?tab=edit",
    accent: false,
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "My Medicines",
    route: "/today",
    accent: false,
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Health Info",
    route: "/profile?tab=health",
    accent: false,
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "Settings",
    route: "/settings",
    accent: false,
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "Notifications",
    route: "/profile?tab=notifications",
    accent: false,
  },
];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const go = (route) => {
    setOpen(false);
    navigate(route);
  };

  return (
    <div className="pd-wrap" ref={ref}>
      {/* Avatar trigger button */}
      <button className="pd-avatar" onClick={() => setOpen(p => !p)} aria-label="Profile menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <div className="pd-avatar-dot" />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="pd-menu">
          {/* User info header */}
          <div className="pd-header">
            <div className="pd-header-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="pd-header-info">
              <div className="pd-header-name">Tushar</div>
              <div className="pd-header-email">tushar@email.com</div>
            </div>
          </div>

          <div className="pd-divider" />

          {/* Menu items */}
          {MENU_ITEMS.map((item) => (
            <button key={item.label} className="pd-item" onClick={() => go(item.route)}>
              <span className="pd-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="pd-divider" />

          {/* Logout */}
          <button className="pd-item pd-item--logout" onClick={() => go("/")}>
            <span className="pd-item-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}