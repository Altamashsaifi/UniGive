import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api, checkBackendHealth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('unigive_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Local fallback
    if (!isSupabaseConfigured) {
      return {
        id: '11111111-1111-4111-a111-111111111111',
        full_name: 'Student User',
        email: 'student@college.ac.in',
        department: 'Computer Science & Engineering',
        semester: 5,
        social_handle: '',
        phone: '',
        hostel_block: '',
        bio: '',
        role: 'STUDENT',
        is_verified: true,
      };
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('unigive_token') || (!isSupabaseConfigured ? 'demo-jwt-token' : null));
  const [backendStatus, setBackendStatus] = useState(isSupabaseConfigured ? 'supabase' : 'checking');
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Fetch profile
  const fetchSupabaseProfile = async (authUser) => {
    if (!authUser || !supabase) return null;
    try {
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .toLowerCase()
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

      const isWhitelistedAdmin = Boolean(
        authUser.email && adminEmails.includes(authUser.email.toLowerCase().trim())
      );

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching Supabase profile:', error);
      }

      const profile = data || {};
      const metadata = authUser.user_metadata || {};
      const effectiveRole = isWhitelistedAdmin ? 'ADMIN' : (profile.role || metadata.role || 'STUDENT');

      // Admin sync
      if (isWhitelistedAdmin && profile.role !== 'ADMIN') {
        supabase
          .from('profiles')
          .update({ role: 'ADMIN', is_verified: true, updated_at: new Date().toISOString() })
          .eq('id', authUser.id)
          .then(() => {});
      }

      return {
        id: authUser.id,
        email: authUser.email,
        full_name: profile.full_name || metadata.full_name || authUser.email.split('@')[0],
        department: profile.department || metadata.department || (isWhitelistedAdmin ? 'Campus Administration' : 'Engineering'),
        semester: profile.semester || metadata.semester || 1,
        social_handle: profile.social_handle || metadata.social_handle || '',
        phone: profile.phone || metadata.phone || '',
        hostel_block: profile.hostel_block || metadata.hostel_block || '',
        bio: profile.bio || metadata.bio || '',
        role: effectiveRole,
        is_verified: true,
      };
    } catch (err) {
      console.error('Failed to load user profile from Supabase:', err);
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        department: authUser.user_metadata?.department || 'Engineering',
        semester: authUser.user_metadata?.semester || 1,
      };
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Session init
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await fetchSupabaseProfile(session.user);
          setUser(profile);
          setToken(session.access_token);
          localStorage.setItem('unigive_user', JSON.stringify(profile));
          localStorage.setItem('unigive_token', session.access_token);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('unigive_user');
          localStorage.removeItem('unigive_token');
        }
        setLoading(false);
      });

      // Auth change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await fetchSupabaseProfile(session.user);
          setUser(profile);
          setToken(session.access_token);
          localStorage.setItem('unigive_user', JSON.stringify(profile));
          localStorage.setItem('unigive_token', session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setToken(null);
          localStorage.removeItem('unigive_user');
          localStorage.removeItem('unigive_token');
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local health check
      checkBackendHealth().then((live) => {
        setBackendStatus(live ? 'online' : 'offline');
      });
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const profile = await fetchSupabaseProfile(data.user);
      setUser(profile);
      setToken(data.session.access_token);
      localStorage.setItem('unigive_user', JSON.stringify(profile));
      localStorage.setItem('unigive_token', data.session.access_token);
      return { success: true, user: profile, token: data.session.access_token };
    }

    // Fallback login
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('unigive_user', JSON.stringify(res.user));
    localStorage.setItem('unigive_token', res.token);
    return res;
  };

  const register = async (userData) => {
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    const isWhitelistedAdmin = Boolean(
      userData.email && adminEmails.includes(userData.email.toLowerCase().trim())
    );

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            department: userData.department || (isWhitelistedAdmin ? 'Campus Administration' : 'Engineering'),
            semester: userData.semester || 1,
            social_handle: userData.social_handle || '',
            role: isWhitelistedAdmin ? 'ADMIN' : 'STUDENT',
            is_admin: isWhitelistedAdmin,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check email confirmation requirement
      if (data.user && !data.session) {
        return {
          success: true,
          confirmationRequired: true,
          message: 'Registration successful! Please check your campus email to confirm your account, or sign in.',
          user: data.user,
        };
      }

      const profile = await fetchSupabaseProfile(data.user);
      setUser(profile);
      setToken(data.session?.access_token || null);
      if (profile) localStorage.setItem('unigive_user', JSON.stringify(profile));
      if (data.session?.access_token) localStorage.setItem('unigive_token', data.session.access_token);
      return { success: true, user: profile, token: data.session?.access_token };
    }

    // Fallback registration
    const res = await api.register(userData);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('unigive_user', JSON.stringify(res.user));
    localStorage.setItem('unigive_token', res.token);
    return res;
  };

  const updateProfile = async (profileData) => {
    if (isSupabaseConfigured && supabase && user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          department: profileData.department,
          semester: profileData.semester,
          social_handle: profileData.social_handle,
          phone: profileData.phone,
          hostel_block: profileData.hostel_block,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase profile update warning:', error);
      }

      const merged = { ...user, ...profileData, ...(data || {}) };
      setUser(merged);
      localStorage.setItem('unigive_user', JSON.stringify(merged));
      return merged;
    }

    // Fallback profile update
    const updated = await api.updateProfile(token, profileData);
    const merged = { ...user, ...profileData, ...updated };
    setUser(merged);
    localStorage.setItem('unigive_user', JSON.stringify(merged));
    return merged;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('unigive_user');
    localStorage.removeItem('unigive_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        backendStatus,
        loading,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
