"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/api/auth.api";
import { AUTH_CHANGED_KEY } from "@/lib/constants/brand";
import { UserSettings } from "@/server/models/user";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  settings?: UserSettings;
  activeSubscription?: boolean;
} | null;

const AuthContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  loading: false,
  loadUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      const data = res?.data;
      if (data?.id && data?.name && data?.email && data?.role) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          settings: data.settings,
          activeSubscription: data.subscription?.status === "active",
        });
      } else {
        setUser(null);
      }
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state even if API call fails
      setUser(null);
      localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    loadUser();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_CHANGED_KEY) {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadUser]);

  return <AuthContext.Provider value={{ user, setUser, loading, loadUser, logout }}>{children}</AuthContext.Provider>;
};
