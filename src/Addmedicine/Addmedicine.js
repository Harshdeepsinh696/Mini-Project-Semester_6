// ══════════════════════════════════════════════════════════
//  Addmedicine.jsx  —  updated to match new design system
// ══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { useMedicines } from "../Context/MedicineContext";
import "./Addmedicine.css";
import axios from "axios";

const BASE = "https://localhost:7205";

const ICONS = ["💊", "🌿", "🔵", "❤️", "🐟", "⚡", "💉", "🧴", "🧪", "🫧", "🌡️", "🩺"];
const FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Patch", "Inhaler", "Cream", "Powder"];
const FREQS = ["Once in Day", "Twice in Day", "3 Times a Day", "Every 6 Hours", "Every 8 Hours", "Weekly", "As Needed"];
const MEALS = ["Before Meal", "After Meal", "With Meal", "Empty Stomach", "No Restriction"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SIDE_EFFECTS = ["Take with water", "Avoid alcohol", "Avoid grapefruit", "Store in fridge", "Take with food", "Avoid driving", "Monitor BP", "Keep from sunlight", "Take on full stomach", "No dairy"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const TIME_SLOTS = ["06:00 AM", "08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"];

const STEPS = [
  { n: 1, lbl: "Step 1", name: "Basic Info" },
  { n: 2, lbl: "Step 2", name: "Schedule" },
  { n: 3, lbl: "Step 3", name: "Stock & Alerts" },
];

const INIT = {
  name: "", diseaseName: "", form: "Tablet", dose: "", doseUnit: "mg", qty: "",
  icon: "💊",
  note: "", doctor: "",
  frequency: "", days: [...DAYS], times: [], meal: "",
  startDate: "", endDate: "",
  sideEffects: [],
  refillLeft: "", refillTotal: "", lowAt: "7", expiry: "", pharmacy: "",
  reminders: true, missedAlert: true, lowStock: true, refillReminder: true,
  priority: "High",
};

/* ── Step bar ── */
function StepsBar({ step }) {
  return (
    <div className="am-steps">
      {STEPS.map((s, i) => {
        const state = step > s.n ? "s-done" : step === s.n ? "s-active" : "s-pending";
        const lblColor = step > s.n ? "#16A34A" : step === s.n ? "#4F46E5" : "#94A3B8";
        const nameColor = state === "s-pending" ? "#94A3B8" : "#0F172A";
        return (
          <div key={s.n} className="am-step" style={{ flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div className={`am-step-num ${state}`}>{step > s.n ? "✓" : s.n}</div>
            <div className="am-step-txt">
              <div className="am-step-lbl" style={{ color: lblColor }}>{s.lbl}</div>
              <div className="am-step-name" style={{ color: nameColor }}>{s.name}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`am-step-line ${step > s.n ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Live preview card ── */
function LivePreview({ f, diseaseName }) {
  const refillPct = f.refillTotal > 0 ? Math.round((f.refillLeft / f.refillTotal) * 100) : 0;
  const isLow = f.refillLeft > 0 && f.refillLeft <= parseInt(f.lowAt || 7);
  const firstTime = f.times[0] || null;
  const timeParts = firstTime ? firstTime.split(" ") : null;

  return (
    <div className="am-mini-card">
      <div className="am-mini-top">
        <div className="am-mini-icon-row">
          <div className="am-mini-icon-box">{f.icon}</div>
          <div>
            <div className="am-mini-name">
              {f.name || <span style={{ color: "#CBD5E1", fontStyle: "italic" }}>Medicine name</span>}
            </div>
            <div className="am-mini-badge">
              {diseaseName || "Disease"}
            </div>
          </div>
        </div>
        <div className="am-mini-sub">
          {f.dose
            ? <>{f.dose} {f.doseUnit} · {f.qty || "—"} {f.form}</>
            : <span style={{ color: "#CBD5E1", fontStyle: "italic" }}>Dose · Quantity · Form</span>}
        </div>
        <div className="am-mini-refill">
          <div className="am-mini-ring" style={{ borderColor: isLow ? "#E11D48" : "#4F46E5" }}>
            <span className="am-mini-ring-n" style={{ color: isLow ? "#E11D48" : "#0F172A" }}>
              {f.refillLeft || "—"}
            </span>
            <span className="am-mini-ring-l">left</span>
          </div>
          <div>
            <div className="am-mini-rs" style={{ color: isLow ? "#E11D48" : "#0F172A" }}>
              {isLow ? "⚠ Low stock" : "Refill status"}
            </div>
            <div className="am-mini-rp">{f.refillTotal ? `${refillPct}% remaining` : "—"}</div>
          </div>
        </div>
        <div className="am-mini-btns">
          <div className="am-mini-btn skip">✕ Skip</div>
          <div className="am-mini-btn take">✓ Take</div>
        </div>
      </div>
      <div className="am-mini-bot">
        <div className="am-mini-time-row">
          <span className="am-mini-time">
            {timeParts ? timeParts[0] : "00:00"}
          </span>
          <span className="am-mini-ampm">{timeParts ? timeParts[1] : "AM"}</span>
        </div>
        {f.note && (
          <div className="am-mini-note">
            <span className="am-mini-note-bar" />
            {f.note}
          </div>
        )}
        <div className="am-mini-tags">
          {f.frequency && <span className="am-mini-tag freq">{f.frequency}</span>}
          <span className="am-mini-tag pend"><span className="am-pend-dot" />Pending</span>
          {f.sideEffects[0] && <span className="am-mini-tag info">ⓘ {f.sideEffects[0]}</span>}
          {f.meal && <span className="am-mini-tag info">🍽 {f.meal}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Summary list ── */
function Summary({ f, diseaseName }) {
  const rows = [
    { k: "Medicine Name", v: f.name },
    { k: "Disease", v: diseaseName },
    { k: "Form", v: f.form },
    { k: "Dosage", v: f.dose ? `${f.dose} ${f.doseUnit}` : null },
    { k: "Frequency", v: f.frequency },
    { k: "Times", v: f.times.length ? f.times.slice(0, 2).join(", ") + (f.times.length > 2 ? ` +${f.times.length - 2}` : "") : null },
    { k: "Meal timing", v: f.meal },
    { k: "Stock", v: f.refillTotal ? `${f.refillLeft || "?"}/${f.refillTotal} pills` : null },
    { k: "Alerts", v: [f.reminders && "Reminders", f.missedAlert && "Missed", f.lowStock && "Low Stock"].filter(Boolean).join(", ") || null },
  ];
  return (
    <div className="am-sum-list">
      {rows.map(({ k, v }) => (
        <div key={k} className="am-sum-row">
          <div className={`am-sum-dot ${v ? "filled" : "empty"}`} />
          <div className="am-sum-k">{k}</div>
          <div className={`am-sum-v ${v ? "" : "na"}`}>{v || "Not set"}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function AddMedicine() {
  const navigate = useNavigate();
  const { addMedicine } = useMedicines();

  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);

  const userId = parseInt(localStorage.getItem("userId"));

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const tog = (k, v) => setF(p => ({
    ...p,
    [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v],
  }));

  const convertTo24Hour = (time) => {
    if (!time) return null;
    const [t, mod] = time.split(" ");
    let [h, m] = t.split(":");
    if (mod === "PM" && h !== "12") h = String(+h + 12);
    if (mod === "AM" && h === "12") h = "00";
    return `${h.padStart(2, "0")}:${m}:00`;
  };

  const handleSave = async () => {
    if (!userId) { alert("User not logged in"); return; }
    if (!f.name || !f.dose) {
      alert("Please fill in Name and Dose before saving.");
      return;
    }
    try {
      const data = {
        UserId: userId,
        MedicineName: f.name,
        MedicineForm: f.form || "Tablet",
        Dosage: f.dose || 1,
        DosageUnit: f.doseUnit || "mg",
        QuantityPerDose: f.qty || "1",
        StockQuantity: f.refillLeft || 10,
        PrescribedBy: f.doctor || "",
        Notes: f.note || "",
        DiseaseName: f.diseaseName || "",
        Schedule: {
          MealTiming: f.meal || "After Meal",
          StartDate: f.startDate || new Date().toISOString(),
          EndDate: f.endDate ? f.endDate : (f.startDate || new Date().toISOString()),
        },
        Frequency: {
          FrequencyType: f.frequency || "Once in Day",
          Monday: f.days?.includes("Mon") || false,
          Tuesday: f.days?.includes("Tue") || false,
          Wednesday: f.days?.includes("Wed") || false,
          Thursday: f.days?.includes("Thu") || false,
          Friday: f.days?.includes("Fri") || false,
          Saturday: f.days?.includes("Sat") || false,
          Sunday: f.days?.includes("Sun") || false,
        },
        DoseTimes: f.times && f.times.length > 0
          ? f.times.map(t => convertTo24Hour(t))
          : ["08:00:00"],
        Alerts: {
          DoseReminder: f.reminders ?? true,
          MissedDoseAlert: f.missedAlert ?? true,
          LowStockWarning: f.lowStock ?? true,
          RefillReminder: f.refillReminder ?? true,
          PriorityLevel: f.priority || "High",
        },
      };

      const res = await axios.post(`${BASE}/api/medicine/add`, data);
      console.log("Saved:", res.data);
      addMedicine(f);
      alert("✅ Medicine added successfully");
      navigate("/today");
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err);
      alert("❌ Error saving medicine");
    }
  };

  return (
    <Layout>
      <div className="am-page">

        {/* Topbar */}
        <div className="am-topbar">
          <div className="am-topbar-left">
            <button className="am-back" onClick={() => navigate(-1)}>←</button>
            <div>
              <div className="am-page-title">Add Medicine 💊</div>
              <div className="am-page-sub">Fill in the details to add a new medicine to your schedule</div>
            </div>
          </div>
          <div className="am-date-chip">
            📅 <b>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</b>
          </div>
        </div>

        <StepsBar step={step} />

        <div className="am-body">

          {/* ── LEFT: Form ── */}
          <div className="am-scroll">

            {/* ── STEP 1 ── */}
            {step === 1 && (<>
              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#EEF2FF" }}>🎨</div>
                  <div className="am-panel-title">Appearance</div>
                  <div className="am-panel-sub">Icon shown on your card</div>
                </div>
                <div className="am-field" style={{ marginBottom: 14 }}>
                  <div className="am-lbl">Choose Icon</div>
                  <div className="am-icons">
                    {ICONS.map(ic => (
                      <div key={ic} className={`am-icon-btn ${f.icon === ic ? "picked" : ""}`}
                        onClick={() => set("icon", ic)}>{ic}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#EEF2FF" }}>📋</div>
                  <div className="am-panel-title">Medicine Details</div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Medicine Name <span className="am-req">*</span></div>
                    <input className="am-input"
                      placeholder="e.g. Metformin, Aspirin, Vitamin D…"
                      value={f.name} onChange={e => set("name", e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Disease / Condition</div>
                    <input className="am-input"
                      placeholder="e.g. Type 2 Diabetes, Hypertension…"
                      value={f.diseaseName}
                      onChange={e => set("diseaseName", e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Medicine Form</div>
                    <select className="am-select" value={f.form} onChange={e => set("form", e.target.value)}>
                      {FORMS.map(fm => <option key={fm}>{fm}</option>)}
                    </select>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Dosage <span className="am-req">*</span></div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="am-input" type="number" min="0" placeholder="e.g. 500"
                        style={{ flex: 1 }}
                        value={f.dose} onChange={e => set("dose", e.target.value)} />
                      <select className="am-select" style={{ width: 90, flexShrink: 0 }}
                        value={f.doseUnit} onChange={e => set("doseUnit", e.target.value)}>
                        <optgroup label="Weight">
                          <option value="mg">mg</option>
                          <option value="g">g</option>
                          <option value="mcg">mcg</option>
                          <option value="IU">IU</option>
                        </optgroup>
                        <optgroup label="Volume">
                          <option value="ml">ml</option>
                          <option value="L">L</option>
                          <option value="drops">drops</option>
                        </optgroup>
                        <optgroup label="Other">
                          <option value="%">%</option>
                          <option value="units">units</option>
                          <option value="mmol">mmol</option>
                          <option value="mEq">mEq</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Quantity per Dose</div>
                    <input className="am-input" placeholder="e.g. 1 tablet, 2 capsules"
                      value={f.qty} onChange={e => set("qty", e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Prescribed by / Doctor</div>
                    <input className="am-input" placeholder="e.g. Dr. Sharma"
                      value={f.doctor} onChange={e => set("doctor", e.target.value)} />
                  </div>
                  <div className="am-field" style={{ gridColumn: "span 2" }}>
                    <div className="am-lbl">Notes / Special Instructions</div>
                    <textarea className="am-textarea am-input"
                      placeholder="e.g. Take with warm water, avoid cold drinks…"
                      value={f.note} onChange={e => set("note", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#FFF1F2" }}>⚠️</div>
                  <div className="am-panel-title">Side Effect Warnings</div>
                  <div className="am-panel-sub">shown as ⓘ tag on card</div>
                </div>
                <div className="am-chips">
                  {SIDE_EFFECTS.map(e => (
                    <div key={e} className={`am-chip ${f.sideEffects.includes(e) ? "on" : ""}`}
                      onClick={() => tog("sideEffects", e)}>{e}</div>
                  ))}
                </div>
              </div>
            </>)}

            {/* ── STEP 2 ── */}
            {step === 2 && (<>
              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#F0FDF4" }}>📅</div>
                  <div className="am-panel-title">Frequency &amp; Days</div>
                </div>
                <div className="am-field" style={{ marginBottom: 14 }}>
                  <div className="am-lbl">How often? <span className="am-req">*</span></div>
                  <select className="am-select" value={f.frequency}
                    onChange={e => set("frequency", e.target.value)}>
                    <option value="">Select frequency</option>
                    {FREQS.map(fr => <option key={fr}>{fr}</option>)}
                  </select>
                </div>
                <div className="am-field">
                  <div className="am-lbl">Days of Week</div>
                  <div className="am-days">
                    {DAYS.map(d => (
                      <button key={d} className={`am-day ${f.days.includes(d) ? "on" : ""}`}
                        onClick={() => tog("days", d)}>{d.slice(0, 2)}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#EEF2FF" }}>🕐</div>
                  <div className="am-panel-title">Dose Times</div>
                  <div className="am-panel-sub">tap to select</div>
                </div>
                <div className="am-times">
                  {TIME_SLOTS.map(t => (
                    <div key={t} className={`am-tslot ${f.times.includes(t) ? "on" : ""}`}
                      onClick={() => tog("times", t)}>🕐 {t}</div>
                  ))}
                </div>
                <div className="am-field" style={{ marginTop: 14, maxWidth: 200 }}>
                  <div className="am-lbl">Custom time</div>
                  <input className="am-input" type="time"
                    onChange={e => {
                      if (!e.target.value) return;
                      const [h, m] = e.target.value.split(":");
                      const hr = parseInt(h);
                      const ampm = hr >= 12 ? "PM" : "AM";
                      const hr12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
                      const lbl = `${String(hr12).padStart(2, "0")}:${m} ${ampm}`;
                      if (!f.times.includes(lbl)) tog("times", lbl);
                    }} />
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#FFFBEB" }}>🍽️</div>
                  <div className="am-panel-title">Meal Timing</div>
                </div>
                <div className="am-chips">
                  {MEALS.map(m => (
                    <div key={m}
                      className={`am-chip ${f.meal === m ? (m === "Before Meal" ? "on-amb" : m === "After Meal" ? "on-grn" : "on") : ""}`}
                      onClick={() => set("meal", f.meal === m ? "" : m)}>{m}</div>
                  ))}
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#F3E8FF" }}>📆</div>
                  <div className="am-panel-title">Course Duration</div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Start Date</div>
                    <input className="am-input" type="date"
                      value={f.startDate} onChange={e => set("startDate", e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">End Date <span style={{ color: "#94A3B8", fontSize: 10, textTransform: "none" }}>(optional)</span></div>
                    <input className="am-input" type="date"
                      value={f.endDate} onChange={e => set("endDate", e.target.value)} />
                  </div>
                </div>
              </div>
            </>)}

            {/* ── STEP 3 ── */}
            {step === 3 && (<>
              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#EEF2FF" }}>📦</div>
                  <div className="am-panel-title">Stock Management</div>
                </div>
                <div className="am-g3" style={{ marginBottom: 12 }}>
                  <div className="am-field">
                    <div className="am-lbl">Pills in Hand <span className="am-req">*</span></div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="0" placeholder="14"
                        value={f.refillLeft} onChange={e => set("refillLeft", e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Pack Size</div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="1" placeholder="30"
                        value={f.refillTotal} onChange={e => set("refillTotal", e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Alert below</div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="1" placeholder="7"
                        value={f.lowAt} onChange={e => set("lowAt", e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Pharmacy / Source</div>
                    <input className="am-input" placeholder="e.g. Apollo Pharmacy"
                      value={f.pharmacy} onChange={e => set("pharmacy", e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Expiry (month)</div>
                    <input className="am-input" type="month"
                      value={f.expiry} onChange={e => set("expiry", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#FFFBEB" }}>🔔</div>
                  <div className="am-panel-title">Alerts &amp; Reminders</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { k: "reminders",      ico: "🔔", name: "Dose Reminders",    desc: "Notify at each scheduled dose time" },
                    { k: "missedAlert",    ico: "⚠️", name: "Missed Dose Alert",  desc: "Alert when a dose is not recorded" },
                    { k: "lowStock",       ico: "📦", name: "Low Stock Warning",  desc: "Warn when pills fall below threshold" },
                    { k: "refillReminder", ico: "🔄", name: "Refill Reminder",    desc: "Remind to buy more before running out" },
                  ].map(({ k, ico, name, desc }) => (
                    <div key={k} className="am-toggle-row">
                      <div className="am-toggle-left">
                        <span className="am-toggle-ico">{ico}</span>
                        <div>
                          <div className="am-toggle-name">{name}</div>
                          <div className="am-toggle-desc">{desc}</div>
                        </div>
                      </div>
                      <label className="am-sw">
                        <input type="checkbox" checked={f[k]} onChange={() => set(k, !f[k])} />
                        <span className="am-sw-track" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background: "#FFF1F2" }}>🎯</div>
                  <div className="am-panel-title">Priority Level</div>
                  <div className="am-panel-sub">affects sorting &amp; badge colour</div>
                </div>
                <div className="am-chips">
                  {PRIORITIES.map(p => (
                    <div key={p}
                      className={`am-chip ${f.priority === p ? (p === "Critical" ? "on-red" : p === "High" ? "on-amb" : "on") : ""}`}
                      onClick={() => set("priority", p)}>
                      {p === "Critical" ? "🔴" : p === "High" ? "🟠" : p === "Medium" ? "🟡" : "🟢"} {p}
                    </div>
                  ))}
                </div>
              </div>
            </>)}

          </div>
          {/* end LEFT */}

          {/* RIGHT: Preview */}
          <div className="am-preview-col">
            <div className="am-preview-panel">
              <div className="am-preview-lbl">Live Preview</div>
              <LivePreview f={f} diseaseName={f.diseaseName} />
            </div>
            <div className="am-preview-panel">
              <div className="am-preview-lbl">Form Summary</div>
              <Summary f={f} diseaseName={f.diseaseName} />
            </div>
            <div className="am-tips">
              <div className="am-tips-title">💡 Tips</div>
              <div className="am-tip"><span className="am-tip-dot" />Link a disease so you can track medicines per condition.</div>
              <div className="am-tip"><span className="am-tip-dot" />Set accurate stock so you get timely refill alerts.</div>
              <div className="am-tip"><span className="am-tip-dot" />Enable missed-dose alerts to keep your streak alive.</div>
              <div className="am-tip"><span className="am-tip-dot" />Add side effect warnings so caregivers stay informed.</div>
              <div className="am-tip"><span className="am-tip-dot" />Use the note field for your doctor's special instructions.</div>
            </div>
          </div>

        </div>

        {/* Action bar */}
        <div className="am-action-bar">
          <button className="am-btn cancel" onClick={() => navigate(-1)}>Cancel</button>
          {step > 1 && (
            <button className="am-btn back" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {step < 3
            ? <button className="am-btn primary" onClick={() => setStep(s => s + 1)}>Next Step →</button>
            : <button className="am-btn primary" onClick={handleSave}>✓ Add Medicine</button>
          }
        </div>

      </div>
    </Layout>
  );
}