import { Icon } from '../components/Icon';
import { CtaBand, Faq, FeatureCard, PhoneChat, PhoneSafety, PhoneSwipe, SectionHead, StoreButtons } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import { company, money } from '../site';

export default function Home() {
  const t = useT();
  const { posts, stories } = useContent();
  const p = company.pricing;
  return (
    <>
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url(/welcome.jpg)' }} />
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--durazno)' }}>
            {t('Hecho en México · Gratis durante el lanzamiento', 'Made in Mexico · Free during launch')}
          </span>
          <h1>
            {t(
              <>
                Del match al <em>datecito</em>, sin tanta vuelta.
              </>,
              <>
                From match to <em>date</em>, no runaround.
              </>,
            )}
          </h1>
          <p>
            {t(
              'Conoce personas reales cerca de ti, platica y conviértelo en un plan. Con verificación por selfie y Datecito Seguro en cada cita.',
              'Meet real people near you, chat and turn it into a plan. With selfie verification and Datecito Safe on every date.',
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
              <p className="muted">{t('Desliza perfiles verificados cerca de ti y filtra por lo que de verdad te importa con “Prefiero” o “Sólo”.', 'Swipe verified profiles near you and filter by what really matters with “Prefer” or “Only”.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Haz match y platica', 'Match and chat')}</h3>
              <p className="muted">{t('Cuando el like es mutuo, abren chat. Tú decides quién puede escribirte y cuándo.', 'When the like is mutual, you can chat. You decide who can message you and when.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Propón un datecito', 'Propose a date')}</h3>
              <p className="muted">{t('Elige plan, lugar y hora en un toque. Activa Datecito Seguro y disfruta.', 'Pick the plan, place and time in one tap. Turn on Datecito Safe and enjoy.')}</p>
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
                'Perfiles con selfie verificada, distancia aproximada y los intereses que tienen en común. Da like, Super like o pasa: sin presión.',
                'Profiles with verified selfies, approximate distance and the interests you share. Like, Super Like or pass: no pressure.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('Insignia de verificación por selfie', 'Selfie verification badge')}</li>
              <li>{t('Filtros de edad, distancia e intereses', 'Age, distance and interest filters')}</li>
              <li>{t('Super likes para destacar', 'Super Likes to stand out')}</li>
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
                'Desde el chat eliges tipo de plan, lugar, día y hora. Tu match acepta, sugiere otro horario o declina. Así de simple.',
                'From the chat you pick the kind of plan, place, day and time. Your match accepts, suggests another time or declines. That simple.',
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
                'Comparte tu plan con contactos de confianza, recibe check-ins, ten a la mano una llamada de salida y el 911 a un toque.',
                'Share your plan with trusted contacts, get check-ins, keep an exit call handy and 911 one tap away.',
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
              {t('Encuentra personas cerca que también quieren salir hoy. Disponibilidad por 1, 2 o 3 horas.', 'Find people nearby who also want to go out today. Availability for 1, 2 or 3 hours.')}
            </FeatureCard>
            <FeatureCard icon="shield" title={t('Verificación', 'Verification')} to="/verificacion">
              {t('Una selfie confirma que tus fotos son tuyas. Elige hablar sólo con perfiles verificados.', 'A selfie confirms your photos are yours. Choose to talk only with verified profiles.')}
            </FeatureCard>
            <FeatureCard icon="bolt" title={t('Super likes y Boost', 'Super Likes & Boost')} to="/super-likes-y-boost">
              {t('Destaca con un Super like o aparece primero en tu zona durante 30 minutos.', 'Stand out with a Super Like or show up first in your area for 30 minutes.')}
            </FeatureCard>
            <FeatureCard icon="filter" title={t('Filtros “Prefiero” y “Sólo”', '“Prefer” and “Only” filters')} to="/funciones#filtros">
              {t('Prioriza lo que te gusta sin cerrarte a sorpresas, o filtra estrictamente.', 'Prioritize what you like without ruling out surprises, or filter strictly.')}
            </FeatureCard>
            <FeatureCard icon="lock" title={t('Tú tienes el control', 'You’re in control')} to="/legal/privacidad">
              {t('Nunca mostramos tu ubicación exacta. Elige quién te escribe primero.', 'We never show your exact location. Choose who messages you first.')}
            </FeatureCard>
            <FeatureCard icon="graduation" title="Datecito U" to="/universitarios">
              {t('Conecta con personas de tu universidad y alrededores.', 'Connect with people from your college and nearby.')}
            </FeatureCard>
          </div>
        </div>
      </section>

      <section className="section peach">
        <div className="container">
          <SectionHead eyebrow={t('Historias', 'Stories')} title={t('Empezó con un datecito', 'It started with a date')} lead={t('Historias ilustrativas inspiradas en nuestra comunidad beta.', 'Illustrative stories inspired by our beta community.')} />
          <div className="grid g3">
            {stories.slice(0, 3).map((s) => (
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
          <div className="center" style={{ marginTop: 32 }}>
            <Link to="/historias" className="link">
              {t('Ver más historias →', 'See more stories →')}
            </Link>
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
                `Gratis durante el lanzamiento. Después: ${money(p.monthly)} al mes o ${money(p.yearly)} al año, con 1 Boost cada semana.`,
                `Free during launch. After that: ${money(p.monthly)} a month or ${money(p.yearly)} a year, with 1 Boost every week.`,
              )}
            </p>
            <Link to="/membresia" className="btn btn-primary">
              {t('Ver membresía', 'See membership')}
            </Link>
          </div>
          <div className="card">
            <ul className="checklist" style={{ margin: 0 }}>
              <li>{t('Likes ilimitados en Descubrir', 'Unlimited likes in Discover')}</li>
              <li>{t('Chats y datecitos sin límite', 'Unlimited chats and dates')}</li>
              <li>{t('Aquí y ahora en cualquier lugar', 'Here & Now anywhere')}</li>
              <li>{t('Todos los filtros, en modo “Prefiero” o “Sólo”', 'All filters, in “Prefer” or “Only” mode')}</li>
              <li>{t('1 Super like gratis cada día', '1 free Super Like every day')}</li>
              <li>{t('Datecito Seguro y verificación incluidos', 'Datecito Safe and verification included')}</li>
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
                  'Sí, durante el lanzamiento. Después habrá una sola membresía con todo incluido; te avisaremos antes y nunca te cobraremos sin tu confirmación.',
                  'Yes, during launch. After that there will be a single all-inclusive membership; we’ll let you know first and never charge you without your confirmation.',
                ),
              },
              {
                q: t('¿Quién puede ver mi ubicación?', 'Who can see my location?'),
                a: t('Nadie ve tu ubicación exacta. Sólo mostramos una distancia aproximada y la usamos únicamente mientras usas la app.', 'Nobody sees your exact location. We only show an approximate distance and use it only while you use the app.'),
              },
              {
                q: t('¿Cómo sé que un perfil es real?', 'How do I know a profile is real?'),
                a: t('Busca la insignia de verificación. Además, puedes elegir que sólo perfiles verificados te escriban.', 'Look for the verification badge. You can also choose to only get messages from verified profiles.'),
              },
              {
                q: t('¿En qué ciudades está Datecito?', 'Which cities is Datecito in?'),
                a: (
                  <>
                    {t('Empezamos en CDMX, Guadalajara y Monterrey y crecemos a todo México.', 'We’re starting in Mexico City, Guadalajara and Monterrey and growing across Mexico.')}{' '}
                    <Link className="link" to="/destinos">
                      {t('Ver destinos', 'See destinations')}
                    </Link>
                    .
                  </>
                ),
              },
            ]}
          />
          <div className="center" style={{ marginTop: 28 }}>
            <Link to="/preguntas-frecuentes" className="link">
              {t('Todas las preguntas frecuentes →', 'All FAQs →')}
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
