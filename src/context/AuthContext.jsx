import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { useToast } from '../hooks/useToast';

const AuthContext = createContext(null);

const STORAGE_KEY = 'payback_token';

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const buildUser = (decoded) => ({
  ...decoded,
  firstName: decoded?.name?.split(' ')[0] || decoded?.email?.split('@')[0] || 'User',
});

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setToken(stored);
        setUser(buildUser(decoded));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = (newToken) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    const decoded = decodeToken(newToken);
    setToken(newToken);
    setUser(decoded ? buildUser(decoded) : null);
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    persist(data.token);
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    persist(data.token);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
