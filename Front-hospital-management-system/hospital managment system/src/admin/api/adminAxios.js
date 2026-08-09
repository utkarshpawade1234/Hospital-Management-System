import axios from 'axios';
import { getSessionItem, clearSession } from '../../utils/sessionStorage';

const adminAxios = axios.create({
  baseURL: 'http://localhost:8080/admin',
});

// Request interceptor — attach JWT token
adminAxios.interceptors.request.use(
  (config) => {
    const token = getSessionItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect on 401 / 403
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      clearSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
