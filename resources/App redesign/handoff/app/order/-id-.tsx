// app/order/[id].tsx — live order tracking
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, MessageCircle, BadgeCheck } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { LoadingSteps, type LoadingStep } from '../../components/ui/LoadingSteps';

const STEPS: LoadingStep[] = [
  { label: 'Pago aprobado', state: 'done', meta: '08:24' },
  { label: 'Empacado en sucursal Naco', state: 'done', meta: '08:47' },
  { label: 'En camino', state: 'active', meta: '2.4 km' },
  { label: 'Entregado', state: 'pending', meta: 'cédula' },
];

export default function OrderTrackingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      {/* Map surface — drop react-native-maps here */}
      <View style={{ backgroundColor: colors.elevated, height: 280 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          style={{ backgroundColor: colors.surface, top: insets.top + 8, left: 16, position: 'absolute' }}
          className="h-touch w-touch items-center justify-center rounded-xl"
        >
          <ArrowLeft color={colors.textPrimary} size={20} />
        </Pressable>
      </View>

      <ScrollView
        style={{ backgroundColor: colors.bg, marginTop: -22, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 24) }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-baseline gap-2.5">
          <Text style={{ color: colors.textPrimary }} className="font-mono text-[32px]">09:12</Text>
          <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">llegada · 6 min</Text>
        </View>
        <Text style={{ color: colors.accentText }} className="mt-2 text-[11.5px]">Pedido #{id} · 3 productos</Text>

        <View className="mt-5"><LoadingSteps steps={STEPS} /></View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 flex-row items-center gap-3 rounded-card border p-4">
          <View style={{ backgroundColor: colors.elevated }} className="h-[46px] w-[46px] items-center justify-center rounded-full">
            <Text style={{ color: colors.textSecondary }} className="font-bold text-[13px]">JC</Text>
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">Julio C.</Text>
            <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px]">Mensajero · 4.9 ★ · moto roja</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Llamar al mensajero"
            style={{ backgroundColor: colors.accent }}
            className="h-touch w-touch items-center justify-center rounded-xl"
          >
            <Phone color={colors.accentInk} size={20} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Escribir al mensajero"
            style={{ borderColor: colors.border }}
            className="h-touch w-touch items-center justify-center rounded-xl border"
          >
            <MessageCircle color={colors.textSecondary} size={20} />
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.elevated }} className="mt-3 flex-row items-center gap-2.5 rounded-card p-3.5">
          <BadgeCheck color={colors.info} size={18} />
          <Text style={{ color: colors.textSecondary }} className="flex-1 text-[11.5px] leading-[17px]">
            Ten tu cédula a mano: los medicamentos con receta se entregan con firma.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
