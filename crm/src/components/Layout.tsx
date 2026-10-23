import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { dashboard } from '../api';
import { useApi } from '../lib/hooks';
import { useAuth } from '../store/Auth';

type Item = { to: string; label: string; icon: string; badge?: number; admin?: boolean };

export function Layout() {
  const { me, logout, can } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const live = useApi(() => dashboard.live(), [], { refreshMs: 30000 });

  useEffect(() => setOpen(false), [pathname]);

  const groups: { title: string; items: Item[] }[] = [
    {
      title: 'Medir',
      items: [
        { to: '/', label: 'Resumen', icon: '◎' },
        { to: '/analitica', label: 'Analítica', icon: '◔' },
        { to: '/comportamiento', label: 'Comportamiento', icon: '⌁' },
        { to: '/monetizacion', label: 'Monetización', icon: '◈' },
      ],
    },
    {
      title: 'Personas',
      items: [
        { to: '/usuarios', label: 'Usuarios', icon: '☺' },
        { to: '/conexiones', label: 'Conexiones', icon: '∞' },
        { to: '/datecitos', label: 'Datecitos', icon: '♡' },
        { to: '/aqui-y-ahora', label: 'Aquí y ahora', icon: '◉', badge: live.data?.here_live },
      ],
    },
    {
      title: 'Cuidar',
      items: [
        { to: '/moderacion/reportes', label: 'Reportes', icon: '⚑', badge: live.data?.reports_open },
        { to: '/moderacion/verificaciones', label: 'Verificaciones', icon: '✓', badge: live.data?.verifications_pending },
        { to: '/mensajes', label: 'Mensajes del sitio', icon: '✉', badge: live.data?.web_messages_new },
        { to: '/seguridad', label: 'Datecito Seguro', icon: '⛨', badge: live.data ? live.data.safe_sessions.help + live.data.safe_sessions.overdue : undefined },
      ],
    },
    {
      title: 'Equipo',
      items: [
        { to: '/auditoria', label: 'Bitácora', icon: '≡' },
        { to: '/equipo', label: 'Equipo', icon: '⚇' },
        { to: '/ajustes', label: 'Ajustes', icon: '⚙' },
      ],
    },
  ];

  return (
    <div className="shell">
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="logo">
          Datecito <small>CRM</small>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <div className="group">{g.title}</div>
            {g.items
              .filter((i) => !i.admin || can('administer'))
              .map((i) => (
                <NavLink key={i.to} to={i.to} end={i.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <span aria-hidden style={{ width: 18, textAlign: 'center', opacity: 0.8 }}>
                    {i.icon}
                  </span>
                  {i.label}
                  {i.badge ? <span className={`badge ${i.to.includes('seguridad') ? 'bad' : 'coral'}`}>{i.badge}</span> : null}
                </NavLink>
              ))}
          </div>
        ))}
        <div className="me">
          <strong>{me?.name ?? me?.email}</strong>
          <span className="small">{me?.role === 'admin' ? 'Administración' : 'Moderación'}</span>
          <br />
          <button onClick={() => void logout()}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="main">
        <div className="row spread" style={{ marginBottom: 6 }}>
          <button className="btn sm menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Menú">
            ☰
          </button>
          <span className="small muted" title="Personas con actividad en los últimos 15 minutos">
            <span className="live-dot" />
            {live.data ? `${live.data.online_15m} en línea · ${live.data.events_per_minute} eventos/min` : 'Conectando…'}
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
