// app/(tabs)/index.tsx — Tienda (storefront)
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Search, Zap, ChevronDown, RefreshCw, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { SkeletonProductCard, Skeleton } from '../../components/ui/Skeleton';
import { MOCK_PRODUCTS, CATEGORIES } from '../../utils/mockProducts';
import { formatPrice } from '../../utils/format';
import type { Product } from '../../types/product';

export default function StoreScreen() {
  const { colors } = useTheme();
  const inset = useTabBarContentInset();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: swap for the real catalog endpoint
    const t = setTimeout(() => { setProducts(MOCK_PRODUCTS.slice(0, 4)); setLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="flex-row items-center gap-3 px-5 pb-2.5 pt-3.5">
        <View className="flex-row items-center gap-2.5">
          <View style={{ backgroundColor: colors.accent }} className="h-2.5 w-2.5 rounded-full" />
          <Text style={{ color: colors.textPrimary }} className="font-bold text-[15px] tracking-wide">NOVO</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar zona de entrega"
          style={{ backgroundColor: colors.elevated }}
          className="ml-auto min-h-[34px] flex-row items-center gap-1.5 rounded-full px-3"
        >
          <Zap color={colors.accentText} size={16} />
          <Text style={{ color: colors.textPrimary }} className="font-medium text-[11px]">30 min · Piantini</Text>
          <ChevronDown color={colors.textSecondary} size={15} />
        </Pressable>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Buscar medicamento, marca o síntoma"
          onPress={() => router.push('/(tabs)/search')}
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="min-h-[50px] flex-row items-center gap-2.5 rounded-card border px-3.5"
        >
          <Search color={colors.textSecondary} size={20} />
          <Text style={{ color: colors.textDim }} className="text-[14.5px]">Busca medicamento, marca o síntoma</Text>
        </Pressable>

        <View style={{ backgroundColor: colors.accent }} className="mt-3.5 flex-row items-center gap-3.5 rounded-[20px] p-4">
          <View className="flex-1">
            <Text style={{ color: colors.accentInk, opacity: 0.65 }} className="font-bold text-[9.5px] tracking-[1.5px]">
              ENVÍO GRATIS HOY
            </Text>
            <Text style={{ color: colors.accentInk }} className="mt-1.5 font-bold text-[19px] leading-6">
              Pedidos desde{'\n'}RD$500
            </Text>
          </View>
        </View>

        <Text style={{ color: colors.textSecondary }} className="mt-6 font-bold text-[9.5px] tracking-[1.8px]">
          CATEGORÍAS
        </Text>
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
            <Pressable
              key={cat.key}
              accessibilityRole="button"
              accessibilityLabel={cat.label}
              onPress={() => router.push({ pathname: '/(tabs)/search', params: { category: cat.key } })}
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              className="min-h-touch flex-1 basis-[45%] justify-center rounded-card border px-3 py-3"
            >
              <Text style={{ color: colors.textPrimary }} className="font-medium text-xs">{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Recomprar lo de siempre"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="mt-6 min-h-touch flex-row items-center gap-3 rounded-card border p-4"
        >
          <View style={{ backgroundColor: colors.elevated }} className="h-[42px] w-[42px] items-center justify-center rounded-xl">
            <RefreshCw color={colors.accentText} size={21} />
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">Recomprar lo de siempre</Text>
            <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px]">3 productos · RD$34.30</Text>
          </View>
          <View style={{ backgroundColor: colors.accent }} className="min-h-[38px] justify-center rounded-[11px] px-3.5">
            <Text style={{ color: colors.accentInk }} className="font-bold text-xs">Añadir</Text>
          </View>
        </Pressable>

        <Text style={{ color: colors.textSecondary }} className="mt-6 font-bold text-[9.5px] tracking-[1.8px]">
          MÁS VENDIDOS
        </Text>
        <View className="mt-3 flex-row flex-wrap gap-3">
          {loading
            ? [0, 1, 2, 3].map((i) => (
                <View key={i} className="basis-[47%] grow"><SkeletonProductCard /></View>
              ))
            : products.map((p) => (
                <Pressable
                  key={p.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.name}, ${formatPrice(p.priceCents)}`}
                  onPress={() => router.push(`/product/${p.slug}`)}
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="basis-[47%] grow rounded-card border p-3"
                >
                  <Image
                    source={{ uri: p.imageUrl }}
                    style={{ height: 96, borderRadius: 12, backgroundColor: colors.elevated }}
                  />
                  <Text style={{ color: colors.textPrimary }} className="mt-2.5 font-medium text-[13.5px]" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-[10.5px]" numberOfLines={1}>
                    {p.dosage}
                  </Text>
                  <Text style={{ color: colors.textPrimary }} className="mt-2 font-mono text-[14.5px]">
                    {formatPrice(p.priceCents)}
                  </Text>
                </Pressable>
              ))}
        </View>

        <View style={{ backgroundColor: colors.elevated }} className="mt-4 flex-row items-center gap-3 rounded-card p-4">
          <ShieldCheck color={colors.info} size={20} />
          <Text style={{ color: colors.textSecondary }} className="flex-1 text-[11.5px] leading-[17px]">
            Farmacia registrada. Todo medicamento controlado se despacha solo con receta validada.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
