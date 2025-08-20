import { api } from '../axios';
import type { ApiResponse } from '../types';
import type { Usuario, RegisterUsuario } from '../schemas';

export async function login(body: { email: string; password: string }) {
  const { data } = await api.post<ApiResponse<{ user: Usuario; session: any }>>('/auth/login', body);
  return data;
}

export async function register(body: RegisterUsuario) {
  const { data } = await api.post<ApiResponse<{ user: Usuario; session: any }>>('/auth/register', body);
  return data;
}

export async function me() {
  const { data } = await api.get<ApiResponse<Usuario>>('/auth/me');
  return data;
}

export async function logout() {
  // Note: No logout endpoint in OpenAPI spec, so we just clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}