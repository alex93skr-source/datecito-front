import { Fragment, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import type { Point, Slice } from '../api/types';
import { fmt } from '../lib/format';

/**
 * Gráficas SVG propias (sin dependencias), siguiendo el método dataviz:
 * marcas finas, líneas de 2px, cuadrícula recesiva, tooltip al pasar el cursor,
 * paleta categórica en orden fijo (--s1…--s8) y una sola escala por gráfica.
 */

export const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)'];

const nice = (max: number) => {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
};

export type LineSeries = { label: string; points: Point[]; color?: string };

/**
 * Líneas (una o varias series sobre el mismo eje) con crosshair y tooltip.
 */
export function LineChart({ series, height = 220, interval = 'day', format = fmt.n, area = true, yFormat }: { series: LineSeries[]; height?: number; interval?: 'day' | 'week' | 'month'; format?: (v: number) => string; area?: boolean; yFormat?: (v: number) => string }) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const pad = { top: 12, right: 16, bottom: 26, left: 44 };
  const dates = series[0]?.points.map((p) => p.date) ?? [];
  const n = dates.length;
  const maxRaw = Math.max(0, ...series.flatMap((s) => s.points.map((p) => p.value)));
  const yMax = nice(maxRaw * 1.08);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / yMax) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const labelEvery = Math.max(1, Math.ceil(n / 8));
  const showLabel = (i: number) => i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= labelEvery / 2);
  const yf = yFormat ?? fmt.compact;

  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = s.points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`);
        const line = pts.length ? `M${pts.join('L')}` : '';
        const fill = pts.length ? `${line}L${x(pts.length - 1).toFixed(1)},${y(0).toFixed(1)}L${x(0).toFixed(1)},${y(0).toFixed(1)}Z` : '';
        return { line, fill };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, yMax, n],
  );

  if (n === 0) return <div className="empty">Sin datos en este periodo</div>;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const i = Math.round(((px - pad.left) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const tipLeft = hover === null || !wrap.current ? 0 : (x(hover) / width) * 100;

  return (
    <div className="chart" ref={wrap}>
      <svg viewBox={`0 0 ${width} ${height}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label={series.map((s) => s.label).join(', ')}>
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`${id}-g${si}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? SERIES[si]} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color ?? SERIES[si]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line className={t === 0 ? 'baseline' : 'gridline'} x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} />
            <text className="axis" x={pad.left - 8} y={y(t) + 3.5} textAnchor="end">
              {yf(t)}
            </text>
          </g>
        ))}
        {dates.map((d, i) =>
          showLabel(i) ? (
            <text key={d} className="axis" x={x(i)} y={height - 8} textAnchor={i === n - 1 ? 'end' : i === 0 ? 'start' : 'middle'}>
              {fmt.bucket(d, interval)}
            </text>
          ) : null,
        )}
        {series.map((s, si) => (
          <g key={si}>
            {area && series.length === 1 ? <path d={paths[si].fill} fill={`url(#${id}-g${si})`} /> : null}
            <path d={paths[si].line} fill="none" stroke={s.color ?? SERIES[si]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {hover !== null && s.points[hover] ? <circle cx={x(hover)} cy={y(s.points[hover].value)} r="4.5" fill={s.color ?? SERIES[si]} stroke="var(--surface)" strokeWidth="2" /> : null}
          </g>
        ))}
        {hover !== null ? <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + innerH} stroke="var(--border-strong)" strokeWidth="1" /> : null}
      </svg>
      {hover !== null ? (
        <div className="chart-tip" style={{ left: `${tipLeft}%`, top: `${(pad.top / height) * 100}%` }}>
          <b>{fmt.bucket(dates[hover], interval)}</b>
          {series.map((s, si) => (
            <div key={si} className="tip-row">
              <span className="dot" style={{ background: s.color ?? SERIES[si] }} />
              {series.length > 1 ? `${s.label}: ` : ''}
              <b>{format(s.points[hover]?.value ?? 0)}</b>
            </div>
          ))}
        </div>
      ) : null}
      {series.length > 1 ? (
        <div className="legend">
          {series.map((s, si) => (
            <span key={si}>
              <span className="dot" style={{ background: s.color ?? SERIES[si] }} /> {s.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Columnas verticales (una serie) con tooltip. */
export function ColumnChart({ points, height = 180, interval = 'day', format = fmt.n, color = SERIES[0] }: { points: Point[]; height?: number; interval?: 'day' | 'week' | 'month'; format?: (v: number) => string; color?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const pad = { top: 10, right: 8, bottom: 24, left: 40 };
  const n = points.length;
  if (n === 0) return <div className="empty">Sin datos en este periodo</div>;
  const yMax = nice(Math.max(0, ...points.map((p) => p.value)) * 1.08);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const slot = innerW / n;
  const bw = Math.min(24, slot * 0.7);
  const y = (v: number) => pad.top + innerH - (v / yMax) * innerH;
  const labelEvery = Math.max(1, Math.ceil(n / 8));
  const showLabel = (i: number) => i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= labelEvery / 2);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} onMouseLeave={() => setHover(null)} role="img">
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line className={t === 0 ? 'baseline' : 'gridline'} x1={pad.left} x2={width - pad.right} y1={y(t * yMax)} y2={y(t * yMax)} />
            <text className="axis" x={pad.left - 8} y={y(t * yMax) + 3.5} textAnchor="end">
              {fmt.compact(t * yMax)}
            </text>
          </g>
        ))}
        {points.map((p, i) => {
          const cx = pad.left + slot * i + slot / 2;
          const h = Math.max(0, y(0) - y(p.value));
          return (
            <g key={p.date} onMouseEnter={() => setHover(i)}>
              <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill="transparent" />
              <path d={`M${cx - bw / 2},${y(0)} v${-Math.max(0, h - 4)} a4,4 0 0 1 4,-4 h${bw - 8} a4,4 0 0 1 4,4 v${Math.max(0, h - 4)} z`} fill={color} opacity={hover === null || hover === i ? 1 : 0.55} />
              {showLabel(i) ? (
                <text className="axis" x={cx} y={height - 8} textAnchor="middle">
                  {fmt.bucket(p.date, interval)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {hover !== null ? (
        <div className="chart-tip" style={{ left: `${((pad.left + slot * hover + slot / 2) / width) * 100}%`, top: `${(pad.top / height) * 100}%` }}>
          <b>{fmt.bucket(points[hover].date, interval)}</b>
          <div>{format(points[hover].value)}</div>
        </div>
      ) : null}
    </div>
  );
}

/** Distribución como barras horizontales (preferible a pastel). */
export function BarList({ slices, format = fmt.n, color = SERIES[0], colorize = false, max: maxProp, labelFn, total: totalProp, limit }: { slices: Slice[]; format?: (v: number) => string; color?: string; colorize?: boolean; max?: number; labelFn?: (label: string) => ReactNode; total?: number; limit?: number }) {
  const rows = limit ? slices.slice(0, limit) : slices;
  if (rows.length === 0) return <div className="empty">Sin datos</div>;
  const max = maxProp ?? Math.max(...rows.map((s) => s.value), 1);
  const total = totalProp ?? rows.reduce((a, s) => a + s.value, 0);
  return (
    <div className="bars">
      {rows.map((s, i) => (
        <div key={s.label} className="bar-row" title={`${s.label}: ${format(s.value)}`}>
          <span className="truncate">{labelFn ? labelFn(s.label) : s.label}</span>
          <div className="track">
            <div className="fill" style={{ width: `${(s.value / max) * 100}%`, background: colorize ? SERIES[i % SERIES.length] : color }} />
          </div>
          <span className="val">
            {format(s.value)} {total > 0 ? <small>{Math.round((s.value / total) * 100)}%</small> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Funnel({ steps }: { steps: { key: string; label: string; count: number; pct_of_total: number; pct_of_previous: number }[] }) {
  const max = steps[0]?.count || 1;
  return (
    <div className="funnel">
      {steps.map((s, i) => (
        <div key={s.key} className="funnel-step">
          <span className="n">{i + 1}</span>
          <span>{s.label}</span>
          <div className="track">
            <div className="fill" style={{ width: `${(s.count / max) * 100}%`, background: SERIES[0], opacity: 1 - i * 0.05 }} />
          </div>
          <div className="pcts">
            <b>{fmt.n(s.count)}</b> · {fmt.pct(s.pct_of_total, 0)}
            {i > 0 ? <small>{fmt.pct(s.pct_of_previous, 0)} del paso anterior</small> : <small>cohorte</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

const DOWS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Mapa de calor día de la semana × hora (escala secuencial de un solo tono). */
export function Heatmap({ cells }: { cells: { dow: number; hour: number; value: number }[] }) {
  const map = new Map(cells.map((c) => [`${c.dow}-${c.hour}`, c.value]));
  const max = Math.max(1, ...cells.map((c) => c.value));
  const step = (v: number) => (v === 0 ? 'var(--seq-1)' : v < max * 0.25 ? 'var(--seq-2)' : v < max * 0.5 ? 'var(--seq-3)' : v < max * 0.75 ? 'var(--seq-4)' : 'var(--seq-5)');
  return (
    <div className="heatmap" role="img" aria-label="Actividad por día y hora">
      <span />
      {Array.from({ length: 24 }).map((_, h) => (
        <span key={h} style={{ textAlign: 'center' }}>
          {h % 3 === 0 ? h : ''}
        </span>
      ))}
      {DOWS.map((d, dow) => (
        <Fragment key={dow}>
          <span>{d}</span>
          {Array.from({ length: 24 }).map((_, h) => {
            const v = map.get(`${dow}-${h}`) ?? 0;
            return <span key={h} className="cell" style={{ background: step(v) }} title={`${d} ${h}:00 — ${fmt.n(v)} eventos`} />;
          })}
        </Fragment>
      ))}
    </div>
  );
}

export function CohortTable({ cohorts, weeks }: { cohorts: { cohort: string; size: number; retention: (number | null)[] }[]; weeks: number }) {
  const shade = (v: number) => (v >= 60 ? 'var(--seq-5)' : v >= 40 ? 'var(--seq-4)' : v >= 20 ? 'var(--seq-3)' : v > 0 ? 'var(--seq-2)' : 'var(--seq-1)');
  const ink = (v: number) => (v >= 40 ? '#fff' : 'var(--text)');
  return (
    <div className="table-wrap">
      <table className="cohort">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Semana de registro</th>
            <th>Personas</th>
            {Array.from({ length: weeks }).map((_, i) => (
              <th key={i}>S{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c) => (
            <tr key={c.cohort}>
              <td className="head">{fmt.dateShort(`${c.cohort}T12:00:00`)}</td>
              <td className="num">{fmt.n(c.size)}</td>
              {c.retention.map((v, i) => (
                <td key={i} style={v === null ? { color: 'var(--muted)' } : { background: shade(v), color: ink(v) }}>
                  {v === null ? '' : `${Math.round(v)}%`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Sparkline({ points, width = 110, height = 28, color = SERIES[0] }: { points: { value: number }[]; width?: number; height?: number; color?: string }) {
  if (points.length < 2) return <span className="muted small">—</span>;
  const max = Math.max(1, ...points.map((p) => p.value));
  const d = points.map((p, i) => `${((i / (points.length - 1)) * width).toFixed(1)},${(height - 2 - (p.value / max) * (height - 4)).toFixed(1)}`).join('L');
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={`M${d}`} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
