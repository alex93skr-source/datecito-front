import { useState } from 'react';

import { billing, type Purchase, type Subscription } from '../api';
import { BarList, LineChart } from '../components/charts';
import { PeriodPicker } from '../components/PeriodPicker';
import { Badge, Card, DataTable, ErrorBox, Field, KpiTile, Loading, PageHeader, Pagination, Person, Select, Stat, Tabs, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, useDebounced, useFilters, usePeriod } from '../lib/hooks';

type Tab = 'subscriptions' | 'purchases';

const STORES = ['google_play', 'app_store', 'fake'].map((v) => ({ value: v, label: label(v) }));
const PLANS = ['monthly', 'yearly'].map((v) => ({ value: v, label: label(v) }));
const SUB_STATUS = ['active', 'expired', 'cancelled'].map((v) => ({ value: v, label: v === 'active' ? 'Activa' : v === 'expired' ? 'Vencida' : 'Cancelada' }));
const YES_NO = [
  { value: '1', label: 'Sí' },
  { value: '0', label: 'No' },
];

const PRODUCT_NAMES: Record<string, string> = { monthly: 'Membresía mensual', yearly: 'Membresía anual', super_like_pack: 'Paquete de Super likes' };

function Ref({ value }: { value: string }) {
  return (
    <span className="mono truncate" style={{ display: 'inline-block', maxWidth: 160 }} title={value}>
      {value}
    </span>
  );
}

