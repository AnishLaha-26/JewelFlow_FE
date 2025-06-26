import { useEffect, useState } from 'react';
import { isAuthenticated, getCurrentUser, getAccessToken } from '@/app/services/auth';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  // Add other user properties as needed
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (authStatus) {
        const userData = getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'refresh_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateUser = () => {
    const userData = getCurrentUser();
    setUser(userData);
  };

  return {
    user,
    loading,
    authenticated,
    updateUser,
    isAuthenticated: authenticated,
  };
};
