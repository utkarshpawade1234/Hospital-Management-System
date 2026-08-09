import axios from 'axios';
import { getSessionItem } from '../../utils/sessionStorage';

const getBackendUrl = () => {
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:8080/doctor`;
};

const doctorAxios = axios.create({
  baseURL: getBackendUrl(),
});

doctorAxios.interceptors.request.use(
  (config) => {
    const token = getSessionItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

doctorAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default doctorAxios;
