import { DocPage } from '../components/Doc';
import { Icon, type IconName } from '../components/Icon';
import { Faq, FeatureCard, PageHero, PhoneSafety, SectionHead } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import { company } from '../site';

function useSc() {
  const t = useT();
  return { label: t('Seguridad', 'Safety'), to: '/seguridad' };
}

export function SafetyCenter() {
  const t = useT();
  const links: [string, IconName, string, string][] = [
    ['/seguridad/normas-de-la-comunidad', 'users', t('Normas de la comunidad', 'Community guidelines'), t('Lo que se vale y lo que no.', 'What’s OK and what’s not.')],
    ['/seguridad/politicas', 'scale', t('Seguridad y políticas', 'Safety & policy'), t('Cómo moderamos y tomamos decisiones.', 'How we moderate and make decisions.')],
    ['/seguridad/recursos', 'phone', t('Líneas de apoyo', 'Support hotlines'), t('Ayuda profesional y gratuita en México.', 'Free professional help in Mexico.')],
    ['/transparencia', 'chart', t('Informe de transparencia', 'Transparency report'), t('Cifras de moderación y requerimientos.', 'Moderation and request figures.')],
    ['/seguridad/autoridades', 'doc', t('Guía para autoridades', 'Law enforcement guide'), t('Requerimientos legales de información.', 'Legal requests for information.')],
    ['/seguridad-informatica', 'bug', t('Seguridad informática', 'Security'), t('Reporta una vulnerabilidad.', 'Report a vulnerability.')],
  ];
  return (
    <>
      <PageHero
        dark
        eyebrow={t('Centro de seguridad', 'Safety Center')}
        title={t('Conocer gente, con tranquilidad', 'Meet people, with peace of mind')}
        lead={t('Diseñamos Datecito para que te sientas segur@ antes, durante y después de cada datecito.', 'We designed Datecito so you feel safe before, during and after every date.')}
        crumbs={[{ label: t('Centro de seguridad', 'Safety Center') }]}
        aside={<PhoneSafety />}
      >
        <div className="btn-row">
          <Link to="/seguridad/consejos" className="btn btn-primary">
            {t('Consejos de seguridad', 'Safety tips')}
          </Link>
          <a href="tel:911" className="btn btn-ghost">
            {t('Emergencia: 911', 'Emergency: 911')}
          </a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Datecito Seguro', 'Datecito Safe')} title={t('Herramientas para cada cita', 'Tools for every date')} lead={t('Todo vive dentro de la app, a un toque de distancia.', 'It all lives in the app, one tap away.')} />
          <div className="grid g3">
            <FeatureCard icon="users" title={t('Contactos de confianza', 'Trusted contacts')}>
              {t('Elige hasta 5 personas que recibirán los detalles de tu plan cuando actives Datecito Seguro.', 'Choose up to 5 people who’ll get your plan details when you turn on Datecito Safe.')}
            </FeatureCard>
            <FeatureCard icon="share" title={t('Comparte tu plan', 'Share your plan')}>
              {t('Lugar, hora y con quién estarás, enviado por WhatsApp o SMS con un mensaje listo.', 'Place, time and who you’ll be with, sent by WhatsApp or SMS with a ready-made message.')}
            </FeatureCard>
            <FeatureCard icon="clock" title="Check-in">
              {t('Elige en 1, 2 o 3 horas confirmar que estás bien. Si no confirmas, te recordamos.', 'Choose to confirm you’re OK in 1, 2 or 3 hours. If you don’t, we remind you.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('Llamada de salida', 'Exit call')}>
              {t('Recibe una llamada simulada para irte sin dar explicaciones.', 'Get a simulated call so you can leave without explaining.')}
            </FeatureCard>
            <FeatureCard icon="alert" title={t('Necesito ayuda', 'I need help')}>
              {t('Prepara al instante un mensaje urgente para tus contactos con tu plan.', 'Instantly prepare an urgent message for your contacts with your plan.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('911 a un toque', '911 one tap away')}>
              {t('Acceso directo a emergencias desde la pantalla del datecito.', 'Direct access to emergency services from the date screen.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow={t('Siempre activas', 'Always on')} title={t('Protecciones en toda la app', 'Protections across the app')} />
          <div className="grid g4">
            <FeatureCard icon="shield" title={t('Verificación', 'Verification')} to="/verificacion">
              {t('Selfie que confirma que las fotos son reales.', 'A selfie that confirms photos are real.')}
            </FeatureCard>
            <FeatureCard icon="chat" title={t('Quién te escribe', 'Who messages you')} to="/ayuda/quien-me-escribe">
              {t('Sólo verificados o “yo escribo primero”.', 'Verified only or “I message first”.')}
            </FeatureCard>
            <FeatureCard icon="pin" title={t('Ubicación aproximada', 'Approximate location')} to="/ayuda/ubicacion">
              {t('Nunca mostramos tu ubicación exacta.', 'We never show your exact location.')}
            </FeatureCard>
            <FeatureCard icon="flag" title={t('Reportar y bloquear', 'Report and block')} to="/ayuda/reportar">
              {t('Anónimo, rápido y revisado por personas.', 'Anonymous, fast and reviewed by people.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid g3">
          {links.map(([to, i, title, d]) => (
            <FeatureCard key={to} icon={i} title={title} to={to} green>
              {d}
            </FeatureCard>
          ))}
        </div>
      </section>
    </>
  );
}

export function SafetyTips() {
  const t = useT();
  const sc = useSc();
  const groups: { title: string; icon: IconName; items: string[] }[] = [
    {
      title: t('Antes de conocerse', 'Before you meet'),
      icon: 'chat',
      items: [
        t('Mantén la conversación dentro de Datecito hasta que tengas confianza.', 'Keep the conversation on Datecito until you feel confident.'),
        t('Nunca envíes dinero, recargas, regalos ni datos bancarios, aunque la historia suene creíble.', 'Never send money, top-ups, gifts or bank details, even if the story sounds believable.'),
        t('No compartas tu domicilio, lugar de trabajo ni rutina diaria.', 'Don’t share your home address, workplace or daily routine.'),
        t('Haz una videollamada antes de verse.', 'Have a video call before meeting.'),
        t('Busca la insignia de verificación y desconfía de quien evita verificarse.', 'Look for the verification badge and be wary of people who avoid verifying.'),
        t('Investiga un poco: una búsqueda de su nombre o fotos puede revelar perfiles falsos.', 'Do a little research: searching their name or photos can reveal fake profiles.'),
      ],
    },
    {
      title: t('El día del datecito', 'On the day of the date'),
      icon: 'coffee',
      items: [
        t('Elige un lugar público, concurrido y que conozcas.', 'Choose a public, busy place you know.'),
        t('Activa Datecito Seguro y comparte tu plan con tus contactos de confianza.', 'Turn on Datecito Safe and share your plan with your trusted contacts.'),
        t('Llega y vete por tu cuenta. Ten tu celular con batería.', 'Arrive and leave on your own. Keep your phone charged.'),
        t('Cuida tu bebida y no la dejes sola. Modera el consumo de alcohol.', 'Watch your drink and don’t leave it unattended. Drink in moderation.'),
        t('No vayas a un lugar privado en la primera cita.', 'Don’t go somewhere private on a first date.'),
        t('Si te sientes incómod@, vete. Usa la llamada de salida si lo necesitas.', 'If you feel uncomfortable, leave. Use the exit call if you need it.'),
      ],
    },
    {
      title: t('Si algo no está bien', 'If something isn’t right'),
      icon: 'alert',
      items: [
        t('Si estás en peligro inmediato, llama al 911.', 'If you’re in immediate danger, call 911.'),
        t('Usa “Necesito ayuda” para avisar a tus contactos.', 'Use “I need help” to alert your contacts.'),
        t('Reporta el perfil en la app: es anónimo y lo revisamos con prioridad.', 'Report the profile in the app: it’s anonymous and we review it with priority.'),
        t('Guarda capturas de pantalla de mensajes y perfil.', 'Save screenshots of messages and the profile.'),
        t('Busca apoyo profesional en nuestras líneas de apoyo.', 'Get professional support through our hotlines.'),
      ],
    },
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Consejos de seguridad', 'Safety tips')}
        title={t('Cuídate antes, durante y después', 'Take care before, during and after')}
        lead={t('La mayoría de las personas en Datecito busca lo mismo que tú. Estos consejos te ayudan a disfrutar con tranquilidad.', 'Most people on Datecito are looking for the same thing as you. These tips help you enjoy it with peace of mind.')}
        crumbs={[sc, { label: t('Consejos de seguridad', 'Safety tips') }]}
      />
      <section className="section">
        <div className="container grid g3">
          {groups.map((g) => (
            <div className="card" key={g.title}>
              <div className="icon-badge">
                <Icon name={g.icon} size={26} />
              </div>
              <h3>{g.title}</h3>
              <ul className="checklist">
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <SectionHead title={t('Estafas comunes y cómo detectarlas', 'Common scams and how to spot them')} />
          <Faq
            items={[
              {
                q: t('Estafa romántica', 'Romance scam'),
                a: t(
                  'Alguien construye una relación rápida e intensa y después pide dinero por una emergencia, un viaje o un problema legal. Nunca envíes dinero a alguien que no conoces en persona.',
                  'Someone builds a fast, intense relationship and then asks for money for an emergency, a trip or a legal problem. Never send money to someone you haven’t met in person.',
                ),
              },
              {
                q: t('Inversiones y criptomonedas', 'Investments and crypto'),
                a: t('Te invitan a “invertir” en una plataforma que supuestamente les ha hecho ganar mucho. Es fraude. Repórtalo.', 'They invite you to “invest” in a platform that supposedly made them a lot of money. It’s fraud. Report it.'),
              },
              {
                q: t('Códigos de verificación', 'Verification codes'),
                a: t('Te piden “un código que te llegó por SMS”. Es un intento de robar tu cuenta de WhatsApp o Datecito. Nunca compartas códigos.', 'They ask for “a code you got by SMS”. It’s an attempt to steal your WhatsApp or Datecito account. Never share codes.'),
              },
              {
                q: t('Sextorsión', 'Sextortion'),
                a: t(
                  'Te piden fotos íntimas y luego amenazan con difundirlas si no pagas. No pagues, guarda evidencia, bloquea, reporta y denuncia ante la Policía Cibernética.',
                  'They ask for intimate photos and then threaten to share them unless you pay. Don’t pay, keep evidence, block, report and file a complaint with the Cyber Police.',
                ),
              },
              {
                q: t('Perfiles de bots', 'Bot profiles'),
                a: t('Responden de inmediato con mensajes genéricos y enlaces. No abras enlaces de desconocidos.', 'They reply instantly with generic messages and links. Don’t open links from strangers.'),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

export function Normas() {
  const t = useT();
  const { normas } = useContent();
  return <DocPage doc={normas} crumbs={[useSc(), { label: normas.title }]} eyebrow={t('Seguridad', 'Safety')} />;
}

export function Autoridades() {
  const t = useT();
  const { autoridades } = useContent();
  return <DocPage doc={autoridades} crumbs={[useSc(), { label: autoridades.title }]} eyebrow={t('Seguridad', 'Safety')} />;
}

export function Politicas() {
  const t = useT();
  const sc = useSc();
  const items: [IconName, string, string][] = [
    ['shield', t('Verificación de edad', 'Age verification'), t('Pedimos fecha de nacimiento al registrarse y usamos señales automáticas para detectar posibles menores. Ante la duda, solicitamos verificación adicional.', 'We ask for date of birth at sign-up and use automated signals to detect possible minors. When in doubt, we request additional verification.')],
    ['eye', t('Moderación de contenido', 'Content moderation'), t('Revisamos fotos y perfiles con modelos automáticos y un equipo humano. El contenido que incumple las normas se retira.', 'We review photos and profiles with automated models and a human team. Content that breaks the guidelines is removed.')],
    ['flag', t('Atención de reportes', 'Handling reports'), t('Cada reporte se revisa por una persona. Los reportes de riesgo físico o menores se priorizan las 24 horas.', 'Every report is reviewed by a person. Reports involving physical risk or minors are prioritized 24/7.')],
    ['ban', t('Prevención de reincidencia', 'Preventing repeat offenders'), t('Cuando eliminamos una cuenta por abuso, aplicamos medidas para impedir que vuelva a registrarse.', 'When we remove an account for abuse, we take steps to prevent it from signing up again.')],
    ['lock', t('Privacidad por diseño', 'Privacy by design'), t('Ubicación aproximada, sin acceso en segundo plano y control sobre quién te escribe.', 'Approximate location, no background access and control over who messages you.')],
    ['scale', t('Apelaciones', 'Appeals'), t(`Si crees que tomamos una decisión equivocada sobre tu cuenta, puedes apelar en ${company.emails.safety}.`, `If you think we made the wrong decision about your account, you can appeal at ${company.emails.safety}.`)],
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Seguridad y políticas', 'Safety & policy')}
        title={t('Cómo protegemos a la comunidad', 'How we protect the community')}
        lead={t('Combinamos tecnología, revisión humana y reglas claras para que Datecito sea un lugar respetuoso.', 'We combine technology, human review and clear rules to keep Datecito respectful.')}
        crumbs={[sc, { label: t('Seguridad y políticas', 'Safety & policy') }]}
      />
      <section className="section">
        <div className="container grid g2">
          {items.map(([i, title, d]) => (
            <FeatureCard key={title} icon={i} title={title}>
              {d}
            </FeatureCard>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow center">
          <h2>{t('Consejo asesor de seguridad', 'Safety advisory council')}</h2>
          <p className="lead">
            {t(
              'Estamos integrando un consejo con especialistas en violencia de género, derechos digitales y salud mental para revisar nuestras políticas.',
              'We are forming a council of experts in gender-based violence, digital rights and mental health to review our policies.',
            )}
          </p>
          <Link to="/seguridad/normas-de-la-comunidad" className="btn btn-dark">
            {t('Leer las normas de la comunidad', 'Read the community guidelines')}
          </Link>
        </div>
      </section>
    </>
  );
}

export function Recursos() {
  const t = useT();
  const sc = useSc();
  const hotlines = [
    { n: t('Emergencias', 'Emergencies'), d: t('Policía, ambulancia y bomberos en todo México.', 'Police, ambulance and fire services across Mexico.'), tel: '911' },
    { n: t('Denuncia anónima', 'Anonymous tip line'), d: t('Reporta delitos de forma anónima.', 'Report crimes anonymously.'), tel: '089' },
    { n: t('Línea de la Vida', 'Línea de la Vida (Lifeline)'), d: t('Salud mental, crisis emocional y adicciones. 24 h, gratuita.', 'Mental health, emotional crisis and addiction. 24/7, free.'), tel: '800 911 2000' },
    { n: t('Línea de Seguridad y Chat de Confianza', 'Citizen Council Safety Line & Chat'), d: t('Consejo Ciudadano: apoyo psicológico y legal, 24 h.', 'Citizen Council: psychological and legal support, 24/7.'), tel: '55 5533 5533' },
    { n: t('Red Nacional de Refugios', 'National Shelter Network'), d: t('Apoyo a mujeres, niñas y niños en situación de violencia.', 'Support for women and children facing violence.'), tel: '800 822 4460' },
    { n: t('Línea Mujeres (CDMX)', 'Línea Mujeres (Mexico City)'), d: t('Asesoría jurídica y psicológica para mujeres.', 'Legal and psychological counseling for women.'), tel: '*765' },
    { n: t('Policía Cibernética (SSC CDMX)', 'Cyber Police (Mexico City SSC)'), d: t('Sextorsión, fraude en línea y difusión de imágenes íntimas.', 'Sextortion, online fraud and sharing of intimate images.'), tel: t('55 5242 5100 ext. 5086', '55 5242 5100 ext. 5086') },
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Líneas de apoyo', 'Support hotlines')}
        title={t('No tienes que pasar por esto sol@', 'You don’t have to go through this alone')}
        lead={t('Si viviste violencia, acoso o una situación difícil, estas organizaciones ofrecen ayuda gratuita y confidencial.', 'If you experienced violence, harassment or a difficult situation, these organizations offer free, confidential help.')}
        crumbs={[sc, { label: t('Líneas de apoyo', 'Support hotlines') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <div className="notice danger" style={{ marginBottom: 24 }}>
            <strong>{t('¿Estás en peligro ahora?', 'Are you in danger right now?')}</strong> {t('Llama al', 'Call')}{' '}
            <a href="tel:911" className="link">
              911
            </a>
            .
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {hotlines.map((h) => (
              <div className="card hotline" key={h.n}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{h.n}</h3>
                  <p className="muted" style={{ margin: 0 }}>
                    {h.d}
                  </p>
                </div>
                <a href={`tel:${h.tel.replace(/[^\d*]/g, '')}`}>{h.tel}</a>
              </div>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 20 }}>
            {t(
              `Datecito no está afiliado a estas organizaciones. Verificamos periódicamente los números; si alguno no funciona, avísanos en ${company.emails.safety}.`,
              `Datecito is not affiliated with these organizations. We check the numbers periodically; if one doesn’t work, let us know at ${company.emails.safety}.`,
            )}
          </p>
        </div>
      </section>
    </>
  );
}

export function Transparencia() {
  const t = useT();
  const sc = useSc();
  const rows = [
    t('Perfiles revisados', 'Profiles reviewed'),
    t('Cuentas eliminadas por incumplir normas', 'Accounts removed for breaking guidelines'),
    t('Reportes recibidos', 'Reports received'),
    t('Tiempo medio de respuesta a reportes', 'Average report response time'),
    t('Requerimientos de autoridades', 'Requests from authorities'),
    t('Requerimientos atendidos', 'Requests fulfilled'),
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Transparencia', 'Transparency')}
        title={t('Informe de transparencia', 'Transparency report')}
        lead={t('Publicaremos cada semestre cifras sobre moderación, seguridad y requerimientos de autoridades.', 'Every six months we’ll publish figures on moderation, safety and requests from authorities.')}
        crumbs={[sc, { label: t('Informe de transparencia', 'Transparency report') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <div className="notice">{t('El primer informe se publicará al cierre del primer semestre de operación. Las cifras se muestran como pendientes.', 'The first report will be published at the end of our first six months of operation. Figures are shown as pending.')}</div>
          <div className="table-wrap" style={{ marginTop: 24 }}>
            <table className="compare">
              <thead>
                <tr>
                  <th>{t('Indicador', 'Indicator')}</th>
                  <th>2026 · {t('S2', 'H2')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a}>
                    <td>{a}</td>
                    <td>
                      <span className="ph">[—]</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
