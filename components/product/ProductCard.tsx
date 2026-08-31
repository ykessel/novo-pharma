import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Heart, Plus, Star } from 'lucide-react-native';
import { Badge } from '../ui/Badge';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';
import { colors } from '../../types/theme';

const LOW_STOCK_THRESHOLD = 10;

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAdd?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onPress, onAdd, className = '' }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isLowStock = !product.requiresRx && product.stock < LOW_STOCK_THRESHOLD;
  const isOnSale = Boolean(product.originalPriceCents);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={product.name}
      onPress={() => onPress(product)}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      className={`rounded-card border border-slate-100 bg-white p-3 ${className}`}
    >
      <View className="relative h-[120px] w-full overflow-hidden rounded-xl bg-slate-100">
        <Image source={{ uri: product.imageUrl }} className="h-full w-full" resizeMode="cover" />

        {product.requiresRx ? (
          <View className="absolute left-2 top-2">
            <Badge status="rx_required" />
          </View>
        ) : isLowStock ? (
          <View className="absolute left-2 top-2">
            <Badge label="Poco stock" tone="warning" />
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            setIsFavorite((value) => !value);
          }}
          className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-white/90"
        >
          <Heart color={colors.rx} size={16} fill={isFavorite ? colors.rx : 'transparent'} />
        </Pressable>
      </View>

      <View className="mt-3 gap-1">
        <Text numberOfLines={1} className="text-base font-medium text-slate-900">
          {product.name}
        </Text>
        <Text numberOfLines={1} className="text-sm text-slate-500">
          {product.dosage}
        </Text>
        <View className="flex-row items-center gap-1">
          <Star color={colors.warning} size={14} fill={colors.warning} />
          <Text className="text-xs font-medium text-slate-900">{product.rating.toFixed(1)}</Text>
          <Text className="text-xs text-slate-400">({product.reviewCount})</Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View>
          {isOnSale ? (
            <Text className="text-xs text-slate-400 line-through">{formatPrice(product.originalPriceCents!)}</Text>
          ) : null}
          <Text className="text-lg font-bold text-brand">{formatPrice(product.priceCents)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Agregar ${product.name} al carrito`}
          onPress={(event) => {
            event.stopPropagation();
            onAdd?.(product);
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="h-8 w-8 items-center justify-center rounded-full bg-brand"
        >
          <Plus color="#FFFFFF" size={18} />
        </Pressable>
      </View>
    </Pressable>
  );
}
