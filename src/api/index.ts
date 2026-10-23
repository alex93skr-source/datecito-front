import { imageForm, request } from './client';
import type {
  ActivityItem,
  Connection,
  Datecito,
  DeckMeta,
  LikesReceived,
  Filters,
  HerePerson,
  HereSession,
  Me,
  Membership,
  Message,
  Person,
  Photo,
  PlanKind,
  SafeSession,
  Settings,
  SwipeResult,
  TrustedContact,
} from './types';

export * from './client';
export * from './types';

type Data<T> = { data: T };
type AuthResponse = { token: string; expires_at: string; user: Me };

const unwrap = <T>(r: Data<T>) => r.data;

/** Selfie de verificación más la pose que se pidió al azar. */
const selfieForm = (uri: string, mimeType: string | undefined, pose: string) => {
  const form = imageForm('selfie', uri, mimeType);
  form.append('pose', pose);
  return form;
};

export const auth = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: { email, password, accepted_terms: true, device_name: 'datecito-app' } }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password, device_name: 'datecito-app' } }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  verifyEmail: (code: string) => request<Data<Me>>('/auth/email/verify', { method: 'POST', body: { code } }).then(unwrap),
  resendCode: () => request<void>('/auth/email/resend', { method: 'POST' }),
  forgot: (email: string) => request<{ message: string }>('/auth/password/forgot', { method: 'POST', body: { email } }),
  reset: (email: string, code: string, password: string) =>
    request<{ message: string }>('/auth/password/reset', { method: 'POST', body: { email, code, password } }),
};

export type ProfileUpdate = Partial<
  Pick<Me, 'name' | 'birthdate' | 'gender' | 'interested_in' | 'job' | 'bio' | 'intent' | 'relationship_type' | 'zone' | 'interests' | 'teams' | 'basics' | 'languages' | 'prompts'>
> & { music_genres?: string[]; music_artists?: string[]; anthem?: string | null };

export const me = {
  get: () => request<Data<Me>>('/me').then(unwrap),
  update: (data: ProfileUpdate) => request<Data<Me>>('/me', { method: 'PATCH', body: data }).then(unwrap),
  settings: (data: Partial<Settings>) => request<Data<Me>>('/me/settings', { method: 'PUT', body: data }).then(unwrap),
  filters: (data: Filters) => request<Data<Me>>('/me/filters', { method: 'PUT', body: data }).then(unwrap),
  location: (lat: number, lng: number, zone?: string | null) => request<void>('/me/location', { method: 'PUT', body: { lat, lng, zone } }),
  password: (current_password: string, password: string) => request<void>('/me/password', { method: 'PUT', body: { current_password, password } }),
  remove: (password: string) => request<void>('/me', { method: 'DELETE', body: { password } }),
  uploadPhoto: (uri: string, mimeType?: string) =>
    request<Data<Photo>>('/me/photos', { method: 'POST', form: imageForm('photo', uri, mimeType), timeoutMs: 60000 }).then(unwrap),
  deletePhoto: (id: string) => request<void>(`/me/photos/${id}`, { method: 'DELETE' }),
  reorderPhotos: (ids: string[]) => request<Data<Photo[]>>('/me/photos/order', { method: 'PUT', body: { ids } }).then(unwrap),
};

export const discover = {
  deck: () => request<{ data: Person[]; meta: DeckMeta }>('/discover'),
  swipe: (user_id: string, type: 'like' | 'pass' | 'super') => request<SwipeResult>('/swipes', { method: 'POST', body: { user_id, type } }),
  person: (id: string) => request<Data<Person>>(`/people/${id}`).then(unwrap),
  likes: () => request<LikesReceived>('/likes'),
  activity: (page = 1) => request<{ data: ActivityItem[]; meta: { page: number; has_more: boolean } }>(`/activity?page=${page}`),
};

