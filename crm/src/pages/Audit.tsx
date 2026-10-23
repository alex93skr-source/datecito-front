import { useMemo } from 'react';

import { team, type AdminAction } from '../api';
import { BarList } from '../components/charts';
import { Card, DataTable, Empty, ErrorBox, Field, Loading, PageHeader, Pagination, Person, Select, type Column } from '../components/ui';
import { actionLabels, fmt } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';

const defaults = {};

const actionLabel = (a: string) => actionLabels[a] ?? a;

const compact = (v: unknown) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string') return v.length > 60 ? `${v.slice(0, 60)}…` : v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  const s = JSON.stringify(v);
  return s.length > 60 ? `${s.slice(0, 60)}…` : s;
};

export default function Audit() {
  const { filters, set, clear, query } = useFilters(defaults);
  const list = useApi(() => team.audit(query), [JSON.stringify(query)]);
  const actions = useMemo(() => list.data?.meta.actions ?? [], [list.data]);
  const top = useMemo(() => actions.slice(0, 10).map((a) => ({ label: a.action, value: a.count })), [actions]);
  const activeFilters = ['action', 'actor_id', 'subject_id', 'from', 'to'].filter((k) => filters[k]).length;

  const columns: Column<AdminAction>[] = [
    { key: 'when', title: 'Fecha y hora', render: (a) => <span className="small nowrap">{fmt.dateTime(a.created_at)}</span> },
    { key: 'actor', title: 'Quién', render: (a) => <Person user={a.actor} /> },
    {
      key: 'action',
      title: 'Acción',
      render: (a) => (
        <div>
          <div>{actionLabel(a.action)}</div>
          <span className="code">{a.action}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      title: 'Sobre quién',
      render: (a) =>
        a.subject ? (
          <Person user={a.subject} />
        ) : a.subject_type ? (
          <span className="small">
            {a.subject_type} <span className="mono muted">#{a.subject_id}</span>
          </span>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'changes',
      title: 'Cambios',
      render: (a) => {
        const entries = Object.entries(a.changes ?? {});
        if (entries.length === 0) return <span className="muted">—</span>;
        return (
          <ul className="kv-list" title={JSON.stringify(a.changes, null, 2)}>
            {entries.slice(0, 5).map(([k, v]) => (
              <li key={k}>
                <span className="muted">{k}:</span> <span className="mono">{compact(v)}</span>
              </li>
            ))}
            {entries.length > 5 ? <li className="muted">+{entries.length - 5} más</li> : null}
          </ul>
        );
      },
    },
    { key: 'note', title: 'Nota', render: (a) => (a.note ? <span className="small prewrap">{a.note}</span> : <span className="muted">—</span>) },
  ];

  return (
    <>
      <PageHeader
        title="Auditoría"
        sub={list.data ? `${fmt.n(list.data.meta.total)} acciones del equipo${activeFilters ? ` con ${activeFilters} filtro${activeFilters > 1 ? 's' : ''}` : ''}.` : 'Todo lo que el equipo hace en el CRM, con quién y por qué.'}
        actions={
          activeFilters ? (
            <button className="btn" onClick={clear}>
              Limpiar filtros
            </button>
          ) : null
        }
      />

      <Card title="Acciones más frecuentes" hint="Histórico completo, sin filtros" className="audit-top">
        {list.data ? <BarList slices={top} labelFn={actionLabel} colorize /> : list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : <Loading rows={5} />}
      </Card>

      <div className="filters" style={{ marginTop: 16 }}>
        <Field label="Acción" className="wide">
          <Select value={filters.action} onChange={(v) => set({ action: v })} options={actions.map((a) => ({ value: a.action, label: `${actionLabel(a.action)} (${fmt.n(a.count)})` }))} placeholder="Todas" />
        </Field>
        <Field label="ID de quien actuó">
          <input className="input mono" placeholder="01J…" value={filters.actor_id ?? ''} onChange={(e) => set({ actor_id: e.target.value.trim() })} />
        </Field>
        <Field label="ID de la persona afectada">
          <input className="input mono" placeholder="01J…" value={filters.subject_id ?? ''} onChange={(e) => set({ subject_id: e.target.value.trim() })} />
        </Field>
        <Field label="Desde" className="narrow">
          <input className="input" type="date" value={filters.from ?? ''} onChange={(e) => set({ from: e.target.value })} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={filters.to ?? ''} onChange={(e) => set({ to: e.target.value })} />
        </Field>
      </div>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} empty={<Empty title="Sin acciones con estos filtros" />} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>
    </>
  );
}
