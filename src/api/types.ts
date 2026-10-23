// Tipos de la API de Datecito (espejo de los Resources de Laravel).

export type Photo = { id: string; position: number; urls: { lg: string; md: string; sm: string } };

export type Prompt = { q: string; a: string };

export type Music = { genres: string[]; artists: string[]; anthem: string | null };

export type Person = {
  id: string;
  name: string | null;
  age: number | null;
  zone: string | null;
  distance_km: number | null;
  job: string | null;
  gender: string | null;
  bio: string | null;
  intent: string | null;
  relationship_type: string | null;
  interests: string[];
  /** Equipos por deporte, por ejemplo { "Fútbol": ["Pumas"] }. */
  teams: Record<string, string[]>;
  music: Music;
  basics: Record<string, string>;
  languages: string[];
  prompts: Prompt[];
  verified: boolean;
  /** Mandó su selfie y está en revisión. */
  verification_pending?: boolean;
  /** Sólo en Descubrir: esta persona te dio un Super like. */
  super_liked_me?: boolean;
  /** Sólo en "Quién te dio like". */
  liked_me?: boolean;
  photos?: Photo[];
};

export type FilterMode = 'prefer' | 'only';
export type Filters = {
  meet: string;
  minAge: number;
  maxAge: number;
  km: number;
  intents: string[];
  relationships: string[];
  interests: string[];
  genres: string[];
  lifestyle: string[];
  languages: string[];
  verifiedOnly: boolean;
  modes: Partial<Record<'intents' | 'relationships' | 'interests' | 'genres' | 'lifestyle' | 'languages', FilterMode>>;
};

export type Settings = {
  show_in_discover: boolean;
  show_gender: boolean;
  show_job: boolean;
  show_relationship: boolean;
  only_verified_messages: boolean;
  i_write_first: boolean;
  offensive_warning: boolean;
};

export type Pricing = {
  currency: string;
  monthly: { product_id: string; price: number };
  yearly: { product_id: string; price: number; weekly_boosts: number };
  super_like_pack: { product_id: string; price: number; quantity: number };
};

export type Membership = {
  status: 'active' | 'launch' | 'inactive';
  launch_free: boolean;
  plan: 'monthly' | 'yearly' | null;
  expires_at: string | null;
  super_likes: SuperLikes;
  pricing: Pricing;
};

export type Me = Omit<Person, 'distance_km' | 'verified'> & {
  email: string;
  email_verified: boolean;
  birthdate: string | null;
  interested_in: string[];
  has_location: boolean;
  photos: Photo[];
  settings: Settings;
  filters: Filters;
  verification: { status: 'none' | 'pending' | 'approved' | 'rejected'; verified: boolean };
  membership: Membership;
  profile_completion: number;
  is_moderator: boolean;
};

export type Connection = {
  id: string;
  source: 'discover' | 'here';
  created_at: string;
  person: Person;
  last_message: { preview: string; from_me: boolean; created_at: string } | null;
  has_active_datecito: boolean;
};

export type Message = { id: string; body: string; from_me: boolean; created_at: string };

export type PlanKind = 'cafe' | 'comida' | 'bar' | 'naturaleza' | 'cultura' | 'otro';

export type Datecito = {
  id: string;
  connection_id: string;
  person: Person;
  kind: PlanKind;
  place: string;
  zone: string;
  when_label: string;
  scheduled_on: string | null;
  scheduled_at: string | null;
  note: string | null;
  status: 'proposed' | 'confirmed' | 'cancelled';
  proposed_by_me: boolean;
  can_confirm: boolean;
  is_past: boolean;
  feedback_sent: boolean;
  created_at: string;
};

export type TrustedContact = { id: string; name: string; phone: string };

export type SafeSession = {
  id: string;
  datecito: Datecito;
  contacts: TrustedContact[];
  check_in_at: string;
  share_location: boolean;
  status: 'active' | 'help' | 'overdue' | 'ended';
  share_message: string;
};

export type HereSession = { id: string; place: string; verified_only: boolean; ends_at: string };

export type HerePerson = { person: Person; greeted: boolean };

export type ActivityItem = {
  type: 'match' | 'message' | 'datecito' | 'super_like';
  title: string;
  text: string;
  connection_id?: string;
  person_id?: string;
  datecito_id?: string;
  created_at: string;
};

/** Super like gratis: uno cada `every_days` días; `next_free_at` dice cuándo vuelve. */
export type SuperLikes = { free_today: number; purchased: number; next_free_at: string | null; every_days: number };

export type SwipeResult = { matched: boolean; connection_id: string | null; super_likes: SuperLikes; likes_left: number };

/** Silueta de quien te dio like cuando no hay membresía (sin id ni foto). */
export type LikeTeaser = { initial: string; age: number | null; zone: string | null; verified: boolean; super: boolean };

export type LikesReceived = { data: Person[]; meta: { count: number; locked: boolean; teasers?: LikeTeaser[] } };

/** Ritmo diario de Descubrir. */
export type DeckMeta = {
  likes_left: number;
  likes_per_day: number;
  profiles_left: number;
  profiles_per_day: number;
  resets_at: string;
  empty_reason: 'daily_limit' | 'exhausted' | null;
};
