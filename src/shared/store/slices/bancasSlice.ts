import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BancaSchema, type Banca, type CreateBanca } from '../../api/schemas';
import type { PaginationMeta } from '../../api/types';
import * as bancasApi from '../../api/endpoints/bancas';

export interface BancasState {
  list: Banca[];
  current: Banca | null;
  meta: PaginationMeta | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: BancasState = {
  list: [],
  current: null,
  meta: null,
  status: 'idle',
  error: null,
};

// Thunks
export const fetchBancas = createAsyncThunk(
  'bancas/fetchList',
  async (params: { page?: number; limit?: number; estado?: 'activa' | 'inactiva' }) => {
    const response = await bancasApi.listBancas(params);
    const bancas = response.data.map(banca => BancaSchema.parse(banca));
    return { bancas, meta: response.meta };
  }
);

export const fetchBanca = createAsyncThunk(
  'bancas/fetchSingle',
  async (id: string) => {
    const response = await bancasApi.getBanca(id);
    return BancaSchema.parse(response.data);
  }
);

export const createBanca = createAsyncThunk(
  'bancas/create',
  async (data: CreateBanca) => {
    const response = await bancasApi.createBanca(data);
    return BancaSchema.parse(response.data);
  }
);

const bancasSlice = createSlice({
  name: 'bancas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchBancas.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBancas.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload.bancas;
        state.meta = action.payload.meta || null;
        state.error = null;
      })
      .addCase(fetchBancas.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Error al cargar bancas';
      })
      // Fetch single
      .addCase(fetchBanca.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      // Create
      .addCase(createBanca.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { clearError, clearCurrent } = bancasSlice.actions;
export default bancasSlice.reducer;