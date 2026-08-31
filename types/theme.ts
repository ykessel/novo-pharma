export interface ColorTokens {
  brandPrimary: string;
  brandSecondary: string;
  accent: string;
  rx: string;
  success: string;
  warning: string;
  bg: string;
  textPrimary: string;
  textSecondary: string;
  placeholder: string;
  border: string;
}

export const colors: ColorTokens = {
  brandPrimary: '#0F766E',
  brandSecondary: '#E6F4F1',
  accent: '#F97316',
  rx: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  bg: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  placeholder: '#94A3B8',
  border: '#E2E8F0',
};

export const radius = {
  card: 16,
  button: 12,
} as const;

export const touchTarget = 44;
