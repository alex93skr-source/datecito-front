import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../api';

type State<T> = { data: T | undefined; error: ApiError | undefined; loading: boolean };

/**
 * Carga datos de la API y los vuelve a pedir cada vez que la pantalla recibe el foco.
 */
export function useRemote<T>(fetcher: () => Promise<T>, { refetchOnFocus = true }: { refetchOnFocus?: boolean } = {}) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: undefined, loading: true });
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await fetcherRef.current();
      setState({ data, error: undefined, loading: false });
      return data;
    } catch (e) {
      setState((s) => ({ ...s, error: e instanceof ApiError ? e : new ApiError(0, 'Eso no salió. Inténtalo otra vez.'), loading: false }));
      return undefined;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus || state.data === undefined) void reload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, refetchOnFocus]),
  );

  const setData = useCallback((updater: T | ((prev: T | undefined) => T)) => {
    setState((s) => ({ ...s, data: typeof updater === 'function' ? (updater as (p: T | undefined) => T)(s.data) : updater }));
  }, []);

  return { ...state, reload, setData };
}
