import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ApiError, type Query } from '../api/client';

export type Async<T> = { data: T | null; error: string | null; loading: boolean; reload: () => void };

/**
 * Carga datos de la API y los recarga cuando cambian las dependencias.
 * Conserva el dato anterior mientras recarga (sin parpadeos).
 */
export function useApi<T>(fn: () => Promise<T>, deps: unknown[], { enabled = true, refreshMs }: { enabled?: boolean; refreshMs?: number } = {}): Async<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [tick, setTick] = useState(0);
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    setLoading(true);
    latest
      .current()
      .then((result) => {
        if (!alive) return;
        setData(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof ApiError ? e.message : 'Algo salió mal.');
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick, enabled]);

  useEffect(() => {
    if (!refreshMs || !enabled) return;
    const id = window.setInterval(() => setTick((t) => t + 1), refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs, enabled]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload };
}

export function useDebounced<T>(value: T, ms = 350): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return v;
}

/** Filtros persistidos en la URL (compartibles). */
export function useFilters(defaults: Record<string, string> = {}) {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => {
    const out: Record<string, string> = { ...defaults };
    params.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }, [params, defaults]);

  const set = useCallback(
    (patch: Record<string, string | number | boolean | null | undefined>, resetPage = true) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === false) next.delete(key);
        else next.set(key, value === true ? '1' : String(value));
      });
      if (resetPage) next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const clear = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams]);
  return { filters, set, clear, query: filters as Query };
}

export type PeriodState = { from: string; to: string; interval?: 'day' | 'week' | 'month' };

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}

export const today = () => iso(new Date());

/** Rango de fechas compartido por las pantallas de métricas, persistido en la URL. */
export function usePeriod(defaultDays = 30) {
  const [params, setParams] = useSearchParams();
  const period: PeriodState = useMemo(
    () => ({
      from: params.get('from') ?? daysAgo(defaultDays - 1),
      to: params.get('to') ?? today(),
      interval: (params.get('interval') as PeriodState['interval']) ?? undefined,
    }),
    [params, defaultDays],
  );

  const set = useCallback(
    (next: Partial<PeriodState>) => {
      const p = new URLSearchParams(params);
      const merged = { ...period, ...next };
      p.set('from', merged.from);
      p.set('to', merged.to);
      if (merged.interval) p.set('interval', merged.interval);
      else p.delete('interval');
      setParams(p, { replace: true });
    },
    [params, period, setParams],
  );

  return { period, set, query: { from: period.from, to: period.to, interval: period.interval } as Query };
}
