// app/prescription/index.tsx — moved from (tabs); reached from Profile, not a tab
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FileText, Plus, ShieldCheck } from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import type { Prescription, PrescriptionStatus } from '../../types/prescription';
import { formatDate } from '../../utils/format';

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

const STATUS_TONE: Record<PrescriptionStatus, 'warning' | 'success' | 'rx' | 'neutral'> = {
  pending: 'neutral',
  in_review: 'warning',
  approved: 'success',
  rejected: 'rx',
};

const MOCK_PRESCRIPTIONS: Prescription[] = [];

export default function PrescriptionListScreen() {
  const { colors } = useTheme();
  const isEmpty = MOCK_PRESCRIPTIONS.length === 0;

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 p-4">
      {!isEmpty ? <Button label="Subir nueva receta" icon={Plus} onPress={() => router.push('/prescription/upload')} /> : null}

      <FlatList
        className={isEmpty ? undefined : 'mt-4'}
        contentContainerStyle={isEmpty ? { flexGrow: 1, justifyContent: 'center' } : undefined}
        data={MOCK_PRESCRIPTIONS}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon={FileText}
            title="No tienes recetas activas"
            body="Sube una foto de tu receta médica para empezar a pedir tus medicamentos de forma segura y rápida."
            primary={{ label: 'Subir nueva receta', icon: Plus, onPress: () => router.push('/prescription/upload') }}
          >
            <View className="flex-row items-center justify-center gap-2 opacity-80">
              <ShieldCheck color={colors.textSecondary} size={16} />
              <Text style={{ color: colors.textSecondary }} className="text-xs">Carga segura y confidencial</Text>
            </View>
          </EmptyState>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
            <Text style={{ color: colors.textSecondary }} className="mt-2 text-sm">{formatDate(item.createdAt)}</Text>
          </Card>
        )}
      />
    </View>
  );
}
