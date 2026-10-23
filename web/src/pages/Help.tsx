import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApp } from '../components/AppState';
import { Blocks } from '../components/Doc';
import { FormError, Honeypot, useWebForm } from '../components/forms';
import { Icon } from '../components/Icon';
import { Faq, PageHero, SectionHead } from '../components/ui';
import { useContent } from '../content';
import type { Block } from '../content/types';
import { Link, useT } from '../i18n';
import { Seo } from '../seo';
import { company } from '../site';
import NotFound from './NotFound';

const textOf = (b: Block[]) => b.map((x) => (typeof x === 'string' ? x : 'ul' in x ? x.ul.join(' ') : 'ol' in x ? x.ol.join(' ') : 'note' in x ? x.note : '')).join(' ');
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Los artículos que más se consultan (también son las preguntas frecuentes). */
const POPULAR = ['crear-cuenta', 'no-llega-codigo', 'verificar-perfil', 'quien-te-dio-like', 'limites-diarios', 'cancelar-membresia', 'datecito-seguro', 'reportar', 'eliminar-cuenta'];

function ContactStrip() {
  const t = useT();
  return (
    <section className="section alt">
      <div className="container narrow center">
        <h2>{t('¿No encontraste lo que buscabas?', 'Didn’t find what you were looking for?')}</h2>
        <p className="lead">{t('Escríbenos; te respondemos en uno o dos días hábiles.', 'Write to us; we reply within one or two business days.')}</p>
        <Link to="/contacto" className="btn btn-primary">
          {t('Contactar a soporte', 'Contact support')}
        </Link>
      </div>
    </section>
  );
}

