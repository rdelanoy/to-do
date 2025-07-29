'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function GlobalTaskLoadingOverlay() {
  const taskLoading = useSelector((state: RootState) => state.tasks.loading);
  const columnLoading = useSelector((state: RootState) => state.columns.loading);
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  

  const isLoading = [
    ...Object.values(taskLoading),
    ...Object.values(columnLoading),
    ...Object.values(authLoading),
  ].some(Boolean);

  if (!isLoading) return null;

  return <LoadingOverlay message="Procesando..." />;
}
