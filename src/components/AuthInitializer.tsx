"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";


interface AuthInitializerProps {
  user: User | null;
  token: string | null;
}

export default function AuthInitializer({ user, token }: AuthInitializerProps) {
  const { setAuth, setToken, logout } = useAuthStore();

  useEffect(() => {
    if (user && token) {
      setAuth(user);
      setToken(token);
    } else {
      logout();
    }
  }, [user, token, setAuth, setToken, logout]);

  return null;
}