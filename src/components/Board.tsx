'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import Title from '@/components/Title';
import CardContainer from '@/components/CardContainer';
import Card from '@/components/Card';
import TaskView from '@/components/TaskView';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateColumns } from '@/store/columns/column-slice';
import { fetchColumns } from '@/store/columns/column-thunks';
import { fetchTasks, moveTask } from '@/store/tasks/task-thunks';
import GlobalTaskLoadingOverlay from '@/components/GlobalTaskLoadingOverlay';
import { findTaskByTitle } from '@/utils/text-functions';

const BoardContainer = styled.main`
  width: 100vw;
  height: calc(100% - 56px);
  flex: 1;
  background-color: #EEF8FC;
  padding: 1rem;
  overflow-y: auto;
  margin: 0;
  padding: 32px 64px 32px 64px;   
`;

export default function Board() {

  const dispatch = useDispatch<AppDispatch>();
  const columns = useSelector((state: RootState) => state.columns.data);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {    
    dispatch(fetchColumns());
    dispatch(fetchTasks());
  }, [dispatch]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;

    if(tasks[draggableId].isNew) return;

    const sourceCol = columns![source.droppableId];
    const destCol = columns![destination.droppableId];
    if (!sourceCol || !destCol) return;

    // If source and destination columns are the same, reorder only
    if (sourceCol.id === destCol.id) {
        return;

    } else {
      // Move task between columns
      const startTaskIds = Array.from(sourceCol.taskIds);
      startTaskIds.splice(source.index, 1);

      const finishTaskIds = Array.from(destCol.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newStartColumn = {
        ...sourceCol,
        taskIds: startTaskIds,
      };

      const newFinishColumn = {
        ...destCol,
        taskIds: finishTaskIds,
      };

      const newColumns = {
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      };

      // Update columns locally
      dispatch(updateColumns(newColumns));
      dispatch(moveTask({ from: newStartColumn.id, to: newFinishColumn.id, taskId: draggableId }));
    }
  };

  const handleCountKeys = (keys: string[]): number => {
    // Count existing tasks by keys
    return keys.filter(key => Object.hasOwn(tasks, key.toString())).length;
  };

  const handleonCheckTitle = (title: string): { exists:boolean } => {
    // Check if a task with the title exists
    return findTaskByTitle(title, tasks);
  };

  return (
    <>
      <GlobalTaskLoadingOverlay />    
      <DragDropContext onDragEnd={onDragEnd}>
        <BoardContainer>        
          <Title>Tareas UX/UI</Title>            
          <CardContainer>
            {Object.values(columns)
              .sort((a, b) => a.index - b.index) // sort columns by index
              .map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Card id={column.id} status={column.status} title={column.title} total={handleCountKeys(column.taskIds)} >
                      {column.taskIds.map((taskId, index) => {
                        const task = tasks![taskId];
                        if (!task) return null;
                        return (
                          <Draggable draggableId={task.id} index={index} key={task.id}>
                            {(provided) => (
                              <div ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <TaskView task={task} onCheckTitle={handleonCheckTitle} />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </Card>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </CardContainer>
        </BoardContainer>
      </DragDropContext>
    </>
  );
}
