import { useState, useEffect } from 'react';
import { AuthUser } from '../lib/types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('euroserv_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('euroserv_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('euroserv_user');
  };

  return { user, login, logout, loading };
}
