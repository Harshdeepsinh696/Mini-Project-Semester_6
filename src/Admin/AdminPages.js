// src/Admin/AdminPages.js
// Named exports: AdminUsers, AdminMedicines, AdminReminders,
//                AdminReports, AdminNotifications, AdminEmergency,
//                AdminFeedback, AdminSettings
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./Admin.css";

/* ───────── shared data ───────── */
const USERS = [
  { id:1, name:"Tushar Mehta",  email:"tushar@email.com",  phone:"+91 98765 43210", meds:3, adh:92, status:"active",   risk:"low",    joined:"Jan 15, 2025" },
  { id:2, name:"Priya Sharma",  email:"priya@email.com",   phone:"+91 87654 32109", meds:5, adh:85, status:"active",   risk:"medium", joined:"Feb 2, 2025"  },
  { id:3, name:"Rahul Mehta",   email:"rahul@email.com",   phone:"+91 76543 21098", meds:8, adh:61, status:"active",   risk:"high",   joined:"Mar 8, 2025"  },
  { id:4, name:"Anjali Patel",  email:"anjali@email.com",  phone:"+91 65432 10987", meds:2, adh:98, status:"inactive", risk:"low",    joined:"Jan 28, 2025" },
  { id:5, name:"Kiran Desai",   email:"kiran@email.com",   phone:"+91 54321 09876", meds:4, adh:78, status:"active",   risk:"medium", joined:"Apr 1, 2025"  },
  { id:6, name:"Meera Nair",    email:"meera@email.com",   phone:"+91 43210 98765", meds:6, adh:45, status:"active",   risk:"high",   joined:"Feb 20, 2025" },
  { id:7, name:"Suresh Kumar",  email:"suresh@email.com",  phone:"+91 32109 87654", meds:1, adh:95, status:"active",   risk:"low",    joined:"Mar 15, 2025" },
];

