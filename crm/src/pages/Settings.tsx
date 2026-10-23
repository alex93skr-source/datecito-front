import type { ReactNode } from 'react';

import { team } from '../api';
import { Badge, Card, ErrorBox, Loading, PageHeader } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const FLAGS: { key: 'launch_free' | 'fake_purchases' | 'auto_verify'; title: string; on: string; off: string }[] = [
  { key: 'launch_free', title: 'Lanzamiento gratuito', on: 'La app no exige membresía: todas las funciones premium están abiertas.', off: 'La app exige membresía para las funciones premium.' },
  { key: 'fake_purchases', title: 'Compras simuladas', on: 'Las compras no pasan por las tiendas; sirven para probar sin cobrar. No usar en producción.', off: 'Las compras se validan con Google Play y App Store.' },
  { key: 'auto_verify', title: 'Verificación automática', on: 'Las solicitudes de verificación se aprueban solas, sin revisión humana.', off: 'Cada verificación la revisa una persona del equipo.' },
];

const LIMIT_NAMES: Record<string, string> = {
  swipes_per_day: 'Swipes por día',
  free_super_likes_per_day: 'Super likes gratis por día',
  max_photos: 'Fotos por perfil',
  min_photos: 'Fotos mínimas',
  min_age: 'Edad mínima',
  max_age: 'Edad máxima',
  age_range: 'Rango de edad',
  max_distance_km: 'Distancia máxima (km)',
  here_session_minutes: 'Duración de Aquí y ahora (min)',
  safe_session_grace_minutes: 'Margen de check-in (min)',
  max_trusted_contacts: 'Contactos de confianza',
  message_max_length: 'Largo máximo de mensaje',
  bio_max_length: 'Largo máximo de bio',
};

const PRODUCT_NAMES: Record<string, string> = { monthly: 'Membresía mensual', yearly: 'Membresía anual', super_like_pack: 'Paquete de Super likes' };

const humanize = (key: string) => LIMIT_NAMES[key] ?? key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

function YesNo({ value }: { value: boolean }) {
  return value ? <Badge tone="ok">Sí</Badge> : <Badge>No</Badge>;
}

function Chips({ items, labeled = false }: { items: string[]; labeled?: boolean }) {
  if (items.length === 0) return <span className="muted small">—</span>;
  return (
    <div className="chips">
      {items.map((i) => (
        <span key={i} className="tag">
          {labeled ? label(i) : i}
        </span>
      ))}
    </div>
  );
}

type Row = { k: string; v: ReactNode };

