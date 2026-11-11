import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://recallc-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token & timezone
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('recallc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach local timezone for calendar precision
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        config.headers['X-Timezone'] = tz;
      }
    } catch (_) {
      // Fallback
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('recallc_token');
        localStorage.removeItem('recallc_user');
        window.location.href = '/login?session=expired';
      }
    }

    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      errors: error.response?.data?.errors || [],
      statusCode: error.response?.status || 500
    };

    return Promise.reject(customError);
  }
);

export default api;

