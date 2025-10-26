import { create } from 'zustand';
import { User } from './types';

interface AppState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateWallet: (mealCredits: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  updateWallet: (mealCredits) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, wallet: { mealCredits } }
        : null,
    })),
}));
