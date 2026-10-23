export const langs = ['es', 'en'] as const;
export type Lang = (typeof langs)[number];

export const langNames: Record<Lang, string> = { es: 'Español', en: 'English' };

export const isLang = (x: string | undefined): x is Lang => x === 'es' || x === 'en';

/** Antepone el idioma a una ruta absoluta del sitio: "/membresia" → "/en/membresia". */
export function withLang(lang: Lang, to: string) {
  if (!to.startsWith('/') || to.startsWith('//')) return to;
  return `/${lang}${to === '/' ? '' : to}`;
}

/** Cambia el idioma de una ruta ya localizada, conservando la página: "/es/blog?x#y" → "/en/blog?x#y". */
export function switchLang(path: string, lang: Lang) {
  return path.replace(/^\/(es|en)(?=\/|$|\?|#)/, `/${lang}`);
}

const KEY = 'datecito.lang';

export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY) ?? undefined;
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* sin almacenamiento: el idioma vive sólo en la URL */
  }
}

/** Idioma inicial: el que eligió antes, si no el del navegador, y español por defecto. */
export function preferredLang(): Lang {
  return savedLang() ?? (navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es');
}
