import { useState } from 'react';
import { Link } from 'react-router-dom';

import { dashboard } from '../api';
import { LineChart, BarList } from '../components/charts';
import { PeriodPicker } from '../components/PeriodPicker';
import { Badge, Card, ErrorBox, KpiTile, Loading, PageHeader, Person, Stat } from '../components/ui';
import { fmt, label, metricLabels } from '../lib/format';
import { useApi, usePeriod } from '../lib/hooks';

const MAIN_METRICS = ['signups', 'active_users', 'swipes', 'matches', 'messages', 'datecitos_confirmed', 'revenue'] as const;

export default function Dashboard() {
  const { period, set, query } = usePeriod(30);
  const overview = useApi(() => dashboard.overview(query), [query.from, query.to, query.interval]);
  const [metric, setMetric] = useState<(typeof MAIN_METRICS)[number]>('signups');
  const series = useApi(() => dashboard.series({ ...query, metric }), [query.from, query.to, query.interval, metric]);
  const compare = useApi(() => dashboard.multiSeries({ ...query, metrics: ['likes', 'matches', 'messages'] }), [query.from, query.to, query.interval]);
  const live = useApi(() => dashboard.live(), [], { refreshMs: 20000 });

  const o = overview.data;
  const k = o?.kpis ?? {};

  return (
    <>
      <PageHeader title="Resumen" sub="Cómo va Datecito: crecimiento, actividad, conexiones e ingresos." actions={<PeriodPicker period={period} onChange={set} />} />

      {overview.error ? <ErrorBox message={overview.error} onRetry={overview.reload} /> : null}

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <KpiTile label="Registros" kpi={k.signups} foot={o ? `${fmt.n(o.totals.users)} personas en total` : undefined} />
        <KpiTile label="Personas activas" kpi={k.active_users} foot={o ? `DAU ${fmt.n(o.activity.dau)} · WAU ${fmt.n(o.activity.wau)} · MAU ${fmt.n(o.activity.mau)}` : undefined} />
        <KpiTile label="Matches" kpi={k.matches} foot={o ? `${fmt.n(o.totals.connections_active)} conexiones activas` : undefined} />
        <KpiTile label="Ingresos (USD)" kpi={k.revenue} format={fmt.money} foot={o ? `${fmt.n(o.totals.members)} miembros con membresía` : undefined} />
      </div>
      <div className="grid cols-6" style={{ marginBottom: 20 }}>
        <KpiTile label="Swipes" kpi={k.swipes} />
        <KpiTile label="Likes" kpi={k.likes} />
        <KpiTile label="Mensajes" kpi={k.messages} />
        <KpiTile label="Datecitos propuestos" kpi={k.datecitos} />
        <KpiTile label="Datecitos confirmados" kpi={k.datecitos_confirmed} />
        <KpiTile label="Reportes" kpi={k.reports} bad />
      </div>

      <div className="grid sidebar-right" style={{ marginBottom: 16 }}>
        <Card
          title={metricLabels[metric]}
          hint={series.data ? `${fmt.n(series.data.series.reduce((a, p) => a + p.value, 0))} en el periodo` : undefined}
          actions={
            <select className="select" value={metric} onChange={(e) => setMetric(e.target.value as typeof metric)} style={{ width: 200 }}>
              {MAIN_METRICS.map((m) => (
                <option key={m} value={m}>
                  {metricLabels[m]}
                </option>
              ))}
            </select>
          }
        >
          {series.data ? (
            <LineChart series={[{ label: series.data.label, points: series.data.series }]} interval={series.data.period.interval} format={metric === 'revenue' ? fmt.money : fmt.n} />
          ) : series.error ? (
            <ErrorBox message={series.error} onRetry={series.reload} />
          ) : (
            <Loading rows={5} />
          )}
        </Card>

        <Card title="Ahora mismo" hint={live.data ? `actualizado ${fmt.time(live.data.at)}` : undefined}>
          {live.data ? (
            <div className="stack" style={{ gap: 10 }}>
              <div className="grid cols-2" style={{ gap: 8 }}>
                <Stat compact label="En línea (15 min)" value={fmt.n(live.data.online_15m)} />
                <Stat compact label="Eventos / min" value={live.data.events_per_minute} />
                <Stat compact label="Aquí y ahora" value={fmt.n(live.data.here_live)} foot="sesiones vivas" />
                <Stat compact label="Errores 15 min" value={fmt.n(live.data.errors_15m)} />
              </div>
              <div className="small">
                <div className="row spread">
                  <span className="muted">Hoy</span>
                </div>
                <div className="row" style={{ gap: 14, marginTop: 4 }}>
                  <span>
                    <b>{fmt.n(live.data.today.signups)}</b> registros
                  </span>
                  <span>
                    <b>{fmt.n(live.data.today.swipes)}</b> swipes
                  </span>
                  <span>
                    <b>{fmt.n(live.data.today.matches)}</b> matches
                  </span>
                  <span>
                    <b>{fmt.n(live.data.today.messages)}</b> mensajes
                  </span>
                  <span>
                    <b>{fmt.money(live.data.today.revenue)}</b>
                  </span>
                </div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Link to="/moderacion/reportes" className="badge coral">
                  {live.data.reports_open} reportes abiertos
                </Link>
                <Link to="/moderacion/verificaciones" className="badge warn">
                  {live.data.verifications_pending} verificaciones
                </Link>
                {live.data.safe_sessions.help + live.data.safe_sessions.overdue > 0 ? (
                  <Link to="/seguridad" className="badge bad">
                    {live.data.safe_sessions.help + live.data.safe_sessions.overdue} alertas de seguridad
                  </Link>
                ) : null}
              </div>
              <div>
                <div className="small muted" style={{ marginBottom: 4 }}>
                  Últimos eventos
                </div>
                <ul className="timeline">
                  {live.data.recent_events.slice(0, 8).map((e) => (
                    <li key={e.id} style={{ gridTemplateColumns: '54px 1fr' }}>
                      <span className="when">{fmt.time(e.occurred_at)}</span>
                      <span className="truncate">
                        <span className="code">{e.name}</span> {e.user ? <Link to={`/usuarios/${e.user.id}`}>{e.user.name ?? 'alguien'}</Link> : <span className="muted">anónimo</span>}
                        {e.platform ? <span className="muted"> · {label(e.platform)}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : live.error ? (
            <ErrorBox message={live.error} onRetry={live.reload} />
          ) : (
            <Loading />
          )}
        </Card>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <Card title="Del like al mensaje" hint="Likes, matches y mensajes en el mismo eje">
          {compare.data ? (
            <LineChart series={Object.values(compare.data).map((s) => ({ label: s.label, points: s.series }))} interval={Object.values(compare.data)[0]?.period.interval} area={false} />
          ) : compare.error ? (
            <ErrorBox message={compare.error} onRetry={compare.reload} />
          ) : (
            <Loading rows={5} />
          )}
        </Card>
        <Card title="Tasas clave del periodo" hint="Qué tan bien convierte cada paso">
          {o ? (
            <BarList
              max={100}
              format={(v) => fmt.pct(v, 0)}
              total={0}
              slices={[
                { label: 'Correo verificado tras registrarse', value: o.rates.email_verification },
                { label: 'Likes sobre swipes', value: o.rates.like_rate },
                { label: 'Likes que terminan en match', value: o.rates.match_per_like },
                { label: 'Matches con conversación', value: o.rates.conversation_rate },
                { label: 'Datecitos por match', value: o.rates.datecito_per_match },
                { label: 'Datecitos confirmados', value: o.rates.datecito_confirmation },
              ]}
            />
          ) : (
            <Loading rows={6} />
          )}
        </Card>
      </div>

      <div className="grid cols-4">
        <KpiTile label="Correos verificados" kpi={k.email_verified} />
        <KpiTile label="Suscripciones nuevas" kpi={k.subscriptions} />
        <KpiTile label="Paquetes de Super likes" kpi={k.purchases} />
        <KpiTile label="Cuentas eliminadas" kpi={k.deletions} bad />
        <KpiTile label="Eventos registrados" kpi={k.events} format={fmt.compact} />
        <KpiTile label="Errores de API (5xx)" kpi={k.errors} bad />
        <Stat label="Perfiles verificados" value={o ? fmt.n(o.totals.profile_verified) : '—'} foot={o ? `${fmt.pct((o.totals.profile_verified / Math.max(1, o.totals.users)) * 100, 0)} del total` : undefined} />
        <Stat label="Cuentas suspendidas o baneadas" value={o ? fmt.n(o.totals.users - o.totals.users_active_status) : '—'} foot={o ? <Badge value="suspended" /> : undefined} />
      </div>
      <p className="small muted" style={{ marginTop: 14 }}>
        Las comparaciones son contra el periodo inmediatamente anterior de la misma duración. Los ingresos se estiman con la lista de precios vigente. <Person user={null} link={false} /> significa que la cuenta ya fue eliminada.
      </p>
    </>
  );
}
