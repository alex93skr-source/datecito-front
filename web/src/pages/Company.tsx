import { Icon } from '../components/Icon';
import { FormError, Honeypot, useWebForm } from '../components/forms';
import { CtaBand, FeatureCard, Logo, PageHero, PhoneSwipe, SectionHead, StoreButtons } from '../components/ui';
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
                'Somos un equipo pequeño que está construyendo Datecito desde el área metropolitana de la Ciudad de México. Hacemos las herramientas que nos gustaría tener: proponer planes sin incomodidad, saber que hablamos con personas reales y salir con la tranquilidad de que alguien de confianza sabe dónde estamos.',
                'We’re a small team building Datecito from the Mexico City metro area. We build the tools we’d want ourselves: proposing plans without awkwardness, knowing we’re talking to real people and going out knowing someone we trust knows where we are.',
              )}
            </p>
            <p>
              {t(
                'Estamos empezando. Eso significa que cada reporte lo lee una persona, cada verificación la revisa una persona y cada mensaje que nos escribes llega a quienes hacen la app.',
                'We’re just getting started. That means every report is read by a person, every verification is reviewed by a person and every message you send us reaches the people who make the app.',
              )}
            </p>
          </div>
          <div className="stats">
            {[
              ['2026', t('Nacimos este año', 'Founded this year')],
              ['CDMX', t('Empezamos en el área metropolitana', 'Starting in the metro area')],
              ['18+', t('Sólo mayores de edad', 'Adults only')],
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
              {t('Hablamos claro y cercano, como una buena amiga o un buen amigo.', 'We speak clearly and warmly, like a good friend.')}
            </FeatureCard>
            <FeatureCard icon="shield" title={t('Seguridad primero', 'Safety first')}>
              {t('Cada función se piensa desde la seguridad de quien la usa, y lo que te protege siempre es gratis.', 'Every feature is designed around the safety of the person using it, and what protects you is always free.')}
            </FeatureCard>
            <FeatureCard icon="users" title={t('Inclusión', 'Inclusion')}>
              {t('Datecito es para todas las personas, sin importar quiénes son o a quién aman.', 'Datecito is for everyone, no matter who they are or who they love.')}
            </FeatureCard>
            <FeatureCard icon="lock" title={t('Privacidad', 'Privacy')}>
              {t('Tus datos son tuyos. No los vendemos, no mostramos tu ubicación exacta y tus chats se guardan cifrados.', 'Your data is yours. We don’t sell it, we never show your exact location and your chats are stored encrypted.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <CtaBand title={t('¿Quieres platicar con nosotros?', 'Want to talk to us?')} text={t('Prensa, alianzas o simplemente una idea: te leemos.', 'Press, partnerships or just an idea: we’re listening.')} />
    </>
  );
}

export function Prensa() {
  const t = useT();
  const co = useCo();
  return (
    <>
      <PageHero
        eyebrow={t('Prensa', 'Press')}
        title={t('Datecito para medios', 'Datecito for the press')}
        lead={t('Somos una app de citas mexicana, nueva y pequeña, con una apuesta clara: perfiles reales verificados por personas y herramientas de seguridad para cada cita.', 'We’re a new, small Mexican dating app with a clear bet: real profiles verified by people and safety tools for every date.')}
        crumbs={[co, { label: t('Prensa', 'Press') }]}
      >
        <div className="btn-row">
          <a className="btn btn-primary" href={`mailto:${company.emails.press}`}>
            {t('Escribir a prensa', 'Email press')}
          </a>
          <Link className="btn btn-ghost" to="/marca">
            {t('Recursos de marca', 'Brand assets')}
          </Link>
        </div>
      </PageHero>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container grid g3">
          <FeatureCard icon="shield" title={t('Qué nos distingue', 'What sets us apart')}>
            {t('Verificación con selfie y pose al azar revisada por personas, Datecito Seguro con aviso por WhatsApp y un ritmo diario que premia la intención sobre el volumen.', 'Selfie verification with a random pose reviewed by people, Datecito Safe with WhatsApp alerts, and a daily pace that rewards intention over volume.')}
          </FeatureCard>
          <FeatureCard icon="pin" title={t('Dónde estamos', 'Where we are')}>
            {t('Empezamos en el área metropolitana de la Ciudad de México, con planes de crecer a otras ciudades de México.', 'We’re starting in the Mexico City metro area, with plans to grow to other cities in Mexico.')}
          </FeatureCard>
          <FeatureCard icon="chat" title={t('Entrevistas y datos', 'Interviews and data')}>
            {t(`Escríbenos a ${company.emails.press}. Respondemos en días hábiles y compartimos cifras sólo cuando sean reales y verificables.`, `Write to ${company.emails.press}. We reply on business days and share figures only when they’re real and verifiable.`)}
          </FeatureCard>
        </div>
      </section>
    </>
  );
}

export function Alianzas() {
  const t = useT();
  const co = useCo();
  const form = useWebForm('partners');
  return (
    <>
      <PageHero
        eyebrow={t('Alianzas y negocios', 'Partnerships')}
        title={t('Hagamos mejores datecitos juntos', 'Let’s make better dates together')}
        lead={t('Cafés, restaurantes, bares, espacios culturales, marcas y organizaciones: si tu lugar o tu causa va con una primera cita, queremos conocerte.', 'Cafés, restaurants, bars, cultural venues, brands and organizations: if your place or your cause fits a first date, we want to meet you.')}
        crumbs={[co, { label: t('Alianzas', 'Partnerships') }]}
      />
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="pin" title={t('Lugares para datecitos', 'Date venues')}>
            {t('Queremos recomendar lugares seguros, bien iluminados y con buen trato para una primera cita, en nuestro blog y guías por ciudad.', 'We want to recommend safe, well-lit, welcoming places for a first date in our blog and city guides.')}
          </FeatureCard>
          <FeatureCard icon="gift" title={t('Promociones', 'Promotions')}>
            {t('Beneficios para la comunidad Datecito, como un descuento al mostrar un datecito confirmado.', 'Perks for the Datecito community, like a discount for showing a confirmed date.')}
          </FeatureCard>
          <FeatureCard icon="handshake" title={t('Causas y seguridad', 'Causes and safety')}>
            {t('Colaboraciones con organizaciones de prevención de violencia, salud y bienestar.', 'Collaborations with violence-prevention, health and wellbeing organizations.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          {form.sent ? (
            <div className="card center">
              <div className="icon-badge green" style={{ margin: '0 auto 16px' }}>
                <Icon name="check" size={26} />
              </div>
              <h3>{t('¡Gracias! Recibimos tu propuesta.', 'Thanks! We received your proposal.')}</h3>
              <p className="muted">
                {t('Folio', 'Reference')} <strong>{form.folio}</strong>. {t('Te escribimos al correo que nos dejaste en los próximos días hábiles.', 'We’ll write to the email you gave us within the next few business days.')}
              </p>
              <button className="btn btn-ghost" onClick={form.reset}>
                {t('Enviar otra propuesta', 'Send another proposal')}
              </button>
            </div>
          ) : (
            <form className="card form" onSubmit={form.submit}>
              <h3>{t('Cuéntanos de tu propuesta', 'Tell us about your proposal')}</h3>
              <Honeypot />
              <div className="form-row">
                <label className="field">
                  {t('Empresa u organización', 'Company or organization')}
                  <input className="input" name="company" required maxLength={120} />
                </label>
                <label className="field">
                  {t('Tu nombre', 'Your name')}
                  <input className="input" name="name" required maxLength={120} autoComplete="name" />
                </label>
              </div>
              <div className="form-row">
                <label className="field">
                  {t('Correo de contacto', 'Contact email')}
                  <input className="input" name="email" type="email" required autoComplete="email" />
                </label>
                <label className="field">
                  {t('Ciudad', 'City')}
                  <input className="input" name="city" maxLength={80} />
                </label>
              </div>
              <label className="field">
                {t('Propuesta', 'Proposal')}
                <textarea className="input" name="message" required minLength={10} maxLength={4000} rows={5} />
              </label>
              <FormError message={form.error} />
              <button className="btn btn-primary" disabled={form.sending}>
                {form.sending ? t('Enviando…', 'Sending…') : t('Enviar', 'Send')}
              </button>
            </form>
          )}
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
        lead={t('Muy pronto en Google Play y App Store. Primero llega a Android; iPhone viene después.', 'Coming very soon to Google Play and the App Store. Android comes first; iPhone follows.')}
        crumbs={[{ label: t('Descargar', 'Download') }]}
        aside={<PhoneSwipe />}
      >
        <div style={{ marginTop: 24 }}>
          <StoreButtons dark />
        </div>
      </PageHero>
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="play" title="Android">
            {t('Android 7.0 o más reciente. Descarga desde Google Play.', 'Android 7.0 or later. Download from Google Play.')}
          </FeatureCard>
          <FeatureCard icon="apple" title="iPhone">
            {t('iOS 15.1 o más reciente. Descarga desde App Store.', 'iOS 15.1 or later. Download from the App Store.')}
          </FeatureCard>
          <FeatureCard icon="shield" title={t('Sólo en la app', 'App only')}>
            {t('Tu cuenta, tus matches y tus chats viven en la app. Este sitio es informativo.', 'Your account, matches and chats live in the app. This site is informational.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow center">
          <h2>{t('¿Quieres que te avisemos?', 'Want us to let you know?')}</h2>
          <p className="lead">{t('Escríbenos y te avisamos por correo el día que Datecito esté disponible.', 'Write to us and we’ll email you the day Datecito is available.')}</p>
          <Link to="/contacto" className="btn btn-dark">
            {t('Ir a contacto', 'Go to contact')}
          </Link>
        </div>
      </section>
    </>
  );
}
