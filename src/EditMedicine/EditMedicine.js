// ══════════════════════════════════════════════════════════
//  EditMedicine.js  |  src/EditMedicine/EditMedicine.js
//  Full edit page — connected to backend API
// ══════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../Layout/Layout";
import "./EditMedicine.css";

const BASE_URL = "https://localhost:7205";

const ICONS        = ["💊","🌿","🔵","❤️","🐟","⚡","💉","🧴","🧪","🫧","🌡️","🩺"];
const COLORS       = [
  { hex:"#2563EB", label:"Blue"    },
  { hex:"#16A34A", label:"Green"   },
  { hex:"#DC2626", label:"Red"     },
  { hex:"#D97706", label:"Amber"   },
  { hex:"#7C3AED", label:"Purple"  },
  { hex:"#0E7490", label:"Teal"    },
  { hex:"#DB2777", label:"Pink"    },
  { hex:"#EA580C", label:"Orange"  },
  { hex:"#1A3A6B", label:"Navy"    },
  { hex:"#065F46", label:"Emerald" },
];
const CATEGORIES   = ["Pain Relief","Diabetes","Blood Pressure","Supplement","Antibiotic","Cardiac","Thyroid","Vitamin","Antacid","Other"];
const FORMS        = ["Tablet","Capsule","Syrup","Injection","Drops","Patch","Inhaler","Cream","Powder"];
const FREQS        = ["Once in Day","Twice in Day","3 Times a Day","Every 6 Hours","Every 8 Hours","Weekly","As Needed"];
const MEALS        = ["Before Meal","After Meal","With Meal","Empty Stomach","No Restriction"];
const DAYS         = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const SIDE_EFFECTS = ["Take with water","Avoid alcohol","Avoid grapefruit","Store in fridge","Take with food","Avoid driving","Monitor BP","Keep from sunlight","Take on full stomach","No dairy"];
const PRIORITIES   = ["Critical","High","Medium","Low"];
const TIME_SLOTS   = ["06:00 AM","08:00 AM","10:00 AM","12:00 PM","02:00 PM","04:00 PM","06:00 PM","08:00 PM","10:00 PM"];

const STEPS = [
  { n:1, lbl:"Step 1", name:"Basic Info"    },
  { n:2, lbl:"Step 2", name:"Schedule"      },
  { n:3, lbl:"Step 3", name:"Stock & Alerts"},
];

// ── Utility: "08:00 AM" → "08:00:00" ──
const convertTo24 = (timeStr) => {
  if (!timeStr) return "08:00:00";
  const [time, ampm] = timeStr.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
};

