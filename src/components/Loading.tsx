import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(238, 248, 252, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease forwards;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 48px; height: 48px;
  border: 5px solid #cce4f0;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Text = styled.p`
  margin-top: 16px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
`;

export function LoadingOverlay() {
  return (
    <Overlay>
      <Spinner />
      <Text>Loading...</Text>
    </Overlay>
  );
}
