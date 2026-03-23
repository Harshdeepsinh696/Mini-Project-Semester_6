// src/Admin/AdminDashboard.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./Admin.css";

const STATS = [
  { icon:"👥", label:"Total Users",        val:"1,248", trend:"+12%", up:true,  bg:"#EFF6FF", ic:"#2563EB" },
  { icon:"💊", label:"Total Medicines",    val:"3,620", trend:"+5%",  up:true,  bg:"#F0FFF4", ic:"#22C55E" },
  { icon:"⏰", label:"Reminders Today",    val:"8,941", trend:"+18%", up:true,  bg:"#FFFBEB", ic:"#F59E0B" },
  { icon:"❌", label:"Missed Doses Today", val:"142",   trend:"-3%",  up:false, bg:"#FFF5F5", ic:"#EF4444" },
];

const WEEK = [
  { d:"Mon", t:85, m:15 }, { d:"Tue", t:90, m:10 }, { d:"Wed", t:78, m:22 },
  { d:"Thu", t:92, m:8  }, { d:"Fri", t:88, m:12 }, { d:"Sat", t:70, m:30 },
  { d:"Sun", t:65, m:35 },
];

const RECENT = [
  { name:"Tushar Mehta",  email:"tushar@email.com",  meds:3, adh:92, status:"active" },
  { name:"Priya Sharma",  email:"priya@email.com",   meds:5, adh:85, status:"active" },
  { name:"Rahul Mehta",   email:"rahul@email.com",   meds:8, adh:61, status:"active" },
  { name:"Anjali Patel",  email:"anjali@email.com",  meds:2, adh:98, status:"inactive" },
  { name:"Kiran Desai",   email:"kiran@email.com",   meds:4, adh:78, status:"active" },
];

const MISSED_TOP = [
  { name:"Metformin",    n:42, pct:68 }, { name:"Lisinopril",  n:38, pct:61 },
  { name:"Aspirin",      n:29, pct:47 }, { name:"Atorvastatin",n:24, pct:39 },
  { name:"Omeprazole",   n:18, pct:29 },
];

