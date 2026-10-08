'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { PageSkeleton } from './Skeletons';

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !data) {
      toast.error('এই পেজ দেখতে আগে সাইন ইন করুন', { id: 'auth-required' });
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, data, router, pathname]);

  if (isPending || !data) return <PageSkeleton />;
  return <>{children}</>;
}
