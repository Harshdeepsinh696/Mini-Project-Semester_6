// ══════════════════════════════════════════════════════════
//  Signup.jsx  |  src/Login-Create/Signup.jsx
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "",
    gender: "", password: "", confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [agreed, setAgreed]     = useState(false);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.documentElement.classList.add("modal-open");
    return () => document.documentElement.classList.remove("modal-open");
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const pwdStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  };
  const strength      = pwdStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.dob || !form.gender || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms to continue.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    navigate("/today");
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card auth-card--wide" onClick={(e) => e.stopPropagation()}>

        {/* ── Close ── */}
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2"
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
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Free forever · No credit card required</p>
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

          {/* Row 1 — Name + Email */}
          <div className="auth-form-row">
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input type="text" name="name" placeholder="Jane Doe"
                  value={form.name} onChange={handleChange}
                  className="auth-input" autoComplete="name"/>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  className="auth-input" autoComplete="email"/>
              </div>
            </div>
          </div>

          {/* Row 2 — Phone + Date of Birth */}
          <div className="auth-form-row">
            <div className="auth-field">
              <label className="auth-label">Phone number</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="tel" name="phone" placeholder="+91 98765 43210"
                  value={form.phone} onChange={handleChange}
                  className="auth-input" autoComplete="tel"/>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Date of birth</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input type="date" name="dob"
                  value={form.dob} onChange={handleChange}
                  className="auth-input auth-input--date"
                  max={new Date().toISOString().split("T")[0]}/>
              </div>
            </div>
          </div>

          {/* Row 3 — Gender (radio buttons) */}
          <div className="auth-field">
            <label className="auth-label">Gender</label>
            <div className="auth-gender-row">
              {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                <label key={g} className={`auth-gender-opt ${form.gender === g ? "auth-gender-opt--active" : ""}`}>
                  <input
                    type="radio" name="gender" value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    className="auth-radio"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Row 4 — Password + Confirm */}
          <div className="auth-form-row">
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type={showPass ? "text" : "password"} name="password"
                  placeholder="Create a strong password"
                  value={form.password} onChange={handleChange}
                  className="auth-input" autoComplete="new-password"/>
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
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)", transition: "background 0.3s" }}/>
                    ))}
                  </div>
                  <span className="auth-strength-lbl" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type={showPass ? "text" : "password"} name="confirm"
                  placeholder="Re-enter your password"
                  value={form.confirm} onChange={handleChange}
                  className={`auth-input ${form.confirm && form.password !== form.confirm ? "auth-input--err" : ""}`}
                  autoComplete="new-password"/>
                {form.confirm && form.password === form.confirm && (
                  <div className="auth-eye" style={{ pointerEvents: "none" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="auth-terms">
            <input type="checkbox" checked={agreed}
              onChange={e => setAgreed(e.target.checked)} className="auth-checkbox"/>
            <span>
              I agree to the{" "}
              <button type="button" className="auth-switch-link">Terms of Service</button>
              {" "}and{" "}
              <button type="button" className="auth-switch-link">Privacy Policy</button>
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : (
              <>
                Create account
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider"><span>or sign up with</span></div>

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
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.567-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="auth-switch-link">Sign in →</button>
        </p>
      </div>
    </div>
  );
}