export const connections = {
  list: () => request<Data<Connection[]>>('/connections').then(unwrap),
  get: (id: string) => request<Data<Connection>>(`/connections/${id}`).then(unwrap),
  end: (id: string) => request<void>(`/connections/${id}`, { method: 'DELETE' }),
  messages: (id: string, after?: string) =>
    request<Data<Message[]>>(`/connections/${id}/messages${after ? `?after=${encodeURIComponent(after)}` : ''}`).then(unwrap),
  send: (id: string, body: string) => request<Data<Message>>(`/connections/${id}/messages`, { method: 'POST', body: { body } }).then(unwrap),
  propose: (id: string, data: { kind: PlanKind; place: string; zone: string; scheduled_at: string; note?: string | null }) =>
    request<Data<Datecito>>(`/connections/${id}/datecitos`, { method: 'POST', body: data }).then(unwrap),
};

export const datecitos = {
  list: () => request<Data<Datecito[]>>('/datecitos').then(unwrap),
  get: (id: string) => request<Data<Datecito>>(`/datecitos/${id}`).then(unwrap),
  confirm: (id: string) => request<Data<Datecito>>(`/datecitos/${id}/confirm`, { method: 'POST' }).then(unwrap),
  cancel: (id: string) => request<Data<Datecito>>(`/datecitos/${id}/cancel`, { method: 'POST' }).then(unwrap),
  feedback: (id: string, answers: { showed: string; photos: string; safe: string; again: string }) =>
    request<void>(`/datecitos/${id}/feedback`, { method: 'POST', body: answers }),
};

export const safety = {
  blocks: () => request<Data<Person[]>>('/blocks').then(unwrap),
  block: (user_id: string) => request<void>('/blocks', { method: 'POST', body: { user_id } }),
  unblock: (user_id: string) => request<void>(`/blocks/${user_id}`, { method: 'DELETE' }),
  report: (data: { user_id?: string; reason: string; details?: string; also_block?: boolean }) =>
    request<{ message: string }>('/reports', { method: 'POST', body: data }),
  contacts: () => request<Data<TrustedContact[]>>('/trusted-contacts').then(unwrap),
  addContact: (name: string, phone: string) => request<Data<TrustedContact>>('/trusted-contacts', { method: 'POST', body: { name, phone } }).then(unwrap),
  removeContact: (id: string) => request<void>(`/trusted-contacts/${id}`, { method: 'DELETE' }),
  currentSession: () => request<Data<SafeSession | null>>('/safe-sessions/current').then(unwrap),
  startSession: (data: { datecito_id: string; contact_ids: string[]; check_in_minutes: number; share_location: boolean }) =>
    request<Data<SafeSession>>('/safe-sessions', { method: 'POST', body: data }).then(unwrap),
  checkIn: (id: string) => request<Data<SafeSession>>(`/safe-sessions/${id}/check-in`, { method: 'POST' }).then(unwrap),
  help: (id: string) => request<Data<SafeSession>>(`/safe-sessions/${id}/help`, { method: 'POST' }).then(unwrap),
  endSession: (id: string) => request<Data<SafeSession>>(`/safe-sessions/${id}/end`, { method: 'POST' }).then(unwrap),
  verification: () => request<{ status: string; verified: boolean }>('/verification'),
  submitSelfie: (uri: string, mimeType: string | undefined, pose: string) =>
    request<{ status: string; verified: boolean }>('/verification', { method: 'POST', form: selfieForm(uri, mimeType, pose), timeoutMs: 60000 }),
};

export const here = {
  current: () => request<Data<HereSession | null>>('/here').then(unwrap),
  start: (data: { place: string; lat: number; lng: number; minutes: number; verified_only: boolean }) =>
    request<Data<HereSession>>('/here', { method: 'POST', body: data }).then(unwrap),
  stop: () => request<void>('/here', { method: 'DELETE' }),
  people: () => request<Data<HerePerson[]>>('/here/people').then(unwrap),
  greet: (user_id: string) => request<{ matched: boolean; connection_id: string | null }>('/here/greets', { method: 'POST', body: { user_id } }),
  hide: (user_id: string) => request<void>('/here/hidden', { method: 'POST', body: { user_id } }),
};

export const membership = {
  get: () => request<Data<Membership>>('/membership').then(unwrap),
  purchase: (product_id: string, purchase_token: string, store: 'google_play' | 'app_store' | 'fake') =>
    request<Data<Membership>>('/membership/purchases', { method: 'POST', body: { store, product_id, purchase_token } }).then(unwrap),
};
