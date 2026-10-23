import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApp } from '../components/AppState';
import { Blocks } from '../components/Doc';
import { Icon, type IconName } from '../components/Icon';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import NotFound from './NotFound';

const SOON = /^(Próximamente|Coming soon): /;

export function Blog() {
  const t = useT();
  const { posts } = useContent();
  const all = t('Todos', 'All');
  const cats = [all, ...new Set(posts.map((p) => p.cat))];
  const [picked, setCat] = useState<string | null>(null);
  const cat = picked && cats.includes(picked) ? picked : all;
  const list = cat === all ? posts : posts.filter((p) => p.cat === cat);
  const [first, ...rest] = list;
  return (
    <>
      <PageHero
        eyebrow={t('Vida Datecito', 'Datecito Life')}
        title={t('Historias, consejos y cultura de citas', 'Stories, tips and dating culture')}
        lead={t('Todo lo que nos gusta platicar sobre conocer gente, salir y querernos bonito.', 'Everything we love talking about: meeting people, going out and loving well.')}
        crumbs={[{ label: 'Blog' }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="tag-row" role="tablist" aria-label={t('Categorías', 'Categories')}>
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={`btn btn-sm ${cat === c ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          {first ? (
            <Link to={`/blog/${first.slug}`} className="card card-link post-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 28 }}>
              <div className="post-cover" style={{ background: first.color, fontSize: '5rem', minHeight: 240 }}>
                {first.emoji}
              </div>
              <div className="body" style={{ alignSelf: 'center', padding: 36 }}>
                <span className="pill">{first.cat}</span>
                <h2 style={{ marginTop: 12 }}>{first.title}</h2>
                <p className="muted">{first.excerpt}</p>
                <span className="small muted">
                  {first.date} · {first.read} {t('de lectura', 'read')}
                </span>
              </div>
            </Link>
          ) : null}
          <div className="grid g3">
            {rest.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="card card-link post-card">
                <div className="post-cover" style={{ background: p.color }}>
                  {p.emoji}
                </div>
                <div className="body">
                  <span className="pill">{p.cat}</span>
                  <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                  <p className="muted small">{p.excerpt}</p>
                  <span className="small muted">
                    {p.date} · {p.read}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}

function Newsletter() {
  const t = useT();
  const [done, setDone] = useState(false);
  return (
    <section className="section alt">
      <div className="container narrow center">
        <h2>{t('Recibe lo mejor de Vida Datecito', 'Get the best of Datecito Life')}</h2>
        <p className="lead">{t('Un correo al mes con consejos, ideas de datecito y novedades. Sin spam.', 'One email a month with tips, date ideas and news. No spam.')}</p>
        {done ? (
          <div className="notice green">{t('¡Gracias! Revisa tu correo para confirmar tu suscripción.', 'Thanks! Check your inbox to confirm your subscription.')}</div>
        ) : (
          <form
            className="btn-row"
            style={{ justifyContent: 'center' }}
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <input className="input" type="email" required placeholder={t('tu@correo.com', 'you@email.com')} style={{ maxWidth: 340 }} aria-label={t('Correo electrónico', 'Email')} />
            <button className="btn btn-primary">{t('Suscribirme', 'Subscribe')}</button>
          </form>
        )}
        <p className="small muted" style={{ marginTop: 12 }}>
          {t('Al suscribirte aceptas el', 'By subscribing you accept the')}{' '}
          <Link className="link" to="/legal/privacidad">
            {t('Aviso de privacidad', 'Privacy Notice')}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const t = useT();
  const { toast } = useApp();
  const { posts } = useContent();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <NotFound />;
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);
  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast(t('Enlace copiado.', 'Link copied.'));
  };
  return (
    <>
      <PageHero eyebrow={post.cat} title={post.title} lead={post.excerpt} crumbs={[{ label: 'Blog', to: '/blog' }, { label: post.cat }]}>
        <p className="small muted">
          {t('Por el equipo de Datecito', 'By the Datecito team')} · {post.date} · {post.read} {t('de lectura', 'read')}
        </p>
      </PageHero>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container narrow">
          <div className="post-cover" style={{ background: post.color, borderRadius: 24, fontSize: '6rem', marginBottom: 36 }}>
            {post.emoji}
          </div>
          <article className="article">
            <Blocks blocks={post.body} />
          </article>
          <div className="btn-row" style={{ marginTop: 36 }}>
            <span className="muted small" style={{ alignSelf: 'center' }}>
              {t('Compartir:', 'Share:')}
            </span>
            {(['whatsapp', 'x-logo', 'facebook'] as IconName[]).map((i) => (
              <button key={i} className="btn btn-ghost btn-sm" aria-label={t(`Compartir en ${i}`, `Share on ${i}`)} onClick={share}>
                <Icon name={i} size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={t('Sigue leyendo', 'Keep reading')} />
          <div className="grid g3">
            {more.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="card card-link post-card">
                <div className="post-cover" style={{ background: p.color }}>
                  {p.emoji}
                </div>
                <div className="body">
                  <h3>{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const tipSlugs = ['primer-mensaje-que-si-funciona', 'segunda-cita', 'citas-y-ansiedad'];

export function Consejos() {
  const t = useT();
  const { posts } = useContent();
  const tips: { icon: IconName; title: string; items: string[] }[] = [
    {
      icon: 'camera',
      title: t('Tu perfil', 'Your profile'),
      items: [t('Fotos recientes y con tu cara visible', 'Recent photos with your face visible'), t('Una foto haciendo algo que amas', 'A photo doing something you love'), t('Bio corta con un gancho para platicar', 'A short bio with a conversation hook'), t('Sé honest@ sobre lo que buscas', 'Be honest about what you’re looking for')],
    },
    {
      icon: 'chat',
      title: t('El primer mensaje', 'The first message'),
      items: [t('Comenta algo específico de su perfil', 'Mention something specific from their profile'), t('Pregunta algo fácil de responder', 'Ask something easy to answer'), t('Evita copiar y pegar el mismo mensaje', 'Avoid copy-pasting the same message'), t('Si no responde, no insistas', 'If they don’t reply, don’t push')],
    },
    {
      icon: 'coffee',
      title: t('El datecito', 'The date'),
      items: [t('Propón algo corto y en un lugar público', 'Suggest something short in a public place'), t('Llega por tu cuenta', 'Get there on your own'), t('Escucha tanto como hablas', 'Listen as much as you talk'), t('Deja el celular guardado', 'Keep your phone away')],
    },
    {
      icon: 'heart',
      title: t('Después', 'After'),
      items: [t('Si te gustó, dilo', 'If you liked them, say so'), t('Si no hubo química, dilo con amabilidad', 'If there was no chemistry, say so kindly'), t('Nada de ghosting después de verse', 'No ghosting after meeting'), t('Cuéntanos cómo te fue en el feedback', 'Tell us how it went in the feedback')],
    },
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Consejos para citas', 'Dating tips')}
        title={t('Del primer mensaje al segundo datecito', 'From the first message to the second date')}
        lead={t('Guía práctica para conocer gente con más confianza y menos estrés.', 'A practical guide to meeting people with more confidence and less stress.')}
        crumbs={[{ label: t('Aprende', 'Learn'), to: '/blog' }, { label: t('Consejos para citas', 'Dating tips') }]}
      />
      <section className="section">
        <div className="container grid g2">
          {tips.map((tip) => (
            <div className="card" key={tip.title}>
              <div className="icon-badge">
                <Icon name={tip.icon} size={26} />
              </div>
              <h3>{tip.title}</h3>
              <ul className="checklist">
                {tip.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={t('Artículos de consejos', 'Tip articles')} />
          <div className="grid g3">
            {posts
              .filter((p) => tipSlugs.includes(p.slug))
              .map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="card card-link">
                  <span className="pill">{p.cat}</span>
                  <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                  <p className="muted small">{p.excerpt}</p>
                </Link>
              ))}
          </div>
          <p className="center" style={{ marginTop: 28 }}>
            {t('¿Te preocupa tu seguridad? Lee los', 'Worried about your safety? Read the')}{' '}
            <Link className="link" to="/seguridad/consejos">
              {t('consejos de seguridad', 'safety tips')}
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Destinos() {
  const t = useT();
  const { cities } = useContent();
  return (
    <>
      <PageHero
        eyebrow={t('Destinos', 'Destinations')}
        title={t('Ideas de datecito en tu ciudad', 'Date ideas in your city')}
        lead={t('Datecito está creciendo. Descubre dónde estamos y qué planes te esperan.', 'Datecito is growing. See where we are and what plans await you.')}
        crumbs={[{ label: t('Destinos', 'Destinations') }]}
      />
      <section className="section">
        <div className="container grid g3">
          {cities.map((c) => {
            const soon = SOON.test(c.blurb);
            return (
              <Link key={c.slug} to={`/destinos/${c.slug}`} className="card card-link">
                <div className="tag-row">
                  <span className={`pill${soon ? ' gray' : ' green'}`}>{soon ? t('Próximamente', 'Coming soon') : t('Disponible', 'Available')}</span>
                </div>
                <h3>{c.name}</h3>
                <p className="muted small" style={{ marginBottom: 6 }}>
                  {c.state}
                </p>
                <p className="muted">{c.blurb.replace(SOON, '')}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Destino() {
  const { slug } = useParams();
  const t = useT();
  const { cities } = useContent();
  const c = cities.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  return (
    <>
      <PageHero eyebrow={c.state} title={t(`Datecito en ${c.name}`, `Datecito in ${c.name}`)} lead={c.blurb} crumbs={[{ label: t('Destinos', 'Destinations'), to: '/destinos' }, { label: c.name }]} />
      <section className="section">
        <div className="container narrow">
          <h2>{t('Ideas para tu datecito', 'Ideas for your date')}</h2>
          <div className="grid g2">
            {c.ideas.map((i) => (
              <div className="card" key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="icon-badge" style={{ margin: 0, flex: 'none' }}>
                  <Icon name="pin" />
                </div>
                <strong style={{ color: 'var(--verde)' }}>{i}</strong>
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 28 }}>
            {t('Para una primera cita elige lugares públicos y concurridos, llega por tu cuenta y activa', 'For a first date choose public, busy places, get there on your own and turn on')}{' '}
            <Link className="link" to="/seguridad">
              {t('Datecito Seguro', 'Datecito Safe')}
            </Link>
            .
          </div>
        </div>
      </section>
      <CtaBand title={t(`Conoce gente en ${c.name}`, `Meet people in ${c.name}`)} />
    </>
  );
}

export function Historias() {
  const t = useT();
  const { stories } = useContent();
  return (
    <>
      <PageHero
        eyebrow={t('Historias de éxito', 'Success stories')}
        title={t('Empezó con un datecito', 'It started with a date')}
        lead={t('Historias ilustrativas inspiradas en nuestra comunidad beta. ¿Tienes la tuya? Cuéntanosla.', 'Illustrative stories inspired by our beta community. Have your own? Tell us.')}
        crumbs={[{ label: t('Historias de éxito', 'Success stories') }]}
      >
        <div className="btn-row">
          <a className="btn btn-primary" href="mailto:historias@datecito.com">
            {t('Compartir mi historia', 'Share my story')}
          </a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container grid g3">
          {stories.map((s) => (
            <blockquote className="card quote" key={s.names} style={{ margin: 0 }}>
              “{s.text}”
              <footer>
                <div className="avatar">{s.initials}</div>
                <div>
                  {s.names}
                  <span>{s.city}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
