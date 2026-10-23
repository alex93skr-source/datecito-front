/** Tipos de la API de administración (/api/v1/admin). Espejo de los Resources de Laravel. */

export type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null } & Record<string, unknown>;
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
};

export type Data<T> = { data: T };

export type UserStatus = 'active' | 'paused' | 'suspended' | 'banned';
export type UserRole = 'user' | 'moderator' | 'admin';
export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type Platform = 'ios' | 'android' | 'web';
export type Plan = 'monthly' | 'yearly';
export type Store = 'google_play' | 'app_store' | 'fake';

export type UserMini = { id: string; name: string | null; email: string | null; status: UserStatus | null } | null;

export type StaffMe = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  permissions: { moderate: boolean; administer: boolean };
};

export type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  age: number | null;
  gender: string | null;
  zone: string | null;
  status: UserStatus;
  role: UserRole;
  email_verified: boolean;
  verified: boolean;
  verification_status: VerificationStatus;
  show_in_discover: boolean;
  photos_count: number | null;
  swipes_count: number | null;
  reports_received_count: number | null;
  super_likes_balance: number;
  membership: { plan: Plan; expires_at: string } | null;
  platform: Platform | null;
  app_version: string | null;
  tags: string[];
  last_seen_at: string | null;
  created_at: string;
};

export type Photo = { id: string; position: number; urls: { lg: string; md: string; sm: string } };

export type Subscription = {
  id: string;
  user?: UserMini;
  plan: Plan;
  store: Store;
  store_reference: string;
  granted: boolean;
  status: 'active' | 'expired' | 'cancelled';
  current: boolean;
  starts_at: string;
  expires_at: string;
  created_at: string;
};

export type Purchase = { id: string; user?: UserMini; product_id: string; store: Store; store_reference: string; quantity: number; created_at: string };

export type UserNote = { id: string; body: string; pinned: boolean; author?: UserMini; created_at: string; updated_at: string };

export type Verification = {
  id: string;
  user: UserMini;
  status: VerificationStatus;
  pose: string | null;
  selfie_url: string;
  profile_photo_url: string | null;
  reviewed_by?: UserMini;
  reviewed_at: string | null;
  created_at: string;
};

export type SwipeCounts = { like: number; pass: number; super: number; total: number };

export type UserStats = {
  swipes_given: SwipeCounts;
  swipes_received: SwipeCounts;
  connections: { total: number; active: number; with_messages: number };
  messages_sent: number;
  datecitos: { total: number; proposed_by_user: number; confirmed: number; cancelled: number };
  reports: { made: number; received: number; received_open: number };
  blocks: { made: number; received: number };
  safe_sessions: { total: number; help_requested: number };
  here_sessions_started: number;
  trusted_contacts: number;
  activity: { events: number; events_30d: number; active_days: number; first_event_at: string | null; sessions_open: number };
  account_age_days: number;
};

export type UserDetail = UserSummary & {
  profile: {
    birthdate: string | null;
    interested_in: string[];
    job: string | null;
    bio: string | null;
    intent: string | null;
    relationship_type: string | null;
    interests: string[];
    music: { genres: string[]; artists: string[]; anthem: string | null };
    basics: Record<string, string>;
    languages: string[];
    prompts: { q: string; a: string }[];
    has_location: boolean;
  };
  settings: Record<string, boolean>;
  photos: Photo[];
  membership: { status: 'active' | 'launch' | 'inactive'; launch_free: boolean; plan: Plan | null; expires_at: string | null; super_likes: { free_today: number; purchased: number } };
  subscriptions: Subscription[];
  purchases: Purchase[];
  verification_requests: Verification[];
  notes: UserNote[];
  stats: UserStats;
  signup_platform: Platform | null;
  email_verified_at: string | null;
  verified_at: string | null;
  updated_at: string | null;
};

export type ActivityEvent = {
  id: number;
  user?: UserMini;
  name: string;
  category: 'api' | 'client' | 'system';
  properties: Record<string, unknown>;
  platform: Platform | null;
  app_version: string | null;
  status: number | null;
  duration_ms: number | null;
  occurred_at: string;
};

