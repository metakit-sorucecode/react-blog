import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:8080" });

http.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = jwt;
  }
  return config;
});

export default http;
