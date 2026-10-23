import { AppState } from 'react-native';

import { request, session } from './client';

/**
 * Eventos de comportamiento para el CRM (pantallas vistas, acciones de interfaz).
 *
 * Se acumulan y se envían en lotes a POST /events. Nunca se envía contenido
 * privado: sólo nombres de evento cortos y propiedades simples.
 */
type Properties = Record<string, string | number | boolean | null>;
type Event = { name: string; properties?: Properties; occurred_at: string };

const MAX_BATCH = 20;
const FLUSH_MS = 10000;

let queue: Event[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

export function track(name: string, properties?: Properties) {
  if (!session.hasToken) return;
  queue.push({ name: name.toLowerCase().replace(/[^a-z0-9_.-]/g, '_').slice(0, 80), properties, occurred_at: new Date().toISOString() });
  if (queue.length >= MAX_BATCH) void flush();
  else timer ??= setTimeout(() => void flush(), FLUSH_MS);
}

/** Pantalla vista: `/(tabs)/discover` → `screen.discover`. */
export function trackScreen(pathname: string) {
  const clean = pathname.replace(/\([^)]*\)\//g, '').replace(/^\/+/, '').replace(/\/[0-9A-Z]{26}(\/|$)/g, '/id$1').replace(/\/+$/, '') || 'home';
  track(`screen.${clean.replace(/\//g, '.')}`);
}

export async function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0 || !session.hasToken) return;
  const events = queue.splice(0, MAX_BATCH);
  try {
    await request<void>('/events', { method: 'POST', body: { events }, timeoutMs: 8000 });
  } catch {
    // Se pierde el lote: la analítica nunca debe molestar a la persona.
  }
  if (queue.length > 0) timer ??= setTimeout(() => void flush(), FLUSH_MS);
}

// Al mandar la app a segundo plano se envía lo pendiente.
AppState.addEventListener('change', (state) => {
  if (state === 'background' || state === 'inactive') void flush();
});
