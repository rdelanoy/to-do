'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/store/auth/auth-thunk';

/* Logout button component */
export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>(); // Redux dispatch
  const router = useRouter(); // Next.js router

  const { loading, error } = useSelector((state: RootState) => state.auth); // Auth loading/error state

  // Handle logout action
  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      router.push('/login'); // Redirect after logout
    } else {
      alert(result.payload || 'Error al cerrar sesión'); // Show error alert
    }
  };

  return (
    <>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
