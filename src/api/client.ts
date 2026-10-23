import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Cliente HTTP de la API de Datecito.
 *
 * El token vive en el almacenamiento seguro del sistema (Keystore / Keychain),
 * nunca en AsyncStorage ni en texto plano.
 */
const TOKEN_KEY = 'datecito.session';

// Producción: EXPO_PUBLIC_API_URL=https://api.<dominio>/api/v1 al compilar. Local: app.json (extra.apiUrl).
export const API_URL: string = process.env.EXPO_PUBLIC_API_URL ?? (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }

  /** Primer mensaje de validación de un campo, o el mensaje general. */
  field(name: string): string | undefined {
    return this.errors[name]?.[0];
  }
}

let token: string | null = null;
let onUnauthorized: (() => void) | null = null;
let onMembershipRequired: (() => void) | null = null;

export const session = {
  async load() {
    token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  },
  async save(value: string) {
    token = value;
    await SecureStore.setItemAsync(TOKEN_KEY, value);
  },
  async clear() {
    token = null;
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  get hasToken() {
    return token !== null;
  },
  onUnauthorized(fn: () => void) {
    onUnauthorized = fn;
  },
  onMembershipRequired(fn: () => void) {
    onMembershipRequired = fn;
  },
};

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown; form?: FormData; timeoutMs?: number };

type RawResponse = { status: number; data: any };

/**
 * Envío con XMLHttpRequest de React Native. Se usa para subir archivos: el `fetch`
 * global de Expo (SDK 57) no acepta archivos locales `{ uri }` dentro de FormData.
 */
function xhrRequest(url: string, method: string, headers: Record<string, string>, form: FormData, timeoutMs: number): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.timeout = timeoutMs;
    xhr.onload = () => {
      let data: any = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = {};
      }
      resolve({ status: xhr.status, data });
    };
    xhr.onerror = () => reject(new Error('xhr error'));
    xhr.ontimeout = () => reject(new Error('xhr timeout'));
    xhr.send(form);
  });
}

async function fetchRequest(url: string, method: string, headers: Record<string, string>, body: string | undefined, timeoutMs: number): Promise<RawResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { method, headers, body, signal: controller.signal });
    const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
    return { status: response.status, data };
  } finally {
    clearTimeout(timer);
  }
}

/** Plataforma y versión: el CRM las usa para medir adopción por app sin identificar el dispositivo. */
const APP_VERSION = Constants.expoConfig?.version ?? 'dev';

export async function request<T>(path: string, { method = 'GET', body, form, timeoutMs = 20000 }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Platform': Platform.OS, 'X-App-Version': APP_VERSION };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const url = `${API_URL}${path}`;

  let raw: RawResponse;
  try {
    raw = form
      ? await xhrRequest(url, method, headers, form, timeoutMs)
      : await fetchRequest(url, method, headers, body !== undefined ? JSON.stringify(body) : undefined, timeoutMs);
  } catch (e) {
    console.warn(`[api] ${method} ${path} no se pudo enviar:`, e instanceof Error ? e.message : e);
    throw new ApiError(0, 'No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.', 'network');
  }

  const { status, data } = raw;
  if (status === 204) return undefined as T;

  if (status < 200 || status >= 300) {
    if (status === 401 && token) onUnauthorized?.();
    if (status === 402 && data?.code === 'membership_required') onMembershipRequired?.();
    const message = status === 429 ? 'Vas muy rápido. Espera un momento e inténtalo otra vez.' : data?.message ?? 'Eso no salió. Inténtalo otra vez.';
    throw new ApiError(status, message, data?.code, data?.errors ?? {});
  }

  return data as T;
}

/** Arma un FormData con una imagen local (de la cámara o la galería). */
export function imageForm(field: string, uri: string, mimeType = 'image/jpeg') {
  const form = new FormData();
  const ext = mimeType.split('/')[1] ?? 'jpg';
  // Formato de archivo local de React Native (lo envía xhrRequest).
  form.append(field, { uri, name: `${field}.${ext}`, type: mimeType } as unknown as Blob);
  return form;
}
