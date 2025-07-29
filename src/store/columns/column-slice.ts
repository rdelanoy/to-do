import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnMap } from '@/types/types';
import { fetchColumns } from './column-thunks';
import { deleteTask, moveTask } from '../tasks/task-thunks';

interface ColumnState {
  data: ColumnMap;
  loading: boolean;
  error: string | null;
}

const initialState: ColumnState = {
  data: {},
  loading: false,
  error: null,
};

const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    updateColumns(state, action: PayloadAction<ColumnMap>) {
      state.data = action.payload; // Update all columns
    },
    assignTaskToColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      const { columnId, taskId } = action.payload;
      const column = state.data[columnId];

      if (column && Array.isArray(column.taskIds)) {
        column.taskIds.push(taskId); // Add task to column
      }
    },
    removeTaskToColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      const { columnId, taskId } = action.payload;
      const column = state.data[columnId];

      if (column && Array.isArray(column.taskIds)) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId); // Remove task from column
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.loading = true;  // Fetch columns started
        state.error = null;    // Clear previous errors
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.loading = false; // Fetch success
        state.data = action.payload; // Set fetched columns
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.loading = false;       // Fetch failed
        state.error = action.payload as string; // Set error message
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.data = action.payload; // Update columns after task move
        console.log(state.data);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;

        // Find column containing the deleted task
        const columnEntry = Object.entries(state.data!).find(([_, column]) =>
          column.taskIds.includes(taskId),
        );

        if (columnEntry) {
          const [columnId, column] = columnEntry;
          state.data![columnId] = {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== taskId), // Remove task from column's taskIds
          };
        }
      });
  },
});

export const { updateColumns, assignTaskToColumn, removeTaskToColumn } = columnSlice.actions;
export default columnSlice.reducer;
