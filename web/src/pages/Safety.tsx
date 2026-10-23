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
    ['/seguridad/menores', 'shield', t('Seguridad de menores', 'Child safety'), t('Normas contra la explotación y el abuso infantil.', 'Standards against child sexual abuse and exploitation.')],
    ['/seguridad/autoridades', 'doc', t('Guía para autoridades', 'Law enforcement guide'), t('Requerimientos legales de información.', 'Legal requests for information.')],
    ['/seguridad-informatica', 'bug', t('Seguridad informática', 'Security'), t('Reporta una vulnerabilidad.', 'Report a vulnerability.')],
  ];
  return (
    <>
      <PageHero
        dark
        eyebrow={t('Centro de seguridad', 'Safety Center')}
        title={t('Conocer gente, con tranquilidad', 'Meet people, with peace of mind')}
        lead={t('Diseñamos Datecito para que te sientas con confianza antes, durante y después de cada datecito. Todo lo que te protege es gratis, siempre.', 'We designed Datecito so you feel confident before, during and after every date. Everything that protects you is free, always.')}
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
          <SectionHead eyebrow={t('Datecito Seguro', 'Datecito Safe')} title={t('Herramientas para cada cita', 'Tools for every date')} lead={t('Se activa desde cualquier datecito confirmado, a un toque de distancia.', 'Turn it on from any confirmed date, one tap away.')} />
          <div className="grid g3">
            <FeatureCard icon="users" title={t('Contactos de confianza', 'Trusted contacts')}>
              {t('Guarda hasta 3 personas (nombre y teléfono, cifrados). No necesitan tener Datecito ni ven tu perfil.', 'Save up to 3 people (name and phone, encrypted). They don’t need Datecito and never see your profile.')}
            </FeatureCard>
            <FeatureCard icon="share" title={t('Avisa por WhatsApp', 'Alert on WhatsApp')}>
              {t('Con un toque se abre WhatsApp con el mensaje listo: con quién estarás, dónde y a qué hora. Tú lo envías; nada sale sin que lo mandes.', 'One tap opens WhatsApp with the message ready: who you’ll be with, where and when. You send it; nothing goes out unless you do.')}
            </FeatureCard>
            <FeatureCard icon="clock" title={t('“¿Todo bien?”', '“All good?”')}>
              {t('Eliges cada cuánto te preguntamos: 15, 30, 45 o 60 minutos. Confirmas con un toque; si no respondes, el datecito se marca como pendiente de revisión.', 'You choose how often we ask: 15, 30, 45 or 60 minutes. Confirm with one tap; if you don’t answer, the date is flagged for follow-up.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('Llamada de salida', 'Exit call')}>
              {t('Recibe una llamada simulada para irte sin dar explicaciones.', 'Get a simulated call so you can leave without explaining.')}
            </FeatureCard>
            <FeatureCard icon="alert" title={t('Necesito ayuda', 'I need help')}>
              {t('Prepara al instante un mensaje urgente para tus contactos con tu ubicación y tu plan.', 'Instantly prepare an urgent message for your contacts with your location and your plan.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('911 a un toque', '911 one tap away')}>
              {t('Botón para llamar a emergencias desde la pantalla de Datecito Seguro.', 'A button to call emergency services from the Datecito Safe screen.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow={t('Siempre activas', 'Always on')} title={t('Protecciones en toda la app', 'Protections across the app')} />
          <div className="grid g4">
            <FeatureCard icon="shield" title={t('Verificación', 'Verification')} to="/verificacion">
              {t('Selfie con pose al azar, revisada por una persona.', 'A selfie with a random pose, reviewed by a person.')}
            </FeatureCard>
            <FeatureCard icon="eye-off" title={t('Sin presión', 'No pressure')} to="/funciones">
              {t('Sin “visto”, sin “en línea” y sin fotos en el chat.', 'No read receipts, no “online” status and no photos in chat.')}
            </FeatureCard>
            <FeatureCard icon="pin" title={t('Ubicación aproximada', 'Approximate location')} to="/ayuda/ubicacion">
              {t('Nunca mostramos tu ubicación exacta.', 'We never show your exact location.')}
            </FeatureCard>
            <FeatureCard icon="flag" title={t('Reportar y bloquear', 'Report and block')} to="/ayuda/reportar">
              {t('Anónimo, en dos toques y revisado por personas.', 'Anonymous, two taps, reviewed by people.')}
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
        t('Si te da confianza, hagan una videollamada por el medio que prefieran antes de verse.', 'If it helps you feel confident, have a video call on whatever app you prefer before meeting.'),
        t('Busca la insignia de verificación y desconfía de quien evita verificarse.', 'Look for the verification badge and be wary of people who avoid verifying.'),
        t('Investiga un poco: una búsqueda de su nombre o fotos puede revelar perfiles falsos.', 'Do a little research: searching their name or photos can reveal fake profiles.'),
      ],
    },
    {
      title: t('El día del datecito', 'On the day of the date'),
      icon: 'coffee',
      items: [
        t('Elige un lugar público, concurrido y que conozcas.', 'Choose a public, busy place you know.'),
        t('Activa Datecito Seguro y avisa a tus contactos de confianza por WhatsApp.', 'Turn on Datecito Safe and let your trusted contacts know on WhatsApp.'),
        t('Llega y vete por tu cuenta. Ten tu celular con batería.', 'Arrive and leave on your own. Keep your phone charged.'),
        t('Cuida tu bebida y no la dejes sola. Modera el consumo de alcohol.', 'Watch your drink and don’t leave it unattended. Drink in moderation.'),
        t('No vayas a un lugar privado en la primera cita.', 'Don’t go somewhere private on a first date.'),
        t('Si algo te incomoda, vete. Usa la llamada de salida si lo necesitas.', 'If something makes you uncomfortable, leave. Use the exit call if you need it.'),
      ],
    },
    {
      title: t('Si algo no está bien', 'If something isn’t right'),
      icon: 'alert',
      items: [
        t('Si estás en peligro inmediato, llama al 911.', 'If you’re in immediate danger, call 911.'),
        t('Usa “Necesito ayuda” para avisar a tus contactos.', 'Use “I need help” to alert your contacts.'),
        t('Reporta el perfil en la app: es anónimo y lo revisa una persona con prioridad.', 'Report the profile in the app: it’s anonymous and a person reviews it with priority.'),
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
                a: t('Te piden “un código que te llegó”. Es un intento de robar tu cuenta de WhatsApp o de Datecito. Nunca compartas códigos: Datecito jamás te los pedirá por chat.', 'They ask for “a code you received”. It’s an attempt to steal your WhatsApp or Datecito account. Never share codes: Datecito will never ask for them in chat.'),
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
    ['shield', t('Sólo mayores de edad', 'Adults only'), t('Pedimos fecha de nacimiento al registrarse y no permitimos cuentas de menores de 18 años. Si detectamos o nos reportan a una persona menor, eliminamos la cuenta y conservamos la evidencia para las autoridades.', 'We ask for date of birth at sign-up and don’t allow accounts for anyone under 18. If we detect or receive a report about a minor, we delete the account and preserve the evidence for the authorities.')],
    ['eye', t('Revisión humana', 'Human review'), t('Cada verificación por selfie y cada reporte los revisa una persona del equipo, no un algoritmo. Las fotos de perfil que incumplen las normas se retiran.', 'Every selfie verification and every report is reviewed by a team member, not an algorithm. Profile photos that break the guidelines are removed.')],
    ['flag', t('Atención de reportes', 'Handling reports'), t('Los reportes son anónimos. Los que involucran riesgo físico, menores o extorsión se atienden primero; el resto, en orden de llegada.', 'Reports are anonymous. Those involving physical risk, minors or extortion are handled first; the rest, in order of arrival.')],
    ['ban', t('Prevención de reincidencia', 'Preventing repeat offenders'), t('Cuando eliminamos una cuenta por abuso, bloqueamos su correo y dejamos un registro interno para impedir que vuelva a registrarse.', 'When we remove an account for abuse, we block its email and keep an internal record to prevent it from signing up again.')],
    ['lock', t('Privacidad por diseño', 'Privacy by design'), t('Ubicación aproximada, chats cifrados, sin “visto” ni “en línea”, y sin acceso a tu ubicación en segundo plano.', 'Approximate location, encrypted chats, no “seen” or “online” status, and no background location access.')],
    ['scale', t('Apelaciones', 'Appeals'), t(`Si crees que tomamos una decisión equivocada sobre tu cuenta, puedes apelar en ${company.emails.safety}. Una persona distinta a quien decidió revisa tu caso.`, `If you think we made the wrong decision about your account, you can appeal at ${company.emails.safety}. Someone other than the original reviewer looks at your case.`)],
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Seguridad y políticas', 'Safety & policy')}
        title={t('Cómo protegemos a la comunidad', 'How we protect the community')}
        lead={t('Combinamos reglas claras, revisión humana y herramientas dentro de la app para que Datecito sea un lugar respetuoso. Así tomamos decisiones hoy; conforme crezcamos iremos publicando más detalle.', 'We combine clear rules, human review and in-app tools to keep Datecito respectful. This is how we make decisions today; as we grow we’ll publish more detail.')}
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
          <h2>{t('Las reglas, en lenguaje claro', 'The rules, in plain language')}</h2>
          <p className="lead">{t('Lo que se vale y lo que no en Datecito, y qué pasa cuando alguien no las cumple.', 'What’s OK and what’s not on Datecito, and what happens when someone breaks the rules.')}</p>
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
    { n: t('Policía Cibernética (SSC CDMX)', 'Cyber Police (Mexico City SSC)'), d: t('Sextorsión, fraude en línea y difusión de imágenes íntimas.', 'Sextortion, online fraud and sharing of intimate images.'), tel: '55 5242 5100 ext. 5086' },
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Líneas de apoyo', 'Support hotlines')}
        title={t('No tienes que pasar por esto en soledad', 'You don’t have to go through this alone')}
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
              `Datecito no está afiliado a estas organizaciones. Los números son públicos y los revisamos; si alguno no funciona, avísanos en ${company.emails.safety}.`,
              `Datecito is not affiliated with these organizations. The numbers are public and we check them; if one doesn’t work, let us know at ${company.emails.safety}.`,
            )}
          </p>
        </div>
      </section>
    </>
  );
}

/** Normas contra la explotación y el abuso sexual infantil (CSAE), exigidas por Google Play para apps sociales y de citas. */
export function Menores() {
  const t = useT();
  const sc = useSc();
  const items: [IconName, string, string][] = [
    ['ban', t('Tolerancia cero', 'Zero tolerance'), t('Prohibimos cualquier contenido o conducta de explotación o abuso sexual infantil (CSAE): imágenes, textos, solicitudes, grooming o la presencia de menores en la plataforma. Infringirlo implica eliminación inmediata y permanente de la cuenta.', 'We prohibit any child sexual abuse or exploitation (CSAE) content or conduct: images, text, solicitation, grooming or the presence of minors on the platform. Violations mean immediate, permanent account removal.')],
    ['shield', t('Sólo mayores de 18', 'Adults only'), t('Datecito es exclusivamente para personas adultas. Pedimos fecha de nacimiento al registrarse y eliminamos cualquier cuenta de la que sepamos o sospechemos razonablemente que pertenece a una persona menor de edad.', 'Datecito is exclusively for adults. We ask for date of birth at sign-up and remove any account we know or reasonably suspect belongs to a minor.')],
    ['flag', t('Cómo reportar', 'How to report'), t(`Desde cualquier perfil o chat, toca “Reportar” y elige “Es menor de edad”. Esos reportes se atienden antes que cualquier otro. También puedes escribir a ${company.emails.safety}.`, `From any profile or chat, tap “Report” and choose “Is a minor”. Those reports are handled before anything else. You can also write to ${company.emails.safety}.`)],
    ['eye', t('Qué hacemos al recibir un reporte', 'What we do when we get a report'), t('Una persona del equipo lo revisa de inmediato, retira el contenido, elimina la cuenta involucrada y conserva la evidencia necesaria para las autoridades.', 'A team member reviews it immediately, removes the content, deletes the account involved and preserves the evidence needed for the authorities.')],
    ['scale', t('Colaboración con autoridades', 'Working with authorities'), t('Denunciamos el material de abuso sexual infantil ante las autoridades competentes en México y cooperamos con los requerimientos legales conforme a nuestra Guía para autoridades.', 'We report child sexual abuse material to the competent authorities in Mexico and cooperate with legal requests under our Law Enforcement Guide.')],
    ['users', t('Persona responsable', 'Point of contact'), t(`Contamos con una persona responsable de seguridad infantil. Para asuntos relacionados, escribe a ${company.emails.safety} con el asunto “Seguridad de menores”.`, `We have a designated child-safety point of contact. For related matters, write to ${company.emails.safety} with the subject “Child safety”.`)],
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Seguridad de menores', 'Child safety')}
        title={t('Normas contra la explotación y el abuso sexual infantil', 'Standards against child sexual abuse and exploitation')}
        lead={t('Datecito es una app para personas adultas. Estas son nuestras reglas, cómo reportar y qué hacemos cuando alguien las incumple.', 'Datecito is an app for adults. These are our rules, how to report and what we do when someone breaks them.')}
        crumbs={[sc, { label: t('Seguridad de menores', 'Child safety') }]}
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
        <div className="container narrow">
          <div className="notice danger">
            <strong>{t('Si una niña, niño o adolescente está en peligro,', 'If a child or teenager is in danger,')}</strong> {t('llama al 911. Para denunciar en México también puedes acudir a la Fiscalía General de la República o a la Policía Cibernética de tu estado.', 'call 911. In Mexico you can also report to the Attorney General’s Office (FGR) or your state’s Cyber Police.')}
          </div>
          <p className="muted" style={{ marginTop: 20 }}>
            {t('Estas normas complementan nuestras', 'These standards complement our')}{' '}
            <Link className="link" to="/seguridad/normas-de-la-comunidad">
              {t('Normas de la comunidad', 'Community guidelines')}
            </Link>{' '}
            {t('y los', 'and the')}{' '}
            <Link className="link" to="/legal/terminos">
              {t('Términos y condiciones', 'Terms of use')}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
