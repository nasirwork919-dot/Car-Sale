/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, ApiError, getToken, setToken, getStoredUser, setStoredUser, registerUnauthorizedHandler } from './api';
import { Role } from '../types';

export type BackendRole = 'PERSONAL' | 'BUSINESS' | 'INSURANCE' | 'WORKSHOP' | 'LOGISTICS' | 'GOVERNMENT' | 'POLICE';

export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  country?: string | null;
  city?: string | null;
  role: BackendRole;
  emailVerified: boolean;
  identityVerified: boolean;
  createdAt?: string;
}

export function backendRoleToFrontend(role: BackendRole | undefined | null): Exclude<Role, 'guest'> {
  switch (role) {
    case 'PERSONAL':
      return 'personal';
    case 'BUSINESS':
      return 'business';
    case 'INSURANCE':
      return 'insurance';
    case 'WORKSHOP':
      return 'workshop';
    case 'LOGISTICS':
      return 'logistics';
    case 'GOVERNMENT':
      return 'government';
    case 'POLICE':
      return 'police';
    default:
      return 'personal';
  }
}

export function frontendRoleToBackend(role: Exclude<Role, 'guest'>): BackendRole {
  switch (role) {
    case 'personal':
      return 'PERSONAL';
    case 'business':
      return 'BUSINESS';
    case 'insurance':
      return 'INSURANCE';
    case 'workshop':
      return 'WORKSHOP';
    case 'logistics':
      return 'LOGISTICS';
    case 'government':
      return 'GOVERNMENT';
    case 'police':
      return 'POLICE';
    default:
      return 'PERSONAL';
  }
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextValue {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<BackendUser>;
  register: (payload: RegisterPayload) => Promise<BackendUser>;
  logout: () => void;
  refreshMe: () => Promise<BackendUser | null>;
  completeProfile: (payload: Record<string, unknown>) => Promise<BackendUser>;
  selectRole: (role: BackendRole, extra?: Record<string, unknown>) => Promise<{ pending: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(() => getStoredUser<BackendUser>());
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((newToken: string, newUser: BackendUser) => {
    setToken(newToken);
    setStoredUser(newUser);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const clearLocalSession = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearLocalSession();
      window.dispatchEvent(new CustomEvent('navigate-page', { detail: 'home' }));
    });
  }, [clearLocalSession]);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const existingToken = getToken();
      if (!existingToken) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get<BackendUser>('/auth/me');
        if (!cancelled) {
          setStoredUser(me);
          setUser(me);
        }
      } catch {
        if (!cancelled) clearLocalSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, [clearLocalSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const res = await api.post<{ token: string; user: BackendUser }>('/auth/login', { email, password });
        applySession(res.token, res.user);
        return res.user;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.';
        setError(message);
        throw err;
      }
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setError(null);
      try {
        const res = await api.post<{ token: string; user: BackendUser }>('/auth/register', payload);
        applySession(res.token, res.user);
        return res.user;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Unable to create your account. Please try again.';
        setError(message);
        throw err;
      }
    },
    [applySession],
  );

  const logout = useCallback(() => {
    clearLocalSession();
  }, [clearLocalSession]);

  const refreshMe = useCallback(async () => {
    if (!getToken()) return null;
    try {
      const me = await api.get<BackendUser>('/auth/me');
      setStoredUser(me);
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  const completeProfile = useCallback(async (payload: Record<string, unknown>) => {
    setError(null);
    try {
      const updated = await api.put<BackendUser>('/auth/complete-profile', payload);
      setStoredUser(updated);
      setUser(updated);
      return updated;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to complete your profile.';
      setError(message);
      throw err;
    }
  }, []);

  const selectRole = useCallback(async (role: BackendRole, extra?: Record<string, unknown>) => {
    setError(null);
    try {
      const res = await api.put<{ success: boolean; message: string; pendingRole: string }>('/auth/select-role', {
        role,
        ...extra,
      });
      return { pending: true, message: res.message };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to update your role.';
      setError(message);
      throw err;
    }
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    error,
    login,
    register,
    logout,
    refreshMe,
    completeProfile,
    selectRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
