import { create } from "zustand";

type AuthState = {
  user: null | { uid:string; email:string | null };
  setUser: (user: AuthState['user']) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({user}),
}));

