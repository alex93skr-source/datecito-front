import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type CookiePrefs = { necessary: true; analytics: boolean; marketing: boolean; personalization: boolean };

type AppState = {
  cookies: CookiePrefs | null;
  saveCookies: (p: Omit<CookiePrefs, 'necessary'>) => void;
  cookieSettings: boolean;
  setCookieSettings: (v: boolean) => void;
  langOpen: boolean;
  setLangOpen: (v: boolean) => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<AppState | null>(null);
const KEY = 'datecito.cookies.v1';

function readPrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CookiePrefs) : null;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookies] = useState<CookiePrefs | null>(readPrefs);
  const [cookieSettings, setCookieSettings] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 3200);
  }, []);

  const saveCookies = useCallback((p: Omit<CookiePrefs, 'necessary'>) => {
    const prefs: CookiePrefs = { necessary: true, ...p };
    setCookies(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* sin almacenamiento: la preferencia vive sólo en esta visita */
    }
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(
    () => ({ cookies, saveCookies, cookieSettings, setCookieSettings, langOpen, setLangOpen, toast }),
    [cookies, saveCookies, cookieSettings, langOpen, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {message ? (
        <div className="toast" role="status">
          {message}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp fuera de AppStateProvider');
  return v;
}
