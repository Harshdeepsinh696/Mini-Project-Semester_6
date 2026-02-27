import { useState, useRef, useEffect } from "react";
import Layout from "../Layout";
import "./Today.css";

const medicines = [
  { id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet", icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB", time: "12:00", ampm: "PM", note: "Take after food", frequency: "Once in Day", countdown: "In about 2 hours", status: "pending", refillLeft: 14, refillTotal: 30, category: "Pain Relief", sideEffect: "Take with water" },
  { id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule", icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E", time: "08:00", ampm: "AM", note: "Take with breakfast", frequency: "Once in Day", countdown: "Taken 2 hours ago", status: "taken", refillLeft: 22, refillTotal: 30, category: "Supplement", sideEffect: "Best with food" },
  { id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet", icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6", time: "08:00", ampm: "PM", note: "Take before dinner", frequency: "Twice in Day", countdown: "In about 6 hours", status: "pending", refillLeft: 5, refillTotal: 30, category: "Diabetes", sideEffect: "Avoid alcohol" },
];

const FIXED_GRAD_START = "#1A3A6B";
const FIXED_GRAD_END = "#2563EB";
const FIXED_COLOR = "#2563EB";
const FIXED_COLOR_GREEN_START = "#064E3B";
const FIXED_COLOR_GREEN_END = "#22C55E";


function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ClockIcon({ size = 12, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function RefillRing({ left, total, color, colorGradStart, colorGradEnd }) {
  const pct = left / total, r = 18, circ = 2 * Math.PI * r;
  const dash = circ * pct, isLow = left <= 7;
  const id = `rg-${left}-${total}`;
  return (
    <div className="refill-ring-wrap">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLow ? "#EF4444" : colorGradStart} />
            <stop offset="100%" stopColor={isLow ? "#F87171" : colorGradEnd} />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r={r} fill="none" stroke="#E8EDFF" strokeWidth="5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" strokeDashoffset={circ * 0.25}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)" }} />
      </svg>
      <div className="refill-ring-inner">
        <span className="refill-num" style={{ color: isLow ? "#EF4444" : color }}>{left}</span>
        <span className="refill-label">left</span>
      </div>
    </div>
  );
}

