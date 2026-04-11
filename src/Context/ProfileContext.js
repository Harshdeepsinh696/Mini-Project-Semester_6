// src/Context/ProfileContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name:  "",
    email: "",
    photo: null,
  });

  // ✅ Fetch user data ONCE on app load — fixes navbar photo
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios.get(`https://localhost:7205/api/auth/user/${userId}`)
      .then(res => {
        const data = res.data;
        setProfile({
          name:  data.fullName  || "",
          email: data.email     || "",
          photo: data.photo     || null,
        });
      })
      .catch(err => console.error("ProfileContext fetch error:", err));
  }, []);

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