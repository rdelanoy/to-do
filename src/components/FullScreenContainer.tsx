import { Props } from '@/types/types';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;
  margin: 0;
  padding: 0;
`;

// Full screen wrapper container
function FullScreenContainer({ children }: Props) {
  return <Container>{children}</Container>;
}

export default FullScreenContainer;
