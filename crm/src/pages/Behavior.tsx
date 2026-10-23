import { useEffect, useMemo, useState } from 'react';

import { dashboard, events, type ActivityEvent, type EventName, type RoutePerformance } from '../api';
import { LineChart } from '../components/charts';
import { PeriodPicker } from '../components/PeriodPicker';
import { Badge, Card, DataTable, ErrorBox, Field, Loading, PageHeader, Pagination, Person, Select, Stat, Tabs, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useDebounced, useFilters, usePeriod } from '../lib/hooks';

type Tab = 'explorer' | 'ranking' | 'performance';

const TABS: { value: Tab; label: string }[] = [
  { value: 'explorer', label: 'Explorador' },
  { value: 'ranking', label: 'Ranking de eventos' },
  { value: 'performance', label: 'Rendimiento de la API' },
];

const CATEGORIES = ['api', 'client', 'system'].map((v) => ({ value: v, label: label(v) }));
const PLATFORMS = ['ios', 'android', 'web'].map((v) => ({ value: v, label: label(v) }));

function StatusBadge({ status }: { status: number | null }) {
  if (status === null) return <span className="muted">—</span>;
  const tone = status >= 500 ? 'bad' : status >= 400 ? 'warn' : status >= 200 && status < 300 ? 'ok' : '';
  return <Badge tone={tone}>{status}</Badge>;
}

function compactJson(props: Record<string, unknown>): string {
  const s = JSON.stringify(props);
  if (!s || s === '{}') return '';
  return s.length > 140 ? `${s.slice(0, 140)}…` : s;
}

type RankRow = EventName & { id: string; per_user: number };
type RankKey = 'count' | 'users' | 'per_user';

