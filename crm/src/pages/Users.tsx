import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { users, type UserSummary } from '../api';
import { Badge, Card, DataTable, ErrorBox, Field, Pagination, Person, Select, type Column } from '../components/ui';
import { PageHeader } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useDebounced, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const defaults = { sort: 'created_at', dir: 'desc' };

export default function Users() {
  const navigate = useNavigate();
  const { toast } = useAuth();
  const { filters, set, clear, query } = useFilters(defaults);
  const [q, setQ] = useState(filters.q ?? '');
  const debounced = useDebounced(q);
  const effective = useMemo(() => ({ ...query, q: debounced }), [query, debounced]);
  const list = useApi(() => users.list(effective), [JSON.stringify(effective)]);
  const tags = useApi(() => users.tags(), []);
  const [exporting, setExporting] = useState(false);

  const activeFilters = Object.keys(filters).filter((k) => !['sort', 'dir', 'page'].includes(k) && filters[k]).length + (debounced ? 1 : 0);

  const onSort = (key: string) => set({ sort: key, dir: filters.sort === key && filters.dir === 'desc' ? 'asc' : 'desc' });

  const columns: Column<UserSummary>[] = [
    { key: 'name', title: 'Persona', sortable: true, render: (u) => <Person user={u} link={false} sub={<>{u.email}{u.age ? ` · ${u.age} años` : ''}{u.gender ? ` · ${u.gender}` : ''}</>} /> },
    {
      key: 'status',
      title: 'Estado',
      render: (u) => (
        <div className="row" style={{ gap: 4 }}>
          <Badge value={u.status} />
          {u.role !== 'user' ? <Badge value={u.role} /> : null}
          {!u.email_verified ? <Badge tone="warn">Correo sin verificar</Badge> : null}
          {!u.show_in_discover ? <Badge>Oculto</Badge> : null}
        </div>
      ),
    },
    { key: 'verified', title: 'Perfil', render: (u) => (u.verified ? <Badge tone="ok">Verificado</Badge> : u.verification_status === 'pending' ? <Badge value="pending" /> : <span className="muted small">Sin verificar</span>) },
    { key: 'membership', title: 'Membresía', render: (u) => (u.membership ? <Badge value={u.membership.plan} /> : <span className="muted small">—</span>) },
    { key: 'zone', title: 'Zona', render: (u) => u.zone ?? <span className="muted">—</span> },
    { key: 'photos_count', title: 'Fotos', num: true, sortable: true, render: (u) => fmt.n(u.photos_count) },
    { key: 'swipes_count', title: 'Swipes', num: true, sortable: true, render: (u) => fmt.n(u.swipes_count) },
    { key: 'reports_received_count', title: 'Reportes', num: true, sortable: true, render: (u) => (u.reports_received_count ? <Badge tone="bad">{u.reports_received_count}</Badge> : <span className="muted">0</span>) },
    { key: 'platform', title: 'App', render: (u) => (u.platform ? <span className="small">{label(u.platform)}{u.app_version ? <span className="muted"> {u.app_version}</span> : null}</span> : <span className="muted">—</span>) },
    { key: 'tags', title: 'Etiquetas', render: (u) => <div className="chips">{u.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div> },
    { key: 'last_seen_at', title: 'Última actividad', sortable: true, render: (u) => <span className="small" title={fmt.dateTime(u.last_seen_at)}>{fmt.ago(u.last_seen_at)}</span> },
    { key: 'created_at', title: 'Registro', sortable: true, render: (u) => <span className="small">{fmt.date(u.created_at)}</span> },
  ];

  const exportCsv = async () => {
    setExporting(true);
    try {
      await users.export(effective);
      toast('Exportación lista.');
    } catch {
      toast('No se pudo exportar.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        sub={list.data ? `${fmt.n(list.data.meta.total)} personas${activeFilters ? ` con ${activeFilters} filtro${activeFilters > 1 ? 's' : ''}` : ''}` : 'Busca, filtra y segmenta a todas las personas.'}
        actions={
          <>
            {activeFilters ? (
              <button className="btn" onClick={() => { clear(); setQ(''); }}>
                Limpiar filtros
              </button>
            ) : null}
            <button className="btn dark" onClick={exportCsv} disabled={exporting}>
              {exporting ? 'Exportando…' : 'Exportar CSV'}
            </button>
          </>
        }
      />

      <div className="filters">
        <Field label="Buscar" className="wide">
          <input className="input" placeholder="Nombre, correo o ID" value={q} onChange={(e) => setQ(e.target.value)} />
        </Field>
        <Field label="Estado">
          <Select value={filters.status} onChange={(v) => set({ status: v })} options={['active', 'paused', 'suspended', 'banned'].map((v) => ({ value: v, label: label(v) }))} />
        </Field>
        <Field label="Verificación">
          <Select value={filters.verification} onChange={(v) => set({ verification: v })} options={['approved', 'pending', 'rejected', 'none'].map((v) => ({ value: v, label: label(v) }))} />
        </Field>
        <Field label="Correo">
          <Select value={filters.email_verified} onChange={(v) => set({ email_verified: v })} options={[{ value: '1', label: 'Verificado' }, { value: '0', label: 'Sin verificar' }]} />
        </Field>
        <Field label="Membresía">
          <Select value={filters.membership} onChange={(v) => set({ membership: v })} options={[{ value: 'active', label: 'Con membresía' }, { value: 'none', label: 'Sin membresía' }]} />
        </Field>
        <Field label="Plataforma">
          <Select value={filters.platform} onChange={(v) => set({ platform: v })} options={['ios', 'android', 'web'].map((v) => ({ value: v, label: label(v) }))} />
        </Field>
        <Field label="Fotos">
          <Select value={filters.has_photos} onChange={(v) => set({ has_photos: v })} options={[{ value: '1', label: 'Con fotos' }, { value: '0', label: 'Sin fotos' }]} />
        </Field>
        <Field label="Rol">
          <Select value={filters.role} onChange={(v) => set({ role: v })} options={['user', 'moderator', 'admin'].map((v) => ({ value: v, label: label(v) }))} />
        </Field>
        <Field label="Etiqueta">
          <Select value={filters.tag} onChange={(v) => set({ tag: v })} options={(tags.data ?? []).map((t) => ({ value: t.tag, label: `${t.tag} (${t.users})` }))} placeholder="Todas" />
        </Field>
        <Field label="Género">
          <input className="input" value={filters.gender ?? ''} onChange={(e) => set({ gender: e.target.value })} placeholder="Mujer, Hombre…" />
        </Field>
        <Field label="Zona">
          <input className="input" value={filters.zone ?? ''} onChange={(e) => set({ zone: e.target.value })} placeholder="Roma Norte…" />
        </Field>
        <Field label="Registro desde" className="narrow">
          <input className="input" type="date" value={filters.created_from ?? ''} onChange={(e) => set({ created_from: e.target.value })} />
        </Field>
        <Field label="hasta" className="narrow">
          <input className="input" type="date" value={filters.created_to ?? ''} onChange={(e) => set({ created_to: e.target.value })} />
        </Field>
        <Field label="Activa desde" className="narrow">
          <input className="input" type="date" value={filters.seen_from ?? ''} onChange={(e) => set({ seen_from: e.target.value })} />
        </Field>
        <Field label="Reportes ≥" className="narrow">
          <input className="input" type="number" min={1} value={filters.min_reports ?? ''} onChange={(e) => set({ min_reports: e.target.value })} />
        </Field>
      </div>

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      <Card flush>
        {list.loading && !list.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={list.data?.data ?? []} onRowClick={(u) => navigate(`/usuarios/${u.id}`)} sort={{ key: filters.sort, dir: filters.dir as 'asc' | 'desc' }} onSort={onSort} />
        <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
      </Card>
    </>
  );
}
