import { getToken } from '@/utils/token-storage';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** 
 * Custom hook to check user authentication status
 * Redirects user based on token presence and current path
 */
export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    const isAuthenticated = !!token;

    if (pathname === '/login') {
      if (isAuthenticated) {
        router.replace('/');
        return;
      }
    }

    if (pathname === '/') {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }
    }

    setChecking(false);
  }, [pathname, router]);

  return checking;
};
