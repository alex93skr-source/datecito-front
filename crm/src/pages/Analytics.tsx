import { useState, type ReactNode } from 'react';

import { dashboard, type Slice } from '../api';
import { BarList, CohortTable, Funnel, Heatmap } from '../components/charts';
import { PeriodPicker } from '../components/PeriodPicker';
import { Badge, Card, DataTable, ErrorBox, Loading, PageHeader, Segmented, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi, usePeriod } from '../lib/hooks';

type Block = { key: string; title: string; hint?: string; labeled?: boolean };

const WHO: Block[] = [
  { key: 'gender', title: 'Género' },
  { key: 'age', title: 'Edad' },
  { key: 'zone', title: 'Zona' },
  { key: 'intent', title: 'Qué buscan' },
  { key: 'relationship_type', title: 'Tipo de relación' },
  { key: 'status', title: 'Estado de la cuenta', labeled: true },
  { key: 'verification', title: 'Verificación', labeled: true },
  { key: 'platform', title: 'Plataforma', labeled: true },
  { key: 'membership', title: 'Membresía', labeled: true },
  { key: 'photos', title: 'Fotos por perfil' },
];

const WHAT: Block[] = [
  { key: 'swipe_types', title: 'Tipos de swipe', labeled: true },
  { key: 'connection_sources', title: 'Origen de las conexiones', labeled: true },
  { key: 'datecito_kinds', title: 'Tipos de datecito', labeled: true },
  { key: 'datecito_status', title: 'Estado de los datecitos', labeled: true },
  { key: 'datecito_zones', title: 'Zonas de los datecitos' },
  { key: 'report_reasons', title: 'Razones de reporte' },
  { key: 'report_status', title: 'Estado de los reportes', labeled: true },
  { key: 'event_platforms', title: 'Plataforma de los eventos', labeled: true },
  { key: 'app_versions', title: 'Versiones de la app' },
];

type TopEvent = { name: string; category: string; count: number; users: number };

const WEEK_OPTIONS = [
  { value: '4', label: '4 semanas' },
  { value: '8', label: '8 semanas' },
  { value: '12', label: '12 semanas' },
];

function Distribution({ block, slices }: { block: Block; slices: Slice[] | undefined }) {
  return (
    <Card title={block.title} hint={block.hint}>
      {slices ? <BarList slices={slices} limit={10} labelFn={block.labeled ? (l) => label(l) : undefined} /> : <Loading rows={4} />}
    </Card>
  );
}

function Section({ title, sub, children }: { title: string; sub?: ReactNode; children: ReactNode }) {
  return (
    <>
      <div className="section-title">
        <h2>{title}</h2>
        {sub ? <span className="small muted">{sub}</span> : null}
      </div>
      {children}
    </>
  );
}

export default function Analytics() {
  const { period, set, query } = usePeriod(30);
  const [weeks, setWeeks] = useState('8');
  const funnel = useApi(() => dashboard.funnel(query), [query.from, query.to]);
  const retention = useApi(() => dashboard.retention(Number(weeks)), [weeks]);
  const breakdowns = useApi(() => dashboard.breakdowns(query), [query.from, query.to]);

  const b = breakdowns.data;

  const topColumns: Column<TopEvent & { id: string }>[] = [
    { key: 'name', title: 'Evento', render: (e) => <span className="code">{e.name}</span> },
    { key: 'category', title: 'Categoría', render: (e) => <Badge value={e.category} /> },
    { key: 'count', title: 'Veces', num: true, render: (e) => fmt.n(e.count) },
    { key: 'users', title: 'Personas distintas', num: true, render: (e) => fmt.n(e.users) },
    { key: 'per_user', title: 'Por persona', num: true, render: (e) => (e.users > 0 ? (e.count / e.users).toFixed(1) : '—') },
  ];

  return (
    <>
      <PageHeader title="Analítica" sub="Quiénes usan Datecito, qué hacen y cuándo lo hacen." actions={<PeriodPicker period={period} onChange={set} interval={false} />} />

      <Section title="Embudo de activación" sub="La cohorte son las personas que se registraron en el periodo; cada paso cuenta cuántas de ellas llegaron hasta ahí.">
        <Card>
          {funnel.data ? <Funnel steps={funnel.data.steps} /> : funnel.error ? <ErrorBox message={funnel.error} onRetry={funnel.reload} /> : <Loading rows={6} />}
        </Card>
      </Section>

      <Section title="Retención semanal" sub="Porcentaje de cada cohorte (semana de registro) con actividad en la semana N después de registrarse. S0 es la semana del registro.">
        <Card actions={<Segmented value={weeks} onChange={setWeeks} options={WEEK_OPTIONS} />} title="Cohortes por semana de registro">
          {retention.data ? <CohortTable cohorts={retention.data.cohorts} weeks={retention.data.weeks} /> : retention.error ? <ErrorBox message={retention.error} onRetry={retention.reload} /> : <Loading rows={6} />}
        </Card>
      </Section>

      {breakdowns.error ? <ErrorBox message={breakdowns.error} onRetry={breakdowns.reload} /> : null}

      <Section title="Quiénes son" sub="Distribución de las personas registradas en el periodo.">
        <div className="grid cols-3">
          {WHO.map((block) => (
            <Distribution key={block.key} block={block} slices={b?.users[block.key]} />
          ))}
        </div>
      </Section>

      <Section title="Qué hacen" sub="Actividad registrada en el periodo.">
        <div className="grid cols-3">
          {WHAT.map((block) => (
            <Distribution key={block.key} block={block} slices={b?.behavior[block.key]} />
          ))}
        </div>
      </Section>

      <Section title="Cuándo usan la app" sub="Eventos por día de la semana y hora (hora local del servidor). Más oscuro = más actividad.">
        <Card>{b ? <Heatmap cells={b.behavior.heatmap} /> : <Loading rows={5} />}</Card>
      </Section>

      <Section title="Eventos más frecuentes" sub="Los eventos que más se registran en el periodo y cuántas personas distintas los generan.">
        <Card flush>
          {b ? <DataTable columns={topColumns} rows={b.behavior.top_events.map((e) => ({ ...e, id: e.name }))} /> : <div style={{ padding: 18 }}><Loading rows={6} /></div>}
        </Card>
      </Section>
    </>
  );
}
