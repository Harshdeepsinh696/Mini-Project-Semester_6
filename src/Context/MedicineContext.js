import { createContext, useContext, useState } from "react";

const MedicineContext = createContext();

// Shared initial medicines (same as Today.js had hardcoded)
const INITIAL_MEDICINES = [
  {
    id: 1, name: "Aspirin", dose: "500mg", qty: "1 or 1/2 tablet",
    icon: "💊", color: "#2563EB", colorGradStart: "#1A3A6B", colorGradEnd: "#2563EB",
    time: "12:00", ampm: "PM", note: "Take after food", frequency: "Once in Day",
    countdown: "In about 2 hours", status: "pending", refillLeft: 14, refillTotal: 30,
    category: "Pain Relief", sideEffect: "Take with water",
  },
  {
    id: 2, name: "Vitamin D", dose: "1000 IU", qty: "1 capsule",
    icon: "🌿", color: "#16A34A", colorGradStart: "#064E3B", colorGradEnd: "#22C55E",
    time: "08:00", ampm: "AM", note: "Take with breakfast", frequency: "Once in Day",
    countdown: "Taken 2 hours ago", status: "taken", refillLeft: 22, refillTotal: 30,
    category: "Supplement", sideEffect: "Best with food",
  },
  {
    id: 3, name: "Metformin", dose: "850mg", qty: "1 tablet",
    icon: "🔵", color: "#1d55cc", colorGradStart: "#1A3A6B", colorGradEnd: "#3B82F6",
    time: "08:00", ampm: "PM", note: "Take before dinner", frequency: "Twice in Day",
    countdown: "In about 6 hours", status: "pending", refillLeft: 5, refillTotal: 30,
    category: "Diabetes", sideEffect: "Avoid alcohol",
  },
];

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);

  // Called from AddMedicine.js on save
  const addMedicine = (formData) => {
    // Convert AddMedicine form → MedCard-compatible object
    const firstTime = formData.times[0] || "08:00 AM";
    const timeParts = firstTime.split(" ");
    const newMed = {
      id: Date.now(),                                       // unique id
      name:          formData.name,
      dose:          formData.dose ? `${formData.dose}mg` : "—",
      qty:           formData.qty  || "1 tablet",
      icon:          formData.icon,
      color:         formData.color,
      colorGradStart:"#1A3A6B",
      colorGradEnd:  formData.color,
      time:          timeParts[0] || "08:00",
      ampm:          timeParts[1] || "AM",
      note:          formData.note || "",
      frequency:     formData.frequency || "Once in Day",
      countdown:     "Scheduled",
      status:        "pending",
      refillLeft:    parseInt(formData.refillLeft)  || 30,
      refillTotal:   parseInt(formData.refillTotal) || 30,
      category:      formData.category || "Other",
      sideEffect:    formData.sideEffects[0] || "",
      reminderSet:   formData.reminders,
      // extra fields from AddMedicine
      doctor:        formData.doctor   || "",
      meal:          formData.meal     || "",
      priority:      formData.priority || "Medium",
      days:          formData.days     || [],
      allTimes:      formData.times    || [],
    };
    setMedicines(prev => [...prev, newMed]);
  };

  const updateMedicine = (id, changes) =>
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...changes } : m));

  return (
    <MedicineContext.Provider value={{ medicines, addMedicine, updateMedicine, setMedicines }}>
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicines() {
  return useContext(MedicineContext);
}