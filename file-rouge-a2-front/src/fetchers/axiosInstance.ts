import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // adjust this to match your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 