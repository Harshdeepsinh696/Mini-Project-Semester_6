import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import { useMedicines } from "../Context/MedicineContext";
import "./Today.css";

const TODAY_TABS = ["All", "Pending", "Taken", "Skipped"];

export default function Today() {
  const navigate = useNavigate();
  const { medicines, updateMedicine } = useMedicines();   // ← global shared medicines

  const [activeFilter, setActiveFilter] = useState("All");

  const handleTake = id =>
    updateMedicine(id, { status: "taken", countdown: "Just taken" });

  const handleSkip = (id, undo = false) =>
    updateMedicine(id, undo
      ? { status: "pending", countdown: "Pending" }
      : { status: "skipped", countdown: "Skipped" }
    );

  const takenCount   = medicines.filter(m => m.status === "taken").length;
  const skippedCount = medicines.filter(m => m.status === "skipped").length;
  const pendingCount = medicines.filter(m => m.status === "pending").length;
  const progress     = medicines.length > 0
    ? Math.round((takenCount / medicines.length) * 100) : 0;

  const filteredMeds = medicines.filter(m => {
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
            <p>{medicines.length} medicines scheduled for today</p>
          </div>
          <div className="date-chip">📅 <b>Thursday</b>, Feb 27</div>
        </div>

        <div className="stats-row">
          <div className="stat-card total">
            <div className="stat-icon-box total">💊</div>
            <div className="stat-text">
              <div className="stat-label total">Total Medicine</div>
              <div className="stat-value">{medicines.length}</div>
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
          <button className="add-btn" onClick={() => navigate("/addMedicine")}>
            <div className="add-btn-label">Add<br />Medicine</div>
            <div className="add-btn-circle">+</div>
          </button>
        </div>

        <div className="progress-wrap">
          <div className="progress-top">
            <span>Today's progress</span>
            <div className="progress-right">
              <strong>{progress}%</strong>
              <span className="done-pill">{takenCount} of {medicines.length} done</span>
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