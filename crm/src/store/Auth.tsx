import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ApiError, auth, session, type StaffMe } from '../api';

type AuthState = {
  status: 'loading' | 'anonymous' | 'ready';
  me: StaffMe | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (permission: 'moderate' | 'administer') => boolean;
  toast: (message: string, kind?: 'ok' | 'error') => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState['status']>(session.token ? 'loading' : 'anonymous');
  const [me, setMe] = useState<StaffMe | null>(null);
  const [message, setMessage] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const toast = useCallback((text: string, kind: 'ok' | 'error' = 'ok') => {
    setMessage({ text, kind });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 3500);
  }, []);

  const signOut = useCallback(() => {
    session.clear();
    setMe(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    session.onUnauthorized(signOut);
    if (!session.token) return;
    auth
      .me()
      .then((data) => {
        setMe(data);
        setStatus('ready');
      })
      .catch(() => signOut());
  }, [signOut]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await auth.login(email, password);
    session.save(response.token);
    try {
      const data = await auth.me();
      setMe(data);
      setStatus('ready');
    } catch (e) {
      session.clear();
      if (e instanceof ApiError && e.status === 403) throw new ApiError(403, 'Esta cuenta no tiene acceso al CRM. Pide a un admin que te asigne el rol.');
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      /* el token ya no sirve */
    }
    signOut();
  }, [signOut]);

  const can = useCallback((permission: 'moderate' | 'administer') => me?.permissions[permission] ?? false, [me]);

  const value = useMemo(() => ({ status, me, login, logout, can, toast }), [status, me, login, logout, can, toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {message ? (
        <div className={`toast ${message.kind}`} role="status">
          {message.text}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}
