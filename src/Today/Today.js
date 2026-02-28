import { useState } from "react";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./Today.css";

const medicines = [
  { id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet", icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", time: "12:00", ampm: "PM", note: "Take after food", frequency: "Once in Day", countdown: "In about 2 hours", status: "pending", refillLeft: 14, refillTotal: 30, category: "Pain Relief", sideEffect: "Take with water" },
  { id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule", icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E", time: "08:00", ampm: "AM", note: "Take with breakfast", frequency: "Once in Day", countdown: "Taken 2 hours ago", status: "taken", refillLeft: 22, refillTotal: 30, category: "Supplement", sideEffect: "Best with food" },
  { id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet", icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6", time: "08:00", ampm: "PM", note: "Take before dinner", frequency: "Twice in Day", countdown: "In about 6 hours", status: "pending", refillLeft: 5, refillTotal: 30, category: "Diabetes", sideEffect: "Avoid alcohol" },
];

const TODAY_TABS = ["All", "Pending", "Taken", "Skipped"];

export default function Today() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [meds, setMeds] = useState(medicines);

  const handleTake = id =>
    setMeds(prev => prev.map(m => m.id === id ? { ...m, status: "taken", countdown: "Just taken" } : m));

  const handleSkip = (id, undo = false) =>
    setMeds(prev => prev.map(m =>
      m.id === id
        ? undo
          ? { ...m, status: "pending", countdown: "Pending" }
          : { ...m, status: "skipped", countdown: "Skipped" }
        : m
    ));

  const takenCount   = meds.filter(m => m.status === "taken").length;
  const skippedCount = meds.filter(m => m.status === "skipped").length;
  const pendingCount = meds.filter(m => m.status === "pending").length;
  const progress     = Math.round((takenCount / meds.length) * 100);

  const filteredMeds = meds.filter(m => {
    if (activeFilter === "Pending") return m.status === "pending";
    if (activeFilter === "Taken")   return m.status === "taken";
    if (activeFilter === "Skipped") return m.status === "skipped";
    return true;
  });

  return (
    <Layout>
      <div className="main">
        <div className="main-header">
          <div className="greeting">
            <h1>Good Morning 👋</h1>
            <p>{meds.length} medicines scheduled for today</p>
          </div>
          <div className="date-chip">📅 <b>Thursday</b>, Feb 27</div>
        </div>

        <div className="stats-row">
          <div className="stat-card total">
            <div className="stat-icon-box total">💊</div>
            <div className="stat-text">
              <div className="stat-label total">Total Medicine</div>
              <div className="stat-value">{meds.length}</div>
            </div>
          </div>
          <div className="stat-card taken-card">
            <div className="stat-icon-box taken-card">✅</div>
            <div className="stat-text">
              <div className="stat-label taken-card">Taken Today</div>
              <div className="stat-value">{takenCount}</div>
            </div>
          </div>
          <div className="stat-card pending-card">
            <div className="stat-icon-box pending-card">⏳</div>
            <div className="stat-text">
              <div className="stat-label pending-card">Pending</div>
              <div className="stat-value">{pendingCount}</div>
            </div>
          </div>
          <button className="add-btn">
            <div className="add-btn-label">Add<br />Medicine</div>
            <div className="add-btn-circle">+</div>
          </button>
        </div>

        <div className="progress-wrap">
          <div className="progress-top">
            <span>Today's progress</span>
            <div className="progress-right">
              <strong>{progress}%</strong>
              <span className="done-pill">{takenCount} of {meds.length} done</span>
              {skippedCount > 0 && <span className="skipped-pill">{skippedCount} skipped</span>}
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="list-head">
          <div className="list-title">Today's Schedule</div>
          <FilterTabs tabs={TODAY_TABS} active={activeFilter} onChange={setActiveFilter} />
        </div>

        <div className="cards-container">
          {filteredMeds.length === 0
            ? <div className="empty-state">No medicines in this category</div>
            : filteredMeds.map(med =>
                <MedCard key={med.id} med={med} onTake={handleTake} onSkip={handleSkip} />
              )
          }
        </div>
      </div>
    </Layout>
  );
}