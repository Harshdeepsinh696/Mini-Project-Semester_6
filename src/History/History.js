import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import MedCard from "../Component/MedCard";
import FilterTabs from "../Component/FilterTabs";
import "./History.css";

/* ─── Medicine data ──────────────────────────────────────────────────────── */
const historyMeds = [
  {
    id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet",
    icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB",
    time: "08:00", ampm: "PM", note: "Take after dinner",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 14, refillTotal: 30,
    category: "Pain Relief", sideEffect: "Take with water",
    histDate: "Feb 27, 2025", histDay: "Today", histDayNum: 27,
  },
  {
    id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule",
    icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E",
    time: "08:00", ampm: "AM", note: "Take with breakfast",
    frequency: "Once in Day", countdown: "Skipped this dose",
    status: "skipped", refillLeft: 22, refillTotal: 30,
    category: "Supplement", sideEffect: "Best with food",
    histDate: "Feb 27, 2025", histDay: "Today", histDayNum: 27,
  },
  {
    id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet",
    icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6",
    time: "08:00", ampm: "PM", note: "Take before dinner",
    frequency: "Twice in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 5, refillTotal: 30,
    category: "Diabetes", sideEffect: "Avoid alcohol",
    histDate: "Feb 27, 2025", histDay: "Today", histDayNum: 27,
  },
  {
    id: 4, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet",
    icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB",
    time: "08:00", ampm: "PM", note: "Take after dinner",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 15, refillTotal: 30,
    category: "Pain Relief", sideEffect: "Take with water",
    histDate: "Feb 26, 2025", histDay: "Yesterday", histDayNum: 26,
  },
  {
    id: 5, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule",
    icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E",
    time: "08:00", ampm: "AM", note: "Take with breakfast",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 23, refillTotal: 30,
    category: "Supplement", sideEffect: "Best with food",
    histDate: "Feb 26, 2025", histDay: "Yesterday", histDayNum: 26,
  },
  {
    id: 6, name: "Metformin", dose: "850mg", qty: "1 tablet",
    icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6",
    time: "08:00", ampm: "PM", note: "Take before dinner",
    frequency: "Twice in Day", countdown: "Skipped this dose",
    status: "skipped", refillLeft: 6, refillTotal: 30,
    category: "Diabetes", sideEffect: "Avoid alcohol",
    histDate: "Feb 26, 2025", histDay: "Yesterday", histDayNum: 26,
  },
  {
    id: 7, name: "Omega-3", dose: "1000mg", qty: "2 capsules",
    icon: "🐟", color: "#0E7490", colorGradStart: "#164E63", colorGradEnd: "#0891B2",
    time: "01:00", ampm: "PM", note: "Take with lunch",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 30, refillTotal: 60,
    category: "Supplement", sideEffect: "Store in fridge",
    histDate: "Feb 25, 2025", histDay: "Feb 25", histDayNum: 25,
  },
  {
    id: 8, name: "Lisinopril", dose: "10mg", qty: "1 tablet",
    icon: "❤️", color: "#1A3A6B", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB",
    time: "09:00", ampm: "AM", note: "Take on empty stomach",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 11, refillTotal: 30,
    category: "Blood Pressure", sideEffect: "Avoid grapefruit",
    histDate: "Feb 25, 2025", histDay: "Feb 25", histDayNum: 25,
  },
  {
    id: 9, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet",
    icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB",
    time: "08:00", ampm: "PM", note: "Take after dinner",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 16, refillTotal: 30,
    category: "Pain Relief", sideEffect: "Take with water",
    histDate: "Feb 24, 2025", histDay: "Feb 24", histDayNum: 24,
  },
  {
    id: 10, name: "Zinc", dose: "25mg", qty: "1 tablet",
    icon: "⚡", color: "#1E6B4A", colorGradStart: "#14532D", colorGradEnd: "#22C55E",
    time: "10:00", ampm: "AM", note: "Take after breakfast",
    frequency: "Once in Day", countdown: "Taken on time",
    status: "taken", refillLeft: 47, refillTotal: 60,
    category: "Supplement", sideEffect: "Take with food",
    histDate: "Feb 24, 2025", histDay: "Feb 24", histDayNum: 24,
  },
];

const HISTORY_TABS = ["All", "Taken", "Skipped"];

const JUMP_DAYS = [
  { abbr: "THU", num: 27, today: true  },
  { abbr: "WED", num: 26, today: false },
  { abbr: "TUE", num: 25, today: false },
  { abbr: "MON", num: 24, today: false },
  { abbr: "SUN", num: 23, today: false },
  { abbr: "SAT", num: 22, today: false },
  { abbr: "FRI", num: 21, today: false },
];

function groupByDate(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.histDate])
      map[item.histDate] = { label: item.histDay, entries: [] };
    map[item.histDate].entries.push(item);
  });
  return map;
}

function badgeClass(taken, total) {
  const pct = taken / total;
  return pct === 1 ? "b-green" : pct >= 0.5 ? "b-amber" : "b-red";
}

function dateIcon(label) {
  if (label === "Today")     return "📅";
  if (label === "Yesterday") return "🕐";
  return "📄";
}

