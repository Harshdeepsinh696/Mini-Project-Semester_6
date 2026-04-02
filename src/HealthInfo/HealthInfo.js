import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import axios from "axios";
import "./HealthInfo.css";

const BASE = "https://localhost:7205";

function DiseaseRow({ disease, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`hi-row ${expanded ? "hi-row--open" : ""}`}>
      <div className="hi-row-main" onClick={() => setExpanded(e => !e)}>

        {/* Left accent */}
        <div className="hi-accent" />

        {/* Icon */}
        <div className="hi-icon-box">🏥</div>

        {/* Name + date */}
        <div className="hi-info">
          <div className="hi-name">{disease.diseaseName}</div>
          <div className="hi-sub">
            {disease.diagnosedDate
              ? <span className="hi-date-tag">
                  📅 {new Date(disease.diagnosedDate).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </span>
              : <span className="hi-date-tag hi-date-tag--none">No date set</span>}
          </div>
        </div>

        {/* Notes */}
        <div className="hi-notes-col">
          {disease.notes
            ? <span className="hi-notes-badge">📝 {disease.notes}</span>
            : <span className="hi-notes-badge hi-notes-badge--none">No notes</span>}
        </div>

        {/* Expand chevron */}
        <div className={`hi-chevron ${expanded ? "open" : ""}`}>›</div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="hi-detail">
          <div className="hi-detail-grid">
            <div className="hi-detail-item">
              <div className="hi-dl">Disease Name</div>
              <div className="hi-dv">{disease.diseaseName}</div>
            </div>
            <div className="hi-detail-item">
              <div className="hi-dl">Diagnosed Date</div>
              <div className="hi-dv">
                {disease.diagnosedDate
                  ? new Date(disease.diagnosedDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })
                  : "—"}
              </div>
            </div>
            <div className="hi-detail-item">
              <div className="hi-dl">Notes</div>
              <div className="hi-dv">{disease.notes || "—"}</div>
            </div>
          </div>
          <div className="hi-detail-actions">
            <button className="hi-del-btn"
              onClick={(e) => { e.stopPropagation(); onDelete(disease.id); }}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HealthInfo() {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ diseaseName: "", diagnosedDate: "", notes: "" });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]     = useState("");

  const userId = parseInt(localStorage.getItem("userId"));

  const fetchDiseases = () => {
    if (!userId) return;
    setLoading(true);
    axios.get(`${BASE}/api/disease/user/${userId}`)
      .then(res => setDiseases(res.data))
      .catch(err => console.error("Fetch diseases error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDiseases(); }, [userId]);

  const handleAdd = async () => {
    if (!form.diseaseName.trim()) { alert("Please enter a disease name."); return; }
    setSaving(true);
    try {
      await axios.post(`${BASE}/api/disease/add`, {
        userId,
        diseaseName:   form.diseaseName.trim(),
        diagnosedDate: form.diagnosedDate || null,
        notes:         form.notes,
      });
      setForm({ diseaseName: "", diagnosedDate: "", notes: "" });
      setShowForm(false);
      fetchDiseases();
    } catch (err) {
      console.error("Add disease error:", err);
      alert("Failed to add disease ❌");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this condition?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${BASE}/api/disease/${id}`);
      setDiseases(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Delete disease error:", err);
      alert("Failed to remove ❌");
    } finally { setDeleting(null); }
  };

  const filtered = diseases.filter(d =>
    !search || d.diseaseName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:  diseases.length,
    dated:  diseases.filter(d => d.diagnosedDate).length,
    noted:  diseases.filter(d => d.notes).length,
  };

  return (
    <Layout>
      <div className="hi-page">

        {/* Header */}
        <div className="hi-header">
          <div className="hi-header-left">
            <button className="hi-back" onClick={() => navigate(-1)}>←</button>
            <div>
              <h1 className="hi-title">Health Info 🏥</h1>
              <p className="hi-sub">Your medical conditions and diagnoses</p>
            </div>
          </div>
          <button className="hi-add-btn" onClick={() => setShowForm(s => !s)}>
            {showForm ? "✕ Cancel" : "+ Add Condition"}
          </button>
        </div>

        {/* Stats */}
        <div className="hi-stats">
          <div className="hi-stat hi-stat--total">
            <span className="hi-stat-icon">🏥</span>
            <span className="hi-stat-val">{stats.total}</span>
            <span className="hi-stat-lbl">Total</span>
          </div>
          <div className="hi-stat hi-stat--dated">
            <span className="hi-stat-icon">📅</span>
            <span className="hi-stat-val">{stats.dated}</span>
            <span className="hi-stat-lbl">With Date</span>
          </div>
          <div className="hi-stat hi-stat--noted">
            <span className="hi-stat-icon">📝</span>
            <span className="hi-stat-val">{stats.noted}</span>
            <span className="hi-stat-lbl">With Notes</span>
          </div>
          <div className="hi-stat hi-stat--med">
            <span className="hi-stat-icon">💊</span>
            <span className="hi-stat-val">—</span>
            <span className="hi-stat-lbl">Medicines</span>
          </div>
        </div>

        {/* Search */}
        <div className="hi-toolbar">
          <div className="hi-search-wrap">
            <span className="hi-search-icon">🔍</span>
            <input className="hi-search" placeholder="Search conditions…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="hi-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="hi-form-card">
            <div className="hi-form-title">➕ Add New Condition</div>
            <div className="hi-form-grid">
              <div className="hi-field">
                <label className="hi-lbl">Disease / Condition Name <span style={{ color: "#EF4444" }}>*</span></label>
                <input className="hi-input" placeholder="e.g. Type 2 Diabetes"
                  value={form.diseaseName}
                  onChange={e => setForm(p => ({ ...p, diseaseName: e.target.value }))} />
              </div>
              <div className="hi-field">
                <label className="hi-lbl">Diagnosed Date <span style={{ color: "#9096B0", fontSize: 10 }}>(optional)</span></label>
                <input className="hi-input" type="date"
                  value={form.diagnosedDate}
                  onChange={e => setForm(p => ({ ...p, diagnosedDate: e.target.value }))} />
              </div>
              <div className="hi-field" style={{ gridColumn: "span 2" }}>
                <label className="hi-lbl">Notes <span style={{ color: "#9096B0", fontSize: 10 }}>(optional)</span></label>
                <input className="hi-input" placeholder="e.g. Under control with medication"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <div className="hi-form-actions">
              <button className="hi-save-btn" onClick={handleAdd} disabled={saving}>
                {saving ? "Saving…" : "✓ Save Condition"}
              </button>
              <button className="hi-cancel-btn"
                onClick={() => { setShowForm(false); setForm({ diseaseName: "", diagnosedDate: "", notes: "" }); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="hi-list">
          {loading ? (
            <div className="hi-empty">
              <div className="hi-empty-icon">⏳</div>
              <div>Loading your health records…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="hi-empty">
              <div className="hi-empty-icon">🏥</div>
              <div>{diseases.length === 0 ? "No conditions tracked yet." : "No results found."}</div>
              {diseases.length === 0 && (
                <button className="hi-add-btn" style={{ marginTop: 12 }}
                  onClick={() => setShowForm(true)}>
                  + Add your first condition
                </button>
              )}
            </div>
          ) : (
            filtered.map(d => (
              <DiseaseRow key={d.id} disease={d} onDelete={handleDelete} />
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}