import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;

  setRole: (role: string) => void; 
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRoleState] = useState<string | null>(localStorage.getItem('role'));

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRoleState(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRoleState(null);
  };

  const setRole = (newRole: string) => {
    localStorage.setItem('role', newRole);
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};