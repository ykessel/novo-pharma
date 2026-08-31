// app/(tabs)/cart.tsx — cart with prescription gating + empty state
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ShoppingBag, Store, Camera, Lock } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatPrice } from '../../utils/format';

const SHIPPING_CENTS = 499;

export default function CartScreen() {
  const { colors } = useTheme();
  const inset = useTabBarContentInset();
  const lines = useCartStore((s) => s.lines);
  // TODO: move onto CartLine in useCartStore once the prescription API lands
  const [attached] = useState<Record<string, string | undefined>>({});

  if (lines.length === 0) {
    return (
      <View style={{ backgroundColor: colors.bg }} className="flex-1 px-5">
        <Text style={{ color: colors.textPrimary }} className="pb-2 pt-4 font-bold text-xl">Carrito</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
          <EmptyState
            icon={ShoppingBag}
            title="Tu carrito está vacío"
            body="Empieza por lo que ya compraste antes, o busca por síntoma y te decimos qué sirve."
            primary={{ label: 'Ir a la tienda', icon: Store, onPress: () => router.push('/(tabs)') }}
            secondary={{ label: 'Comprar con mi receta', icon: Camera, onPress: () => router.push('/prescription/upload') }}
          />
        </ScrollView>
      </View>
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
  const blocked = lines.filter((l) => l.product.requiresRx && !attached[l.product.id]);

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <Text style={{ color: colors.textPrimary }} className="px-5 pb-2 pt-4 font-bold text-xl">Carrito</Text>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: inset + 96 }} showsVerticalScrollIndicator={false}>
        {lines.map(({ product, quantity }) => {
          const needsRx = product.requiresRx && !attached[product.id];
          return (
            <View
              key={product.id}
              style={{ backgroundColor: colors.surface, borderColor: needsRx ? colors.danger : colors.border }}
              className="mb-3 rounded-card border p-3"
            >
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: colors.elevated }}
                />
                <View className="flex-1">
                  <Text style={{ color: colors.textPrimary }} className="font-medium text-sm">{product.name}</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-[10.5px]">
                    {product.dosage} · {quantity} ud.
                  </Text>
                </View>
                <Text style={{ color: colors.textPrimary }} className="font-mono text-sm">
                  {formatPrice(product.priceCents * quantity)}
                </Text>
              </View>

              {needsRx ? (
                <View style={{ backgroundColor: colors.dangerBg }} className="mt-3 flex-row items-center gap-2.5 rounded-xl p-3">
                  <Lock color={colors.danger} size={19} />
                  <View className="flex-1">
                    <Text style={{ color: colors.danger }} className="font-medium text-xs">
                      Necesita receta para despachar
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px]">
                      Sube una foto o usa una receta aprobada
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Adjuntar receta para ${product.name}`}
                    onPress={() => router.push('/prescription/upload')}
                    style={{ backgroundColor: colors.danger }}
                    className="min-h-[36px] justify-center rounded-[10px] px-3"
                  >
                    <Text style={{ color: colors.surface }} className="font-bold text-[11.5px]">Adjuntar</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={{ backgroundColor: colors.elevated }} className="mt-2 gap-2.5 rounded-card p-4">
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">Subtotal</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">Envío express</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(SHIPPING_CENTS)}</Text>
          </View>
          <View style={{ backgroundColor: colors.border }} className="mt-1 h-px" />
          <View className="flex-row items-baseline justify-between">
            <Text style={{ color: colors.textPrimary }} className="font-bold text-sm">Total</Text>
            <Text style={{ color: colors.textPrimary }} className="font-mono text-lg">
              {formatPrice(subtotal + SHIPPING_CENTS)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{ backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: inset - 60 }}
        className="absolute inset-x-0 bottom-0 border-t px-4 pt-3"
      >
        {blocked.length > 0 ? (
          <Text style={{ color: colors.textSecondary }} className="mb-2.5 text-[11.5px]">
            {blocked.length} artículo{blocked.length > 1 ? 's esperan' : ' espera'} receta · el resto sale igual
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir a pagar"
          onPress={() => router.push('/order/checkout')}
          style={{ backgroundColor: colors.accent }}
          className="min-h-[54px] items-center justify-center rounded-button"
        >
          <Text style={{ color: colors.accentInk }} className="font-bold text-[14.5px]">
            Ir a pagar · {formatPrice(subtotal + SHIPPING_CENTS)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
