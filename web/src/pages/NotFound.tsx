import { Link, useT } from '../i18n';
import { Seo } from '../seo';

export default function NotFound() {
  const t = useT();
  return (
    <section className="not-found">
      <Seo title={t('Página no encontrada', 'Page not found')} noindex />
      <div>
        <div className="big">404</div>
        <h1 style={{ fontSize: '2rem' }}>{t('Este datecito se canceló', 'This date got cancelled')}</h1>
        <p className="lead" style={{ margin: '0 auto 24px' }}>
          {t('No encontramos la página que buscas. Quizá se movió o el enlace está mal escrito.', 'We couldn’t find the page you’re looking for. It may have moved or the link is mistyped.')}
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            {t('Ir al inicio', 'Go home')}
          </Link>
          <Link to="/mapa-del-sitio" className="btn btn-ghost">
            {t('Mapa del sitio', 'Sitemap')}
          </Link>
        </div>
      </div>
    </section>
  );
}
