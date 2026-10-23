import { useState } from 'react';

import { useApp } from '../components/AppState';
import { Icon } from '../components/Icon';
import { CtaBand, FeatureCard, Logo, PageHero, PhoneSwipe, SectionHead, StoreButtons } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import { company } from '../site';

function useCo() {
  const t = useT();
  return { label: t('Empresa', 'Company'), to: '/nosotros' };
}

export function Nosotros() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t('Acerca de Datecito', 'About Datecito')}
        title={t('Creemos en los planes de verdad', 'We believe in real plans')}
        lead={t('Datecito nació en México con una idea simple: conocer gente debería terminar en un buen plan, no en un chat eterno.', 'Datecito was born in Mexico with a simple idea: meeting people should end in a good plan, not an endless chat.')}
        crumbs={[{ label: t('Acerca de', 'About') }]}
      />
      <section className="section">
        <div className="container split">
          <div>
            <h2>{t('Nuestra misión', 'Our mission')}</h2>
            <p className="lead">{t('Ayudar a las personas a pasar del match a un datecito real, con respeto, seguridad y cariño por los detalles.', 'Help people go from match to a real date, with respect, safety and care for the details.')}</p>
            <p>
              {t(
                'Somos un equipo pequeño de diseño, ingeniería y seguridad que usa Datecito todos los días. Construimos herramientas que nos gustaría tener: proponer planes sin incomodidad, saber que hablamos con personas reales y salir con la tranquilidad de que alguien sabe dónde estamos.',
                'We’re a small team of design, engineering and safety people who use Datecito every day. We build the tools we’d want ourselves: proposing plans without awkwardness, knowing we’re talking to real people and going out knowing someone knows where we are.',
              )}
            </p>
          </div>
          <div className="stats">
            {[
              ['2026', t('Año de fundación', 'Year founded')],
              ['3', t('Ciudades en beta', 'Beta cities')],
              ['24/7', t('Moderación', 'Moderation')],
              ['100%', t('Hecho en México', 'Made in Mexico')],
            ].map(([a, b]) => (
              <div className="stat" key={b}>
                <strong>{a}</strong>
                <span className="muted">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={t('Nuestros valores', 'Our values')} />
          <div className="grid g4">
            <FeatureCard icon="heart" title={t('Calidez', 'Warmth')}>
              {t('Hablamos claro y cercano, como un buen amigo.', 'We speak clearly and warmly, like a good friend.')}
            </FeatureCard>
            <FeatureCard icon="shield" title={t('Seguridad primero', 'Safety first')}>
              {t('Cada función se piensa desde la seguridad de quien la usa.', 'Every feature is designed around the safety of the person using it.')}
            </FeatureCard>
            <FeatureCard icon="users" title={t('Inclusión', 'Inclusion')}>
              {t('Datecito es para todas las personas, sin importar quiénes son o a quién aman.', 'Datecito is for everyone, no matter who they are or who they love.')}
            </FeatureCard>
            <FeatureCard icon="lock" title={t('Privacidad', 'Privacy')}>
              {t('Tus datos son tuyos. No los vendemos.', 'Your data is yours. We don’t sell it.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <CtaBand title={t('¿Quieres construir Datecito con nosotros?', 'Want to build Datecito with us?')} text={t('Revisa nuestras vacantes abiertas.', 'Check out our open roles.')} />
    </>
  );
}

export function Empleos() {
  const t = useT();
  const co = useCo();
  const { jobs } = useContent();
  const all = t('Todos', 'All');
  const teams = [all, ...new Set(jobs.map((j) => j.team))];
  const [picked, setTeam] = useState<string | null>(null);
  const team = picked && teams.includes(picked) ? picked : all;
  const list = team === all ? jobs : jobs.filter((j) => j.team === team);
  return (
    <>
      <PageHero dark eyebrow={t('Empleos', 'Careers')} title={t('Ayúdanos a crear más datecitos', 'Help us create more dates')} lead={t('Buscamos personas curiosas, empáticas y con ganas de construir algo que la gente ame.', 'We’re looking for curious, empathetic people who want to build something people love.')} crumbs={[co, { label: t('Empleos', 'Careers') }]}>
        <div className="btn-row">
          <a href="#vacantes" className="btn btn-primary">
            {t('Ver vacantes', 'See open roles')}
          </a>
          <Link to="/tecnologia" className="btn btn-ghost">
            {t('Blog de tecnología', 'Tech blog')}
          </Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead title={t('Beneficios', 'Benefits')} />
          <div className="grid g4">
            <FeatureCard icon="globe" title={t('Trabajo híbrido o remoto', 'Hybrid or remote work')}>
              {t('Flexibilidad real según tu rol.', 'Real flexibility depending on your role.')}
            </FeatureCard>
            <FeatureCard icon="heart" title={t('Seguro de gastos médicos', 'Health insurance')}>
              {t('Para ti y tus dependientes.', 'For you and your dependents.')}
            </FeatureCard>
            <FeatureCard icon="sparkle" title={t('Presupuesto de aprendizaje', 'Learning budget')}>
              {t('Cursos, libros y conferencias.', 'Courses, books and conferences.')}
            </FeatureCard>
            <FeatureCard icon="coffee" title={t('Datecito con el equipo', 'Team datecito')}>
              {t('Un plan de equipo al mes, invitamos nosotros.', 'A team outing every month, on us.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section alt" id="vacantes">
        <div className="container">
          <SectionHead title={t('Vacantes abiertas', 'Open roles')} />
          <div className="tag-row" style={{ justifyContent: 'center' }}>
            {teams.map((x) => (
              <button key={x} className={`btn btn-sm ${team === x ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setTeam(x)}>
                {x}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
            {list.map((j) => (
              <div className="card job" key={j.id} style={{ padding: 22 }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{j.title}</h3>
                  <span className="muted small">
                    {j.team} · {j.place} · {j.type}
                  </span>
                </div>
                <a className="btn btn-primary btn-sm" href={`mailto:${company.emails.jobs}?subject=${encodeURIComponent(t('Postulación: ', 'Application: ') + j.title)}`}>
                  {t('Postularme', 'Apply')}
                </a>
              </div>
            ))}
          </div>
          <p className="center muted" style={{ marginTop: 24 }}>
            {t('¿No ves tu rol? Escríbenos a', 'Don’t see your role? Write to')}{' '}
            <a className="link" href={`mailto:${company.emails.jobs}`}>
              {company.emails.jobs}
            </a>
            . {t('Datecito es un empleador que ofrece igualdad de oportunidades.', 'Datecito is an equal opportunity employer.')}
          </p>
        </div>
      </section>
    </>
  );
}

export function Tecnologia() {
  const t = useT();
  const co = useCo();
  const { techPosts } = useContent();
  return (
    <>
      <PageHero eyebrow={t('Blog de tecnología', 'Tech blog')} title={t('Cómo construimos Datecito', 'How we build Datecito')} lead={t('Ingeniería, datos, diseño y seguridad detrás de cada match.', 'The engineering, data, design and security behind every match.')} crumbs={[co, { label: t('Tecnología', 'Tech') }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow" style={{ display: 'grid', gap: 14 }}>
          {techPosts.map((p) => (
            <div className="card" key={p.title}>
              <span className="pill green">{p.tag}</span>
              <h3 style={{ marginTop: 10 }}>{p.title}</h3>
              <span className="muted small">
                {p.date} · {t('Próximamente', 'Coming soon')}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow center">
          <h2>{t('Nuestro stack', 'Our stack')}</h2>
          <div className="tag-row" style={{ justifyContent: 'center' }}>
            {['React Native', 'Expo', 'TypeScript', 'React', 'PHP', 'Laravel', 'MySQL', 'Docker', 'EAS'].map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>
          <Link to="/empleos" className="btn btn-dark" style={{ marginTop: 20 }}>
            {t('Únete al equipo', 'Join the team')}
          </Link>
        </div>
      </section>
    </>
  );
}

export function Prensa() {
  const t = useT();
  const co = useCo();
  const { press } = useContent();
  return (
    <>
      <PageHero
        eyebrow={t('Sala de prensa', 'Press room')}
        title={t('Noticias de Datecito', 'Datecito news')}
        lead={t(`Para entrevistas y solicitudes de medios escribe a ${company.emails.press}.`, `For interviews and media requests write to ${company.emails.press}.`)}
        crumbs={[co, { label: t('Prensa', 'Press') }]}
      >
        <div className="btn-row">
          <a className="btn btn-primary" href={`mailto:${company.emails.press}`}>
            {t('Contactar a prensa', 'Contact press')}
          </a>
          <Link className="btn btn-ghost" to="/marca">
            {t('Kit de prensa', 'Press kit')}
          </Link>
        </div>
      </PageHero>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow" style={{ display: 'grid', gap: 14 }}>
          {press.map((p) => (
            <article className="card" key={p.title}>
              <span className="muted small">
                {p.date} · {t('Comunicado', 'Press release')}
              </span>
              <h3 style={{ marginTop: 6 }}>{p.title}</h3>
              <p className="muted">{p.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function Alianzas() {
  const { toast } = useApp();
  const t = useT();
  const co = useCo();
  return (
    <>
      <PageHero
        eyebrow={t('Alianzas y negocios', 'Partnerships')}
        title={t('Lleva tu marca al próximo datecito', 'Bring your brand to the next date')}
        lead={t('Restaurantes, cafés, museos, marcas y organizaciones: trabajemos juntos para crear mejores planes.', 'Restaurants, cafés, museums, brands and organizations: let’s work together to create better plans.')}
        crumbs={[co, { label: t('Alianzas', 'Partnerships') }]}
      />
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="pin" title={t('Lugares para datecitos', 'Date venues')}>
            {t('Aparece como sugerencia de lugar cuando las personas proponen un plan.', 'Show up as a suggested venue when people propose a plan.')}
          </FeatureCard>
          <FeatureCard icon="gift" title={t('Promociones', 'Promotions')}>
            {t('Ofrece beneficios exclusivos a la comunidad Datecito.', 'Offer exclusive perks to the Datecito community.')}
          </FeatureCard>
          <FeatureCard icon="handshake" title={t('Causas y seguridad', 'Causes and safety')}>
            {t('Colabora con nosotros en campañas de seguridad y bienestar.', 'Partner with us on safety and wellbeing campaigns.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <form
            className="card form"
            onSubmit={(e) => {
              e.preventDefault();
              toast(t('¡Gracias! Nuestro equipo de alianzas te contactará pronto.', 'Thanks! Our partnerships team will contact you soon.'));
              (e.target as HTMLFormElement).reset();
            }}
          >
            <h3>{t('Cuéntanos de tu propuesta', 'Tell us about your proposal')}</h3>
            <div className="form-row">
              <label className="field">
                {t('Empresa', 'Company')}
                <input className="input" required />
              </label>
              <label className="field">
                {t('Correo de contacto', 'Contact email')}
                <input className="input" type="email" required />
              </label>
            </div>
            <label className="field">
              {t('Ciudad', 'City')}
              <input className="input" />
            </label>
            <label className="field">
              {t('Propuesta', 'Proposal')}
              <textarea className="input" required />
            </label>
            <button className="btn btn-primary">{t('Enviar', 'Send')}</button>
          </form>
        </div>
      </section>
    </>
  );
}

export function Marca() {
  const t = useT();
  const co = useCo();
  const colors = [
    [t('Verde Datecito', 'Datecito Green'), '#0F3D32'],
    ['Coral', '#FF6B6B'],
    [t('Durazno', 'Peach'), '#FFD6CC'],
    [t('Crema', 'Cream'), '#F9F3EC'],
    [t('Arena', 'Sand'), '#D7C9BD'],
  ];
  return (
    <>
      <PageHero eyebrow={t('Recursos de marca', 'Brand assets')} title={t('Kit de marca', 'Brand kit')} lead={t('Logotipos, colores y lineamientos para usar la marca Datecito correctamente.', 'Logos, colors and guidelines for using the Datecito brand correctly.')} crumbs={[co, { label: t('Marca', 'Brand') }]} />
      <section className="section">
        <div className="container grid g3">
          <div className="card center" style={{ padding: 40 }}>
            <Logo size={40} />
            <p className="muted small" style={{ marginTop: 16 }}>
              {t('Logotipo principal', 'Primary logo')}
            </p>
          </div>
          <div className="card center" style={{ padding: 40, background: 'var(--verde)' }}>
            <Logo size={40} light />
            <p className="small" style={{ marginTop: 16, color: 'var(--crema)' }}>
              {t('Sobre fondo oscuro', 'On dark background')}
            </p>
          </div>
          <div className="card center" style={{ padding: 40 }}>
            <img src="/icon.png" alt={t('Ícono de Datecito', 'Datecito icon')} width={96} height={96} style={{ margin: '0 auto', borderRadius: 26 }} />
            <p className="muted small" style={{ marginTop: 16 }}>
              {t('Ícono de app', 'App icon')}
            </p>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={t('Colores', 'Colors')} />
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {colors.map(([n, h]) => (
              <div key={h}>
                <div className="swatch" style={{ background: h }} />
                <strong style={{ color: 'var(--verde)' }}>{n}</strong>
                <div className="muted small">{h}</div>
              </div>
            ))}
          </div>
          <SectionHead title={t('Tipografía', 'Typography')} />
          <div className="card">
            <p style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--verde)', margin: 0 }}>Nunito Sans</p>
            <p className="muted">{t('Display 800 · Títulos 700 · Subtítulos 600 · Texto 400', 'Display 800 · Headings 700 · Subheadings 600 · Body 400')}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <h2>{t('Lineamientos', 'Guidelines')}</h2>
          <ul className="checklist">
            <li>{t('Respeta el área de protección alrededor del logotipo.', 'Respect the clear space around the logo.')}</li>
            <li>{t('Usa el logotipo sólo en los colores oficiales.', 'Use the logo only in the official colors.')}</li>
          </ul>
          <ul className="checklist x">
            <li>{t('No deformes, rotes ni cambies las proporciones.', 'Don’t distort, rotate or change the proportions.')}</li>
            <li>{t('No uses la marca para sugerir patrocinio sin autorización.', 'Don’t use the brand to imply sponsorship without authorization.')}</li>
          </ul>
          <p>
            {t('Para solicitar el kit completo en alta resolución escribe a', 'To request the full high-resolution kit write to')}{' '}
            <a className="link" href={`mailto:${company.emails.press}`}>
              {company.emails.press}
            </a>
            . {t('Consulta también la', 'See also the')}{' '}
            <Link className="link" to="/legal/propiedad-intelectual">
              {t('Política de propiedad intelectual', 'Intellectual Property Policy')}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

export function Descargar() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t('Descargar', 'Download')}
        title={t('Lleva Datecito en tu bolsillo', 'Take Datecito in your pocket')}
        lead={t('Disponible muy pronto en Android y iPhone. Escanea el código o elige tu tienda.', 'Coming very soon to Android and iPhone. Scan the code or pick your store.')}
        crumbs={[{ label: t('Descargar', 'Download') }]}
        aside={<PhoneSwipe />}
      >
        <div style={{ marginTop: 24 }}>
          <StoreButtons dark />
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 28 }}>
          <QrPlaceholder />
          <p className="muted small" style={{ maxWidth: 220 }}>
            {t('Escanea con la cámara de tu teléfono para descargar Datecito.', 'Scan with your phone’s camera to download Datecito.')}
          </p>
        </div>
      </PageHero>
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="play" title="Android">
            {t('Android 8.0 o superior. Descarga desde Google Play.', 'Android 8.0 or later. Download from Google Play.')}
          </FeatureCard>
          <FeatureCard icon="apple" title="iPhone">
            {t('iOS 16 o superior. Descarga desde App Store.', 'iOS 16 or later. Download from the App Store.')}
          </FeatureCard>
          <FeatureCard icon="shield" title={t('Sólo en la app', 'App only')}>
            {t('Tu cuenta, tus matches y tus chats viven en la app. Este sitio es informativo.', 'Your account, matches and chats live in the app. This site is informational.')}
          </FeatureCard>
        </div>
      </section>
    </>
  );
}

function QrPlaceholder() {
  const t = useT();
  // Patrón decorativo: se sustituirá por el QR real del enlace de descarga.
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 7919) % 13) % 3 === 0);
  const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
  return (
    <div className="qr" aria-label={t('Código QR de descarga (próximamente)', 'Download QR code (coming soon)')} role="img">
      <svg viewBox="0 0 11 11" width="100%" height="100%" shapeRendering="crispEdges">
        {cells.map((on, i) => {
          const r = Math.floor(i / 11);
          const c = i % 11;
          return on || finder(r, c) ? <rect key={i} x={c} y={r} width="1" height="1" fill="#0F3D32" /> : null;
        })}
      </svg>
    </div>
  );
}

export function CodigoPromo() {
  const t = useT();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <>
      <PageHero
        eyebrow={t('Código promocional', 'Promo code')}
        title={t('Canjea tu código', 'Redeem your code')}
        lead={t('¿Tienes un código de regalo o promoción? Así lo aplicas a tu cuenta.', 'Have a gift or promo code? Here’s how to apply it to your account.')}
        crumbs={[{ label: t('Código promocional', 'Promo code') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <form
            className="card form"
            onSubmit={(e) => {
              e.preventDefault();
              setMsg(
                code.trim().length < 6
                  ? t('El código debe tener al menos 6 caracteres.', 'The code must be at least 6 characters.')
                  : t('Los códigos se canjean dentro de la app: Perfil › Membresía › Código promocional.', 'Codes are redeemed in the app: Profile › Membership › Promo code.'),
              );
            }}
          >
            <label className="field">
              {t('Código', 'Code')}
              <input className="input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DATECITO2026" required style={{ letterSpacing: 2, fontWeight: 800 }} />
            </label>
            <button className="btn btn-primary">
              <Icon name="ticket" /> {t('Validar', 'Check')}
            </button>
            {msg ? <div className="notice">{msg}</div> : null}
            <p className="small muted" style={{ margin: 0 }}>
              {t('Los códigos están sujetos a los', 'Codes are subject to the')}{' '}
              <Link className="link" to="/legal/suscripciones">
                {t('Términos de suscripción', 'Subscription terms')}
              </Link>
              . {t('Un código por cuenta, sin valor en efectivo.', 'One code per account, no cash value.')}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