export default function Billing() {
  const { period, set: setPeriod, query } = usePeriod(30);
  const { filters, set } = useFilters();
  const tab = (filters.tab as Tab | undefined) ?? 'subscriptions';
  const overview = useApi(() => billing.overview(query), [query.from, query.to, query.interval]);

  const [q, setQ] = useState(filters.q ?? '');
  const debounced = useDebounced(q);

  /* Sin useMemo: el filtro se llama `current` y el compilador de React lo confunde con un ref. useApi compara por JSON. */
  const subsQuery = { status: filters.status, plan: filters.plan, store: filters.store, current: filters.current, granted: filters.granted, q: debounced || undefined, page: filters.page };
  const purchasesQuery = { store: filters.store, q: debounced || undefined, page: filters.page };
  const subs = useApi(() => billing.subscriptions(subsQuery), [JSON.stringify(subsQuery)], { enabled: tab === 'subscriptions' });
  const purchases = useApi(() => billing.purchases(purchasesQuery), [JSON.stringify(purchasesQuery)], { enabled: tab === 'purchases' });

  const o = overview.data;
  const conversion = o && o.conversion.users > 0 ? (o.conversion.ever_paid / o.conversion.users) * 100 : null;
  const pricingRows = o ? Object.entries(o.pricing).filter((entry): entry is [string, { product_id: string; price: number; quantity?: number }] => typeof entry[1] === 'object' && entry[1] !== null) : [];

  const subColumns: Column<Subscription>[] = [
    { key: 'user', title: 'Persona', render: (s) => <Person user={s.user ?? null} /> },
    { key: 'plan', title: 'Plan', render: (s) => <Badge value={s.plan} /> },
    { key: 'store', title: 'Tienda', render: (s) => <span className="small">{label(s.store)}</span> },
    { key: 'status', title: 'Estado', render: (s) => <Badge value={s.status} tone={s.status === 'active' ? 'ok' : s.status === 'expired' ? 'warn' : ''}>{s.status === 'active' ? 'Activa' : s.status === 'expired' ? 'Vencida' : 'Cancelada'}</Badge> },
    { key: 'current', title: 'Vigente', render: (s) => (s.current ? <Badge tone="ok">Sí</Badge> : <span className="muted small">No</span>) },
    { key: 'starts_at', title: 'Inicia', render: (s) => <span className="small nowrap">{fmt.date(s.starts_at)}</span> },
    { key: 'expires_at', title: 'Vence', render: (s) => <span className="small nowrap" title={fmt.ago(s.expires_at)}>{fmt.date(s.expires_at)}</span> },
    { key: 'granted', title: 'Cortesía', render: (s) => (s.granted ? <Badge tone="coral">Cortesía</Badge> : <span className="muted small">—</span>) },
    { key: 'store_reference', title: 'Referencia', render: (s) => <Ref value={s.store_reference} /> },
  ];

  const purchaseColumns: Column<Purchase>[] = [
    { key: 'user', title: 'Persona', render: (p) => <Person user={p.user ?? null} /> },
    { key: 'product_id', title: 'Producto', render: (p) => <span className="code">{p.product_id}</span> },
    { key: 'store', title: 'Tienda', render: (p) => <span className="small">{label(p.store)}</span> },
    { key: 'quantity', title: 'Cantidad', num: true, render: (p) => fmt.n(p.quantity) },
    { key: 'created_at', title: 'Fecha', render: (p) => <span className="small nowrap">{fmt.dateTime(p.created_at)}</span> },
    { key: 'store_reference', title: 'Referencia', render: (p) => <Ref value={p.store_reference} /> },
  ];

  return (
    <>
      <PageHeader title="Monetización" sub="Membresías, paquetes de Super likes e ingresos estimados." actions={<PeriodPicker period={period} onChange={setPeriod} />} />

      {overview.error ? <ErrorBox message={overview.error} onRetry={overview.reload} /> : null}

      {o?.launch_free ? (
        <div className="row" style={{ marginBottom: 14 }}>
          <Badge tone="coral">Lanzamiento gratuito activo</Badge>
          <span className="small muted">La app no exige membresía por ahora; las suscripciones que veas aquí son voluntarias o cortesías.</span>
        </div>
      ) : null}

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="MRR" value={o ? fmt.money(o.mrr) : '—'} foot="ingreso mensual recurrente estimado" />
        <KpiTile label="Ingresos del periodo" kpi={o?.revenue} format={fmt.money} />
        <Stat label="Miembros activos" value={o ? fmt.n(o.members.total) : '—'} foot={o ? `${fmt.n(o.members.monthly)} mensual · ${fmt.n(o.members.yearly)} anual` : undefined} />
        <Stat label="Conversión a pago" value={conversion === null ? '—' : fmt.pct(conversion, 1)} foot={o ? `${fmt.n(o.conversion.ever_paid)} de ${fmt.n(o.conversion.users)} personas han pagado alguna vez` : undefined} />
      </div>
      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <KpiTile label="Suscripciones nuevas" kpi={o?.subscriptions_new} />
        <KpiTile label="Paquetes de Super likes" kpi={o?.purchases_new} />
        <Stat label="Vencidas" value={o ? fmt.n(o.expired) : '—'} foot="en el periodo" />
        <Stat label="Canceladas" value={o ? fmt.n(o.cancelled) : '—'} foot="en el periodo" />
      </div>

      <div className="grid sidebar-right" style={{ marginBottom: 16 }}>
        <Card title="Ingresos" hint={o ? `${o.currency} · estimados con la lista de precios vigente` : undefined}>
          {o ? <LineChart series={[{ label: 'Ingresos', points: o.revenue_series }]} interval={o.period.interval} format={fmt.money} yFormat={(v) => fmt.compact(v)} /> : overview.error ? null : <Loading rows={5} />}
        </Card>
        <div className="stack">
          <Card title="Por plan">{o ? <BarList slices={o.by_plan} labelFn={(l) => label(l)} /> : <Loading rows={2} />}</Card>
          <Card title="Por tienda">{o ? <BarList slices={o.by_store} labelFn={(l) => label(l)} colorize /> : <Loading rows={3} />}</Card>
        </div>
      </div>

      <Card title="Precios vigentes" hint="Se configuran en el backend; aquí sólo se consultan." flush>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="num">Precio</th>
                <th>product_id</th>
              </tr>
            </thead>
            <tbody>
              {pricingRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="muted">
                    {o ? 'Sin precios configurados' : 'Cargando…'}
                  </td>
                </tr>
              ) : (
                pricingRows.map(([key, p]) => (
                  <tr key={key}>
                    <td>
                      {PRODUCT_NAMES[key] ?? label(key)}
                      {p.quantity ? <span className="muted small"> · {p.quantity} Super likes</span> : null}
                    </td>
                    <td className="num">{fmt.money(p.price)}</td>
                    <td>
                      <span className="code">{p.product_id}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ marginTop: 22 }}>
        <Tabs
          value={tab}
          onChange={(t) => {
            setQ('');
            set({ tab: t, status: null, plan: null, store: null, current: null, granted: null, q: null });
          }}
          tabs={[
            { value: 'subscriptions', label: 'Suscripciones' },
            { value: 'purchases', label: 'Compras' },
          ]}
        />

        <div className="filters">
          <Field label="Buscar persona" className="wide">
            <input className="input" placeholder="Nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} />
          </Field>
          {tab === 'subscriptions' ? (
            <>
              <Field label="Estado">
                <Select value={filters.status} onChange={(v) => set({ status: v })} options={SUB_STATUS} />
              </Field>
              <Field label="Plan">
                <Select value={filters.plan} onChange={(v) => set({ plan: v })} options={PLANS} />
              </Field>
            </>
          ) : null}
          <Field label="Tienda">
            <Select value={filters.store} onChange={(v) => set({ store: v })} options={STORES} placeholder="Todas" />
          </Field>
          {tab === 'subscriptions' ? (
            <>
              <Field label="Vigente" className="narrow">
                <Select value={filters.current} onChange={(v) => set({ current: v })} options={YES_NO} placeholder="Todas" />
              </Field>
              <Field label="Cortesía" className="narrow">
                <Select value={filters.granted} onChange={(v) => set({ granted: v })} options={YES_NO} placeholder="Todas" />
              </Field>
            </>
          ) : null}
        </div>

        {tab === 'subscriptions' ? (
          <>
            {subs.error ? <ErrorBox message={subs.error} onRetry={subs.reload} /> : null}
            <Card flush>
              {subs.loading && !subs.data ? <div className="loading-bar" /> : null}
              <DataTable columns={subColumns} rows={subs.data?.data ?? []} />
              <Pagination meta={subs.data?.meta} onPage={(p) => set({ page: p }, false)} />
            </Card>
          </>
        ) : (
          <>
            {purchases.error ? <ErrorBox message={purchases.error} onRetry={purchases.reload} /> : null}
            <Card flush>
              {purchases.loading && !purchases.data ? <div className="loading-bar" /> : null}
              <DataTable columns={purchaseColumns} rows={purchases.data?.data ?? []} />
              <Pagination meta={purchases.data?.meta} onPage={(p) => set({ page: p }, false)} />
            </Card>
          </>
        )}
      </div>
    </>
  );
}
