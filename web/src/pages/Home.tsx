import { Icon } from '../components/Icon';
import { CtaBand, Faq, FeatureCard, PhoneChat, PhoneSafety, PhoneSwipe, SectionHead, StoreButtons } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import { Seo } from '../seo';
import { company, money } from '../site';

export default function Home() {
  const t = useT();
  const { posts } = useContent();
  const p = company.pricing;
  return (
    <>
      <Seo
        title={t('Datecito | Conoce personas reales y sal en un datecito', 'Datecito | Meet real people and go on a date')}
        description={t(
          'La app de citas mexicana donde todos los perfiles pasan por verificación con selfie. Conoce personas cerca de ti, platica, propón un datecito y sal con Datecito Seguro. Gratis durante el lanzamiento.',
          'The Mexican dating app where every profile goes through selfie verification. Meet people near you, chat, propose a date and go out with Datecito Safe. Free during launch.',
        )}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: 'Datecito',
            operatingSystem: 'Android, iOS',
            applicationCategory: 'LifestyleApplication',
            description: t('App de citas con verificación por selfie, datecitos con calendario y Datecito Seguro.', 'Dating app with selfie verification, calendar-based dates and Datecito Safe.'),
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN', description: t('Gratis durante el lanzamiento', 'Free during launch') },
            url: 'https://datecito.com',
          },
        ]}
      />
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url(/welcome.jpg)' }} />
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--durazno)' }}>
            {t('Hecho en México · Gratis durante el lanzamiento', 'Made in Mexico · Free during launch')}
          </span>
          <h1>
            {t(
              <>
                Aquí todos son <em>reales</em>. Del match al datecito.
              </>,
              <>
                Everyone here is <em>real</em>. From match to date.
              </>,
            )}
          </h1>
          <p>
            {t(
              'Conoce personas cerca de ti con perfiles verificados por selfie, platica sin presión y conviértelo en un plan con día, hora y Datecito Seguro.',
              'Meet people near you with selfie-verified profiles, chat without pressure and turn it into a plan with a day, a time and Datecito Safe.',
            )}
          </p>
          <div className="btn-row">
            <Link to="/descargar" className="btn btn-primary">
              {t('Descargar la app', 'Get the app')}
            </Link>
            <Link to="/funciones" className="btn btn-ghost on-dark">
              {t('Cómo funciona', 'How it works')}
            </Link>
          </div>
          <p className="hero-note">{t('Tu cuenta se crea y se usa desde la app. Sólo mayores de 18 años.', 'Your account is created and used in the app. 18+ only.')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Así funciona', 'How it works')} title={t('Tres pasos para tu próximo datecito', 'Three steps to your next date')} lead={t('Menos chat infinito, más planes de verdad.', 'Less endless chatting, more real plans.')} />
          <div className="grid g3 steps">
            <div className="card step">
              <h3>{t('Descubre', 'Discover')}</h3>
              <p className="muted">
                {t(
                  'Cada día recibes un grupo de personas cerca de ti. Filtra por edad, distancia, intención e intereses, y da like con calma: tienes 30 al día.',
                  'Every day you get a group of people near you. Filter by age, distance, intention and interests, and like at your own pace: you get 30 a day.',
                )}
              </p>
            </div>
            <div className="card step">
              <h3>{t('Haz match y platica', 'Match and chat')}</h3>
              <p className="muted">
                {t(
                  'Cuando el like es mutuo, abren chat. Sin “visto”, sin “en línea” y sin presión: tú marcas el ritmo.',
                  'When the like is mutual, you can chat. No read receipts, no “online” status and no pressure: you set the pace.',
                )}
              </p>
            </div>
            <div className="card step">
              <h3>{t('Propón un datecito', 'Propose a date')}</h3>
              <p className="muted">{t('Elige plan, lugar, día y hora en el calendario. Activa Datecito Seguro y disfruta.', 'Pick the plan, place, day and time on the calendar. Turn on Datecito Safe and enjoy.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Descubrir', 'Discover')}</span>
            <h2>{t('Gente real, cerca de ti', 'Real people, near you')}</h2>
            <p className="lead">
              {t(
                'Perfiles con selfie verificada por una persona del equipo, distancia aproximada y lo que tienen en común: intereses, música y hasta el equipo al que le van.',
                'Profiles with a selfie verified by a real team member, approximate distance and what you share: interests, music and even the team you root for.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('Insignia de verificación por selfie', 'Selfie verification badge')}</li>
              <li>{t('Filtros de edad, distancia, intención e intereses', 'Age, distance, intention and interest filters')}</li>
              <li>{t('Super likes para destacar y “Quién te dio like”', 'Super Likes to stand out and “Who liked you”')}</li>
            </ul>
            <Link to="/funciones" className="btn btn-dark">
              {t('Ver todas las funciones', 'See all features')}
            </Link>
          </div>
          <PhoneSwipe />
        </div>
      </section>

      <section className="section">
        <div className="container split rev">
          <div>
            <span className="eyebrow">Datecitos</span>
            <h2>{t('Proponer un plan es parte de la plática', 'Proposing a plan is part of the chat')}</h2>
            <p className="lead">
              {t(
                'Desde el chat eliges tipo de plan, lugar, día y hora en un calendario. Tu match confirma y el datecito queda agendado para ambos.',
                'From the chat you pick the kind of plan, place, day and time on a calendar. Your match confirms and the date is on both your schedules.',
              )}
            </p>
            <Link to="/datecitos" className="btn btn-dark">
              {t('Conoce los Datecitos', 'Discover Datecitos')}
            </Link>
          </div>
          <PhoneChat />
        </div>
      </section>

      <section className="section dark">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Datecito Seguro', 'Datecito Safe')}</span>
            <h2>{t('Tu seguridad viene incluida', 'Your safety comes included')}</h2>
            <p className="lead">
              {t(
                'Avisa a tus contactos de confianza por WhatsApp con un toque, recibe un “¿todo bien?” cada 15, 30, 45 o 60 minutos y ten a la mano una llamada de salida y el botón de ayuda.',
                'Let your trusted contacts know on WhatsApp in one tap, get an “all good?” check-in every 15, 30, 45 or 60 minutes, and keep an exit call and the help button handy.',
              )}
            </p>
            <div className="btn-row">
              <Link to="/seguridad" className="btn btn-primary">
                {t('Centro de seguridad', 'Safety Center')}
              </Link>
              <Link to="/seguridad/consejos" className="btn btn-ghost">
                {t('Consejos de seguridad', 'Safety tips')}
              </Link>
            </div>
          </div>
          <PhoneSafety />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Todo en una app', 'All in one app')} title={t('Pensado para conocer gente de verdad', 'Built for actually meeting people')} />
          <div className="grid g3">
            <FeatureCard icon="radio" title={t('Aquí y ahora', 'Here & Now')} to="/aqui-y-ahora">
              {t('¿Estás en un café o en un bar? Descubre quién más está en el mismo lugar con ganas de conocer gente.', 'At a café or a bar? See who else is in the same place and up for meeting people.')}
            </FeatureCard>
            <FeatureCard icon="shield" title={t('Verificación', 'Verification')} to="/verificacion">
              {t('Una selfie con una pose al azar, revisada por una persona, confirma que tus fotos son tuyas. Filtra para ver sólo perfiles verificados.', 'A selfie with a random pose, reviewed by a real person, confirms your photos are yours. Filter to see only verified profiles.')}
            </FeatureCard>
            <FeatureCard icon="heart-fill" title={t('Quién te dio like', 'Who liked you')} to="/membresia">
              {t('Ve cuántas personas te dieron like y, con membresía, quiénes son: dales like de vuelta y hay match al instante.', 'See how many people liked you and, with a membership, who they are: like them back and it’s an instant match.')}
            </FeatureCard>
            <FeatureCard icon="bolt" title={t('Super likes', 'Super Likes')} to="/super-likes">
              {t('Dile a alguien que de verdad te interesa: tu perfil le aparece primero y destacado. Uno gratis cada 3 días.', 'Tell someone you’re really interested: your profile shows up first and highlighted. One free every 3 days.')}
            </FeatureCard>
            <FeatureCard icon="filter" title={t('Un ritmo sano', 'A healthy pace')} to="/funciones#ritmo">
              {t('30 likes y 40 perfiles al día para decidir con intención, y una segunda oportunidad para quien pasaste de largo.', '30 likes and 40 profiles a day to decide with intention, plus a second chance for anyone you passed on.')}
            </FeatureCard>
            <FeatureCard icon="lock" title={t('Tú tienes el control', 'You’re in control')} to="/legal/privacidad">
              {t('Nunca mostramos tu ubicación exacta, no hay “visto” ni “en línea”, y bloquear o reportar toma dos toques.', 'We never show your exact location, there’s no “seen” or “online”, and blocking or reporting takes two taps.')}
            </FeatureCard>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Membresía', 'Membership')}</span>
            <h2>{t('Una sola membresía, todo incluido', 'One membership, everything included')}</h2>
            <p className="lead">
              {t(
                `Gratis durante el lanzamiento. Después: ${money(p.monthly)} al mes o ${money(p.yearly)} al año (dos meses gratis). Te avisaremos antes de empezar a cobrar.`,
                `Free during launch. After that: ${money(p.monthly)} a month or ${money(p.yearly)} a year (two months free). We’ll let you know before we start charging.`,
              )}
            </p>
            <Link to="/membresia" className="btn btn-primary">
              {t('Ver membresía', 'See membership')}
            </Link>
          </div>
          <div className="card">
            <ul className="checklist" style={{ margin: 0 }}>
              <li>{t('Ve quién te dio like y hazle match directo', 'See who liked you and match them directly')}</li>
              <li>{t('Descubrir, chats y datecitos completos', 'Full Discover, chats and datecitos')}</li>
              <li>{t('Todos los filtros y “Aquí y ahora”', 'All filters and “Here & Now”')}</li>
              <li>{t('1 Super like gratis cada 3 días', '1 free Super Like every 3 days')}</li>
              <li>{t('Datecito Seguro y verificación, siempre gratis', 'Datecito Safe and verification, always free')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow={t('Vida Datecito', 'Datecito Life')} title={t('Del blog', 'From the blog')} />
          <div className="grid g3">
            {posts.slice(0, 3).map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="card card-link post-card">
                <div className="post-cover" style={{ background: post.color }}>
                  {post.emoji}
                </div>
                <div className="body">
                  <span className="pill">{post.cat}</span>
                  <h3 style={{ marginTop: 10 }}>{post.title}</h3>
                  <p className="muted small">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <SectionHead title={t('Preguntas frecuentes', 'FAQ')} />
          <Faq
            items={[
              {
                q: t('¿Datecito es gratis?', 'Is Datecito free?'),
                a: t(
                  'Sí, durante el lanzamiento. Después habrá una sola membresía con todo incluido; te avisaremos antes y nunca te cobraremos sin tu confirmación. Datecito Seguro, la verificación y reportar o bloquear serán siempre gratis.',
                  'Yes, during launch. After that there will be a single all-inclusive membership; we’ll let you know first and never charge you without your confirmation. Datecito Safe, verification and reporting or blocking will always be free.',
                ),
              },
              {
                q: t('¿Quién puede ver mi ubicación?', 'Who can see my location?'),
                a: t('Nadie ve tu ubicación exacta. Guardamos una ubicación aproximada (a un kilómetro) y sólo mostramos la distancia redondeada.', 'Nobody sees your exact location. We store an approximate location (to about a kilometer) and only show a rounded distance.'),
              },
              {
                q: t('¿Cómo sé que un perfil es real?', 'How do I know a profile is real?'),
                a: t(
                  'Busca la insignia de verificación: esa persona envió una selfie con una pose al azar que alguien del equipo comparó con sus fotos. También puedes filtrar para ver sólo perfiles verificados.',
                  'Look for the verification badge: that person sent a selfie with a random pose that someone on our team compared with their photos. You can also filter to only see verified profiles.',
                ),
              },
              {
                q: t('¿Cómo me registro?', 'How do I sign up?'),
                a: t('Con tu correo y una contraseña. Te mandamos un código de 6 dígitos para confirmar que el correo es tuyo y listo: en dos minutos tienes tu perfil.', 'With your email and a password. We send you a 6-digit code to confirm the email is yours and that’s it: your profile is ready in two minutes.'),
              },
            ]}
          />
          <div className="center" style={{ marginTop: 28 }}>
            <Link to="/ayuda" className="link">
              {t('Ir al Centro de ayuda →', 'Go to the Help Center →')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container center">
          <h2>{t('Descarga Datecito', 'Download Datecito')}</h2>
          <p className="lead">{t('Disponible muy pronto para Android y iPhone.', 'Coming very soon to Android and iPhone.')}</p>
          <StoreButtons center dark />
          <p style={{ marginTop: 18 }}>
            <Link to="/descargar" className="link">
              {t('Más formas de descargar', 'More ways to download')} <Icon name="arrow" size={14} />
            </Link>
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
