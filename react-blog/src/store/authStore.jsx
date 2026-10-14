import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLogin: false,
  jwt: "",
  username: "",
  login: (jwt, username) => set({ isLogin: true, jwt, username }),
}));
