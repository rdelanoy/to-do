import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken, saveToken } from '@/utils/token-storage';
import { getUser, saveUser } from '@/utils/user-storage';
import { AuthState, LoginResult } from '@/types/types';
import { loginUser, logoutUser } from './auth-thunk';

const tokenFromStorage = getToken();
const userFromStorage  = getUser();

const initialState: AuthState = {
  user: userFromStorage!,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;            // Start login loading
        state.error = null;              // Clear previous errors
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResult>) => {
        loginUserFulfilled(state, action); // Handle successful login
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        loginUserRejected(state, action);  // Handle failed login
      })
      .addCase(logoutUser.pending, (state) => {
        logoutUserPending(state);           // Start logout loading
      })
      .addCase(logoutUser.fulfilled, (state) => {
        logoutUserFulfilled(state);         // Handle successful logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        logoutUserRejected(state, action);  // Handle failed logout
      });
  },
});

function logoutUserRejected(state: AuthState, action: PayloadAction<string | undefined>) {
  state.loading = false;                  // Stop loading on logout failure
  state.error = action.payload || 'Logout failed';  // Set logout error message
}

function logoutUserFulfilled(state: AuthState) {
  state.loading = false;                  // Stop loading on logout success
  state.token = null;                    // Clear token on logout
  state.isAuthenticated = false;         // Set authenticated to false
  state.error = null;                    // Clear errors
}

function logoutUserPending(state: AuthState) {
  state.loading = true;                   // Indicate logout is in progress
  state.error = null;                    // Clear previous errors
}

function loginUserRejected(state: AuthState, action: PayloadAction<string | undefined>) {
  state.loading = false;                  // Stop loading on login failure
  state.error = (action.payload as string) || 'Login failed';  // Set login error message
}

function loginUserFulfilled(state: AuthState, action: { payload: LoginResult; type: string; }) {
  state.loading = false;                  // Stop loading on login success
  state.token = action.payload.token;    // Set token from login result
  state.user = action.payload.user;      // Set user from login result
  state.isAuthenticated = true;           // Set authenticated to true
  saveToken(action.payload.token);       // Persist token in storage
  saveUser(action.payload.user);          // Persist user in storage
}

export default authSlice.reducer;
