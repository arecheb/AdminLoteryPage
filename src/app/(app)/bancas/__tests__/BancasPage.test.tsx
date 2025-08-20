import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BancasPage from '../page';
import authSlice from '@/shared/store/slices/authSlice';
import bancasSlice from '@/shared/store/slices/bancasSlice';
import uiSlice from '@/shared/store/slices/uiSlice';
import jugadasSlice from '@/shared/store/slices/jugadasSlice';
import { Role, EstadoUsuario } from '@/shared/api/types';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockStore = configureStore({
  reducer: {
    auth: authSlice,
    bancas: bancasSlice,
    ui: uiSlice,
    jugadas: jugadasSlice,
  },
  preloadedState: {
    auth: {
      user: {
        id: '1',
        email: 'admin@test.com',
        nombre: 'Admin Test',
        rol: Role.ADMIN,
        estado: EstadoUsuario.ACTIVO,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      token: 'test-token',
      status: 'idle',
      error: null,
    },
    bancas: {
      list: [],
      current: null,
      meta: null,
      status: 'idle',
      error: null,
    },
  },
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <Provider store={mockStore}>
      {ui}
    </Provider>
  );
}

describe('BancasPage', () => {
  it('renders bancas page correctly', () => {
    renderWithProvider(<BancasPage />);
    
    expect(screen.getByText('Bancas')).toBeInTheDocument();
    expect(screen.getByText('Gestión de bancas de lotería')).toBeInTheDocument();
    expect(screen.getByText('Nueva Banca')).toBeInTheDocument();
  });

  it('shows filters section', () => {
    renderWithProvider(<BancasPage />);
    
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por nombre o ubicación...')).toBeInTheDocument();
  });
});