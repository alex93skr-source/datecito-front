import { useParams } from 'react-router-dom';

import { useApp } from '../components/AppState';
import { DocPage } from '../components/Doc';
import { FormError, Honeypot, useWebForm } from '../components/forms';
import { Icon } from '../components/Icon';
import { Faq, FeatureCard, PageHero, SectionHead } from '../components/ui';
import { useContent } from '../content';
import { Link, useT } from '../i18n';
import { company } from '../site';
import NotFound from './NotFound';

function useLegalDocs() {
  const c = useContent();
  return [c.terminos, c.privacidad, c.privacidadSimplificado, c.datosSensibles, c.cookies, c.suscripciones, c.propiedadIntelectual];
}

const legal = { label: 'Legal', to: '/legal' };

export function LegalIndex() {
  const t = useT();
  const docs = useLegalDocs();
  return (
    <>
      <PageHero eyebrow="Legal" title={t('Documentos legales', 'Legal documents')} lead={t('Todo lo que rige tu relación con Datecito, en un solo lugar y en lenguaje claro.', 'Everything that governs your relationship with Datecito, in one place and in plain language.')} crumbs={[{ label: 'Legal' }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container grid g3">
          {docs.map((d) => (
            <FeatureCard key={d.slug} icon="doc" title={d.title} to={`/legal/${d.slug}`} green>
              {d.summary}
            </FeatureCard>
          ))}
          <FeatureCard icon="user" title={t('Derechos ARCO', 'ARCO rights')} to="/legal/arco" green>
            {t('Accede, rectifica, cancela u oponte al uso de tus datos.', 'Access, rectify, cancel or object to the use of your data.')}
          </FeatureCard>
          <FeatureCard icon="ban" title={t('Eliminar mi cuenta', 'Delete my account')} to="/eliminar-cuenta" green>
            {t('Cómo borrar tu cuenta y qué pasa con tus datos.', 'How to delete your account and what happens to your data.')}
          </FeatureCard>
          <FeatureCard icon="lock" title={t('Tus opciones de privacidad', 'Your privacy choices')} to="/legal/opciones-de-privacidad" green>
            {t('Qué controlas desde la app y desde este sitio.', 'What you control from the app and from this site.')}
          </FeatureCard>
          <FeatureCard icon="users" title={t('Normas de la comunidad', 'Community guidelines')} to="/seguridad/normas-de-la-comunidad" green>
            {t('Las reglas de convivencia de Datecito.', 'Datecito’s rules of conduct.')}
          </FeatureCard>
          <FeatureCard icon="shield" title={t('Seguridad de menores', 'Child safety')} to="/seguridad/menores" green>
            {t('Nuestras normas contra la explotación y el abuso infantil.', 'Our standards against child sexual abuse and exploitation.')}
          </FeatureCard>
          <FeatureCard icon="access" title={t('Accesibilidad', 'Accessibility')} to="/accesibilidad" green>
            {t('Nuestro compromiso con la accesibilidad.', 'Our commitment to accessibility.')}
          </FeatureCard>
          <FeatureCard icon="bug" title={t('Seguridad informática', 'Security')} to="/seguridad-informatica" green>
            {t('Divulgación responsable de vulnerabilidades.', 'Responsible vulnerability disclosure.')}
          </FeatureCard>
        </div>
      </section>
    </>
  );
}

export function LegalDocRoute() {
  const { slug } = useParams();
  const docs = useLegalDocs();
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) return <NotFound />;
  return <DocPage doc={doc} crumbs={[legal, { label: doc.title }]} />;
}

export function Accesibilidad() {
  const t = useT();
  const { accesibilidad } = useContent();
  return <DocPage doc={accesibilidad} crumbs={[{ label: t('Accesibilidad', 'Accessibility') }]} eyebrow={t('Accesibilidad', 'Accessibility')} />;
}

export function SeguridadInformatica() {
  const t = useT();
  const { seguridadInformatica } = useContent();
  return <DocPage doc={seguridadInformatica} crumbs={[{ label: t('Seguridad', 'Safety'), to: '/seguridad' }, { label: t('Seguridad informática', 'Security') }]} eyebrow={t('Seguridad', 'Safety')} />;
}

export function OpcionesPrivacidad() {
  const { setCookieSettings } = useApp();
  const t = useT();
  const rows: [string, string, string][] = [
    [t('Quién ve tu perfil', 'Who sees your profile'), t('Perfil › Ajustes › Privacidad', 'Profile › Settings › Privacy'), t('Pausa tu perfil en Descubrir, decide si se muestra tu género, ocupación o tipo de relación, y cuida tu ubicación aproximada.', 'Pause your profile in Discover, decide whether your gender, job or relationship type is shown, and manage your approximate location.')],
    [t('Notificaciones', 'Notifications'), t('Perfil › Ajustes › Notificaciones', 'Profile › Settings › Notifications'), t('Elige qué avisos recibes: matches, mensajes, datecitos, Super likes o novedades.', 'Choose which alerts you get: matches, messages, dates, Super Likes or news.')],
    [t('Personas bloqueadas', 'Blocked people'), t('Perfil › Ajustes › Bloqueados', 'Profile › Settings › Blocked'), t('Revisa y deshaz bloqueos cuando quieras.', 'Review and undo blocks whenever you want.')],
    [t('Cuenta y datos', 'Account and data'), t('Perfil › Ajustes › Cuenta', 'Profile › Settings › Account'), t('Cambia tu contraseña o elimina tu cuenta y tus datos.', 'Change your password or delete your account and your data.')],
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Privacidad', 'Privacy')}
        title={t('Tus opciones de privacidad', 'Your privacy choices')}
        lead={t('Lo que puedes decidir sobre tus datos y dónde hacerlo. Negarte a un uso secundario nunca afecta tu acceso al servicio.', 'What you can decide about your data and where to do it. Opting out of a secondary use never affects your access to the service.')}
        crumbs={[legal, { label: t('Tus opciones de privacidad', 'Your privacy choices') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <div className="notice green" style={{ marginBottom: 24 }}>
            <strong>{t('No vendemos tus datos personales', 'We do not sell your personal data')}</strong>{' '}
            {t('ni los usamos para publicidad de terceros. Tampoco usamos reconocimiento facial automatizado: la verificación la hace una persona.', 'nor do we use them for third-party advertising. We don’t use automated facial recognition either: verification is done by a person.')}
          </div>
          <SectionHead title={t('En la app', 'In the app')} lead={t('Los controles sobre tu cuenta viven dentro de Datecito, donde está tu sesión.', 'Controls over your account live inside Datecito, where your session is.')} center={false} />
          <div className="card">
            {rows.map(([title, where, d]) => (
              <div className="toggle-row" key={title}>
                <div>
                  <strong style={{ color: 'var(--verde)' }}>{title}</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    {d}
                  </p>
                </div>
                <span className="pill">{where}</span>
              </div>
            ))}
          </div>
          <SectionHead title={t('En este sitio', 'On this site')} center={false} />
          <div className="card">
            <p style={{ marginTop: 0 }}>
              {t('Este sitio sólo guarda tu idioma y tu decisión sobre cookies. Si algún día añadimos analítica, se activará únicamente con tu permiso.', 'This site only stores your language and your cookie choice. If we ever add analytics, it will only run with your permission.')}
            </p>
            <button className="btn btn-ghost" onClick={() => setCookieSettings(true)}>
              {t('Configuración de cookies', 'Cookie settings')}
            </button>
          </div>
          <p className="muted" style={{ marginTop: 24 }}>
            {t('Para acceder, corregir o eliminar tus datos también puedes usar el', 'To access, correct or delete your data you can also use the')}{' '}
            <Link className="link" to="/legal/arco">
              {t('formulario de derechos ARCO', 'ARCO rights form')}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

export function Arco() {
  const t = useT();
  const form = useWebForm('arco');
  return (
    <>
      <PageHero
        eyebrow={t('Privacidad', 'Privacy')}
        title={t('Solicitud de derechos ARCO', 'ARCO rights request')}
        lead={t('Ejerce tus derechos de Acceso, Rectificación, Cancelación y Oposición, o revoca tu consentimiento. Respondemos en un máximo de 20 días hábiles.', 'Exercise your rights of Access, Rectification, Cancellation and Objection, or withdraw your consent. We reply within 20 business days at most.')}
        crumbs={[legal, { label: t('Derechos ARCO', 'ARCO rights') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          {form.sent ? (
            <div className="card center">
              <div className="icon-badge green" style={{ margin: '0 auto 16px' }}>
                <Icon name="check" size={26} />
              </div>
              <h3>{t('Solicitud recibida', 'Request received')}</h3>
              <p className="muted">
                {t('Te responderemos en un plazo máximo de 20 días hábiles al correo que indicaste. Guarda este folio:', 'We’ll reply within 20 business days to the email you provided. Keep this reference number:')} <strong>{form.folio}</strong>
              </p>
            </div>
          ) : (
            <form className="card form" onSubmit={form.submit}>
              <div className="notice">
                {t(`Si prefieres, también puedes enviar tu solicitud por correo a ${company.emails.privacy}. Para borrar tu cuenta no necesitas este formulario: hazlo desde la app o consulta`, `If you prefer, you can also send your request by email to ${company.emails.privacy}. You don’t need this form to delete your account: do it from the app or see`)}{' '}
                <Link className="link" to="/eliminar-cuenta">
                  {t('Eliminar mi cuenta', 'Delete my account')}
                </Link>
                .
              </div>
              <Honeypot />
              <div className="form-row">
                <label className="field">
                  {t('Nombre completo', 'Full name')}
                  <input className="input" name="name" required maxLength={120} autoComplete="name" />
                </label>
                <label className="field">
                  {t('Correo de tu cuenta', 'Your account email')}
                  <input className="input" name="email" type="email" required autoComplete="email" />
                </label>
              </div>
              <label className="field">
                {t('Derecho que deseas ejercer', 'Right you want to exercise')}
                <select className="input" name="topic" required defaultValue="">
                  <option value="" disabled>
                    {t('Selecciona', 'Select')}
                  </option>
                  {[
                    ['Acceso', t('Acceso', 'Access')],
                    ['Rectificación', t('Rectificación', 'Rectification')],
                    ['Cancelación', t('Cancelación', 'Cancellation')],
                    ['Oposición', t('Oposición', 'Objection')],
                    ['Revocación del consentimiento', t('Revocación del consentimiento', 'Withdrawal of consent')],
                    ['Limitación de uso o divulgación', t('Limitación de uso o divulgación', 'Limit use or disclosure')],
                  ].map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                {t('Describe tu solicitud', 'Describe your request')}
                <textarea className="input" name="message" required minLength={10} maxLength={4000} rows={5} placeholder={t('Datos a los que se refiere y lo que solicitas', 'The data it concerns and what you are requesting')} />
              </label>
              <label className="field">
                {t('Identificación oficial (INE, pasaporte), imagen o PDF de hasta 8 MB', 'Official ID (INE, passport), image or PDF up to 8 MB')}
                <input className="input" name="attachment" type="file" accept="image/*,application/pdf" />
              </label>
              <label className="check">
                <input type="checkbox" name="accepted" required />
                <span>{t('Declaro bajo protesta de decir verdad que soy titular de los datos o su representante legal.', 'I declare under penalty of perjury that I am the data owner or their legal representative.')}</span>
              </label>
              <FormError message={form.error} />
              <button className="btn btn-primary" disabled={form.sending}>
                {form.sending ? t('Enviando…', 'Sending…') : t('Enviar solicitud', 'Submit request')}
              </button>
              <p className="small muted" style={{ margin: 0 }}>
                {t('Tu identificación se guarda cifrada, sólo la ve el equipo de privacidad y se elimina al cerrar la solicitud.', 'Your ID is stored encrypted, only seen by the privacy team and deleted once the request is closed.')}
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

/** Página pública para borrar la cuenta (Google Play exige una URL con estos pasos). */
export function EliminarCuenta() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t('Tu cuenta', 'Your account')}
        title={t('Eliminar mi cuenta de Datecito', 'Delete my Datecito account')}
        lead={t('Puedes borrar tu cuenta y tus datos en cualquier momento, desde la app o escribiéndonos. Aquí te explicamos cómo y qué pasa después.', 'You can delete your account and your data at any time, from the app or by writing to us. Here’s how and what happens next.')}
        crumbs={[legal, { label: t('Eliminar mi cuenta', 'Delete my account') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <div className="grid g2">
            <div className="card">
              <div className="icon-badge">
                <Icon name="phone" size={26} />
              </div>
              <h3>{t('Desde la app (recomendado)', 'From the app (recommended)')}</h3>
              <ol style={{ paddingLeft: 20, margin: 0 }}>
                <li>{t('Abre Datecito y entra a Perfil › Ajustes › Cuenta.', 'Open Datecito and go to Profile › Settings › Account.')}</li>
                <li>{t('Toca “Eliminar mi cuenta”.', 'Tap “Delete my account”.')}</li>
                <li>{t('Escribe tu contraseña para confirmar.', 'Enter your password to confirm.')}</li>
              </ol>
              <p className="muted small">{t('La eliminación es inmediata y no se puede deshacer.', 'Deletion is immediate and cannot be undone.')}</p>
            </div>
            <div className="card">
              <div className="icon-badge">
                <Icon name="chat" size={26} />
              </div>
              <h3>{t('Si ya no puedes entrar', 'If you can’t sign in anymore')}</h3>
              <p>
                {t('Escríbenos desde el correo con el que te registraste a', 'Write to us from the email you signed up with at')}{' '}
                <a className="link" href={`mailto:${company.emails.privacy}?subject=${encodeURIComponent(t('Eliminar mi cuenta', 'Delete my account'))}`}>
                  {company.emails.privacy}
                </a>{' '}
                {t('con el asunto “Eliminar mi cuenta”. Confirmaremos tu identidad y la borraremos en un máximo de 5 días hábiles.', 'with the subject “Delete my account”. We’ll confirm your identity and delete it within 5 business days at most.')}
              </p>
              <p className="muted small">{t('También puedes usar el formulario de derechos ARCO eligiendo “Cancelación”.', 'You can also use the ARCO rights form and choose “Cancellation”.')}</p>
            </div>
          </div>
          <SectionHead title={t('Qué se borra y qué se conserva', 'What is deleted and what is kept')} center={false} />
          <Faq
            items={[
              {
                q: t('¿Qué se elimina de inmediato?', 'What is deleted immediately?'),
                a: t('Tu perfil, fotos, selfie de verificación, intereses, matches, chats, datecitos, contactos de confianza, filtros y tokens de sesión. Tus matches dejan de ver tu perfil y tus conversaciones desaparecen para ambos.', 'Your profile, photos, verification selfie, interests, matches, chats, dates, trusted contacts, filters and session tokens. Your matches stop seeing your profile and your conversations disappear for both of you.'),
              },
              {
                q: t('¿Qué se conserva y por cuánto tiempo?', 'What is kept and for how long?'),
                a: t('Registros de compras (por obligación fiscal), reportes de seguridad que hayas hecho o recibido y registros técnicos de acceso, sin tu perfil ni tus mensajes, durante los plazos que marca la ley. Los respaldos de la base de datos se sobrescriben en un máximo de 14 días.', 'Purchase records (for tax obligations), safety reports you made or received and technical access logs, without your profile or messages, for the periods required by law. Database backups are overwritten within 14 days at most.'),
              },
              {
                q: t('¿Y mi membresía o Super likes?', 'What about my membership or Super Likes?'),
                a: t('Cancela primero la membresía en Google Play o App Store; borrar la cuenta no cancela suscripciones de la tienda. Los Super likes comprados se pierden al eliminar la cuenta.', 'Cancel your membership in Google Play or the App Store first; deleting the account doesn’t cancel store subscriptions. Purchased Super Likes are lost when you delete the account.'),
              },
              {
                q: t('¿Puedo pausar en lugar de borrar?', 'Can I pause instead of deleting?'),
                a: t('Sí. En Perfil › Ajustes › Privacidad puedes ocultarte de Descubrir: conservas matches y chats, y nadie nuevo te ve hasta que vuelvas a activarlo.', 'Yes. In Profile › Settings › Privacy you can hide yourself from Discover: you keep your matches and chats, and no one new sees you until you turn it back on.'),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
