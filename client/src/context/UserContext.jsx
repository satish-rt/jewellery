import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get('/users/me');
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('lumiereUser', JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem('userToken');
        localStorage.removeItem('lumiereUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const { data } = await api.post('/users/login', { email: cleanEmail, password: cleanPassword });
    if (!data?.success || !data.user) {
      throw new Error('The login service returned an invalid response.');
    }
    if (data.token) {
      localStorage.setItem('userToken', data.token);
    }
    localStorage.setItem('lumiereUser', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await api.post('/users/logout'); } catch {}
    localStorage.removeItem('userToken');
    localStorage.removeItem('lumiereUser');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};