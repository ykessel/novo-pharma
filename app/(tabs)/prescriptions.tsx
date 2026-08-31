import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FileText, Plus, ShieldCheck } from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { colors } from '../../types/theme';
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

function EmptyPrescriptions() {
  return (
    <View className="items-center gap-6 rounded-card border border-slate-100 bg-white px-6 py-10">
      <View className="h-40 w-40 items-center justify-center rounded-full bg-brand-secondary">
        <FileText color={colors.brandPrimary} size={72} strokeWidth={1.5} />
      </View>

      <View className="gap-2">
        <Text className="text-center text-2xl font-bold text-slate-900">No tienes recetas activas</Text>
        <Text className="text-center text-base text-slate-500">
          Sube una foto de tu receta médica para empezar a pedir tus medicamentos de forma segura y rápida.
        </Text>
      </View>

      <View className="w-full gap-3">
        <Button label="Subir nueva receta" icon={Plus} onPress={() => router.push('/prescription/upload')} />
        <Button label="Ver historial de recetas" variant="secondary" onPress={() => {}} />
      </View>

      <View className="flex-row items-center gap-2 opacity-80">
        <ShieldCheck color={colors.textSecondary} size={16} />
        <Text className="text-xs text-slate-500">Carga segura y confidencial</Text>
      </View>
    </View>
  );
}

export default function PrescriptionsScreen() {
  const tabBarInset = useTabBarContentInset();
  const isEmpty = MOCK_PRESCRIPTIONS.length === 0;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      {!isEmpty ? <Button label="Subir nueva receta" icon={Plus} onPress={() => router.push('/prescription/upload')} /> : null}

      <FlatList
        className={isEmpty ? undefined : 'mt-4'}
        contentContainerStyle={
          isEmpty ? { flexGrow: 1, justifyContent: 'center', paddingBottom: tabBarInset } : { paddingBottom: tabBarInset }
        }
        data={MOCK_PRESCRIPTIONS}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyPrescriptions}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
            <Text className="mt-2 text-sm text-slate-500">{formatDate(item.createdAt)}</Text>
          </Card>
        )}
      />
    </View>
  );
}
