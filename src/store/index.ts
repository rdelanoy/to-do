import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth-slice';
import columnsReducer from './columns/column-slice';
import tasksReducer from './tasks/task-slice';

// Configure the Redux store with reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
  },
});

// RootState type for the whole state tree
export type RootState = ReturnType<typeof store.getState>;
// AppDispatch type for dispatch function
export type AppDispatch = typeof store.dispatch;