function WeeklyHeatmap({ meds }) {
  const WEEK = [
    { label: "Mon 24", d: 24 },
    { label: "Tue 25", d: 25 },
    { label: "Wed 26", d: 26 },
    { label: "Thu 27", d: 27 },
    { label: "Fri 28", d: 28 },
    { label: "Sat 1",  d: 1  },
    { label: "Sun 2",  d: 2  },
  ];

  const dm = {};
  meds.forEach(m => {
    const k = m.histDayNum;
    if (!dm[k]) dm[k] = { t: 0, n: 0 };
    dm[k].n++;
    if (m.status === "taken") dm[k].t++;
  });

  return (
    <div className="hist-panel">
      <div className="hist-panel-title">Weekly Overview</div>
      <div className="hist-heatmap-grid">
        {WEEK.map(({ label, d }) => {
          const data = dm[d];
          const pct  = data ? data.t / data.n : -1;
          const cls  = pct < 0 ? "hb-empty" : pct === 1 ? "hb-full" : pct >= 0.5 ? "hb-partial" : "hb-low";
          return (
            <div key={label} className="hist-heat-cell">
              <div className={`hist-heat-block ${cls}`}>
                {data && <span className="hist-heat-val">{data.t}/{data.n}</span>}
              </div>
              <span className="hist-heat-lbl">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="hist-heat-legend">
        <span className="hleg-item"><span className="hleg-dot d-full" />100%</span>
        <span className="hleg-item"><span className="hleg-dot d-partial" />≥50%</span>
        <span className="hleg-item"><span className="hleg-dot d-low" />&lt;50%</span>
        <span className="hleg-item"><span className="hleg-dot d-empty" />No data</span>
      </div>
    </div>
  );
}

function AdherenceBar({ meds }) {
  const taken   = meds.filter(m => m.status === "taken").length;
  const skipped = meds.filter(m => m.status === "skipped").length;
  const total   = meds.length;
  const pct     = total > 0 ? Math.round((taken / total) * 100) : 0;
  return (
    <div className="hist-panel">
      <div className="hist-adh-top">
        <span className="hist-adh-title">Overall Adherence</span>
        <div className="hist-adh-chips">
          <span className="hist-chip c-blue">{pct}%</span>
          <span className="hist-chip c-green">{taken} of {total} taken</span>
          {skipped > 0 && <span className="hist-chip c-red">{skipped} skipped</span>}
        </div>
      </div>
      <div className="hist-adh-track">
        <div className="hist-adh-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function JumpToDay({ selectedDay, onSelect }) {
  return (
    <div className="hist-panel">
      <div className="hist-panel-title">Jump to Day</div>
      <div className="hist-cal-strip">
        {JUMP_DAYS.map(({ abbr, num, today }) => {
          const active = selectedDay === num;
          return (
            <button
              key={num}
              className={`hist-cal-pill ${today ? "hcp-today" : ""} ${active ? "hcp-active" : ""}`}
              onClick={() => onSelect(active ? null : num)}
            >
              {today && <span className="hist-cal-dot" />}
              <span className="hist-cal-day-abbr">{abbr}</span>
              <span className="hist-cal-day-num">{num}</span>
            </button>
          );
        })}
        {selectedDay && (
          <button className="hist-cal-clear" onClick={() => onSelect(null)}>
            Clear filter ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDay, setSelectedDay]   = useState(null);
  const [meds, setMeds]                 = useState(historyMeds);

  const handleTake = id =>
    setMeds(prev => prev.map(m =>
      m.id === id ? { ...m, status: "taken", countdown: "Taken on time" } : m
    ));

  const handleSkip = (id, undo = false) =>
    setMeds(prev => prev.map(m =>
      m.id === id
        ? undo
          ? { ...m, status: "taken",   countdown: "Taken on time"    }
          : { ...m, status: "skipped", countdown: "Skipped this dose" }
        : m
    ));

  const takenCount   = meds.filter(m => m.status === "taken").length;
  const skippedCount = meds.filter(m => m.status === "skipped").length;
  const totalCount   = meds.length;
  const adherencePct = Math.round((takenCount / totalCount) * 100);

  const filtered = meds.filter(m => {
    if (selectedDay && m.histDayNum !== selectedDay) return false;
    if (activeFilter === "Taken")   return m.status === "taken";
    if (activeFilter === "Skipped") return m.status === "skipped";
    return true;
  });

  const grouped = groupByDate(filtered);

  return (
    <Layout>
      <div className="hist-main">

        <div className="hist-header">
          <div className="hist-greeting">
            <h1>Medicine History 📋</h1>
            <p>{totalCount} doses recorded across the last 7 days</p>
          </div>
          <div className="hist-date-chip">📅 <b>Thursday</b>, Feb 27</div>
        </div>

        <div className="hist-stats-row">
          <div className="hist-stat-card sc-blue">
            <div className="hist-stat-icon">📋</div>
            <div className="hist-stat-info">
              <div className="hist-stat-label">Total Records</div>
              <div className="hist-stat-value">{totalCount}</div>
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
          <button className="hist-add-btn" onClick={() => window.history.back()}>
            <div className="hist-add-label">Add<br />Medicine</div>
            <div className="hist-add-circle">+</div>
          </button>
        </div>

        <div className="hist-body">

          <div className="hist-left-col">
            <WeeklyHeatmap meds={meds} />
            <AdherenceBar  meds={meds} />
            <JumpToDay selectedDay={selectedDay} onSelect={setSelectedDay} />
          </div>

          <div className="hist-right-col">

            <div className="hist-list-head">
              <div className="hist-list-title">History</div>
              <FilterTabs
                tabs={HISTORY_TABS}
                active={activeFilter}
                onChange={f => { setActiveFilter(f); setSelectedDay(null); }}
              />
            </div>

            <div className="hist-cards">
              {Object.keys(grouped).length === 0 ? (
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
                          key={med.id}
                          med={med}
                          onTake={handleTake}
                          onSkip={handleSkip}
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