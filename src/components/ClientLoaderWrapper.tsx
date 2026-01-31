"use client";
import { useEffect, useState } from "react";
import SheSyncLoader from "@/components/SheSyncLoader";

export default function ClientLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Only render after mount to prevent hydration mismatches from state changes
  if (!mounted) {
    return null;
  }

  if (loading) {
    return <SheSyncLoader />;
  }
  return <>{children}</>;
}