"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_STORAGE_KEY,
  createUserForRole,
  type AuthUser,
  type UserRole,
} from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (role: UserRole) => void;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.role && parsed?.name) {
          setUser(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    (role: UserRole) => {
      persist(createUserForRole(role));
    },
    [persist]
  );

  const demoLogin = useCallback(() => {
    persist(createUserForRole("dchs_operator"));
  }, [persist]);

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isHydrated,
      login,
      demoLogin,
      logout,
    }),
    [user, isHydrated, login, demoLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
