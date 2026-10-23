import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ApiError, community, type Connection, type Message, type Paginated } from '../api';
import { Badge, Card, ConfirmModal, DataTable, Drawer, Empty, ErrorBox, Field, Loading, PageHeader, Pagination, Person, Select, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const SOURCES = ['discover', 'here'].map((v) => ({ value: v, label: label(v) }));
const YES_NO = [
  { value: '1', label: 'Sí' },
  { value: '0', label: 'No' },
];

function Pair({ c }: { c: Connection }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <Person user={c.users[0]} />
      <Person user={c.users[1]} />
    </div>
  );
}

function ConnectionDetail({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { toast, can } = useAuth();
  const detail = useApi(() => community.connection(id), [id]);
  const [ending, setEnding] = useState(false);
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [meta, setMeta] = useState<Paginated<Message>['meta'] | null>(null);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const loadMessages = useCallback(
    async (why: string, page: number) => {
      setLoadingMsgs(true);
      try {
        const res = await community.messages(id, { reason: why, page });
        /* La API devuelve del más reciente al más antiguo; mostramos cronológicamente. */
        const chunk = [...res.data].reverse();
        setMessages((prev) => (page === 1 ? chunk : [...chunk, ...prev]));
        setMeta(res.meta);
        setMsgError(null);
        setReason(why);
      } catch (e) {
        const message = e instanceof ApiError ? e.message : 'No se pudo abrir la conversación.';
        setMsgError(message);
        throw new Error(message);
      } finally {
        setLoadingMsgs(false);
      }
    },
    [id],
  );

  const c = detail.data;
  const me = c?.users[0];

  return (
    <Drawer title="Conexión" onClose={onClose}>
      {detail.error ? <ErrorBox message={detail.error} onRetry={detail.reload} /> : null}
      {!c ? (
        <Loading rows={6} />
      ) : (
        <div className="stack">
          <div className="grid cols-2" style={{ gap: 10 }}>
            <Card>
              <Person user={c.users[0]} />
            </Card>
            <Card>
              <Person user={c.users[1]} />
            </Card>
          </div>

          <dl className="kv">
            <dt>Origen</dt>
            <dd>
              <Badge value={c.source} />
            </dd>
            <dt>Estado</dt>
            <dd>{c.active ? <Badge tone="ok">Activa</Badge> : <Badge>Terminada</Badge>}</dd>
            <dt>Creada</dt>
            <dd>
              {fmt.dateTime(c.created_at)} <span className="muted">({fmt.ago(c.created_at)})</span>
            </dd>
            <dt>Último mensaje</dt>
            <dd>{c.last_message_at ? `${fmt.dateTime(c.last_message_at)} (${fmt.ago(c.last_message_at)})` : <span className="muted">sin mensajes</span>}</dd>
            <dt>Mensajes</dt>
            <dd>{fmt.n(c.messages_count)}</dd>
            {c.ended_at ? (
              <>
                <dt>Terminada</dt>
                <dd>
                  {fmt.dateTime(c.ended_at)}
                  {c.ended_by ? <span className="muted"> · por {c.users.find((u) => u?.id === c.ended_by)?.name ?? c.ended_by}</span> : null}
                </dd>
              </>
            ) : null}
          </dl>

          <Card title="Datecitos" hint={`${fmt.n(c.datecitos?.length ?? c.datecitos_count ?? 0)} en esta conexión`}>
            {c.datecitos && c.datecitos.length > 0 ? (
              <ul className="timeline">
                {c.datecitos.map((d) => (
                  <li key={d.id}>
                    <span className="when">{d.scheduled_on ? fmt.date(d.scheduled_on) : d.when_label}</span>
                    <span>
                      <b>{label(d.kind)}</b> en {d.place} <span className="muted">· {d.zone}</span> <Badge value={d.status} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Sin datecitos">Todavía no se han propuesto planes.</Empty>
            )}
          </Card>

          {c.active ? (
            <div className="row">
              <button className="btn danger" onClick={() => setEnding(true)}>
                Terminar conexión
              </button>
              <span className="small muted">Ambas personas dejarán de verse en sus chats.</span>
            </div>
          ) : null}

          <Card title="Mensajes" hint="Por privacidad, las conversaciones sólo se abren con un reporte de por medio o siendo admin. Cada lectura queda en la bitácora.">
            {reason === null ? (
              <div className="stack" style={{ gap: 10 }}>
                {msgError ? <ErrorBox message={msgError} /> : null}
                <div>
                  <button className="btn dark" onClick={() => setAsking(true)} disabled={loadingMsgs}>
                    Leer conversación
                  </button>
                  {!can('administer') ? <span className="small muted" style={{ marginLeft: 10 }}>Necesitas un reporte entre estas personas para poder leerla.</span> : null}
                </div>
              </div>
            ) : (
              <div className="stack" style={{ gap: 10 }}>
                {meta && meta.current_page < meta.last_page ? (
                  <button className="btn sm" onClick={() => loadMessages(reason, meta.current_page + 1).catch(() => undefined)} disabled={loadingMsgs} style={{ alignSelf: 'center' }}>
                    {loadingMsgs ? 'Cargando…' : 'Cargar anteriores'}
                  </button>
                ) : meta && meta.total > 0 ? (
                  <span className="small muted" style={{ alignSelf: 'center' }}>Inicio de la conversación</span>
                ) : null}
                {msgError ? <ErrorBox message={msgError} /> : null}
                {messages.length === 0 && !loadingMsgs ? <Empty title="Sin mensajes" /> : null}
                <div className="messages">
                  {messages.map((m) => {
                    const sender = c.users.find((u) => u?.id === m.sender_id);
                    return (
                      <div key={m.id} className={`msg${me && m.sender_id === me.id ? ' right' : ''}`}>
                        {m.body}
                        <span className="meta">
                          {sender?.name ?? 'Cuenta eliminada'} · {fmt.dateTime(m.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {meta ? <span className="small muted">{fmt.n(meta.total)} mensajes en total</span> : null}
              </div>
            )}
          </Card>
        </div>
      )}

      {ending ? (
        <ConfirmModal
          title="Terminar conexión"
          description="Las dos personas dejarán de verse en sus chats y no podrán seguir escribiéndose. Esta acción queda en la bitácora."
          confirmLabel="Terminar"
          danger
          onClose={() => setEnding(false)}
          onConfirm={async (note) => {
            await community.endConnection(id, note || undefined);
            toast('Conexión terminada.');
            detail.reload();
            onChanged();
          }}
        />
      ) : null}

      {asking ? (
        <ConfirmModal
          title="Leer conversación"
          description="Estás por abrir mensajes privados entre dos personas. Escribe el motivo: queda registrado junto con tu nombre."
          confirmLabel="Abrir mensajes"
          noteRequired
          noteLabel="Motivo (queda en la bitácora)"
          onClose={() => setAsking(false)}
          onConfirm={(note) => loadMessages(note, 1)}
        />
      ) : null}
    </Drawer>
  );
}

export default function Connections() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const { filters, set, clear, query } = useFilters();
  const list = useApi(() => community.connections(query), [JSON.stringify(query)]);

  const activeFilters = Object.keys(filters).filter((k) => k !== 'page' && filters[k]).length;
  const close = useCallback(() => navigate(`/conexiones${search}`), [navigate, search]);

  const columns: Column<Connection>[] = [
    { key: 'users', title: 'Personas', render: (c) => <Pair c={c} /> },
    { key: 'source', title: 'Origen', render: (c) => <Badge value={c.source} /> },
    { key: 'messages_count', title: 'Mensajes', num: true, render: (c) => fmt.n(c.messages_count) },
    { key: 'datecitos_count', title: 'Datecitos', num: true, render: (c) => fmt.n(c.datecitos_count) },
    { key: 'last_message_at', title: 'Último mensaje', render: (c) => <span className="small" title={fmt.dateTime(c.last_message_at)}>{c.last_message_at ? fmt.ago(c.last_message_at) : <span className="muted">—</span>}</span> },
    { key: 'active', title: 'Estado', render: (c) => (c.active ? <Badge tone="ok">Activa</Badge> : <Badge>Terminada</Badge>) },
    { key: 'created_at', title: 'Creada', render: (c) => <span className="small nowrap">{fmt.date(c.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Conexiones"
        sub={list.data ? `${fmt.n(list.data.meta.total)} matches${activeFilters ? ' con filtros' : ''}` : 'Cada match entre dos personas, venga de Descubrir o de Aquí y ahora.'}
        actions={
          activeFilters ? (
            <button className="btn" onClick={clear}>
              Limpiar filtros
            </button>
          ) : null
        }
      />

      <div className="filters">
        <Field label="ID de persona" className="wide">
          <input className="input mono" placeholder="01J…" value={filters.user_id ?? ''} onChange={(e) => set({ user_id: e.target.value })} />
        </Field>
        <Field label="Origen">
          <Select value={filters.source} onChange={(v) => set({ source: v })} options={SOURCES} />
        </Field>
        <Field label="Activa" className="narrow">
          <Select value={filters.active} onChange={(v) => set({ active: v })} options={YES_NO} placeholder="Todas" />
        </Field>
        <Field label="Con mensajes" className="narrow">
          <Select value={filters.with_messages} onChange={(v) => set({ with_messages: v })} options={YES_NO} placeholder="Todas" />
        </Field>
        <Field label="Creada desde" className="narrow">
          <input className="input" type="date" value={filters.from ?? ''} onChange={(e) => set({ from: e.target.value })} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={filters.to ?? ''} onChange={(e) => set({ to: e.target.value })} />
        </Field>
      </div>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} onRowClick={(c) => navigate(`/conexiones/${c.id}${search}`)} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>

      {id ? <ConnectionDetail id={id} onClose={close} onChanged={list.reload} /> : null}
    </>
  );
}
