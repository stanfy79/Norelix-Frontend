// src/store/index.ts
import { create } from 'zustand';

interface AppState {
  user: any;
  setUser: (user: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));