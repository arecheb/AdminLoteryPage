import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UsuarioSchema, type Usuario } from '../../api/schemas';
import * as authApi from '../../api/endpoints/auth';

export interface AuthState {
  user: Usuario | null;
  token: string | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authApi.login({ email, password });
    const user = UsuarioSchema.parse(response.data.user);
    
    // Store in localStorage
    localStorage.setItem('auth_token', response.data.session.token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token: response.data.session.token };
  }
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const response = await authApi.me();
  const user = UsuarioSchema.parse(response.data);
  
  // Update localStorage
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = UsuarioSchema.parse(JSON.parse(userStr));
      return {
        user,
        token,
        status: 'idle',
        error: null,
      };
    }
  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
  
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Error de autenticación';
        state.user = null;
        state.token = null;
      })
      // Fetch me
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;