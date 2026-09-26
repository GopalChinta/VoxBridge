import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('voxbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('voxbridge_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('voxbridge_token');
      if (storedToken) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          localStorage.setItem('voxbridge_user', JSON.stringify(userData));
        } catch (error) {
          console.error("Session verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('voxbridge_token', data.access_token);
    localStorage.setItem('voxbridge_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('voxbridge_token', data.access_token);
    localStorage.setItem('voxbridge_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    await authAPI.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
