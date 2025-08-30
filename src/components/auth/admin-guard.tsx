'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (user?.role !== 'admin') {
    // You can render a loading spinner or null here while redirecting
    return null;
  }

  return <>{children}</>;
}
