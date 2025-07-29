import React from 'react';
import styled from 'styled-components';

const ContainerStyled = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 16px;
  align-items: flex-start;
  overflow-x: auto;
  white-space: nowrap;
`;

type Props = {
  children: React.ReactNode;
};

export default function CardContainer({ children }: Props) {
  // Container for horizontal scrolling cards
  return <ContainerStyled>{children}</ContainerStyled>;
}
