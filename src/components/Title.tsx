'use client';

import React from 'react';
import styled from 'styled-components';
import BlueButton from './BlueButton';
import { FaPlus } from 'react-icons/fa';
import { Props } from '@/types/types';

const TitleBox = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.h1`
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 600;
  font-style: normal;
  font-size: 32px;
  line-height: 1.4;
  letter-spacing: 0;
  vertical-align: bottom;
  margin: 0;
  color: #051820;
`;

export default function Title({ children }: Props) {
  return (
    <TitleBox>
      <Label>{children}</Label>
      <BlueButton icon={<FaPlus/>} label="Nuevo Tablero"></BlueButton>
    </TitleBox>
  );
}
