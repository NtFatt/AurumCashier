import { create } from "zustand";

type Shift = "Sáng" | "Trưa" | "Chiều";

interface ShiftStore {
  shift: Shift;
  setShift: (s: Shift) => void;
}

export const useShiftStore = create<ShiftStore>((set) => ({
  shift: "Sáng",
  setShift: (s) => set({ shift: s }),
}));
