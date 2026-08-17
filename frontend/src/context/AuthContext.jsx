import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const token = localStorage.getItem('access_token');

      if (token && storedUser) {
        setUser(storedUser);
      } else if (token) {
        // Try to fetch profile if token exists but no stored user
        try {
          const profile = await authService.getProfile();
          const userData = {
            ...profile,
            role: profile.role || profile.role_name || 'Learner',
          };
          setUser(userData);
          authService.storeUser(userData);
        } catch (e) {
          // Token might be invalid, clear it
          authService.logout();
        }
      }

      setLoading(false);
    };

    initAuth();

    // Listen for auth changes from other components
    const handleAuthChange = () => {
      const storedUser = authService.getStoredUser();
      const token = localStorage.getItem('access_token');
      if (token && storedUser) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const login = async (email, password, role_name) => {
    const response = await authService.login(email, password, role_name);
    const profile = await authService.getProfile();
    const userData = {
      ...profile,
      role: profile.role || profile.role_name || 'Learner',
    };
    setUser(userData);
    authService.storeUser(userData);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const profile = await authService.getProfile();
    const userDataWithRole = {
      ...profile,
      role: profile.role || profile.role_name || 'Learner',
    };
    setUser(userDataWithRole);
    authService.storeUser(userDataWithRole);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    const userData = {
      ...updated,
      role: updated.role || updated.role_name || 'Learner',
    };
    setUser(userData);
    authService.storeUser(userData);
    return updated;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
