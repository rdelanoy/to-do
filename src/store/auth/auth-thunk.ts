import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';
import { removeToken, getToken } from '@/utils/token-storage';
import { removeUser } from '@/utils/user-storage';
import { LoginResult, UserCredentials } from '@/types/types';

/* --- Thunk: Login user --- */
const loginUser = createAsyncThunk<LoginResult, UserCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      // Send login request
      const response = await api.post('/login', credentials);

      return response.data;
    } catch (error: any) {
      // Handle login error
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

/* --- Thunk: Logout user --- */
const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      // Retrieve token from storage
      const token = getToken();

      // Send logout request
      await api.post('/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear user session data
      removeToken();
      removeUser();

    } catch (error: any) {
      // Handle logout error
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

export { loginUser, logoutUser };
