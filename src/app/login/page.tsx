'use client';

import AuthWrapper from '@/components/AuthWrapper';
import LoginForm from '@/components/LoginForm';
import { ReduxProvider } from '@/providers/ReduxProvider';

// Login page component
export default function LoginPage() {
  return (
    // Protect page with auth wrapper
    <AuthWrapper>
      {/* Provide Redux store to components */}
      <ReduxProvider>
        <LoginForm />
      </ReduxProvider>
    </AuthWrapper>
  );
}
