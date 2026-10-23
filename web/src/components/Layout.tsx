import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Link, NavLink, useLang, useT } from '../i18n';
import { langNames, langs, saveLang, switchLang } from '../lang';
import { company, getFooter, getNav, getProducts, socials } from '../site';
import { useApp } from './AppState';
import { Icon } from './Icon';
import { Logo, StoreButtons } from './ui';

export function Layout() {
  const { pathname, hash } = useLocation();
  // El menú móvil queda ligado a la ruta donde se abrió: al navegar se cierra solo.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  const setMenu = (v: boolean) => setMenuPath(v ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const t = useT();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
  }, [menu]);

  return (
    <>
      <a className="skip" href="#main">
        {t('Saltar al contenido', 'Skip to content')}
      </a>
      <Header scrolled={scrolled} menu={menu} setMenu={setMenu} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <CookieSettings />
      <LanguageModal />
    </>
  );
}

function Header({ scrolled, menu, setMenu }: { scrolled: boolean; menu: boolean; setMenu: (v: boolean) => void }) {
  const { setLangOpen } = useApp();
  const lang = useLang();
  const t = useT();
  const nav = getNav(lang);
  const { pathname } = useLocation();
  const [openAt, setOpenAt] = useState<{ label: string; path: string } | null>(null);
  const open = openAt?.path === pathname ? openAt.label : null;
  const setOpen = (label: string | null) => setOpenAt(label ? { label, path: pathname } : null);
  const here = pathname.replace(/^\/(es|en)/, '');

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" aria-label={t('Datecito, inicio', 'Datecito, home')}>
          <Logo size={28} />
        </Link>
        <nav className="nav" aria-label={t('Principal', 'Main')}>
          {nav.map((g) =>
            g.items ? (
              <div key={g.label} className={`nav-item${open === g.label ? ' open' : ''}`} onMouseLeave={() => setOpen(null)}>
                <button
                  className={`nav-link${g.items.some((i) => here.startsWith(i.to)) ? ' active' : ''}`}
                  aria-expanded={open === g.label}
                  onClick={() => setOpen(open === g.label ? null : g.label)}
                >
                  {g.label} <Icon name="chevron-down" size={16} />
                </button>
                <div className="dropdown">
                  {g.items.map((i) => (
                    <Link key={i.to} to={i.to}>
                      {i.icon ? (
                        <span className="dd-icon">
                          <Icon name={i.icon} size={18} />
                        </span>
                      ) : null}
                      <div>
                        <strong>{i.label}</strong>
                        <span>{i.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={g.label} to={g.to!} className="nav-link">
                {g.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="header-actions">
          <button className="lang-btn hide-m" onClick={() => setLangOpen(true)} aria-label={t('Cambiar idioma', 'Change language')}>
            <Icon name="globe" size={20} /> {lang.toUpperCase()}
          </button>
          <Link to="/descargar" className="btn btn-dark btn-sm hide-m">
            {t('Descargar la app', 'Get the app')}
          </Link>
          <button className="menu-btn" aria-label={menu ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            <Icon name={menu ? 'x' : 'menu'} size={28} />
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${menu ? ' open' : ''}`} aria-label={t('Menú móvil', 'Mobile menu')}>
        {nav.map((g) =>
          g.items ? (
            <details key={g.label}>
              <summary>
                {g.label} <Icon name="chevron-down" />
              </summary>
              <div>
                {g.items.map((i) => (
                  <Link key={i.to} to={i.to}>
                    {i.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link key={g.label} to={g.to!}>
              {g.label}
            </Link>
          ),
        )}
        <Link to="/contacto">{t('Contacto', 'Contact')}</Link>
        <Link to="/descargar" className="btn btn-primary btn-block">
          {t('Descargar la app', 'Get the app')}
        </Link>
        <button className="btn btn-block lang-btn" onClick={() => setLangOpen(true)}>
          <Icon name="globe" size={20} /> {langNames[lang]}
        </button>
      </nav>
    </header>
  );
}

function Footer() {
  const { setCookieSettings, setLangOpen } = useApp();
  const lang = useLang();
  const t = useT();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size={30} light />
            <p style={{ marginTop: 16, maxWidth: 300 }}>
              {t('Conoce personas reales cerca de ti y conviértelo en un plan. Hecho en México, con cariño y con seguridad.', 'Meet real people near you and turn it into a plan. Made in Mexico, with care and with safety.')}
            </p>
            <div className="socials">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={t(`Datecito en ${s.name}`, `Datecito on ${s.name}`)}>
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
            <StoreButtons />
          </div>
          {getFooter(lang).map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4>{t('Productos', 'Products')}</h4>
            <ul>
              {getProducts(lang).map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer-seo">
          {t(
            'Datecito es la app de citas mexicana donde todos los perfiles pasan por verificación con selfie. Conoce gente nueva cerca de ti, haz match, platica sin presión y sal a un datecito de verdad con Datecito Seguro y tus contactos de confianza. Empezamos en el área metropolitana de la Ciudad de México y crecemos a todo México.',
            'Datecito is the Mexican dating app where every profile goes through selfie verification. Meet new people near you, match, chat without pressure and go on a real date with Datecito Safe and your trusted contacts. We’re starting in the Mexico City metro area and growing across Mexico.',
          )}
        </p>
        <div className="footer-bottom">
          <span>
            © 2026 {company.brand}. {t('Todos los derechos reservados.', 'All rights reserved.')}
          </span>
          <nav aria-label="Legal">
            <Link to="/legal/privacidad">{t('Privacidad', 'Privacy')}</Link>
            <Link to="/legal/terminos">{t('Términos', 'Terms')}</Link>
            <Link to="/legal/cookies">Cookies</Link>
            <button onClick={() => setCookieSettings(true)}>{t('Configuración de cookies', 'Cookie settings')}</button>
            <Link to="/legal/opciones-de-privacidad">{t('Tus opciones de privacidad', 'Your privacy choices')}</Link>
            <button onClick={() => setLangOpen(true)}>
              <Icon name="globe" size={14} /> {langNames[lang]}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function Modal({ onClose, children, wide, label }: { onClose: () => void; children: ReactNode; wide?: boolean; label: string }) {
  const t = useT();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t('Cerrar', 'Close')}>
          <Icon name="x" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function CookieBanner() {
  const { cookies, saveCookies, setCookieSettings } = useApp();
  const t = useT();
  if (cookies) return null;
  return (
    <div className="cookie" role="region" aria-label={t('Aviso de cookies', 'Cookie notice')}>
      <p>
        {t(
          'Este sitio sólo usa almacenamiento necesario (idioma y tu decisión sobre cookies). Si algún día añadimos analítica o publicidad, sólo se activarán con tu permiso; puedes cambiar tu decisión cuando quieras en ',
          'This site only uses necessary storage (your language and your cookie choice). If we ever add analytics or advertising, they will only run with your permission; you can change your choice at any time in ',
        )}
        <strong>{t('Configuración de cookies', 'Cookie settings')}</strong>. {t('Más información en nuestra', 'Learn more in our')}{' '}
        <Link to="/legal/cookies" className="link">
          {t('Política de cookies', 'Cookie policy')}
        </Link>
        .
      </p>
      <div className="btn-row">
        <button className="btn btn-ghost btn-sm" onClick={() => setCookieSettings(true)}>
          {t('Configurar', 'Settings')}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => saveCookies({ analytics: false, marketing: false, personalization: false })}>
          {t('Rechazar', 'Reject')}
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => saveCookies({ analytics: true, marketing: true, personalization: true })}>
          {t('Aceptar todas', 'Accept all')}
        </button>
      </div>
    </div>
  );
}

function CookieSettings() {
  const { cookieSettings, setCookieSettings, cookies, saveCookies, toast } = useApp();
  const t = useT();
  if (!cookieSettings) return null;
  return (
    <CookieSettingsBody
      initial={cookies}
      onClose={() => setCookieSettings(false)}
      onSave={(p) => {
        saveCookies(p);
        setCookieSettings(false);
        toast(t('Guardamos tus preferencias de cookies.', 'Your cookie preferences have been saved.'));
      }}
    />
  );
}

function CookieSettingsBody({ initial, onClose, onSave }: { initial: ReturnType<typeof useApp>['cookies']; onClose: () => void; onSave: (p: { analytics: boolean; marketing: boolean; personalization: boolean }) => void }) {
  const t = useT();
  const [p, setP] = useState({ analytics: initial?.analytics ?? false, marketing: initial?.marketing ?? false, personalization: initial?.personalization ?? false });
  const rows: { key: keyof typeof p | 'necessary'; title: string; text: string }[] = [
    {
      key: 'necessary',
      title: t('Estrictamente necesarias', 'Strictly necessary'),
      text: t('Permiten recordar tus preferencias de privacidad e idioma y proteger el sitio contra fraude. Siempre activas.', 'They remember your privacy and language preferences and protect the site against fraud. Always on.'),
    },
    {
      key: 'analytics',
      title: t('Analítica y rendimiento', 'Analytics and performance'),
      text: t('Nos ayudan a entender cómo se usa el sitio para mejorarlo. Los datos se agregan y no te identifican directamente.', "They help us understand how the site is used so we can improve it. Data is aggregated and doesn't directly identify you."),
    },
    {
      key: 'personalization',
      title: t('Personalización', 'Personalization'),
      text: t('Recuerdan tu ciudad y otras elecciones para mostrarte contenido relevante.', 'They remember your city and other choices to show you relevant content.'),
    },
    {
      key: 'marketing',
      title: t('Publicidad', 'Advertising'),
      text: t('Permiten medir campañas y mostrarte anuncios de Datecito en otros sitios. Nunca vendemos tu información.', 'They let us measure campaigns and show you Datecito ads on other sites. We never sell your information.'),
    },
  ];
  return (
    <Modal onClose={onClose} wide label={t('Configuración de cookies', 'Cookie settings')}>
      <h2 style={{ fontSize: '1.6rem' }}>{t('Configuración de cookies', 'Cookie settings')}</h2>
      <p className="muted small">
        {t('Elige qué cookies permites. Puedes cambiarlo en cualquier momento desde el pie de página. Detalles en la', 'Choose which cookies you allow. You can change this at any time from the footer. Details in the')}{' '}
        <Link to="/legal/cookies" className="link" onClick={onClose}>
          {t('Política de cookies', 'Cookie policy')}
        </Link>
        .
      </p>
      {rows.map((r) => (
        <div className="toggle-row" key={r.key}>
          <div>
            <strong style={{ color: 'var(--verde)' }}>{r.title}</strong>
            <p className="small muted" style={{ margin: 0 }}>
              {r.text}
            </p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              aria-label={r.title}
              checked={r.key === 'necessary' ? true : p[r.key]}
              disabled={r.key === 'necessary'}
              onChange={(e) => r.key !== 'necessary' && setP({ ...p, [r.key]: e.target.checked })}
            />
            <span />
          </label>
        </div>
      ))}
      <div className="btn-row" style={{ marginTop: 18 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onSave({ analytics: false, marketing: false, personalization: false })}>
          {t('Rechazar opcionales', 'Reject optional')}
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(p)}>
          {t('Guardar preferencias', 'Save preferences')}
        </button>
      </div>
    </Modal>
  );
}

function LanguageModal() {
  const { langOpen, setLangOpen } = useApp();
  const lang = useLang();
  const t = useT();
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  if (!langOpen) return null;
  return (
    <Modal onClose={() => setLangOpen(false)} wide label={t('Idioma', 'Language')}>
      <h2 style={{ fontSize: '1.6rem' }}>{t('Elige tu idioma', 'Choose your language')}</h2>
      <ul className="list-links">
        {langs.map((l) => (
          <li key={l}>
            <a
              href={switchLang(pathname, l) + search + hash}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                saveLang(l);
                setLangOpen(false);
                navigate(switchLang(pathname, l) + search + hash);
              }}
            >
              {langNames[l]} {l === lang ? <Icon name="check" /> : null}
            </a>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
