// front-end/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  role: 'user' | 'admin' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextProps = {
  isAuthenticated: false,
  token: null,
  role: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
  
      const { token, role } = response.data;
      setIsAuthenticated(true);
      setToken(token);
      setRole(role);
  
      // Save token and role to localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
  
      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error("Login failed:", error);
  
      if (axios.isAxiosError(error) && error.response) {
        // Log the error response from the server
        console.log("Error response data:", error.response.data);
        alert(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  useEffect(() => {
    // Load token and role from localStorage on initial load
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role') as 'user' | 'admin' | null;

    if (savedToken && savedRole) {
      setIsAuthenticated(true);
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
