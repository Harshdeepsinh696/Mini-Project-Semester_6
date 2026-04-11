import { createContext, useContext, useState } from "react";

const NavCountContext = createContext();

export function NavCountProvider({ children }) {
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  return (
    <NavCountContext.Provider value={{ todayCount, setTodayCount, upcomingCount, setUpcomingCount }}>
      {children}
    </NavCountContext.Provider>
  );
}

export const useNavCount = () => useContext(NavCountContext);