import { PageHero } from '../components/ui';
import { useContent } from '../content';
import { Link, useLang, useT } from '../i18n';
import { getFooter, getNav } from '../site';

export function Sitemap() {
  const t = useT();
  const lang = useLang();
  const { cities, posts, helpCategories } = useContent();
  const groups = [
    ...getNav(lang)
      .filter((g) => g.items)
      .map((g) => ({ title: g.label, links: g.items! })),
    ...getFooter(lang),
    { title: t('Ayuda por categoría', 'Help by category'), links: helpCategories.map((c) => ({ to: `/ayuda/categoria/${c.slug}`, label: c.title })) },
    { title: 'Blog', links: posts.map((p) => ({ to: `/blog/${p.slug}`, label: p.title })) },
    { title: t('Destinos', 'Destinations'), links: cities.map((c) => ({ to: `/destinos/${c.slug}`, label: c.name })) },
    {
      title: t('Más', 'More'),
      links: [
        { to: '/', label: t('Inicio', 'Home') },
        { to: '/descargar', label: t('Descargar', 'Download') },
        { to: '/legal/privacidad-simplificado', label: t('Aviso de privacidad simplificado', 'Short Privacy Notice') },
        { to: '/legal/opciones-de-privacidad', label: t('Tus opciones de privacidad', 'Your privacy choices') },
        { to: '/legal/arco', label: t('Derechos ARCO', 'ARCO rights') },
        { to: '/eliminar-cuenta', label: t('Eliminar mi cuenta', 'Delete my account') },
        { to: '/seguridad/menores', label: t('Seguridad de menores', 'Child safety') },
      ],
    },
  ];
  return (
    <>
      <PageHero title={t('Mapa del sitio', 'Sitemap')} crumbs={[{ label: t('Mapa del sitio', 'Sitemap') }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container grid g3">
          {groups.map((g, i) => (
            <div key={g.title + i}>
              <h3>{g.title}</h3>
              <ul style={{ paddingLeft: 18 }}>
                {g.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link className="link" to={l.to}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
