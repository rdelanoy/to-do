'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useRouter } from 'next/navigation';
import TotpModule from '../wasm/otp/totp.mjs';
import styled from 'styled-components';
import { loginUser } from '@/store/auth/auth-thunk';

/* Styled container for centering content */
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #fff;
`;

/* Styled card wrapper for the form */
const Card = styled.form`
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 32px;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

/* Title style */
const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

/* Input field style */
const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 1rem;
  background: #f9f9f9;
  transition: border-color 0.2s ease;

  &:focus {
    background: #fff;
    border-color: #3b82f6;
  }
`;

/* Button style with disabled state */
const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  background-color: ${({ disabled }) => (disabled ? '#9ca3af' : '#3b82f6')};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#9ca3af' : '#2563eb')};
  }
`;

/* Error message style */
const ErrorMsg = styled.p`
  margin-top: 12px;
  color: #d32f2f;
  font-size: 0.9rem;
`;

/* Main login form component */
export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>(); // Redux dispatch
  const router = useRouter(); // Next.js router

  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [wasm, setWasm] = useState<any>(null); // WASM module instance

  const { loading, error } = useSelector((state: RootState) => state.auth); // Auth loading/error state

  // Lazy load WASM module
  const loadWasmModule = async () => {
    if (!wasm) {
      const instance: any = await TotpModule();
      setWasm(instance);
      return instance;
    }
    return wasm;
  };

  // Generate OTP using WASM function
  const generateOtp = async () => {
    const instance = await loadWasmModule();
    const generateTotp = instance.cwrap('generate_totp', 'number', ['number', 'number']);
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    return generateTotp(timestamp, 8);
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const otp: string = await generateOtp();
    const result = await dispatch(loginUser({ email, password, otp: String(otp) }));

    if (loginUser.fulfilled.match(result)) {
      router.push('/'); // Redirect on success
    } else {
      alert(result.payload || 'Credenciales inválidas'); // Show error alert
    }
  };

  return (
    <Container>
      <Card onSubmit={handleLogin}>
        <Title>Login</Title>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Container>
  );
}
