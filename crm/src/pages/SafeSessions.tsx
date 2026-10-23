import { useMemo } from 'react';

import { community, type SafeSession } from '../api';
import { Badge, Card, DataTable, ErrorBox, PageHeader, Pagination, Person, Segmented, Stat, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';

const defaults = { status: 'attention' };

const STATUS_OPTIONS = [
  { value: 'attention', label: 'Requieren atención' },
  { value: 'active', label: 'Activas' },
  { value: 'help', label: 'Piden ayuda' },
  { value: 'overdue', label: 'Sin check-in' },
  { value: 'ended', label: 'Terminadas' },
  { value: 'all', label: 'Todas' },
];

/** "en 12 min" si el check-in es futuro; si ya pasó, "hace X". */
function relative(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return fmt.ago(iso);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'en menos de 1 min';
  if (m < 60) return `en ${m} min`;
  const h = Math.floor(m / 60);
  return h < 24 ? `en ${h} h` : `en ${Math.floor(h / 24)} d`;
}

export default function SafeSessions() {
  const { filters, set, query } = useFilters(defaults);
  const list = useApi(() => community.safeSessions(query), [JSON.stringify(query)], { refreshMs: 30000 });

  const counts = useMemo(() => {
    const out = { active: 0, help: 0, overdue: 0, ended: 0 };
    (list.data?.data ?? []).forEach((s) => {
      out[s.status] += 1;
    });
    return out;
  }, [list.data]);

  const columns: Column<SafeSession>[] = [
    { key: 'user', title: 'Persona', render: (s) => <Person user={s.user} /> },
    {
      key: 'status',
      title: 'Estado',
      render: (s) => (
        <span className="row" style={{ gap: 6 }}>
          <Badge value={s.status} />
          {s.status === 'help' ? <span className="small" style={{ color: 'var(--danger)', fontWeight: 800 }}>Urgente</span> : null}
        </span>
      ),
    },
    {
      key: 'other',
      title: 'Con quién',
      render: (s) => {
        const other = s.datecito.users.find((u) => u?.id !== s.user?.id) ?? null;
        return <Person user={other} />;
      },
    },
    {
      key: 'plan',
      title: 'Plan',
      render: (s) => (
        <span>
          <b>{label(s.datecito.kind)}</b> en {s.datecito.place}
          <span className="cell-sub" style={{ display: 'block' }}>
            {s.datecito.zone}
            {s.datecito.scheduled_on ? ` · ${fmt.date(s.datecito.scheduled_on)}` : ''}
          </span>
        </span>
      ),
    },
    {
      key: 'check_in_at',
      title: 'Check-in programado',
      render: (s) => (
        <span className="small nowrap">
          {fmt.dateTime(s.check_in_at)}
          <span className="cell-sub" style={s.status === 'overdue' ? { display: 'block', color: 'var(--warning)', fontWeight: 800 } : { display: 'block' }}>{relative(s.check_in_at)}</span>
        </span>
      ),
    },
    { key: 'help_requested_at', title: 'Pidió ayuda', render: (s) => (s.help_requested_at ? <span className="small nowrap" style={{ color: 'var(--danger)', fontWeight: 800 }}>{fmt.dateTime(s.help_requested_at)}</span> : <span className="muted">—</span>) },
    { key: 'contacts_count', title: 'Contactos avisados', num: true, render: (s) => fmt.n(s.contacts_count) },
    { key: 'share_location', title: 'Comparte ubicación', render: (s) => (s.share_location ? <Badge tone="ok">Sí</Badge> : <span className="muted small">No</span>) },
    { key: 'created_at', title: 'Iniciada', render: (s) => <span className="small nowrap" title={fmt.dateTime(s.created_at)}>{fmt.ago(s.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Datecito Seguro"
        sub="Sesiones de seguridad de las personas que van a un datecito. Se actualiza cada 30 s."
        actions={<Segmented value={filters.status} onChange={(v) => set({ status: v })} options={STATUS_OPTIONS} />}
      />

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="Piden ayuda" value={<span style={counts.help > 0 ? { color: 'var(--danger)' } : undefined}>{fmt.n(counts.help)}</span>} foot={<Badge value="help" />} />
        <Stat label="Sin check-in" value={<span style={counts.overdue > 0 ? { color: 'var(--warning)' } : undefined}>{fmt.n(counts.overdue)}</span>} foot={<Badge value="overdue" />} />
        <Stat label="Activas" value={fmt.n(counts.active)} foot={<Badge value="active" />} />
        <Stat label="Terminadas" value={fmt.n(counts.ended)} foot={<Badge value="ended" />} />
      </div>
      <p className="small muted" style={{ marginTop: -6, marginBottom: 12 }}>
        Conteos de la página actual ({list.data ? `${fmt.n(list.data.meta.total)} sesiones con el filtro` : '…'}). Las que piden ayuda y las que no hicieron check-in aparecen primero.
      </p>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>

      <p className="small muted" style={{ marginTop: 12 }}>
        El aviso a los contactos de confianza lo envía el celular de la persona (SMS o WhatsApp), no el servidor. El CRM sólo observa: no puede llamar, escribir ni cancelar la alerta. Las coordenadas nunca se muestran aquí.
      </p>
    </>
  );
}
