import { Fragment, type ReactNode } from 'react';

import { Link, useT } from '../i18n';
import { useApp } from './AppState';
import { Icon, type IconName } from './Icon';

export function Logo({ size = 28, light = false }: { size?: number; light?: boolean }) {
  return (
    <span className={`logo${light ? ' light' : ''}`} style={{ fontSize: size }}>
      Datecito
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" style={{ marginTop: -size * 0.12, marginLeft: size * 0.04 }} aria-hidden>
        <path fill="#FF6B6B" d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4 7.1 4c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.5 0 5.7 3.6 4.4 7.1C19.5 15.9 12 20.5 12 20.5z" />
      </svg>
      <svg width={size * 0.32} height={size * 0.42} viewBox="0 0 10 14" style={{ marginTop: -size * 0.2 }} aria-hidden>
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 3.5L7 1.5M2 7h6M2 10.5l5 2" />
        </g>
      </svg>
    </span>
  );
}

export function StoreButtons({ center, dark }: { center?: boolean; dark?: boolean }) {
  const { toast } = useApp();
  const t = useT();
  const soon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast(t('Datecito llega muy pronto a las tiendas. ¡Gracias por la paciencia!', 'Datecito is coming to the stores very soon. Thanks for your patience!'));
  };
  const style = dark ? { background: 'var(--verde)' } : undefined;
  return (
    <div className="btn-row" style={{ justifyContent: center ? 'center' : undefined }}>
      <a className="store" href="#" onClick={soon} style={style} aria-label={t('Descargar en App Store', 'Download on the App Store')}>
        <Icon name="apple" size={26} />
        <span>
          <small>{t('Descárgalo en el', 'Download on the')}</small>
          <strong>App Store</strong>
        </span>
      </a>
      <a className="store" href="#" onClick={soon} style={style} aria-label={t('Disponible en Google Play', 'Get it on Google Play')}>
        <Icon name="play" size={24} />
        <span>
          <small>{t('Disponible en', 'Get it on')}</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
}

