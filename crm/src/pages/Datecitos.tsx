import { community, type Datecito } from '../api';
import { Badge, Card, DataTable, ErrorBox, Field, PageHeader, Pagination, Person, Select, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';

const STATUSES = ['proposed', 'confirmed', 'cancelled'].map((v) => ({ value: v, label: label(v) }));
const KINDS = ['cafe', 'comida', 'bar', 'naturaleza', 'cultura', 'otro'].map((v) => ({ value: v, label: label(v) }));

export default function Datecitos() {
  const { filters, set, clear, query } = useFilters();
  const list = useApi(() => community.datecitos(query), [JSON.stringify(query)]);
  const activeFilters = Object.keys(filters).filter((k) => k !== 'page' && filters[k]).length;

  const columns: Column<Datecito>[] = [
    {
      key: 'users',
      title: 'Personas',
      render: (d) => (
        <div className="stack" style={{ gap: 6 }}>
          {d.users.map((u, i) => (
            <Person key={u?.id ?? i} user={u} />
          ))}
        </div>
      ),
    },
    {
      key: 'plan',
      title: 'Plan',
      render: (d) => (
        <span>
          <b>{label(d.kind)}</b> en {d.place}
          <span className="cell-sub" style={{ display: 'block' }}>{d.zone}</span>
        </span>
      ),
    },
    {
      key: 'when',
      title: 'Cuándo',
      render: (d) => (
        <span>
          {d.when_label}
          {d.scheduled_on ? <span className="cell-sub" style={{ display: 'block' }}>{fmt.date(d.scheduled_on)}</span> : null}
        </span>
      ),
    },
    { key: 'status', title: 'Estado', render: (d) => <Badge value={d.status} /> },
    { key: 'proposer', title: 'Propuesto por', render: (d) => <span className="small">{d.users.find((u) => u?.id === d.proposer_id)?.name ?? <span className="muted">Cuenta eliminada</span>}</span> },
    { key: 'feedback_count', title: 'Feedback', num: true, render: (d) => (d.feedback_count ? fmt.n(d.feedback_count) : <span className="muted">0</span>) },
    { key: 'created_at', title: 'Creado', render: (d) => <span className="small nowrap">{fmt.date(d.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Datecitos"
        sub={list.data ? `${fmt.n(list.data.meta.total)} planes${activeFilters ? ' con filtros' : ''}` : 'Los planes que las personas se proponen después de hacer match.'}
        actions={
          activeFilters ? (
            <button className="btn" onClick={clear}>
              Limpiar filtros
            </button>
          ) : null
        }
      />

      <div className="filters">
        <Field label="Estado">
          <Select value={filters.status} onChange={(v) => set({ status: v })} options={STATUSES} />
        </Field>
        <Field label="Tipo de plan">
          <Select value={filters.kind} onChange={(v) => set({ kind: v })} options={KINDS} />
        </Field>
        <Field label="Zona">
          <input className="input" placeholder="Roma Norte…" value={filters.zone ?? ''} onChange={(e) => set({ zone: e.target.value })} />
        </Field>
        <Field label="ID de persona">
          <input className="input mono" placeholder="01J…" value={filters.user_id ?? ''} onChange={(e) => set({ user_id: e.target.value })} />
        </Field>
        <Field label="Creado desde" className="narrow">
          <input className="input" type="date" value={filters.from ?? ''} onChange={(e) => set({ from: e.target.value })} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={filters.to ?? ''} onChange={(e) => set({ to: e.target.value })} />
        </Field>
        <label className="checkbox" style={{ paddingBottom: 8 }}>
          <input type="checkbox" checked={filters.upcoming === '1'} onChange={(e) => set({ upcoming: e.target.checked })} /> Sólo próximos
        </label>
      </div>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>

      <p className="small muted" style={{ marginTop: 12 }}>
        "Feedback" cuenta cuántas personas respondieron "¿Cómo te fue?" después del plan. Las respuestas en sí son privadas y nunca se muestran en el CRM.
      </p>
    </>
  );
}
