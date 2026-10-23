import { Platform, TextStyle } from 'react-native';

/** Paleta oficial — Manual de identidad visual Datecito. */
export const colors = {
  verde: '#0F3D32',
  verdeSoft: '#1E5446',
  coral: '#FF6B6B',
  coralStrong: '#EF5A5A',
  durazno: '#FFD6CC',
  duraznoSoft: '#FFEDE7',
  crema: '#F9F3EC',
  arena: '#D7C9BD',

  bg: '#F9F3EC',
  surface: '#FFFFFF',
  surfaceAlt: '#F3ECE3',
  ink: '#0F3D32',
  text: '#2B3A35',
  muted: '#6E7B76',
  subtle: '#9AA49F',
  border: '#E7DDD2',
  white: '#FFFFFF',
  success: '#2E9D6E',
  danger: '#D64545',
  overlay: 'rgba(15, 61, 50, 0.55)',
} as const;

export const fonts = {
  regular: 'NunitoSans_400Regular',
  semibold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  extrabold: 'NunitoSans_800ExtraBold',
} as const;

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, xxl: 32, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;

/** Escala tipográfica: Display 800, H1 700, H2 600, Body 400, CTA 700, Caption 400. */
export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 38, lineHeight: 42, letterSpacing: -1, color: colors.ink },
  h1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, color: colors.ink },
  h2: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 25, color: colors.ink },
  h3: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.text },
  cta: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.muted },
  label: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2, color: colors.coralStrong },
} satisfies Record<string, TextStyle>;

export const shadow = Platform.select({
  ios: { shadowColor: '#0F3D32', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  default: { elevation: 3, shadowColor: '#0F3D32' },
});
