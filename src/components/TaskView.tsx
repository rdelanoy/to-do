'use client';

import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaEdit, FaStar, FaTrash, FaSave, FaUndo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createTask, deleteTask, updateTask } from '@/store/tasks/task-thunks';
import { Task } from '@/types/types';
import { removeNewTask } from '@/store/tasks/task-slice';
import { removeTaskToColumn } from '@/store/columns/column-slice';

const TaskStyled = styled.div<{ $isNew?: boolean }>`
  background-color: #f4f5f7;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 4px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  border: ${({ $isNew }) => ($isNew ? '2px dashed #bbb' : 'none')};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconRow = styled.div`
  display: flex;
  gap: 12px;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const IconButton = styled.button<{ $active?: boolean; $animate?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? 'gold' : '#555')};
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${pulse} 0.3s ease-in-out;
    `}
  &:hover {
    color: ${({ $active }) => ($active ? 'goldenrod' : '#000')};
  }
`;

const TitleText = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  font-family: 'Red Hat Text', sans-serif;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  flex: 1;
`;

const TitleInput = styled.input`
  font-size: 16px;
  font-weight: 500;
  font-family: 'Red Hat Text', sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 6px 10px;
  width: 100%;
  box-sizing: border-box;
`;

interface Props {
  task: Task;
  onCheckTitle: (title: string) => { exists: boolean; taskId?: string };
}

/* Task view component */
export default function TaskView({ task, onCheckTitle }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  // Local state for edit mode and animations
  const [isEditing, setIsEditing] = useState(task.isNew ?? false);
  const [title, setTitle] = useState(task?.title || '');
  const [animateStar, setAnimateStar] = useState(false);
  const [isFavorite, setIsFavorite] = useState(task?.isFavorite || false);

  // Sync local state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setIsFavorite(task.isFavorite!);
    }
  }, [task?.title, task?.isFavorite]);

  if (!task) {
    return <div>Task not found</div>;
  }

  // Start editing mode
  const handleEditToggle = () => setIsEditing(true);

  // Cancel editing
  const handleCancel = () => {
    if (task.isNew) {
      dispatch(removeNewTask(task.id));
      dispatch(removeTaskToColumn({ columnId: task.id, taskId: task.id }));
    } else {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  // Save changes
  const handleSave = () => {
    if (!onCheckTitle(title).exists) {
      setIsEditing(false);
      if (task.isNew) {
        const newTask: Task = {
          ...task,
          title: title,
        };
        dispatch(createTask({ task: newTask, columnId: task.columnId! }));
      } else {
        dispatch(updateTask({ ...task, title }));
      }
    } else {
      alert('Ya existe una tarea con el mismo nombre');
    }
  };

  // Delete task with confirmation
  const handleDelete = () => {
    if (confirm('Estás seguro de que deseas eliminar esta tarea?')) {
      dispatch(deleteTask(task.id));
    }
  };

  // Toggle favorite state with animation
  const handleToggleFavorite = () => {
    setAnimateStar(true);
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    dispatch(updateTask({ ...task, isFavorite: newFavorite }));
    setTimeout(() => setAnimateStar(false), 300);
  };

  return (
    <TaskStyled $isNew={task.isNew}>
      <HeaderRow>
        <IconButton
          onClick={handleToggleFavorite}
          $active={isFavorite}
          $animate={animateStar}
          title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          style={{ visibility: isEditing ? 'hidden' : 'visible' }}
        >
          <FaStar />
        </IconButton>
        <IconRow>
          {isEditing ? (
            <>
              <IconButton onClick={handleCancel} title="Cancel edit">
                <FaUndo />
              </IconButton>
              <IconButton onClick={handleSave} title="Save changes">
                <FaSave />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleEditToggle} title="Edit task">
                <FaEdit />
              </IconButton>
              <IconButton onClick={handleDelete} title="Delete task">
                <FaTrash />
              </IconButton>
            </>
          )}
        </IconRow>
      </HeaderRow>
      {isEditing ? (
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          maxLength={120}
        />
      ) : (
        <TitleText>{title}</TitleText>
      )}
    </TaskStyled>
  );
}
