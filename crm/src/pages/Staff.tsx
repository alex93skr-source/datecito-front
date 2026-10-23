import { useCallback, useState } from 'react';

import { ApiError, team, users, type Staff as StaffMember, type UserRole, type UserSummary } from '../api';
import { Badge, Card, ConfirmModal, DataTable, Empty, ErrorBox, Field, Modal, PageHeader, Person, type Column } from '../components/ui';
import { fmt, label } from '../lib/format';
import { useApi } from '../lib/hooks';
import { useAuth } from '../store/Auth';

const ROLES: UserRole[] = ['user', 'moderator', 'admin'];
const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Algo salió mal.');

export default function Staff() {
  const { me, can, toast } = useAuth();
  const isAdmin = can('administer');
  const staff = useApi(() => team.staff(), []);

  const [roleTarget, setRoleTarget] = useState<{ id: string; name: string | null; email: string; role: UserRole } | null>(null);
  const [removeTarget, setRemoveTarget] = useState<StaffMember | null>(null);
  const closeRole = useCallback(() => setRoleTarget(null), []);
  const closeRemove = useCallback(() => setRemoveTarget(null), []);

  // Agregar al equipo
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('moderator');
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<UserSummary | null>(null);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const q = email.trim().toLowerCase();
    if (!q) return;
    setSearching(true);
    setSearched(false);
    try {
      const r = await users.list({ q, per_page: 10 });
      setFound(r.data.find((u) => u.email.toLowerCase() === q) ?? null);
      setSearched(true);
    } catch (e) {
      toast(errMsg(e), 'error');
    } finally {
      setSearching(false);
    }
  };

  const columns: Column<StaffMember>[] = [
    { key: 'person', title: 'Persona', render: (s) => <Person user={s} sub={<>{s.email}{me?.id === s.id ? ' · tú' : ''}</>} /> },
    { key: 'role', title: 'Rol', render: (s) => <Badge value={s.role} /> },
    { key: 'status', title: 'Estado', render: (s) => <Badge value={s.status} /> },
    { key: 'seen', title: 'Última actividad', render: (s) => <span className="small" title={fmt.dateTime(s.last_seen_at)}>{fmt.ago(s.last_seen_at)}</span> },
    { key: 'total', title: 'Acciones', num: true, render: (s) => fmt.n(s.actions_total) },
    { key: 'last30', title: '30 días', num: true, render: (s) => fmt.n(s.actions_30d) },
    { key: 'last', title: 'Última acción', render: (s) => <span className="small" title={fmt.dateTime(s.last_action_at)}>{fmt.ago(s.last_action_at)}</span> },
    { key: 'since', title: 'Miembro desde', render: (s) => <span className="small">{fmt.date(s.created_at)}</span> },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            title: '',
            render: (s: StaffMember) => (
              <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                <button className="btn sm" onClick={() => setRoleTarget(s)} disabled={s.id === me?.id}>
                  Cambiar rol
                </button>
                <button className="btn sm ghost" onClick={() => setRemoveTarget(s)} disabled={s.id === me?.id}>
                  Quitar del equipo
                </button>
              </div>
            ),
          } satisfies Column<StaffMember>,
        ]
      : []),
  ];

  return (
    <>
      <PageHeader title="Equipo" sub={staff.data ? `${fmt.n(staff.data.length)} personas con acceso al CRM.` : 'Quién modera y administra Datecito.'} />

      {staff.error ? <ErrorBox message={staff.error} onRetry={staff.reload} /> : null}
      <Card flush>
        {staff.loading && !staff.data ? <div className="loading-bar" /> : null}
        <DataTable columns={columns} rows={staff.data ?? []} empty={<Empty title="Nadie en el equipo todavía" />} />
      </Card>

      {isAdmin ? (
        <Card title="Agregar al equipo" hint="Busca por correo exacto a una persona registrada en la app" className="mt">
          <div className="filters" style={{ marginBottom: 10 }}>
            <Field label="Correo" className="wide">
              <input
                className="input"
                type="email"
                placeholder="persona@correo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSearched(false);
                  setFound(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void search();
                }}
              />
            </Field>
            <Field label="Rol">
              <select className="select" value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)}>
                <option value="moderator">{label('moderator')}</option>
                <option value="admin">{label('admin')}</option>
              </select>
            </Field>
            <button className="btn dark" onClick={search} disabled={searching || !email.trim()}>
              {searching ? 'Buscando…' : 'Buscar'}
            </button>
          </div>

          {searched && !found ? <p className="small muted">No encontramos ninguna cuenta con ese correo exacto. La persona debe registrarse primero en la app.</p> : null}
          {found ? (
            <div className="row spread note">
              <div className="row">
                <Person user={found} />
                <Badge value={found.role} />
                <Badge value={found.status} />
              </div>
              {found.role === newRole ? (
                <span className="small muted">Ya tiene ese rol.</span>
              ) : (
                <button className="btn primary sm" onClick={() => setRoleTarget({ id: found.id, name: found.name, email: found.email, role: found.role })}>
                  Asignar rol de {label(newRole).toLowerCase()}
                </button>
              )}
            </div>
          ) : null}

          <p className="small muted" style={{ marginTop: 12 }}>
            Los roles también se pueden asignar desde la consola del servidor: <span className="code">php artisan datecito:grant-role correo@ejemplo.com moderator</span> (o <span className="code">admin</span>). Útil para dar de alta al primer admin.
          </p>
        </Card>
      ) : (
        <p className="small muted" style={{ marginTop: 14 }}>
          Sólo las cuentas con rol de admin pueden cambiar roles. Si necesitas sumar a alguien, pídeselo a un admin o usa la consola: <span className="code">php artisan datecito:grant-role correo rol</span>.
        </p>
      )}

      {roleTarget ? (
        <RoleModal
          target={roleTarget}
          initialRole={found && roleTarget.id === found.id ? newRole : roleTarget.role}
          onClose={closeRole}
          onSaved={(role) => {
            toast(`Rol de ${roleTarget.name ?? roleTarget.email} cambiado a ${label(role)}.`);
            staff.reload();
            if (found && roleTarget.id === found.id) {
              setFound(null);
              setSearched(false);
              setEmail('');
            }
          }}
        />
      ) : null}

      {removeTarget ? (
        <ConfirmModal
          title={`Quitar a ${removeTarget.name ?? removeTarget.email} del equipo`}
          description="Su cuenta vuelve a ser una cuenta normal de la app y pierde acceso al CRM de inmediato."
          confirmLabel="Quitar del equipo"
          danger
          onConfirm={async (note) => {
            try {
              await users.setRole(removeTarget.id, 'user', note || undefined);
              toast('Listo, ya no forma parte del equipo.');
              staff.reload();
            } catch (e) {
              toast(errMsg(e), 'error');
              throw e;
            }
          }}
          onClose={closeRemove}
        />
      ) : null}
    </>
  );
}

function RoleModal({ target, initialRole, onClose, onSaved }: { target: { id: string; name: string | null; email: string; role: UserRole }; initialRole: UserRole; onClose: () => void; onSaved: (role: UserRole) => void }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await users.setRole(target.id, role, note.trim() || undefined);
      onSaved(role);
      onClose();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={`Rol de ${target.name ?? target.email}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn primary" onClick={submit} disabled={busy || role === target.role}>
            {busy ? 'Guardando…' : 'Guardar rol'}
          </button>
        </>
      }
    >
      <p className="muted small" style={{ marginBottom: 12 }}>
        Rol actual: <Badge value={target.role} />. Moderación puede atender reportes, verificaciones y editar perfiles; admin además maneja roles, membresías y eliminaciones.
      </p>
      {error ? <ErrorBox message={error} /> : null}
      <div className="stack" style={{ gap: 10, marginTop: 10 }}>
        <Field label="Nuevo rol">
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {label(r)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nota interna (queda en la bitácora)">
          <textarea className="textarea" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
