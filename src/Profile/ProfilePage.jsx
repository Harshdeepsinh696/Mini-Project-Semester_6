// ══════════════════════════════════════════════════════════
//  ProfilePage.jsx  |  src/Profile/ProfilePage.jsx
//  Full profile page — Basic Info, Health, Medicines,
//  Emergency, Preferences, Security
// ══════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import "./ProfilePage.css";

const TABS = [
  { id: "profile",       label: "My Profile",     icon: "👤" },
  { id: "health",        label: "Health Info",     icon: "🏥" },
  { id: "medicines",     label: "Medicines",       icon: "💊" },
  { id: "emergency",     label: "Emergency",       icon: "🚨" },
  { id: "notifications", label: "Notifications",   icon: "🔔" },
  { id: "security",      label: "Security",        icon: "🔐" },
];

/* ── Reusable field row ── */
function Field({ label, value, icon, type = "text", editable, onChange, placeholder }) {
  return (
    <div className="pp-field">
      <label className="pp-field-label">{label}</label>
      {editable ? (
        <div className="pp-field-input-wrap">
          {icon && <span className="pp-field-icon">{icon}</span>}
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || label}
            className="pp-input"
          />
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

/* ── Section wrapper ── */
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

/* ── Stat card ── */
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
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editing, setEditing] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);

  /* ── Profile state ── */
  const [profile, setProfile] = useState({
    name: "Tushar Mehta",
    email: "tushar@email.com",
    phone: "+91 98765 43210",
    dob: "1998-05-14",
    gender: "Male",
    bloodGroup: "B+",
    photo: null,
  });

  const [health, setHealth] = useState({
    diseases: "Type 2 Diabetes, Hypertension",
    allergies: "Penicillin, Pollen",
    bloodGroup: "B+",
    height: "175 cm",
    weight: "72 kg",
  });

  const [emergency, setEmergency] = useState({
    contactName: "Priya Mehta",
    contactPhone: "+91 98111 22333",
    contactRelation: "Wife",
    doctorName: "Dr. Anjali Patel",
    doctorPhone: "+91 98222 11444",
  });

  const [prefs, setPrefs] = useState({
    reminderType: "App",
    sound: "Default",
    language: "English",
    emailAlerts: true,
    smsAlerts: false,
  });

  const [passwords, setPasswords] = useState({ current: "", newp: "", confirm: "" });

  const set = (setter) => (key) => (val) =>
    setter(prev => ({ ...prev, [key]: val }));

  const age = profile.dob
    ? Math.floor((Date.now() - new Date(profile.dob)) / (365.25 * 24 * 3600 * 1000))
    : "—";

  return (
    <Layout>
      <div className="pp-root">

        {/* ── Profile hero banner ── */}
        <div className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-inner">
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                {profile.photo ? (
                  <img src={profile.photo} alt="avatar" className="pp-avatar-img"/>
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                  </svg>
                )}
              </div>
              <label className="pp-avatar-edit" title="Change photo">
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) setProfile(p => ({ ...p, photo: URL.createObjectURL(f) }));
                  }}/>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </label>
            </div>

            <div className="pp-hero-info">
              <h1 className="pp-hero-name">{profile.name}</h1>
              <p className="pp-hero-email">{profile.email}</p>
              <div className="pp-hero-pills">
                <span className="pp-hero-pill">{profile.gender}</span>
                <span className="pp-hero-pill">{age} yrs</span>
                <span className="pp-hero-pill pp-hero-pill--green">{health.bloodGroup}</span>
              </div>
            </div>

            <button
              className="pp-edit-btn"
              onClick={() => { setActiveTab("profile"); setEditing(e => !e); }}
            >
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
        </div>

        {/* ── Tab bar ── */}
        <div className="pp-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`pp-tab ${activeTab === t.id ? "pp-tab--active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="pp-content">

          {/* ── MY PROFILE ── */}
          {activeTab === "profile" && (
            <div className="pp-grid">
              <Section title="Basic Information" icon="👤" subtitle="Your personal details">
                <div className="pp-fields-2col">
                  <Field label="Full name" value={profile.name} editable={editing}
                    icon="🙍" onChange={set(setProfile)("name")}/>
                  <Field label="Email address" value={profile.email} type="email" editable={editing}
                    icon="📧" onChange={set(setProfile)("email")}/>
                  <Field label="Phone number" value={profile.phone} type="tel" editable={editing}
                    icon="📱" onChange={set(setProfile)("phone")}/>
                  <Field label="Date of birth" value={profile.dob} type="date" editable={editing}
                    icon="🎂" onChange={set(setProfile)("dob")}/>
                </div>
                <div className="pp-fields-2col">
                  <div className="pp-field">
                    <label className="pp-field-label">Gender</label>
                    {editing ? (
                      <div className="pp-gender-row">
                        {["Male","Female","Other","Prefer not to say"].map(g => (
                          <label key={g} className={`pp-gender-opt ${profile.gender === g ? "pp-gender-opt--active" : ""}`}>
                            <input type="radio" name="gender" value={g}
                              checked={profile.gender === g}
                              onChange={() => setProfile(p => ({ ...p, gender: g }))}
                              style={{ display: "none" }}/>
                            {g}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="pp-field-val">
                        <span className="pp-field-icon-static">⚧</span>
                        <span>{profile.gender}</span>
                      </div>
                    )}
                  </div>
                  <Field label="Blood group" value={health.bloodGroup} editable={editing}
                    icon="🩸" onChange={set(setHealth)("bloodGroup")}/>
                </div>
                {editing && (
                  <button className="pp-save-btn" onClick={() => setEditing(false)}>
                    Save changes
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </Section>
            </div>
          )}

          {/* ── HEALTH INFO ── */}
          {activeTab === "health" && (
            <div className="pp-grid">
              <Section title="Health Information" icon="🏥" subtitle="Medical details for better care">
                <div className="pp-fields-2col">
                  <Field label="Known diseases" value={health.diseases} editable={editing}
                    icon="🩺" onChange={set(setHealth)("diseases")} placeholder="e.g. Diabetes, BP"/>
                  <Field label="Allergies" value={health.allergies} editable={editing}
                    icon="⚠️" onChange={set(setHealth)("allergies")} placeholder="e.g. Penicillin"/>
                  <Field label="Blood group" value={health.bloodGroup} editable={editing}
                    icon="🩸" onChange={set(setHealth)("bloodGroup")}/>
                  <Field label="Height" value={health.height} editable={editing}
                    icon="📏" onChange={set(setHealth)("height")} placeholder="e.g. 175 cm"/>
                  <Field label="Weight" value={health.weight} editable={editing}
                    icon="⚖️" onChange={set(setHealth)("weight")} placeholder="e.g. 72 kg"/>
                </div>
                {editing && (
                  <button className="pp-save-btn" onClick={() => setEditing(false)}>Save changes</button>
                )}
              </Section>
            </div>
          )}

          {/* ── MEDICINES OVERVIEW ── */}
          {activeTab === "medicines" && (
            <div className="pp-grid">
              <Section title="Medicine Overview" icon="💊" subtitle="Your current medication summary">
                <div className="pp-stats-row">
                  <StatCard icon="💊" value="3"  label="Total Medicines"  color="#3b82f6"/>
                  <StatCard icon="✅" value="1"  label="Taken Today"      color="#22c55e"/>
                  <StatCard icon="⏳" value="2"  label="Pending Today"    color="#f59e0b"/>
                  <StatCard icon="❌" value="0"  label="Missed This Week" color="#f87171"/>
                </div>

                <div className="pp-med-list">
                  {[
                    { name: "Aspirin",    dose: "500mg", freq: "Once daily",  status: "active",  refill: 14 },
                    { name: "Metformin",  dose: "850mg", freq: "Twice daily", status: "active",  refill: 28 },
                    { name: "Lisinopril", dose: "10mg",  freq: "Once daily",  status: "low",     refill: 5  },
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

                <button className="pp-outline-btn" onClick={() => navigate("/today")}>
                  View all medicines →
                </button>
              </Section>
            </div>
          )}

          {/* ── EMERGENCY INFO ── */}
          {activeTab === "emergency" && (
            <div className="pp-grid">
              <Section title="Emergency Contact" icon="🚨" subtitle="Who to contact in case of emergency">
                <div className="pp-fields-2col">
                  <Field label="Contact name" value={emergency.contactName} editable={editing}
                    icon="👤" onChange={set(setEmergency)("contactName")}/>
                  <Field label="Contact phone" value={emergency.contactPhone} type="tel" editable={editing}
                    icon="📱" onChange={set(setEmergency)("contactPhone")}/>
                  <Field label="Relationship" value={emergency.contactRelation} editable={editing}
                    icon="❤️" onChange={set(setEmergency)("contactRelation")}/>
                </div>
              </Section>

              <Section title="Doctor Information" icon="🩺" subtitle="Your primary care physician">
                <div className="pp-fields-2col">
                  <Field label="Doctor name" value={emergency.doctorName} editable={editing}
                    icon="👨‍⚕️" onChange={set(setEmergency)("doctorName")}/>
                  <Field label="Doctor phone" value={emergency.doctorPhone} type="tel" editable={editing}
                    icon="📞" onChange={set(setEmergency)("doctorPhone")}/>
                </div>
                {editing && (
                  <button className="pp-save-btn" onClick={() => setEditing(false)}>Save changes</button>
                )}
              </Section>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div className="pp-grid">
              <Section title="Notification Preferences" icon="🔔" subtitle="How you want to be reminded">
                <div className="pp-fields-2col">
                  <div className="pp-field">
                    <label className="pp-field-label">Reminder type</label>
                    <div className="pp-gender-row">
                      {["App","SMS","Email"].map(r => (
                        <label key={r} className={`pp-gender-opt ${prefs.reminderType === r ? "pp-gender-opt--active" : ""}`}>
                          <input type="radio" name="reminder" value={r}
                            checked={prefs.reminderType === r}
                            onChange={() => setPrefs(p => ({ ...p, reminderType: r }))}
                            style={{ display: "none" }}/>
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
                          <input type="radio" name="lang" value={l}
                            checked={prefs.language === l}
                            onChange={() => setPrefs(p => ({ ...p, language: l }))}
                            style={{ display: "none" }}/>
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
                    <input type="checkbox" checked={prefs.emailAlerts}
                      onChange={e => setPrefs(p => ({ ...p, emailAlerts: e.target.checked }))}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>

                <div className="pp-toggle-row">
                  <div>
                    <div className="pp-toggle-label">SMS alerts</div>
                    <div className="pp-toggle-sub">Receive dose reminders via SMS</div>
                  </div>
                  <label className="pp-toggle">
                    <input type="checkbox" checked={prefs.smsAlerts}
                      onChange={e => setPrefs(p => ({ ...p, smsAlerts: e.target.checked }))}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>

                <button className="pp-save-btn" onClick={() => {}}>Save preferences</button>
              </Section>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div className="pp-grid">
              <Section title="Change Password" icon="🔐" subtitle="Keep your account secure">
                {!showPassForm ? (
                  <button className="pp-outline-btn" onClick={() => setShowPassForm(true)}>
                    Change password →
                  </button>
                ) : (
                  <div className="pp-fields-1col">
                    <div className="pp-field">
                      <label className="pp-field-label">Current password</label>
                      <div className="pp-field-input-wrap">
                        <input type="password" value={passwords.current} placeholder="Enter current password"
                          onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                          className="pp-input"/>
                      </div>
                    </div>
                    <div className="pp-field">
                      <label className="pp-field-label">New password</label>
                      <div className="pp-field-input-wrap">
                        <input type="password" value={passwords.newp} placeholder="Create new password"
                          onChange={e => setPasswords(p => ({ ...p, newp: e.target.value }))}
                          className="pp-input"/>
                      </div>
                    </div>
                    <div className="pp-field">
                      <label className="pp-field-label">Confirm new password</label>
                      <div className="pp-field-input-wrap">
                        <input type="password" value={passwords.confirm} placeholder="Re-enter new password"
                          onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                          className="pp-input"/>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="pp-save-btn" onClick={() => setShowPassForm(false)}>
                        Update password
                      </button>
                      <button className="pp-outline-btn" onClick={() => setShowPassForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Section>

              <Section title="Two-Factor Authentication" icon="🛡️" subtitle="Add extra security to your account">
                <div className="pp-toggle-row">
                  <div>
                    <div className="pp-toggle-label">Enable 2FA via OTP</div>
                    <div className="pp-toggle-sub">Verify your identity with a one-time code on login</div>
                  </div>
                  <label className="pp-toggle">
                    <input type="checkbox" defaultChecked={false}/>
                    <span className="pp-toggle-slider"/>
                  </label>
                </div>
              </Section>

              <Section title="Danger Zone" icon="⚠️" subtitle="">
                <button className="pp-danger-btn" onClick={() => navigate("/")}>
                  Log out of all devices
                </button>
              </Section>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}