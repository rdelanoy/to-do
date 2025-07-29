'use client';
import React, { ReactNode } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { useAuth } from '@/hooks/use-auth';
import { Props } from '@/types/types';
import { LoadingOverlay } from './Loading';

// Wrapper to handle authentication state
export default function AuthWrapper({ children }: Props) {
  const isMounted = useMounted();
  const checking = useAuth();

  if (!isMounted) return null;
  if (checking) return <LoadingOverlay />;

  return <>{children}</>;
}
