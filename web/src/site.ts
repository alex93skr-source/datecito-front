import type { IconName } from './components/Icon';
import type { Lang } from './lang';

/** Datos de la empresa. Los marcados con [ ] se completan con asesoría legal. */
export const company = {
  brand: 'Datecito',
  legalName: '[Razón social, S.A.P.I. de C.V.]',
  rfc: '[RFC]',
  address: '[Calle, número, colonia, alcaldía/municipio, C.P., Ciudad de México, México]',
  addressEn: '[Street, number, neighborhood, borough/municipality, ZIP code, Mexico City, Mexico]',
  domain: 'datecito.com',
  emails: {
    support: 'ayuda@datecito.com',
    privacy: 'privacidad@datecito.com',
    legal: 'legal@datecito.com',
    press: 'prensa@datecito.com',
    jobs: 'empleos@datecito.com',
    security: 'seguridad@datecito.com',
    safety: 'confianza@datecito.com',
    authorities: 'autoridades@datecito.com',
    partners: 'alianzas@datecito.com',
    ip: 'propiedadintelectual@datecito.com',
    accessibility: 'accesibilidad@datecito.com',
  },
  updated: { es: '15 de octubre de 2026', en: 'October 15, 2026' } as Record<Lang, string>,
  pricing: { currency: 'MXN', monthly: 200, yearly: 1999, superPack: 59, superPackQty: 10 },
};

export const money = (n: number) => `${Number.isInteger(n) ? n.toLocaleString('es-MX') : n.toFixed(2)} ${company.pricing.currency}`;

export type NavLink = { to: string; label: string; desc?: string; icon?: IconName };
export type NavGroup = { label: string; to?: string; items?: NavLink[] };

type Text = Record<Lang, string>;
type NavDef = { to: string; label: Text; desc?: Text; icon?: IconName };
const loc = (lang: Lang) => (n: NavDef): NavLink => ({ to: n.to, icon: n.icon, label: n.label[lang], desc: n.desc?.[lang] });

const products: NavDef[] = [
  { to: '/funciones', label: { es: 'Funciones', en: 'Features' }, desc: { es: 'Todo lo que puedes hacer en Datecito', en: 'Everything you can do on Datecito' }, icon: 'sparkle' },
  { to: '/membresia', label: { es: 'Membresía', en: 'Membership' }, desc: { es: 'Un solo plan, todo incluido', en: 'One plan, everything included' }, icon: 'star' },
  { to: '/super-likes-y-boost', label: { es: 'Super likes y Boost', en: 'Super Likes & Boost' }, desc: { es: 'Destaca cuando más importa', en: 'Stand out when it matters' }, icon: 'bolt' },
  { to: '/datecitos', label: { es: 'Datecitos', en: 'Datecitos' }, desc: { es: 'Del match al plan en un toque', en: 'From match to plan in one tap' }, icon: 'coffee' },
  { to: '/aqui-y-ahora', label: { es: 'Aquí y ahora', en: 'Here & Now' }, desc: { es: 'Gente disponible cerca, hoy', en: 'People nearby, free today' }, icon: 'radio' },
  { to: '/verificacion', label: { es: 'Verificación', en: 'Verification' }, desc: { es: 'Perfiles reales con selfie', en: 'Real profiles, selfie-verified' }, icon: 'shield' },
  { to: '/universitarios', label: { es: 'Datecito U', en: 'Datecito U' }, desc: { es: 'Para tu comunidad universitaria', en: 'For your college community' }, icon: 'graduation' },
];

const learn: NavDef[] = [
  { to: '/blog', label: { es: 'Vida Datecito', en: 'Datecito Life' }, desc: { es: 'Historias, tendencias y cultura', en: 'Stories, trends and culture' }, icon: 'book' },
  { to: '/consejos', label: { es: 'Consejos para citas', en: 'Dating tips' }, desc: { es: 'Del primer mensaje al segundo datecito', en: 'From first message to second date' }, icon: 'heart' },
  { to: '/destinos', label: { es: 'Destinos', en: 'Destinations' }, desc: { es: 'Ideas de datecito por ciudad', en: 'Date ideas by city' }, icon: 'pin' },
  { to: '/historias', label: { es: 'Historias de éxito', en: 'Success stories' }, desc: { es: 'Parejas que empezaron aquí', en: 'Couples who started here' }, icon: 'heart-fill' },
];

