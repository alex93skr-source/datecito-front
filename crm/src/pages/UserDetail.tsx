import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ApiError,
  users,
  type ActivityEvent,
  type AdminAction,
  type Connection,
  type Photo,
  type Plan,
  type Purchase,
  type Report,
  type Subscription,
  type Swipe,
  type UserDetail as UserRecord,
  type UserNote,
  type UserRole,
  type UserStatus,
} from '../api';
import { ColumnChart } from '../components/charts';
import { Badge, Card, ConfirmModal, DataTable, Empty, ErrorBox, Field, Loading, Modal, PageHeader, Pagination, Person, Select, Stat, Tabs, initials, type Column } from '../components/ui';
import { actionLabels, fmt, label } from '../lib/format';
import { daysAgo, useApi, useDebounced, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

type Tab = 'perfil' | 'actividad' | 'conexiones' | 'swipes' | 'reportes' | 'pagos' | 'notas' | 'bitacora';

const TABS: { value: Tab; label: string }[] = [
  { value: 'perfil', label: 'Perfil' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'conexiones', label: 'Conexiones' },
  { value: 'swipes', label: 'Swipes' },
  { value: 'reportes', label: 'Reportes' },
  { value: 'pagos', label: 'Pagos' },
  { value: 'notas', label: 'Notas' },
  { value: 'bitacora', label: 'Bitácora' },
];

const tabDefaults = { tab: 'perfil' };
const STATUSES: UserStatus[] = ['active', 'paused', 'suspended', 'banned'];
const ROLES: UserRole[] = ['user', 'moderator', 'admin'];

type Confirm = { title: string; description?: ReactNode; confirmLabel?: string; danger?: boolean; noteRequired?: boolean; run: (note: string) => Promise<void> };
type Act = <R>(fn: () => Promise<R>, ok: string | ((r: R) => string), reload?: boolean) => Promise<void>;

const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Algo salió mal.');
const short = (v: unknown, n = 120) => {
  const s = JSON.stringify(v) ?? '';
  return s.length > n ? `${s.slice(0, n)}…` : s;
};
const humanize = (k: string) => k.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const orDash = (v: string | null | undefined) => (v && v.trim() ? v : <span className="muted">—</span>);

export default function UserDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { me, can, toast } = useAuth();
  const { filters, set } = useFilters(tabDefaults);
  const tab = filters.tab as Tab;
  const isAdmin = can('administer');

  const detail = useApi(
    () =>
      users.show(id).catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) return 'missing' as const;
        throw e;
      }),
    [id],
  );

  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const closeConfirm = useCallback(() => setConfirm(null), []);
  const [editing, setEditing] = useState(false);
  const closeEdit = useCallback(() => setEditing(false), []);
  const [tagInput, setTagInput] = useState('');

  const act: Act = async (fn, ok, reload = true) => {
    try {
      const r = await fn();
      toast(typeof ok === 'function' ? ok(r) : ok);
      if (reload) detail.reload();
    } catch (e) {
      toast(errMsg(e), 'error');
      throw e;
    }
  };

  if (detail.data === 'missing') {
    return (
      <>
        <PageHeader title="Ficha de persona" />
        <Card>
          <Empty title="Esta cuenta no existe o ya fue eliminada">
            <div style={{ marginTop: 10 }}>
              <Link to="/usuarios" className="btn">
                Volver a usuarios
              </Link>
            </div>
          </Empty>
        </Card>
      </>
    );
  }

  if (!detail.data) {
    return (
      <>
        <PageHeader title="Ficha de persona" sub="Cargando…" />
        {detail.error ? <ErrorBox message={detail.error} onRetry={detail.reload} /> : <Card><Loading rows={6} /></Card>}
      </>
    );
  }

  const u = detail.data;
  const s = u.stats;
  const membership = u.membership as UserRecord['membership'] | null;
  const hasMembership = membership?.status === 'active' && !!membership.plan;
  const photo = u.photos[0]?.urls.sm ?? null;
  const likePct = s.swipes_given.total > 0 ? ((s.swipes_given.like + s.swipes_given.super) / s.swipes_given.total) * 100 : 0;

  const saveTags = (tags: string[]) => act(() => users.setTags(u.id, tags), 'Etiquetas guardadas.').catch(() => undefined);
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || u.tags.includes(t)) {
      setTagInput('');
      return;
    }
    setTagInput('');
    void saveTags([...u.tags, t]);
  };

  return (
    <>
      <PageHeader
        title={
          <span className="row">
            <Link to="/usuarios" className="btn sm ghost" aria-label="Volver">
              ←
            </Link>
            Ficha de persona
          </span>
        }
        sub={<span className="mono">{u.id}</span>}
      />

      {detail.error ? <ErrorBox message={detail.error} onRetry={detail.reload} /> : null}

      <Card className="profile-card">
        <div className="profile-head">
          <span className="avatar lg">{photo ? <img src={photo} alt="" /> : initials(u.name, u.email)}</span>
          <div className="meta">
            <h2>{u.name ?? 'Sin nombre'}</h2>
            <div className="muted small">
              {u.email}
              {u.age ? ` · ${u.age} años` : ''}
              {u.gender ? ` · ${u.gender}` : ''}
              {u.zone ? ` · ${u.zone}` : ''}
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Badge value={u.status} />
              {u.role !== 'user' ? <Badge value={u.role} /> : null}
              {u.verified ? <Badge tone="ok">Verificado</Badge> : <Badge value={u.verification_status} />}
              {!u.email_verified ? <Badge tone="warn">Correo sin verificar</Badge> : null}
              {!u.show_in_discover ? <Badge>Oculto en Descubrir</Badge> : null}
              {hasMembership && membership ? (
                <Badge value={membership.plan}>
                  {label(membership.plan)} · vence {fmt.date(membership.expires_at)}
                </Badge>
              ) : membership?.status === 'launch' ? (
                <Badge tone="info">Lanzamiento gratis</Badge>
              ) : (
                <Badge>Sin membresía</Badge>
              )}
              {u.platform ? (
                <Badge>
                  {label(u.platform)}
                  {u.app_version ? ` ${u.app_version}` : ''}
                </Badge>
              ) : null}
            </div>
            <div className="chips">
              {u.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                  <button type="button" aria-label={`Quitar etiqueta ${t}`} onClick={() => void saveTags(u.tags.filter((x) => x !== t))}>
                    ✕
                  </button>
                </span>
              ))}
              <input
                className="input tag-input"
                placeholder="+ etiqueta"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
              />
            </div>
            <div className="small muted">
              Se registró {fmt.ago(u.created_at)} ({fmt.date(u.created_at)}) · Última actividad {fmt.ago(u.last_seen_at)}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid cols-4" style={{ margin: '16px 0' }}>
        <Stat compact label="Swipes dados" value={fmt.n(s.swipes_given.total)} foot={`${fmt.pct(likePct, 0)} likes · ${fmt.n(s.swipes_given.super)} super`} />
        <Stat compact label="Likes recibidos" value={fmt.n(s.swipes_received.like + s.swipes_received.super)} foot={`${fmt.n(s.swipes_received.total)} swipes recibidos`} />
        <Stat compact label="Matches" value={fmt.n(s.connections.total)} foot={`${fmt.n(s.connections.active)} activos · ${fmt.n(s.connections.with_messages)} con conversación`} />
        <Stat compact label="Mensajes enviados" value={fmt.n(s.messages_sent)} />
        <Stat compact label="Datecitos" value={`${fmt.n(s.datecitos.confirmed)} / ${fmt.n(s.datecitos.total)}`} foot="confirmados / propuestos" />
        <Stat compact label="Reportes recibidos" value={s.reports.received > 0 ? <span className="text-danger">{fmt.n(s.reports.received)}</span> : '0'} foot={`${fmt.n(s.reports.received_open)} abiertos · ${fmt.n(s.reports.made)} hechos`} />
        <Stat compact label="Días activos" value={fmt.n(s.activity.active_days)} foot={`${fmt.n(s.activity.events_30d)} eventos en 30 d`} />
        <Stat compact label="Sesiones abiertas" value={fmt.n(s.activity.sessions_open)} foot={`${fmt.n(s.account_age_days)} días de antigüedad`} />
      </div>

      <div className="grid sidebar-right">
        <Card>
          <Tabs value={tab} onChange={(t) => set({ tab: t })} tabs={TABS} />
          {tab === 'perfil' ? (
            <ProfileTab
              u={u}
              onEdit={() => setEditing(true)}
              onRemovePhoto={(p) =>
                setConfirm({
                  title: 'Quitar esta foto',
                  description: 'La foto se elimina del perfil y la persona no podrá recuperarla.',
                  confirmLabel: 'Quitar foto',
                  danger: true,
                  run: (note) => act(() => users.removePhoto(u.id, p.id, note || undefined), 'Foto eliminada.'),
                })
              }
            />
          ) : null}
          {tab === 'actividad' ? <ActivityTab id={u.id} /> : null}
          {tab === 'conexiones' ? <ConnectionsTab id={u.id} /> : null}
          {tab === 'swipes' ? <SwipesTab id={u.id} /> : null}
          {tab === 'reportes' ? <ReportsTab id={u.id} /> : null}
          {tab === 'pagos' ? <BillingTab id={u.id} /> : null}
          {tab === 'notas' ? (
            <NotesTab
              userId={u.id}
              notes={u.notes}
              canManage={(n) => isAdmin || (!!me && n.author?.id === me.id)}
              act={act}
              onDelete={(n) =>
                setConfirm({
                  title: 'Borrar nota',
                  description: 'La nota desaparece de la ficha. Queda registro en la bitácora.',
                  confirmLabel: 'Borrar',
                  danger: true,
                  run: () => act(() => users.deleteNote(n.id), 'Nota borrada.'),
                })
              }
            />
          ) : null}
          {tab === 'bitacora' ? <AuditTab id={u.id} /> : null}
        </Card>

        <Card title="Acciones" hint="Todo queda en la bitácora">
          <ActionsPanel u={u} hasMembership={hasMembership} isAdmin={isAdmin} ask={setConfirm} act={act} onDeleted={() => navigate('/usuarios')} />
        </Card>
      </div>

      {editing ? (
        <EditProfileModal
          u={u}
          onClose={closeEdit}
          onSaved={() => {
            toast('Perfil actualizado.');
            detail.reload();
          }}
        />
      ) : null}

      {confirm ? (
        <ConfirmModal title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel} danger={confirm.danger} noteRequired={confirm.noteRequired} onConfirm={confirm.run} onClose={closeConfirm} />
      ) : null}
    </>
  );
}

