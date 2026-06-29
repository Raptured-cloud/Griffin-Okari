import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'session_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);   // true while validating on mount

  // ── On mount: validate existing token with the PHP API ─────────
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }
    fetch('/api/auth.php?action=validate', {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user as User);
          setToken(savedToken);
        } else {
          // Session expired — clear everything
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {
        // PHP server not reachable — keep token, clear user (graceful degradation)
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── LOGIN ───────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      // Throw the server error message so the form can display it
      throw new Error(data.error ?? 'Login failed. Please try again.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user as User);
  }, []);

  // ── REGISTER ────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? 'Registration failed. Please try again.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user as User);
  }, []);

  // ── LOGOUT ──────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (currentToken) {
      // Tell PHP to delete the session row — fire-and-forget (don't block UI)
      fetch('/api/auth.php?action=logout', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {/* ignore network errors on logout */});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
