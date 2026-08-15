import axios from 'axios';
import { getSessionItem, clearSession } from '../../utils/sessionStorage';
import { API_BASE_URL } from '../../config/apiConfig';

const patientAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


// Attach JWT to every request
patientAxios.interceptors.request.use((config) => {
  const token = getSessionItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401/403 → clear session, redirect to /login (only for protected API requests)
patientAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const isAuthEndpoint = err.config?.url?.includes('/auth/');
      const isLoginPage = typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/');
      if (!isAuthEndpoint && !isLoginPage) {
        clearSession();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default patientAxios;
