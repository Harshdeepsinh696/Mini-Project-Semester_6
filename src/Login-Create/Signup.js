// ══════════════════════════════════════════════════════════
//  Signup.jsx  |  src/Login-Create/Signup.jsx
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

export default function Signup({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "",
    gender: "", password: "", confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

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
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = pwdStrength(form.password);
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

    const password = (form.password || "").trim();
    const confirm = (form.confirm || "").trim();

    if (password !== confirm) {
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

    try {
      setLoading(true);

      const res = await axios.post("https://localhost:7205/api/auth/signup", {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        password: form.password,
        confirm: form.confirm
      });
      
      localStorage.setItem("userId", res.data.userId);

      setLoading(false);

      navigate("/today");

    }
    catch (err) {
      setLoading(false);

      console.log("FULL ERROR:", err.response);
      console.log("DATA:", err.response?.data);

      setError(JSON.stringify(err.response?.data));
    }

  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card auth-card--wide" onClick={(e) => e.stopPropagation()}>

        {/* ── Close ── */}
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2"
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
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Free forever · No credit card required</p>
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

          {/* Row 1 — Name + Email */}
          <div className="auth-form-row">
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input type="text" name="name" placeholder="Jane Doe"
                  value={form.name} onChange={handleChange}
                  className="auth-input" autoComplete="name" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  className="auth-input" autoComplete="email" />
              </div>
            </div>
          </div>

          {/* Row 2 — Phone + Date of Birth */}
          <div className="auth-form-row">
            <div className="auth-field">
              <label className="auth-label">Phone number</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input type="tel" name="phone" placeholder="+91 98765 43210"
                  value={form.phone} onChange={handleChange}
                  className="auth-input" autoComplete="tel" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Date of birth</label>
              <div className="auth-input-wrap">
                <svg className="auth-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input type="date" name="dob"
                  value={form.dob} onChange={handleChange}
                  className="auth-input auth-input--date"
                  max={new Date().toISOString().split("T")[0]} />
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
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input type={showPass ? "text" : "password"} name="password"
                  placeholder="Create a strong password"
                  value={form.password} onChange={handleChange}
                  className="auth-input" autoComplete="new-password" />
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
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
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
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input type={showPass ? "text" : "password"} name="confirm"
                  placeholder="Re-enter your password"
                  value={form.confirm} onChange={handleChange}
                  className={`auth-input ${form.confirm && form.password !== form.confirm ? "auth-input--err" : ""}`}
                  autoComplete="new-password" />
                {form.confirm && form.password === form.confirm && (
                  <div className="auth-eye" style={{ pointerEvents: "none" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="auth-terms">
            <input type="checkbox" checked={agreed}
              onChange={e => setAgreed(e.target.checked)} className="auth-checkbox" />
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
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="auth-switch-link">Sign in →</button>
        </p>
      </div>
    </div>
  );
}