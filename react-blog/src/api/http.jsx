import axios from "axios";
import { toast } from "sonner";

const http = axios.create({ baseURL: "http://localhost:8080" });

http.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = jwt;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      toast("서버에 연결할 수 없습니다", { id: "network" });
    } else if (error.config.method !== "get") {
      toast(error.response.data.msg);
    }
    return Promise.reject(error);
  },
);

export default http;
