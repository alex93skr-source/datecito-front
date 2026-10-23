import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiError, moderation, users, type Report } from '../api';
import { Badge, Card, ConfirmModal, DataTable, Drawer, Empty, ErrorBox, Field, PageHeader, Pagination, Person, Segmented, Select, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const REASONS = ['Comportamiento inapropiado', 'Perfil falso o spam', 'Me preocupa mi seguridad', 'Es menor de edad'];

const STATUS_OPTIONS = [
  { value: '', label: 'Pendientes' },
  { value: 'open', label: 'Abiertos' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'resolved', label: 'Resueltos' },
  { value: 'dismissed', label: 'Descartados' },
  { value: 'all', label: 'Todos' },
];

const defaults = { sort: 'oldest' };

const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Algo salió mal.');
const reportedMini = (r: Report) => (r.reported ? { id: r.reported.id, name: r.reported.name, email: r.reported.email, status: r.reported.status } : null);

export default function Reports() {
  const { toast } = useAuth();
  const { filters, set, clear, query } = useFilters(defaults);
  const list = useApi(() => moderation.reports(query), [JSON.stringify(query)]);

  const [selected, setSelected] = useState<Report | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const close = useCallback(() => setSelected(null), []);
  const closeSuspend = useCallback(() => setSuspending(false), []);

  const open = (r: Report) => {
    setSelected(r);
    setNote(r.resolution_note ?? '');
  };

  const update = async (status: Report['status']) => {
    if (!selected) return;
    setBusy(true);
    try {
      const updated = await moderation.updateReport(selected.id, status, note.trim() || undefined);
      setSelected(updated);
      toast(status === 'reviewing' ? 'Reporte tomado. Está en revisión.' : status === 'resolved' ? 'Reporte resuelto.' : 'Reporte descartado.');
      list.reload();
    } catch (e) {
      toast(errMsg(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const activeFilters = ['reason', 'reported_id', 'from', 'to'].filter((k) => filters[k]).length;

  const columns: Column<Report>[] = [
    { key: 'when', title: 'Fecha', render: (r) => <span className="small nowrap" title={fmt.dateTime(r.created_at)}>{fmt.dateTime(r.created_at)}</span> },
    { key: 'reason', title: 'Razón', render: (r) => <Badge tone="coral">{r.reason}</Badge> },
    { key: 'reporter', title: 'Reportante', render: (r) => <Person user={{ ...r.reporter, status: null }} /> },
    {
      key: 'reported',
      title: 'Reportado',
      render: (r) => (
        <div className="row" style={{ gap: 6 }}>
          <Person user={reportedMini(r)} />
          {r.reported ? <Badge value={r.reported.status} /> : null}
          {r.reported && (r.reported.reports_received ?? 0) > 1 ? <Badge tone="bad">{r.reported.reports_received} reportes</Badge> : null}
        </div>
      ),
    },
    { key: 'details', title: 'Detalles', render: (r) => <span className="small truncate-2" title={r.details ?? ''}>{r.details?.trim() ? r.details : <span className="muted">Sin detalles</span>}</span> },
    { key: 'status', title: 'Estado', render: (r) => <Badge value={r.status} /> },
    { key: 'handled', title: 'Atendido por', render: (r) => (r.handled_by ? <span className="small">{r.handled_by.name ?? r.handled_by.email}</span> : <span className="muted">—</span>) },
  ];

  const canSuspend = !!selected?.reported && selected.reported.status !== 'suspended' && selected.reported.status !== 'banned';

  return (
    <>
      <PageHeader
        title="Reportes"
        sub={list.data ? `${fmt.n(list.data.meta.total)} reportes en esta vista. Los más antiguos primero para que nadie espere de más.` : 'Lo que la comunidad nos señala. Atiende primero lo más antiguo.'}
        actions={
          <>
            {activeFilters || filters.status ? (
              <button className="btn" onClick={clear}>
                Limpiar filtros
              </button>
            ) : null}
            <Segmented value={filters.status ?? ''} onChange={(v) => set({ status: v })} options={STATUS_OPTIONS} />
          </>
        }
      />

      <div className="filters">
        <Field label="Razón">
          <Select value={filters.reason} onChange={(v) => set({ reason: v })} options={REASONS.map((r) => ({ value: r, label: r }))} placeholder="Todas" />
        </Field>
        <Field label="ID de la persona reportada" className="wide">
          <input className="input mono" placeholder="01J…" value={filters.reported_id ?? ''} onChange={(e) => set({ reported_id: e.target.value.trim() })} />
        </Field>
        <Field label="Desde" className="narrow">
          <input className="input" type="date" value={filters.from ?? ''} onChange={(e) => set({ from: e.target.value })} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={filters.to ?? ''} onChange={(e) => set({ to: e.target.value })} />
        </Field>
        <Field label="Orden" className="narrow">
          <select className="select" value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            <option value="oldest">Más antiguos</option>
            <option value="newest">Más recientes</option>
          </select>
        </Field>
      </div>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} onRowClick={open} empty={<Empty title="Nada pendiente por aquí">Cuando alguien reporte a otra persona, aparecerá en esta lista.</Empty>} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>

      {selected ? (
        <Drawer title={<span className="row" style={{ gap: 8 }}>Reporte <Badge value={selected.status} /></span>} onClose={close}>
          <div className="stack">
            <dl className="kv">
              <dt>Razón</dt>
              <dd>
                <Badge tone="coral">{selected.reason}</Badge>
              </dd>
              <dt>Fecha</dt>
              <dd>{fmt.dateTime(selected.created_at)}</dd>
              <dt>Reportante</dt>
              <dd>
                <Person user={{ ...selected.reporter, status: null }} />
              </dd>
              <dt>Reportado</dt>
              <dd>
                <div className="row" style={{ gap: 6 }}>
                  <Person user={reportedMini(selected)} />
                  {selected.reported ? <Badge value={selected.reported.status} /> : null}
                  {selected.reported?.verified ? <Badge tone="ok">Verificado</Badge> : null}
                  {selected.reported && (selected.reported.reports_received ?? 0) > 1 ? <Badge tone="bad">{selected.reported.reports_received} reportes en total</Badge> : null}
                </div>
              </dd>
              {selected.handled_by ? (
                <>
                  <dt>Atendido por</dt>
                  <dd>
                    {selected.handled_by.name ?? selected.handled_by.email} · {fmt.dateTime(selected.updated_at)}
                  </dd>
                </>
              ) : null}
              <dt>ID</dt>
              <dd className="mono">{selected.id}</dd>
            </dl>

            <div>
              <h3 style={{ marginBottom: 6 }}>Detalles</h3>
              <div className="note prewrap">{selected.details?.trim() ? selected.details : <span className="muted">La persona no escribió detalles.</span>}</div>
            </div>

            <Field label="Nota de resolución (visible para el equipo)">
              <textarea className="textarea" value={note} maxLength={2000} placeholder="Qué revisaste y qué decidiste…" onChange={(e) => setNote(e.target.value)} />
            </Field>

            <div className="row">
              <button className="btn" onClick={() => update('reviewing')} disabled={busy || selected.status === 'reviewing'}>
                Tomar (en revisión)
              </button>
              <button className="btn primary" onClick={() => update('resolved')} disabled={busy || selected.status === 'resolved'}>
                Resolver
              </button>
              <button className="btn" onClick={() => update('dismissed')} disabled={busy || selected.status === 'dismissed'}>
                Descartar
              </button>
            </div>

            <div className="row" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <button className="btn danger" onClick={() => setSuspending(true)} disabled={!canSuspend}>
                Suspender a la persona reportada
              </button>
              {selected.reported ? (
                <Link to={`/usuarios/${selected.reported.id}`} className="btn">
                  Ver ficha
                </Link>
              ) : null}
              {selected.reported ? (
                <Link to={`/moderacion/reportes?reported_id=${selected.reported.id}&status=all`} className="btn ghost" onClick={close}>
                  Todos sus reportes
                </Link>
              ) : null}
            </div>
            {selected.reported && !canSuspend ? <p className="small muted">Esta cuenta ya está {label(selected.reported.status).toLowerCase()}.</p> : null}
          </div>
        </Drawer>
      ) : null}

      {suspending && selected?.reported ? (
        <ConfirmModal
          title={`Suspender a ${selected.reported.name ?? 'esta persona'}`}
          description="La cuenta queda suspendida y pierde acceso a la app. Puedes reactivarla desde su ficha."
          confirmLabel="Suspender"
          danger
          onConfirm={async (n) => {
            const reportedId = selected.reported?.id;
            if (!reportedId) return;
            try {
              await users.setStatus(reportedId, 'suspended', n || `Reporte ${selected.id}: ${selected.reason}`);
              toast('Cuenta suspendida.');
              list.reload();
              setSelected((r) => (r && r.reported ? { ...r, reported: { ...r.reported, status: 'suspended' } } : r));
            } catch (e) {
              toast(errMsg(e), 'error');
              throw e;
            }
          }}
          onClose={closeSuspend}
        />
      ) : null}
    </>
  );
}
