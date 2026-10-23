const num = new Intl.NumberFormat('es-MX');
const compactNum = new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 });
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const dateShort = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' });
const dateLong = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const time = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' });

export const fmt = {
  n: (v: number | null | undefined) => (v === null || v === undefined ? '—' : num.format(v)),
  compact: (v: number | null | undefined) => (v === null || v === undefined ? '—' : compactNum.format(v)),
  money: (v: number | null | undefined) => (v === null || v === undefined ? '—' : money.format(v)),
  pct: (v: number | null | undefined, digits = 1) => (v === null || v === undefined ? '—' : `${v.toFixed(digits)}%`),
  date: (iso: string | null | undefined) => (iso ? dateLong.format(new Date(iso)) : '—'),
  dateShort: (iso: string | null | undefined) => (iso ? dateShort.format(new Date(iso)) : '—'),
  dateTime: (iso: string | null | undefined) => (iso ? dateTime.format(new Date(iso)) : '—'),
  time: (iso: string | null | undefined) => (iso ? time.format(new Date(iso)) : '—'),
  /** "hace 3 min", "hace 2 d". */
  ago(iso: string | null | undefined): string {
    if (!iso) return 'nunca';
    const diff = Math.max(0, Date.now() - new Date(iso).getTime());
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'ahora';
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 30) return `hace ${d} d`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `hace ${mo} mes${mo > 1 ? 'es' : ''}`;
    return `hace ${Math.floor(mo / 12)} a`;
  },
  ms: (v: number | null | undefined) => (v === null || v === undefined ? '—' : v < 1000 ? `${v} ms` : `${(v / 1000).toFixed(1)} s`),
  /** Fecha de cubeta (YYYY-MM-DD) como etiqueta de eje según la granularidad. */
  bucket(date: string, interval: 'day' | 'week' | 'month'): string {
    const d = new Date(`${date}T12:00:00`);
    if (interval === 'month') return new Intl.DateTimeFormat('es-MX', { month: 'short', year: '2-digit' }).format(d);
    return dateShort.format(d);
  },
};

export const labels: Record<string, string> = {
  active: 'Activa',
  paused: 'Pausada',
  suspended: 'Suspendida',
  banned: 'Baneada',
  user: 'Persona',
  moderator: 'Moderación',
  admin: 'Admin',
  none: 'Sin verificar',
  pending: 'Pendiente',
  approved: 'Verificado',
  rejected: 'Rechazada',
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  monthly: 'Mensual',
  yearly: 'Anual',
  google_play: 'Google Play',
  app_store: 'App Store',
  fake: 'Simulada',
  open: 'Abierto',
  reviewing: 'En revisión',
  resolved: 'Resuelto',
  dismissed: 'Descartado',
  proposed: 'Propuesto',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  expired: 'Vencida',
  help: 'Pide ayuda',
  overdue: 'Sin check-in',
  ended: 'Terminada',
  discover: 'Descubrir',
  here: 'Aquí y ahora',
  like: 'Like',
  pass: 'Pass',
  super: 'Super like',
  api: 'API',
  client: 'App',
  system: 'Sistema',
  cafe: 'Café',
  comida: 'Comida',
  bar: 'Bar',
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  otro: 'Otro',
  new: 'Nuevo',
  read: 'Leído',
  answered: 'Atendido',
  spam: 'Spam',
  contact: 'Contacto',
  partners: 'Alianzas',
  arco: 'ARCO',
  newsletter: 'Boletín',
  campus: 'Lista de espera',
};

export const label = (key: string | null | undefined) => (key ? (labels[key] ?? key) : '—');

/** Nombres de métricas y eventos en español para títulos. */
export const metricLabels: Record<string, string> = {
  signups: 'Registros',
  active_users: 'Personas activas',
  deletions: 'Cuentas eliminadas',
  swipes: 'Swipes',
  likes: 'Likes',
  super_likes: 'Super likes',
  matches: 'Matches',
  messages: 'Mensajes',
  datecitos: 'Datecitos propuestos',
  datecitos_confirmed: 'Datecitos confirmados',
  here_sessions: 'Aquí y ahora',
  safe_sessions: 'Datecito Seguro',
  reports: 'Reportes',
  verifications: 'Verificaciones',
  subscriptions: 'Suscripciones',
  purchases: 'Paquetes de Super likes',
  revenue: 'Ingresos',
  events: 'Eventos',
  errors: 'Errores de API',
  email_verified: 'Correos verificados',
};

export const actionLabels: Record<string, string> = {
  'user.status': 'Cambió el estado de la cuenta',
  'user.role': 'Cambió el rol',
  'user.verified': 'Verificó el perfil',
  'user.unverified': 'Quitó la verificación',
  'user.super_likes': 'Ajustó Super likes',
  'user.membership_granted': 'Regaló membresía',
  'user.membership_revoked': 'Canceló membresía',
  'user.photo_removed': 'Eliminó una foto',
  'user.logout_all': 'Cerró sesiones',
  'user.deleted': 'Eliminó la cuenta',
  'user.profile_edited': 'Editó el perfil',
  'user.tags': 'Cambió etiquetas',
  'users.exported': 'Exportó personas',
  'note.created': 'Agregó una nota',
  'note.deleted': 'Borró una nota',
  'report.updated': 'Actualizó un reporte',
  'web_message.read': 'Leyó un mensaje del sitio',
  'web_message.answered': 'Atendió un mensaje del sitio',
  'web_message.spam': 'Marcó un mensaje del sitio como spam',
  'verification.approved': 'Aprobó verificación',
  'verification.rejected': 'Rechazó verificación',
  'messages.viewed': 'Leyó una conversación',
  'connection.ended': 'Terminó una conexión',
};
