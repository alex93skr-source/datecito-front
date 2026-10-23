import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { Kpi, Paginated, UserMini } from '../api/types';
import { fmt, label } from '../lib/format';

/* ---------- Contenedores ---------- */

export function Card({ title, hint, actions, children, className = '', flush = false }: { title?: ReactNode; hint?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <section className={`card${flush ? ' flush' : ''} ${className}`}>
      {title || actions ? (
        <div className="card-head" style={flush ? { padding: '14px 16px 0' } : undefined}>
          <div>
            {title ? <h2>{title}</h2> : null}
            {hint ? <div className="hint">{hint}</div> : null}
          </div>
          {actions ? <div className="row">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {sub ? <div className="sub">{sub}</div> : null}
      </div>
      {actions ? <div className="actions">{actions}</div> : null}
    </div>
  );
}

export function Empty({ title = 'Nada por aquí', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {children}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-box row spread">
      <span>{message}</span>
      {onRetry ? (
        <button className="btn sm" onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

export function Loading({ rows = 4 }: { rows?: number }) {
  return (
    <div className="stack" style={{ gap: 10 }} aria-busy>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

/* ---------- Números ---------- */

/** Tile de KPI con comparación contra el periodo anterior. `bad` invierte el color (menos es mejor). */
export function KpiTile({ label: text, kpi, format = fmt.n, foot, bad = false, hero = false }: { label: string; kpi: Kpi | number | null | undefined; format?: (v: number) => string; foot?: ReactNode; bad?: boolean; hero?: boolean }) {
  const value = typeof kpi === 'number' ? kpi : kpi?.value;
  const change = typeof kpi === 'object' && kpi ? kpi.change_pct : null;
  const dir = change === null || change === undefined ? 'flat' : change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  return (
    <div className={`tile${hero ? ' hero' : ''}`}>
      <div className="label">{text}</div>
      <div className="value">{value === null || value === undefined ? '—' : format(value)}</div>
      {typeof kpi === 'object' && kpi ? (
        <div className={`delta ${dir}${bad ? ' bad' : ''}`} title={`Periodo anterior: ${format(kpi.previous)}`}>
          {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '•'} {change === null || change === undefined ? 'nuevo' : fmt.pct(Math.abs(change))}
          <span className="muted" style={{ fontWeight: 600 }}> vs {format(kpi.previous)}</span>
        </div>
      ) : null}
      {foot ? <div className="foot">{foot}</div> : null}
    </div>
  );
}

export function Stat({ label: text, value, foot, compact = false }: { label: string; value: ReactNode; foot?: ReactNode; compact?: boolean }) {
  return (
    <div className={`tile${compact ? ' compact' : ''}`}>
      <div className="label">{text}</div>
      <div className="value">{value}</div>
      {foot ? <div className="foot">{foot}</div> : null}
    </div>
  );
}

/* ---------- Badges ---------- */

const tones: Record<string, string> = {
  active: 'ok', approved: 'ok', confirmed: 'ok', resolved: 'ok', ended: '', verified: 'ok',
  paused: 'warn', pending: 'warn', reviewing: 'warn', proposed: 'info', overdue: 'warn', expired: '',
  suspended: 'bad', banned: 'bad', rejected: 'bad', cancelled: '', dismissed: '', help: 'bad',
  open: 'coral', admin: 'dark', moderator: 'info', ios: '', android: '', web: '',
  monthly: 'info', yearly: 'coral', like: 'ok', super: 'coral', pass: '',
};

export function Badge({ value, tone, children }: { value?: string | null; tone?: string; children?: ReactNode }) {
  const t = tone ?? (value ? (tones[value] ?? '') : '');
  return <span className={`badge ${t}`}>{children ?? label(value)}</span>;
}

/* ---------- Personas ---------- */

export function initials(name: string | null | undefined, email?: string | null) {
  const base = (name ?? email ?? '?').trim();
  return base.slice(0, 1).toUpperCase() || '?';
}

export function Person({ user, sub, photo, link = true }: { user: UserMini | { id: string; name: string | null; email?: string | null; status?: string | null } | null | undefined; sub?: ReactNode; photo?: string | null; link?: boolean }) {
  if (!user) return <span className="muted">Cuenta eliminada</span>;
  const body = (
    <>
      <span className="avatar">{photo ? <img src={photo} alt="" /> : initials(user.name, user.email)}</span>
      <span style={{ minWidth: 0 }}>
        <span className="name truncate">{user.name ?? 'Sin nombre'}</span>
        <span className="sub truncate">{sub ?? user.email ?? user.id}</span>
      </span>
    </>
  );
  return <span className="person">{link ? <Link to={`/usuarios/${user.id}`} className="person">{body}</Link> : body}</span>;
}

/* ---------- Tabla y paginación ---------- */

export type Column<T> = { key: string; title: ReactNode; render: (row: T) => ReactNode; num?: boolean; sortable?: boolean; width?: number | string };

export function DataTable<T extends { id: string | number }>({ columns, rows, onRowClick, sort, onSort, empty }: { columns: Column<T>[]; rows: T[]; onRowClick?: (row: T) => void; sort?: { key: string; dir: 'asc' | 'desc' }; onSort?: (key: string) => void; empty?: ReactNode }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`${c.num ? 'num ' : ''}${c.sortable ? 'sortable' : ''}`} style={{ width: c.width }} onClick={c.sortable && onSort ? () => onSort(c.key) : undefined} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.title}
                {sort?.key === c.key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{empty ?? <Empty />}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className={onRowClick ? 'clickable' : undefined} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {columns.map((c) => (
                  <td key={c.key} className={c.num ? 'num' : undefined}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ meta, onPage }: { meta: Paginated<unknown>['meta'] | undefined; onPage: (page: number) => void }) {
  if (!meta || meta.last_page <= 1) {
    return meta ? <div className="pagination"><span>{fmt.n(meta.total)} en total</span></div> : null;
  }
  const { current_page: page, last_page: last } = meta;
  return (
    <div className="pagination">
      <span>
        {meta.from}–{meta.to} de {fmt.n(meta.total)}
      </span>
      <div className="pages">
        <button className="btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ← Anterior
        </button>
        <span style={{ alignSelf: 'center', padding: '0 6px' }}>
          {page} / {last}
        </span>
        <button className="btn sm" disabled={page >= last} onClick={() => onPage(page + 1)}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* ---------- Formularios ---------- */

export function Field({ label: text, children, error, className = '' }: { label: string; children: ReactNode; error?: string; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{text}</span>
      {children}
      {error ? <span className="error">{error}</span> : null}
    </label>
  );
}

export function Select({ value, onChange, options, placeholder = 'Todos' }: { value: string | undefined; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? 'on' : undefined} onClick={() => onChange(o.value)} role="tab" aria-selected={o.value === value}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: { value: T; label: ReactNode }[] }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.value} className={t.value === value ? 'on' : undefined} onClick={() => onChange(t.value)} role="tab" aria-selected={t.value === value}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Modal ---------- */

export function Modal({ title, onClose, children, footer }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal>
        <h2>{title}</h2>
        {children}
        {footer ? <div className="foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children }: { title: ReactNode; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal>
        <div className="row spread" style={{ marginBottom: 14 }}>
          <h2>{title}</h2>
          <button className="btn sm ghost" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

/**
 * Modal de confirmación con nota opcional/obligatoria. Devuelve la nota al confirmar.
 */
export function ConfirmModal({ title, description, confirmLabel = 'Confirmar', danger = false, noteRequired = false, noteLabel = 'Nota interna (queda en la bitácora)', onConfirm, onClose, children }: { title: string; description?: ReactNode; confirmLabel?: string; danger?: boolean; noteRequired?: boolean; noteLabel?: string; onConfirm: (note: string) => Promise<void> | void; onClose: () => void; children?: ReactNode }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async () => {
    if (noteRequired && note.trim().length < 3) {
      setError('Escribe una nota.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onConfirm(note.trim());
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo salió mal.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className={`btn ${danger ? 'danger' : 'primary'}`} onClick={submit} disabled={busy}>
            {busy ? 'Guardando…' : confirmLabel}
          </button>
        </>
      }
    >
      {description ? <p className="muted" style={{ marginBottom: 12 }}>{description}</p> : null}
      {children}
      <Field label={noteLabel + (noteRequired ? ' *' : '')} error={error ?? undefined}>
        <textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
      </Field>
    </Modal>
  );
}
