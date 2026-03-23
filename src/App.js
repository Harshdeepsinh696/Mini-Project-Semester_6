// src/App.js
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { MedicineProvider } from "./Context/MedicineContext";
import { ProfileProvider }  from "./Context/ProfileContext";

import LandingPage   from "./LandingPage/LandingPage";
import Today         from "./Today/Today";
import Upcoming      from "./Upcoming/Upcoming";
import History       from "./History/History";
import AddMedicine   from "./Addmedicine/Addmedicine";
import Login         from "./Login-Create/Login";
import Signup        from "./Login-Create/Signup";
import ProfilePage   from "./Profile/ProfilePage";
import EditMedicine  from "./EditMedicine/EditMedicine";

/* Admin */
import AdminLogin    from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import {
  AdminUsers, AdminMedicines, AdminReminders,
  AdminReports, AdminNotifications,
  AdminEmergency, AdminFeedback, AdminSettings,
} from "./Admin/AdminPages";

/* ─────────────────────────────────────────────────────────
   Force dark bg IMMEDIATELY — runs before React renders.
   Prevents white flash on first load AND after git pull/reload.
───────────────────────────────────────────────────────── */
const BG = "#0b1120";
document.documentElement.style.background      = BG;
document.documentElement.style.backgroundColor = BG;
document.body.style.background                 = BG;
document.body.style.backgroundColor            = BG;
const rootEl = document.getElementById("root");
if (rootEl) {
  rootEl.style.background      = BG;
  rootEl.style.backgroundColor = BG;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Re-apply bg on every route change
    document.documentElement.style.backgroundColor = BG;
    document.body.style.backgroundColor            = BG;
  }, [pathname]);
  return null;
}

function LandingWithLogin() {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage/>
      <Login onClose={() => navigate("/")} onSwitchToSignup={() => navigate("/signup")}/>
    </>
  );
}

function LandingWithSignup() {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage/>
      <Signup onClose={() => navigate("/")} onSwitchToLogin={() => navigate("/login")}/>
    </>
  );
}

export default function App() {
  // Re-apply after every render as safety net
  useEffect(() => {
    document.documentElement.style.backgroundColor = BG;
    document.body.style.backgroundColor            = BG;
  });

  return (
    <MedicineProvider>
      <ProfileProvider>
        <BrowserRouter>
          <ScrollToTop/>
          <Routes>
            {/* Public */}
            <Route path="/"            element={<LandingPage/>}/>
            <Route path="/login"       element={<LandingWithLogin/>}/>
            <Route path="/signup"      element={<LandingWithSignup/>}/>
            {/* App */}
            <Route path="/today"       element={<Today/>}/>
            <Route path="/upcoming"    element={<Upcoming/>}/>
            <Route path="/history"     element={<History/>}/>
            <Route path="/addMedicine" element={<AddMedicine/>}/>
            <Route path="/settings"    element={<Today/>}/>
            <Route path="/profile"     element={<ProfilePage/>}/>
            <Route path="/editMedicine/:id" element={<EditMedicine/>}/>
            {/* Admin */}
            <Route path="/admin/login"         element={<AdminLogin/>}/>
            <Route path="/admin"               element={<AdminDashboard/>}/>
            <Route path="/admin/users"         element={<AdminUsers/>}/>
            <Route path="/admin/medicines"     element={<AdminMedicines/>}/>
            <Route path="/admin/reminders"     element={<AdminReminders/>}/>
            <Route path="/admin/reports"       element={<AdminReports/>}/>
            <Route path="/admin/notifications" element={<AdminNotifications/>}/>
            <Route path="/admin/emergency"     element={<AdminEmergency/>}/>
            <Route path="/admin/feedback"      element={<AdminFeedback/>}/>
            <Route path="/admin/settings"      element={<AdminSettings/>}/>
            <Route path="*"            element={<Navigate to="/" replace />}/>
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </MedicineProvider>
  );
}