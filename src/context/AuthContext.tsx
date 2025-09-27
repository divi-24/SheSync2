"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated } from "../lib/auth";

interface AuthContextType {
  authenticated: boolean | null;
  setAuthenticated: (auth: boolean) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const refreshAuth = async () => {
    const result = await isAuthenticated();
    setAuthenticated(result);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
