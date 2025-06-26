import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens } from './auth';

// Get the API URL from environment variables with a fallback for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Log the API URL to help with debugging (will only show in browser console)
if (typeof window !== 'undefined') {
  console.log('API_URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL, // Remove trailing slash if present
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include JWT authentication token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip token refresh for authentication endpoints (login, register, etc.)
    const isAuthEndpoint = originalRequest.url?.includes('/api/token/') || 
                          originalRequest.url?.includes('/register') || 
                          originalRequest.url?.includes('/login');
    
    // If the error status is 401 and we haven't tried to refresh yet, and it's not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Update the stored token
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access);
        }
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Corresponds to 'POST /api/register' in the architecture diagram.
 * Sends user registration data to the backend.
 * @param userData - An object containing data like firstName, lastName, email, and password.
 */
export const register = (userData: any) => {
  return api.post('api/register/', userData);
};

/**
 * Corresponds to 'POST /api/login' in the architecture diagram.
 * Sends user login credentials to the backend.
 * @param credentials - An object containing email and password.
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/api/token/', {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data;
};

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await api.post('/api/token/refresh/', {
    refresh: refreshToken,
  });
  return response.data;
};

// You can add other API functions here later, such as for 'GET /api/profile'.

export default api;