function FilterTabs({ active, onChange }) {
  const tabs = ["All", "Pending", "Taken", "Skipped"];
  const tabRefs = useRef([]), sliderRef = useRef(null), containerRef = useRef(null);
  useEffect(() => {
    const idx = tabs.indexOf(active), tab = tabRefs.current[idx], container = containerRef.current;
    if (!tab || !container || !sliderRef.current) return;
    const tr = tab.getBoundingClientRect(), cr = container.getBoundingClientRect();
    sliderRef.current.style.width = tr.width + "px";
    sliderRef.current.style.transform = `translateX(${tr.left - cr.left - 4}px)`;
  }, [active]);
  return (
    <div className="filter-tabs" ref={containerRef}>
      <div className="filter-slider" ref={sliderRef} />
      {tabs.map((tab, i) => (
        <button key={tab} ref={el => tabRefs.current[i] = el}
          className={`ftab ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}>{tab}</button>
      ))}
    </div>
  );
}

function MedCard({ med, onTake, onSkip }) {
  const isTaken = med.status === "taken", isSkipped = med.status === "skipped", isDone = isTaken || isSkipped;
  const refillPct = Math.round((med.refillLeft / med.refillTotal) * 100), isLow = med.refillLeft <= 7;

  // FIXED neutral background — same for ALL cards
  const CARD_BG = "linear-gradient(135deg, #fff 0%, #EFF6FF 100%)";
  const CARD_BORDER = "#BFDBFE";
  const LEFT_BG = "linear-gradient(160deg, #EFF6FF 0%, #F8FAFF 100%)";
  const LEFT_BORDER = "#D8E8FF";
  const RIGHT_BG = "linear-gradient(160deg, #F5F8FF 0%, #EFF4FF 100%)";
  const RIGHT_BORDER = "#D8E8FF";

  return (
    <div className={`med-card ${isTaken ? "done" : ""} ${isSkipped ? "skipped" : ""}`}
      style={{ "--med-grad-start": FIXED_GRAD_START, "--med-grad-end": FIXED_GRAD_END }}>

      {/* LEFT — hardcoded neutral bg, no per-card color */}
      <div className="med-left" style={{ background: LEFT_BG, borderRightColor: LEFT_BORDER }}>
        <div className="med-icon-wrap">
          <div className={`med-icon-box ${isTaken ? "done" : ""} ${isSkipped ? "skipped" : ""}`}
            style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
            {med.icon}
          </div>
        </div>
        <div className="med-identity">
          <div className="med-name">{med.name}</div>
          <span className="med-category-badge"
            style={{ background: "#EFF6FF", color: med.color, borderColor: "#BFDBFE" }}>
            {med.category}
          </span>
          <div className="med-sub">{med.dose} · {med.qty}</div>
        </div>
        <div className="med-refill">
          <RefillRing
            left={med.refillLeft}
            total={med.refillTotal}
            color={FIXED_COLOR}
            colorGradStart={FIXED_GRAD_START}
            colorGradEnd={FIXED_GRAD_END}
          />
          <div className="refill-info">
            <span className="refill-title" style={{ color: isLow ? "#EF4444" : "#1A3A6B" }}>
              {isLow ? "⚠ Low stock" : "Refill status"}
            </span>
            <span className="refill-sub">{refillPct}% remaining</span>
          </div>
        </div>
        {!isDone ? (
          <div className="action-btns">
            <button className="action-btn skip" onClick={e => { e.stopPropagation(); onSkip(med.id); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              <span>Skip</span>
            </button>
            <button className="action-btn take" onClick={e => { e.stopPropagation(); onTake(med.id); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12" /></svg>
              <span>Take</span>
            </button>
          </div>
        ) : (
          <div className="action-btns">
            <button className="action-btn undo" onClick={e => { e.stopPropagation(); onSkip(med.id, true); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#7A8FB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>
              <span>Undo</span>
            </button>
          </div>
        )}
      </div>

      {/* CENTER */}
      <div className="med-center">
        <div className="med-time-row">
          <span className="med-time"
            style={!isDone ? { backgroundImage: `linear-gradient(135deg,${FIXED_GRAD_START} 0%,${FIXED_GRAD_END} 100%)` } : {}}>
            {med.time}
          </span>
          <span className="med-ampm">{med.ampm}</span>
        </div>
        <div className="med-note">
          <span className="note-bar" style={{ background: `linear-gradient(180deg,${FIXED_GRAD_START},${FIXED_GRAD_END})` }} />
          {med.note}
        </div>
        <div className="tags-row">
          <span className="tag freq">{med.frequency}</span>
          {isTaken && <span className="tag taken-tag">✓ Taken</span>}
          {isSkipped && <span className="tag skipped-tag">✕ Skipped</span>}
          {!isDone && <span className="tag pend-tag"><span className="pend-dot" />Pending</span>}
          {med.sideEffect && <span className="tag info-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="10" height="10"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {med.sideEffect}
          </span>}
        </div>
        <div className="med-countdown">
          <ClockIcon size={12} color={isDone ? "#A0A6C0" : med.color} />
          <span style={{ color: isDone ? "#A0A6C0" : med.color }}>{med.countdown}</span>
        </div>
      </div>

      {/* RIGHT — hardcoded neutral bg */}
      <div className="med-right" style={{ background: RIGHT_BG, borderLeftColor: RIGHT_BORDER }}>
        <div className="right-top-row">
          {isTaken && <div className="done-badge">✓ TAKEN</div>}
          {isSkipped && <div className="skipped-badge">✕ SKIPPED</div>}
          {!isDone && <div style={{ flex: 1 }} />}
          <button className="edit-btn-right"><EditIcon /></button>
        </div>
        <div className="adherence-block">
          <div className="adherence-title">Weekly Adherence</div>
          <div className="adherence-dots">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const taken = i < 4, today = i === 4;
              return (
                <div key={i} className={`adh-dot-wrap ${today ? "today" : ""}`}>
                  <div className={`adh-dot ${taken ? "taken" : today ? "today-dot" : "missed"}`}
                    style={taken ? { background: `linear-gradient(135deg,${FIXED_COLOR_GREEN_START},${FIXED_COLOR_GREEN_END})`, boxShadow: `0 2px 6px ${med.color}55` } : {}} />
                  <span className="adh-day">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="right-divider" />
        {/* Visual card — hardcoded neutral bg */}
        <div className="med-visual-card" style={{ background: "linear-gradient(145deg,#EFF6FF 0%,#fff 60%)", borderColor: "#BFDBFE" }}>
          <div className="med-visual-blob blob1" style={{ background: FIXED_GRAD_START }} />
          <div className="med-visual-blob blob2" style={{ background: FIXED_GRAD_END }} />
          <div className="med-visual-icon">{med.icon}</div>
          <div className="med-visual-dose" style={{ color: FIXED_COLOR }}>
            <div className="med-visual-name">{med.name}</div>
            <div className="med-visual-bar-wrap">
              <div className="med-visual-bar-track">
                <div
                  className="med-visual-bar-fill"
                  style={{
                    width: `${refillPct}%`,
                    background: isLow
                      ? "#EF4444"
                      : `linear-gradient(90deg,${FIXED_GRAD_START},${FIXED_GRAD_END})`
                  }}
                />
              </div>
              <span className="med-visual-bar-label" style={{ color: isLow ? "#EF4444" : FIXED_COLOR }}>{med.refillLeft}/{med.refillTotal} pills</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

      export default function Today() {
  const [activeFilter, setActiveFilter] = useState("All");
      const [meds, setMeds] = useState(medicines);
  const handleTake = id => setMeds(prev => prev.map(m => m.id === id ? {...m, status: "taken", countdown: "Just taken" } : m));
  const handleSkip = (id, undo = false) => setMeds(prev => prev.map(m => m.id === id ? undo ? {...m, status: "pending", countdown: "Pending" } : {...m, status: "skipped", countdown: "Skipped" } : m));
  const takenCount = meds.filter(m => m.status === "taken").length;
  const skippedCount = meds.filter(m => m.status === "skipped").length;
  const pendingCount = meds.filter(m => m.status === "pending").length;
      const progress = Math.round((takenCount / meds.length) * 100);
  const filteredMeds = meds.filter(m => {
    if (activeFilter === "Pending") return m.status === "pending";
      if (activeFilter === "Taken") return m.status === "taken";
      if (activeFilter === "Skipped") return m.status === "skipped";
      return true;
  });
      return (
      <Layout>
        <div className="main">
          <div className="main-header">
            <div className="greeting"><h1>Good Morning 👋</h1><p>{meds.length} medicines scheduled for today</p></div>
            <div className="date-chip">📅 <b>Thursday</b>, Feb 27</div>
          </div>
          <div className="stats-row">
            <div className="stat-card total"><div className="stat-icon-box total">💊</div><div className="stat-label total">Total Medicine</div><div className="stat-value">{meds.length}</div></div>
            <div className="stat-card taken-card"><div className="stat-icon-box taken-card">✅</div><div className="stat-label taken-card">Taken Today</div><div className="stat-value">{takenCount}</div></div>
            <div className="stat-card pending-card"><div className="stat-icon-box pending-card">⏳</div><div className="stat-label pending-card">Pending</div><div className="stat-value">{pendingCount}</div></div>
            <button className="add-btn"><div className="add-btn-label">Add<br />Medicine</div><div className="add-btn-circle">+</div></button>
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
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="list-head">
            <div className="list-title">Today's Schedule</div>
            <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          </div>
          <div className="cards-container">
            {filteredMeds.length === 0
              ? <div className="empty-state">No medicines in this category</div>
              : filteredMeds.map(med => <MedCard key={med.id} med={med} onTake={handleTake} onSkip={handleSkip} />)}
          </div>
        </div>
      </Layout>
      );
}