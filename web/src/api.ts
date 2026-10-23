/** Formularios del sitio → API de Datecito (POST /web/messages). */
const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export type WebMessageKind = 'contact' | 'partners' | 'newsletter' | 'arco' | 'campus';

export type WebMessagePayload = {
  kind: WebMessageKind;
  lang: 'es' | 'en';
  email: string;
  name?: string;
  topic?: string;
  company?: string;
  city?: string;
  message?: string;
  accepted?: boolean;
  attachment?: File | null;
  /** Trampa anti-bots: siempre vacío para una persona. */
  website?: string;
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  /** Primer error de validación de un campo. */
  field(name: string): string | undefined {
    return this.errors[name]?.[0];
  }
}

export async function sendWebMessage(payload: WebMessagePayload): Promise<{ folio: string }> {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (v instanceof File) form.append(k, v);
    else form.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v));
  });

  let response: Response;
  try {
    response = await fetch(`${API_URL}/web/messages`, { method: 'POST', headers: { Accept: 'application/json' }, body: form });
  } catch {
    throw new ApiError(0, 'No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.');
  }

  const data = (await response.json().catch(() => null)) as { message?: string; errors?: Record<string, string[]>; folio?: string } | null;
  if (!response.ok) {
    const message = response.status === 429 ? 'Enviaste varios mensajes seguidos. Espera un momento e inténtalo otra vez.' : (data?.message ?? 'Eso no salió. Inténtalo otra vez.');
    throw new ApiError(response.status, message, data?.errors ?? {});
  }
  return { folio: data?.folio ?? '' };
}
