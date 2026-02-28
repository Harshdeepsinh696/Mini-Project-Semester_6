import { useState } from "react";
import Layout from "../Layout/Layout";
import FilterTabs from "../Component/FilterTabs";
import RefillRing from "../Component/RefillRing";
import "./Upcoming.css";

const upcomingSchedule = [
  { id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet", icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", daysFromNow: 0, scheduledDate: "Today", scheduledDay: "Thu", time: "08:00 PM", note: "Take after dinner", frequency: "Once in Day", category: "Pain Relief", sideEffect: "Take with water", refillLeft: 14, refillTotal: 30, reminderSet: true, streak: 7 },
  { id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule", icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E", daysFromNow: 1, scheduledDate: "Tomorrow", scheduledDay: "Fri", time: "08:00 AM", note: "Take with breakfast", frequency: "Once in Day", category: "Supplement", sideEffect: "Best with food", refillLeft: 22, refillTotal: 30, reminderSet: true, streak: 12 },
  { id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet", icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6", daysFromNow: 1, scheduledDate: "Tomorrow", scheduledDay: "Fri", time: "08:00 PM", note: "Take before dinner", frequency: "Twice in Day", category: "Diabetes", sideEffect: "Avoid alcohol", refillLeft: 5, refillTotal: 30, reminderSet: false, streak: 3 },
  { id: 4, name: "Omega-3", dose: "1000mg", qty: "2 capsules", icon: "🐟", color: "#0E7490", colorGradStart: "#164E63", colorGradEnd: "#0891B2", daysFromNow: 2, scheduledDate: "Sat, Mar 1", scheduledDay: "Sat", time: "01:00 PM", note: "Take with lunch", frequency: "Once in Day", category: "Supplement", sideEffect: "Store in fridge", refillLeft: 28, refillTotal: 60, reminderSet: true, streak: 21 },
  { id: 5, name: "Lisinopril", dose: "10mg", qty: "1 tablet", icon: "❤️", color: "#1A3A6B", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", daysFromNow: 2, scheduledDate: "Sat, Mar 1", scheduledDay: "Sat", time: "09:00 AM", note: "Take on empty stomach", frequency: "Once in Day", category: "Blood Pressure", sideEffect: "Avoid grapefruit", refillLeft: 10, refillTotal: 30, reminderSet: true, streak: 30 },
  { id: 6, name: "Zinc", dose: "25mg", qty: "1 tablet", icon: "⚡", color: "#1E6B4A", colorGradStart: "#14532D", colorGradEnd: "#22C55E", daysFromNow: 3, scheduledDate: "Sun, Mar 2", scheduledDay: "Sun", time: "10:00 AM", note: "Take after breakfast", frequency: "Once in Day", category: "Supplement", sideEffect: "Take with food", refillLeft: 45, refillTotal: 60, reminderSet: false, streak: 5 },
];

const FIXED_GRAD_START = "#1A3A6B";
const FIXED_GRAD_END   = "#2563EB";
const FIXED_COLOR      = "#2563EB";
const UPCOMING_TABS    = ["All", "Today", "Tomorrow", "This Week"];

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.scheduledDate]) map[item.scheduledDate] = [];
    map[item.scheduledDate].push(item);
  });
  return map;
}

function BellIcon({ filled, color }) {
  return filled
    ? <svg viewBox="0 0 24 24" fill={color || "#2563EB"} width="14" height="14"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}

function EditIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}

function CalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
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

