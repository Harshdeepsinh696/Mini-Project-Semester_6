// ══════════════════════════════════════════════════════════
//  ProfileContext.js  |  src/Context/ProfileContext.js
//  Shares profile photo + name across Layout, Dropdown, Page
// ══════════════════════════════════════════════════════════
import { createContext, useContext, useState } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name:   "Tushar Mehta",
    email:  "tushar@email.com",
    photo:  null,          // null = show default icon
  });

  const updatePhoto = (photoUrl) =>
    setProfile(p => ({ ...p, photo: photoUrl }));

  const updateProfile = (fields) =>
    setProfile(p => ({ ...p, ...fields }));

  return (
    <ProfileContext.Provider value={{ profile, updatePhoto, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}