// ══════════════════════════════════════════════════════════
//  Login.jsx  |  src/Login-Create/Login.jsx
//  Renders as a modal overlay over whatever is behind it
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.documentElement.classList.add("modal-open");
    return () => { document.documentElement.classList.remove("modal-open"); };
  }, []);

  /* Close on Escape key */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/today");
  };

  return (
    /* Backdrop — click outside card to close */
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}   /* prevent close when clicking card */
      >
        {/* ── Close button ── */}
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* ── Header ── */}
        <div className="auth-card-head">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white"/>
              </svg>
            </div>
            <span>Medi<strong>Care</strong></span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to continue your health journey</p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="auth-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className="auth-input" autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-field-row">
              <label className="auth-label">Password</label>
              <button type="button" className="auth-forgot">Forgot password?</button>
            </div>
            <div className="auth-input-wrap">
              <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type={showPass ? "text" : "password"} name="password"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange}
                className="auth-input" autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : (
              <>
                Sign in
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="auth-socials">
          <button className="auth-social">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path fill="#4285F4" d="M43.6 20.5H24v7h11.3C33.6 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.3-5.3C34 6.8 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20.5-8 20.5-20.5 0-1.4-.1-2.7-.4-4z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.1 8 3l5.3-5.3C34 6.8 29.3 4.5 24 4.5c-7.8 0-14.5 4.5-17.7 10.2z"/>
              <path fill="#FBBC05" d="M24 45.5c5.2 0 9.9-1.8 13.5-4.8l-6.2-5C29.3 37 26.8 38 24 38c-5.2 0-9.6-3.4-11.2-8l-6.6 5C9.5 41 16.3 45.5 24 45.5z"/>
              <path fill="#EA4335" d="M43.6 20.5H24v7h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5c3.7-3.4 5.9-8.4 5.9-14.1 0-1.4-.1-2.7-.4-4z"/>
            </svg>
            Google
          </button>
          <button className="auth-social">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} className="auth-switch-link">
            Create one free →
          </button>
        </p>

        {/* ── Admin access ── */}
        <div className="auth-admin-divider">
          <span>Admin Access</span>
        </div>
        <button
          className="auth-admin-btn"
          onClick={() => { onClose?.(); navigate("/admin/login"); }}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign in as Administrator
        </button>
      </div>
    </div>
  );
}