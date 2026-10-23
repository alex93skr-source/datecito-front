import { useCallback, useEffect } from 'react';
import { Link as RouterLink, Navigate, NavLink as RouterNavLink, Outlet, useLocation, useParams, type LinkProps, type NavLinkProps } from 'react-router-dom';

import { isLang, preferredLang, withLang, type Lang } from './lang';

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): Lang {
  const { lang } = useParams();
  return isLang(lang) ? lang : 'es';
}

/** t('Hola', 'Hello'): devuelve el texto del idioma activo. */
// eslint-disable-next-line react-refresh/only-export-components
export function useT() {
  const lang = useLang();
  return useCallback(<T,>(es: T, en: T): T => (lang === 'en' ? en : es), [lang]);
}

/** Link que respeta el idioma de la URL actual. */
export function Link({ to, ...rest }: LinkProps) {
  const lang = useLang();
  return <RouterLink to={typeof to === 'string' ? withLang(lang, to) : to} {...rest} />;
}

export function NavLink({ to, ...rest }: NavLinkProps) {
  const lang = useLang();
  return <RouterNavLink to={typeof to === 'string' ? withLang(lang, to) : to} {...rest} />;
}

/** "/" → "/es" o "/en" según la preferencia. */
export function RootRedirect() {
  return <Navigate to={`/${preferredLang()}`} replace />;
}

/** Valida el prefijo de idioma; las URLs sin prefijo (p. ej. "/membresia") se mandan a su versión con idioma. */
export function LangGate() {
  const { lang } = useParams();
  const { pathname, search, hash } = useLocation();
  const valid = isLang(lang);

  useEffect(() => {
    if (!valid) return;
    document.documentElement.lang = lang === 'en' ? 'en' : 'es-MX';
  }, [lang, valid]);

  if (!valid) return <Navigate to={`/${preferredLang()}${pathname}${search}${hash}`} replace />;
  return <Outlet />;
}
