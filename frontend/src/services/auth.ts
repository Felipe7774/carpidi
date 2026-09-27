import { api } from './api';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: SessionUser;
};

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<SessionUser>('/auth/register', { name, email, password });
  return data;
}
