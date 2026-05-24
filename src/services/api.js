import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Guard localStorage access — only available in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('[api] Token from localStorage:', token ? token.slice(0, 20) + '...' : 'null');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the full response so callers can use response.data as expected
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout. Please try again.',
        code: 'TIMEOUT',
        status: 408,
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      });
    }

    const message = 
      error.response?.data?.message || 
      error.response?.data?.error?.message || 
      error.response?.data?.error ||
      'An error occurred';

    console.error('[api] Response error:', error.response?.status, error.response?.data);
    return Promise.reject({
      message,
      code: error.response?.data?.error?.code || error.response?.data?.code,
      details: error.response?.data?.error?.details || error.response?.data?.details,
      status: error.response?.status,
    });
  }
);

export default api;
