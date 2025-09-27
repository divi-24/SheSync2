"use client";
import { useEffect, useState } from "react";
import SheSyncLoader from "@/components/SheSyncLoader";

export default function ClientLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SheSyncLoader />;
  }
  return <>{children}</>;
}