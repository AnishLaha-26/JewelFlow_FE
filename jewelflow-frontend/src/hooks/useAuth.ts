import { useEffect, useState } from 'react';
import { isAuthenticated, getCurrentUser, getAccessToken } from '@/app/services/auth';
import { RiSurgicalMaskFill } from 'react-icons/ri';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'user';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const getUserData = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    // First try to get from localStorage
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return null;
    
    // Get user data from localStorage if available
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name || userData.firstName,
          last_name: userData.last_name || userData.lastName,
          role: userData.role || 'user' // Default to 'user' if role not specified
        };
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Fallback to token data
    const tokenData = getCurrentUser();
    if (tokenData) {
      return {
        id: tokenData.user_id || tokenData.sub,
        email: tokenData.email,
        first_name: tokenData.first_name || tokenData.name,
        role: tokenData.role || 'user'
      };
    }
    
    return null;
  };

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (authStatus) {
        const userData = getUserData();
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'refresh_token' || e.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateUser = (userData?: Partial<User>) => {
    if (userData) {
      const currentUser = getUserData() || {};
      const updatedUser = { ...currentUser, ...userData } as User;
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } else {
      const userData = getUserData();
      setUser(userData);
    }
  };

  return {
    user,
    loading,
    authenticated,
    updateUser,
    isAuthenticated: authenticated,
  };
};


