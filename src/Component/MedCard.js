import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ← added
import "./MedCard.css";
import RefillRing from "./RefillRing";

const FIXED_GRAD_START = "#1A3A6B";
const FIXED_GRAD_END = "#2563EB";
const FIXED_COLOR = "#2563EB";
const FIXED_COLOR_GREEN_START = "#064E3B";
const FIXED_COLOR_GREEN_END = "#22C55E";

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ClockIcon({ size = 12, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="12" y2="17" />
    </svg>
  );
}

export default function MedCard({ med, onTake, onSkip, onToggleReminder }) {
  const [reminderSet, setReminderSet] = useState(med.reminderSet ?? false);
  const navigate = useNavigate();    // ← added

  const isTaken   = med.status === "taken";
  const isSkipped = med.status === "skipped";
  const isDone    = isTaken || isSkipped;
  const refillPct = Math.round((med.refillLeft / med.refillTotal) * 100);
  const isLow     = med.refillLeft <= 7;

  /* ── Navigate to edit page, passing the full med object as state ── */
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/editMedicine/${med.id}`, { state: { med } });
  };

  return (
    <div
      className={`med-card ${isTaken ? "done" : ""} ${isSkipped ? "skipped" : ""}`}
      style={{ "--med-grad-start": FIXED_GRAD_START, "--med-grad-end": FIXED_GRAD_END }}
    >
      {/* ── LEFT ── */}
      <div className="med-left">
        <div className="med-icon-wrap">
          <div className={`med-icon-box ${isTaken ? "done" : ""} ${isSkipped ? "skipped" : ""}`}>
            {med.icon}
          </div>
        </div>
        <div className="med-identity">
          <div className="med-name">{med.name}</div>
          <span className="med-category-badge"
            style={{ background:`${med.color}15`, color:med.color, borderColor:`${med.color}40` }}>
            {med.category}
          </span>
          <div className="med-sub">{med.dose} · {med.qty}</div>
        </div>
        <div className="med-refill">
          <RefillRing
            left={med.refillLeft} total={med.refillTotal}
            color={FIXED_COLOR} colorGradStart={FIXED_GRAD_START} colorGradEnd={FIXED_GRAD_END}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"
                strokeLinecap="round" width="13" height="13">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Skip</span>
            </button>
            <button className="action-btn take" onClick={e => { e.stopPropagation(); onTake(med.id); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Take</span>
            </button>
          </div>
        ) : (
          <div className="action-btns">
            <button className="action-btn undo" onClick={e => { e.stopPropagation(); onSkip(med.id, true); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#145bb2" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" width="13" height="12">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
              </svg>
              <span>Undo</span>
            </button>
          </div>
        )}
      </div>

      {/* ── CENTER ── */}
      <div className="med-center">
        <div className="med-time-row">
          <span className="med-time"
            style={!isDone ? { backgroundImage:`linear-gradient(135deg,${FIXED_GRAD_START} 0%,${FIXED_GRAD_END} 100%)` } : {}}>
            {med.time}
          </span>
          <span className="med-ampm">{med.ampm}</span>
        </div>

        <div className="med-note">
          <span className="note-bar"
            style={{ background:`linear-gradient(180deg,${FIXED_GRAD_START},${FIXED_GRAD_END})` }} />
          {med.note}
        </div>

        <div className="tags-row">
          <span className="tag freq">{med.frequency}</span>
          {isTaken   && <span className="tag taken-tag">✓ Taken</span>}
          {isSkipped && <span className="tag skipped-tag">✕ Skipped</span>}
          {!isDone   && <span className="tag pend-tag"><span className="pend-dot" />Pending</span>}
          {med.sideEffect && (
            <span className="tag info-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" width="10" height="10">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {med.sideEffect}
            </span>
          )}
        </div>

        <div className="med-countdown">
          <ClockIcon size={12} color={isDone ? "#A0A6C0" : med.color} />
          <span style={{ color: isDone ? "#A0A6C0" : med.color }}>{med.countdown}</span>
        </div>

        {(med.doctor || med.meal || med.priority) && (
          <div className="med-extra-info">
            {med.doctor && (
              <div className="med-extra-row">
                <span className="med-extra-icon" style={{ background:"#EFF6FF", color:"#2563EB" }}>
                  <DoctorIcon />
                </span>
                <div className="med-extra-content">
                  <span className="med-extra-label">Prescribed by</span>
                  <span className="med-extra-value">Dr. {med.doctor.replace(/^dr\.?\s*/i,"")}</span>
                </div>
              </div>
            )}
            {med.meal && (
              <div className="med-extra-row">
                <span className="med-extra-icon" style={{ background:"#FFFBEB", color:"#B45309" }}>🍽️</span>
                <div className="med-extra-content">
                  <span className="med-extra-label">Meal timing</span>
                  <span className="med-extra-value">{med.meal}</span>
                </div>
              </div>
            )}
            {med.priority && (
              <div className="med-extra-row">
                <span className="med-extra-icon"
                  style={{
                    background: med.priority==="Critical"?"#FEE2E2":med.priority==="High"?"#FEF3C7":"#EFF6FF",
                    color:      med.priority==="Critical"?"#DC2626":med.priority==="High"?"#B45309":"#2563EB",
                  }}>
                  {med.priority==="Critical"?"🔴":med.priority==="High"?"🟠":med.priority==="Medium"?"🟡":"🟢"}
                </span>
                <div className="med-extra-content">
                  <span className="med-extra-label">Priority</span>
                  <span className="med-extra-value"
                    style={{ color: med.priority==="Critical"?"#DC2626":med.priority==="High"?"#B45309":"#1A3A6B" }}>
                    {med.priority}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {med.note && med.note.length > 20 && (
          <div className="med-instructions">
            <div className="med-instructions-header">
              <NoteIcon /><span>Special Instructions</span>
            </div>
            <div className="med-instructions-text">{med.note}</div>
          </div>
        )}
      </div>

      {/* ── RIGHT ── */}
      <div className="med-right">
        <div className="right-top-row">
          {isTaken   && <div className="done-badge">✓ TAKEN</div>}
          {isSkipped && <div className="skipped-badge">✕ SKIPPED</div>}
          {!isDone   && <div style={{ flex: 1 }} />}

          <button
            className={`reminder-btn ${reminderSet ? "active" : ""}`}
            title={reminderSet ? "Reminder on" : "Set reminder"}
            onClick={e => {
              e.stopPropagation();
              setReminderSet(prev => !prev);
              onToggleReminder && onToggleReminder(med.id);
            }}
          >
            <span className="bell-dot" />
            <span className="bell-icon"><BellIcon /></span>
          </button>

          {/* ── Edit button — navigates to /editMedicine/:id ── */}
          <button
            className="edit-btn-right"
            title="Edit medicine"
            onClick={handleEdit}
          >
            <EditIcon />
          </button>
        </div>

        <div className="adherence-block">
          <div className="adherence-title">Weekly Adherence</div>
          <div className="adherence-dots">
            {["M","T","W","T","F","S","S"].map((day, i) => {
              const taken = i < 4, today = i === 4;
              return (
                <div key={i} className={`adh-dot-wrap ${today ? "today" : ""}`}>
                  <div
                    className={`adh-dot ${taken ? "taken" : today ? "today-dot" : "missed"}`}
                    style={taken ? {
                      background:`linear-gradient(135deg,${FIXED_COLOR_GREEN_START},${FIXED_COLOR_GREEN_END})`,
                      boxShadow:`0 2px 6px ${med.color}55`
                    } : {}}
                  />
                  <span className="adh-day">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="right-divider" />

        <div className="med-visual-card"
          style={{ background:"linear-gradient(145deg,#EFF6FF 0%,#fff 60%)", borderColor:"#BFDBFE" }}>
          <div className="med-visual-blob blob1" style={{ background: FIXED_GRAD_START }} />
          <div className="med-visual-blob blob2" style={{ background: FIXED_GRAD_END }} />
          <div className="med-visual-icon">{med.icon}</div>
          <div className="med-visual-dose" style={{ color: FIXED_COLOR }}>
            <div className="med-visual-name">{med.name}</div>
            <div className="med-visual-bar-wrap">
              <div className="med-visual-bar-track">
                <div className="med-visual-bar-fill"
                  style={{
                    width:`${refillPct}%`,
                    background: isLow ? "#EF4444" : `linear-gradient(90deg,${FIXED_GRAD_START},${FIXED_GRAD_END})`
                  }} />
              </div>
              <span className="med-visual-bar-label" style={{ color: isLow ? "#EF4444" : FIXED_COLOR }}>
                {med.refillLeft}/{med.refillTotal} pills
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}