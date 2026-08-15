import axios from 'axios';
import { getSessionItem } from '../../utils/sessionStorage';
import { API_BASE_URL } from '../../config/apiConfig';

const doctorAxios = axios.create({
  baseURL: `${API_BASE_URL}/doctor`,
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
