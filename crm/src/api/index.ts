import { download, request, type Query } from './client';
import type {
  ActivityEvent,
  AdminAction,
  Billing,
  Breakdowns,
  Connection,
  Data,
  Datecito,
  EventName,
  Funnel,
  HereSession,
  Live,
  Message,
  Overview,
  Paginated,
  Purchase,
  Report,
  Retention,
  RoutePerformance,
  SafeSession,
  Series,
  Settings,
  Staff,
  StaffMe,
  Subscription,
  UserDetail,
  UserMini,
  UserNote,
  UserSummary,
  Verification,
  WebMessage,
} from './types';

export * from './client';
export * from './types';

export type Swipe = { id: number; type: 'like' | 'pass' | 'super'; person: UserMini; created_at: string };

type AuthResponse = { token: string; expires_at: string; user: { id: string; name: string | null; email: string; is_moderator: boolean } };

export const auth = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password, device_name: 'datecito-crm' } }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<Data<StaffMe>>('/admin/me').then((r) => r.data),
};

export const dashboard = {
  overview: (query: Query) => request<Data<Overview>>('/admin/dashboard/overview', { query }).then((r) => r.data),
  series: (query: Query) => request<Data<Series>>('/admin/dashboard/series', { query }).then((r) => r.data),
  multiSeries: (query: Query) => request<Data<Record<string, Series>>>('/admin/dashboard/multi-series', { query }).then((r) => r.data),
  funnel: (query: Query) => request<Data<Funnel>>('/admin/dashboard/funnel', { query }).then((r) => r.data),
  retention: (weeks: number) => request<Data<Retention>>('/admin/dashboard/retention', { query: { weeks } }).then((r) => r.data),
  breakdowns: (query: Query) => request<Data<Breakdowns>>('/admin/dashboard/breakdowns', { query }).then((r) => r.data),
  live: () => request<Data<Live>>('/admin/dashboard/live').then((r) => r.data),
};

export const users = {
  list: (query: Query) => request<Paginated<UserSummary>>('/admin/users', { query }),
  export: (query: Query) => download('/admin/users/export', query, `personas-${new Date().toISOString().slice(0, 10)}.csv`),
  tags: () => request<Data<{ tag: string; users: number }[]>>('/admin/tags').then((r) => r.data),
  show: (id: string) => request<Data<UserDetail>>(`/admin/users/${id}`).then((r) => r.data),
  events: (id: string, query: Query) => request<Paginated<ActivityEvent>>(`/admin/users/${id}/events`, { query }),
  connections: (id: string, query: Query) => request<Paginated<Connection>>(`/admin/users/${id}/connections`, { query }),
  swipes: (id: string) => request<Data<{ given: Swipe[]; received: Swipe[]; given_by_day: { date: string; value: number }[] }>>(`/admin/users/${id}/swipes`).then((r) => r.data),
  reports: (id: string) => request<Data<{ received: Report[]; made: Report[] }>>(`/admin/users/${id}/reports`).then((r) => r.data),
  billing: (id: string) => request<Data<{ subscriptions: Subscription[]; purchases: Purchase[]; has_current: boolean }>>(`/admin/users/${id}/billing`).then((r) => r.data),
  audit: (id: string, query: Query) => request<Paginated<AdminAction>>(`/admin/users/${id}/audit`, { query }),

  update: (id: string, body: Record<string, unknown>) => request<Data<UserSummary>>(`/admin/users/${id}`, { method: 'PATCH', body }).then((r) => r.data),
  setStatus: (id: string, status: string, note?: string) => request<void>(`/admin/users/${id}/status`, { method: 'PUT', body: { status, note } }),
  setRole: (id: string, role: string, note?: string) => request<void>(`/admin/users/${id}/role`, { method: 'PUT', body: { role, note } }),
  setVerified: (id: string, verified: boolean, note?: string) => request<void>(`/admin/users/${id}/verification`, { method: 'POST', body: { verified, note } }),
  adjustSuperLikes: (id: string, delta: number, note?: string) =>
    request<Data<{ super_likes_balance: number }>>(`/admin/users/${id}/super-likes`, { method: 'POST', body: { delta, note } }).then((r) => r.data),
  grantMembership: (id: string, plan: string, days: number, note?: string) =>
    request<Data<Subscription>>(`/admin/users/${id}/membership`, { method: 'POST', body: { plan, days, note } }).then((r) => r.data),
  revokeMembership: (id: string, note?: string) => request<void>(`/admin/users/${id}/membership`, { method: 'DELETE', body: { note } }),
  removePhoto: (id: string, photoId: string, note?: string) => request<void>(`/admin/users/${id}/photos/${photoId}`, { method: 'DELETE', body: { note } }),
  logout: (id: string) => request<Data<{ sessions_closed: number }>>(`/admin/users/${id}/logout`, { method: 'POST' }).then((r) => r.data),
  destroy: (id: string, note: string) => request<void>(`/admin/users/${id}`, { method: 'DELETE', body: { note } }),
  setTags: (id: string, tags: string[]) => request<Data<{ tags: string[] }>>(`/admin/users/${id}/tags`, { method: 'PUT', body: { tags } }).then((r) => r.data),
  addNote: (id: string, body: string, pinned = false) => request<Data<UserNote>>(`/admin/users/${id}/notes`, { method: 'POST', body: { body, pinned } }).then((r) => r.data),
  updateNote: (noteId: string, body: string, pinned: boolean) => request<Data<UserNote>>(`/admin/notes/${noteId}`, { method: 'PATCH', body: { body, pinned } }).then((r) => r.data),
  deleteNote: (noteId: string) => request<void>(`/admin/notes/${noteId}`, { method: 'DELETE' }),
};

