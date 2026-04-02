import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./Today.css";

const BASE = "https://localhost:7205";
const TODAY_TABS = ["All", "Pending", "Taken", "Skipped"];

const formatTime = (time) => {
  if (!time) return { time: "--:--", ampm: "" };
  const date = new Date(`1970-01-01T${time}`);
  const h = date.getHours(), m = date.getMinutes();
  return {
    time: `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    ampm: h >= 12 ? "PM" : "AM"
  };
};

const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
};

const toMedCard = (m) => {
  const t = formatTime(m.doseTime || m.DoseTime);
  return {
    id: Number(m.id),
    name: m.medicineName,
    dose: `${m.dosage} ${m.dosageUnit}`,
    qty: m.medicineForm || "1 tablet",
    icon: "💊",
    color: "#2563EB",
    category: m.medicineForm,
    refillLeft: m.stockQuantity || 10,
    refillTotal: 30,
    time: t.time,
    ampm: t.ampm,
    note: m.notes,
    doctor: m.prescribedBy,
    meal: m.mealTiming,
    frequency: m.frequencyType,
    priority: m.priorityLevel,
    startDate: formatDate(m.startDate),
    endDate: formatDate(m.endDate),
    status: m.todayStatus || "pending",
    countdown: m.todayStatus === "taken"
      ? "Taken today"
      : m.todayStatus === "skipped"
      ? "Skipped today"
      : "Pending",
    reminderSet: m.isReminderOn || false,
  };
};

export default function Today() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try {
      const userId = parseInt(localStorage.getItem("userId"));
      if (!userId) return;
      const res = await axios.get(`${BASE}/api/medicine/list/${userId}`);
      setMedicines(res.data.map(toMedCard));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateLocal = (id, fields) =>
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...fields } : m));

  const handleTake = async (id) => {
    try {
      await axios.post(`${BASE}/api/medicine/take-skip`, { medicineId: id, status: "taken" });
      updateLocal(id, { status: "taken", countdown: "Taken today" });
    } catch (err) { console.error(err); }
  };

  const handleSkip = async (id, undo = false) => {
    try {
      if (undo) {
        await axios.delete(`${BASE}/api/medicine/take-skip/${id}`);
        updateLocal(id, { status: "pending", countdown: "Pending" });
      } else {
        await axios.post(`${BASE}/api/medicine/take-skip`, { medicineId: id, status: "skipped" });
        updateLocal(id, { status: "skipped", countdown: "Skipped today" });
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleReminder = async (id) => {
    const med = medicines.find(m => m.id === id);
    const newVal = !med.reminderSet;
    try {
      await axios.put(`${BASE}/api/medicine/reminder/${id}`, { isReminderOn: newVal });
      updateLocal(id, { reminderSet: newVal });
    } catch (err) { console.error(err); }
  };

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
          <div className="date-chip">
            📅 <b>{new Date().toLocaleDateString("en-IN", {
              weekday: "short", day: "numeric", month: "short"
            })}</b>
          </div>
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
              {skippedCount > 0 && (
                <span className="skipped-pill">{skippedCount} skipped</span>
              )}
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
          {filteredMeds.length === 0 ? (
            <div className="empty-state">No medicines in this category</div>
          ) : (
            filteredMeds.map(med => (
              <MedCard
                key={med.id}
                med={med}
                onTake={handleTake}
                onSkip={handleSkip}
                onToggleReminder={handleToggleReminder}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}