import axios from 'axios';

// API origin = deployed backend (e.g. https://your-backend.onrender.com),
// local backend (http://localhost:8000), or empty string for same-origin
// requests (handled by the Vite dev proxy locally).
//
// A trailing "/api" is stripped if VITE_API_URL is set that way, because every
// service call below already includes the /api prefix (e.g. "/api/auth/login").
// Without this, an unset VITE_API_URL used to fall back to baseURL "/api",
// producing broken doubled URLs like "/api/api/auth/login".
const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '');

// Create axios instance
const api = axios.create({
  baseURL: API_ORIGIN,
  timeout: 3000000, // 5 minutes - required for Whisper transcription, summary generation, etc.
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
    }
    return Promise.reject(error);
  }
);

export default api;
