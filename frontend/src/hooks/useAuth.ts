import { useState, useCallback } from "react";
import api from "../lib/api";
import type { User, AuthResponse } from "../types";

function loadUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(loadUser);

  const saveAuth = useCallback((data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      saveAuth(data);
      return data;
    },
    [saveAuth],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { data } = await api.post<AuthResponse>("/auth/register", {
        email,
        password,
        name,
      });
      saveAuth(data);
      return data;
    },
    [saveAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return { user, login, register, logout, isAuthenticated: !!user };
}
