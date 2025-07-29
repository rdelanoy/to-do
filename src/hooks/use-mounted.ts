import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if the component is mounted
 * Returns true only after the component has mounted
 */
export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
