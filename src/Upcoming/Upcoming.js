import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavCount } from "../Context/NavCountContext";
import axios from "axios";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./Upcoming.css";

const BASE = "https://localhost:7205";
const UPCOMING_TABS = ["All", "Today", "Tomorrow", "This Week"];

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

const toMedCard = (m, targetDate) => {
  const t = formatTime(m.doseTime);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tgt = new Date(targetDate); tgt.setHours(0, 0, 0, 0);
  const diffDays = Math.round((tgt - today) / 86400000);

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
    status: m.dayStatus || "pending",
    countdown: diffDays === 0 ? "Due today"
      : diffDays === 1 ? "In 1 day"
        : `In ${diffDays} days`,
    reminderSet: m.isReminderOn || false,
    daysFromNow: diffDays,
    scheduledDate: tgt.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short"
    }),
    scheduledDay: tgt.toLocaleDateString("en-US", { weekday: "short" }),
  };
};

// Build the 7-day strip starting from today
const buildWeekDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      dateStr: d.toISOString().split("T")[0],
      abbr: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      num: d.getDate(),
      month: i >= 1 ? d.toLocaleDateString("en-US", { month: "short" }) : "",
      isToday: i === 0,
    });
  }
  return days;
};

function CalendarStrip({ selectedDateStr, onSelect }) {
  const weekDays = buildWeekDays();
  return (
    <div className="cal-strip">
      {weekDays.map((d) => (
        <button
          key={d.dateStr}
          className={`cal-day ${d.isToday ? "today" : ""} ${selectedDateStr === d.dateStr ? "selected" : ""}`}
          onClick={() => onSelect(selectedDateStr === d.dateStr ? null : d.dateStr)}
        >
          <span className="cal-day-name">{d.abbr}</span>
          <span className="cal-day-num">{d.num}</span>
          {d.month && <span className="cal-month">{d.month}</span>}
        </button>
      ))}
    </div>
  );
}

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.scheduledDate]) map[item.scheduledDate] = [];
    map[item.scheduledDate].push(item);
  });
  return map;
}

export default function Upcoming() {
  const navigate = useNavigate();
  const { setUpcomingCount } = useNavCount();
  const todayStr = new Date().toISOString().split("T")[0];

  const [activeFilter, setActiveFilter] = useState("All");
  // selectedDateStr: which single day is highlighted (null = show week based on filter)
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch whenever filter or selectedDate changes
  useEffect(() => {
    if (selectedDateStr) {
      fetchForDate(selectedDateStr);
    } else {
      fetchWeek();
    }
  }, [selectedDateStr, activeFilter]);

  const fetchForDate = async (dateStr) => {
    try {
      setLoading(true);
      const userId = parseInt(localStorage.getItem("userId"));
      if (!userId) return;
      const res = await axios.get(`${BASE}/api/medicine/upcoming/${userId}?date=${dateStr}`);
      const mapped = res.data.map(m => toMedCard(m, dateStr));
      setMeds(mapped);
      setUpcomingCount(mapped.length); // ✅
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const fetchWeek = async () => {
    try {
      setLoading(true);
      const userId = parseInt(localStorage.getItem("userId"));
      if (!userId) return;
      const today = new Date();

      // Determine how many days to fetch based on filter
      const days = activeFilter === "Today" ? [0]
        : activeFilter === "Tomorrow" ? [1]
          : [0, 1, 2, 3, 4, 5, 6]; // This Week / All

      const promises = days.map(i => {
        const d = new Date(today); d.setDate(today.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        return axios.get(`${BASE}/api/medicine/upcoming/${userId}?date=${dStr}`)
          .then(r => r.data.map(m => toMedCard(m, dStr)));
      });

      const results = await Promise.all(promises);
      const allMeds = results.flat();
      setMeds(allMeds);
      setUpcomingCount(allMeds.length); // ✅
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleToggleReminder = async (id) => {
    const med = meds.find(m => m.id === id);
    const newVal = !med.reminderSet;
    try {
      await axios.put(`${BASE}/api/medicine/reminder/${id}`, { isReminderOn: newVal });
      setMeds(prev => prev.map(m => m.id === id ? { ...m, reminderSet: newVal } : m));
    } catch (err) { console.error(err); }
  };

  // Local filter on top of fetched data
  const filtered = meds.filter(m => {
    if (activeFilter === "Today") return m.daysFromNow === 0;
    if (activeFilter === "Tomorrow") return m.daysFromNow === 1;
    return true;
  });

  const grouped = groupByDate(filtered);
  const totalCount = meds.length;
  const todayCount = meds.filter(m => m.daysFromNow === 0).length;
  const tomorrowCount = meds.filter(m => m.daysFromNow === 1).length;
  const remindersOn = meds.filter(m => m.reminderSet).length;

  return (
    <Layout>
      <div className="main">
        <div className="main-header">
          <div className="greeting">
            <h1>Upcoming Medicines 🗓️</h1>
            <p>{totalCount} doses scheduled for the next 7 days</p>
          </div>
          <div className="date-chip">
            📅 <b>{new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "short"
            })}</b>
          </div>
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
            {selectedDateStr && (
              <button className="cal-clear" onClick={() => setSelectedDateStr(null)}>
                Clear filter ✕
              </button>
            )}
          </div>
          <CalendarStrip
            selectedDateStr={selectedDateStr}
            onSelect={setSelectedDateStr}
          />
        </div>

        <div className="list-head">
          <div className="list-title">Schedule</div>
          <FilterTabs
            tabs={UPCOMING_TABS}
            active={activeFilter}
            onChange={f => { setActiveFilter(f); setSelectedDateStr(null); }}
          />
        </div>

        <div className="cards-container">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="empty-state">No medicines scheduled for this period</div>
          ) : (
            Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel} className="date-group">
                <div className="date-group-label">
                  <span className="dg-icon">📅</span>

                  <span className="dg-text">
                    {dateLabel}
                  </span>

                  {/* optional badge (you can remove if not needed) */}
                  <span className="dg-badge">
                    {items.length} doses
                  </span>

                  <div className="dg-line" />
                </div>
                {items.map(med => (
                  <MedCard
                    key={`${med.id}-${dateLabel}`}
                    med={med}
                    onTake={() => { }}
                    onSkip={() => { }}
                    onToggleReminder={handleToggleReminder}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}