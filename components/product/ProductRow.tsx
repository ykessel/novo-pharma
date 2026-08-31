// components/product/ProductRow.tsx — 84px tall; SkeletonProductRow matches it
import { Image, Pressable, Text, View } from 'react-native';
import { Plus, Check, Star } from 'lucide-react-native';
import type { Product } from '../../types/product';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { formatPrice } from '../../utils/format';

export function ProductRow({ product, onPress }: { product: Product; onPress?: () => void }) {
  const { colors } = useTheme();
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.lines.some((l) => l.product.id === product.id));

  const stockLabel = product.requiresRx
    ? 'Requiere receta'
    : product.stock > 0 ? 'En stock · hoy' : 'Agotado';
  const stockColor = product.requiresRx
    ? colors.textSecondary
    : product.stock > 0 ? colors.accentText : colors.warning;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.dosage}, ${formatPrice(product.priceCents)}`}
      onPress={onPress}
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      className="mb-3 flex-row items-center gap-3 rounded-card border p-3"
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: colors.elevated }}
      />

      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text style={{ color: colors.textPrimary }} className="font-medium text-sm" numberOfLines={1}>
            {product.name}
          </Text>
          {product.requiresRx ? (
            <View style={{ backgroundColor: colors.dangerBg }} className="rounded-[5px] px-1.5 py-0.5">
              <Text style={{ color: colors.danger }} className="font-bold text-[8.5px] tracking-wider">RX</Text>
            </View>
          ) : null}
        </View>

        <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-[11px]">{product.dosage}</Text>

        <View className="mt-1 flex-row items-center gap-1.5">
          <Star color={colors.warning} size={13} fill={colors.warning} />
          <Text style={{ color: colors.textPrimary }} className="font-medium text-[10.5px]">{product.rating}</Text>
          <Text style={{ color: colors.textDim }} className="text-[10.5px]">({product.reviewCount})</Text>
          <Text style={{ color: stockColor }} className="text-[10.5px]">· {stockLabel}</Text>
        </View>
      </View>

      <View className="items-end">
        <Text style={{ color: colors.textPrimary }} className="font-mono text-[15px]">
          {formatPrice(product.priceCents)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={inCart ? `${product.name} en el carrito` : `Añadir ${product.name}`}
          onPress={() => addItem(product)}
          disabled={product.stock === 0}
          style={{
            backgroundColor: inCart ? colors.accent : 'transparent',
            borderColor: product.stock === 0 ? colors.border : colors.accent,
            opacity: product.stock === 0 ? 0.5 : 1,
          }}
          className="mt-2 h-touch w-touch items-center justify-center rounded-full border-[1.5px]"
        >
          {inCart
            ? <Check color={colors.accentInk} size={19} />
            : <Plus color={product.stock === 0 ? colors.textDim : colors.accentText} size={19} />}
        </Pressable>
      </View>
    </Pressable>
  );
}