function DonutChart({ pct=85 }) {
  const R=42, C=2*Math.PI*R, dash=(pct/100)*C;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={R} fill="none" stroke="#D1DEFF" strokeWidth="12"/>
      <circle cx="55" cy="55" r={R} fill="none" stroke="#22C55E" strokeWidth="12"
        strokeDasharray={`${dash} ${C-dash}`} strokeLinecap="round"
        transform="rotate(-90 55 55)" style={{transition:"stroke-dasharray 0.6s"}}/>
      <text x="55" y="51" textAnchor="middle" dominantBaseline="middle"
        fill="#1A3A6B" fontSize="17" fontWeight="800" fontFamily="Sora,sans-serif">{pct}%</text>
      <text x="55" y="64" textAnchor="middle" dominantBaseline="middle"
        fill="#7A8FB5" fontSize="8.5" fontWeight="600" fontFamily="Sora,sans-serif">adherence</text>
    </svg>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState("week");

  return (
    <AdminLayout>
      <div className="ap-head ap-mb2">
        <div className="ap-title">📊 Dashboard Overview</div>
        <div className="ap-sub">Welcome back, Admin · {new Date().toDateString()}</div>
      </div>

      {/* Stats */}
      <div className="ap-stats ap-mb2">
        {STATS.map(s => (
          <div className="ap-stat" key={s.label}>
            <div className="ap-stat-row">
              <div className="ap-stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
              <span className={`ap-trend ${s.up?"ap-trend--up":"ap-trend--down"}`}>{s.trend}</span>
            </div>
            <div className="ap-stat-val">{s.val}</div>
            <div className="ap-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="ap-g2 ap-mb2">
        {/* Bar chart */}
        <div className="ap-card">
          <div className="ap-card-hd">
            <div className="ap-card-title">📈 Weekly Adherence</div>
            <div style={{display:"flex",gap:6}}>
              {["week","month"].map(r=>(
                <button key={r} onClick={()=>setRange(r)}
                  className={`ap-btn ap-btn--sm ${range===r?"ap-btn--p":"ap-btn--o"}`}>
                  {r[0].toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:9}}>
            {WEEK.map(w=>(
              <div key={w.d} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{width:28,fontSize:"0.7rem",color:"#7A8FB5",fontWeight:700}}>{w.d}</span>
                <div style={{flex:1,height:13,borderRadius:99,background:"#EEF3FF",overflow:"hidden",display:"flex"}}>
                  <div style={{width:`${w.t}%`,background:"linear-gradient(90deg,#22C55E,#16A34A)",borderRadius:"99px 0 0 99px"}}/>
                  <div style={{width:`${w.m}%`,background:"linear-gradient(90deg,#FCA5A5,#EF4444)",borderRadius:"0 99px 99px 0"}}/>
                </div>
                <span style={{width:34,fontSize:"0.68rem",color:"#22C55E",fontWeight:800,textAlign:"right"}}>{w.t}%</span>
              </div>
            ))}
            <div style={{display:"flex",gap:16,paddingTop:4}}>
              {[["#22C55E","Taken"],["#EF4444","Missed"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.68rem",color:"#4A5E8A",fontWeight:600}}>
                  <div style={{width:9,height:9,borderRadius:3,background:c}}/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="ap-card">
          <div className="ap-card-hd"><div className="ap-card-title">🎯 Today's Overview</div></div>
          <div className="ap-card-body" style={{display:"flex",alignItems:"center",gap:22}}>
            <DonutChart pct={85}/>
            <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
              {[
                {label:"Doses Taken",  val:"7,602", color:"#22C55E"},
                {label:"Doses Missed", val:"1,339", color:"#EF4444"},
                {label:"Pending",      val:"4,218", color:"#F59E0B"},
                {label:"Active Users", val:"1,043", color:"#2563EB"},
              ].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:l.color,flexShrink:0}}/>
                  <span style={{flex:1,fontSize:"0.76rem",color:"#4A5E8A",fontWeight:600}}>{l.label}</span>
                  <span style={{fontSize:"0.8rem",fontWeight:800,color:"#1A3A6B"}}>{l.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="ap-g2">
        {/* Recent users */}
        <div className="ap-card">
          <div className="ap-card-hd">
            <div className="ap-card-title">👥 Recent Users</div>
            <button className="ap-btn ap-btn--o ap-btn--sm" onClick={()=>navigate("/admin/users")}>View all →</button>
          </div>
          <div className="ap-tbl-wrap">
            <table className="ap-tbl">
              <thead><tr><th>User</th><th>Meds</th><th>Adherence</th><th>Status</th></tr></thead>
              <tbody>
                {RECENT.map(u=>(
                  <tr key={u.email}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div className="ap-av">{u.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div>
                          <div style={{fontWeight:700,color:"#1A3A6B",fontSize:"0.8rem"}}>{u.name}</div>
                          <div style={{fontSize:"0.66rem",color:"#7A8FB5"}}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight:800,color:"#2563EB"}}>{u.meds}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div className="ap-prog" style={{width:55}}>
                          <div className="ap-prog-fill" style={{width:`${u.adh}%`,background:u.adh>=80?"#22C55E":u.adh>=60?"#F59E0B":"#EF4444"}}/>
                        </div>
                        <span style={{fontSize:"0.7rem",fontWeight:800,color:u.adh>=80?"#16A34A":u.adh>=60?"#B45309":"#DC2626"}}>{u.adh}%</span>
                      </div>
                    </td>
                    <td><span className={`ap-bx ${u.status==="active"?"ap-bx--g":"ap-bx--gr"}`}>{u.status==="active"?"● Active":"○ Inactive"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top missed */}
        <div className="ap-card">
          <div className="ap-card-hd">
            <div className="ap-card-title">❌ Most Missed Medicines</div>
            <span className="ap-bx ap-bx--y">This week</span>
          </div>
          <div className="ap-card-body" style={{display:"flex",flexDirection:"column",gap:11}}>
            {MISSED_TOP.map((m,i)=>(
              <div key={m.name} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{width:18,fontSize:"0.7rem",color:"#9096B0",fontWeight:700,flexShrink:0}}>#{i+1}</span>
                <span style={{width:100,fontSize:"0.78rem",fontWeight:700,color:"#1A3A6B",flexShrink:0}}>{m.name}</span>
                <div className="ap-prog">
                  <div className="ap-prog-fill" style={{width:`${m.pct}%`,background:"linear-gradient(90deg,#EF4444,#FCA5A5)"}}/>
                </div>
                <span style={{width:26,fontSize:"0.7rem",fontWeight:800,color:"#EF4444",textAlign:"right",flexShrink:0}}>{m.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}