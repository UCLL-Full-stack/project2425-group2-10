// front-end/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | null;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextProps = {
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextProps['user']>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { user } = response.data;
      setIsAuthenticated(true);
      setUser(user);

      // Save user info to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));

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
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
