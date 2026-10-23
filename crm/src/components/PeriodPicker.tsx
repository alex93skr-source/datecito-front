import { daysAgo, today, type PeriodState } from '../lib/hooks';

const presets = [
  { label: '7 d', days: 7 },
  { label: '30 d', days: 30 },
  { label: '90 d', days: 90 },
  { label: '12 m', days: 365 },
];

/** Selector de rango de fechas compartido por las pantallas de métricas. */
export function PeriodPicker({ period, onChange, interval = true }: { period: PeriodState; onChange: (p: Partial<PeriodState>) => void; interval?: boolean }) {
  const activeDays = presets.find((p) => period.from === daysAgo(p.days - 1) && period.to === today())?.days;
  return (
    <div className="row">
      <div className="seg" role="group" aria-label="Rango rápido">
        {presets.map((p) => (
          <button key={p.days} className={activeDays === p.days ? 'on' : undefined} onClick={() => onChange({ from: daysAgo(p.days - 1), to: today(), interval: undefined })}>
            {p.label}
          </button>
        ))}
      </div>
      <input className="input" type="date" value={period.from} max={period.to} onChange={(e) => onChange({ from: e.target.value })} style={{ width: 150 }} aria-label="Desde" />
      <span className="muted">→</span>
      <input className="input" type="date" value={period.to} min={period.from} max={today()} onChange={(e) => onChange({ to: e.target.value })} style={{ width: 150 }} aria-label="Hasta" />
      {interval ? (
        <select className="select" value={period.interval ?? ''} onChange={(e) => onChange({ interval: (e.target.value || undefined) as PeriodState['interval'] })} style={{ width: 130 }} aria-label="Granularidad">
          <option value="">Auto</option>
          <option value="day">Por día</option>
          <option value="week">Por semana</option>
          <option value="month">Por mes</option>
        </select>
      ) : null}
    </div>
  );
}