/* ---------- Perfil ---------- */

function ProfileTab({ u, onEdit, onRemovePhoto }: { u: UserRecord; onEdit: () => void; onRemovePhoto: (p: Photo) => void }) {
  const p = u.profile;
  const membership = u.membership as UserRecord['membership'] | null;
  const basics = Object.entries(p.basics ?? {});
  const settings = Object.entries(u.settings ?? {});
  return (
    <div className="stack">
      <div className="row spread">
        <h3>Fotos ({u.photos.length})</h3>
        <button className="btn sm" onClick={onEdit}>
          Editar perfil
        </button>
      </div>
      {u.photos.length ? (
        <div className="photo-grid">
          {u.photos.map((ph) => (
            <div key={ph.id} className="ph">
              <a href={ph.urls.lg} target="_blank" rel="noreferrer">
                <img src={ph.urls.md} alt="" loading="lazy" />
              </a>
              <button className="btn sm danger" onClick={() => onRemovePhoto(ph)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Empty title="Sin fotos" />
      )}

      <h3>Sobre la persona</h3>
      <dl className="kv">
        <dt>Bio</dt>
        <dd className="prewrap">{orDash(p.bio)}</dd>
        <dt>Trabajo</dt>
        <dd>{orDash(p.job)}</dd>
        <dt>Intención</dt>
        <dd>{orDash(p.intent)}</dd>
        <dt>Tipo de relación</dt>
        <dd>{orDash(p.relationship_type)}</dd>
        <dt>Le interesa</dt>
        <dd>{p.interested_in.length ? p.interested_in.join(', ') : <span className="muted">—</span>}</dd>
        <dt>Intereses</dt>
        <dd>
          {p.interests.length ? (
            <div className="chips">
              {p.interests.map((i) => (
                <span key={i} className="tag">
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <span className="muted">—</span>
          )}
        </dd>
        <dt>Música</dt>
        <dd>
          {p.music.genres.length || p.music.artists.length || p.music.anthem ? (
            <>
              {p.music.genres.length ? <div>Géneros: {p.music.genres.join(', ')}</div> : null}
              {p.music.artists.length ? <div>Artistas: {p.music.artists.join(', ')}</div> : null}
              {p.music.anthem ? <div>Himno: {p.music.anthem}</div> : null}
            </>
          ) : (
            <span className="muted">—</span>
          )}
        </dd>
        <dt>Básicos</dt>
        <dd>
          {basics.length ? (
            <ul className="kv-list">
              {basics.map(([k, v]) => (
                <li key={k}>
                  <span className="muted">{humanize(k)}:</span> {v}
                </li>
              ))}
            </ul>
          ) : (
            <span className="muted">—</span>
          )}
        </dd>
        <dt>Idiomas</dt>
        <dd>{p.languages.length ? p.languages.join(', ') : <span className="muted">—</span>}</dd>
        <dt>Prompts</dt>
        <dd>
          {p.prompts.length ? (
            <div className="stack" style={{ gap: 8 }}>
              {p.prompts.map((pr, i) => (
                <div key={`${pr.q}-${i}`}>
                  <b>{pr.q}</b>
                  <div className="prewrap">{pr.a}</div>
                </div>
              ))}
            </div>
          ) : (
            <span className="muted">—</span>
          )}
        </dd>
        <dt>Ubicación</dt>
        <dd>{p.has_location ? 'Compartida' : <span className="muted">Sin ubicación</span>}</dd>
        <dt>Cumpleaños</dt>
        <dd>{fmt.date(p.birthdate)}</dd>
      </dl>

      <h3>Preferencias</h3>
      {settings.length ? (
        <ul className="kv-list cols">
          {settings.map(([k, v]) => (
            <li key={k}>
              <Badge tone={v ? 'ok' : ''}>{v ? 'Sí' : 'No'}</Badge> {humanize(k)}
            </li>
          ))}
        </ul>
      ) : (
        <span className="muted small">Sin preferencias guardadas.</span>
      )}

      <h3>Datos de cuenta</h3>
      <dl className="kv">
        <dt>ID</dt>
        <dd className="mono">{u.id}</dd>
        <dt>Correo</dt>
        <dd>
          {u.email} {u.email_verified_at ? <span className="muted">· verificado el {fmt.date(u.email_verified_at)}</span> : <Badge tone="warn">Sin verificar</Badge>}
        </dd>
        <dt>Perfil verificado</dt>
        <dd>{u.verified_at ? `Sí, el ${fmt.date(u.verified_at)}` : label(u.verification_status)}</dd>
        <dt>Registro</dt>
        <dd>
          {fmt.dateTime(u.created_at)} {u.signup_platform ? <span className="muted">· desde {label(u.signup_platform)}</span> : null}
        </dd>
        <dt>Última edición</dt>
        <dd>{fmt.dateTime(u.updated_at)}</dd>
        <dt>Super likes</dt>
        <dd>
          {fmt.n(u.super_likes_balance)} <span className="muted">· {fmt.n(membership?.super_likes?.free_today ?? 0)} gratis hoy · {fmt.n(membership?.super_likes?.purchased ?? 0)} comprados</span>
        </dd>
        <dt>Visible en Descubrir</dt>
        <dd>{u.show_in_discover ? 'Sí' : 'No'}</dd>
      </dl>
    </div>
  );
}

function EditProfileModal({ u, onClose, onSaved }: { u: UserRecord; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: u.name ?? '',
    bio: u.profile.bio ?? '',
    job: u.profile.job ?? '',
    zone: u.zone ?? '',
    anthem: u.profile.music.anthem ?? '',
    show_in_discover: u.show_in_discover,
    note: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const patch = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await users.update(u.id, {
        name: form.name.trim() || null,
        bio: form.bio.trim() || null,
        job: form.job.trim() || null,
        zone: form.zone.trim() || null,
        anthem: form.anthem.trim() || null,
        show_in_discover: form.show_in_discover,
        note: form.note.trim() || undefined,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(errMsg(e));
      if (e instanceof ApiError) setFieldErrors({ name: e.field('name'), bio: e.field('bio'), job: e.field('job'), zone: e.field('zone'), anthem: e.field('anthem') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Editar perfil"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn primary" onClick={submit} disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </>
      }
    >
      <p className="muted small" style={{ marginBottom: 12 }}>
        Edición editorial: úsala para retirar textos que rompen las reglas. La persona verá el cambio de inmediato.
      </p>
      {error ? <ErrorBox message={error} /> : null}
      <div className="stack" style={{ gap: 10, marginTop: 10 }}>
        <Field label="Nombre" error={fieldErrors.name}>
          <input className="input" value={form.name} maxLength={40} onChange={(e) => patch('name', e.target.value)} />
        </Field>
        <Field label="Bio" error={fieldErrors.bio}>
          <textarea className="textarea" value={form.bio} maxLength={300} onChange={(e) => patch('bio', e.target.value)} />
        </Field>
        <div className="grid cols-2" style={{ gap: 10 }}>
          <Field label="Trabajo" error={fieldErrors.job}>
            <input className="input" value={form.job} maxLength={60} onChange={(e) => patch('job', e.target.value)} />
          </Field>
          <Field label="Zona" error={fieldErrors.zone}>
            <input className="input" value={form.zone} maxLength={60} onChange={(e) => patch('zone', e.target.value)} />
          </Field>
        </div>
        <Field label="Himno (canción)" error={fieldErrors.anthem}>
          <input className="input" value={form.anthem} maxLength={120} onChange={(e) => patch('anthem', e.target.value)} />
        </Field>
        <label className="checkbox">
          <input type="checkbox" checked={form.show_in_discover} onChange={(e) => patch('show_in_discover', e.target.checked)} /> Visible en Descubrir
        </label>
        <Field label="Nota interna (queda en la bitácora)">
          <textarea className="textarea" value={form.note} maxLength={500} onChange={(e) => patch('note', e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

/* ---------- Actividad ---------- */

function ActivityTab({ id }: { id: string }) {
  const [name, setName] = useState('');
  const debouncedName = useDebounced(name);
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const query = useMemo(() => ({ name: debouncedName, category, from, to, page }), [debouncedName, category, from, to, page]);
  const list = useApi(() => users.events(id, query), [id, JSON.stringify(query)]);
  const change = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const columns: Column<ActivityEvent>[] = [
    { key: 'when', title: 'Hora', render: (e) => <span className="nowrap small">{fmt.dateTime(e.occurred_at)}</span> },
    { key: 'name', title: 'Evento', render: (e) => <span className="code">{e.name}</span> },
    { key: 'category', title: 'Categoría', render: (e) => <Badge value={e.category} /> },
    { key: 'platform', title: 'App', render: (e) => (e.platform ? <span className="small">{label(e.platform)}{e.app_version ? <span className="muted"> {e.app_version}</span> : null}</span> : <span className="muted">—</span>) },
    { key: 'status', title: 'Status', render: (e) => (e.status === null ? <span className="muted">—</span> : e.status >= 400 ? <Badge tone="bad">{e.status}</Badge> : <span className="num">{e.status}</span>) },
    { key: 'duration', title: 'Duración', num: true, render: (e) => fmt.ms(e.duration_ms) },
    { key: 'props', title: 'Propiedades', render: (e) => <span className="props" title={JSON.stringify(e.properties, null, 2)}>{short(e.properties)}</span> },
  ];

  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="filters" style={{ marginBottom: 0 }}>
        <Field label="Evento">
          <input className="input" placeholder="swipe, message…" value={name} onChange={(e) => change(() => setName(e.target.value))} />
        </Field>
        <Field label="Categoría" className="narrow">
          <Select value={category} onChange={(v) => change(() => setCategory(v))} options={['api', 'client', 'system'].map((v) => ({ value: v, label: label(v) }))} placeholder="Todas" />
        </Field>
        <Field label="Desde" className="narrow">
          <input className="input" type="date" value={from} onChange={(e) => change(() => setFrom(e.target.value))} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={to} onChange={(e) => change(() => setTo(e.target.value))} />
        </Field>
      </div>
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      {list.loading && !list.data ? <Loading /> : <DataTable columns={columns} rows={list.data?.data ?? []} empty={<Empty title="Sin eventos con estos filtros" />} />}
      <Pagination meta={list.data?.meta} onPage={setPage} />
    </div>
  );
}

/* ---------- Conexiones ---------- */

function ConnectionsTab({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const list = useApi(() => users.connections(id, { page }), [id, page]);
  const other = (c: Connection) => c.users.find((x) => x?.id !== id) ?? c.users[1];
  const columns: Column<Connection>[] = [
    { key: 'person', title: 'Con quién', render: (c) => <Person user={other(c)} /> },
    { key: 'source', title: 'Origen', render: (c) => <Badge value={c.source} /> },
    { key: 'messages', title: 'Mensajes', num: true, render: (c) => fmt.n(c.messages_count) },
    { key: 'datecitos', title: 'Datecitos', num: true, render: (c) => fmt.n(c.datecitos_count) },
    { key: 'last', title: 'Último mensaje', render: (c) => <span className="small" title={fmt.dateTime(c.last_message_at)}>{fmt.ago(c.last_message_at)}</span> },
    { key: 'active', title: 'Estado', render: (c) => (c.active ? <Badge tone="ok">Activa</Badge> : <Badge>Terminada{c.ended_at ? ` · ${fmt.dateShort(c.ended_at)}` : ''}</Badge>) },
    { key: 'created', title: 'Creada', render: (c) => <span className="small">{fmt.date(c.created_at)}</span> },
    { key: 'link', title: '', render: (c) => <Link to={`/conexiones/${c.id}`} className="btn sm">Ver</Link> },
  ];
  return (
    <div className="stack" style={{ gap: 10 }}>
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      {list.loading && !list.data ? <Loading /> : <DataTable columns={columns} rows={list.data?.data ?? []} empty={<Empty title="Todavía no tiene matches" />} />}
      <Pagination meta={list.data?.meta} onPage={setPage} />
    </div>
  );
}

/* ---------- Swipes ---------- */

function SwipesTab({ id }: { id: string }) {
  const data = useApi(() => users.swipes(id), [id]);
  const points = useMemo(() => {
    const map = new Map((data.data?.given_by_day ?? []).map((p) => [String(p.date).slice(0, 10), Number(p.value)]));
    return Array.from({ length: 30 }, (_, i) => {
      const date = daysAgo(29 - i);
      return { date, value: map.get(date) ?? 0 };
    });
  }, [data.data]);

  const columns: Column<Swipe>[] = [
    { key: 'person', title: 'Persona', render: (sw) => <Person user={sw.person} /> },
    { key: 'type', title: 'Tipo', render: (sw) => <Badge value={sw.type} /> },
    { key: 'when', title: 'Fecha', render: (sw) => <span className="small nowrap">{fmt.dateTime(sw.created_at)}</span> },
  ];

  if (data.error) return <ErrorBox message={data.error} onRetry={data.reload} />;
  if (!data.data) return <Loading />;
  const total = points.reduce((a, p) => a + p.value, 0);
  return (
    <div className="stack">
      <div>
        <h3>Swipes dados por día</h3>
        <div className="muted small" style={{ marginBottom: 8 }}>
          {fmt.n(total)} en los últimos 30 días
        </div>
        <ColumnChart points={points} height={160} />
      </div>
      <div className="grid cols-2">
        <Card flush title="Dados (últimos 50)">
          <DataTable columns={columns} rows={data.data.given} empty={<Empty title="Sin swipes dados" />} />
        </Card>
        <Card flush title="Recibidos (últimos 50)">
          <DataTable columns={columns} rows={data.data.received} empty={<Empty title="Sin swipes recibidos" />} />
        </Card>
      </div>
    </div>
  );
}

/* ---------- Reportes ---------- */

function ReportsTab({ id }: { id: string }) {
  const data = useApi(() => users.reports(id), [id]);
  const columns = (kind: 'received' | 'made'): Column<Report>[] => [
    { key: 'when', title: 'Fecha', render: (r) => <span className="small nowrap">{fmt.dateTime(r.created_at)}</span> },
    { key: 'reason', title: 'Razón', render: (r) => <Badge tone="coral">{r.reason}</Badge> },
    { key: 'details', title: 'Detalles', render: (r) => <span className="small truncate-2" title={r.details ?? ''}>{orDash(r.details)}</span> },
    { key: 'status', title: 'Estado', render: (r) => <Badge value={r.status} /> },
    kind === 'received'
      ? { key: 'who', title: 'Reportante', render: (r) => <Person user={{ ...r.reporter, status: null }} /> }
      : { key: 'who', title: 'Reportado', render: (r) => <Person user={r.reported ? { id: r.reported.id, name: r.reported.name, email: r.reported.email, status: r.reported.status } : null} /> },
    { key: 'handled', title: 'Atendido por', render: (r) => (r.handled_by ? <span className="small">{r.handled_by.name ?? r.handled_by.email}</span> : <span className="muted">—</span>) },
  ];
  if (data.error) return <ErrorBox message={data.error} onRetry={data.reload} />;
  if (!data.data) return <Loading />;
  return (
    <div className="stack">
      <Card flush title={`Recibidos (${data.data.received.length})`} actions={<Link to={`/moderacion/reportes?reported_id=${id}&status=all`} className="btn sm">Ver en moderación</Link>}>
        <DataTable columns={columns('received')} rows={data.data.received} empty={<Empty title="Nadie ha reportado a esta persona" />} />
      </Card>
      <Card flush title={`Hechos (${data.data.made.length})`}>
        <DataTable columns={columns('made')} rows={data.data.made} empty={<Empty title="No ha hecho reportes" />} />
      </Card>
    </div>
  );
}

/* ---------- Pagos ---------- */

function BillingTab({ id }: { id: string }) {
  const data = useApi(() => users.billing(id), [id]);
  const subs: Column<Subscription>[] = [
    { key: 'plan', title: 'Plan', render: (x) => <Badge value={x.plan} /> },
    { key: 'store', title: 'Tienda', render: (x) => <span className="small">{label(x.store)}</span> },
    { key: 'status', title: 'Estado', render: (x) => <Badge value={x.status} /> },
    { key: 'current', title: 'Vigente', render: (x) => (x.current ? <Badge tone="ok">Vigente</Badge> : <span className="muted">—</span>) },
    { key: 'starts', title: 'Inicia', render: (x) => <span className="small">{fmt.date(x.starts_at)}</span> },
    { key: 'expires', title: 'Vence', render: (x) => <span className="small">{fmt.date(x.expires_at)}</span> },
    { key: 'granted', title: '', render: (x) => (x.granted ? <Badge tone="info">Cortesía</Badge> : <span className="mono muted">{x.store_reference}</span>) },
  ];
  const purchases: Column<Purchase>[] = [
    { key: 'product', title: 'Producto', render: (x) => <span className="code">{x.product_id}</span> },
    { key: 'store', title: 'Tienda', render: (x) => <span className="small">{label(x.store)}</span> },
    { key: 'qty', title: 'Cantidad', num: true, render: (x) => fmt.n(x.quantity) },
    { key: 'ref', title: 'Referencia', render: (x) => <span className="mono muted">{x.store_reference}</span> },
    { key: 'when', title: 'Fecha', render: (x) => <span className="small nowrap">{fmt.dateTime(x.created_at)}</span> },
  ];
  if (data.error) return <ErrorBox message={data.error} onRetry={data.reload} />;
  if (!data.data) return <Loading />;
  return (
    <div className="stack">
      <Card flush title="Suscripciones" hint={data.data.has_current ? 'Tiene una membresía vigente' : 'Sin membresía vigente'}>
        <DataTable columns={subs} rows={data.data.subscriptions} empty={<Empty title="Sin suscripciones" />} />
      </Card>
      <Card flush title="Compras de Super likes">
        <DataTable columns={purchases} rows={data.data.purchases} empty={<Empty title="Sin compras" />} />
      </Card>
    </div>
  );
}

/* ---------- Notas ---------- */

function NotesTab({ userId, notes, canManage, act, onDelete }: { userId: string; notes: UserNote[]; canManage: (n: UserNote) => boolean; act: Act; onDelete: (n: UserNote) => void }) {
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editPinned, setEditPinned] = useState(false);
  const sorted = useMemo(() => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.created_at.localeCompare(a.created_at)), [notes]);

  const add = async () => {
    if (body.trim().length < 2) return;
    setBusy(true);
    try {
      await act(() => users.addNote(userId, body.trim(), pinned), 'Nota agregada.');
      setBody('');
      setPinned(false);
    } catch {
      /* ya se avisó */
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (n: UserNote) => {
    setEditId(n.id);
    setEditBody(n.body);
    setEditPinned(n.pinned);
  };

  const saveEdit = async () => {
    if (!editId || editBody.trim().length < 2) return;
    setBusy(true);
    try {
      await act(() => users.updateNote(editId, editBody.trim(), editPinned), 'Nota actualizada.');
      setEditId(null);
    } catch {
      /* ya se avisó */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <div className="note">
        <Field label="Nueva nota">
          <textarea className="textarea" value={body} maxLength={2000} placeholder="Contexto para el equipo: qué pasó, qué se acordó…" onChange={(e) => setBody(e.target.value)} />
        </Field>
        <div className="row spread" style={{ marginTop: 8 }}>
          <label className="checkbox">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> Fijar arriba
          </label>
          <button className="btn primary sm" onClick={add} disabled={busy || body.trim().length < 2}>
            {busy ? 'Guardando…' : 'Agregar nota'}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? <Empty title="Sin notas todavía">La primera nota ayuda a quien atienda después.</Empty> : null}
      {sorted.map((n) => (
        <div key={n.id} className="note">
          {editId === n.id ? (
            <>
              <textarea className="textarea" value={editBody} maxLength={2000} onChange={(e) => setEditBody(e.target.value)} />
              <div className="row spread" style={{ marginTop: 8 }}>
                <label className="checkbox">
                  <input type="checkbox" checked={editPinned} onChange={(e) => setEditPinned(e.target.checked)} /> Fijada
                </label>
                <div className="row">
                  <button className="btn sm" onClick={() => setEditId(null)} disabled={busy}>
                    Cancelar
                  </button>
                  <button className="btn primary sm" onClick={saveEdit} disabled={busy}>
                    Guardar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="prewrap">{n.body}</div>
              <div className="meta">
                <span>
                  {n.pinned ? <Badge tone="coral">Fijada</Badge> : null} {n.author?.name ?? n.author?.email ?? 'Equipo'} · {fmt.dateTime(n.created_at)}
                  {n.updated_at !== n.created_at ? ' · editada' : ''}
                </span>
                {canManage(n) ? (
                  <span className="row" style={{ gap: 4 }}>
                    <button className="btn sm ghost" onClick={() => startEdit(n)}>
                      Editar
                    </button>
                    <button className="btn sm ghost" onClick={() => onDelete(n)}>
                      Borrar
                    </button>
                  </span>
                ) : null}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Bitácora ---------- */

function AuditTab({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const list = useApi(() => users.audit(id, { page }), [id, page]);
  const columns: Column<AdminAction>[] = [
    { key: 'when', title: 'Fecha', render: (a) => <span className="small nowrap">{fmt.dateTime(a.created_at)}</span> },
    { key: 'actor', title: 'Quién', render: (a) => <Person user={a.actor} /> },
    { key: 'action', title: 'Acción', render: (a) => <span>{actionLabels[a.action] ?? a.action}</span> },
    { key: 'changes', title: 'Cambios', render: (a) => <span className="props" title={JSON.stringify(a.changes, null, 2)}>{short(a.changes)}</span> },
    { key: 'note', title: 'Nota', render: (a) => <span className="small">{orDash(a.note)}</span> },
  ];
  return (
    <div className="stack" style={{ gap: 10 }}>
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      {list.loading && !list.data ? <Loading /> : <DataTable columns={columns} rows={list.data?.data ?? []} empty={<Empty title="Nadie del equipo ha actuado sobre esta cuenta" />} />}
      <Pagination meta={list.data?.meta} onPage={setPage} />
    </div>
  );
}

/* ---------- Panel de acciones ---------- */

function ActionsPanel({ u, hasMembership, isAdmin, ask, act, onDeleted }: { u: UserRecord; hasMembership: boolean; isAdmin: boolean; ask: (c: Confirm) => void; act: Act; onDeleted: () => void }) {
  const [status, setStatus] = useState<UserStatus>(u.status);
  const [role, setRole] = useState<UserRole>(u.role);
  const [delta, setDelta] = useState('5');
  const [plan, setPlan] = useState<Plan>('monthly');
  const [days, setDays] = useState('30');

  return (
    <div className="actions-panel">
      <h3>Estado de la cuenta</h3>
      <div className="row">
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
          {STATUSES.map((v) => (
            <option key={v} value={v}>
              {label(v)}
            </option>
          ))}
        </select>
        <button
          className="btn sm"
          disabled={status === u.status}
          onClick={() =>
            ask({
              title: `Cambiar estado a "${label(status)}"`,
              description: status === 'banned' || status === 'suspended' ? 'La persona perderá acceso a la app de inmediato.' : undefined,
              confirmLabel: 'Aplicar',
              danger: status === 'banned' || status === 'suspended',
              run: (note) => act(() => users.setStatus(u.id, status, note || undefined), `Estado cambiado a ${label(status)}.`),
            })
          }
        >
          Aplicar
        </button>
      </div>

      <h3>Verificación</h3>
      {u.verified ? (
        <button
          className="btn block"
          onClick={() =>
            ask({
              title: 'Quitar verificación',
              description: 'El perfil dejará de mostrar la insignia de verificado.',
              confirmLabel: 'Quitar verificación',
              danger: true,
              run: (note) => act(() => users.setVerified(u.id, false, note || undefined), 'Verificación retirada.'),
            })
          }
        >
          Quitar verificación
        </button>
      ) : (
        <button
          className="btn block"
          onClick={() =>
            ask({
              title: 'Verificar manualmente',
              description: 'Marca el perfil como verificado sin pasar por la selfie.',
              confirmLabel: 'Verificar',
              run: (note) => act(() => users.setVerified(u.id, true, note || undefined), 'Perfil verificado.'),
            })
          }
        >
          Verificar manualmente
        </button>
      )}

      <h3>Sesiones</h3>
      <button
        className="btn block"
        onClick={() =>
          ask({
            title: 'Cerrar sesiones en todos los dispositivos',
            description: 'La persona tendrá que volver a entrar en la app.',
            confirmLabel: 'Cerrar sesiones',
            run: () => act(() => users.logout(u.id), (r) => `Se cerraron ${fmt.n(r.sessions_closed)} sesiones.`),
          })
        }
      >
        Cerrar sesiones en todos los dispositivos
      </button>

      {isAdmin ? (
        <>
          <h3>Rol</h3>
          <div className="row">
            <select className="select" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {ROLES.map((v) => (
                <option key={v} value={v}>
                  {label(v)}
                </option>
              ))}
            </select>
            <button
              className="btn sm"
              disabled={role === u.role}
              onClick={() =>
                ask({
                  title: `Cambiar rol a "${label(role)}"`,
                  description: role === 'admin' ? 'Tendrá acceso total al CRM, incluidas acciones irreversibles.' : undefined,
                  confirmLabel: 'Cambiar rol',
                  run: (note) => act(() => users.setRole(u.id, role, note || undefined), `Rol cambiado a ${label(role)}.`),
                })
              }
            >
              Aplicar
            </button>
          </div>

          <h3>Super likes</h3>
          <div className="small muted">Saldo actual: {fmt.n(u.super_likes_balance)}</div>
          <div className="row">
            <input className="input" type="number" step={1} value={delta} onChange={(e) => setDelta(e.target.value)} aria-label="Ajuste (positivo o negativo)" />
            <button
              className="btn sm"
              disabled={!delta || Number(delta) === 0 || Number.isNaN(Number(delta))}
              onClick={() =>
                ask({
                  title: `${Number(delta) > 0 ? 'Agregar' : 'Quitar'} ${Math.abs(Number(delta))} Super likes`,
                  confirmLabel: 'Ajustar',
                  run: (note) => act(() => users.adjustSuperLikes(u.id, Number(delta), note || undefined), (r) => `Listo. Saldo: ${fmt.n(r.super_likes_balance)} Super likes.`),
                })
              }
            >
              Ajustar
            </button>
          </div>

          <h3>Membresía</h3>
          {hasMembership ? (
            <button
              className="btn block"
              onClick={() =>
                ask({
                  title: 'Cancelar membresía',
                  description: 'La membresía vigente termina hoy. No se hace ningún reembolso desde aquí.',
                  confirmLabel: 'Cancelar membresía',
                  danger: true,
                  run: (note) => act(() => users.revokeMembership(u.id, note || undefined), 'Membresía cancelada.'),
                })
              }
            >
              Cancelar membresía
            </button>
          ) : null}
          <div className="row">
            <select className="select" value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
            <input className="input" type="number" min={1} max={730} value={days} onChange={(e) => setDays(e.target.value)} aria-label="Días" />
          </div>
          <button
            className="btn block"
            disabled={!days || Number(days) < 1}
            onClick={() =>
              ask({
                title: `Regalar membresía ${label(plan).toLowerCase()} por ${days} días`,
                description: 'Se registra como cortesía, sin cobro.',
                confirmLabel: 'Regalar',
                run: (note) => act(() => users.grantMembership(u.id, plan, Number(days), note || undefined), (r) => `Membresía activa hasta el ${fmt.date(r.expires_at)}.`),
              })
            }
          >
            Regalar membresía
          </button>

          <h3>Zona de peligro</h3>
          <button
            className="btn danger block"
            onClick={() =>
              ask({
                title: 'Eliminar esta cuenta',
                description: 'Se borran perfil, fotos, matches y conversaciones. No hay vuelta atrás.',
                confirmLabel: 'Eliminar definitivamente',
                danger: true,
                noteRequired: true,
                run: async (note) => {
                  await act(() => users.destroy(u.id, note), 'Cuenta eliminada.', false);
                  onDeleted();
                },
              })
            }
          >
            Eliminar cuenta
          </button>
        </>
      ) : null}
    </div>
  );
}
