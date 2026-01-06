import axios from 'axios';

// Axios instance configured for the Laravel API with Sanctum bearer token support
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

// Attach Authorization header if a token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
