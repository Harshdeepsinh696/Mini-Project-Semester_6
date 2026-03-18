// ══════════════════════════════════════════════════════════
//  App.js  |  src/App.js
// ══════════════════════════════════════════════════════════
import { useEffect } from "react";
import {
  BrowserRouter, Routes, Route,
  Navigate, useNavigate, useLocation,
} from "react-router-dom";
import "./App.css";
import { MedicineProvider } from "./Context/MedicineContext";

import LandingPage  from "./LandingPage/LandingPage";
import Today        from "./Today/Today";
import Upcoming     from "./Upcoming/Upcoming";
import History      from "./History/History";
import AddMedicine  from "./Addmedicine/Addmedicine";
import Login        from "./Login-Create/Login";
import Signup       from "./Login-Create/Signup";
import ProfilePage  from "./Profile/ProfilePage";

/** Resets scroll on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function LandingWithLogin() {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage />
      <Login onClose={() => navigate("/")} onSwitchToSignup={() => navigate("/signup")} />
    </>
  );
}

function LandingWithSignup() {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage />
      <Signup onClose={() => navigate("/")} onSwitchToLogin={() => navigate("/login")} />
    </>
  );
}

export default function App() {
  return (
    <MedicineProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/"            element={<LandingPage />} />
          <Route path="/login"       element={<LandingWithLogin />} />
          <Route path="/signup"      element={<LandingWithSignup />} />
          <Route path="/today"       element={<Today />} />
          <Route path="/upcoming"    element={<Upcoming />} />
          <Route path="/history"     element={<History />} />
          <Route path="/addMedicine" element={<AddMedicine />} />
          <Route path="/settings"    element={<Today />} />
          <Route path="/profile"     element={<ProfilePage />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MedicineProvider>
  );
}