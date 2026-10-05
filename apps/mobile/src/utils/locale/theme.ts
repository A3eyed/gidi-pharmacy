/**
 * GiDi's two-tone palette. Dark mode is a complete inversion of light mode,
 * keeping the app strictly black and white in both themes.
 */
export type Palette = {
  bg: string;
  surface: string;
  subtle: string;
  divider: string;
  border: string;
  borderStrong: string;
  text: string;
  textSoft: string;
  textMuted: string;
  placeholder: string;
  inverseBg: string;
  inverseText: string;
  /** Gold accent used for highlights, active states and key actions. */
  gold: string;
  /** Translucent gold wash for glass panels that need emphasis. */
  goldSoft: string;
  goldLine: string;
  /** Translucent surface colour that sits on top of a blur. */
  glass: string;
  glassStrong: string;
  glassBorder: string;
};

export const LIGHT: Palette = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  subtle: '#FAFAFA',
  divider: '#F5F5F5',
  border: '#E5E5E5',
  borderStrong: '#D4D4D4',
  text: '#000000',
  textSoft: '#404040',
  textMuted: '#737373',
  placeholder: '#A3A3A3',
  inverseBg: '#000000',
  inverseText: '#FFFFFF',
  gold: '#C9A227',
  goldSoft: 'rgba(201,162,39,0.12)',
  goldLine: 'rgba(201,162,39,0.35)',
  glass: 'rgba(255,255,255,0.55)',
  glassStrong: 'rgba(255,255,255,0.8)',
  glassBorder: 'rgba(255,255,255,0.75)',
};

export const DARK: Palette = {
  bg: '#000000',
  surface: '#000000',
  subtle: '#0A0A0A',
  divider: '#171717',
  border: '#262626',
  borderStrong: '#404040',
  text: '#FFFFFF',
  textSoft: '#D4D4D4',
  textMuted: '#A3A3A3',
  placeholder: '#737373',
  inverseBg: '#FFFFFF',
  inverseText: '#000000',
  gold: '#E3C65C',
  goldSoft: 'rgba(227,198,92,0.14)',
  goldLine: 'rgba(227,198,92,0.32)',
  glass: 'rgba(24,24,24,0.55)',
  glassStrong: 'rgba(14,14,14,0.8)',
  glassBorder: 'rgba(255,255,255,0.10)',
};

/**
 * Module-level palette, kept in sync by PreferencesProvider.
 * Screens normally read colours through `useTheme()`, but this is handy for
 * helpers that run outside React.
 */
export let activePalette: Palette = LIGHT;

export function setActivePalette(palette: Palette) {
  activePalette = palette;
}
