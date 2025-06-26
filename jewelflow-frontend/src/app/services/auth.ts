// Token management utilities
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
  
  localStorage.setItem('access_token', accessToken);
  
  if (refreshToken) {
    if (remember) {
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  }
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return !!(getAccessToken() || getRefreshToken());
};

// Decode JWT token to get user info (basic implementation)
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
  clearTokens();
  
  // Clear any other app-specific data
  // localStorage.removeItem('user_preferences');
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Get current user info from token
export const getCurrentUser = () => {
  const token = getAccessToken();
  if (!token) return null;
  
  return decodeToken(token);
};