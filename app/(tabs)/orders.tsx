// app/(tabs)/orders.tsx — active orders, skeleton, empty state, reorder
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ReceiptText, Store, CalendarSync } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonProductRow } from '../../components/ui/Skeleton';
import { formatPrice } from '../../utils/format';

interface ActiveOrder {
  id: string;
  status: 'en_route' | 'awaiting_prescription';
  totalCents: number;
  etaMinutes: number;
  itemCount: number;
}

export default function OrdersScreen() {
  const { colors } = useTheme();
  const inset = useTabBarContentInset();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<ActiveOrder[]>([]);

  useEffect(() => {
    // TODO: replace with the real orders endpoint
    const t = setTimeout(() => { setOrders([]); setLoading(false); }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 px-5">
      <Text style={{ color: colors.textPrimary }} className="pb-3 pt-4 font-bold text-xl">Pedidos</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <>
            <SkeletonProductRow />
            <SkeletonProductRow />
            <SkeletonProductRow />
          </>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Ningún pedido activo"
            body="Cuando compres, aquí verás el mensajero en el mapa y el minuto exacto de llegada."
            primary={{ label: 'Hacer mi primer pedido', icon: Store, onPress: () => router.push('/(tabs)') }}
          >
            <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-4">
              <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">
                CÓMO FUNCIONA
              </Text>
              {[
                ['Arma tu pedido', 'Sin receta se despacha directo; los controlados esperan validación.'],
                ['Un farmacéutico revisa', 'Chequea dosis e interacciones con lo que ya tomas.'],
                ['Llega en 30 minutos', 'O retíralo gratis en la sucursal que elijas.'],
              ].map(([title, body], i) => (
                <View key={title} className="mt-4 flex-row gap-3">
                  <View style={{ backgroundColor: colors.elevated }} className="h-6 w-6 items-center justify-center rounded-full">
                    <Text style={{ color: colors.accentText }} className="font-mono text-[11px]">{i + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.textPrimary }} className="font-medium text-[13px]">{title}</Text>
                    <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px] leading-[17px]">{body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </EmptyState>
        ) : (
          orders.map((order) => (
            <Pressable
              key={order.id}
              accessibilityRole="button"
              accessibilityLabel={`Pedido ${order.id}`}
              onPress={() => router.push(`/order/${order.id}`)}
              style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
              className="mb-3 rounded-card border p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View style={{ backgroundColor: colors.accent }} className="h-2 w-2 rounded-full" />
                  <Text style={{ color: colors.accentText }} className="font-bold text-[9.5px] tracking-[1.6px]">
                    EN CAMINO · {order.etaMinutes} MIN
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary }} className="font-mono text-[11px]">#{order.id}</Text>
              </View>
              <Text style={{ color: colors.textPrimary }} className="mt-3 font-mono text-[15px]">
                {formatPrice(order.totalCents)} · {order.itemCount} productos
              </Text>
            </Pressable>
          ))
        )}

        {!loading ? (
          <View style={{ backgroundColor: colors.elevated }} className="mt-4 flex-row items-center gap-3 rounded-card p-4">
            <CalendarSync color={colors.info} size={20} />
            <View className="flex-1">
              <Text style={{ color: colors.textPrimary }} className="font-medium text-[12.5px]">Suscripción mensual</Text>
              <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px] leading-4">
                Tus crónicos llegan solos cada 30 días · 8% menos
              </Text>
            </View>
            <Text style={{ color: colors.accentText }} className="font-bold text-[11.5px]">Activar</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