/* ═══════════════════════════════════════
   USERS
═══════════════════════════════════════ */
export function AdminUsers() {
  const [users,   setUsers]   = useState(USERS);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [sel,     setSel]     = useState(null);

  const list = users.filter(u => {
    const q = search.toLowerCase();
    const ok = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    if (!ok) return false;
    if (filter==="active")   return u.status==="active";
    if (filter==="inactive") return u.status==="inactive";
    if (filter==="high")     return u.risk==="high";
    return true;
  });

  const RISK = { low:{cl:"ap-bx--g",lbl:"Low"},medium:{cl:"ap-bx--y",lbl:"Medium"},high:{cl:"ap-bx--r",lbl:"High"} };

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">👥 User Management</div>
        <div className="ap-sub">{users.length} registered users</div>
      </div>

      <div className="ap-stats ap-mb2">
        {[
          {icon:"👥",lbl:"Total",   val:users.length,                               bg:"#EFF6FF",ic:"#2563EB"},
          {icon:"✅",lbl:"Active",  val:users.filter(u=>u.status==="active").length, bg:"#F0FFF4",ic:"#22C55E"},
          {icon:"⛔",lbl:"Inactive",val:users.filter(u=>u.status==="inactive").length,bg:"#F5F5F5",ic:"#64748B"},
          {icon:"🚨",lbl:"High Risk",val:users.filter(u=>u.risk==="high").length,   bg:"#FFF5F5",ic:"#EF4444"},
        ].map(s=>(
          <div className="ap-stat" key={s.lbl}>
            <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div className="ap-card-hd">
          <div className="ap-card-title">👥 All Users</div>
          <button className="ap-btn ap-btn--g ap-btn--sm">+ Add User</button>
        </div>
        <div className="ap-card-body ap-mb" style={{paddingBottom:0}}>
          <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
            <div className="ap-search-wrap" style={{flex:1,minWidth:200}}>
              <span className="ap-si"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
              <input className="ap-search" placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {["all","active","inactive","high"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`ap-btn ap-btn--sm ${filter===f?"ap-btn--p":"ap-btn--o"}`}>
                {f==="high"?"High Risk":f[0].toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="ap-tbl-wrap">
          <table className="ap-tbl">
            <thead><tr><th>User</th><th>Phone</th><th>Meds</th><th>Adherence</th><th>Status</th><th>Risk</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map(u=>(
                <tr key={u.id} style={{cursor:"pointer"}} onClick={()=>setSel(u)}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div className="ap-av">{u.name.split(" ").map(n=>n[0]).join("")}</div>
                      <div>
                        <div style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.8rem"}}>{u.name}</div>
                        <div style={{fontSize:"0.66rem",color:"#7A8FB5"}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:"0.76rem"}}>{u.phone}</td>
                  <td style={{fontWeight:800,color:"#2563EB"}}>{u.meds}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div className="ap-prog" style={{width:55}}>
                        <div className="ap-prog-fill" style={{width:`${u.adh}%`,background:u.adh>=80?"#22C55E":u.adh>=60?"#F59E0B":"#EF4444"}}/>
                      </div>
                      <span style={{fontSize:"0.7rem",fontWeight:800,color:u.adh>=80?"#16A34A":u.adh>=60?"#B45309":"#DC2626"}}>{u.adh}%</span>
                    </div>
                  </td>
                  <td><span className={`ap-bx ${u.status==="active"?"ap-bx--g":u.status==="blocked"?"ap-bx--r":"ap-bx--gr"}`}>{u.status}</span></td>
                  <td><span className={`ap-bx ${RISK[u.risk]?.cl}`}>{RISK[u.risk]?.lbl} Risk</span></td>
                  <td style={{fontSize:"0.7rem",color:"#9096B0"}}>{u.joined}</td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:5}}>
                      <button className="ap-btn ap-btn--o ap-btn--sm" onClick={()=>setSel(u)}>View</button>
                      <button className="ap-btn ap-btn--d ap-btn--sm"
                        onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,status:x.status==="active"?"blocked":"active"}:x))}>
                        {u.status==="active"?"Block":"Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <div className="ap-modal-bg" onClick={()=>setSel(null)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()}>
            <div className="ap-modal-hd">
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div className="ap-av" style={{width:44,height:44,fontSize:"0.9rem"}}>{sel.name.split(" ").map(n=>n[0]).join("")}</div>
                <div>
                  <div className="ap-modal-title">{sel.name}</div>
                  <div style={{fontSize:"0.73rem",color:"#7A8FB5"}}>{sel.email}</div>
                </div>
              </div>
              <button className="ap-modal-close" onClick={()=>setSel(null)}>✕</button>
            </div>
            {[["Phone",sel.phone],["Active Medicines",`${sel.meds}`],["Adherence",`${sel.adh}%`],["Status",sel.status],["Risk",sel.risk],["Joined",sel.joined]].map(([k,v])=>(
              <div className="ap-modal-row" key={k}>
                <span className="ap-modal-k">{k}</span>
                <span className="ap-modal-v">{v}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button className="ap-btn ap-btn--p" style={{flex:1}}>✏️ Edit User</button>
              <button className="ap-btn ap-btn--d" onClick={()=>{setUsers(us=>us.filter(x=>x.id!==sel.id));setSel(null);}}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   MEDICINES
═══════════════════════════════════════ */
const MEDS_DATA = [
  { id:1, name:"Aspirin",      type:"Tablet",  dose:"100mg", cat:"Pain Relief",    users:342, status:"active"   },
  { id:2, name:"Metformin",    type:"Tablet",  dose:"500mg", cat:"Diabetes",       users:218, status:"active"   },
  { id:3, name:"Lisinopril",   type:"Tablet",  dose:"10mg",  cat:"Blood Pressure", users:187, status:"active"   },
  { id:4, name:"Atorvastatin", type:"Tablet",  dose:"20mg",  cat:"Cholesterol",    users:156, status:"active"   },
  { id:5, name:"Amoxicillin",  type:"Capsule", dose:"500mg", cat:"Antibiotic",     users:98,  status:"active"   },
  { id:6, name:"Vitamin D3",   type:"Tablet",  dose:"1000IU",cat:"Vitamin",        users:289, status:"active"   },
  { id:7, name:"Cetrizine",    type:"Tablet",  dose:"10mg",  cat:"Allergy",        users:77,  status:"inactive" },
];

export function AdminMedicines() {
  const [meds,    setMeds]    = useState(MEDS_DATA);
  const [search,  setSearch]  = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({name:"",type:"Tablet",dose:"",cat:""});

  const list = meds.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.cat.toLowerCase().includes(search.toLowerCase()));

  const add = () => {
    if (!form.name) return;
    setMeds(ms=>[...ms,{...form,id:Date.now(),users:0,status:"active"}]);
    setForm({name:"",type:"Tablet",dose:"",cat:""});
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">💊 Medicine Management</div>
        <div className="ap-sub">Master medicine catalogue · {meds.length} medicines</div>
      </div>

      <div className="ap-card">
        <div className="ap-card-hd">
          <div className="ap-card-title">💊 All Medicines</div>
          <button className="ap-btn ap-btn--g ap-btn--sm" onClick={()=>setShowAdd(p=>!p)}>
            {showAdd?"✕ Cancel":"+ Add Medicine"}
          </button>
        </div>

        {showAdd && (
          <div style={{padding:"14px 20px",borderBottom:"1.5px solid #D1DEFF",background:"#F8FAFF"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:10,alignItems:"flex-end"}}>
              {[{l:"Name",k:"name",ph:"Medicine name"},{l:"Type",k:"type",ph:"Tablet/Syrup"},{l:"Dosage",k:"dose",ph:"e.g. 500mg"},{l:"Category",k:"cat",ph:"e.g. Diabetes"}].map(f=>(
                <div key={f.k}>
                  <div className="ap-lbl">{f.l}</div>
                  <input className="ap-input" placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <button className="ap-btn ap-btn--p" onClick={add}>Add</button>
            </div>
          </div>
        )}

        <div className="ap-card-body" style={{paddingBottom:0}}>
          <div className="ap-search-wrap ap-mb">
            <span className="ap-si"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
            <input className="ap-search" placeholder="Search medicines…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>

        <div className="ap-tbl-wrap">
          <table className="ap-tbl">
            <thead><tr><th>#</th><th>Medicine</th><th>Type</th><th>Default Dose</th><th>Category</th><th>Users</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((m,i)=>(
                <tr key={m.id}>
                  <td style={{color:"#9096B0",fontSize:"0.7rem"}}>{i+1}</td>
                  <td style={{fontWeight:700,color:"#1A3A6B"}}>💊 {m.name}</td>
                  <td><span className="ap-bx ap-bx--b">{m.type}</span></td>
                  <td style={{fontWeight:700,color:"#2563EB"}}>{m.dose}</td>
                  <td style={{color:"#4A5E8A"}}>{m.cat}</td>
                  <td style={{fontWeight:800,color:"#22C55E"}}>{m.users}</td>
                  <td><span className={`ap-bx ${m.status==="active"?"ap-bx--g":"ap-bx--gr"}`}>{m.status}</span></td>
                  <td>
                    <div style={{display:"flex",gap:5}}>
                      <button className="ap-btn ap-btn--o ap-btn--sm">✏️ Edit</button>
                      <button className="ap-btn ap-btn--d ap-btn--sm" onClick={()=>setMeds(ms=>ms.filter(x=>x.id!==m.id))}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   REMINDERS
═══════════════════════════════════════ */
const REMS = [
  { user:"Tushar Mehta",  med:"Aspirin",      time:"08:00 AM", status:"taken",   date:"Today"     },
  { user:"Priya Sharma",  med:"Metformin",    time:"02:00 PM", status:"pending", date:"Today"     },
  { user:"Rahul Mehta",   med:"Lisinopril",   time:"09:00 PM", status:"missed",  date:"Today"     },
  { user:"Kiran Desai",   med:"Vitamin D3",   time:"07:00 AM", status:"taken",   date:"Today"     },
  { user:"Meera Nair",    med:"Omeprazole",   time:"01:00 PM", status:"missed",  date:"Today"     },
  { user:"Suresh Kumar",  med:"Atorvastatin", time:"10:00 PM", status:"pending", date:"Today"     },
  { user:"Anjali Patel",  med:"Aspirin",      time:"08:00 AM", status:"taken",   date:"Yesterday" },
];

export function AdminReminders() {
  const [filter, setFilter] = useState("all");
  const list = REMS.filter(r=>filter==="all"||r.status===filter);

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">⏰ Reminder Monitoring</div>
        <div className="ap-sub">Track all dose reminders across all users</div>
      </div>

      <div className="ap-stats ap-mb2">
        {[
          {icon:"✅",lbl:"Taken",   val:REMS.filter(r=>r.status==="taken").length,   bg:"#F0FFF4",ic:"#22C55E"},
          {icon:"⏳",lbl:"Pending", val:REMS.filter(r=>r.status==="pending").length, bg:"#FFFBEB",ic:"#F59E0B"},
          {icon:"❌",lbl:"Missed",  val:REMS.filter(r=>r.status==="missed").length,  bg:"#FFF5F5",ic:"#EF4444"},
          {icon:"📊",lbl:"Total",   val:REMS.length,                                  bg:"#EFF6FF",ic:"#2563EB"},
        ].map(s=>(
          <div className="ap-stat" key={s.lbl}>
            <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div className="ap-card-hd">
          <div className="ap-card-title">⏰ All Reminders</div>
          <div style={{display:"flex",gap:6}}>
            {["all","taken","pending","missed"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`ap-btn ap-btn--sm ${filter===f?"ap-btn--p":"ap-btn--o"}`}>
                {f[0].toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="ap-tbl-wrap">
          <table className="ap-tbl">
            <thead><tr><th>User</th><th>Medicine</th><th>Time</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {list.map((r,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:700}}>{r.user}</td>
                  <td>💊 {r.med}</td>
                  <td style={{fontWeight:700,color:"#2563EB"}}>{r.time}</td>
                  <td style={{color:"#9096B0",fontSize:"0.74rem"}}>{r.date}</td>
                  <td>
                    <span className={`ap-bx ${r.status==="taken"?"ap-bx--g":r.status==="pending"?"ap-bx--y":"ap-bx--r"}`}>
                      {r.status==="taken"?"✅ Taken":r.status==="pending"?"⏳ Pending":"❌ Missed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   REPORTS
═══════════════════════════════════════ */
const MONTHLY = [{m:"Jan",v:82},{m:"Feb",v:78},{m:"Mar",v:85},{m:"Apr",v:91},{m:"May",v:87},{m:"Jun",v:89}];

export function AdminReports() {
  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">📈 Reports & Analytics</div>
        <div className="ap-sub">System-wide statistics and trends</div>
      </div>

      <div className="ap-stats ap-mb2">
        {[
          {icon:"📈",lbl:"Avg Adherence",    val:"85.2%",trend:"+2.1%",up:true, bg:"#F0FFF4",ic:"#22C55E"},
          {icon:"👥",lbl:"Active Users",     val:"1,043",trend:"+8%",  up:true, bg:"#EFF6FF",ic:"#2563EB"},
          {icon:"💊",lbl:"Doses Today",      val:"3,218",trend:"+5%",  up:true, bg:"#FFFBEB",ic:"#F59E0B"},
          {icon:"❌",lbl:"Missed This Month",val:"2,341",trend:"-12%", up:false,bg:"#FFF5F5",ic:"#EF4444"},
        ].map(s=>(
          <div className="ap-stat" key={s.lbl}>
            <div className="ap-stat-row">
              <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
              <span className={`ap-trend ${s.up?"ap-trend--up":"ap-trend--down"}`}>{s.trend}</span>
            </div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ap-g2">
        <div className="ap-card">
          <div className="ap-card-hd"><div className="ap-card-title">📊 Monthly Adherence</div></div>
          <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:12}}>
            {MONTHLY.map(m=>(
              <div key={m.m} style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{width:28,fontSize:"0.7rem",color:"#7A8FB5",fontWeight:700}}>{m.m}</span>
                <div style={{flex:1,height:24,background:"#EEF3FF",borderRadius:8,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",width:`${m.v}%`,background:"linear-gradient(90deg,#1A3A6B,#2563EB)",borderRadius:8,display:"flex",alignItems:"center",paddingLeft:10,transition:"width 0.6s"}}>
                    <span style={{fontSize:"0.68rem",color:"#fff",fontWeight:800}}>{m.v}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card-hd"><div className="ap-card-title">🏆 Top Performing Users</div></div>
          <div className="ap-card-body">
            {[{name:"Anjali Patel",pct:98},{name:"Suresh Kumar",pct:95},{name:"Tushar Mehta",pct:92},{name:"Priya Sharma",pct:85},{name:"Kiran Desai",pct:78}].map((u,i)=>(
              <div key={u.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #EEF3FF"}}>
                <span style={{width:22,fontSize:"0.8rem",color:i<3?"#F59E0B":"#9096B0",fontWeight:800}}>
                  {i<3?["🥇","🥈","🥉"][i]:`#${i+1}`}
                </span>
                <div className="ap-av" style={{width:28,height:28,fontSize:"0.62rem"}}>{u.name.split(" ").map(n=>n[0]).join("")}</div>
                <span style={{flex:1,fontSize:"0.8rem",fontWeight:700,color:"#1A3A6B"}}>{u.name}</span>
                <div className="ap-prog" style={{width:80}}>
                  <div className="ap-prog-fill" style={{width:`${u.pct}%`,background:"#22C55E"}}/>
                </div>
                <span style={{fontSize:"0.7rem",fontWeight:800,color:"#16A34A",width:34}}>{u.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════ */
export function AdminNotifications() {
  const [msg,  setMsg]  = useState("");
  const [type, setType] = useState("all");
  const [sent, setSent] = useState([
    {title:"Daily Reminder",  body:"Don't forget your morning medicines!",      type:"all",     time:"Today 9:00 AM",    reach:1248},
    {title:"Refill Alert",    body:"Some users have less than 7 pills left.",   type:"at-risk", time:"Yesterday 3:00 PM",reach:42  },
    {title:"Weekly Report",   body:"Your weekly adherence rate is 85%.",        type:"all",     time:"Mon 8:00 AM",      reach:1248},
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setSent(s=>[{title:"Manual Alert",body:msg,type,time:"Just now",reach:type==="all"?1248:42},...s]);
    setMsg("");
  };

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">🔔 Notification Control</div>
        <div className="ap-sub">Send and manage system-wide notifications</div>
      </div>

      <div className="ap-g2">
        <div className="ap-card">
          <div className="ap-card-hd"><div className="ap-card-title">📢 Send Notification</div></div>
          <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <div className="ap-lbl ap-mb">Send to</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[{v:"all",l:"All Users"},{v:"active",l:"Active Only"},{v:"at-risk",l:"At-Risk Users"}].map(t=>(
                  <button key={t.v} onClick={()=>setType(t.v)}
                    className={`ap-btn ap-btn--sm ${type===t.v?"ap-btn--p":"ap-btn--o"}`}>{t.l}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="ap-lbl ap-mb">Message</div>
              <textarea className="ap-input ap-textarea" placeholder="Type your notification…"
                value={msg} onChange={e=>setMsg(e.target.value)}/>
            </div>
            <div style={{display:"flex",gap:9}}>
              <button className="ap-btn ap-btn--p" onClick={send} style={{flex:1}}>📤 Send Now</button>
              <button className="ap-btn ap-btn--o">📅 Schedule</button>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card-hd"><div className="ap-card-title">📜 Sent History</div></div>
          <div>
            {sent.map((n,i)=>(
              <div key={i} style={{padding:"12px 20px",borderBottom:"1px solid #EEF3FF"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.82rem"}}>{n.title}</span>
                  <span style={{fontSize:"0.66rem",color:"#9096B0"}}>{n.time}</span>
                </div>
                <div style={{fontSize:"0.76rem",color:"#7A8FB5",marginBottom:7}}>{n.body}</div>
                <div style={{display:"flex",gap:7}}>
                  <span className="ap-bx ap-bx--b">👥 {n.reach} reached</span>
                  <span className="ap-bx ap-bx--g">✅ Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   EMERGENCY
═══════════════════════════════════════ */
const EM = [
  {name:"Meera Nair",  meds:6,missed:18,adh:45,flag:"critical",note:"Missed 5 consecutive days"},
  {name:"Rahul Mehta", meds:8,missed:14,adh:61,flag:"high",    note:"Irregular dosing pattern"},
  {name:"Kiran Desai", meds:4,missed:9, adh:78,flag:"medium",  note:"3 consecutive misses"},
];
const EM_CLR = {critical:"#EF4444",high:"#EA580C",medium:"#F59E0B"};
const EM_BG  = {critical:"#FFF5F5",high:"#FFF7ED", medium:"#FFFBEB"};
const EM_BD  = {critical:"#FCA5A5",high:"#FDBA74",  medium:"#FCD34D"};

export function AdminEmergency() {
  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">🚨 Emergency Monitoring</div>
        <div className="ap-sub">Users with frequent missed doses requiring immediate attention</div>
      </div>

      <div className="ap-stats ap-mb2">
        {[
          {icon:"🔴",lbl:"Critical", val:1,bg:"#FFF5F5",ic:"#EF4444"},
          {icon:"🟠",lbl:"High",     val:1,bg:"#FFF7ED",ic:"#EA580C"},
          {icon:"🟡",lbl:"Medium",   val:1,bg:"#FFFBEB",ic:"#F59E0B"},
          {icon:"🚩",lbl:"Flagged",  val:3,bg:"#EFF6FF",ic:"#2563EB"},
        ].map(s=>(
          <div className="ap-stat" key={s.lbl}>
            <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div className="ap-card-hd"><div className="ap-card-title">🚨 Flagged Users</div></div>
        <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:14}}>
          {EM.map(u=>(
            <div key={u.name} style={{display:"flex",alignItems:"center",gap:14,padding:16,borderRadius:14,background:EM_BG[u.flag],border:`1.5px solid ${EM_BD[u.flag]}`}}>
              <div className="ap-av" style={{background:EM_CLR[u.flag],width:42,height:42,fontSize:"0.85rem"}}>
                {u.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,color:"#1A3A6B",fontSize:"0.9rem",marginBottom:3}}>{u.name}</div>
                <div style={{fontSize:"0.74rem",color:"#7A8FB5",marginBottom:7}}>{u.note}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <span className="ap-bx ap-bx--b">{u.meds} medicines</span>
                  <span className="ap-bx ap-bx--r">{u.missed} missed this week</span>
                  <span className="ap-bx ap-bx--y">{u.adh}% adherence</span>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <button className="ap-btn ap-btn--p ap-btn--sm">📩 Contact</button>
                <button className="ap-btn ap-btn--o ap-btn--sm">👁 Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   FEEDBACK
═══════════════════════════════════════ */
const FB = [
  {user:"Tushar Mehta", type:"Bug",     msg:"App crashes when adding a medicine with special characters.", status:"open",      time:"2 hrs ago" },
  {user:"Priya Sharma", type:"Feature", msg:"Please add dark mode support.",                               status:"reviewing",  time:"1 day ago" },
  {user:"Rahul Mehta",  type:"Feedback",msg:"The weekly adherence chart is very motivating!",              status:"resolved",   time:"2 days ago"},
  {user:"Kiran Desai",  type:"Bug",     msg:"Reminders not showing on Android 14.",                        status:"open",       time:"3 days ago"},
  {user:"Meera Nair",   type:"Feature", msg:"Can you add a family sharing feature?",                       status:"reviewing",  time:"4 days ago"},
];

export function AdminFeedback() {
  const [items, setItems] = useState(FB);

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">💬 Feedback & Support</div>
        <div className="ap-sub">User feedback, bug reports and feature requests</div>
      </div>

      <div className="ap-stats ap-mb2">
        {[
          {icon:"🔴",lbl:"Open",      val:items.filter(f=>f.status==="open").length,      bg:"#FFF5F5",ic:"#EF4444"},
          {icon:"🟡",lbl:"Reviewing", val:items.filter(f=>f.status==="reviewing").length, bg:"#FFFBEB",ic:"#F59E0B"},
          {icon:"✅",lbl:"Resolved",  val:items.filter(f=>f.status==="resolved").length,  bg:"#F0FFF4",ic:"#22C55E"},
          {icon:"💬",lbl:"Total",     val:items.length,                                    bg:"#EFF6FF",ic:"#2563EB"},
        ].map(s=>(
          <div className="ap-stat" key={s.lbl}>
            <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div className="ap-card-hd"><div className="ap-card-title">💬 All Feedback</div></div>
        <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:11}}>
          {items.map((f,i)=>(
            <div key={i} style={{padding:14,borderRadius:13,border:"1.5px solid #D1DEFF",background:"#F8FAFF"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div className="ap-av" style={{width:28,height:28,fontSize:"0.6rem"}}>{f.user.split(" ").map(n=>n[0]).join("")}</div>
                  <span style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.82rem"}}>{f.user}</span>
                  <span className={`ap-bx ${f.type==="Bug"?"ap-bx--r":f.type==="Feature"?"ap-bx--b":"ap-bx--g"}`}>{f.type}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span className={`ap-bx ${f.status==="open"?"ap-bx--r":f.status==="reviewing"?"ap-bx--y":"ap-bx--g"}`}>{f.status}</span>
                  <span style={{fontSize:"0.66rem",color:"#9096B0"}}>{f.time}</span>
                </div>
              </div>
              <p style={{fontSize:"0.8rem",color:"#4A5E8A",margin:"0 0 10px"}}>{f.msg}</p>
              <div style={{display:"flex",gap:8}}>
                <button className="ap-btn ap-btn--o ap-btn--sm">💬 Reply</button>
                {f.status!=="resolved" && (
                  <button className="ap-btn ap-btn--g ap-btn--sm"
                    onClick={()=>setItems(it=>it.map((x,j)=>j===i?{...x,status:"resolved"}:x))}>
                    ✅ Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════
   SETTINGS
═══════════════════════════════════════ */
export function AdminSettings() {
  const [s, setS] = useState({
    appName:"MediCare", reminderType:"App", lang:"English",
    maintenance:false, emailAlerts:true, smsAlerts:false, twoFA:true,
  });
  const [pw, setPw] = useState({cur:"",nw:"",cf:""});
  const set = k => v => setS(p=>({...p,[k]:v}));

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">⚙️ Settings Panel</div>
        <div className="ap-sub">App configuration, security and preferences</div>
      </div>

      <div className="ap-g2">
        {/* App config */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="ap-card">
            <div className="ap-card-hd"><div className="ap-card-title">🌐 App Configuration</div></div>
            <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div className="ap-lbl ap-mb">App Name</div>
                <input className="ap-input" value={s.appName} onChange={e=>set("appName")(e.target.value)}/>
              </div>
              <div>
                <div className="ap-lbl ap-mb">Default Reminder Type</div>
                <div style={{display:"flex",gap:8}}>
                  {["App","SMS","Email"].map(t=>(
                    <button key={t} onClick={()=>set("reminderType")(t)}
                      className={`ap-btn ap-btn--sm ${s.reminderType===t?"ap-btn--p":"ap-btn--o"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="ap-lbl ap-mb">Language</div>
                <div style={{display:"flex",gap:8}}>
                  {["English","Hindi","Gujarati"].map(l=>(
                    <button key={l} onClick={()=>set("lang")(l)}
                      className={`ap-btn ap-btn--sm ${s.lang===l?"ap-btn--p":"ap-btn--o"}`}>{l}</button>
                  ))}
                </div>
              </div>
              {[
                {k:"maintenance",lbl:"Maintenance Mode",   sub:"Disable app for all users"},
                {k:"emailAlerts",lbl:"Email Notifications",sub:"Send dose reminders via email"},
                {k:"smsAlerts",  lbl:"SMS Notifications",  sub:"Send dose reminders via SMS"},
              ].map(f=>(
                <div key={f.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:"1px solid #EEF3FF"}}>
                  <div>
                    <div style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.84rem"}}>{f.lbl}</div>
                    <div style={{fontSize:"0.7rem",color:"#9096B0",marginTop:2}}>{f.sub}</div>
                  </div>
                  <label className="ap-toggle">
                    <input type="checkbox" checked={s[f.k]} onChange={e=>set(f.k)(e.target.checked)}/>
                    <span className="ap-toggle-sl"/>
                  </label>
                </div>
              ))}
              <button className="ap-btn ap-btn--p">💾 Save Settings</button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="ap-card">
            <div className="ap-card-hd"><div className="ap-card-title">🔐 Change Admin Password</div></div>
            <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{l:"Current Password",k:"cur",ph:"Enter current"},{l:"New Password",k:"nw",ph:"Create new"},{l:"Confirm New",k:"cf",ph:"Confirm new"}].map(f=>(
                <div key={f.k}>
                  <div className="ap-lbl ap-mb">{f.l}</div>
                  <input type="password" className="ap-input" placeholder={f.ph}
                    value={pw[f.k]} onChange={e=>setPw(p=>({...p,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <button className="ap-btn ap-btn--p">🔒 Update Password</button>
            </div>
          </div>

          <div className="ap-card">
            <div className="ap-card-hd"><div className="ap-card-title">🛡️ Security</div></div>
            <div className="ap-card-body">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.84rem"}}>Two-Factor Authentication</div>
                  <div style={{fontSize:"0.7rem",color:"#9096B0",marginTop:2}}>Require OTP on admin login</div>
                </div>
                <label className="ap-toggle">
                  <input type="checkbox" checked={s.twoFA} onChange={e=>set("twoFA")(e.target.checked)}/>
                  <span className="ap-toggle-sl"/>
                </label>
              </div>
              <span className={`ap-bx ${s.twoFA?"ap-bx--g":"ap-bx--r"}`}>
                {s.twoFA?"✅ 2FA Enabled":"❌ 2FA Disabled"}
              </span>
            </div>
          </div>

          <div style={{background:"#FFF5F5",border:"1.5px solid #FECDD3",borderRadius:14,padding:16}}>
            <div style={{fontWeight:800,color:"#DC2626",marginBottom:6,fontSize:"0.84rem"}}>⚠️ Danger Zone</div>
            <p style={{fontSize:"0.74rem",color:"#9B1C1C",lineHeight:1.5,marginBottom:12}}>
              These actions are irreversible. Proceed with caution.
            </p>
            <div style={{display:"flex",gap:9}}>
              <button className="ap-btn ap-btn--d ap-btn--sm">🗑 Clear All Logs</button>
              <button className="ap-btn ap-btn--d ap-btn--sm">⛔ Block All Users</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}