import { useEffect, useState } from 'react';

/** Hora actual que se refresca cada `intervalMs` (para cuentas regresivas). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const formatLeft = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h} h ${String(m).padStart(2, '0')} min` : `${m}:${String(s).padStart(2, '0')}`;
};
