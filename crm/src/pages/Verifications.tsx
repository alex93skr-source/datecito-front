import { useState } from 'react';

import { ApiError, moderation, type Verification } from '../api';
import { Badge, Card, Empty, ErrorBox, Loading, PageHeader, Pagination, Person, Segmented } from '../components/ui';
import { fmt } from '../lib/format';
import { useApi, useFilters } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
  { value: 'all', label: 'Todas' },
];

const defaults = { status: 'pending' };

const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Algo salió mal.');

function Shot({ src, caption }: { src: string | null; caption: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div>
      <div className="cap">{caption}</div>
      <div className="shot">{src && !failed ? <img src={src} alt={caption} loading="lazy" onError={() => setFailed(true)} /> : <span>Sin imagen</span>}</div>
    </div>
  );
}

export default function Verifications() {
  const { toast } = useAuth();
  const { filters, set, query } = useFilters(defaults);
  const list = useApi(() => moderation.verifications(query), [JSON.stringify(query)]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const review = async (v: Verification, approve: boolean) => {
    setBusyId(v.id);
    try {
      await moderation.review(v.id, approve);
      toast(approve ? `Perfil de ${v.user?.name ?? 'la persona'} verificado.` : 'Verificación rechazada.');
      list.reload();
    } catch (e) {
      toast(e instanceof ApiError && e.status === 409 ? 'Esta solicitud ya fue revisada.' : errMsg(e), 'error');
      list.reload();
    } finally {
      setBusyId(null);
    }
  };

  const rows = list.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Verificaciones"
        sub={list.data ? `${fmt.n(list.data.meta.total)} solicitudes en esta vista. Compara la selfie con la foto de perfil.` : 'Compara la selfie con la foto de perfil y decide.'}
        actions={<Segmented value={filters.status ?? 'pending'} onChange={(v) => set({ status: v })} options={STATUS_OPTIONS} />}
      />

      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}

      {list.loading && !list.data ? (
        <Card>
          <Loading rows={5} />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <Empty title={filters.status === 'pending' ? 'No hay selfies por revisar' : 'Nada en esta vista'}>{filters.status === 'pending' ? 'Cuando alguien pida verificar su perfil, aparecerá aquí.' : null}</Empty>
        </Card>
      ) : (
        <div className="grid cols-3">
          {rows.map((v) => (
            <Card key={v.id} className="verify-card">
              <div className="row spread" style={{ marginBottom: 10 }}>
                <Person user={v.user} />
                <Badge value={v.status} />
              </div>
              <div className="compare">
                <Shot key={`s-${v.selfie_url}`} src={v.selfie_url} caption={v.pose ? `Selfie · pose pedida: ${v.pose}` : 'Selfie'} />
                <Shot key={`p-${v.profile_photo_url ?? 'none'}`} src={v.profile_photo_url} caption="Foto de perfil" />
              </div>
              <div className="small muted" style={{ margin: '10px 0' }}>
                Solicitada {fmt.ago(v.created_at)} · {fmt.dateTime(v.created_at)}
              </div>
              {v.status === 'pending' ? (
                <div className="row">
                  <button className="btn primary" style={{ flex: 1 }} disabled={busyId === v.id} onClick={() => review(v, true)}>
                    {busyId === v.id ? 'Guardando…' : 'Aprobar'}
                  </button>
                  <button className="btn danger" style={{ flex: 1 }} disabled={busyId === v.id} onClick={() => review(v, false)}>
                    Rechazar
                  </button>
                </div>
              ) : (
                <div className="small">
                  {v.status === 'approved' ? 'Aprobada' : 'Rechazada'} por <b>{v.reviewed_by?.name ?? v.reviewed_by?.email ?? 'el sistema'}</b>
                  {v.reviewed_at ? <span className="muted"> · {fmt.dateTime(v.reviewed_at)}</span> : null}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {list.data ? (
        <Card flush className="pager-card">
          <Pagination meta={list.data.meta} onPage={(p) => set({ page: p }, false)} />
        </Card>
      ) : null}
    </>
  );
}
