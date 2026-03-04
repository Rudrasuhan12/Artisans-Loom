'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

export function LayoutClient() {
  const { data: session, status } = useSession();
  const { role, setRole } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/user/role');
          if (response.ok) {
            const { role: userRole } = await response.json();
            setRole(userRole);
            
            if (userRole === 'PENDING') {
              router.push('/onboarding');
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else if (status === 'unauthenticated') {
        setRole('');
      }
    };

    checkUserRole();
  }, [status, session, setRole, router]);

  return null; // This component doesn't render anything
}