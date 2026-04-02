import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./History.css";

const BASE = "https://localhost:7205";
const HISTORY_TABS = ["All", "Taken", "Skipped"];

const formatTime = (time) => {
  if (!time) return { time: "--:--", ampm: "" };
  const date = new Date(`1970-01-01T${time}`);
  const h = date.getHours(), m = date.getMinutes();
  return {
    time: `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    ampm: h >= 12 ? "PM" : "AM"
  };
};

const toMedCard = (m) => {
  const t = formatTime(m.doseTime);
  const logDate = m.logDate ? new Date(m.logDate) : new Date();
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
    status: m.status || "pending",
    countdown: m.status === "taken" ? "Taken on time" : "Skipped this dose",
    reminderSet: m.isReminderOn || false,
    histDate: logDate.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    }),
    histDay: isToday(logDate)
      ? "Today"
      : isYesterday(logDate)
      ? "Yesterday"
      : logDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    histDayNum: logDate.getDate(),
  };
};

const isToday = (d) => {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};
const isYesterday = (d) => {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return d.getDate() === y.getDate() && d.getMonth() === y.getMonth() && d.getFullYear() === y.getFullYear();
};

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.histDate]) map[item.histDate] = { label: item.histDay, entries: [] };
    map[item.histDate].entries.push(item);
  });
  return map;
}

function badgeClass(taken, total) {
  const pct = taken / total;
  return pct === 1 ? "b-green" : pct >= 0.5 ? "b-amber" : "b-red";
}

function dateIcon(label) {
  if (label === "Today") return "📅";
  if (label === "Yesterday") return "🕐";
  return "📄";
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(activeFilter); }, [activeFilter]);

  const fetchHistory = async (filter) => {
    try {
      setLoading(true);
      const userId = parseInt(localStorage.getItem("userId"));
      if (!userId) return;
      const res = await axios.get(
        `${BASE}/api/medicine/history/${userId}?filter=${filter.toLowerCase()}`
      );
      setMeds(res.data.map(toMedCard));
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const takenCount   = meds.filter(m => m.status === "taken").length;
  const skippedCount = meds.filter(m => m.status === "skipped").length;
  const adherencePct = meds.length > 0
    ? Math.round((takenCount / meds.length) * 100) : 0;

  const grouped = groupByDate(meds);

  return (
    <Layout>
      <div className="hist-main">
        <div className="hist-header">
          <div className="hist-greeting">
            <h1>Medicine History 📋</h1>
            <p>{meds.length} dose records found</p>
          </div>
          <div className="hist-date-chip">
            📅 <b>{new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "short"
            })}</b>
          </div>
        </div>

        <div className="hist-stats-row">
          <div className="hist-stat-card sc-blue">
            <div className="hist-stat-icon">📋</div>
            <div className="hist-stat-info">
              <div className="hist-stat-label">Total Records</div>
              <div className="hist-stat-value">{meds.length}</div>
            </div>
          </div>
          <div className="hist-stat-card sc-green">
            <div className="hist-stat-icon">✅</div>
            <div className="hist-stat-info">
              <div className="hist-stat-label">Taken</div>
              <div className="hist-stat-value">{takenCount}</div>
            </div>
          </div>
          <div className="hist-stat-card sc-amber">
            <div className="hist-stat-icon">⏭️</div>
            <div className="hist-stat-info">
              <div className="hist-stat-label">Skipped</div>
              <div className="hist-stat-value">{skippedCount}</div>
            </div>
          </div>
          <div className="hist-stat-card sc-purple">
            <div className="hist-stat-icon">📊</div>
            <div className="hist-stat-info">
              <div className="hist-stat-label">Adherence</div>
              <div className="hist-stat-value">{adherencePct}%</div>
            </div>
          </div>
        </div>

        <div className="hist-body">
          <div className="hist-right-col" style={{ gridColumn: "1 / -1" }}>
            <div className="hist-list-head">
              <div className="hist-list-title">History</div>
              <FilterTabs
                tabs={HISTORY_TABS}
                active={activeFilter}
                onChange={setActiveFilter}
              />
            </div>

            <div className="hist-cards">
              {loading ? (
                <div className="hist-empty">Loading...</div>
              ) : Object.keys(grouped).length === 0 ? (
                <div className="hist-empty">No medicine records for this filter</div>
              ) : (
                Object.entries(grouped).map(([date, { label, entries }]) => {
                  const dayTaken = entries.filter(e => e.status === "taken").length;
                  const dayTotal = entries.length;
                  return (
                    <div key={date} className="hist-date-group">
                      <div className="hist-dg-label">
                        <span className="hist-dg-icon">{dateIcon(label)}</span>
                        <span className="hist-dg-text">
                          {label !== date
                            ? <><strong>{label}</strong> · {date}</>
                            : date}
                        </span>
                        <span className={`hist-dg-badge ${badgeClass(dayTaken, dayTotal)}`}>
                          {dayTaken}/{dayTotal} taken
                        </span>
                        <div className="hist-dg-line" />
                      </div>
                      {entries.map(med => (
                        <MedCard
                          key={`${med.id}-${date}`}
                          med={med}
                          onTake={() => {}}
                          onSkip={() => {}}
                          onToggleReminder={() => {}}
                        />
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}