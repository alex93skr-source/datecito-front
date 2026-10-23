import { router } from 'expo-router';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { auth, me as meApi, Me, session } from '../api';

type Status = 'loading' | 'signedOut' | 'signedIn';

type SessionValue = {
  status: Status;
  me: Me | null;
  /** Último perfil con sesión; sigue disponible un instante después de cerrarla. */
  lastMe: Me | null;
  setMe: (me: Me) => void;
  refreshMe: () => Promise<Me | null>;
  signIn: (token: string, me: Me) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<SessionValue | null>(null);

/** Perfil listo para Descubrir: nombre, fecha de nacimiento y al menos 2 fotos. */
export const profileReady = (m: Me) => !!m.name && !!m.birthdate && m.photos.length >= 2;

/** A qué pantalla debe ir la persona según su estado. */
export function homeFor(m: Me | null): '/welcome' | '/verify' | '/onboarding' | '/membership' | '/discover' {
  if (!m) return '/welcome';
  if (!m.email_verified) return '/verify';
  if (!profileReady(m)) return '/onboarding';
  if (m.membership.status === 'inactive') return '/membership';
  return '/discover';
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [me, setMeState] = useState<Me | null>(null);
  const [lastMe, setLastMe] = useState<Me | null>(null);

  const setMe = useCallback((m: Me) => {
    setMeState(m);
    setLastMe(m);
  }, []);

  const reset = useCallback(async () => {
    await session.clear();
    setMeState(null);
    setStatus('signedOut');
  }, []);

  useEffect(() => {
    session.onUnauthorized(() => {
      void reset();
      router.replace('/welcome');
    });
    session.onMembershipRequired(() => router.replace({ pathname: '/membership', params: { gate: '1' } }));

    (async () => {
      const token = await session.load();
      if (!token) return setStatus('signedOut');
      try {
        setMe(await meApi.get());
        setStatus('signedIn');
      } catch {
        setStatus(session.hasToken ? 'signedIn' : 'signedOut');
      }
    })();
  }, [reset, setMe]);

  const refreshMe = useCallback(async () => {
    try {
      const fresh = await meApi.get();
      setMe(fresh);
      return fresh;
    } catch {
      return null;
    }
  }, [setMe]);

  const signIn = useCallback(async (token: string, user: Me) => {
    await session.save(token);
    setMe(user);
    setStatus('signedIn');
  }, [setMe]);

  const signOut = useCallback(async () => {
    await auth.logout().catch(() => undefined);
    await reset();
  }, [reset]);

  const value = useMemo(() => ({ status, me, lastMe, setMe, refreshMe, signIn, signOut }), [status, me, lastMe, setMe, refreshMe, signIn, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider');
  return ctx;
}

/**
 * Perfil propio garantizado (para pantallas que sólo se ven con sesión).
 * Al cerrar sesión, las pantallas abiertas siguen montadas un instante mientras se navega
 * a la bienvenida: conservan el último perfil para no tronar con `me` vacío.
 */
export function useMe() {
  const { me, lastMe, setMe, refreshMe } = useSession();
  return { me: (me ?? lastMe) as Me, setMe, refreshMe };
}
