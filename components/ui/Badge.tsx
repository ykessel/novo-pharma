import { Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import type { ColorTokens } from '../../types/theme';

export type BadgeTone = 'rx' | 'success' | 'warning' | 'neutral';
export type MedicationStatus = 'rx_required' | 'pending_verification' | 'in_stock';

interface BadgeProps {
  label?: string;
  tone?: BadgeTone;
  status?: MedicationStatus;
}

function toneStyle(tone: BadgeTone, colors: ColorTokens) {
  switch (tone) {
    case 'rx':
      return { bg: colors.dangerBg, text: colors.danger };
    case 'success':
      return { bg: colors.accentSoft, text: colors.accentText };
    case 'warning':
      return { bg: colors.elevated, text: colors.warning };
    case 'neutral':
      return { bg: colors.elevated, text: colors.textPrimary };
  }
}

const statusConfig: Record<MedicationStatus, { label: string; tone: BadgeTone }> = {
  rx_required: { label: 'Requiere receta', tone: 'rx' },
  pending_verification: { label: 'En verificación', tone: 'warning' },
  in_stock: { label: 'En stock', tone: 'success' },
};

export function Badge({ label, tone, status }: BadgeProps) {
  const { colors } = useTheme();
  const resolvedTone = tone ?? (status ? statusConfig[status].tone : 'neutral');
  const resolvedLabel = label ?? (status ? statusConfig[status].label : '');
  const { bg, text } = toneStyle(resolvedTone, colors);

  return (
    <View
      accessibilityRole="text"
      style={{ backgroundColor: bg }}
      className="rounded-full px-3 py-1 self-start"
    >
      <Text style={{ color: text }} className="text-xs font-medium">{resolvedLabel}</Text>
    </View>
  );
}
