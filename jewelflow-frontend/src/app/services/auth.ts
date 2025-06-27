// Token management utilities
export interface UserData {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'user';
  [key: string]: any;
}

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
};

export const setTokens = (accessToken: string, refreshToken?: string, remember?: boolean) => {
  if (typeof window === 'undefined') return;
  
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('access_token', accessToken);
  
  if (refreshToken) {
    storage.setItem('refresh_token', refreshToken);
  }
};

export const setUserData = (userData: UserData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const userDataStr = localStorage.getItem('userData');
  if (!userDataStr) return null;
  
  try {
    return JSON.parse(userDataStr);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all auth-related data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userData');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Optional: Try to refresh token here
    return false;
  }
  
  return true;
};

// Decode JWT token to get user info
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const logout = () => {
  clearAuthData();
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Get current user info from token or stored data
export const getCurrentUser = (): UserData | null => {
  // First try to get from localStorage
  const userData = getUserData();
  if (userData) return userData;
  
  // Fallback to token data
  const token = getAccessToken();
  if (!token) return null;
  
  const tokenData = decodeToken(token);
  if (!tokenData) return null;
  
  return {
    id: tokenData.user_id || tokenData.sub,
    email: tokenData.email,
    first_name: tokenData.first_name || tokenData.given_name,
    last_name: tokenData.last_name || tokenData.family_name,
    role: tokenData.role || 'user'
  };
};
