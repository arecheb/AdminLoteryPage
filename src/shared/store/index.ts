import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import bancasSlice from './slices/bancasSlice';
import jugadasSlice from './slices/jugadasSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    bancas: bancasSlice,
    jugadas: jugadasSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;