import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const savedJwt = localStorage.getItem("jwt");

export const useAuthStore = create((set) => ({
  isLogin: savedJwt ? true : false,
  jwt: savedJwt ? savedJwt : "",
  username: savedJwt ? jwtDecode(savedJwt.replace("Bearer ", "")).username : "",
  login: (jwt, username) => {
    localStorage.setItem("jwt", jwt);
    set({ isLogin: true, jwt, username });
  },
  logout: () => {
    localStorage.removeItem("jwt");
    set({ isLogin: false, jwt: "", username: "" });
  },
}));
