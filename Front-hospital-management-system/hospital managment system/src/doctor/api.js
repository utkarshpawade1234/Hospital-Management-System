import axios from "axios";
import { getSessionItem, clearSession } from "../utils/sessionStorage";
import { API_BASE_URL } from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});



api.interceptors.request.use((config) => {
  const token = getSessionItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
