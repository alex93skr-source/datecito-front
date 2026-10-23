import { community, type HereSession } from '../api';
import { BarList } from '../components/charts';
import { Badge, Card, DataTable, ErrorBox, Loading, PageHeader, Person, Stat, type Column } from '../components/ui';
import { fmt } from '../lib/format';
import { useApi } from '../lib/hooks';

/** "en 12 min" para fechas futuras; fmt.ago sólo sabe mirar al pasado. */
function until(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'por vencer';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'en menos de 1 min';
  if (m < 60) return `en ${m} min`;
  const h = Math.floor(m / 60);
  return h < 24 ? `en ${h} h` : `en ${Math.floor(h / 24)} d`;
}

export default function Here() {
  const live = useApi(() => community.here(), [], { refreshMs: 30000 });
  const d = live.data;

  const columns: Column<HereSession>[] = [
    { key: 'user', title: 'Persona', render: (s) => <Person user={s.user} /> },
    { key: 'place', title: 'Lugar', render: (s) => <b>{s.place}</b> },
    { key: 'verified_only', title: 'Sólo verificados', render: (s) => (s.verified_only ? <Badge tone="ok">Sí</Badge> : <span className="muted small">No</span>) },
    { key: 'ends_at', title: 'Termina', render: (s) => <span className="small nowrap">{fmt.time(s.ends_at)} <span className="muted">({until(s.ends_at)})</span></span> },
    { key: 'created_at', title: 'Iniciada', render: (s) => <span className="small nowrap" title={fmt.dateTime(s.created_at)}>{fmt.ago(s.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Aquí y ahora"
        sub="Quién está disponible en este momento para conocer gente en el mismo lugar."
        actions={
          <span className="small muted">
            <span className="live-dot" />
            Se actualiza cada 30 s{live.loading && d ? ' · actualizando…' : ''}
          </span>
        }
      />

      {live.error ? <ErrorBox message={live.error} onRetry={live.reload} /> : null}

      <div className="grid sidebar-right" style={{ marginBottom: 16 }}>
        <div className="grid cols-2">
          <Stat label="Sesiones vivas" value={d ? fmt.n(d.meta.total) : '—'} foot="personas disponibles ahora" />
          <Stat label="Lugares distintos" value={d ? fmt.n(d.meta.places.length) : '—'} foot="con al menos una persona" />
        </div>
        <Card title="Por lugar">{d ? <BarList slices={d.meta.places} limit={8} /> : <Loading rows={3} />}</Card>
      </div>

      <Card flush>
        {live.loading && !d ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={d?.data ?? []} />
      </Card>

      <p className="small muted" style={{ marginTop: 12 }}>
        No hay historial: las sesiones vencidas se borran y sólo se ven las que siguen vivas. Nunca se muestran coordenadas, únicamente el nombre del lugar que la persona eligió.
      </p>
    </>
  );
}
