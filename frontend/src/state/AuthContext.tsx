import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AuthResponse, login as loginRequest, register as registerRequest, SessionUser } from '../services/auth';

type AuthContextValue = {
  user?: SessionUser;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const savedUser = () => {
  const raw = localStorage.getItem('sessionUser');
  return raw ? JSON.parse(raw) as SessionUser : undefined;
};

const persistSession = (response: AuthResponse) => {
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  localStorage.setItem('sessionUser', JSON.stringify(response.user));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | undefined>(savedUser);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    async login(email, password) {
      const response = await loginRequest(email, password);
      persistSession(response);
      setUser(response.user);
    },
    async register(name, email, password) {
      await registerRequest(name, email, password);
      const response = await loginRequest(email, password);
      persistSession(response);
      setUser(response.user);
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionUser');
      setUser(undefined);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return value;
}
