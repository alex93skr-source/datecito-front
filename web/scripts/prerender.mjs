// Prerenderiza cada ruta del sitio a HTML estático (SEO y vistas previas en redes) y genera
// sitemap.xml y robots.txt. Se ejecuta en `npm run build`, después de los dos builds de Vite.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://datecito.com';

const { render, routes } = await import(pathToFileURL(join(root, 'dist-server', 'entry-server.js')).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const urls = routes();
const today = new Date().toISOString().slice(0, 10);
const indexable = [];

for (const url of urls) {
  const { html, title, head, noindex } = render(url);
  const page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('<html lang="es">', `<html lang="${url.startsWith('/en') ? 'en' : 'es-MX'}">`)
    .replace('<!--app-head-->', head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const dir = join(dist, url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page);
  if (!noindex) indexable.push(url);
}

// sitemap.xml con alternativas de idioma por página
const byPage = new Map();
for (const url of indexable) {
  const m = url.match(/^\/(es|en)(\/.*)?$/);
  const rest = m[2] ?? '';
  if (!byPage.has(rest)) byPage.set(rest, new Set());
  byPage.get(rest).add(m[1]);
}
const entries = [];
for (const [rest, langsSet] of byPage) {
  for (const lang of langsSet) {
    const alternates = [...langsSet]
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l === 'es' ? 'es-MX' : 'en'}" href="${SITE}/${l}${rest}"/>`)
      .join('\n');
    const priority = rest === '' ? '1.0' : rest.split('/').length <= 2 ? '0.8' : '0.6';
    entries.push(`  <url>\n    <loc>${SITE}/${lang}${rest}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/es${rest}"/>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`);
  }
}
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Prerender: ${urls.length} páginas, ${indexable.length} en el sitemap.`);
