import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (err.response?.status === 401) {
      window.location.href = "/login?error=unathorized";
    }
    return Promise.reject(err);
  }
);

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login?error=unathorized";
    }
    return Promise.reject(err);
  }
);

export default api;
