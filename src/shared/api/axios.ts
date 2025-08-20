import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse } from './types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: string; details?: any[] }>) => {
    // Handle auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Show user-friendly error messages
    const errorMessage = error.response?.data?.error || 'Ha ocurrido un error inesperado';
    
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;