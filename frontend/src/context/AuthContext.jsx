import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const BASE_URL = 'https://jumushtap001.pythonanywhere.com';

// All API calls use /api prefix automatically
export const api = axios.create({ baseURL: `${BASE_URL}/api` });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  const applyTheme = useCallback((dark) => {
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', next);
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(darkMode);
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const res = await api.get('/users/profile/');
        setUser(res.data);
      }
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const register = async (phone, name, avatarFile) => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('name', name);
    if (avatarFile) formData.append('avatar', avatarFile);
    const res = await api.post('/users/register/', formData);
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    setUser(res.data.user);
  };

  const login = async (phone) => {
    const res = await api.post('/users/login/', { phone });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.get('/users/profile/');
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      register, login, logout, refreshUser,
      darkMode, toggleTheme,
      BASE_URL,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
