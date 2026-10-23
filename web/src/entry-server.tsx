import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { App, staticRoutes } from './App';
import * as enEditorial from './content/en/editorial';
import * as enHelp from './content/en/help';
import * as esEditorial from './content/editorial';
import * as esHelp from './content/help';
import * as esPolicies from './content/legal-policies';
import * as esPrivacy from './content/legal-privacy';
import * as esTerms from './content/legal-terms';
import type { LegalDoc } from './content/types';
import { langs } from './lang';
import { HeadProvider, renderHead, type HeadData } from './seo';

/** Renderiza una URL a HTML y devuelve también el <head> de esa página (lo usa scripts/prerender.mjs). */
export function render(url: string): { html: string; title: string; head: string; noindex: boolean } {
  const collector: { head: HeadData | null; path: string | null } = { head: null, path: null };
  const html = renderToString(
    <StrictMode>
      <HeadProvider collector={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
  );
  const { title, tags } = renderHead(collector.head, url);
  return { html, title, head: tags, noindex: !!collector.head?.noindex };
}

const legalSlugs = (mod: Record<string, unknown>) =>
  Object.values(mod)
    .filter((d): d is LegalDoc => typeof d === 'object' && d !== null && 'slug' in d && 'sections' in d)
    .map((d) => d.slug);

/**
 * Todas las URLs públicas del sitio: cada ruta estática y dinámica en ambos idiomas.
 * Los slugs son los mismos en español e inglés (sólo cambia el prefijo).
 */
export function routes(): string[] {
  const dynamic = [
    ...esEditorial.posts.map((p) => `/blog/${p.slug}`),
    ...enEditorial.posts.map((p) => `/blog/${p.slug}`),
    ...esEditorial.cities.map((c) => `/destinos/${c.slug}`),
    ...enEditorial.cities.map((c) => `/destinos/${c.slug}`),
    ...esHelp.helpCategories.map((c) => `/ayuda/categoria/${c.slug}`),
    ...enHelp.helpCategories.map((c) => `/ayuda/categoria/${c.slug}`),
    ...esHelp.helpArticles.map((a) => `/ayuda/${a.slug}`),
    ...enHelp.helpArticles.map((a) => `/ayuda/${a.slug}`),
    ...legalSlugs(esTerms).map((s) => `/legal/${s}`),
    ...legalSlugs(esPrivacy).map((s) => `/legal/${s}`),
    ...legalSlugs(esPolicies).map((s) => `/legal/${s}`),
  ];
  const all = [...new Set([...staticRoutes, ...dynamic])];
  return langs.flatMap((lang) => all.map((r) => `/${lang}${r === '/' ? '' : r}`));
}