export type AdminAction = {
  id: number;
  actor?: UserMini;
  action: string;
  subject_type: string | null;
  subject_id: string | null;
  subject: UserMini;
  changes: Record<string, unknown>;
  note: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  reason: string;
  details: string | null;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  resolution_note: string | null;
  reporter: { id: string; name: string | null; email: string | null };
  reported: { id: string; name: string | null; email: string | null; status: UserStatus; verified: boolean; reports_received: number | null } | null;
  handled_by?: UserMini;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  source: 'discover' | 'here';
  users: [UserMini, UserMini];
  messages_count: number | null;
  datecitos_count: number | null;
  last_message_at: string | null;
  active: boolean;
  ended_at: string | null;
  ended_by: string | null;
  datecitos?: Datecito[];
  created_at: string;
};

export type Message = { id: string; sender_id: string; body: string; created_at: string };

export type Datecito = {
  id: string;
  connection_id: string;
  proposer_id: string;
  users: UserMini[];
  kind: string;
  place: string;
  zone: string;
  when_label: string;
  scheduled_on: string | null;
  note: string | null;
  status: 'proposed' | 'confirmed' | 'cancelled';
  confirmed_at: string | null;
  cancelled_at: string | null;
  feedback_count: number | null;
  created_at: string;
};

export type SafeSession = {
  id: string;
  user: UserMini;
  datecito: Datecito;
  status: 'active' | 'help' | 'overdue' | 'ended';
  check_in_at: string;
  help_requested_at: string | null;
  ended_at: string | null;
  share_location: boolean;
  contacts_count: number;
  created_at: string;
};

export type HereSession = { id: string; user: UserMini; place: string; verified_only: boolean; ends_at: string; created_at: string };

export type Staff = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  last_seen_at: string | null;
  actions_total: number;
  actions_30d: number;
  last_action_at: string | null;
  created_at: string;
};

/* Métricas */

export type PeriodInfo = { from: string; to: string; interval: 'day' | 'week' | 'month'; days: number };
export type Kpi = { value: number; previous: number; change_pct: number | null };
export type Point = { date: string; value: number };
export type Slice = { label: string; value: number };

export type Overview = {
  period: PeriodInfo;
  totals: Record<string, number>;
  activity: { dau: number; wau: number; mau: number; online_15m: number };
  kpis: Record<string, Kpi>;
  rates: Record<string, number>;
};

export type Series = { period: PeriodInfo; metric: string; label: string; series: Point[] };

export type Funnel = { period: PeriodInfo; steps: { key: string; label: string; count: number; pct_of_total: number; pct_of_previous: number }[] };

export type Retention = { weeks: number; cohorts: { cohort: string; size: number; retention: (number | null)[] }[] };

export type Breakdowns = {
  period: PeriodInfo;
  users: Record<string, Slice[]>;
  behavior: Record<string, Slice[]> & {
    top_events: { name: string; category: string; count: number; users: number }[];
    heatmap: { dow: number; hour: number; value: number }[];
  };
};

export type Live = {
  at: string;
  online_15m: number;
  events_per_minute: number;
  errors_15m: number;
  here_live: number;
  safe_sessions: { active: number; help: number; overdue: number };
  reports_open: number;
  verifications_pending: number;
  today: { signups: number; swipes: number; matches: number; messages: number; datecitos: number; revenue: number };
  recent_events: { id: number; name: string; category: string; platform: Platform | null; status: number | null; user: { id: string; name: string | null } | null; occurred_at: string }[];
};

export type Billing = {
  period: PeriodInfo;
  currency: string;
  pricing: Record<string, { product_id: string; price: number; quantity?: number }> & { currency: string };
  members: { total: number; monthly: number; yearly: number };
  mrr: number;
  revenue: Kpi;
  subscriptions_new: Kpi;
  purchases_new: Kpi;
  expired: number;
  cancelled: number;
  by_store: Slice[];
  by_plan: Slice[];
  revenue_series: Point[];
  conversion: { users: number; ever_paid: number };
  launch_free: boolean;
};

export type EventName = { name: string; category: string; count: number; users: number };

export type RoutePerformance = { name: string; count: number; avg_ms: number; max_ms: number; errors_5xx: number; errors_4xx: number };

export type Settings = {
  app: { name: string; env: string; url: string; timezone: string };
  flags: { launch_free: boolean; fake_purchases: boolean; auto_verify: boolean };
  pricing: Billing['pricing'];
  limits: Record<string, number | number[]>;
  catalog: { report_reasons: string[]; plan_kinds: string[]; genders: string[]; intents: string[] };
  roles: Record<string, number>;
  health: { queue_pending: number; queue_failed: number; queue_oldest_pending_seconds: number; last_event_at: string | null; events_total: number };
};
