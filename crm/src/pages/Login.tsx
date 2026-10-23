import { useState, type FormEvent } from 'react';

import { ApiError } from '../api';
import { Field } from '../components/ui';
import { useAuth } from '../store/Auth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      setError(err instanceof ApiError ? (err.field('email') ?? err.message) : 'Algo salió mal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <div className="brand">Datecito</div>
        <p className="muted" style={{ marginBottom: 20 }}>
          CRM interno. Sólo cuentas con rol de moderación o administración.
        </p>
        <div className="stack" style={{ gap: 12 }}>
          <Field label="Correo">
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </Field>
          <Field label="Contraseña">
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="btn primary block" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