export type Crumb = { to?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useT();
  return (
    <nav className="breadcrumbs" aria-label={t('Ruta', 'Breadcrumb')}>
      <Link to="/">{t('Inicio', 'Home')}</Link>
      {items.map((c) => (
        <Fragment key={c.label}>
          <span aria-hidden>›</span>
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  dark,
  children,
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  dark?: boolean;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const body = (
    <div>
      {crumbs ? <Breadcrumbs items={crumbs} /> : null}
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
      {children}
    </div>
  );
  return (
    <section className={`page-hero${dark ? ' dark' : ''}`}>
      <div className="container">
        {aside ? (
          <div className="split">
            {body}
            {aside}
          </div>
        ) : (
          body
        )}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, center = true }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? 'center' : undefined} style={{ marginBottom: 44 }}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}

export function FeatureCard({ icon, title, children, to, green }: { icon: IconName; title: string; children: ReactNode; to?: string; green?: boolean }) {
  const t = useT();
  const inner = (
    <>
      <div className={`icon-badge${green ? ' green' : ''}`}>
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      <div className="muted">{children}</div>
      {to ? (
        <span className="link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
          {t('Saber más', 'Learn more')} <Icon name="arrow" size={16} />
        </span>
      ) : null}
    </>
  );
  return to ? (
    <Link to={to} className="card card-link">
      {inner}
    </Link>
  ) : (
    <div className="card">{inner}</div>
  );
}

export type QA = { q: string; a: ReactNode };

export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="faq">
      {items.map((i) => (
        <details key={i.q}>
          <summary>{i.q}</summary>
          <div>{i.a}</div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const t = useT();
  return (
    <section className="section tight">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>{title ?? t('¿List@ para tu próximo datecito?', 'Ready for your next date?')}</h2>
            <p>{text ?? t('Descarga la app, crea tu cuenta gratis durante el lanzamiento y empieza a conocer gente cerca de ti.', "Get the app, create your free account during launch and start meeting people near you.")}</p>
          </div>
          <div className="btn-row">
            <Link to="/descargar" className="btn btn-light">
              {t('Descargar la app', 'Get the app')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* —— Pantallas simuladas de la app —— */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone" aria-hidden>
      <div className="phone-screen">
        <div className="phone-top">
          <Logo size={18} />
          <Icon name="filter" size={18} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function PhoneSwipe() {
  const t = useT();
  return (
    <PhoneFrame>
      <div className="phone-card" style={{ backgroundImage: 'url(/welcome.jpg)' }}>
        <div className="info">
          <strong>
            Valeria, 27 <Icon name="shield" size={16} />
          </strong>
          <span>{t('A 3 km · Verificada · Ama el café de especialidad', '3 km away · Verified · Loves specialty coffee')}</span>
        </div>
      </div>
      <div className="phone-actions">
        <span style={{ color: 'var(--muted)' }}>
          <Icon name="x" />
        </span>
        <span style={{ color: '#3b82f6' }}>
          <Icon name="star-fill" />
        </span>
        <span className="big">
          <Icon name="heart-fill" size={26} />
        </span>
        <span style={{ color: '#a855f7' }}>
          <Icon name="bolt" />
        </span>
      </div>
    </PhoneFrame>
  );
}

export function PhoneChat() {
  const t = useT();
  return (
    <PhoneFrame>
      <div className="phone-row">
        <div className="avatar">M</div>
        <div>
          <strong style={{ color: 'var(--verde)' }}>Mateo</strong>
          <div className="muted" style={{ fontSize: '0.75rem' }}>
            {t('Match de hoy · Verificado', "Today's match · Verified")}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div className="bubble">{t('¡Hola! Vi que también te gustan los tacos al pastor 🌮', 'Hi! I saw you love tacos al pastor too 🌮')}</div>
        <div className="bubble me">{t('Son mi debilidad. ¿Tienes un lugar favorito?', 'They’re my weakness. Got a favorite spot?')}</div>
        <div className="bubble">{t('Uno en la Roma. ¿Te late ir el sábado?', 'One in Roma. Want to go on Saturday?')}</div>
        <div className="phone-row" style={{ border: '2px solid var(--coral)' }}>
          <Icon name="calendar" />
          <div>
            <strong style={{ color: 'var(--verde)' }}>{t('Datecito propuesto', 'Date proposed')}</strong>
            <div style={{ fontSize: '0.75rem' }}>{t('Tacos · Sáb 2:00 p.m. · Col. Roma', 'Tacos · Sat 2:00 p.m. · Roma')}</div>
          </div>
        </div>
        <div className="bubble me">{t('¡Acepto! 🎉', 'I’m in! 🎉')}</div>
      </div>
    </PhoneFrame>
  );
}

export function PhoneSafety() {
  const t = useT();
  const rows: [IconName, string][] = [
    ['share', t('Compartir mi plan', 'Share my plan')],
    ['phone', t('Llamada de salida', 'Exit call')],
    ['alert', t('Necesito ayuda', 'I need help')],
    ['users', t('Contactos de confianza (2)', 'Trusted contacts (2)')],
  ];
  return (
    <PhoneFrame>
      <div style={{ textAlign: 'center', color: 'var(--verde)' }}>
        <div className="icon-badge green" style={{ margin: '6px auto 8px' }}>
          <Icon name="shield" size={26} />
        </div>
        <strong>{t('Datecito Seguro activo', 'Datecito Safe is on')}</strong>
        <div className="muted" style={{ fontSize: '0.75rem' }}>
          {t('Check-in en 1 h 45 min', 'Check-in in 1 h 45 min')}
        </div>
      </div>
      <div className="phone-list">
        {rows.map(([i, label]) => (
          <div className="phone-row" key={label}>
            <Icon name={i} size={18} />
            <strong style={{ color: 'var(--verde)' }}>{label}</strong>
          </div>
        ))}
        <div className="phone-row" style={{ background: 'var(--danger)', color: '#fff', justifyContent: 'center' }}>
          <Icon name="phone" size={18} /> <strong>{t('Llamar al 911', 'Call 911')}</strong>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function PhoneNearby() {
  const t = useT();
  const people = [
    ['A', 'Andrea, 29', t('A 800 m · Disponible 2 h', '800 m away · Free for 2 h')],
    ['L', 'Luis, 31', t('A 1.2 km · Disponible 1 h', '1.2 km away · Free for 1 h')],
    ['S', 'Sofía, 26', t('A 2 km · Disponible 3 h', '2 km away · Free for 3 h')],
    ['D', 'Diego, 28', t('A 2.5 km · Disponible 2 h', '2.5 km away · Free for 2 h')],
  ];
  return (
    <PhoneFrame>
      <div className="pill green" style={{ alignSelf: 'flex-start' }}>
        <Icon name="radio" size={14} /> {t('Aquí y ahora · 2 h', 'Here & Now · 2 h')}
      </div>
      <div className="phone-list">
        {people.map(([a, n, m]) => (
          <div className="phone-row" key={n}>
            <div className="avatar">{a}</div>
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--verde)' }}>{n}</strong>
              <div className="muted" style={{ fontSize: '0.75rem' }}>
                {m}
              </div>
            </div>
            <Icon name="heart" size={18} />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* —— Texto con marcadores: [placeholder] resaltado, correos enlazados y **negritas** —— */

export function Rich({ text }: { text: string }) {
  const t = useT();
  const parts = text.split(/(\[[^\]]+\]|[\w.-]+@datecito\.com|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^\[[^\]]+\]$/.test(p))
          return (
            <span key={i} className="ph" title={t('Pendiente de completar con asesoría legal', 'Pending legal review')}>
              {p}
            </span>
          );
        if (/@datecito\.com$/.test(p))
          return (
            <a key={i} className="link" href={`mailto:${p}`}>
              {p}
            </a>
          );
        if (/^\*\*.+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
