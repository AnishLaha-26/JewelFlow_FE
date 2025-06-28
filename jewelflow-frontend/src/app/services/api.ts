import axios from 'axios';
import { getAccessToken, getRefreshToken, clearAuthData } from './auth';

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
        clearAuthData();
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
 * Login user with email and password
 * @param credentials User credentials
 * @returns Object containing tokens and user data
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  // First get the authentication tokens
  const authResponse = await api.post('/api/token/', {
    email: credentials.email,
    password: credentials.password,
  });
  
  // Then get the user profile
  const profileResponse = await api.get('/api/users/me/', {
    headers: {
      'Authorization': `Bearer ${authResponse.data.access}`
    }
  });
  
  // Return combined data
  return {
    ...authResponse.data,
    user: profileResponse.data
  };
};

/**
 * Get current user profile
 * @returns User profile data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me/');
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

//Product Categories API
export const productCategoryApi = {
  //Get all product categories 
  getAll: async () => {
    const response = await api.get('/api/products/categories/');
    return response.data;
  },

  //Create a new product category
  create:async (data: {name: string; description?: string}) => {
    const response = await api.post('/api/products/categories/', data);
    return response.data;
  },

  //Update a product category
  update:async (id: string, data: {name: string; description?: string}) => {
    const response = await api.put(`/api/products/categories/${id}/`, data);
    return response.data;
  },

  //Delete a product category
  delete:async (id: string) => {
    await api.delete(`/api/products/categories/${id}/`);
  },

  //Bulk delete product categories
  bulkDelete:async (ids: string[]) => {
    await api.delete(`/api/products/categories/bulk/`, { data: { ids } });
  },

  // Toggle active status
  toggleStatus: async (id: number, isActive: boolean) => {
    const response = await api.patch(`/api/products/categories/${id}/`, { is_active: isActive });
    return response.data;
  },
}


// You can add other API functions here later, such as for 'GET /api/profile'.

export default api;