export default function Behavior() {
  const { period, set: setPeriod, query: periodQuery } = usePeriod(30);
  const { filters, set } = useFilters();
  const tab = (filters.tab as Tab | undefined) ?? 'explorer';

  /* ---------- Explorador ---------- */
  const [name, setName] = useState(filters.name ?? '');
  const debounced = useDebounced(name);
  useEffect(() => {
    if ((filters.name ?? '') !== debounced) set({ name: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const listQuery = useMemo(
    () => ({ name: debounced || undefined, category: filters.category, platform: filters.platform, user_id: filters.user_id, errors: filters.errors === '1' ? 1 : undefined, from: periodQuery.from, to: periodQuery.to, page: filters.page }),
    [debounced, filters.category, filters.platform, filters.user_id, filters.errors, filters.page, periodQuery.from, periodQuery.to],
  );
  const list = useApi(() => events.list(listQuery), [JSON.stringify(listQuery)], { enabled: tab === 'explorer' });
  const series = useApi(() => dashboard.series({ ...periodQuery, metric: 'events', name: debounced || undefined }), [periodQuery.from, periodQuery.to, periodQuery.interval, debounced], { enabled: tab === 'explorer' });

  const eventColumns: Column<ActivityEvent>[] = [
    { key: 'occurred_at', title: 'Hora', render: (e) => <span className="small nowrap" title={e.occurred_at}>{fmt.dateTime(e.occurred_at)}</span> },
    { key: 'user', title: 'Persona', render: (e) => (e.user ? <Person user={e.user} /> : <span className="muted">anónimo</span>) },
    { key: 'name', title: 'Evento', render: (e) => <span className="code">{e.name}</span> },
    { key: 'category', title: 'Categoría', render: (e) => <Badge value={e.category} /> },
    { key: 'platform', title: 'Plataforma', render: (e) => (e.platform ? <span className="small">{label(e.platform)}{e.app_version ? <span className="muted"> {e.app_version}</span> : null}</span> : <span className="muted">—</span>) },
    { key: 'status', title: 'Status', render: (e) => <StatusBadge status={e.status} /> },
    { key: 'duration_ms', title: 'Duración', num: true, render: (e) => <span className={e.duration_ms !== null && e.duration_ms > 500 ? 'nowrap' : 'nowrap muted'}>{fmt.ms(e.duration_ms)}</span> },
    { key: 'properties', title: 'Propiedades', render: (e) => <span className="props" title={JSON.stringify(e.properties, null, 2)}>{compactJson(e.properties)}</span> },
  ];

  /* ---------- Ranking ---------- */
  const names = useApi(() => events.names({ from: periodQuery.from, to: periodQuery.to, category: filters.category }), [periodQuery.from, periodQuery.to, filters.category], { enabled: tab === 'ranking' });
  const [rankSort, setRankSort] = useState<{ key: RankKey; dir: 'asc' | 'desc' }>({ key: 'count', dir: 'desc' });
  const rankRows = useMemo<RankRow[]>(() => {
    const rows = (names.data ?? []).map((n) => ({ ...n, id: n.name, per_user: n.users > 0 ? n.count / n.users : 0 }));
    const sign = rankSort.dir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => (a[rankSort.key] - b[rankSort.key]) * sign);
  }, [names.data, rankSort]);
  const onRankSort = (key: string) => setRankSort((s) => ({ key: key as RankKey, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));
  const pickName = (n: string) => {
    setName(n);
    set({ name: n, tab: 'explorer' });
  };

  const rankColumns: Column<RankRow>[] = [
    {
      key: 'name',
      title: 'Evento',
      render: (r) => (
        <button className="code" style={{ border: 0, cursor: 'pointer' }} onClick={() => pickName(r.name)} title="Ver en el explorador">
          {r.name}
        </button>
      ),
    },
    { key: 'category', title: 'Categoría', render: (r) => <Badge value={r.category} /> },
    { key: 'count', title: 'Veces', num: true, sortable: true, render: (r) => fmt.n(r.count) },
    { key: 'users', title: 'Personas', num: true, sortable: true, render: (r) => fmt.n(r.users) },
    { key: 'per_user', title: 'Por persona', num: true, sortable: true, render: (r) => (r.users > 0 ? r.per_user.toFixed(1) : '—') },
  ];

  /* ---------- Rendimiento ---------- */
  const perf = useApi(() => events.performance({ from: periodQuery.from, to: periodQuery.to }), [periodQuery.from, periodQuery.to], { enabled: tab === 'performance' });
  const perfTotals = useMemo(() => {
    const rows = perf.data ?? [];
    const count = rows.reduce((a, r) => a + r.count, 0);
    const e5 = rows.reduce((a, r) => a + r.errors_5xx, 0);
    const weighted = count > 0 ? rows.reduce((a, r) => a + r.avg_ms * r.count, 0) / count : 0;
    return { count, e5, pct5: count > 0 ? (e5 / count) * 100 : 0, weighted: Math.round(weighted) };
  }, [perf.data]);

  const perfColumns: Column<RoutePerformance & { id: string }>[] = [
    {
      key: 'name',
      title: 'Ruta',
      render: (r) => (
        <span className="row" style={{ gap: 6 }}>
          <span className="code">{r.name}</span>
          {r.avg_ms > 500 ? <Badge tone="warn">lenta</Badge> : null}
        </span>
      ),
    },
    { key: 'count', title: 'Peticiones', num: true, render: (r) => fmt.n(r.count) },
    { key: 'avg_ms', title: 'Promedio', num: true, render: (r) => <span style={r.avg_ms > 500 ? { color: 'var(--warning)', fontWeight: 800 } : undefined}>{fmt.ms(r.avg_ms)}</span> },
    { key: 'max_ms', title: 'Máximo', num: true, render: (r) => fmt.ms(r.max_ms) },
    { key: 'errors_5xx', title: 'Errores 5xx', num: true, render: (r) => (r.errors_5xx > 0 ? <Badge tone="bad">{fmt.n(r.errors_5xx)}</Badge> : <span className="muted">0</span>) },
    { key: 'errors_4xx', title: 'Errores 4xx', num: true, render: (r) => (r.errors_4xx > 0 ? <Badge tone="warn">{fmt.n(r.errors_4xx)}</Badge> : <span className="muted">0</span>) },
  ];

  return (
    <>
      <PageHeader title="Comportamiento" sub="Cada evento que registra la app y la API, para entender qué pasa de verdad." actions={<PeriodPicker period={period} onChange={setPeriod} />} />

      <Tabs value={tab} onChange={(t) => set({ tab: t })} tabs={TABS} />

      {tab === 'explorer' ? (
        <>
          <Card
            title={debounced ? <>Eventos <span className="code">{debounced}*</span> por {period.interval === 'month' ? 'mes' : period.interval === 'week' ? 'semana' : 'día'}</> : 'Todos los eventos en el periodo'}
            hint={series.data ? `${fmt.n(series.data.series.reduce((a, p) => a + p.value, 0))} en el periodo` : undefined}
          >
            {series.data ? <LineChart series={[{ label: series.data.label, points: series.data.series }]} interval={series.data.period.interval} height={180} /> : series.error ? <ErrorBox message={series.error} onRetry={series.reload} /> : <Loading rows={4} />}
          </Card>

          <div className="filters" style={{ marginTop: 16 }}>
            <Field label="Nombre del evento (prefijo)" className="wide">
              <input className="input" placeholder="api.swipes, screen.…" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Categoría">
              <Select value={filters.category} onChange={(v) => set({ category: v })} options={CATEGORIES} placeholder="Todas" />
            </Field>
            <Field label="Plataforma">
              <Select value={filters.platform} onChange={(v) => set({ platform: v })} options={PLATFORMS} placeholder="Todas" />
            </Field>
            <Field label="ID de persona">
              <input className="input mono" placeholder="01J…" value={filters.user_id ?? ''} onChange={(e) => set({ user_id: e.target.value })} />
            </Field>
            <label className="checkbox" style={{ paddingBottom: 8 }}>
              <input type="checkbox" checked={filters.errors === '1'} onChange={(e) => set({ errors: e.target.checked })} /> Sólo errores (status ≥ 400)
            </label>
          </div>

          {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
          <Card flush>
            {list.loading && !list.data ? <div className="loading-bar" /> : null}
            <DataTable columns={eventColumns} rows={list.data?.data ?? []} />
            <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p }, false)} />
          </Card>
        </>
      ) : null}

      {tab === 'ranking' ? (
        <>
          <div className="filters">
            <Field label="Categoría">
              <Select value={filters.category} onChange={(v) => set({ category: v })} options={CATEGORIES} placeholder="Todas" />
            </Field>
            <span className="small muted" style={{ paddingBottom: 8 }}>
              Haz clic en un evento para verlo en el explorador. Se muestran hasta 200 nombres distintos del periodo.
            </span>
          </div>
          {names.error ? <ErrorBox message={names.error} onRetry={names.reload} /> : null}
          <Card flush>
            {names.loading && !names.data ? <div className="loading-bar" /> : null}
            <DataTable columns={rankColumns} rows={rankRows} sort={rankSort} onSort={onRankSort} />
          </Card>
        </>
      ) : null}

      {tab === 'performance' ? (
        <>
          <div className="grid cols-3" style={{ marginBottom: 16 }}>
            <Stat label="Peticiones a la API" value={perf.data ? fmt.n(perfTotals.count) : '—'} foot="en el periodo" />
            <Stat label="Errores 5xx" value={perf.data ? fmt.pct(perfTotals.pct5, 2) : '—'} foot={perf.data ? `${fmt.n(perfTotals.e5)} peticiones fallidas` : undefined} />
            <Stat label="Tiempo de respuesta" value={perf.data ? fmt.ms(perfTotals.weighted) : '—'} foot="promedio ponderado por peticiones" />
          </div>
          {perf.error ? <ErrorBox message={perf.error} onRetry={perf.reload} /> : null}
          <Card flush>
            {perf.loading && !perf.data ? <div className="loading-bar" /> : null}
            <DataTable columns={perfColumns} rows={(perf.data ?? []).map((r) => ({ ...r, id: r.name }))} />
          </Card>
          <p className="small muted" style={{ marginTop: 12 }}>
            Se resaltan como lentas las rutas con promedio mayor a 500 ms. Sólo se consideran eventos de categoría API; se listan hasta 100 rutas ordenadas por volumen.
          </p>
        </>
      ) : null}
    </>
  );
}
