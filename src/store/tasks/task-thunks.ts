import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';
import { ColumnMap, SwitchTaskColumn, Task, TasksMap } from '@/types/types';

// GET all tasks
export const fetchTasks = createAsyncThunk<TasksMap, void>(
  'tasks/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/tasks'); // Fetch all tasks
      return res.data as TasksMap;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);

// POST create a new task
export const createTask = createAsyncThunk<Task, { task: Task; columnId: string }>(
  'tasks/create',
  async (newTask, thunkAPI) => {
    try {
      const res = await api.post('/tasks', newTask); // Create task
      return res.data as Task;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Create failed');
    }
  }
);

// PUT update a task (includes favorite, title, etc.)
export const updateTask = createAsyncThunk<Task, Task>(
  'tasks/update',
  async (task, thunkAPI) => {
    try {
      const res = await api.put(`/tasks/${task.id}`, task); // Update task
      return res.data as Task;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// DELETE remove a task
export const deleteTask = createAsyncThunk<string, string>(
  'tasks/delete',
  async (taskId, thunkAPI) => {
    try {
      await api.delete(`/tasks/${taskId}`); // Delete task by id
      return taskId; // Return deleted task id
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

// Save updated columns in backend (e.g., after drag & drop)
export const moveTask = createAsyncThunk<ColumnMap, SwitchTaskColumn>(
  'tasks/move',
  async (switchTaskColumn, thunkAPI) => {
    try {
      const response = await api.put('/tasks/move', switchTaskColumn); // Move task between columns
      return response.data as ColumnMap;
    } catch (error: any) {
      console.error('Save columns error:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Save columns failed');
    }
  }
);