function Kv({ rows }: { rows: Row[] }) {
  return (
    <dl className="kv">
      {rows.map(({ k, v }) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Settings() {
  const { me } = useAuth();
  const settings = useApi(() => team.settings(), []);
  const s = settings.data;

  const pricingRows = s ? Object.entries(s.pricing).filter((entry): entry is [string, { product_id: string; price: number; quantity?: number }] => typeof entry[1] === 'object' && entry[1] !== null) : [];
  const queueOld = s ? s.health.queue_oldest_pending_seconds : 0;

  return (
    <>
      <PageHeader title="Ajustes" sub="Cómo está configurado Datecito ahora mismo. Esta pantalla es de sólo lectura." />

      <div className="error-box" style={{ marginBottom: 16, background: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>
        La configuración se cambia por variables de entorno del backend (<span className="code">backend/.env</span>) y requiere reiniciar el servicio. Desde aquí no se puede modificar nada.
      </div>

      {settings.error ? <ErrorBox message={settings.error} onRetry={settings.reload} /> : null}

      <div className="grid cols-3">
        <Card title="Mi cuenta" hint="Con lo que estás entrando al CRM">
          {me ? (
            <Kv
              rows={[
                { k: 'Nombre', v: me.name ?? <span className="muted">Sin nombre</span> },
                { k: 'Correo', v: me.email },
                { k: 'Rol', v: <Badge value={me.role} /> },
                {
                  k: 'Permisos',
                  v: (
                    <span className="row" style={{ gap: 6 }}>
                      {me.permissions.moderate ? <Badge tone="info">Moderar</Badge> : null}
                      {me.permissions.administer ? <Badge tone="dark">Administrar</Badge> : null}
                    </span>
                  ),
                },
                { k: 'ID', v: <span className="mono">{me.id}</span> },
              ]}
            />
          ) : (
            <Loading rows={3} />
          )}
        </Card>

        <Card title="App">
          {s ? (
            <Kv
              rows={[
                { k: 'Nombre', v: s.app.name },
                { k: 'Entorno', v: <Badge tone={s.app.env === 'production' ? 'ok' : 'warn'}>{s.app.env}</Badge> },
                {
                  k: 'URL',
                  v: (
                    <a href={s.app.url} target="_blank" rel="noreferrer" className="mono">
                      {s.app.url}
                    </a>
                  ),
                },
                { k: 'Zona horaria', v: s.app.timezone },
              ]}
            />
          ) : (
            <Loading rows={4} />
          )}
        </Card>

        <Card title="Salud" hint="Cola de trabajos y flujo de eventos">
          {s ? (
            <Kv
              rows={[
                {
                  k: 'Cola pendiente',
                  v: (
                    <span>
                      {fmt.n(s.health.queue_pending)} {s.health.queue_pending > 100 ? <Badge tone="warn">alta</Badge> : null}
                    </span>
                  ),
                },
                { k: 'Fallidos', v: s.health.queue_failed > 0 ? <Badge tone="bad">{fmt.n(s.health.queue_failed)}</Badge> : <span>0</span> },
                {
                  k: 'Más viejo en cola',
                  v: (
                    <span>
                      {fmt.n(queueOld)} s {queueOld > 300 ? <Badge tone="warn">atorada</Badge> : null}
                    </span>
                  ),
                },
                { k: 'Último evento', v: <span title={fmt.dateTime(s.health.last_event_at)}>{fmt.ago(s.health.last_event_at)}</span> },
                { k: 'Eventos totales', v: fmt.n(s.health.events_total) },
              ]}
            />
          ) : (
            <Loading rows={5} />
          )}
        </Card>

        <Card title="Banderas" hint="Comportamientos que se encienden o apagan por entorno">
          {s ? (
            <div className="stack" style={{ gap: 12 }}>
              {FLAGS.map((f) => (
                <div key={f.key}>
                  <div className="row spread">
                    <b>{f.title}</b>
                    <YesNo value={s.flags[f.key]} />
                  </div>
                  <div className="small muted">{s.flags[f.key] ? f.on : f.off}</div>
                </div>
              ))}
            </div>
          ) : (
            <Loading rows={3} />
          )}
        </Card>

        <Card title="Precios" hint={s ? `En ${s.pricing.currency}` : undefined}>
          {s ? (
            pricingRows.length ? (
              <Kv
                rows={pricingRows.map(([key, p]) => ({
                  k: PRODUCT_NAMES[key] ?? label(key),
                  v: (
                    <span>
                      <b>{fmt.money(p.price)}</b>
                      {p.quantity ? <span className="muted"> · {p.quantity} Super likes</span> : null}
                      <span className="code" style={{ marginLeft: 8 }}>{p.product_id}</span>
                    </span>
                  ),
                }))}
              />
            ) : (
              <span className="muted small">Sin precios configurados</span>
            )
          ) : (
            <Loading rows={3} />
          )}
        </Card>

        <Card title="Límites" hint="Reglas del producto">
          {s ? <Kv rows={Object.entries(s.limits).map(([k, v]) => ({ k: humanize(k), v: Array.isArray(v) ? v.map((n) => fmt.n(n)).join(', ') : fmt.n(v) }))} /> : <Loading rows={6} />}
        </Card>

        <Card title="Catálogo" hint="Opciones que ofrece la app">
          {s ? (
            <div className="stack" style={{ gap: 12 }}>
              <div>
                <div className="small muted" style={{ marginBottom: 4 }}>Razones de reporte</div>
                <Chips items={s.catalog.report_reasons} />
              </div>
              <div>
                <div className="small muted" style={{ marginBottom: 4 }}>Tipos de plan</div>
                <Chips items={s.catalog.plan_kinds} labeled />
              </div>
              <div>
                <div className="small muted" style={{ marginBottom: 4 }}>Géneros</div>
                <Chips items={s.catalog.genders} />
              </div>
              <div>
                <div className="small muted" style={{ marginBottom: 4 }}>Intenciones</div>
                <Chips items={s.catalog.intents} />
              </div>
            </div>
          ) : (
            <Loading rows={4} />
          )}
        </Card>

        <Card title="Roles" hint="Cuántas personas hay con cada rol">
          {s ? <Kv rows={Object.entries(s.roles).map(([role, n]) => ({ k: label(role), v: fmt.n(n) }))} /> : <Loading rows={3} />}
        </Card>
      </div>
    </>
  );
}
