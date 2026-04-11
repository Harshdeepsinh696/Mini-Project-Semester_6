// ══════════════════════════════════════════════════════════
//  Login.jsx  |  src/Login-Create/Login.jsx
//  Renders as a modal overlay over whatever is behind it
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

export default function Login({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      const res = await axios.post("https://localhost:7205/api/auth/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("userId", res.data.user.id);

      navigate("/today");

    }
    catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }

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
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ── Header ── */}
        <div className="auth-card-head">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white" />
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
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
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
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} className="auth-switch-link">
            Create one free →
          </button>
        </p>
      </div>
    </div>
  );
}