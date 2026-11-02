import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, checkBackendHealth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('unigive_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged-in student (Altamash Saifi - Project Lead)
    return {
      id: '11111111-1111-4111-a111-111111111111',
      full_name: 'Altamash Saifi',
      email: 'altamash@college.ac.in',
      department: 'Computer Science & Engineering',
      semester: 5,
      social_handle: '@altamash_dev',
      phone: '+91 98765 43210',
      hostel_block: 'Hostel B, Room 214',
      bio: '5th Sem CSE student passionate about open source and campus sustainability.',
      role: 'STUDENT',
      is_verified: true,
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('unigive_token') || 'demo-jwt-token');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth().then((live) => {
      setBackendStatus(live ? 'online' : 'offline');
    });
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('unigive_user', JSON.stringify(res.user));
    localStorage.setItem('unigive_token', res.token);
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('unigive_user', JSON.stringify(res.user));
    localStorage.setItem('unigive_token', res.token);
    return res;
  };

  const updateProfile = async (profileData) => {
    const updated = await api.updateProfile(token, profileData);
    const merged = { ...user, ...profileData, ...updated };
    setUser(merged);
    localStorage.setItem('unigive_user', JSON.stringify(merged));
    return merged;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unigive_user');
    localStorage.removeItem('unigive_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, backendStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
