import { useState, type FormEvent } from 'react';

import { ApiError, sendWebMessage, type WebMessageKind } from '../api';
import { useLang, useT } from '../i18n';

type State = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Envío real de un formulario del sitio a la API. Lee los campos por su atributo `name`
 * (email, name, topic, company, city, message, accepted, attachment, website).
 */
export function useWebForm(kind: WebMessageKind) {
  const lang = useLang();
  const t = useT();
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const [folio, setFolio] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = (k: string) => {
      const v = fd.get(k);
      return typeof v === 'string' && v.trim() ? v.trim() : undefined;
    };
    const file = fd.get('attachment');
    setState('sending');
    setError(null);
    try {
      const result = await sendWebMessage({
        kind,
        lang,
        email: text('email') ?? '',
        name: text('name'),
        topic: text('topic'),
        company: text('company'),
        city: text('city'),
        message: text('message'),
        accepted: fd.get('accepted') === 'on' ? true : undefined,
        attachment: file instanceof File && file.size > 0 ? file : null,
        website: text('website'),
      });
      setFolio(result.folio);
      setState('sent');
      e.currentTarget.reset();
    } catch (err) {
      const fieldError = err instanceof ApiError ? Object.values(err.errors)[0]?.[0] : undefined;
      setError(fieldError ?? (err instanceof ApiError ? err.message : t('Eso no salió. Inténtalo otra vez.', 'That didn’t work. Please try again.')));
      setState('error');
    }
  };

  return { state, error, folio, submit, reset: () => setState('idle'), sending: state === 'sending', sent: state === 'sent' };
}

/** Campo invisible que los bots llenan y las personas no (el servidor rechaza si trae algo). */
export function Honeypot() {
  return (
    <div style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
      <label>
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="notice danger" role="alert">
      {message}
    </div>
  );
}
