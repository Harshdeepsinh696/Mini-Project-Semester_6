// ══════════════════════════════════════════════════════════
//  ProfilePage.jsx  |  src/Profile/ProfilePage.jsx
//  Photo change syncs to sidebar + dropdown via ProfileContext
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { useProfile } from "../Context/ProfileContext";
import { AvatarImg } from "./ProfileDropdown";
import "./ProfilePage.css";
import axios from "axios";

const TABS = [
  { id: "profile", label: "My Profile", icon: "👤" },
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
            placeholder={placeholder || label} className="pp-input" />
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
  const [editing, setEditing] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [diseasesLoading, setDiseasesLoading] = useState(false);
  /* Local editable copy of profile info */
  const [localProfile, setLocalProfile] = useState({
    name: ctxProfile.name,
    email: ctxProfile.email,
    phone: "+91 98765 43210",
    dob: "1998-05-14",
    gender: "Male",
  });

  useEffect(() => {

    console.log("useEffect running");

    // ✅ correct way to get userId
    const userId = localStorage.getItem("userId");
    console.log("userId:", userId);

    if (!userId) {
      console.log("No userId found");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7205/api/auth/user/${userId}`
        );

        console.log("api data:", res.data);

        const userData = res.data;

        console.log("PHOTO FROM API:", userData.photo);

        setLocalProfile({
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          dob: userData.dob,
          gender: userData.gender,
          photo: userData.photo || null
        });

        updatePhoto(userData.photo);

      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  // ADD THIS after the existing fetchUser useEffect:
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setDiseasesLoading(true);
    axios.get(`https://localhost:7205/api/disease/user/${userId}`)
      .then(res => setDiseases(res.data))
      .catch(err => console.error("Fetch diseases error:", err))
      .finally(() => setDiseasesLoading(false));
  }, []);

  const updateProfileAPI = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User not logged in ❌");
        return;
      }

      const payload = {
        fullName: localProfile.name,
        email: localProfile.email,
        phone: localProfile.phone,
        dob: localProfile.dob,
        gender: localProfile.gender
      };

      const res = await axios.put(
        `https://localhost:7205/api/auth/update/${userId}`,
        payload
      );

      console.log("Updated successfully:", res.data);
      alert("Profile updated successfully ✅");

    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert("Update failed ❌");
    }
  };

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
    language: "English",
    emailAlerts: true,
    smsAlerts: false,
  });

  const [passwords, setPasswords] = useState({ current: "", newp: "", confirm: "" });

  const age = localProfile.dob
    ? Math.floor((Date.now() - new Date(localProfile.dob)) / (365.25 * 24 * 3600 * 1000))
    : "—";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  /* Save local edits back to context so name/email update in dropdown */
  const handleSave = () => {
    updateProfile({ name: localProfile.name, email: localProfile.email });
    setEditing(false);
  };

  /* Photo change — updates context → syncs sidebar + dropdown instantly */
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `https://localhost:7205/api/auth/upload-photo/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Uploaded:", res.data);

      // ✅ update UI instantly
      updatePhoto(res.data.photo || null);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed ❌");
    }
  };

  const handleRemovePhoto = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.delete(`https://localhost:7205/api/auth/remove-photo/${userId}`);
      updatePhoto(null); // ✅ removes from UI
    } catch (err) {
      console.error("Remove photo error:", err);
      alert("Failed to remove photo ❌");
    }
  };

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
                  <img
                    src={ctxProfile.photo}
                    alt="Profile"
                    className="pp-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/download.png";
                    }}
                  />
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8" />
                  </svg>
                )}
              </div>

              {/* Photo action buttons */}
              <div className="pp-photo-actions">
                {/* Upload new photo */}
                <label className="pp-photo-btn pp-photo-btn--upload" title="Upload photo">
                  <input type="file" accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </label>

                {/* Remove photo (only shown if photo exists) */}
                {ctxProfile.photo && (
                  <button className="pp-photo-btn pp-photo-btn--remove"
                    title="Remove photo" onClick={handleRemovePhoto}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="pp-hero-info">
              <h1 className="pp-hero-name">{localProfile.name}</h1>
              <p className="pp-hero-email">{localProfile.email}</p>
              <div className="pp-hero-pills">
                <span className="pp-hero-pill">{localProfile.gender}</span>
                <span className="pp-hero-pill">{age} yrs</span>
              </div>
            </div>

            <button className="pp-edit-btn"
              onClick={() => { setActiveTab("profile"); setEditing(e => !e); }}>
              {editing ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save changes
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

        {/* ── Tab content ── */}
        <div className="pp-content">

          {/* MY PROFILE */}
          {activeTab === "profile" && (
            <div className="pp-grid">
              <Section title="Basic Information" icon="👤" subtitle="Your personal details">
                <div className="pp-fields-2col">
                  <Field label="Full name" value={localProfile.name} editable={editing} icon="🙍" onChange={set(setLocalProfile)("name")} />
                  <Field label="Email address" value={localProfile.email} editable={editing} icon="📧" type="email" onChange={set(setLocalProfile)("email")} />
                  <Field label="Phone number" value={localProfile.phone} editable={editing} icon="📱" type="tel" onChange={set(setLocalProfile)("phone")} />
                  <Field label="Date of birth" value={editing ? localProfile.dob : formatDate(localProfile.dob)} editable={editing} icon="🎂" type="date" onChange={set(setLocalProfile)("dob")} />
                </div>
                <div className="pp-fields-2col">
                  <div className="pp-field">
                    <label className="pp-field-label">Gender</label>
                    {editing ? (
                      <div className="pp-gender-row">
                        {["Male", "Female", "Other", "Prefer not to say"].map(g => (
                          <label key={g} className={`pp-gender-opt ${localProfile.gender === g ? "pp-gender-opt--active" : ""}`}>
                            <input type="radio" name="gender" value={g}
                              checked={localProfile.gender === g}
                              onChange={() => setLocalProfile(p => ({ ...p, gender: g }))}
                              style={{ display: "none" }} />
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
                </div>
                {editing && (
                  <button className="pp-save-btn" onClick={() => {
                    updateProfileAPI();
                    setEditing(false);
                  }}>
                    Save changes
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </Section>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}