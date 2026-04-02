// ══════════════════════════════════════════════════════════
//  MyMedicines.jsx  |  src/MyMedicines/MyMedicines.jsx
//  Route: /my-medicines
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import axios from "axios";
import "./MyMedicines.css";

const BASE = "https://localhost:7205";

const PRIORITY_COLORS = {
  Critical: { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5" },
  High:     { bg: "#FFFBEB", color: "#B45309", border: "#FCD34D" },
  Medium:   { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  Low:      { bg: "#F0FDF4", color: "#16A34A", border: "#86EFAC" },
};

const formatTime = (t) => {
  if (!t) return null;
  const date = new Date(`1970-01-01T${t}`);
  const h = date.getHours(), m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function MedRow({ med, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const priority  = PRIORITY_COLORS[med.priorityLevel] || PRIORITY_COLORS.Medium;
  const timeLabel = formatTime(med.doseTime);

  return (
    <div className={`mm-row ${expanded ? "mm-row--open" : ""}`}>
      <div className="mm-row-main" onClick={() => setExpanded(e => !e)}>

        {/* Left accent */}
        <div className="mm-accent" style={{
          background: `linear-gradient(180deg, ${priority.color}, ${priority.color}88)`
        }} />

        {/* Icon */}
        <div className="mm-icon-box">💊</div>

        {/* Name + disease */}
        <div className="mm-info">
          <div className="mm-name">{med.medicineName}</div>
          <div className="mm-sub">
            {med.diseaseName
              ? <span className="mm-disease-tag">🏷 {med.diseaseName}</span>
              : <span className="mm-disease-tag mm-disease-tag--none">No disease linked</span>}
          </div>
        </div>

        {/* Dose */}
        <div className="mm-dose-col">
          <div className="mm-dose-val">{med.dosage} {med.dosageUnit}</div>
          <div className="mm-dose-lbl">{med.medicineForm}</div>
        </div>

        {/* Time */}
        <div className="mm-time-col">
          {timeLabel
            ? <span className="mm-time-badge">🕐 {timeLabel}</span>
            : <span className="mm-time-badge mm-time-badge--none">No time set</span>}
        </div>

        {/* Priority */}
        <div className="mm-priority-badge"
          style={{ background: priority.bg, color: priority.color, borderColor: priority.border }}>
          {med.priorityLevel || "Medium"}
        </div>

        {/* Reminder */}
        <div className={`mm-reminder ${med.isReminderOn ? "on" : ""}`}>
          {med.isReminderOn ? "🔔" : "🔕"}
        </div>

        {/* Expand chevron */}
        <div className={`mm-chevron ${expanded ? "open" : ""}`}>›</div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mm-detail">
          <div className="mm-detail-grid">
            <div className="mm-detail-item">
              <div className="mm-dl">Frequency</div>
              <div className="mm-dv">{med.frequencyType || "—"}</div>
            </div>
            <div className="mm-detail-item">
              <div className="mm-dl">Meal timing</div>
              <div className="mm-dv">{med.mealTiming || "—"}</div>
            </div>
            <div className="mm-detail-item">
              <div className="mm-dl">Start date</div>
              <div className="mm-dv">{formatDate(med.startDate) || "—"}</div>
            </div>
            <div className="mm-detail-item">
              <div className="mm-dl">End date</div>
              <div className="mm-dv">{formatDate(med.endDate) || "Ongoing"}</div>
            </div>
            <div className="mm-detail-item">
              <div className="mm-dl">Stock</div>
              <div className="mm-dv">{med.stockQuantity ?? "—"} pills</div>
            </div>
            <div className="mm-detail-item">
              <div className="mm-dl">Prescribed by</div>
              <div className="mm-dv">{med.prescribedBy || "—"}</div>
            </div>
            {med.notes && (
              <div className="mm-detail-item" style={{ gridColumn: "span 3" }}>
                <div className="mm-dl">Notes</div>
                <div className="mm-dv">{med.notes}</div>
              </div>
            )}
          </div>
          <div className="mm-detail-actions">
            <button className="mm-del-btn" onClick={(e) => { e.stopPropagation(); onDelete(med.id); }}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyMedicines() {
  const navigate = useNavigate();
  const [meds, setMeds]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`${BASE}/api/medicine/user/${userId}`)
      .then(res => setMeds(res.data))
      .catch(err => console.error("Fetch medicines error:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await axios.delete(`${BASE}/api/medicine/delete/${id}`);
      setMeds(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed ❌");
    }
  };

  const priorities = ["All", "Critical", "High", "Medium", "Low"];

  const filtered = meds.filter(m => {
    const matchSearch = !search ||
      m.medicineName?.toLowerCase().includes(search.toLowerCase()) ||
      m.diseaseName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || m.priorityLevel === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total:    meds.length,
    critical: meds.filter(m => m.priorityLevel === "Critical").length,
    reminders: meds.filter(m => m.isReminderOn).length,
    linked:   meds.filter(m => m.diseaseName).length,
  };

  return (
    <Layout>
      <div className="mm-page">

        {/* Header */}
        <div className="mm-header">
          <div className="mm-header-left">
            <button className="mm-back" onClick={() => navigate(-1)}>←</button>
            <div>
              <h1 className="mm-title">My Medicines 💊</h1>
              <p className="mm-sub">All your active prescriptions in one place</p>
            </div>
          </div>
          <button className="mm-add-btn" onClick={() => navigate("/addMedicine")}>
            + Add Medicine
          </button>
        </div>

        {/* Stats */}
        <div className="mm-stats">
          {[
            { icon: "💊", label: "Total",     val: stats.total,    cls: "total" },
            { icon: "🔴", label: "Critical",  val: stats.critical, cls: "critical" },
            { icon: "🔔", label: "Reminders", val: stats.reminders,cls: "reminder" },
            { icon: "🏷", label: "Linked",    val: stats.linked,   cls: "linked" },
          ].map(s => (
            <div key={s.label} className={`mm-stat mm-stat--${s.cls}`}>
              <span className="mm-stat-icon">{s.icon}</span>
              <span className="mm-stat-val">{s.val}</span>
              <span className="mm-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mm-toolbar">
          <div className="mm-search-wrap">
            <span className="mm-search-icon">🔍</span>
            <input className="mm-search" placeholder="Search by name or disease…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="mm-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <div className="mm-filters">
            {priorities.map(p => (
              <button key={p} className={`mm-filter-btn ${filter === p ? "on" : ""}`}
                onClick={() => setFilter(p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="mm-list">
          {loading ? (
            <div className="mm-empty">
              <div className="mm-empty-icon">⏳</div>
              <div>Loading your medicines…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mm-empty">
              <div className="mm-empty-icon">💊</div>
              <div>{meds.length === 0 ? "No medicines added yet." : "No results found."}</div>
              {meds.length === 0 && (
                <button className="mm-add-btn" style={{ marginTop: 12 }}
                  onClick={() => navigate("/addMedicine")}>
                  + Add your first medicine
                </button>
              )}
            </div>
          ) : (
            filtered.map(med => (
              <MedRow key={med.id} med={med} onDelete={handleDelete} />
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}