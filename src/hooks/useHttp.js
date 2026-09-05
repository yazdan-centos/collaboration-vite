import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getStoredAccessToken } from '../contexts/AuthContext';
import { normalizeApiError } from '../utils/apiError';

const http = axios.create({
  baseURL: '/',
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error);
    if (normalized.status === 401) window.dispatchEvent(new CustomEvent('auth:expired'));
    return Promise.reject(normalized);
  },
);

export default function useHttp() {
  return http;
}

export { http };
