import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;

  setRol: (role: string) => void; 
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  setRol: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRolState] = useState<string | null>(localStorage.getItem('role'));

  const login = (newToken: string, newRol: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRol);
    setToken(newToken);
    setRolState(newRol);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRolState(null);
  };

  const setRol = (newRol: string) => {
    localStorage.setItem('role', newRol);
    setRolState(newRol);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, setRol }}>
      {children}
    </AuthContext.Provider>
  );
};