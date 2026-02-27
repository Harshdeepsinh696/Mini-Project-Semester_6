import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Today    from "./Today/Today";
import Upcoming from "./Upcoming/Upcoming";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/today" replace />} />
        <Route path="/today"    element={<Today />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/history"  element={<Today />} />
        <Route path="/settings" element={<Today />} />
        <Route path="*"         element={<Navigate to="/today" replace />} />
      </Routes>
    </BrowserRouter>
  );
}