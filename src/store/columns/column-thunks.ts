import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';
import { ColumnMap } from '@/types/types';

export const fetchColumns = createAsyncThunk<ColumnMap, void>(
  'columns/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/columns'); // Request columns from API
      return res.data as ColumnMap;          // Return columns data
    } catch (error: any) {
      // Return error message if fetch fails
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);
