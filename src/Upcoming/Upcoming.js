import { useState } from "react";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./Upcoming.css";

const upcomingSchedule = [
  { id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet", icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", daysFromNow: 0, scheduledDate: "Today", scheduledDay: "Thu", time: "08:00", ampm: "PM", note: "Take after dinner", frequency: "Once in Day", category: "Pain Relief", sideEffect: "Take with water", refillLeft: 14, refillTotal: 30, reminderSet: true, streak: 7, countdown: "Due today" },
  { id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule", icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E", daysFromNow: 1, scheduledDate: "Tomorrow", scheduledDay: "Fri", time: "08:00", ampm: "AM", note: "Take with breakfast", frequency: "Once in Day", category: "Supplement", sideEffect: "Best with food", refillLeft: 22, refillTotal: 30, reminderSet: true, streak: 12, countdown: "In 1 day" },
  { id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet", icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6", daysFromNow: 1, scheduledDate: "Tomorrow", scheduledDay: "Fri", time: "08:00", ampm: "PM", note: "Take before dinner", frequency: "Twice in Day", category: "Diabetes", sideEffect: "Avoid alcohol", refillLeft: 5, refillTotal: 30, reminderSet: false, streak: 3, countdown: "In 1 day" },
  { id: 4, name: "Omega-3", dose: "1000mg", qty: "2 capsules", icon: "🐟", color: "#0E7490", colorGradStart: "#164E63", colorGradEnd: "#0891B2", daysFromNow: 2, scheduledDate: "Sat, Mar 1", scheduledDay: "Sat", time: "01:00", ampm: "PM", note: "Take with lunch", frequency: "Once in Day", category: "Supplement", sideEffect: "Store in fridge", refillLeft: 28, refillTotal: 60, reminderSet: true, streak: 21, countdown: "In 2 days" },
  { id: 5, name: "Lisinopril", dose: "10mg", qty: "1 tablet", icon: "❤️", color: "#1A3A6B", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", daysFromNow: 2, scheduledDate: "Sat, Mar 1", scheduledDay: "Sat", time: "09:00", ampm: "AM", note: "Take on empty stomach", frequency: "Once in Day", category: "Blood Pressure", sideEffect: "Avoid grapefruit", refillLeft: 10, refillTotal: 30, reminderSet: true, streak: 30, countdown: "In 2 days" },
  { id: 6, name: "Zinc", dose: "25mg", qty: "1 tablet", icon: "⚡", color: "#1E6B4A", colorGradStart: "#14532D", colorGradEnd: "#22C55E", daysFromNow: 3, scheduledDate: "Sun, Mar 2", scheduledDay: "Sun", time: "10:00", ampm: "AM", note: "Take after breakfast", frequency: "Once in Day", category: "Supplement", sideEffect: "Take with food", refillLeft: 45, refillTotal: 60, reminderSet: false, streak: 5, countdown: "In 3 days" },
];

const UPCOMING_TABS = ["All", "Today", "Tomorrow", "This Week"];

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.scheduledDate]) map[item.scheduledDate] = [];
    map[item.scheduledDate].push(item);
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
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDay, setSelectedDay]   = useState(null);
  const [meds, setMeds]                 = useState(
    upcomingSchedule.map(m => ({ ...m, status: "pending" }))
  );

  // MedCard expects onTake and onSkip — for upcoming we keep them as no-ops or update status
  const handleTake = id =>
    setMeds(prev => prev.map(m => m.id === id ? { ...m, status: "taken", countdown: "Just taken" } : m));

  const handleSkip = (id, undo = false) =>
    setMeds(prev => prev.map(m =>
      m.id === id
        ? undo
          ? { ...m, status: "pending", countdown: m.daysFromNow === 0 ? "Due today" : `In ${m.daysFromNow} day${m.daysFromNow > 1 ? "s" : ""}` }
          : { ...m, status: "skipped", countdown: "Skipped" }
        : m
    ));

  const filtered = meds.filter(m => {
    if (selectedDay) return m.scheduledDay === selectedDay;
    if (activeFilter === "Today")     return m.daysFromNow === 0;
    if (activeFilter === "Tomorrow")  return m.daysFromNow === 1;
    if (activeFilter === "This Week") return m.daysFromNow <= 6;
    return true;
  });

  const grouped       = groupByDate(filtered);
  const totalCount    = meds.length;
  const todayCount    = meds.filter(m => m.daysFromNow === 0).length;
  const tomorrowCount = meds.filter(m => m.daysFromNow === 1).length;
  const remindersOn   = meds.filter(m => m.reminderSet).length;

  return (
    <Layout>
      <div className="main">
        <div className="main-header">
          <div className="greeting">
            <h1>Upcoming Medicines 🗓️</h1>
            <p>{totalCount} doses scheduled for the next 7 days</p>
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
          <button className="add-btn">
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