/* ── Step bar ── */
function StepsBar({ step }) {
  return (
    <div className="am-steps">
      {STEPS.map((s, i) => {
        const state     = step > s.n ? "s-done" : step === s.n ? "s-active" : "s-pending";
        const lblColor  = step > s.n ? "#16A34A" : step === s.n ? "#2563EB" : "#9096B0";
        const nameColor = state === "s-pending" ? "#B0BBDA" : "#1A3A6B";
        return (
          <div key={s.n} className="am-step" style={{ flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div className={`am-step-num ${state}`}>{step > s.n ? "✓" : s.n}</div>
            <div className="am-step-txt">
              <div className="am-step-lbl"  style={{ color: lblColor  }}>{s.lbl}</div>
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

/* ── Live preview ── */
function LivePreview({ f }) {
  const refillPct = f.refillTotal > 0 ? Math.round((f.refillLeft / f.refillTotal) * 100) : 0;
  const isLow     = f.refillLeft > 0 && f.refillLeft <= parseInt(f.lowAt || 7);
  const firstTime = f.times?.[0] || null;
  const timeParts = firstTime ? firstTime.split(" ") : null;

  return (
    <div className="am-mini-card">
      <style>{`.am-mini-card::before{background:linear-gradient(180deg,${f.color},${f.color}99);}`}</style>
      <div className="am-mini-top">
        <div className="am-mini-icon-row">
          <div className="am-mini-icon-box"
            style={{ borderColor:`${f.color}55`, background:`linear-gradient(135deg,#fff,${f.color}10)` }}>
            {f.icon}
          </div>
          <div>
            <div className="am-mini-name">
              {f.name || <span style={{ color:"#D1DEFF", fontStyle:"italic" }}>Medicine name</span>}
            </div>
            <div className="am-mini-badge"
              style={{ background:`${f.color}15`, color:f.color, borderColor:`${f.color}40` }}>
              {f.category || "Category"}
            </div>
          </div>
        </div>
        <div className="am-mini-sub">
          {f.dose
            ? <>{f.dose} {f.doseUnit} · {f.qty || "—"} {f.form}</>
            : <span style={{ color:"#D1DEFF", fontStyle:"italic" }}>Dose · Quantity · Form</span>}
        </div>
        <div className="am-mini-refill">
          <div className="am-mini-ring" style={{ borderColor: isLow ? "#EF4444" : f.color }}>
            <span className="am-mini-ring-n" style={{ color: isLow ? "#EF4444" : "#1A3A6B" }}>
              {f.refillLeft || "—"}
            </span>
            <span className="am-mini-ring-l">left</span>
          </div>
          <div>
            <div className="am-mini-rs" style={{ color: isLow ? "#EF4444" : "#1A3A6B" }}>
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
          <span className="am-mini-time"
            style={timeParts ? { backgroundImage:`linear-gradient(135deg,#1A3A6B,${f.color})` } : {}}>
            {timeParts ? timeParts[0] : "00:00"}
          </span>
          <span className="am-mini-ampm">{timeParts ? timeParts[1] : "AM"}</span>
        </div>
        {f.note && (
          <div className="am-mini-note">
            <span className="am-mini-note-bar"
              style={{ background:`linear-gradient(180deg,#1A3A6B,${f.color})` }} />
            {f.note}
          </div>
        )}
        <div className="am-mini-tags">
          {f.frequency && <span className="am-mini-tag freq">{f.frequency}</span>}
          <span className="am-mini-tag pend"><span className="am-pend-dot" />Pending</span>
          {f.sideEffects?.[0] && <span className="am-mini-tag info">ⓘ {f.sideEffects[0]}</span>}
          {f.meal && <span className="am-mini-tag info">🍽 {f.meal}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Summary list ── */
function Summary({ f }) {
  const rows = [
    { k:"Medicine Name", v:f.name },
    { k:"Category",      v:f.category },
    { k:"Form",          v:f.form },
    { k:"Dosage",        v:f.dose ? `${f.dose} ${f.doseUnit}` : null },
    { k:"Frequency",     v:f.frequency },
    { k:"Times",         v:f.times?.length ? f.times.slice(0,2).join(", ")+(f.times.length>2?` +${f.times.length-2}`:"") : null },
    { k:"Meal Timing",   v:f.meal },
    { k:"Stock",         v:f.refillTotal ? `${f.refillLeft||"?"}/${f.refillTotal} pills` : null },
    { k:"Alerts",        v:[f.reminders&&"Reminders",f.missedAlert&&"Missed",f.lowStock&&"Low Stock"].filter(Boolean).join(", ")||null },
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
export default function EditMedicine() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const location  = useLocation();

  const prefill = location.state?.med || {};

  const [step,      setStep]      = useState(1);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [errors,    setErrors]    = useState({});

  const [f, setF] = useState({
    name:           prefill.name           || "",
    icon:           prefill.icon           || "💊",
    color:          prefill.color          || "#2563EB",
    category:       prefill.category       || "Pain Relief",
    form:           prefill.form           || "Tablet",
    dose:           prefill.dose           || "",
    doseUnit:       prefill.doseUnit        || "mg",
    qty:            prefill.qty            || "",
    doctor:         prefill.doctor         || "",
    note:           prefill.note           || "",
    sideEffects:    prefill.sideEffects    || [],
    frequency:      prefill.frequency      || "",
    days:           prefill.days           || [...DAYS],
    times:          prefill.times          || [],
    meal:           prefill.meal           || "",
    startDate:      prefill.startDate      || "",
    endDate:        prefill.endDate        || "",
    refillLeft:     prefill.refillLeft     || "",
    refillTotal:    prefill.refillTotal    || "",
    lowAt:          prefill.lowAt          || "7",
    pharmacy:       prefill.pharmacy       || "",
    expiry:         prefill.expiry         || "",
    reminders:      prefill.reminders      ?? true,
    missedAlert:    prefill.missedAlert    ?? true,
    lowStock:       prefill.lowStock       ?? true,
    refillReminder: prefill.refillReminder ?? true,
    priority:       prefill.priority       || "High",
  });

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const tog = (k, v) => setF(p => ({
    ...p,
    [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v],
  }));

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!f.name.trim())  e.name = "Medicine name is required";
    if (!f.dose)         e.dose = "Dosage is required";
    if (!f.days?.length) e.days = "Select at least one day";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ══════════════════════════════════════
  // SAVE — PUT api/medicine/update/{id}
  // ══════════════════════════════════════
  const handleSave = async () => {
    if (!validate()) { setStep(1); return; }
    setSaving(true);
    setErrors({});

    try {
      const userId = parseInt(localStorage.getItem("userId"));

      const payload = {
        userId:          userId,
        medicineName:    f.name,
        medicineForm:    f.form,
        dosage:          parseFloat(f.dose),
        dosageUnit:      f.doseUnit,
        quantityPerDose: f.qty       || "",
        stockQuantity:   parseInt(f.refillLeft)  || 0,
        prescribedBy:    f.doctor    || "",
        notes:           f.note      || "",

        schedule: {
          mealTiming: f.meal      || "",
          startDate:  f.startDate || new Date().toISOString().split("T")[0],
          endDate:    f.endDate   || null,
        },

        frequency: {
          frequencyType: f.frequency || "Once in Day",
          monday:    f.days.includes("Mon"),
          tuesday:   f.days.includes("Tue"),
          wednesday: f.days.includes("Wed"),
          thursday:  f.days.includes("Thu"),
          friday:    f.days.includes("Fri"),
          saturday:  f.days.includes("Sat"),
          sunday:    f.days.includes("Sun"),
        },

        // ✅ Convert "08:00 AM" → "08:00:00" for SQL TIME column
        doseTimes: (f.times || []).map(convertTo24),

        alerts: {
          doseReminder:    f.reminders,
          missedDoseAlert: f.missedAlert,
          lowStockWarning: f.lowStock,
          refillReminder:  f.refillReminder,
          priorityLevel:   f.priority,
        },
      };

      const res = await axios.put(
        `${BASE_URL}/api/medicine/update/${id}`,
        payload
      );

      if (res.status === 200) {
        setSaved(true);
        setTimeout(() => navigate("/today"), 1200);
      }

    } catch (err) {
      console.error("Update error:", err);
      const msg = err.response?.data?.message || "Failed to save changes. Please try again.";
      setErrors({ submit: `❌ ${msg}` });
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════
  // DELETE — DELETE api/medicine/delete/{id}
  // ══════════════════════════════════════
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${f.name}"?\n\nThis will permanently remove this medicine from your schedule.`)) return;

    setDeleting(true);

    try {
      const res = await axios.delete(`${BASE_URL}/api/medicine/delete/${id}`);

      if (res.status === 200) {
        navigate("/today");
      }

    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || "Failed to delete medicine. Please try again.";
      alert(`❌ ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleDiscard = () => navigate(-1);

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" });

  return (
    <Layout>
      <div className="am-page">

        {/* ── Topbar ── */}
        <div className="am-topbar">
          <div className="am-topbar-left">
            <button className="am-back" onClick={handleDiscard}>←</button>
            <div>
              <div className="am-page-title">
                Edit Medicine ✏️
                {f.name && (
                  <span style={{
                    fontSize:13, fontWeight:700, color:"#2563EB",
                    background:"#EFF6FF", border:"1px solid #BFDBFE",
                    padding:"2px 10px", borderRadius:999, marginLeft:8,
                  }}>{f.name}</span>
                )}
              </div>
              <div className="am-page-sub">Update the details for this medicine</div>
            </div>
          </div>
          <div className="am-date-chip">📅 <b>{dateStr}</b></div>
        </div>

        {/* ── Steps ── */}
        <StepsBar step={step} />

        {/* ── Body ── */}
        <div className="am-body">

          {/* LEFT: Form panels */}
          <div className="am-scroll">

            {/* ══ STEP 1 ══ */}
            {step === 1 && (<>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#EFF6FF" }}>🎨</div>
                  <div className="am-panel-title">Appearance</div>
                  <div className="am-panel-sub">Icon &amp; colour shown on your card</div>
                </div>
                <div className="am-field" style={{ marginBottom:14 }}>
                  <div className="am-lbl">Choose Icon</div>
                  <div className="am-icons">
                    {ICONS.map(ic => (
                      <div key={ic} className={`am-icon-btn ${f.icon===ic?"picked":""}`}
                        onClick={() => set("icon",ic)}>{ic}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#DBEAFE" }}>📋</div>
                  <div className="am-panel-title">Medicine Details</div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Medicine Name <span className="am-req">*</span></div>
                    <input className={`am-input${errors.name?" am-input-err":""}`}
                      placeholder="e.g. Metformin, Aspirin…"
                      value={f.name} onChange={e => set("name",e.target.value)} />
                    {errors.name && <span style={{color:"#EF4444",fontSize:11}}>{errors.name}</span>}
                  </div>

                  <div className="am-field">
                    <div className="am-lbl">Category</div>
                    <select className="am-select" value={f.category}
                      onChange={e => set("category",e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="am-field">
                    <div className="am-lbl">Medicine Form</div>
                    <select className="am-select" value={f.form}
                      onChange={e => set("form",e.target.value)}>
                      {FORMS.map(fm => <option key={fm}>{fm}</option>)}
                    </select>
                  </div>

                  <div className="am-field">
                    <div className="am-lbl">Dosage <span className="am-req">*</span></div>
                    <div style={{ display:"flex", gap:8 }}>
                      <input className={`am-input${errors.dose?" am-input-err":""}`}
                        type="number" min="0" placeholder="e.g. 500"
                        style={{ flex:1 }}
                        value={f.dose} onChange={e => set("dose",e.target.value)} />
                      <select className="am-select" style={{ width:90, flexShrink:0 }}
                        value={f.doseUnit} onChange={e => set("doseUnit",e.target.value)}>
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
                    {errors.dose && <span style={{color:"#EF4444",fontSize:11}}>{errors.dose}</span>}
                  </div>

                  <div className="am-field">
                    <div className="am-lbl">Quantity per Dose</div>
                    <input className="am-input" placeholder="e.g. 1 tablet, 2 capsules"
                      value={f.qty} onChange={e => set("qty",e.target.value)} />
                  </div>

                  <div className="am-field">
                    <div className="am-lbl">Prescribed by / Doctor</div>
                    <input className="am-input" placeholder="e.g. Dr. Sharma"
                      value={f.doctor} onChange={e => set("doctor",e.target.value)} />
                  </div>

                  <div className="am-field" style={{ gridColumn:"span 2" }}>
                    <div className="am-lbl">Notes / Special Instructions</div>
                    <textarea className="am-textarea am-input"
                      placeholder="e.g. Take with warm water, avoid cold drinks…"
                      value={f.note} onChange={e => set("note",e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#DBEAFE" }}>⚠️</div>
                  <div className="am-panel-title">Side Effect Warnings</div>
                  <div className="am-panel-sub">shown as ⓘ tag on card</div>
                </div>
                <div className="am-chips">
                  {SIDE_EFFECTS.map(e => (
                    <div key={e} className={`am-chip ${f.sideEffects?.includes(e)?"on":""}`}
                      onClick={() => tog("sideEffects",e)}>{e}</div>
                  ))}
                </div>
              </div>

            </>)}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (<>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#D1FAE5" }}>📅</div>
                  <div className="am-panel-title">Frequency &amp; Days</div>
                </div>
                <div className="am-field" style={{ marginBottom:14 }}>
                  <div className="am-lbl">How often? <span className="am-req">*</span></div>
                  <select className="am-select" value={f.frequency}
                    onChange={e => set("frequency",e.target.value)}>
                    <option value="">Select frequency</option>
                    {FREQS.map(fr => <option key={fr}>{fr}</option>)}
                  </select>
                </div>
                <div className="am-field">
                  <div className="am-lbl">Days of Week</div>
                  <div className="am-days">
                    {DAYS.map(d => (
                      <button key={d} className={`am-day ${f.days?.includes(d)?"on":""}`}
                        onClick={() => tog("days",d)}>{d.slice(0,2)}</button>
                    ))}
                  </div>
                  {errors.days && <span style={{color:"#EF4444",fontSize:11}}>{errors.days}</span>}
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#DBEAFE" }}>🕐</div>
                  <div className="am-panel-title">Dose Times</div>
                  <div className="am-panel-sub">tap to select</div>
                </div>
                <div className="am-times">
                  {TIME_SLOTS.map(t => (
                    <div key={t} className={`am-tslot ${f.times?.includes(t)?"on":""}`}
                      onClick={() => tog("times",t)}>🕐 {t}</div>
                  ))}
                </div>
                <div className="am-field" style={{ marginTop:14, maxWidth:200 }}>
                  <div className="am-lbl">Custom time</div>
                  <input className="am-input" type="time"
                    onChange={e => {
                      if (!e.target.value) return;
                      const [h,m] = e.target.value.split(":");
                      const hr    = parseInt(h);
                      const ampm  = hr >= 12 ? "PM" : "AM";
                      const hr12  = hr > 12 ? hr-12 : hr===0 ? 12 : hr;
                      const lbl   = `${String(hr12).padStart(2,"0")}:${m} ${ampm}`;
                      if (!f.times?.includes(lbl)) tog("times",lbl);
                    }} />
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#FEF3C7" }}>🍽️</div>
                  <div className="am-panel-title">Meal Timing</div>
                </div>
                <div className="am-chips">
                  {MEALS.map(m => (
                    <div key={m}
                      className={`am-chip ${f.meal===m?(m==="Before Meal"?"on-amb":m==="After Meal"?"on-grn":"on"):""}`}
                      onClick={() => set("meal", f.meal===m?"":m)}>{m}</div>
                  ))}
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#F3E8FF" }}>📆</div>
                  <div className="am-panel-title">Course Duration</div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Start Date</div>
                    <input className="am-input" type="date"
                      value={f.startDate} onChange={e => set("startDate",e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">End Date <span style={{color:"#9096B0",fontSize:10,textTransform:"none"}}>(optional)</span></div>
                    <input className="am-input" type="date"
                      value={f.endDate} onChange={e => set("endDate",e.target.value)} />
                  </div>
                </div>
              </div>

            </>)}

            {/* ══ STEP 3 ══ */}
            {step === 3 && (<>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#DBEAFE" }}>📦</div>
                  <div className="am-panel-title">Stock Management</div>
                </div>
                <div className="am-g3" style={{ marginBottom:12 }}>
                  <div className="am-field">
                    <div className="am-lbl">Pills in Hand <span className="am-req">*</span></div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="0" placeholder="14"
                        value={f.refillLeft} onChange={e => set("refillLeft",e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Pack Size</div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="1" placeholder="30"
                        value={f.refillTotal} onChange={e => set("refillTotal",e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Alert below</div>
                    <div className="am-input-grp">
                      <input className="am-input" type="number" min="1" placeholder="7"
                        value={f.lowAt} onChange={e => set("lowAt",e.target.value)} />
                      <span className="am-unit">pills</span>
                    </div>
                  </div>
                </div>
                <div className="am-g2">
                  <div className="am-field">
                    <div className="am-lbl">Pharmacy / Source</div>
                    <input className="am-input" placeholder="e.g. Apollo Pharmacy"
                      value={f.pharmacy} onChange={e => set("pharmacy",e.target.value)} />
                  </div>
                  <div className="am-field">
                    <div className="am-lbl">Expiry (month)</div>
                    <input className="am-input" type="month"
                      value={f.expiry} onChange={e => set("expiry",e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#FEF9C3" }}>🔔</div>
                  <div className="am-panel-title">Alerts &amp; Reminders</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { k:"reminders",      ico:"🔔", name:"Dose Reminders",    desc:"Notify at each scheduled dose time" },
                    { k:"missedAlert",    ico:"⚠️", name:"Missed Dose Alert", desc:"Alert when a dose is not recorded"  },
                    { k:"lowStock",       ico:"📦", name:"Low Stock Warning",  desc:"Warn when pills fall below threshold"},
                    { k:"refillReminder", ico:"🔄", name:"Refill Reminder",    desc:"Remind to buy more before running out"},
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
                        <input type="checkbox" checked={f[k]} onChange={() => set(k,!f[k])} />
                        <span className="am-sw-track" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="am-panel">
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#FEE2E2" }}>🎯</div>
                  <div className="am-panel-title">Priority Level</div>
                  <div className="am-panel-sub">affects sorting &amp; badge colour</div>
                </div>
                <div className="am-chips">
                  {PRIORITIES.map(p => (
                    <div key={p}
                      className={`am-chip ${f.priority===p?(p==="Critical"?"on-red":p==="High"?"on-amb":"on"):""}`}
                      onClick={() => set("priority",p)}>
                      {p==="Critical"?"🔴":p==="High"?"🟠":p==="Medium"?"🟡":"🟢"} {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Danger Zone ── */}
              <div className="am-panel" style={{ background:"#FFF5F5", border:"1.5px solid #FECDD3" }}>
                <div className="am-panel-hd">
                  <div className="am-panel-icon" style={{ background:"#FEE2E2" }}>🗑️</div>
                  <div className="am-panel-title" style={{ color:"#DC2626" }}>Danger Zone</div>
                </div>
                <p style={{ fontSize:13, color:"#9B1C1C", marginBottom:12, lineHeight:1.5 }}>
                  This will permanently remove <strong>{f.name || "this medicine"}</strong> from
                  your schedule. This action cannot be undone.
                </p>
                <button
                  disabled={deleting}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:7,
                    background: deleting ? "#FEE2E2" : "#fff",
                    border:"1.5px solid #FCA5A5", color:"#DC2626",
                    padding:"9px 16px", borderRadius:9, fontSize:13, fontWeight:700,
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontFamily:"'Sora',sans-serif", transition:"all 0.2s",
                    opacity: deleting ? 0.7 : 1,
                  }}
                  onClick={handleDelete}
                >
                  {deleting ? "⏳ Deleting…" : "🗑️ Delete medicine"}
                </button>
              </div>

            </>)}

          </div>
          {/* end LEFT */}

          {/* RIGHT: Live preview + summary + tips */}
          <div className="am-preview-col">
            <div className="am-preview-panel">
              <div className="am-preview-lbl">Live Preview</div>
              <LivePreview f={f} />
            </div>
            <div className="am-preview-panel">
              <div className="am-preview-lbl">Form Summary</div>
              <Summary f={f} />
            </div>
            <div className="am-tips">
              <div className="am-tips-title">💡 Edit Tips</div>
              <div className="am-tip"><span className="am-tip-dot" />Changes apply to today's and all future schedules.</div>
              <div className="am-tip"><span className="am-tip-dot" />Update stock count when you refill your prescription.</div>
              <div className="am-tip"><span className="am-tip-dot" />Adjust timing if your doctor changed the schedule.</div>
              <div className="am-tip"><span className="am-tip-dot" />Keep side effect warnings up to date for caregivers.</div>
            </div>
          </div>

        </div>
        {/* end body */}

        {/* ── Action bar ── */}
        <div className="am-action-bar">

          {/* ✅ API error message */}
          {errors.submit && (
            <span style={{
              color:"#EF4444", fontSize:12,
              marginRight:"auto", fontWeight:600,
            }}>
              {errors.submit}
            </span>
          )}

          <button className="am-btn cancel" onClick={handleDiscard}>Cancel</button>

          {step > 1 && (
            <button className="am-btn back" onClick={() => setStep(s => s-1)}>← Back</button>
          )}

          {step < 3
            ? <button className="am-btn primary" onClick={() => setStep(s => s+1)}>Next Step →</button>
            : (
              <button
                className="am-btn primary"
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saving ? "⏳ Saving…" : saved ? "✅ Saved!" : "✓ Save Changes"}
              </button>
            )
          }
        </div>

      </div>
    </Layout>
  );
}