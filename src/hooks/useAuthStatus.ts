"use client";
import { useAuthContext } from "@/context/AuthContext";

export function useAuthStatus(): boolean | null {
  const { authenticated } = useAuthContext();
  return authenticated;
}
