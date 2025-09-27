"use client"
import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuthContext } from "@/context/AuthContext";

const LogoutBtn = ({ onLogout }: { onLogout?: () => void }) => {
  const router = useRouter();
  const { refreshAuth } = useAuthContext();
  return (
    <button
      className="bg-rose-500 text-white rounded-xl px-4 py-2 font-semibold text-base flex items-center gap-1.5 shadow-sm hover:bg-rose-600 transition"
      onClick={async () => {
        await logout();
        await refreshAuth();
        if (onLogout) onLogout();
        router.replace("/login");
      }}
    >
      <LogOut size={20} color="white" /> Logout
    </button>
  );
};

export default LogoutBtn;
