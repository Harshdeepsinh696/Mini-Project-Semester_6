import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MedicineProvider } from "./Context/MedicineContext";   // ← ADDED
import Today       from "./Today/Today";
import Upcoming    from "./Upcoming/Upcoming";
import History     from "./History/History";
import AddMedicine from "./Addmedicine/Addmedicine";

export default function App() {
  return (
    <MedicineProvider>                                          {/* ← WRAP HERE */}
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Navigate to="/today" replace />} />
          <Route path="/today"        element={<Today />} />
          <Route path="/upcoming"     element={<Upcoming />} />
          <Route path="/history"      element={<History />} />
          <Route path="/addMedicine"  element={<AddMedicine />} />
          <Route path="/settings"     element={<Today />} />
          <Route path="*"             element={<Navigate to="/today" replace />} />
        </Routes>
      </BrowserRouter>
    </MedicineProvider>
  );
}