export function HelpCenter() {
  const t = useT();
  const { helpArticles, helpCategories } = useContent();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (n.length < 2) return [];
    return helpArticles.filter((a) => norm(a.title + ' ' + textOf(a.body)).includes(n));
  }, [q, helpArticles]);
  return (
    <>
      <PageHero
        eyebrow={t('Centro de ayuda', 'Help Center')}
        title={t('¿En qué te ayudamos?', 'How can we help?')}
        lead={t('Guías cortas sobre tu cuenta, Descubrir, matches, datecitos, seguridad y membresía.', 'Short guides about your account, Discover, matches, dates, safety and membership.')}
        crumbs={[{ label: t('Ayuda', 'Help') }]}
      >
        <div className="search" style={{ marginTop: 24 }}>
          <Icon name="search" />
          <input
            className="input"
            type="search"
            placeholder={t('Busca: cancelar, verificar, reportar…', 'Search: cancel, verify, report…')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t('Buscar en la ayuda', 'Search help')}
          />
        </div>
      </PageHero>
      {q.trim().length >= 2 ? (
        <section className="section tight">
          <div className="container narrow">
            <h3>{t(`${results.length} resultado${results.length === 1 ? '' : 's'} para “${q}”`, `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”`)}</h3>
            <ul className="list-links">
              {results.map((a) => (
                <li key={a.slug}>
                  <Link to={`/ayuda/${a.slug}`}>
                    {a.title} <Icon name="chevron-right" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
            {results.length === 0 ? (
              <p className="muted">
                {t('Prueba con otras palabras o', 'Try other words or')}{' '}
                <Link className="link" to="/contacto">
                  {t('contáctanos', 'contact us')}
                </Link>
                .
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
      <section className="section">
        <div className="container">
          <div className="grid g3">
            {helpCategories.map((c) => (
              <Link key={c.slug} to={`/ayuda/categoria/${c.slug}`} className="card card-link">
                <div className="icon-badge">
                  <Icon name={c.icon} size={26} />
                </div>
                <h3>{c.title}</h3>
                <p className="muted">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <SectionHead title={t('Artículos populares', 'Popular articles')} />
          <ul className="list-links">
            {POPULAR.map((s) => helpArticles.find((x) => x.slug === s))
              .filter((a): a is NonNullable<typeof a> => !!a)
              .map((a) => (
                <li key={a.slug}>
                  <Link to={`/ayuda/${a.slug}`}>
                    {a.title} <Icon name="chevron-right" size={18} />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
      <ContactStrip />
    </>
  );
}

export function HelpCategory() {
  const { slug } = useParams();
  const t = useT();
  const { helpArticles, helpCategories } = useContent();
  const cat = helpCategories.find((c) => c.slug === slug);
  if (!cat) return <NotFound />;
  const list = helpArticles.filter((a) => a.cat === cat.slug);
  return (
    <>
      <PageHero eyebrow={t('Centro de ayuda', 'Help Center')} title={cat.title} lead={cat.desc} crumbs={[{ label: t('Ayuda', 'Help'), to: '/ayuda' }, { label: cat.title }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <ul className="list-links">
            {list.map((a) => (
              <li key={a.slug}>
                <Link to={`/ayuda/${a.slug}`}>
                  {a.title} <Icon name="chevron-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ContactStrip />
    </>
  );
}

export function HelpArticle() {
  const { slug } = useParams();
  const { toast } = useApp();
  const t = useT();
  const { helpArticles, helpCategories } = useContent();
  const a = helpArticles.find((x) => x.slug === slug);
  if (!a) return <NotFound />;
  const cat = helpCategories.find((c) => c.slug === a.cat)!;
  const related = helpArticles.filter((x) => x.cat === a.cat && x.slug !== a.slug);
  const firstParagraph = a.body.find((b): b is string => typeof b === 'string');
  return (
    <>
      <Seo
        title={a.title}
        description={firstParagraph}
        type="article"
        jsonLd={[{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: a.title, acceptedAnswer: { '@type': 'Answer', text: textOf(a.body) } }] }]}
      />
      <PageHero noSeo title={a.title} crumbs={[{ label: t('Ayuda', 'Help'), to: '/ayuda' }, { label: cat.title, to: `/ayuda/categoria/${cat.slug}` }, { label: a.title }]} />
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container narrow">
          <article className="card article">
            <Blocks blocks={a.body} />
          </article>
          <div className="card center" style={{ marginTop: 24 }}>
            <strong style={{ color: 'var(--verde)' }}>{t('¿Te sirvió este artículo?', 'Was this article helpful?')}</strong>
            <div className="btn-row" style={{ justifyContent: 'center', marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => toast(t('¡Gracias por tu opinión!', 'Thanks for your feedback!'))}>
                👍 {t('Sí', 'Yes')}
              </button>
              <Link className="btn btn-ghost btn-sm" to="/contacto">
                👎 {t('No, necesito ayuda', 'No, I need help')}
              </Link>
            </div>
          </div>
          {related.length ? (
            <>
              <h3 style={{ marginTop: 40 }}>{t('Artículos relacionados', 'Related articles')}</h3>
              <ul className="list-links">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/ayuda/${r.slug}`}>
                      {r.title} <Icon name="chevron-right" size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
      <ContactStrip />
    </>
  );
}

export function FaqPage() {
  const t = useT();
  const { helpArticles } = useContent();
  const items = POPULAR.map((s) => helpArticles.find((x) => x.slug === s)).filter((a): a is NonNullable<typeof a> => !!a);
  return (
    <>
      <Seo
        title={t('Preguntas frecuentes', 'FAQ')}
        description={t('Las respuestas a lo que más nos preguntan sobre Datecito: registro, verificación, likes, membresía y seguridad.', 'Answers to what people ask us most about Datecito: sign-up, verification, likes, membership and safety.')}
        jsonLd={[{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((a) => ({ '@type': 'Question', name: a.title, acceptedAnswer: { '@type': 'Answer', text: textOf(a.body) } })) }]}
      />
      <PageHero noSeo eyebrow={t('Preguntas frecuentes', 'FAQ')} title={t('Respuestas rápidas', 'Quick answers')} lead={t('Lo que más nos preguntan sobre Datecito. Para todo lo demás está el Centro de ayuda.', 'What people ask us most about Datecito. For everything else there’s the Help Center.')} crumbs={[{ label: t('Preguntas frecuentes', 'FAQ') }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <Faq items={items.map((a) => ({ q: a.title, a: <Blocks blocks={a.body} /> }))} />
          <p className="center" style={{ marginTop: 28 }}>
            <Link to="/ayuda" className="link">
              {t('Ver todos los artículos del Centro de ayuda →', 'See every Help Center article →')}
            </Link>
          </p>
        </div>
      </section>
      <ContactStrip />
    </>
  );
}

export function Contacto() {
  const t = useT();
  const form = useWebForm('contact');
  const e = company.emails;
  const channels: [string, string, string][] = [
    [t('Soporte', 'Support'), e.support, t('Cuenta, pagos, problemas técnicos.', 'Account, payments, technical issues.')],
    [t('Confianza y seguridad', 'Trust & safety'), e.safety, t('Reportes urgentes y apelaciones.', 'Urgent reports and appeals.')],
    [t('Privacidad y datos', 'Privacy & data'), e.privacy, t('Derechos ARCO y dudas de privacidad.', 'ARCO rights and privacy questions.')],
    [t('Prensa', 'Press'), e.press, t('Medios y entrevistas.', 'Media and interviews.')],
    [t('Alianzas', 'Partnerships'), e.partners, t('Marcas, lugares y colaboraciones.', 'Brands, venues and collaborations.')],
    ['Legal', e.legal, t('Notificaciones legales.', 'Legal notices.')],
  ];
  const topics = t(
    ['Mi cuenta', 'Membresía y pagos', 'Reportar a alguien', 'Problema técnico', 'Privacidad', 'Avísenme cuando esté disponible', 'Sugerencia', 'Otro'],
    ['My account', 'Membership & payments', 'Report someone', 'Technical issue', 'Privacy', 'Let me know when it’s available', 'Suggestion', 'Other'],
  );
  return (
    <>
      <PageHero eyebrow={t('Contacto', 'Contact')} title={t('Hablemos', 'Let’s talk')} lead={t('Escríbenos desde aquí o al correo del equipo que te pueda ayudar mejor. Respondemos en uno o dos días hábiles.', 'Write to us here or to the team that can help you best. We reply within one or two business days.')} crumbs={[{ label: t('Contacto', 'Contact') }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="card">
            {form.sent ? (
              <div className="center">
                <div className="icon-badge green" style={{ margin: '0 auto 16px' }}>
                  <Icon name="check" size={26} />
                </div>
                <h3>{t('¡Mensaje recibido!', 'Message received!')}</h3>
                <p className="muted">
                  {t('Folio', 'Reference')} <strong>{form.folio}</strong>. {t('Te responderemos al correo que nos diste en uno o dos días hábiles.', 'We’ll reply to the email you gave us within one or two business days.')}
                </p>
                <button className="btn btn-ghost" onClick={form.reset}>
                  {t('Enviar otro mensaje', 'Send another message')}
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={form.submit}>
                <h3>{t('Escríbenos', 'Write to us')}</h3>
                <Honeypot />
                <div className="form-row">
                  <label className="field">
                    {t('Nombre', 'Name')}
                    <input className="input" name="name" required maxLength={120} autoComplete="name" />
                  </label>
                  <label className="field">
                    {t('Correo', 'Email')}
                    <input className="input" name="email" type="email" required autoComplete="email" />
                  </label>
                </div>
                <label className="field">
                  {t('Tema', 'Topic')}
                  <select className="input" name="topic" required defaultValue="">
                    <option value="" disabled>
                      {t('Elige un tema', 'Choose a topic')}
                    </option>
                    {topics.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  {t('Mensaje', 'Message')}
                  <textarea className="input" name="message" required minLength={10} maxLength={4000} rows={5} />
                </label>
                <label className="check">
                  <input type="checkbox" name="accepted" required />
                  <span>
                    {t('Acepto el', 'I accept the')}{' '}
                    <Link className="link" to="/legal/privacidad">
                      {t('Aviso de privacidad', 'Privacy Notice')}
                    </Link>
                    .
                  </span>
                </label>
                <FormError message={form.error} />
                <button className="btn btn-primary" disabled={form.sending}>
                  {form.sending ? t('Enviando…', 'Sending…') : t('Enviar mensaje', 'Send message')}
                </button>
              </form>
            )}
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="notice danger">
              <strong>{t('¿Emergencia?', 'Emergency?')}</strong> {t('Llama al 911. Para reportar a alguien con urgencia usa “Reportar” dentro de la app.', 'Call 911. To urgently report someone use “Report” in the app.')}
            </div>
            {channels.map(([title, m, d]) => (
              <div className="card" key={title} style={{ padding: 20 }}>
                <strong style={{ color: 'var(--verde)' }}>{title}</strong>
                <div className="muted small">{d}</div>
                <a className="link" href={`mailto:${m}`}>
                  {m}
                </a>
              </div>
            ))}
            <p className="small muted">
              {company.legalName} · {t(company.address, company.addressEn)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
