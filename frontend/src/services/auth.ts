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
};

export class AuthRequestError extends Error {
  constructor(public readonly status?: number, message = 'No fue posible completar la solicitud.') {
    super(message);
    this.name = 'AuthRequestError';
  }
}

async function postAuth<T>(path: string, payload: Record<string, string>) {
  try {
    const response = await fetch(`/api/v1${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => undefined) as { detail?: string; errors?: { message?: string }[] } | T | undefined;
    if (!response.ok) {
      const problem = body && typeof body === 'object' ? body as { detail?: string; errors?: { message?: string }[] } : undefined;
      const message = problem?.errors?.[0]?.message ?? problem?.detail;
      throw new AuthRequestError(response.status, message);
    }
    return body as T;
  } catch (cause) {
    if (cause instanceof AuthRequestError) throw cause;
    throw new AuthRequestError(undefined, 'No se pudo conectar con el servicio de autenticación.');
  }
}

export async function login(email: string, password: string) {
  return postAuth<AuthResponse>('/auth/login', { email, password });
}

export async function getProfile(accessToken: string) {
  const response = await fetch('/api/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new AuthRequestError(response.status, 'No fue posible cargar el perfil.');
  return response.json() as Promise<SessionUser>;
}

export async function register(name: string, email: string, password: string) {
  return postAuth<SessionUser>('/auth/register', { name, email, password });
}
