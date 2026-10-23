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
        lead={t('Herramientas para conocer gente real, platicar con calma y salir a datecitos con tranquilidad.', 'Tools to meet real people, chat at your own pace and go on dates with peace of mind.')}
        crumbs={[{ label: t('Funciones', 'Features') }]}
        aside={<PhoneSwipe />}
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t('Conocer', 'Meet')} title={t('Descubrir, likes y matches', 'Discover, likes and matches')} />
          <div className="grid g3">
            <FeatureCard icon="heart" title={t('Descubrir', 'Discover')}>
              {t('Cada día recibes un grupo de personas cerca de ti. Da like, Super like o pasa; si el like es mutuo, ¡es match!', 'Every day you get a group of people near you. Like, Super Like or pass; if the like is mutual, it’s a match!')}
            </FeatureCard>
            <FeatureCard icon="heart-fill" title={t('Quién te dio like', 'Who liked you')} to="/membresia">
              {t('Ve cuántas personas te dieron like. Con membresía ves quiénes son y les haces match directo, sin gastar tus likes del día.', 'See how many people liked you. With a membership you see who they are and match them directly, without spending your daily likes.')}
            </FeatureCard>
            <FeatureCard icon="star" title="Super like" to="/super-likes">
              {t('Haz saber que alguien te gustó mucho: tu perfil le aparece primero y destacado.', 'Let someone know you really like them: your profile shows up first and highlighted for them.')}
            </FeatureCard>
            <FeatureCard icon="radio" title={t('Aquí y ahora', 'Here & Now')} to="/aqui-y-ahora">
              {t('Descubre quién más está en el mismo café, bar o evento con ganas de conocer gente.', 'See who else is at the same café, bar or event and up for meeting people.')}
            </FeatureCard>
            <FeatureCard icon="sparkle" title={t('Lo que tienen en común', 'What you have in common')}>
              {t('Intereses, música, idiomas, equipos deportivos y preguntas con respuesta para empezar la plática.', 'Interests, music, languages, sports teams and answered prompts to start the conversation.')}
            </FeatureCard>
            <FeatureCard icon="eye" title={t('Vista previa del perfil', 'Profile preview')}>
              {t('Mira tu perfil tal como lo ven los demás.', 'See your profile exactly as others see it.')}
            </FeatureCard>
          </div>
        </div>
      </section>
      <section className="section alt" id="ritmo">
        <div className="container split">
          <div>
            <span className="eyebrow">{t('Un ritmo sano', 'A healthy pace')}</span>
            <h2>{t('Menos deslizar sin fin, más intención', 'Less endless swiping, more intention')}</h2>
            <p className="lead">
              {t(
                'Datecito no es un mazo infinito. Cada día tienes 40 perfiles y 30 likes: suficiente para conocer gente, poco para que un like deje de significar algo.',
                'Datecito isn’t an endless deck. Every day you get 40 profiles and 30 likes: enough to meet people, few enough that a like still means something.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('40 perfiles nuevos cada día, a medianoche', '40 new profiles every day, at midnight')}</li>
              <li>{t('30 likes al día; “No me interesa” no tiene límite', '30 likes a day; “Not interested” is unlimited')}</li>
              <li>{t('Segunda oportunidad: quien pasaste de largo vuelve a aparecer a los 14 días', 'Second chance: anyone you passed on comes back after 14 days')}</li>
              <li>{t('Corresponder un like no gasta tus likes del día', 'Liking someone back doesn’t spend your daily likes')}</li>
            </ul>
          </div>
          <div className="card">
            <span className="eyebrow">{t('Filtros', 'Filters')}</span>
            <h3>{t('Filtra por lo que importa, sin discriminar', 'Filter by what matters, without discriminating')}</h3>
            {[
              [t('Quiero conocer a', 'I want to meet'), t('Mujeres, hombres o todas las personas', 'Women, men or everyone')],
              [t('Edad y distancia', 'Age and distance'), t('Siempre aproximada, nunca exacta', 'Always approximate, never exact')],
              [t('Qué busca', 'What they’re looking for'), t('Algo serio, conocer sin presión…', 'Something serious, no-pressure dating…')],
              [t('Qué le gusta', 'What they like'), t('Intereses populares; sólo ordenan, no ocultan a nadie', 'Popular interests; they only reorder, nobody is hidden')],
              [t('Sólo verificados', 'Verified only'), t('Ver únicamente perfiles con selfie verificada', 'See only selfie-verified profiles')],
            ].map(([a, b]) => (
              <div className="toggle-row" key={a as string}>
                <div>
                  <strong style={{ color: 'var(--verde)' }}>{a}</strong>
                  <div className="muted small">{b}</div>
                </div>
              </div>
            ))}
            <p className="small muted" style={{ marginTop: 12 }}>{t('No hay filtros por apariencia física.', 'There are no physical-appearance filters.')}</p>
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
                'Platica con tus matches sin “visto”, sin “en línea” y sin “escribiendo…”. Cuando quieran verse, propón un datecito con lugar, día y hora desde el calendario. Después de la cita, cuéntanos en privado cómo te fue.',
                'Chat with your matches with no read receipts, no “online” and no “typing…”. When you want to meet, propose a date with place, day and time from the calendar. After the date, tell us privately how it went.',
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
              {t('Selfie con pose al azar, revisada por una persona.', 'A selfie with a random pose, reviewed by a real person.')}
            </FeatureCard>
            <FeatureCard icon="users" title={t('Contactos de confianza', 'Trusted contacts')} to="/seguridad">
              {t('Avísales tu plan por WhatsApp con un toque.', 'Share your plan with them on WhatsApp in one tap.')}
            </FeatureCard>
            <FeatureCard icon="phone" title={t('Llamada de salida', 'Exit call')} to="/seguridad">
              {t('Una llamada falsa para irte sin explicaciones.', 'A fake call so you can leave without explaining.')}
            </FeatureCard>
            <FeatureCard icon="lock" title={t('Bloquear y reportar', 'Block and report')} to="/seguridad/normas-de-la-comunidad">
              {t('Dos toques. Cada reporte lo revisa una persona.', 'Two taps. Every report is reviewed by a person.')}
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
                <li>{t('Acceso completo durante el lanzamiento', 'Full access during launch')}</li>
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
              <p className="muted">{t(`Equivale a ${money(Math.round(p.yearly / 12))} al mes`, `Works out to ${money(Math.round(p.yearly / 12))} a month`)}</p>
              <div className="price">
                {money(p.yearly)} <small>{t('/ año', '/ year')}</small>
              </div>
              <ul className="checklist">
                <li>{t('Todo lo de la membresía', 'Everything in the membership')}</li>
                <li>
                  <strong>{t('Dos meses gratis frente a la mensual', 'Two months free compared to monthly')}</strong>
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
              'Precios en pesos mexicanos; fuera de México tu tienda muestra el equivalente en tu moneda antes de pagar. El pago se hace con tu cuenta de Google Play o App Store y se renueva automáticamente al final de cada periodo, salvo que lo canceles al menos 24 h antes. Consulta los',
              'Prices in Mexican pesos; outside Mexico your store shows the equivalent in your currency before you pay. Payment is made with your Google Play or App Store account and renews automatically at the end of each period unless you cancel at least 24 h before. See the',
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
          <SectionHead title={t('Qué incluye', 'What’s included')} lead={t('Lo que cuida tu seguridad es gratis para todos, siempre.', 'Everything that protects your safety is free for everyone, always.')} />
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>{t('Función', 'Feature')}</th>
                  <th>{t('Sin membresía', 'No membership')}</th>
                  <th>{t('Con membresía', 'With membership')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t('Crear perfil y verificación por selfie', 'Create profile and selfie verification'), yes, yes],
                  [t('Datecito Seguro, contactos de confianza, bloquear y reportar', 'Datecito Safe, trusted contacts, block and report'), yes, yes],
                  [t('Ver cuántas personas te dieron like', 'See how many people liked you'), yes, yes],
                  [t('Ver quiénes te dieron like y hacerles match directo', 'See who liked you and match them directly'), no, yes],
                  [t('Descubrir: 40 perfiles y 30 likes al día', 'Discover: 40 profiles and 30 likes a day'), no, yes],
                  [t('Chats, datecitos con calendario y Aquí y ahora', 'Chats, calendar dates and Here & Now'), no, yes],
                  [t('Todos los filtros', 'All filters'), no, yes],
                  [t('1 Super like gratis cada 3 días', '1 free Super Like every 3 days'), no, yes],
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
          <p className="small muted" style={{ marginTop: 16 }}>
            {t('Durante el lanzamiento todas las personas tienen acceso a la columna “Con membresía” sin pagar.', 'During launch everyone gets the “With membership” column at no cost.')}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <SectionHead title={t('Preguntas sobre la membresía', 'Membership questions')} />
          <Faq
            items={[
              { q: t('¿Cuándo empieza el cobro?', 'When does billing start?'), a: t('Te avisaremos dentro de la app y por correo con anticipación. Nunca te cobraremos sin que confirmes una compra en tu tienda.', 'We’ll let you know in advance in the app and by email. We’ll never charge you without you confirming a purchase in your store.') },
              {
                q: t('¿Cómo cancelo?', 'How do I cancel?'),
                a: (
                  <>
                    {t('Desde Google Play o App Store, en cualquier momento; conservas el acceso hasta el fin del periodo pagado.', 'From Google Play or the App Store, at any time; you keep access until the end of the paid period.')}{' '}
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
                    {t('Se gestionan con la tienda donde pagaste, según sus políticas.', 'They’re handled by the store where you paid, under its policies.')}{' '}
                    <Link className="link" to="/ayuda/reembolso">
                      {t('Cómo solicitarlo', 'How to request one')}
                    </Link>
                    .
                  </>
                ),
              },
              {
                q: t('¿Qué pasa con mis matches si no pago?', 'What happens to my matches if I don’t pay?'),
                a: t('Nada se borra. Tus matches, chats y datecitos se conservan; sólo se pausan las funciones de la columna “Con membresía” hasta que la actives.', 'Nothing is deleted. Your matches, chats and dates are kept; only the “With membership” features pause until you activate it.'),
              },
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
        title={t('Super likes', 'Super Likes')}
        lead={t('Cuando alguien te encanta, díselo antes de que decida: tu perfil le aparece primero y destacado.', 'When you really like someone, tell them before they decide: your profile shows up first and highlighted for them.')}
        crumbs={crumbs(t('Super likes', 'Super Likes'))}
      />
      <section className="section">
        <div className="container grid g2">
          <div className="card">
            <div className="icon-badge" style={{ color: '#3b82f6', background: '#e6efff' }}>
              <Icon name="star-fill" size={26} />
            </div>
            <h2>{t('Cómo funciona', 'How it works')}</h2>
            <p className="lead">
              {t(
                'La otra persona te ve al principio de su Descubrir con la etiqueta “Te dio un Super like” y recibe una animación especial al abrir la app. Si le gustas, hay match al instante.',
                'The other person sees you at the top of their Discover with a “Super Liked you” tag and gets a special animation when they open the app. If they like you back, it’s an instant match.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('1 Super like gratis cada 3 días', '1 free Super Like every 3 days')}</li>
              <li>{t(`Paquete de ${p.superPackQty} por ${money(p.superPack)}, pago único`, `Pack of ${p.superPackQty} for ${money(p.superPack)}, one-time purchase`)}</li>
              <li>{t('Los comprados no caducan mientras tu cuenta esté activa', 'Purchased ones don’t expire while your account is active')}</li>
            </ul>
          </div>
          <div className="card">
            <div className="icon-badge" style={{ color: '#EF5A5A', background: '#FFEDE7' }}>
              <Icon name="heart-fill" size={26} />
            </div>
            <h2>{t('Úsalo con intención', 'Use it with intention')}</h2>
            <p className="lead">
              {t(
                'Por eso es escaso: un Super like cada tres días vale más que diez al día. Guárdalo para alguien que de verdad te gustó y acompáñalo, cuando haya match, con un primer mensaje sobre algo de su perfil.',
                'That’s why it’s scarce: one Super Like every three days means more than ten a day. Save it for someone you really liked and, once you match, follow up with a first message about something on their profile.',
              )}
            </p>
            <ul className="checklist">
              <li>{t('Sirve igual con y sin membresía', 'Works the same with or without a membership')}</li>
              <li>{t('Nunca mostramos a quién le diste Super like a otras personas', 'We never show other people who you Super Liked')}</li>
              <li>{t('Se compra dentro de la app, con Google Play o App Store', 'Purchased in the app, through Google Play or the App Store')}</li>
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
              <p className="muted">{t('Café, comida, bar, aire libre, cultura o algo diferente.', 'Coffee, food, a bar, the outdoors, culture or something different.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Lugar, día y hora', 'Place, day and time')}</h3>
              <p className="muted">{t('Escribe el lugar y elige el día y la hora en el calendario; verás marcados los días en que ya tienes otro datecito.', 'Type the place and pick the day and time on the calendar; days when you already have another date are marked.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Confirmación', 'Confirmation')}</h3>
              <p className="muted">{t('Tu match confirma o les sigue platicando para ajustar el plan. Hasta que ambos confirman, es sólo una invitación.', 'Your match confirms or keeps chatting to adjust the plan. Until you both confirm, it’s just an invitation.')}</p>
            </div>
            <div className="card step">
              <h3>{t('Datecito Seguro', 'Datecito Safe')}</h3>
              <p className="muted">{t('Avisa a tus contactos por WhatsApp y define cada cuánto te preguntamos si todo va bien.', 'Let your contacts know on WhatsApp and set how often we ask if everything is OK.')}</p>
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
                'Tu respuesta es privada y se guarda cifrada: nunca se comparte con la otra persona. Nos ayuda a detectar conductas que no se valen y a cuidar a la comunidad.',
                'Your answer is private and stored encrypted: it’s never shared with the other person. It helps us spot behavior that isn’t OK and look after the community.',
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
        title={t('¿Quién más está aquí?', 'Who else is here?')}
        lead={t('Estás en un café, un bar o un evento. Activa Aquí y ahora y descubre quién está en el mismo lugar con ganas de conocer gente, en este momento.', 'You’re at a café, a bar or an event. Turn on Here & Now and see who is in the same place and up for meeting people, right now.')}
        crumbs={crumbs(t('Aquí y ahora', 'Here & Now'))}
        aside={<PhoneNearby />}
      />
      <section className="section">
        <div className="container grid g3">
          <FeatureCard icon="pin" title={t('El mismo lugar', 'The same place')}>
            {t('Sólo ves a quienes están a unos metros de ti y también lo activaron. Nadie ve tu ubicación exacta.', 'You only see people within a few meters who also turned it on. Nobody sees your exact location.')}
          </FeatureCard>
          <FeatureCard icon="clock" title={t('Por 1, 2 o 3 horas', 'For 1, 2 or 3 hours')}>
            {t('Eliges cuánto tiempo estarás ahí. Al terminar dejas de aparecer automáticamente; puedes apagarlo antes.', 'You choose how long you’ll be there. When time is up you stop appearing automatically; you can turn it off sooner.')}
          </FeatureCard>
          <FeatureCard icon="eye-off" title={t('Ocúltate de quien quieras', 'Hide from anyone')}>
            {t('Si ves a alguien de quien prefieres no saber nada, elige “Ocultarme de…” y no te verá.', 'If you spot someone you’d rather not deal with, choose “Hide me from…” and they won’t see you.')}
          </FeatureCard>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <Faq
            items={[
              { q: t('¿Cómo saludo a alguien?', 'How do I say hi?'), a: t('Con un toque le mandas un saludo. Si la otra persona también quiere, abren chat como con cualquier match.', 'One tap sends a greeting. If the other person is interested too, you open a chat like with any match.') },
              { q: t('¿Quién me ve?', 'Who sees me?'), a: t('Sólo las personas que también activaron Aquí y ahora en el mismo lugar. Puedes pedir que únicamente te vean perfiles verificados.', 'Only people who also turned on Here & Now in the same place. You can ask that only verified profiles see you.') },
              {
                q: t('¿Es seguro?', 'Is it safe?'),
                a: (
                  <>
                    {t('Están en un lugar público y con gente, que es justo lo que recomendamos. Aun así, cuida tu bebida, avisa a alguien de confianza y revisa nuestros', 'You’re in a public place with people around, which is exactly what we recommend. Still, watch your drink, tell someone you trust and check our')}{' '}
                    <Link className="link" to="/seguridad/consejos">
                      {t('consejos de seguridad', 'safety tips')}
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
        title={t('Aquí todos son reales', 'Everyone here is real')}
        lead={t('La verificación confirma que la persona coincide con sus fotos. Es gratis, la revisa una persona del equipo y te da la insignia que todos buscan.', 'Verification confirms the person matches their photos. It’s free, it’s reviewed by a real team member and it earns you the badge everyone looks for.')}
        crumbs={crumbs(t('Verificación', 'Verification'))}
      />
      <section className="section">
        <div className="container grid g3 steps">
          <div className="card step">
            <h3>{t('Toma una selfie con la pose', 'Take a selfie with the pose')}</h3>
            <p className="muted">{t('La app te pide una pose al azar (una seña de paz, la mano en la barbilla…). Quien usa fotos ajenas no tiene una con esa pose.', 'The app asks for a random pose (a peace sign, a hand on your chin…). Someone using stolen photos won’t have one with that pose.')}</p>
          </div>
          <div className="card step">
            <h3>{t('Una persona la revisa', 'A real person reviews it')}</h3>
            <p className="muted">{t('Comparamos la selfie con tus fotos y comprobamos la pose. Tarda entre 48 y 72 horas; mientras, tu perfil muestra “En verificación”.', 'We compare the selfie with your photos and check the pose. It takes 48 to 72 hours; meanwhile your profile shows “Verifying”.')}</p>
          </div>
          <div className="card step">
            <h3>{t('Recibe tu insignia', 'Get your badge')}</h3>
            <p className="muted">{t('Aparece junto a tu nombre y te incluye en el filtro “Sólo verificados” de los demás.', 'It appears next to your name and includes you in other people’s “Verified only” filter.')}</p>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container narrow">
          <div className="notice green">
            <strong>{t('Tu selfie, en privado.', 'Your selfie stays private.')}</strong>{' '}
            {t('Se guarda cifrada, nunca aparece en tu perfil y sólo la ve el equipo que revisa verificaciones. No usamos reconocimiento facial automatizado. Más detalles en la', 'It’s stored encrypted, never appears on your profile and is only seen by the team that reviews verifications. We don’t use automated facial recognition. More details in the')}{' '}
            <Link className="link" to="/legal/datos-sensibles">
              {t('Política de datos sensibles', 'Sensitive Data Policy')}
            </Link>
            .
          </div>
          <p style={{ marginTop: 20 }} className="muted">
            {t('Mientras tu selfie está en revisión puedes usar Datecito con normalidad. La verificación no es una revisión de antecedentes: siempre sigue nuestros', 'While your selfie is being reviewed you can use Datecito normally. Verification is not a background check: always follow our')}{' '}
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
