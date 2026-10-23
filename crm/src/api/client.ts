/**
 * Cliente HTTP del CRM. El token de Sanctum vive en localStorage (sólo equipo interno).
 */
export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'datecito.crm.token';

export class ApiError extends Error {
  status: number;
  code?: string;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, code?: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  field(name: string): string | undefined {
    return this.errors[name]?.[0];
  }
}

let token: string | null = null;
try {
  token = localStorage.getItem(TOKEN_KEY);
} catch {
  token = null;
}

let onUnauthorized: (() => void) | null = null;

export const session = {
  get token() {
    return token;
  },
  save(value: string) {
    token = value;
    try {
      localStorage.setItem(TOKEN_KEY, value);
    } catch {
      /* sin almacenamiento */
    }
  },
  clear() {
    token = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* sin almacenamiento */
    }
  },
  onUnauthorized(fn: () => void) {
    onUnauthorized = fn;
  },
};

export type Query = Record<string, string | number | boolean | null | undefined | Array<string | number>>;

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown; query?: Query; signal?: AbortSignal };

/** Serializa filtros a query string omitiendo vacíos; arreglos como clave[]. */
export function toQuery(query?: Query): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((v) => params.append(`${key}[]`, String(v)));
    else params.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function request<T>(path: string, { method = 'GET', body, query, signal }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Platform': 'web', 'X-App-Version': 'crm-1.0' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}${toQuery(query)}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(0, 'No pudimos conectarnos con la API. Revisa que el backend esté arriba.', 'network');
  }

  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized?.();
    const message =
      response.status === 429
        ? 'Demasiadas peticiones. Espera un momento.'
        : response.status === 403
          ? (data?.message ?? 'No tienes permiso para esta acción.')
          : (data?.message ?? 'Algo salió mal.');
    throw new ApiError(response.status, message, data?.code, data?.errors ?? {});
  }

  return data as T;
}

/** Descarga un archivo autenticado (CSV) y dispara el guardado en el navegador. */
export async function download(path: string, query: Query | undefined, filename: string): Promise<void> {
  const headers: Record<string, string> = { Accept: 'text/csv' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}${toQuery(query)}`, { headers });
  if (!response.ok) throw new ApiError(response.status, 'No se pudo exportar.');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
