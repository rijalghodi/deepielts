"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/api/auth.api";
import { AUTH_CHANGED_KEY } from "@/lib/constants/brand";

type User = { id: string; name: string; email: string; role: string } | null;

const AuthContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  loadUser: () => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  loading: false,
  loadUser: () => Promise.resolve(),
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
        setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      } else {
        setUser(null);
      }
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
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

  return <AuthContext.Provider value={{ user, setUser, loading, loadUser }}>{children}</AuthContext.Provider>;
};
