'use client';

import React from 'react';
import styled from 'styled-components';
import WhiteButton from '@/components/WhiteButton';
import { FaPlus } from 'react-icons/fa';
import { DefaultStatusIcon, iconMap } from '@/icons/statusIcons';
import { StatusType } from '@/constants/status';
import { addNewTask } from '@/store/tasks/task-slice';
import { useDispatch } from 'react-redux';
import { assignTaskToColumn } from '@/store/columns/column-slice';
import { Task } from '@/types/types';
import { AppDispatch } from '@/store';

const CardStyled = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const TitleText = styled.h2`
  font-size: 18px;
  font-weight: 600;
  font-family: 'Red Hat Display', sans-serif;
  margin: 0;
`;

const ItemCount = styled.div`
  background-color: #fff;
  padding: 4px 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  font-size: 14px;
  font-weight: 500;
  min-width: 28px;
  text-align: center;
`;

type Props = {
  id: string;
  title: string;
  status: string;
  total: number;
  children?: React.ReactNode;
};

export default function Card({ id, title, status, total, children }: Props) {
  
  const dispatch = useDispatch<AppDispatch>();  
  const Icon = iconMap[status as StatusType] ?? DefaultStatusIcon; // Select icon by status

  const handleAddNewTask = () => {
    // Create a new temporary task
    const newTask: Task = {
       id: `temp-${new Date().toISOString()}`, // Temporary ID
       title: '',
       isNew: true,
       columnId: id    
    };

    // Dispatch actions to add task and assign to column
    dispatch(addNewTask(newTask));
    dispatch(assignTaskToColumn({columnId: id, taskId: newTask.id}));
  };

  return (
    <CardStyled>
      <CardHeader>
        <TitleGroup>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <TitleText>{title}</TitleText>
        </TitleGroup>
        <ItemCount>{total} tareas</ItemCount> {/* Show number of tasks */}
      </CardHeader>
      {children}
      <WhiteButton icon={<FaPlus />} label={'Nueva Tarea'} onClick={handleAddNewTask}></WhiteButton>
    </CardStyled>
  );
}
