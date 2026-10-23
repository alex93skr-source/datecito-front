import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApp } from '../components/AppState';
import { DocPage } from '../components/Doc';
import { FeatureCard, PageHero } from '../components/ui';
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
      <PageHero eyebrow="Legal" title={t('Documentos legales', 'Legal documents')} lead={t('Todo lo que rige tu relación con Datecito, en un solo lugar.', 'Everything that governs your relationship with Datecito, in one place.')} crumbs={[{ label: 'Legal' }]} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container grid g3">
          {docs.map((d) => (
            <FeatureCard key={d.slug} icon="doc" title={d.title} to={`/legal/${d.slug}`} green>
              {d.summary}
            </FeatureCard>
          ))}
          <FeatureCard icon="lock" title={t('Tus opciones de privacidad', 'Your privacy choices')} to="/legal/opciones-de-privacidad" green>
            {t('Decide cómo usamos tus datos para fines secundarios.', 'Decide how we use your data for secondary purposes.')}
          </FeatureCard>
          <FeatureCard icon="user" title={t('Derechos ARCO', 'ARCO rights')} to="/legal/arco" green>
            {t('Accede, rectifica, cancela u oponte al uso de tus datos.', 'Access, rectify, cancel or object to the use of your data.')}
          </FeatureCard>
          <FeatureCard icon="users" title={t('Normas de la comunidad', 'Community guidelines')} to="/seguridad/normas-de-la-comunidad" green>
            {t('Las reglas de convivencia de Datecito.', 'Datecito’s rules of conduct.')}
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
  const { setCookieSettings, toast } = useApp();
  const t = useT();
  const [p, setP] = useState({ marketing: true, analytics: true, ads: true });
  const rows: { key: keyof typeof p; title: string; d: string }[] = [
    { key: 'marketing', title: t('Novedades y promociones', 'News and promotions'), d: t('Correos y notificaciones sobre funciones, eventos y ofertas.', 'Emails and notifications about features, events and offers.') },
    { key: 'analytics', title: t('Análisis para mejorar el servicio', 'Analytics to improve the service'), d: t('Uso agregado de la app para desarrollar nuevas funciones.', 'Aggregated app usage to build new features.') },
    { key: 'ads', title: t('Publicidad de Datecito en otras plataformas', 'Datecito ads on other platforms'), d: t('Usar identificadores para medir y personalizar nuestros anuncios.', 'Use identifiers to measure and personalize our ads.') },
  ];
  return (
    <>
      <PageHero
        eyebrow={t('Privacidad', 'Privacy')}
        title={t('Tus opciones de privacidad', 'Your privacy choices')}
        lead={t('Tú decides cómo usamos tus datos para finalidades secundarias. Negarte no afecta tu acceso al servicio.', 'You decide how we use your data for secondary purposes. Opting out doesn’t affect your access to the service.')}
        crumbs={[legal, { label: t('Tus opciones de privacidad', 'Your privacy choices') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          <div className="card">
            {rows.map((r) => (
              <div className="toggle-row" key={r.key}>
                <div>
                  <strong style={{ color: 'var(--verde)' }}>{r.title}</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    {r.d}
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" aria-label={r.title} checked={p[r.key]} onChange={(e) => setP({ ...p, [r.key]: e.target.checked })} />
                  <span />
                </label>
              </div>
            ))}
            <div className="btn-row" style={{ marginTop: 18 }}>
              <button className="btn btn-primary" onClick={() => toast(t('Preferencias guardadas. Para aplicarlas a tu cuenta, confírmalas en la app.', 'Preferences saved. To apply them to your account, confirm them in the app.'))}>
                {t('Guardar', 'Save')}
              </button>
              <button className="btn btn-ghost" onClick={() => setCookieSettings(true)}>
                {t('Configuración de cookies', 'Cookie settings')}
              </button>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 24 }}>
            {t('Para acceder, corregir o eliminar tus datos, usa el', 'To access, correct or delete your data, use the')}{' '}
            <Link className="link" to="/legal/arco">
              {t('formulario de derechos ARCO', 'ARCO rights form')}
            </Link>
            . <strong>{t('No vendemos tus datos personales.', 'We do not sell your personal data.')}</strong>
          </p>
        </div>
      </section>
    </>
  );
}

export function Arco() {
  const t = useT();
  const [folio, setFolio] = useState<string | null>(null);
  return (
    <>
      <PageHero
        eyebrow={t('Privacidad', 'Privacy')}
        title={t('Solicitud de derechos ARCO', 'ARCO rights request')}
        lead={t('Ejerce tus derechos de Acceso, Rectificación, Cancelación y Oposición, o revoca tu consentimiento.', 'Exercise your rights of Access, Rectification, Cancellation and Objection, or withdraw your consent.')}
        crumbs={[legal, { label: t('Derechos ARCO', 'ARCO rights') }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container narrow">
          {folio ? (
            <div className="card center">
              <h3>{t('Solicitud recibida', 'Request received')}</h3>
              <p className="muted">
                {t('Te responderemos en un plazo máximo de 20 días hábiles al correo que indicaste. Guarda este folio:', 'We’ll reply within 20 business days to the email you provided. Keep this reference number:')} <strong>{folio}</strong>
              </p>
            </div>
          ) : (
            <form
              className="card form"
              onSubmit={(e) => {
                e.preventDefault();
                setFolio(`ARCO-${Date.now().toString().slice(-6)}`);
              }}
            >
              <div className="notice">
                {t(`Esta versión del formulario no envía datos. Mientras tanto, envía tu solicitud a ${company.emails.privacy}.`, `This version of the form doesn’t send data. In the meantime, send your request to ${company.emails.privacy}.`)}
              </div>
              <div className="form-row">
                <label className="field">
                  {t('Nombre completo', 'Full name')}
                  <input className="input" required />
                </label>
                <label className="field">
                  {t('Correo o celular de tu cuenta', 'Your account email or phone')}
                  <input className="input" required />
                </label>
              </div>
              <label className="field">
                {t('Derecho que deseas ejercer', 'Right you want to exercise')}
                <select className="input" required defaultValue="">
                  <option value="" disabled>
                    {t('Selecciona', 'Select')}
                  </option>
                  {t(
                    ['Acceso', 'Rectificación', 'Cancelación', 'Oposición', 'Revocación del consentimiento', 'Limitación de uso o divulgación'],
                    ['Access', 'Rectification', 'Cancellation', 'Objection', 'Withdrawal of consent', 'Limit use or disclosure'],
                  ).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                {t('Describe tu solicitud', 'Describe your request')}
                <textarea className="input" required placeholder={t('Datos a los que se refiere y lo que solicitas', 'The data it concerns and what you are requesting')} />
              </label>
              <label className="field">
                {t('Identificación oficial (INE, pasaporte)', 'Official ID (INE, passport)')}
                <input className="input" type="file" accept="image/*,application/pdf" />
              </label>
              <label className="check">
                <input type="checkbox" required />
                <span>{t('Declaro bajo protesta de decir verdad que soy titular de los datos o su representante legal.', 'I declare under penalty of perjury that I am the data owner or their legal representative.')}</span>
              </label>
              <button className="btn btn-primary">{t('Enviar solicitud', 'Submit request')}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
