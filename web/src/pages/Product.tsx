import { useApp } from '../components/AppState';
import { Icon } from '../components/Icon';
import { CtaBand, Faq, FeatureCard, PageHero, PhoneChat, PhoneNearby, PhoneSwipe, SectionHead } from '../components/ui';
import { Link, useT } from '../i18n';
import { company, money } from '../site';

const p = company.pricing;

function useCrumbs() {
  const t = useT();
  return (label: string) => [{ label: t('Productos', 'Products'), to: '/funciones' }, { label }];
}

export function Funciones() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t('Funciones', 'Features')}
        title={t('Todo lo que puedes hacer en Datecito', 'Everything you can do on Datecito')}
        lead={t('Herramientas para conocer gente, platicar con calma y salir a datecitos con tranquilidad.', 'Tools to meet people, chat at your own pace and go on dates with peace of mind.')}
        crumbs={[{ label: t('Funciones', 'Features') }]}
        aside={<PhoneSwipe />}
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Conocer', 'Meet')} title={t('Descubrir, likes y matches', 'Discover, likes and matches')} />
          <div className="grid g3">
            <FeatureCard icon="heart" title={t('Descubrir', 'Discover')}>
              {t('Desliza perfiles cerca de ti. Da like, Super like o pasa. Si el like es mutuo, ¡es match!', 'Swipe profiles near you. Like, Super Like or pass. If the like is mutual, it’s a match!')}
            </FeatureCard>
            <FeatureCard icon="star" title="Super like" to="/super-likes-y-boost">
              {t('Haz saber que alguien te gustó mucho antes de que decida.', 'Let someone know you really like them before they decide.')}
            </FeatureCard>
            <FeatureCard icon="bolt" title="Boost" to="/super-likes-y-boost">
              {t('Sé de los primeros perfiles en tu zona durante 30 minutos.', 'Be one of the top profiles in your area for 30 minutes.')}
            </FeatureCard>
            <FeatureCard icon="radio" title={t('Aquí y ahora', 'Here & Now')} to="/aqui-y-ahora">
              {t('Personas disponibles hoy, cerca de ti, por tiempo limitado.', 'People free today, near you, for a limited time.')}
            </FeatureCard>
            <FeatureCard icon="sparkle" title={t('Intereses en común', 'Shared interests')}>
              {t('Ve de un vistazo lo que comparten para empezar la plática.', 'See at a glance what you share to start the conversation.')}
            </FeatureCard>
            <FeatureCard icon="eye" title={t('Vista previa del perfil', 'Profile preview')}>
              {t('Mira tu perfil tal como lo ven los demás antes de publicarlo.', 'See your profile as others see it before publishing.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section alt" id="filtros">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Filtros', 'Filters')}</span>
            <h2>{t('“Prefiero” o “Sólo”: tú eliges qué tan estricto', '“Prefer” or “Only”: you choose how strict')}</h2>
            <p className="lead">
              {t(
                'Cada filtro funciona en dos modos. “Prefiero” prioriza a quien cumple tus preferencias sin cerrarte a sorpresas. “Sólo” muestra únicamente a quien las cumple.',
                'Every filter works in two modes. “Prefer” prioritizes people who match your preferences without ruling out surprises. “Only” shows just the people who match.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('Edad y distancia', 'Age and distance')}</li>
              <li>{t('Intereses y estilo de vida', 'Interests and lifestyle')}</li>
              <li>{t('Sólo perfiles verificados', 'Verified profiles only')}</li>
              <li>{t('Qué buscan: algo serio, algo casual o ver qué pasa', 'What they’re looking for: serious, casual or see what happens')}</li>
            </ul>
          </div>
          <div className="card">
            {[
              [t('Edad', 'Age'), '24 – 34', false],
              [t('Distancia', 'Distance'), t('Hasta 15 km', 'Up to 15 km'), true],
              [t('Verificad@s', 'Verified'), t('Sí', 'Yes'), true],
              [t('Intereses', 'Interests'), t('Café, cine, senderismo', 'Coffee, movies, hiking'), false],
            ].map(([a, b, only]) => (
              <div className="toggle-row" key={a as string}>
                <div>
                  <strong style={{ color: 'var(--verde)' }}>{a}</strong>
                  <div className="muted small">{b}</div>
                </div>
                <span className={`pill${only ? ' green' : ''}`}>{only ? t('Sólo', 'Only') : t('Prefiero', 'Prefer')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split rev">
          <div>
            <span className="eyebrow">{t('Platicar y salir', 'Chat and go out')}</span>
            <h2>{t('Chat y Datecitos', 'Chat and Datecitos')}</h2>
            <p className="lead">
              {t(
                'Platica con tus matches y, cuando estén list@s, propón un datecito con lugar, día y hora. Después de la cita cuéntanos, en privado, cómo te fue.',
                'Chat with your matches and, when you’re both ready, propose a date with place, day and time. After the date, tell us privately how it went.',
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
        <div className="container">
          <SectionHead eyebrow={t('Seguridad', 'Safety')} title={t('Control y tranquilidad incluidos', 'Control and peace of mind included')} />
          <div className="grid g4">
            <FeatureCard icon="shield" title={t('Verificación', 'Verification')} to="/verificacion">
              {t('Selfie que confirma tus fotos.', 'A selfie that confirms your photos.')}
            </FeatureCard>
            <FeatureCard icon="users" title={t('Contactos de confianza', 'Trusted contacts')} to="/seguridad">
              {t('Comparte tus planes con quien tú elijas.', 'Share your plans with whoever you choose.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('Llamada de salida', 'Exit call')} to="/seguridad">
              {t('Una llamada falsa para irte sin explicaciones.', 'A fake call so you can leave without explaining.')}
            </FeatureCard>
            <FeatureCard icon="chat" title={t('Quién te escribe', 'Who messages you')} to="/ayuda/quien-me-escribe">
              {t('Sólo verificados o “yo escribo primero”.', 'Verified only or “I message first”.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Membresia() {
  const t = useT();
  const crumbs = useCrumbs();
  const yes = <span className="yes">✓</span>;
  const no = <span className="no">—</span>;
  return (
    <>
      <PageHero
        eyebrow={t('Membresía', 'Membership')}
        title={t('Una sola membresía, todo incluido', 'One membership, everything included')}
        lead={t('Sin niveles confusos. Durante el lanzamiento Datecito es gratis; cuando empiece el cobro, ésta será tu membresía.', 'No confusing tiers. During launch Datecito is free; once billing starts, this will be your membership.')}
        crumbs={crumbs(t('Membresía', 'Membership'))}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="plans">
            <div className="plan">
              <h3>{t('Lanzamiento', 'Launch')}</h3>
              <p className="muted">{t('Por tiempo limitado', 'For a limited time')}</p>
              <div className="price">{t('Gratis', 'Free')}</div>
              <ul className="checklist">
                <li>{t('Acceso completo durante la beta', 'Full access during the beta')}</li>
                <li>{t('Verificación y Datecito Seguro', 'Verification and Datecito Safe')}</li>
                <li>{t('Te avisamos antes de cualquier cobro', 'We’ll let you know before any charge')}</li>
              </ul>
              <Link to="/descargar" className="btn btn-ghost">
                {t('Descargar la app', 'Get the app')}
              </Link>
            </div>
            <div className="plan featured">
              <span className="plan-badge">{t('Mejor precio · 2 meses gratis', 'Best price · 2 months free')}</span>
              <h3>{t('Anual', 'Yearly')}</h3>
              <p className="muted">{t(`Equivale a ${money(p.yearly / 12)} al mes`, `Works out to ${money(p.yearly / 12)} a month`)}</p>
              <div className="price">
                {money(p.yearly)} <small>{t('/ año', '/ year')}</small>
              </div>
              <ul className="checklist">
                <li>{t('Todo lo de la membresía', 'Everything in the membership')}</li>
                <li>
                  <strong>{t('1 Boost cada semana', '1 Boost every week')}</strong>
                </li>
                <li>{t('Precio fijo por 12 meses', 'Fixed price for 12 months')}</li>
              </ul>
              <Link to="/descargar" className="btn btn-primary">
                {t('Elegir Anual en la app', 'Choose Yearly in the app')}
              </Link>
            </div>
            <div className="plan">
              <h3>{t('Mensual', 'Monthly')}</h3>
              <p className="muted">{t('Cancela cuando quieras', 'Cancel anytime')}</p>
              <div className="price">
                {money(p.monthly)} <small>{t('/ mes', '/ month')}</small>
              </div>
              <ul className="checklist">
                <li>{t('Todo lo de la membresía', 'Everything in the membership')}</li>
                <li>{t('Sin compromiso de permanencia', 'No commitment')}</li>
              </ul>
              <Link to="/descargar" className="btn btn-dark">
                {t('Elegir Mensual en la app', 'Choose Monthly in the app')}
              </Link>
            </div>
          </div>
          <p className="small muted center" style={{ marginTop: 24, maxWidth: 760, marginInline: 'auto' }}>
            {t(
              'Precios en dólares; tu tienda muestra el equivalente en tu moneda antes de pagar. El pago se hace con tu cuenta de Google Play o App Store y se renueva automáticamente al final de cada periodo, salvo que lo canceles al menos 24 h antes. Consulta los',
              'Prices in US dollars; your store shows the equivalent in your currency before you pay. Payment is made with your Google Play or App Store account and renews automatically at the end of each period unless you cancel at least 24 h before. See the',
            )}{' '}
            <Link className="link" to="/legal/suscripciones">
              {t('Términos de suscripción', 'Subscription terms')}
            </Link>
            .
          </p>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <SectionHead title={t('Qué incluye', 'What’s included')} />
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>{t('Función', 'Feature')}</th>
                  <th>{t('Sin membresía', 'No membership')}</th>
                  <th>{t('Mensual', 'Monthly')}</th>
                  <th>{t('Anual', 'Yearly')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t('Crear perfil y verificación', 'Create profile and verification'), yes, yes, yes],
                  [t('Datecito Seguro y contactos de confianza', 'Datecito Safe and trusted contacts'), yes, yes, yes],
                  [t('Likes ilimitados', 'Unlimited likes'), no, yes, yes],
                  [t('Chats y datecitos sin límite', 'Unlimited chats and dates'), no, yes, yes],
                  [t('Aquí y ahora en cualquier lugar', 'Here & Now anywhere'), no, yes, yes],
                  [t('Filtros “Prefiero” y “Sólo”', '“Prefer” and “Only” filters'), no, yes, yes],
                  [t('1 Super like diario', '1 daily Super Like'), no, yes, yes],
                  [t('Deshacer último perfil', 'Undo last profile'), no, yes, yes],
                  [t('1 Boost cada semana', '1 Boost every week'), no, no, yes],
                ].map(([a, ...cells]) => (
                  <tr key={a as string}>
                    <td>{a}</td>
                    {cells.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <SectionHead title={t('Preguntas sobre la membresía', 'Membership questions')} />
          <Faq
            items={[
              { q: t('¿Cuándo empieza el cobro?', 'When does billing start?'), a: t('Te avisaremos dentro de la app y por correo con anticipación. Nunca te cobraremos sin que confirmes una compra.', 'We’ll let you know in advance in the app and by email. We’ll never charge you without you confirming a purchase.') },
              {
                q: t('¿Cómo cancelo?', 'How do I cancel?'),
                a: (
                  <>
                    {t('Desde Google Play o App Store.', 'From Google Play or the App Store.')}{' '}
                    <Link className="link" to="/ayuda/cancelar-membresia">
                      {t('Ver pasos', 'See steps')}
                    </Link>
                    .
                  </>
                ),
              },
              {
                q: t('¿Hay reembolsos?', 'Are there refunds?'),
                a: (
                  <>
                    {t('Se gestionan con la tienda donde pagaste.', 'They’re handled by the store where you paid.')}{' '}
                    <Link className="link" to="/ayuda/reembolso">
                      {t('Cómo solicitarlo', 'How to request one')}
                    </Link>
                    .
                  </>
                ),
              },
              {
                q: t('¿Tengo un código promocional?', 'I have a promo code'),
                a: (
                  <>
                    {t('Canjéalo en', 'Redeem it at')}{' '}
                    <Link className="link" to="/codigo-promocional">
                      {t('Código promocional', 'Promo code')}
                    </Link>
                    .
                  </>
                ),
              },
              { q: t('¿Puedo regalar una membresía?', 'Can I gift a membership?'), a: t('Muy pronto podrás comprar tarjetas de regalo de Datecito.', 'Soon you’ll be able to buy Datecito gift cards.') },
            ]}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function SuperLikes() {
  const t = useT();
  const crumbs = useCrumbs();
  return (
    <>
      <PageHero
        eyebrow={t('Destaca', 'Stand out')}
        title={t('Super likes y Boost', 'Super Likes & Boost')}
        lead={t('Cuando alguien te encanta o quieres que te vean más, tienes con qué.', 'When you really like someone or want more people to see you, you’ve got options.')}
        crumbs={crumbs(t('Super likes y Boost', 'Super Likes & Boost'))}
      />
      <section className="section">
        <div className="container grid g2">
          <div className="card">
            <div className="icon-badge" style={{ color: '#3b82f6', background: '#e6efff' }}>
              <Icon name="star-fill" size={26} />
            </div>
            <h2>Super like</h2>
            <p className="lead">
              {t(
                'La otra persona sabrá que le diste Super like antes de decidir. Los perfiles con Super like tienen más probabilidad de hacer match.',
                'The other person will know you Super Liked them before they decide. Super Liked profiles are more likely to match.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('1 Super like gratis cada día con membresía', '1 free Super Like every day with membership')}</li>
              <li>{t(`Paquete de ${p.superPackQty} por ${money(p.superPack)}`, `Pack of ${p.superPackQty} for ${money(p.superPack)}`)}</li>
              <li>{t('No caducan mientras tu cuenta esté activa', 'They don’t expire while your account is active')}</li>
            </ul>
          </div>
          <div className="card">
            <div className="icon-badge" style={{ color: '#a855f7', background: '#f3e8ff' }}>
              <Icon name="bolt" size={26} />
            </div>
            <h2>Boost</h2>
            <p className="lead">
              {t(
                'Durante 30 minutos apareces entre los primeros perfiles de tu zona. Úsalo cuando hay más gente conectada, por ejemplo el domingo en la tarde.',
                'For 30 minutes you’re among the top profiles in your area. Use it when more people are online, like Sunday afternoon.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('1 Boost cada semana con membresía anual', '1 Boost every week with yearly membership')}</li>
              <li>{t('Ves en tiempo real cuántas personas te vieron', 'See in real time how many people saw you')}</li>
              <li>{t('Ideal combinado con Aquí y ahora', 'Great combined with Here & Now')}</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Datecitos() {
  const t = useT();
  const crumbs = useCrumbs();
  return (
    <>
      <PageHero
        eyebrow="Datecitos"
        title={t('Del chat al plan, en un toque', 'From chat to plan, in one tap')}
        lead={t('Proponer una cita no debería ser incómodo. Con Datecitos eliges plan, lugar, día y hora desde la conversación.', 'Asking someone out shouldn’t be awkward. With Datecitos you pick the plan, place, day and time right from the chat.')}
        crumbs={crumbs('Datecitos')}
        aside={<PhoneChat />}
      />
      <section className="section">
        <div className="container">
          <SectionHead title={t('Cómo funciona', 'How it works')} />
          <div className="grid g4 steps">
            <div className="card step">
              <h3>{t('Elige el plan', 'Pick the plan')}</h3>
              <p className="muted">{t('Café, comida, caminata, bar, museo, deporte o algo diferente.', 'Coffee, food, a walk, a bar, a museum, sports or something different.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Lugar y hora', 'Place and time')}</h3>
              <p className="muted">{t('Sugiere un lugar público y un horario que les funcione.', 'Suggest a public place and a time that works for both.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Respuesta', 'Response')}</h3>
              <p className="muted">{t('Tu match acepta, propone otro horario o declina con amabilidad.', 'Your match accepts, suggests another time or kindly declines.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Datecito Seguro', 'Datecito Safe')}</h3>
              <p className="muted">{t('Comparte el plan con tus contactos y define un check-in.', 'Share the plan with your contacts and set a check-in.')}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Después de la cita', 'After the date')}</span>
            <h2>{t('Cuéntanos cómo te fue', 'Tell us how it went')}</h2>
            <p className="lead">
              {t(
                'Tu feedback es privado: nunca se comparte con la otra persona. Nos ayuda a mejorar tus recomendaciones y a detectar conductas que no se valen.',
                'Your feedback is private: it’s never shared with the other person. It helps us improve your recommendations and spot behavior that isn’t OK.',
              )}
            </p>
          </div>
          <div className="card center">
            <h3>{t('¿Cómo estuvo tu datecito con Mateo?', 'How was your date with Mateo?')}</h3>
            <div style={{ fontSize: '2.2rem', display: 'flex', justifyContent: 'center', gap: 16, margin: '12px 0' }} aria-hidden>
              😕 🙂 😍
            </div>
            <p className="muted small">{t('Sólo lo vemos nosotros.', 'Only we see this.')}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead title={t('Ideas para tu próximo datecito', 'Ideas for your next date')} lead={t('Inspírate con planes por ciudad.', 'Get inspired with plans by city.')} />
          <div className="center">
            <Link to="/destinos" className="btn btn-dark">
              {t('Explorar destinos', 'Explore destinations')}
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function AquiYAhora() {
  const t = useT();
  const crumbs = useCrumbs();
  return (
    <>
      <PageHero
        eyebrow={t('Aquí y ahora', 'Here & Now')}
        title={t('¿Con ganas de salir hoy?', 'Feel like going out today?')}
        lead={t('Activa tu disponibilidad por 1, 2 o 3 horas y descubre a personas cerca que también quieren un plan ya.', 'Set yourself as available for 1, 2 or 3 hours and discover people nearby who also want a plan right now.')}
        crumbs={crumbs(t('Aquí y ahora', 'Here & Now'))}
        aside={<PhoneNearby />}
      />
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="clock" title={t('Por tiempo limitado', 'Time-limited')}>
            {t('Al terminar el tiempo dejas de aparecer automáticamente. Puedes apagarlo antes.', 'When time is up you stop appearing automatically. You can turn it off sooner.')}
          </FeatureCard>
          <FeatureCard icon="pin" title={t('Distancia aproximada', 'Approximate distance')}>
            {t('Mostramos “a 800 m”, nunca tu ubicación exacta.', 'We show “800 m away”, never your exact location.')}
          </FeatureCard>
          <FeatureCard icon="eye-off" title={t('Ocúltate de quien quieras', 'Hide from anyone')}>
            {t('Elige “Ocultarme de…” para que una persona específica no te vea.', 'Choose “Hide me from…” so a specific person can’t see you.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <Faq
            items={[
              { q: t('¿Necesito membresía?', 'Do I need a membership?'), a: t('Con membresía puedes usar Aquí y ahora en cualquier lugar.', 'With a membership you can use Here & Now anywhere.') },
              { q: t('¿Quién me ve?', 'Who sees me?'), a: t('Sólo las personas que también activaron Aquí y ahora cerca de ti y que coinciden con tus preferencias.', 'Only people near you who also turned on Here & Now and match your preferences.') },
              {
                q: t('¿Es seguro?', 'Is it safe?'),
                a: (
                  <>
                    {t('Te recomendamos verse en lugares públicos y activar Datecito Seguro.', 'We recommend meeting in public places and turning on Datecito Safe.')}{' '}
                    <Link className="link" to="/seguridad/consejos">
                      {t('Consejos de seguridad', 'Safety tips')}
                    </Link>
                    .
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function Verificacion() {
  const t = useT();
  const crumbs = useCrumbs();
  return (
    <>
      <PageHero
        eyebrow={t('Verificación', 'Verification')}
        title={t('Perfiles reales, con selfie', 'Real profiles, selfie-verified')}
        lead={t('La verificación confirma que la persona coincide con sus fotos. Es gratis y toma un par de minutos.', 'Verification confirms the person matches their photos. It’s free and takes a couple of minutes.')}
        crumbs={crumbs(t('Verificación', 'Verification'))}
      />
      <section className="section">
        <div className="container grid g3 steps">
          <div className="card step">
            <h3>{t('Toma una selfie', 'Take a selfie')}</h3>
            <p className="muted">{t('Imita la pose que te mostramos en pantalla.', 'Copy the pose we show you on screen.')}</p>
          </div>
          <div className="card step">
            <h3>{t('La comparamos', 'We compare it')}</h3>
            <p className="muted">{t('Verificamos que coincida con las fotos de tu perfil.', 'We check it matches your profile photos.')}</p>
          </div>
          <div className="card step">
            <h3>{t('Recibe tu insignia', 'Get your badge')}</h3>
            <p className="muted">{t('Aparece junto a tu nombre y te da acceso a chats sólo verificados.', 'It appears next to your name and unlocks verified-only chats.')}</p>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <div className="notice green">
            <strong>{t('Tu biometría, protegida.', 'Your biometrics, protected.')}</strong>{' '}
            {t('Usamos la selfie sólo para verificarte y eliminamos la plantilla facial al concluir el proceso. Más detalles en la', 'We use the selfie only to verify you and delete the face template when the process ends. More details in the')}{' '}
            <Link className="link" to="/legal/datos-sensibles">
              {t('Política de datos sensibles', 'Sensitive Data Policy')}
            </Link>
            .
          </div>
          <p style={{ marginTop: 20 }} className="muted">
            {t('La verificación no es una revisión de antecedentes: siempre sigue nuestros', 'Verification is not a background check: always follow our')}{' '}
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

export function Universitarios() {
  const { toast } = useApp();
  const t = useT();
  const crumbs = useCrumbs();
  return (
    <>
      <PageHero
        eyebrow="Datecito U"
        title={t('Tu campus, tus planes', 'Your campus, your plans')}
        lead={t('Conecta con personas de tu universidad y alrededores. Verifica tu correo institucional y desbloquea la comunidad de tu campus.', 'Connect with people from your college and nearby. Verify your school email and unlock your campus community.')}
        crumbs={crumbs('Datecito U')}
      />
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="graduation" title={t('Correo institucional', 'School email')}>
            {t('Verifica tu correo .edu.mx para mostrar tu universidad en tu perfil.', 'Verify your .edu email to show your school on your profile.')}
          </FeatureCard>
          <FeatureCard icon="users" title={t('Comunidad de campus', 'Campus community')}>
            {t('Prioriza perfiles de tu universidad con el filtro “Prefiero”.', 'Prioritize profiles from your school with the “Prefer” filter.')}
          </FeatureCard>
          <FeatureCard icon="coffee" title={t('Planes cerca de la uni', 'Plans near campus')}>
            {t('Ideas de datecito económicas y cerca de tu campus.', 'Budget-friendly date ideas near your campus.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow center">
          <h2>{t('¿Tu universidad aún no está?', 'Your school isn’t here yet?')}</h2>
          <p className="lead">{t('Déjanos tu correo institucional y te avisamos cuando llegue Datecito U a tu campus.', 'Leave your school email and we’ll let you know when Datecito U reaches your campus.')}</p>
          <form
            className="btn-row"
            style={{ justifyContent: 'center' }}
            onSubmit={(e) => {
              e.preventDefault();
              toast(t('¡Listo! Te avisaremos cuando Datecito U llegue a tu campus.', 'Done! We’ll let you know when Datecito U reaches your campus.'));
              (e.target as HTMLFormElement).reset();
            }}
          >
            <input className="input" type="email" required placeholder={t('tu.nombre@universidad.edu.mx', 'your.name@university.edu')} style={{ maxWidth: 360 }} aria-label={t('Correo institucional', 'School email')} />
            <button className="btn btn-primary">{t('Avísame', 'Notify me')}</button>
          </form>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
