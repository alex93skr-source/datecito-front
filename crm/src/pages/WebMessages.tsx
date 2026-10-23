import { useState } from 'react';

import { ApiError, web, type WebMessage } from '../api';
import { Badge, Card, Drawer, Empty, ErrorBox, Field, Loading, PageHeader, Pagination, Segmented, Select } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useDebounced, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Pendientes' },
  { value: 'answered', label: 'Atendidos' },
  { value: 'spam', label: 'Spam' },
  { value: 'all', label: 'Todos' },
];

const KIND_OPTIONS = [
  { value: 'contact', label: 'Contacto' },
  { value: 'partners', label: 'Alianzas' },
  { value: 'arco', label: 'Derechos ARCO' },
  { value: 'newsletter', label: 'Boletín' },
  { value: 'campus', label: 'Lista de espera' },
];

const defaults = { status: 'open' };

const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Algo salió mal.');

/** La vista "Pendientes" agrupa nuevos y leídos; la API lo hace cuando no se manda estado. */
const statusQuery = (status: string | undefined) => (status === 'open' || !status ? undefined : status);

function Detail({ m, busy, onStatus, onClose }: { m: WebMessage; busy: boolean; onStatus: (s: WebMessage['status']) => void; onClose: () => void }) {
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const openAttachment = async () => {
    try {
      const { url } = await web.attachment(m.id);
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      setAttachmentError(errMsg(e));
    }
  };

  return (
    <Drawer title={`${m.folio} · ${label(m.kind)}`} onClose={onClose}>
      <div className="row spread" style={{ marginBottom: 12 }}>
        <Badge value={m.status} />
        <span className="small muted">
          {fmt.dateTime(m.created_at)} · {fmt.ago(m.created_at)} · {m.lang === 'en' ? 'Escribió en inglés' : 'Escribió en español'}
        </span>
      </div>

      <dl className="kv">
        <dt>Nombre</dt>
        <dd>{m.name ?? <span className="muted">—</span>}</dd>
        <dt>Correo</dt>
        <dd>
          <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.folio)}`}>{m.email}</a>
        </dd>
        {m.topic ? (
          <>
            <dt>{m.kind === 'arco' ? 'Derecho' : 'Tema'}</dt>
            <dd>{m.topic}</dd>
          </>
        ) : null}
        {m.company ? (
          <>
            <dt>Empresa</dt>
            <dd>{m.company}</dd>
          </>
        ) : null}
        {m.city ? (
          <>
            <dt>Ciudad</dt>
            <dd>{m.city}</dd>
          </>
        ) : null}
      </dl>

      {m.message ? (
        <Card title="Mensaje">
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{m.message}</p>
        </Card>
      ) : null}

      {m.has_attachment ? (
        <Card title="Identificación adjunta" hint="Enlace temporal de 10 minutos. Sólo para confirmar la identidad en solicitudes ARCO.">
          <button className="btn" onClick={openAttachment}>
            Abrir adjunto
          </button>
          {attachmentError ? (
            <div className="small" style={{ marginTop: 8, color: 'var(--danger)' }}>
              {attachmentError}
            </div>
          ) : null}
        </Card>
      ) : null}

      {m.kind === 'arco' ? (
        <div className="small muted" style={{ margin: '12px 0' }}>
          Plazo legal: responder en máximo 20 días hábiles desde {fmt.date(m.created_at)}.
        </div>
      ) : null}

      <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
        {m.status !== 'answered' ? (
          <button className="btn primary" disabled={busy} onClick={() => onStatus('answered')}>
            Marcar como atendido
          </button>
        ) : null}
        {m.status === 'new' ? (
          <button className="btn" disabled={busy} onClick={() => onStatus('read')}>
            Marcar como leído
          </button>
        ) : null}
        {m.status !== 'spam' ? (
          <button className="btn danger" disabled={busy} onClick={() => onStatus('spam')}>
            Es spam
          </button>
        ) : (
          <button className="btn" disabled={busy} onClick={() => onStatus('read')}>
            No es spam
          </button>
        )}
      </div>

      {m.handled_by || m.handled_at ? (
        <div className="small muted" style={{ marginTop: 12 }}>
          Último cambio por <b>{m.handled_by?.name ?? m.handled_by?.email ?? 'el equipo'}</b>
          {m.handled_at ? ` · ${fmt.dateTime(m.handled_at)}` : ''}
        </div>
      ) : null}
    </Drawer>
  );
}

const preview = (m: WebMessage) => {
  if (!m.message) return m.email;
  return m.message.length > 140 ? `${m.message.slice(0, 140)}…` : m.message;
};

export default function WebMessages() {
  const { toast } = useAuth();
  const { filters, set, query } = useFilters(defaults);
  const q = useDebounced(filters.q ?? '');
  const list = useApi(() => web.messages({ ...query, status: statusQuery(filters.status), q: q || undefined }), [JSON.stringify(query), q]);
  const [selected, setSelected] = useState<WebMessage | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = list.data?.data ?? [];

  const open = async (m: WebMessage) => {
    setSelected(m);
    if (m.status === 'new') {
      try {
        const updated = await web.update(m.id, 'read');
        setSelected(updated);
        list.reload();
      } catch {
        /* se marca después a mano */
      }
    }
  };

  const changeStatus = async (status: WebMessage['status']) => {
    if (!selected) return;
    setBusy(true);
    try {
      const updated = await web.update(selected.id, status);
      setSelected(updated);
      toast(status === 'answered' ? 'Mensaje marcado como atendido.' : status === 'spam' ? 'Marcado como spam.' : 'Estado actualizado.');
      list.reload();
    } catch (e) {
      toast(errMsg(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Mensajes del sitio"
        sub={list.data ? `${fmt.n(list.data.meta.total)} mensajes en esta vista. Llegan de los formularios de datecito.com.` : 'Formularios de contacto, alianzas, derechos ARCO y boletín.'}
        actions={<Segmented value={filters.status ?? 'open'} onChange={(v) => set({ status: v })} options={STATUS_OPTIONS} />}
      />

      <Card flush className="filters">
        <div className="row" style={{ padding: 12, gap: 12, flexWrap: 'wrap' }}>
          <Field label="Tipo" className="narrow">
            <Select value={filters.kind} onChange={(v) => set({ kind: v })} options={KIND_OPTIONS} />
          </Field>
          <Field label="Buscar" className="">
            <input value={filters.q ?? ''} onChange={(e) => set({ q: e.target.value })} placeholder="Correo, nombre o empresa" />
          </Field>
        </div>
      </Card>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}

      {list.loading && !list.data ? (
        <Card>
          <Loading rows={6} />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <Empty title={filters.status === 'open' || !filters.status ? 'No hay mensajes pendientes' : 'Nada en esta vista'}>
            {filters.status === 'open' || !filters.status ? 'Cuando alguien escriba desde el sitio, aparecerá aquí.' : null}
          </Empty>
        </Card>
      ) : (
        <Card flush>
          <div className="msg-list">
            {rows.map((m) => (
              <button key={m.id} type="button" className={`msg-row${m.status === 'new' ? ' unread' : ''}`} onClick={() => open(m)}>
                <div className="row spread">
                  <div className="row" style={{ gap: 8 }}>
                    <Badge value={m.kind} tone={m.kind === 'arco' ? 'coral' : 'info'} />
                    <b>{m.name ?? m.email}</b>
                    {m.company ? <span className="muted">· {m.company}</span> : null}
                  </div>
                  <span className="small muted">{fmt.ago(m.created_at)}</span>
                </div>
                <div className="small" style={{ marginTop: 4 }}>
                  {m.topic ? <b>{m.topic} · </b> : null}
                  <span className="muted">{preview(m)}</span>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 6 }}>
                  <Badge value={m.status} />
                  <span className="small muted">{m.folio}</span>
                  {m.has_attachment ? <span className="small muted">· con adjunto</span> : null}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {list.data ? (
        <Card flush className="pager-card">
          <Pagination meta={list.data.meta} onPage={(p) => set({ page: p }, false)} />
        </Card>
      ) : null}

      {selected ? <Detail m={selected} busy={busy} onStatus={changeStatus} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
