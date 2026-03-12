import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import { useMedicines } from "../Context/MedicineContext";
import "./Upcoming.css";

const UPCOMING_TABS = ["All", "Today", "Tomorrow", "This Week"];

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    const label = item.scheduledDate || "Upcoming";
    if (!map[label]) map[label] = [];
    map[label].push(item);
  });
  return map;
}

function CalendarStrip({ selectedDay, onSelect }) {
  const days   = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  const dates  = [27, 28, 1, 2, 3, 4, 5];
  const months = ["", "", "Mar", "Mar", "Mar", "Mar", "Mar"];
  return (
    <div className="cal-strip">
      {days.map((d, i) => (
        <button key={d}
          className={`cal-day ${selectedDay === d ? "selected" : ""} ${d === "Thu" ? "today" : ""}`}
          onClick={() => onSelect(selectedDay === d ? null : d)}>
          <span className="cal-day-name">{d}</span>
          <span className="cal-day-num">{dates[i]}</span>
          {months[i] && <span className="cal-month">{months[i]}</span>}
        </button>
      ))}
    </div>
  );
}

export default function Upcoming() {
  const navigate = useNavigate();
  // ← Pull from global context — includes AddMedicine-added entries with all fields
  const { medicines, updateMedicine } = useMedicines();

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDay,  setSelectedDay]  = useState(null);

  // Enrich medicines with upcoming-specific fields if not already set
  const upcomingMeds = medicines.map((m, i) => ({
    scheduledDate: m.scheduledDate || (i === 0 ? "Today" : i <= 2 ? "Tomorrow" : "This Week"),
    scheduledDay:  m.scheduledDay  || ["Thu", "Fri", "Fri", "Sat", "Sat", "Sun", "Mon"][i % 7],
    daysFromNow:   m.daysFromNow   ?? (i === 0 ? 0 : i <= 2 ? 1 : 2),
    streak:        m.streak        || 0,
    ...m,
  }));

  const handleTake = id =>
    updateMedicine(id, { status: "taken", countdown: "Just taken" });

  const handleSkip = (id, undo = false) => {
    const med = upcomingMeds.find(m => m.id === id);
    updateMedicine(id, undo
      ? { status: "pending", countdown: med?.daysFromNow === 0 ? "Due today" : `In ${med?.daysFromNow || 1} day(s)` }
      : { status: "skipped", countdown: "Skipped" }
    );
  };

  const filtered = upcomingMeds.filter(m => {
    if (selectedDay) return m.scheduledDay === selectedDay;
    if (activeFilter === "Today")     return m.daysFromNow === 0;
    if (activeFilter === "Tomorrow")  return m.daysFromNow === 1;
    if (activeFilter === "This Week") return (m.daysFromNow ?? 0) <= 6;
    return true;
  });

  const grouped       = groupByDate(filtered);
  const totalCount    = upcomingMeds.length;
  const todayCount    = upcomingMeds.filter(m => m.daysFromNow === 0).length;
  const tomorrowCount = upcomingMeds.filter(m => m.daysFromNow === 1).length;
  const remindersOn   = upcomingMeds.filter(m => m.reminderSet).length;

  return (
    <Layout>
      <div className="main">
        <div className="main-header">
          <div className="greeting">
            <h1>Upcoming 📅</h1>
            <p>{totalCount} medicines scheduled ahead</p>
          </div>
          <div className="date-chip">📅 <b>Thursday</b>, Feb 27</div>
        </div>

        <div className="stats-row">
          <div className="stat-card total">
            <div className="stat-icon-box total">💊</div>
            <div className="stat-text">
              <div className="stat-label total">Total Upcoming</div>
              <div className="stat-value">{totalCount}</div>
            </div>
          </div>
          <div className="stat-card today-card">
            <div className="stat-icon-box today-card">📍</div>
            <div className="stat-text">
              <div className="stat-label today-card">Due Today</div>
              <div className="stat-value">{todayCount}</div>
            </div>
          </div>
          <div className="stat-card tomorrow-card">
            <div className="stat-icon-box tomorrow-card">⏰</div>
            <div className="stat-text">
              <div className="stat-label tomorrow-card">Tomorrow</div>
              <div className="stat-value">{tomorrowCount}</div>
            </div>
          </div>
          <div className="stat-card reminder-card">
            <div className="stat-icon-box reminder-card">🔔</div>
            <div className="stat-text">
              <div className="stat-label reminder-card">Reminders On</div>
              <div className="stat-value">{remindersOn}</div>
            </div>
          </div>
          <button className="add-btn" onClick={() => navigate("/addMedicine")}>
            <div className="add-btn-label">Add<br />Medicine</div>
            <div className="add-btn-circle">+</div>
          </button>
        </div>

        <div className="cal-section">
          <div className="cal-section-header">
            <span className="cal-title">Jump to Day</span>
            {selectedDay && (
              <button className="cal-clear" onClick={() => setSelectedDay(null)}>
                Clear filter ✕
              </button>
            )}
          </div>
          <CalendarStrip selectedDay={selectedDay} onSelect={setSelectedDay} />
        </div>

        <div className="list-head">
          <div className="list-title">Schedule</div>
          <FilterTabs
            tabs={UPCOMING_TABS}
            active={activeFilter}
            onChange={f => { setActiveFilter(f); setSelectedDay(null); }}
          />
        </div>

        <div className="cards-container">
          {Object.keys(grouped).length === 0
            ? <div className="empty-state">No medicines scheduled for this period</div>
            : Object.entries(grouped).map(([dateLabel, items]) => (
                <div key={dateLabel} className="date-group">
                  <div className="date-group-label">📅 {dateLabel}</div>
                  {items.map(med =>
                    <MedCard key={med.id} med={med} onTake={handleTake} onSkip={handleSkip} />
                  )}
                </div>
              ))
          }
        </div>
      </div>
    </Layout>
  );
}