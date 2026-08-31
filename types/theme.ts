// types/theme.ts — replaces the teal token set
export interface ColorTokens {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  accent: string;
  accentInk: string;
  accentText: string;
  accentSoft: string;
  info: string;
  danger: string;
  dangerBg: string;
  warning: string;
}

export const darkColors: ColorTokens = {
  bg: '#0D0F12',
  surface: '#15181D',
  elevated: '#1D2128',
  border: '#22262D',
  textPrimary: '#F4F5F6',
  textSecondary: '#8B929E',
  textDim: '#6D7480',
  accent: '#C7F04A',
  accentInk: '#111409',
  accentText: '#C7F04A',
  accentSoft: 'rgba(199,240,74,0.10)',
  info: '#55D3E0',
  danger: '#FF8B78',
  dangerBg: 'rgba(255,107,90,0.10)',
  warning: '#FFC46B',
};

export const lightColors: ColorTokens = {
  bg: '#F3F5F1',
  surface: '#FFFFFF',
  elevated: '#E9EDE3',
  border: '#E0E4DC',
  textPrimary: '#14170F',
  textSecondary: '#656C5F',
  textDim: '#98A092',
  accent: '#C7F04A',
  accentInk: '#1B2109',
  // lime text fails contrast on white — use olive for text/icons only
  accentText: '#4E6B0A',
  accentSoft: 'rgba(199,240,74,0.30)',
  info: '#0E7C8C',
  danger: '#B8412A',
  dangerBg: 'rgba(184,65,42,0.08)',
  warning: '#9A6A08',
};

/** Default export kept as `colors` so existing imports keep compiling. */
export const colors: ColorTokens = darkColors;

export const radius = {
  card: 18,
  button: 14,
  pill: 999,
} as const;

export const touchTarget = 44;
