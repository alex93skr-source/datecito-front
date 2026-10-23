import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { company } from './site';
import { isLang, type Lang } from './lang';

export const SITE_URL = `https://${company.domain}`;
const DEFAULT_IMAGE = `${SITE_URL}/og.jpg`;

export type HeadData = {
  title: string;
  description?: string;
  /** Ruta absoluta a una imagen 1200×630 (por defecto la de marca). */
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  /** Objetos JSON-LD (schema.org) adicionales a los de la organización. */
  jsonLd?: object[];
};

type Collector = { head: HeadData | null; path: string | null };

const Ctx = createContext<Collector | null>(null);

/**
 * Recolecta los metadatos de la página. En el servidor (prerender) los junta para
 * inyectarlos en el HTML; en el navegador los aplica al <head> en cada navegación.
 */
export function HeadProvider({ children, collector }: { children: ReactNode; collector?: Collector }) {
  return <Ctx.Provider value={collector ?? { head: null, path: null }}>{children}</Ctx.Provider>;
}

const DEFAULTS: Record<Lang, { title: string; description: string }> = {
  es: { title: 'Datecito | Conoce, conecta y sal en un datecito', description: 'Datecito: conoce personas reales cerca de ti y conviértelo en un plan. Matches, chats, datecitos y herramientas de seguridad en una sola app.' },
  en: { title: 'Datecito | Meet, connect and go on a date', description: 'Datecito: meet real people near you and turn it into a plan. Matches, chats, datecitos and safety tools in one app.' },
};

/** Idioma y ruta sin prefijo a partir de un pathname ("/en/membresia" → en, "/membresia"). */
export function splitPath(pathname: string): { lang: Lang; rest: string } {
  const m = pathname.match(/^\/(es|en)(\/.*)?$/);
  const lang = m && isLang(m[1]) ? m[1] : 'es';
  const rest = (m?.[2] ?? '/').replace(/\/+$/, '') || '/';
  return { lang, rest };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function organizationJsonLd(lang: Lang) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.brand,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: company.emails.support,
      sameAs: ['https://instagram.com/datecito', 'https://tiktok.com/@datecito', 'https://facebook.com/datecito', 'https://x.com/datecito'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: company.brand,
      url: SITE_URL,
      inLanguage: lang === 'en' ? 'en' : 'es-MX',
    },
  ];
}

/** Etiquetas del <head> para una página (misma salida en servidor y navegador). */
export function renderHead(head: HeadData | null, pathname: string): { title: string; tags: string } {
  const { lang, rest } = splitPath(pathname);
  const d = DEFAULTS[lang];
  const title = head?.title ? (head.title.includes('Datecito') ? head.title : `${head.title} | Datecito`) : d.title;
  const description = head?.description ?? d.description;
  const canonical = `${SITE_URL}/${lang}${rest === '/' ? '' : rest}`;
  const alt = (l: Lang) => `${SITE_URL}/${l}${rest === '/' ? '' : rest}`;
  const image = head?.image ?? DEFAULT_IMAGE;
  const jsonLd = [...(rest === '/' ? organizationJsonLd(lang) : []), ...(head?.jsonLd ?? [])];

  const tags = [
    `<meta data-seo name="description" content="${esc(description)}">`,
    head?.noindex ? `<meta data-seo name="robots" content="noindex, nofollow">` : `<meta data-seo name="robots" content="index, follow, max-image-preview:large">`,
    `<link data-seo rel="canonical" href="${canonical}">`,
    `<link data-seo rel="alternate" hreflang="es-MX" href="${alt('es')}">`,
    `<link data-seo rel="alternate" hreflang="en" href="${alt('en')}">`,
    `<link data-seo rel="alternate" hreflang="x-default" href="${alt('es')}">`,
    `<meta data-seo property="og:site_name" content="${company.brand}">`,
    `<meta data-seo property="og:type" content="${head?.type ?? 'website'}">`,
    `<meta data-seo property="og:title" content="${esc(title)}">`,
    `<meta data-seo property="og:description" content="${esc(description)}">`,
    `<meta data-seo property="og:url" content="${canonical}">`,
    `<meta data-seo property="og:image" content="${image}">`,
    `<meta data-seo property="og:image:width" content="1200">`,
    `<meta data-seo property="og:image:height" content="630">`,
    `<meta data-seo property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_MX'}">`,
    `<meta data-seo property="og:locale:alternate" content="${lang === 'en' ? 'es_MX' : 'en_US'}">`,
    head?.publishedTime ? `<meta data-seo property="article:published_time" content="${head.publishedTime}">` : '',
    `<meta data-seo name="twitter:card" content="summary_large_image">`,
    `<meta data-seo name="twitter:site" content="@datecito">`,
    `<meta data-seo name="twitter:title" content="${esc(title)}">`,
    `<meta data-seo name="twitter:description" content="${esc(description)}">`,
    `<meta data-seo name="twitter:image" content="${image}">`,
    ...jsonLd.map((o) => `<script data-seo type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ]
    .filter(Boolean)
    .join('\n    ');

  return { title, tags };
}

/**
 * Metadatos de la página actual. Úsalo una vez por página (PageHero ya lo hace con
 * título y entradilla; las páginas sin PageHero lo declaran explícitamente).
 */
export function Seo(head: HeadData) {
  const collector = useContext(Ctx);
  const { pathname } = useLocation();

  // Servidor: se acumula durante el render para inyectarse en el HTML.
  if (collector && typeof window === 'undefined') {
    collector.head = head;
    collector.path = pathname;
  }

  useEffect(() => {
    const { title, tags } = renderHead(head, pathname);
    document.title = title;
    document.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    const tpl = document.createElement('template');
    tpl.innerHTML = tags;
    document.head.append(tpl.content);
    document.documentElement.lang = splitPath(pathname).lang === 'en' ? 'en' : 'es-MX';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, head.title, head.description, head.image, head.type, head.noindex, head.publishedTime, JSON.stringify(head.jsonLd ?? null)]);

  return null;
}
