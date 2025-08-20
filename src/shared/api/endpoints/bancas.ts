import { api } from '../axios';
import type { ApiResponse } from '../types';
import type { Banca, CreateBanca } from '../schemas';

export async function listBancas(params: {
  page?: number;
  limit?: number;
  estado?: 'activa' | 'inactiva';
}) {
  const { data } = await api.get<ApiResponse<Banca[]>>('/bancas', { params });
  return data;
}

export async function getBanca(id: string) {
  const { data } = await api.get<ApiResponse<Banca>>(`/bancas/${id}`);
  return data;
}

export async function createBanca(body: CreateBanca) {
  const { data } = await api.post<ApiResponse<Banca>>('/bancas', body);
  return data;
}

// Note: Update/Delete endpoints not in OpenAPI spec
export async function updateBanca(id: string, body: Partial<CreateBanca>) {
  throw new Error('Endpoint no disponible en backend');
}

export async function deleteBanca(id: string) {
  throw new Error('Endpoint no disponible en backend');
}