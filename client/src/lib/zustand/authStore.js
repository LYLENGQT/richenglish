import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      id: null,
      email: null,
      name: null,
      role: null,
      setUser: (id, name, email, role) => set({ id, name, email, role }),
      clearUser: () => set({ id: null, name: null, email: null, role: null }),
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

export default useAuthStore;
