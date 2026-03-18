import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'register'

  return (
    <AuthModalContext.Provider value={{ authModal, setAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider');
  return ctx;
};
