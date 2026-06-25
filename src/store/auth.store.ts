import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  isGuest?: boolean;
  role: 'USER' | 'ADMIN';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (token, user) => {
    await AsyncStorage.setItem("token", token);
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, user: null });
  },

  restore: async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      set({ isLoading: false });
      return;
    }

    set({ token, isLoading: false });
  },
}));