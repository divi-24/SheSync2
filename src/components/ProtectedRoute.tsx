'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '../lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  console.log(checking)
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then(() => { if (mounted) setChecking(false); })
      .catch(() => { if (mounted) router.replace('/login'); })
      .finally(() => { /* no-op */ });
    return () => { mounted = false; };
  }, [router]);

   (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex items-center justify-center">
      <div className="text-lg text-gray-700">Verifying...</div>
    </div>
    );
  return <>{children}</>;
}
