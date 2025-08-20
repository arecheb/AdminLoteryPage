import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { JugadaSchema, type Jugada, type CreateJugada } from '../../api/schemas';
import type { PaginationMeta } from '../../api/types';
import * as jugadasApi from '../../api/endpoints/jugadas';

export interface JugadasState {
  list: Jugada[];
  meta: PaginationMeta | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: JugadasState = {
  list: [],
  meta: null,
  status: 'idle',
  error: null,
};

// Thunks
export const fetchJugadas = createAsyncThunk(
  'jugadas/fetchList',
  async (params: {
    page?: number;
    limit?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    banca_id?: string;
    vendedor_id?: string;
    sorteo_id?: string;
    estado?: 'valida' | 'anulada';
    numero?: number;
  }) => {
    const response = await jugadasApi.listJugadas(params);
    const jugadas = response.data.map(jugada => JugadaSchema.parse(jugada));
    return { jugadas, meta: response.meta };
  }
);

export const createJugada = createAsyncThunk(
  'jugadas/create',
  async (data: CreateJugada) => {
    const response = await jugadasApi.createJugada(data);
    return JugadaSchema.parse(response.data);
  }
);

const jugadasSlice = createSlice({
  name: 'jugadas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchJugadas.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJugadas.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload.jugadas;
        state.meta = action.payload.meta || null;
        state.error = null;
      })
      .addCase(fetchJugadas.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Error al cargar jugadas';
      })
      // Create
      .addCase(createJugada.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { clearError } = jugadasSlice.actions;
export default jugadasSlice.reducer;