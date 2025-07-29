import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #fff;
  color: #1a73e8;
  padding: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Red Hat Text', sans-serif;
  border: none;
  cursor: pointer;  
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

type Props = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function WhiteButton({label, icon, onClick, disabled}: Props) {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
        {icon}
        {label}
    </StyledButton>
  );
}
