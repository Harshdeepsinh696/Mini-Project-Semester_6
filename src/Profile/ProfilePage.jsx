// ══════════════════════════════════════════════════════════
//  ProfilePage.jsx  |  src/Profile/ProfilePage.jsx
//  Photo change syncs to sidebar + dropdown via ProfileContext
// ══════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { useProfile } from "../Context/ProfileContext";
import { AvatarImg } from "./ProfileDropdown";
import "./ProfilePage.css";

const TABS = [
  { id: "profile",       label: "My Profile",   icon: "👤" },
  { id: "health",        label: "Health Info",   icon: "🏥" },
  { id: "medicines",     label: "Medicines",     icon: "💊" },
  { id: "emergency",     label: "Emergency",     icon: "🚨" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "security",      label: "Security",      icon: "🔐" },
];

function Field({ label, value, icon, type = "text", editable, onChange, placeholder }) {
  return (
    <div className="pp-field">
      <label className="pp-field-label">{label}</label>
      {editable ? (
        <div className="pp-field-input-wrap">
          {icon && <span className="pp-field-icon">{icon}</span>}
          <input type={type} value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || label} className="pp-input"/>
        </div>
      ) : (
        <div className="pp-field-val">
          {icon && <span className="pp-field-icon-static">{icon}</span>}
          <span>{value || <span className="pp-empty">Not set</span>}</span>
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, icon, children }) {
  return (
    <div className="pp-section">
      <div className="pp-section-head">
        <div className="pp-section-icon">{icon}</div>
        <div>
          <div className="pp-section-title">{title}</div>
          {subtitle && <div className="pp-section-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="pp-section-body">{children}</div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="pp-stat" style={{ "--sc": color }}>
      <div className="pp-stat-icon">{icon}</div>
      <div className="pp-stat-val">{value}</div>
      <div className="pp-stat-lbl">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile: ctxProfile, updatePhoto, updateProfile } = useProfile();

  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editing, setEditing]     = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);

  /* Local editable copy of profile info */
  const [localProfile, setLocalProfile] = useState({
    name:   ctxProfile.name,
    email:  ctxProfile.email,
    phone:  "+91 98765 43210",
    dob:    "1998-05-14",
    gender: "Male",
  });

  const [health, setHealth] = useState({
    diseases:   "Type 2 Diabetes, Hypertension",
    allergies:  "Penicillin, Pollen",
    bloodGroup: "B+",
    height:     "175 cm",
    weight:     "72 kg",
  });

  const [emergency, setEmergency] = useState({
    contactName:     "Priya Mehta",
    contactPhone:    "+91 98111 22333",
    contactRelation: "Wife",
    doctorName:      "Dr. Anjali Patel",
    doctorPhone:     "+91 98222 11444",
  });

  const [prefs, setPrefs] = useState({
    reminderType: "App",
    language:     "English",
    emailAlerts:  true,
    smsAlerts:    false,
  });

  const [passwords, setPasswords] = useState({ current: "", newp: "", confirm: "" });

  const age = localProfile.dob
    ? Math.floor((Date.now() - new Date(localProfile.dob)) / (365.25 * 24 * 3600 * 1000))
    : "—";

  /* Save local edits back to context so name/email update in dropdown */
  const handleSave = () => {
    updateProfile({ name: localProfile.name, email: localProfile.email });
    setEditing(false);
  };

  /* Photo change — updates context → syncs sidebar + dropdown instantly */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updatePhoto(url);            // ← updates ProfileContext
  };

  const handleRemovePhoto = () => updatePhoto(null);

  const set = (setter) => (key) => (val) =>
    setter(prev => ({ ...prev, [key]: val }));

  return (
    <Layout>
      <div className="pp-root">

        {/* ── Hero banner ── */}
        <div className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-inner">

            {/* Avatar — shows context photo, synced everywhere */}
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                {ctxProfile.photo ? (
                  <img src={ctxProfile.photo} alt="Profile" className="pp-avatar-img"/>
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                  </svg>
                )}
              </div>

              {/* Photo action buttons */}
              <div className="pp-photo-actions">
                {/* Upload new photo */}
                <label className="pp-photo-btn pp-photo-btn--upload" title="Upload photo">
                  <input type="file" accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}/>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>

                {/* Remove photo (only shown if photo exists) */}
                {ctxProfile.photo && (
                  <button className="pp-photo-btn pp-photo-btn--remove"
                    title="Remove photo" onClick={handleRemovePhoto}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="pp-hero-info">
              <h1 className="pp-hero-name">{ctxProfile.name}</h1>
              <p className="pp-hero-email">{ctxProfile.email}</p>
              <div className="pp-hero-pills">
                <span className="pp-hero-pill">{localProfile.gender}</span>
                <span className="pp-hero-pill">{age} yrs</span>
                <span className="pp-hero-pill pp-hero-pill--green">{health.bloodGroup}</span>
              </div>
            </div>

            <button className="pp-edit-btn"
              onClick={() => { setActiveTab("profile"); setEditing(e => !e); }}>
              {editing ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save changes
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Edit profile
                </>
              )}
            </button>
          </div>

          {/* Photo hint */}
          <div className="pp-photo-hint">
            📸 Click the upload button on your avatar to change profile photo
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="pp-tabs">
          {TABS.map(t => (
            <button key={t.id}
              className={`pp-tab ${activeTab === t.id ? "pp-tab--active" : ""}`}
              onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="pp-content">

          {/* MY PROFILE */}
          {activeTab === "profile" && (
            <div className="pp-grid">
              <Section title="Basic Information" icon="👤" subtitle="Your personal details">
                <div className="pp-fields-2col">
                  <Field label="Full name"     value={localProfile.name}   editable={editing} icon="🙍" onChange={set(setLocalProfile)("name")}/>
                  <Field label="Email address" value={localProfile.email}  editable={editing} icon="📧" type="email" onChange={set(setLocalProfile)("email")}/>
                  <Field label="Phone number"  value={localProfile.phone}  editable={editing} icon="📱" type="tel"   onChange={set(setLocalProfile)("phone")}/>
                  <Field label="Date of birth" value={localProfile.dob}    editable={editing} icon="🎂" type="date"  onChange={set(setLocalProfile)("dob")}/>
                </div>
                <div className="pp-fields-2col">
                  <div className="pp-field">
                    <label className="pp-field-label">Gender</label>
                    {editing ? (
                      <div className="pp-gender-row">
                        {["Male","Female","Other","Prefer not to say"].map(g => (
                          <label key={g} className={`pp-gender-opt ${localProfile.gender === g ? "pp-gender-opt--active" : ""}`}>
                            <input type="radio" name="gender" value={g}
                              checked={localProfile.gender === g}
                              onChange={() => setLocalProfile(p => ({ ...p, gender: g }))}
                              style={{ display: "none" }}/>
                            {g}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="pp-field-val">
                        <span className="pp-field-icon-static">⚧</span>
                        <span>{localProfile.gender}</span>
                      </div>
                    )}
                  </div>
                  <Field label="Blood group" value={health.bloodGroup} editable={editing} icon="🩸" onChange={set(setHealth)("bloodGroup")}/>
                </div>
                {editing && (
                  <button className="pp-save-btn" onClick={handleSave}>
                    Save changes
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </Section>
            </div>
          )}

          {/* HEALTH INFO */}
          {activeTab === "health" && (
            <div className="pp-grid">
              <Section title="Health Information" icon="🏥" subtitle="Medical details for better care">
                <div className="pp-fields-2col">
                  <Field label="Known diseases" value={health.diseases}   editable={editing} icon="🩺" onChange={set(setHealth)("diseases")}   placeholder="e.g. Diabetes, BP"/>
                  <Field label="Allergies"       value={health.allergies}  editable={editing} icon="⚠️" onChange={set(setHealth)("allergies")}  placeholder="e.g. Penicillin"/>
                  <Field label="Blood group"     value={health.bloodGroup} editable={editing} icon="🩸" onChange={set(setHealth)("bloodGroup")}/>
                  <Field label="Height"          value={health.height}     editable={editing} icon="📏" onChange={set(setHealth)("height")}     placeholder="e.g. 175 cm"/>
                  <Field label="Weight"          value={health.weight}     editable={editing} icon="⚖️" onChange={set(setHealth)("weight")}     placeholder="e.g. 72 kg"/>
                </div>
                {editing && <button className="pp-save-btn" onClick={() => setEditing(false)}>Save changes</button>}
              </Section>
            </div>
          )}

          {/* MEDICINES */}
          {activeTab === "medicines" && (
            <div className="pp-grid">
              <Section title="Medicine Overview" icon="💊" subtitle="Your current medication summary">
                <div className="pp-stats-row">
                  <StatCard icon="💊" value="3" label="Total Medicines"  color="#3b82f6"/>
                  <StatCard icon="✅" value="1" label="Taken Today"      color="#22c55e"/>
                  <StatCard icon="⏳" value="2" label="Pending Today"    color="#f59e0b"/>
                  <StatCard icon="❌" value="0" label="Missed This Week" color="#f87171"/>
                </div>
                <div className="pp-med-list">
                  {[
                    { name: "Aspirin",    dose: "500mg", freq: "Once daily",  status: "active", refill: 14 },
                    { name: "Metformin",  dose: "850mg", freq: "Twice daily", status: "active", refill: 28 },
                    { name: "Lisinopril", dose: "10mg",  freq: "Once daily",  status: "low",    refill: 5  },
                  ].map(m => (
                    <div key={m.name} className="pp-med-item">
                      <div className="pp-med-icon">💊</div>
                      <div className="pp-med-info">
                        <div className="pp-med-name">{m.name}
                          <span className={`pp-med-badge ${m.status === "low" ? "pp-med-badge--low" : ""}`}>
                            {m.status === "low" ? "Low stock" : "Active"}
                          </span>
                        </div>
                        <div className="pp-med-sub">{m.dose} · {m.freq}</div>
                      </div>
                      <div className="pp-med-refill">
                        <div className="pp-med-refill-n">{m.refill}</div>
                        <div className="pp-med-refill-l">pills left</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="pp-outline-btn" onClick={() => navigate("/today")}>View all medicines →</button>
              </Section>
            </div>
          )}

          {/* EMERGENCY */}
          {activeTab === "emergency" && (
            <div className="pp-grid">
              <Section title="Emergency Contact" icon="🚨" subtitle="Who to contact in case of emergency">
                <div className="pp-fields-2col">
                  <Field label="Contact name"  value={emergency.contactName}     editable={editing} icon="👤" onChange={set(setEmergency)("contactName")}/>
                  <Field label="Contact phone" value={emergency.contactPhone}    editable={editing} icon="📱" type="tel" onChange={set(setEmergency)("contactPhone")}/>
                  <Field label="Relationship"  value={emergency.contactRelation} editable={editing} icon="❤️" onChange={set(setEmergency)("contactRelation")}/>
                </div>
              </Section>
              <Section title="Doctor Information" icon="🩺" subtitle="Your primary care physician">
                <div className="pp-fields-2col">
                  <Field label="Doctor name"  value={emergency.doctorName}  editable={editing} icon="👨‍⚕️" onChange={set(setEmergency)("doctorName")}/>
                  <Field label="Doctor phone" value={emergency.doctorPhone} editable={editing} icon="📞" type="tel" onChange={set(setEmergency)("doctorPhone")}/>
                </div>
                {editing && <button className="pp-save-btn" onClick={() => setEditing(false)}>Save changes</button>}
              </Section>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="pp-grid">
              <Section title="Notification Preferences" icon="🔔" subtitle="How you want to be reminded">
                <div className="pp-fields-2col">
                  <div className="pp-field">
                    <label className="pp-field-label">Reminder type</label>
                    <div className="pp-gender-row">
                      {["App","SMS","Email"].map(r => (
                        <label key={r} className={`pp-gender-opt ${prefs.reminderType === r ? "pp-gender-opt--active" : ""}`}>
                          <input type="radio" name="reminder" value={r} checked={prefs.reminderType === r}
                            onChange={() => setPrefs(p => ({ ...p, reminderType: r }))} style={{ display:"none" }}/>
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pp-field">
                    <label className="pp-field-label">Language</label>
                    <div className="pp-gender-row">
                      {["English","Hindi","Gujarati"].map(l => (
                        <label key={l} className={`pp-gender-opt ${prefs.language === l ? "pp-gender-opt--active" : ""}`}>
                          <input type="radio" name="lang" value={l} checked={prefs.language === l}
                            onChange={() => setPrefs(p => ({ ...p, language: l }))} style={{ display:"none" }}/>
                          {l}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pp-toggle-row">
                  <div>
                    <div className="pp-toggle-label">Email alerts</div>
                    <div className="pp-toggle-sub">Receive dose reminders via email</div>
                  </div>
                  <label className="pp-toggle">
                    <input type="checkbox" checked={prefs.emailAlerts} onChange={e => setPrefs(p => ({ ...p, emailAlerts: e.target.checked }))}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>
                <div className="pp-toggle-row">
                  <div>
                    <div className="pp-toggle-label">SMS alerts</div>
                    <div className="pp-toggle-sub">Receive dose reminders via SMS</div>
                  </div>
                  <label className="pp-toggle">
                    <input type="checkbox" checked={prefs.smsAlerts} onChange={e => setPrefs(p => ({ ...p, smsAlerts: e.target.checked }))}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>
                <button className="pp-save-btn" onClick={() => {}}>Save preferences</button>
              </Section>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="pp-grid">
              <Section title="Change Password" icon="🔐" subtitle="Keep your account secure">
                {!showPassForm ? (
                  <button className="pp-outline-btn" onClick={() => setShowPassForm(true)}>Change password →</button>
                ) : (
                  <div className="pp-fields-1col">
                    {[
                      { label: "Current password", key: "current", ph: "Enter current password" },
                      { label: "New password",      key: "newp",    ph: "Create new password" },
                      { label: "Confirm new",       key: "confirm", ph: "Re-enter new password" },
                    ].map(f => (
                      <div className="pp-field" key={f.key}>
                        <label className="pp-field-label">{f.label}</label>
                        <div className="pp-field-input-wrap">
                          <input type="password" value={passwords[f.key]} placeholder={f.ph}
                            onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                            className="pp-input"/>
                        </div>
                      </div>
                    ))}
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="pp-save-btn" onClick={() => setShowPassForm(false)}>Update password</button>
                      <button className="pp-outline-btn" onClick={() => setShowPassForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </Section>
              <Section title="Two-Factor Authentication" icon="🛡️" subtitle="Add extra security">
                <div className="pp-toggle-row">
                  <div>
                    <div className="pp-toggle-label">Enable 2FA via OTP</div>
                    <div className="pp-toggle-sub">Verify identity with a one-time code on login</div>
                  </div>
                  <label className="pp-toggle">
                    <input type="checkbox" defaultChecked={false}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>
              </Section>
              <Section title="Danger Zone" icon="⚠️" subtitle="">
                <button className="pp-danger-btn" onClick={() => navigate("/")}>Log out of all devices</button>
              </Section>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}