export const moderation = {
  reports: (query: Query) => request<Paginated<Report>>('/admin/reports', { query }),
  report: (id: string) => request<Data<Report>>(`/admin/reports/${id}`).then((r) => r.data),
  updateReport: (id: string, status: string, resolution_note?: string) =>
    request<Data<Report>>(`/admin/reports/${id}`, { method: 'PATCH', body: { status, resolution_note } }).then((r) => r.data),
  verifications: (query: Query) => request<Paginated<Verification>>('/admin/verifications', { query }),
  review: (id: string, approve: boolean) => request<void>(`/admin/verifications/${id}`, { method: 'POST', body: { approve } }),
};

export const web = {
  messages: (query: Query) => request<Paginated<WebMessage>>('/admin/web-messages', { query }),
  update: (id: string, status: WebMessage['status']) => request<Data<WebMessage>>(`/admin/web-messages/${id}`, { method: 'PATCH', body: { status } }).then((r) => r.data),
  attachment: (id: string) => request<{ url: string }>(`/admin/web-messages/${id}/attachment`),
};

export const community = {
  connections: (query: Query) => request<Paginated<Connection>>('/admin/connections', { query }),
  connection: (id: string) => request<Data<Connection>>(`/admin/connections/${id}`).then((r) => r.data),
  messages: (id: string, query: Query) => request<Paginated<Message>>(`/admin/connections/${id}/messages`, { query }),
  endConnection: (id: string, note?: string) => request<void>(`/admin/connections/${id}/end`, { method: 'POST', body: { note } }),
  datecitos: (query: Query) => request<Paginated<Datecito>>('/admin/datecitos', { query }),
  here: () => request<Paginated<HereSession> & { meta: { places: { label: string; value: number }[] } }>('/admin/here/sessions'),
  safeSessions: (query: Query) => request<Paginated<SafeSession>>('/admin/safe-sessions', { query }),
};

export const billing = {
  overview: (query: Query) => request<Data<Billing>>('/admin/billing/overview', { query }).then((r) => r.data),
  subscriptions: (query: Query) => request<Paginated<Subscription>>('/admin/billing/subscriptions', { query }),
  purchases: (query: Query) => request<Paginated<Purchase>>('/admin/billing/purchases', { query }),
};

export const events = {
  list: (query: Query) => request<Paginated<ActivityEvent>>('/admin/events', { query }),
  names: (query: Query) => request<Data<EventName[]>>('/admin/events/names', { query }).then((r) => r.data),
  performance: (query: Query) => request<Data<{ routes: RoutePerformance[] }>>('/admin/events/performance', { query }).then((r) => r.data.routes),
};

export const team = {
  audit: (query: Query) => request<Paginated<AdminAction> & { meta: { actions: { action: string; count: number }[] } }>('/admin/audit', { query }),
  staff: () => request<Data<Staff[]>>('/admin/staff').then((r) => r.data),
  settings: () => request<Data<Settings>>('/admin/settings').then((r) => r.data),
};
