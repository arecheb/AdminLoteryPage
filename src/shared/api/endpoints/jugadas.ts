import { api } from '../axios';
import type { ApiResponse } from '../types';
import type { Jugada, CreateJugada } from '../schemas';

export async function listJugadas(params: {
  page?: number;
  limit?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  banca_id?: string;
  vendedor_id?: string;
  sorteo_id?: string;
  estado?: 'valida' | 'anulada';
  numero?: number;
}) {
  const { data } = await api.get<ApiResponse<Jugada[]>>('/jugadas', { params });
  return data;
}

export async function createJugada(body: CreateJugada) {
  const { data } = await api.post<ApiResponse<Jugada>>('/jugadas', body);
  return data;
}

// Note: Anular jugada endpoint not in OpenAPI spec
export async function anularJugada(id: string) {
  throw new Error('Endpoint no disponible en backend');
}