import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import {
  ChevronDown,
  FileUp,
  MapPin,
  Pill,
  RefreshCw,
  ScanLine,
  Search,
  ShoppingCart,
  Truck,
  Zap,
  HeartPulse,
} from 'lucide-react-native';
import { ProductCard } from '../../components/product/ProductCard';
import { useAuth } from '../../hooks/useAuth';
import { useCartStore } from '../../hooks/useCartStore';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { MOCK_PRODUCTS } from '../../utils/mockProducts';
import { colors } from '../../types/theme';

const QUICK_ACTIONS = [
  { key: 'track', label: 'Rastrear\nPedido', icon: Truck },
  { key: 'otc', label: 'Venta\nLibre', icon: Pill },
  { key: 'care', label: 'Cuidado\nPersonal', icon: HeartPulse },
  { key: 'refill', label: 'Repetir\nPedido', icon: RefreshCw },
] as const;

export default function HomeScreen() {
  const { user } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.itemCount());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const tabBarInset = useTabBarContentInset();

  const firstName = (user?.user_metadata.full_name ?? user?.email ?? 'Usuario').split(' ')[0].split('@')[0];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <View className="flex-row items-center gap-2">
          <MapPin color={colors.brandPrimary} size={22} />
          <Text className="text-lg font-bold text-brand">Nova Pharma</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={itemCount > 0 ? `Carrito de compras, ${itemCount} artículos` : 'Carrito de compras'}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="relative h-11 w-11 items-center justify-center rounded-full"
        >
          <ShoppingCart color={colors.textSecondary} size={22} />
          {itemCount > 0 ? (
            <View className="absolute right-1 top-1 h-4 w-4 items-center justify-center rounded-full bg-rx">
              <Text className="text-[10px] font-bold text-white">{itemCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="gap-6 p-4" contentContainerStyle={{ paddingBottom: tabBarInset }}>
        <View className="gap-1">
          <Text className="text-2xl font-bold text-slate-900">Hola, {firstName}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-slate-500">Entregar en:</Text>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              className="flex-row items-center gap-1"
            >
              <Text numberOfLines={1} className="text-sm font-medium text-slate-900">
                Casa - Calle Principal 123
              </Text>
              <ChevronDown color={colors.textSecondary} size={16} />
            </Pressable>
          </View>
        </View>

        <View className="relative">
          <View className="absolute inset-y-0 left-4 z-10 justify-center">
            <Search color={colors.placeholder} size={20} />
          </View>
          <TextInput
            accessibilityLabel="Buscar medicamentos, vitaminas"
            placeholder="Buscar medicamentos, vitaminas..."
            placeholderTextColor={colors.placeholder}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`min-h-touch rounded-full border bg-white pl-12 pr-12 text-base text-slate-900 ${
              isSearchFocused ? 'border-brand' : 'border-slate-200'
            }`}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Escanear receta"
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="absolute inset-y-0 right-4 z-10 justify-center"
          >
            <ScanLine color={colors.brandPrimary} size={20} />
          </Pressable>
        </View>

        <View className="rounded-card bg-brand p-6">
          <View className="mb-2 flex-row items-center gap-2">
            <Zap color={colors.accent} size={18} />
            <Text className="text-xs font-bold uppercase tracking-wide text-accent">Express</Text>
          </View>
          <Text className="max-w-[200px] text-xl font-bold leading-tight text-white">Entrega rápida en 30 min</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Subir receta médica"
          onPress={() => router.push('/prescription/upload')}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          className="flex-row items-center justify-between rounded-card border border-dashed border-brand/40 bg-brand-secondary p-6"
        >
          <View className="max-w-[200px] gap-1">
            <Text className="text-xl font-bold text-brand">Subir receta</Text>
            <Text className="text-sm text-slate-500">Para procesar tu pedido más rápido</Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-brand">
            <FileUp color="#FFFFFF" size={20} />
          </View>
        </Pressable>

        <View className="flex-row justify-between">
          {QUICK_ACTIONS.map(({ key, label, icon: Icon }) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={label.replace('\n', ' ')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              className="items-center gap-2"
            >
              <View className="h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white">
                <Icon color={colors.brandPrimary} size={22} />
              </View>
              <Text className="text-center text-xs leading-tight text-slate-500">{label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-slate-900">Medicamentos populares</Text>
            <Pressable accessibilityRole="button" hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Text className="text-sm font-medium text-brand">Ver todos</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} className="w-[160px]" onPress={() => {}} onAdd={addItem} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