const safety: NavDef[] = [
  { to: '/seguridad', label: { es: 'Centro de seguridad', en: 'Safety Center' }, desc: { es: 'Datecito Seguro y herramientas', en: 'Datecito Safe and tools' }, icon: 'shield' },
  { to: '/seguridad/consejos', label: { es: 'Consejos de seguridad', en: 'Safety tips' }, desc: { es: 'Antes, durante y después', en: 'Before, during and after' }, icon: 'check' },
  { to: '/seguridad/normas-de-la-comunidad', label: { es: 'Normas de la comunidad', en: 'Community guidelines' }, desc: { es: 'Lo que se vale y lo que no', en: "What's OK and what's not" }, icon: 'users' },
  { to: '/seguridad/politicas', label: { es: 'Seguridad y políticas', en: 'Safety & policy' }, desc: { es: 'Cómo moderamos y protegemos', en: 'How we moderate and protect' }, icon: 'scale' },
  { to: '/seguridad/recursos', label: { es: 'Líneas de apoyo', en: 'Support hotlines' }, desc: { es: 'Ayuda profesional y gratuita', en: 'Free professional help' }, icon: 'phone' },
];

export function getNav(lang: Lang): NavGroup[] {
  const l = loc(lang);
  const en = lang === 'en';
  return [
    { label: en ? 'Products' : 'Productos', items: products.map(l) },
    { label: en ? 'Learn' : 'Aprende', items: learn.map(l) },
    { label: en ? 'Safety' : 'Seguridad', items: safety.map(l) },
    { label: en ? 'Help' : 'Ayuda', to: '/ayuda' },
    { label: en ? 'Download' : 'Descargar', to: '/descargar' },
  ];
}

export function getProducts(lang: Lang) {
  return products.map(loc(lang));
}

export function getFooter(lang: Lang): { title: string; links: NavLink[] }[] {
  const en = lang === 'en';
  const L = (to: string, es: string, eng: string): NavLink => ({ to, label: en ? eng : es });
  return [
    {
      title: 'Legal',
      links: [
        L('/legal/privacidad', 'Aviso de privacidad', 'Privacy notice'),
        L('/legal/datos-sensibles', 'Política de datos sensibles', 'Sensitive data policy'),
        L('/legal/terminos', 'Términos y condiciones', 'Terms of use'),
        L('/legal/suscripciones', 'Términos de suscripción', 'Subscription terms'),
        L('/legal/cookies', 'Política de cookies', 'Cookie policy'),
        L('/legal/propiedad-intelectual', 'Propiedad intelectual', 'Intellectual property'),
        L('/legal', 'Todos los documentos', 'All documents'),
      ],
    },
    {
      title: en ? 'Company' : 'Empresa',
      links: [
        L('/nosotros', 'Acerca de Datecito', 'About Datecito'),
        L('/empleos', 'Empleos', 'Careers'),
        L('/tecnologia', 'Blog de tecnología', 'Tech blog'),
        L('/prensa', 'Sala de prensa', 'Press room'),
        L('/alianzas', 'Alianzas y negocios', 'Partnerships'),
        L('/marca', 'Recursos de marca', 'Brand assets'),
      ],
    },
    {
      title: en ? 'Safety' : 'Seguridad',
      links: [
        L('/seguridad', 'Centro de seguridad', 'Safety Center'),
        L('/seguridad/consejos', 'Consejos de seguridad', 'Safety tips'),
        L('/seguridad/normas-de-la-comunidad', 'Normas de la comunidad', 'Community guidelines'),
        L('/seguridad/autoridades', 'Guía para autoridades', 'Law enforcement guide'),
        L('/transparencia', 'Informe de transparencia', 'Transparency report'),
        L('/seguridad-informatica', 'Seguridad informática', 'Security'),
      ],
    },
    {
      title: en ? 'Help' : 'Ayuda',
      links: [
        L('/preguntas-frecuentes', 'Preguntas frecuentes', 'FAQ'),
        L('/ayuda', 'Centro de ayuda', 'Help Center'),
        L('/contacto', 'Contacto', 'Contact'),
        L('/codigo-promocional', 'Código promocional', 'Promo code'),
        L('/destinos', 'Destinos', 'Destinations'),
        L('/accesibilidad', 'Accesibilidad', 'Accessibility'),
        L('/mapa-del-sitio', 'Mapa del sitio', 'Sitemap'),
      ],
    },
  ];
}

export const socials: { name: string; icon: IconName; href: string }[] = [
  { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/datecito' },
  { name: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@datecito' },
  { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@datecito' },
  { name: 'X', icon: 'x-logo', href: 'https://x.com/datecito' },
  { name: 'Facebook', icon: 'facebook', href: 'https://facebook.com/datecito' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com/company/datecito' },
];
