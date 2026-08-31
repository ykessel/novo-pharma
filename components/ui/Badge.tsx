import { Text, View } from 'react-native';

export type BadgeTone = 'rx' | 'success' | 'warning' | 'neutral';
export type MedicationStatus = 'rx_required' | 'pending_verification' | 'in_stock';

interface BadgeProps {
  label?: string;
  tone?: BadgeTone;
  status?: MedicationStatus;
}

const toneClasses: Record<BadgeTone, string> = {
  rx: 'bg-rx/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  neutral: 'bg-slate-100',
};

const toneTextClasses: Record<BadgeTone, string> = {
  rx: 'text-rx',
  success: 'text-success',
  warning: 'text-warning',
  neutral: 'text-slate-900',
};

const statusConfig: Record<MedicationStatus, { label: string; tone: BadgeTone }> = {
  rx_required: { label: 'Requiere receta', tone: 'rx' },
  pending_verification: { label: 'En verificación', tone: 'warning' },
  in_stock: { label: 'En stock', tone: 'success' },
};

export function Badge({ label, tone, status }: BadgeProps) {
  const resolvedTone = tone ?? (status ? statusConfig[status].tone : 'neutral');
  const resolvedLabel = label ?? (status ? statusConfig[status].label : '');

  return (
    <View
      accessibilityRole="text"
      className={`rounded-full px-3 py-1 self-start ${toneClasses[resolvedTone]}`}
    >
      <Text className={`text-xs font-medium ${toneTextClasses[resolvedTone]}`}>{resolvedLabel}</Text>
    </View>
  );
}
