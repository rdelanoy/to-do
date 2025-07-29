import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/types';
import { createTask, deleteTask, fetchTasks, moveTask, updateTask } from './task-thunks';

interface TaskState {
  tasks: Record<string, Task>;
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    move: boolean;
  };
  error: {
    fetch: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    move: string | null;
  };
}

const initialState: TaskState = {
  tasks: {},
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
    move: false,
  },
  error: {
    fetch: null,
    create: null,
    update: null,
    delete: null,
    move: null,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addNewTask: (state, action: PayloadAction<Task>) => {
      state.tasks[action.payload.id] = action.payload;
    },
    removeNewTask: (state, action: PayloadAction<string>) => {
      delete state.tasks[action.payload];
    },
  },
  extraReducers: (builder) => {
    // FETCH TASKS
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as string;
      });

    // CREATE TASK
    builder
      .addCase(createTask.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading.create = false;
        state.tasks[action.payload.id] = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as string;
      });

    // UPDATE TASK
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading.update = false;
        state.tasks[action.payload.id] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as string;
      });

    // DELETE TASK
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading.delete = false;
        delete state.tasks[action.payload];
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload as string;
      });
  },
});

export const { addNewTask, removeNewTask } = taskSlice.actions;
export default taskSlice.reducer;
