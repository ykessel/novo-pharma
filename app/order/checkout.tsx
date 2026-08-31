// app/order/checkout.tsx — delivery, payment, and a blocking confirm state
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Home, CheckCircle2, HeartPulse, Lock, BellRing } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { LoadingSteps, type LoadingStep } from '../../components/ui/LoadingSteps';
import { formatPrice } from '../../utils/format';

const SHIPPING_CENTS = 499;
const INSURANCE_CENTS = 830;

const CONFIRM_STEPS: LoadingStep[] = [
  { label: 'Pago autorizado', state: 'done', meta: '•••• 4412' },
  { label: 'Stock reservado', state: 'done', meta: 'Naco' },
  { label: 'Farmacéutico revisando la receta', state: 'active' },
  { label: 'Asignando mensajero', state: 'pending' },
];

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const lines = useCartStore((s) => s.lines);
  const [submitting, setSubmitting] = useState(false);
  const [express, setExpress] = useState(true);

  const subtotal = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
  const shipping = express ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping - INSURANCE_CENTS;

  // Blocking wait: name the step and the time, never a bare spinner.
  if (submitting) {
    return (
      <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center px-7">
        <Text style={{ color: colors.textPrimary }} className="text-center font-bold text-xl">Confirmando tu pedido</Text>
        <Text style={{ color: colors.textSecondary }} className="mt-2 text-center text-[12.5px]">
          No cierres la app · unos 20 segundos
        </Text>

        <View className="mt-8"><LoadingSteps steps={CONFIRM_STEPS} /></View>

        <View style={{ backgroundColor: colors.elevated }} className="mt-4 flex-row items-center gap-2.5 rounded-card p-3.5">
          <BellRing color={colors.info} size={18} />
          <Text style={{ color: colors.textSecondary }} className="flex-1 text-[11.5px] leading-[17px]">
            Puedes salir: te avisamos cuando el farmacéutico apruebe.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-5 pb-3">
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={() => router.back()} className="h-touch w-touch justify-center">
          <ArrowLeft color={colors.textPrimary} size={22} />
        </Pressable>
        <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.8px]">PAGAR</Text>
        <View className="w-touch" />
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row gap-1.5">
          <View style={{ backgroundColor: colors.accent }} className="h-1 flex-1 rounded-full" />
          <View style={{ backgroundColor: colors.accent }} className="h-1 flex-1 rounded-full" />
          <View style={{ backgroundColor: colors.elevated }} className="h-1 flex-1 rounded-full" />
        </View>
        <Text style={{ color: colors.textSecondary }} className="mt-2.5 text-[10px] tracking-[1.6px]">
          PASO 2 DE 3 · ENTREGA Y PAGO
        </Text>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-4 rounded-card border p-4">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">ENTREGA</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Cambiar dirección" className="min-h-touch justify-center">
              <Text style={{ color: colors.accentText }} className="font-medium text-[11.5px]">Cambiar</Text>
            </Pressable>
          </View>

          <View className="mt-3 flex-row gap-2.5">
            <Home color={colors.textSecondary} size={19} />
            <View>
              <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">Calle Bienestar 123, Apt 4B</Text>
              <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px]">Ciudad Metro · portón azul</Text>
            </View>
          </View>

          <View className="mt-3 flex-row gap-2">
            {[
              { key: 'express', title: 'Express', detail: '30 min · ' + formatPrice(SHIPPING_CENTS) },
              { key: 'pickup', title: 'Retiro', detail: 'Naco · gratis' },
            ].map((opt) => {
              const active = (opt.key === 'express') === express;
              return (
                <Pressable
                  key={opt.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${opt.title}, ${opt.detail}`}
                  onPress={() => setExpress(opt.key === 'express')}
                  style={{
                    backgroundColor: active ? colors.accentSoft : 'transparent',
                    borderColor: active ? colors.accent : colors.border,
                    borderWidth: active ? 1.5 : 1,
                  }}
                  className="min-h-touch flex-1 justify-center rounded-xl p-3"
                >
                  <Text style={{ color: colors.textPrimary }} className="font-bold text-[12.5px]">{opt.title}</Text>
                  <Text style={{ color: active ? colors.accentText : colors.textSecondary }} className="mt-1 font-mono text-[11px]">
                    {opt.detail}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 rounded-card border p-4">
          <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">PAGO</Text>
          <View className="mt-3 flex-row items-center gap-2.5">
            <View style={{ backgroundColor: colors.elevated }} className="h-7 w-10 items-center justify-center rounded-md">
              <Text style={{ color: colors.textSecondary }} className="font-mono text-[9px]">VISA</Text>
            </View>
            <Text style={{ color: colors.textPrimary }} className="flex-1 font-mono text-[13px]">•••• 4412</Text>
            <CheckCircle2 color={colors.accentText} size={19} />
          </View>

          <View style={{ backgroundColor: colors.elevated }} className="mt-3.5 flex-row items-center gap-2.5 rounded-xl p-3">
            <HeartPulse color={colors.info} size={17} />
            <Text style={{ color: colors.textPrimary }} className="flex-1 text-[11.5px] leading-[17px]">
              Seguro ARS Humano aplicado · ahorras {formatPrice(INSURANCE_CENTS)}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 gap-2.5 rounded-card border p-4">
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">{lines.length} productos</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }} className="text-[12.5px]">{express ? 'Envío express' : 'Retiro en sucursal'}</Text>
            <Text style={{ color: colors.textSecondary }} className="font-mono text-[12.5px]">{formatPrice(shipping)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.accentText }} className="text-[12.5px]">Cobertura ARS</Text>
            <Text style={{ color: colors.accentText }} className="font-mono text-[12.5px]">−{formatPrice(INSURANCE_CENTS)}</Text>
          </View>
          <View style={{ backgroundColor: colors.border }} className="mt-1 h-px" />
          <View className="flex-row items-baseline justify-between">
            <Text style={{ color: colors.textPrimary }} className="font-bold text-sm">Total</Text>
            <Text style={{ color: colors.textPrimary }} className="font-mono text-lg">{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{ backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute inset-x-0 bottom-0 border-t px-4 pt-3.5"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Pagar ${formatPrice(total)}`}
          onPress={() => setSubmitting(true)}
          style={{ backgroundColor: colors.accent }}
          className="min-h-[56px] flex-row items-center justify-center gap-2.5 rounded-button"
        >
          <Lock color={colors.accentInk} size={20} />
          <Text style={{ color: colors.accentInk }} className="font-bold text-[15px]">Pagar {formatPrice(total)}</Text>
        </Pressable>
        <Text style={{ color: colors.textDim }} className="mt-2.5 text-center text-[10.5px]">
          Los artículos con receta se despachan al validarla
        </Text>
      </View>
    </View>
  );
}
