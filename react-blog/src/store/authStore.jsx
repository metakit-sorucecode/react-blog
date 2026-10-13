import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLogin: false,
  jwt: "",
  username: "",
  login: (jwt, username) => {
    localStorage.setItem("jwt", jwt);
    set({ isLogin: true, jwt, username });
  },
  logout: () => set({ isLogin: false, jwt: "", username: "" }),
}));
