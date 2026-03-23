// src/Admin/AdminLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.email !== "admin@medicare.app" || form.password !== "admin123") {
      setError("Invalid credentials. Try admin@medicare.app / admin123");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="alog-root">
      <div className="alog-bg">
        <div className="alog-blob1"/><div className="alog-blob2"/><div className="alog-blob3"/>
        <div className="alog-grid"/>
      </div>

      <div className="alog-card">
        {/* Top line */}
        <div className="alog-card-line"/>

        {/* Brand */}
        <div className="alog-brand">
          <div className="alog-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white"/>
            </svg>
          </div>
          <span className="alog-brand-name">Medi<strong>Care</strong></span>
        </div>

        <div className="alog-shield">🛡️</div>
        <h1 className="alog-title">Admin Access</h1>
        <p className="alog-sub">Sign in to the admin control panel</p>

        {error && (
          <div className="alog-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="alog-form">
          <div className="alog-field">
            <label className="alog-label">Admin Email</label>
            <div className="alog-input-wrap">
              <svg className="alog-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="email" placeholder="admin@medicare.app"
                value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                className="alog-input" autoComplete="email"/>
            </div>
          </div>

          <div className="alog-field">
            <label className="alog-label">Password</label>
            <div className="alog-input-wrap">
              <svg className="alog-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="password" placeholder="Enter admin password"
                value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                className="alog-input" autoComplete="current-password"/>
            </div>
          </div>

          <div className="alog-hint">Hint: admin@medicare.app / admin123</div>

          <button type="submit" className="alog-btn" disabled={loading}>
            {loading ? <span className="alog-spinner"/> : (
              <>🛡️ Sign In to Admin Panel</>
            )}
          </button>
        </form>

        <button className="alog-back" onClick={() => navigate("/")}>
          ← Back to App
        </button>
      </div>
    </div>
  );
}