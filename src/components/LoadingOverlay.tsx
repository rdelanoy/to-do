import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Spinner = styled.div`
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div`
  margin-top: 12px;
  color: white;
  font-size: 1.1rem;
  text-align: center;
`;

interface Props {
  message?: string;
}

const LoadingOverlay: React.FC<Props> = ({ message = 'Cargando...' }) => (
  <Overlay>
    <div style={{ textAlign: 'center' }}>
      <Spinner />
      <Message>{message}</Message>
    </div>
  </Overlay>
);

export default LoadingOverlay;
