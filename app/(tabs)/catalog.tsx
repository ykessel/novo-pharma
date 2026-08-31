import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { ProductCard } from '../../components/product/ProductCard';
import { useCartStore } from '../../hooks/useCartStore';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { CATEGORIES, MOCK_PRODUCTS } from '../../utils/mockProducts';
import { colors } from '../../types/theme';

export default function CatalogScreen() {
  const addItem = useCartStore((state) => state.addItem);
  const tabBarInset = useTabBarContentInset();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesQuery = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-2"
        contentContainerStyle={{ paddingBottom: tabBarInset }}
        ListHeaderComponent={
          <View className="gap-3 px-2 pb-3 pt-2">
            <View className="flex-row items-center gap-2">
              <View className="relative flex-1">
                <View className="absolute inset-y-0 left-4 z-10 justify-center">
                  <Search color={colors.placeholder} size={20} />
                </View>
                <TextInput
                  accessibilityLabel="Buscar medicamentos, vitaminas"
                  placeholder="Buscar medicamentos, vitaminas..."
                  placeholderTextColor={colors.placeholder}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`min-h-touch rounded-full border bg-white pl-12 pr-4 text-base text-slate-900 ${
                    isSearchFocused ? 'border-brand' : 'border-slate-200'
                  }`}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Filtros"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                className="h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white"
              >
                <SlidersHorizontal color={colors.brandPrimary} size={20} />
              </Pressable>
            </View>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
              renderItem={({ item }) => {
                const isActive = item.key === selectedCategory;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    onPress={() => setSelectedCategory(item.key)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    className={`h-9 justify-center rounded-full px-4 ${
                      isActive ? 'bg-brand' : 'border border-slate-200 bg-white'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.label}</Text>
                  </Pressable>
                );
              }}
            />
          </View>
        }
        ListEmptyComponent={
          <View className="items-center gap-2 py-16">
            <Text className="text-base font-medium text-slate-900">Sin resultados</Text>
            <Text className="text-sm text-slate-500">Probá con otra búsqueda o categoría.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="w-1/2 p-1.5">
            <ProductCard product={item} onPress={() => {}} onAdd={addItem} />
          </View>
        )}
      />
    </View>
  );
}
