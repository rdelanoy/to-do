import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #1a73e8;
  color: #fff;
  padding: 8px;
  radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Red Hat Text', sans-serif;
  border: none;
  border-radius: 8px;
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

// Reusable blue button component
export default function BlueButton(props: Props) {
  return (
    <StyledButton onClick={props.onClick} disabled={props.disabled}>
        {props.icon}
        {props.label}
    </StyledButton>
  );
}