function UpcomingCard({ med, onToggleReminder }) {
  const refillPct  = Math.round((med.refillLeft / med.refillTotal) * 100);
  const isLowRefill = med.refillLeft <= 7;
  const isToday    = med.daysFromNow === 0;
  const isTomorrow = med.daysFromNow === 1;

  return (
    <div className={`up-card ${isToday ? "today-card" : ""}`}
      style={{ "--med-grad-start": FIXED_GRAD_START, "--med-grad-end": FIXED_GRAD_END }}>
      <div className="up-accent"
        style={{ background: `linear-gradient(180deg,${FIXED_GRAD_START},${FIXED_GRAD_END})` }} />

      {/* LEFT */}
      <div className="up-left">
        <div className="up-icon-box">{med.icon}</div>
        <div className="up-identity">
          <div className="up-name">{med.name}</div>
          <span className="up-cat-badge" style={{ color: med.color }}>{med.category}</span>
          <div className="up-sub">{med.dose} · {med.qty}</div>
        </div>
        <div className="up-refill">
          <RefillRing
            left={med.refillLeft}
            total={med.refillTotal}
            color={FIXED_COLOR}
            colorGradStart={FIXED_GRAD_START}
            colorGradEnd={FIXED_GRAD_END}
          />
          <div className="refill-info">
            <span className="refill-title" style={{ color: isLowRefill ? "#EF4444" : "#1A3A6B" }}>
              {isLowRefill ? "⚠ Low stock" : "Refill status"}
            </span>
            <span className="refill-sub">{refillPct}% remaining</span>
          </div>
        </div>
        <div className="up-streak">
          <span className="streak-flame">🔥</span>
          <span className="streak-val" style={{ color: med.color }}>{med.streak}</span>
          <span className="streak-lbl">day streak</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="up-center">
        <div className="up-date-row">
          <div className="up-date-chip" style={{
            background:   isToday ? "#EFF6FF" : isTomorrow ? "#FEF3C7" : "#F0F5FF",
            borderColor:  isToday ? "#BFDBFE" : isTomorrow ? "#FCD34D" : "#D1DEFF",
            color:        isToday ? med.color  : isTomorrow ? "#B45309" : "#7A8FB5"
          }}><CalIcon />{med.scheduledDate}</div>
          {isToday    && <span className="today-badge">📍 Today</span>}
          {isTomorrow && <span className="tomorrow-badge">⏰ Tomorrow</span>}
        </div>
        <div className="up-time-row">
          <span className="up-time"
            style={{ backgroundImage: `linear-gradient(135deg,${FIXED_GRAD_START} 0%,${FIXED_GRAD_END} 100%)` }}>
            {med.time.split(" ")[0]}
          </span>
          <span className="up-ampm">{med.time.split(" ")[1]}</span>
        </div>
        <div className="up-note">
          <span className="note-bar"
            style={{ background: `linear-gradient(180deg,${FIXED_GRAD_START},${FIXED_GRAD_END})` }} />
          {med.note}
        </div>
        <div className="tags-row">
          <span className="tag freq">{med.frequency}</span>
          <span className="tag info-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" width="10" height="10">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {med.sideEffect}
          </span>
        </div>
        <div className="up-days-away">
          {med.daysFromNow === 0 && <span className="days-badge today-days" style={{ background: "#EFF6FF", color: med.color, borderColor: "#BFDBFE" }}>Due today</span>}
          {med.daysFromNow === 1 && <span className="days-badge tomorrow-days">In 1 day</span>}
          {med.daysFromNow >= 2 && <span className="days-badge future-days">In {med.daysFromNow} days</span>}
        </div>
      </div>

      {/* RIGHT */}
      <div className="up-right">
        <div className="up-right-top">
          <button
            className={`reminder-btn ${med.reminderSet ? "active" : ""}`}
            onClick={() => onToggleReminder(med.id)}
            style={med.reminderSet ? { background: "#EFF6FF", borderColor: "#BFDBFE", color: med.color } : {}}>
            <BellIcon filled={med.reminderSet} color={med.color} />
            <span>{med.reminderSet ? "Reminder on" : "Set reminder"}</span>
          </button>
          <button className="up-edit-btn"><EditIcon /></button>
        </div>
        <div className="right-divider" />
        <div className="up-visual-card" style={{ borderColor: "#BFDBFE" }}>
          <div className="med-visual-blob blob1" style={{ background: FIXED_GRAD_START }} />
          <div className="med-visual-blob blob2" style={{ background: FIXED_GRAD_END }} />
          <div className="up-visual-icon">{med.icon}</div>
          <div className="up-visual-dose" style={{ color: FIXED_COLOR }}>{med.dose}</div>
          <div className="up-visual-name">{med.name}</div>
          <div className="med-visual-bar-wrap">
            <div className="med-visual-bar-track">
              <div className="med-visual-bar-fill" style={{
                width: `${refillPct}%`,
                background: isLowRefill ? "#EF4444" : `linear-gradient(90deg,${FIXED_GRAD_START},${FIXED_GRAD_END})`
              }} />
            </div>
            <span className="med-visual-bar-label"
              style={{ color: isLowRefill ? "#EF4444" : med.color }}>
              {med.refillLeft}/{med.refillTotal} pills
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Upcoming() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDay, setSelectedDay]   = useState(null);
  const [meds, setMeds]                 = useState(upcomingSchedule);

  const toggleReminder = id =>
    setMeds(prev => prev.map(m => m.id === id ? { ...m, reminderSet: !m.reminderSet } : m));

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
                  {items.map(med =>
                    <UpcomingCard key={med.id} med={med} onToggleReminder={toggleReminder} />
                  )}
                </div>
              ))
          }
        </div>
      </div>
    </Layout>
  );
}