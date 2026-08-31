// app/(tabs)/search.tsx — search with skeleton, no-results and suggestions
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, SearchX, SpellCheck2, Headset } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { ProductRow } from '../../components/product/ProductRow';
import { SkeletonProductRow } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { MOCK_PRODUCTS } from '../../utils/mockProducts';

const SUGGESTIONS = ['amoxicilina', 'antibiótico', 'dolor de garganta', 'infección'];

export default function SearchScreen() {
  const { colors } = useTheme();
  const inset = useTabBarContentInset();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query) return;
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 600);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((p) => {
      const matchesCategory = !category || category === 'all' || p.category === category;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="px-5 pb-3 pt-3.5">
        <View
          style={{ backgroundColor: colors.surface, borderColor: query ? colors.accent : colors.border }}
          className="min-h-[46px] flex-row items-center gap-2.5 rounded-card border px-3.5"
        >
          <SearchIcon color={colors.textSecondary} size={20} />
          <TextInput
            accessibilityLabel="Buscar medicamento"
            value={query}
            onChangeText={setQuery}
            placeholder="Medicamento, marca o síntoma"
            placeholderTextColor={colors.textDim}
            returnKeyType="search"
            style={{ flex: 1, color: colors.textPrimary, fontSize: 14 }}
          />
        </View>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {searching ? (
          <>
            <Text style={{ color: colors.textSecondary }} className="mb-3 font-bold text-[9.5px] tracking-[1.8px]">
              BUSCANDO EN 4 SUCURSALES…
            </Text>
            <SkeletonProductRow />
            <SkeletonProductRow />
            <SkeletonProductRow />
          </>
        ) : results.length > 0 ? (
          <>
            <Text style={{ color: colors.textSecondary }} className="mb-3 font-bold text-[9.5px] tracking-[1.8px]">
              {results.length} RESULTADO{results.length === 1 ? '' : 'S'}
            </Text>
            {results.map((p) => (
              <ProductRow key={p.id} product={p} onPress={() => router.push(`/product/${p.slug}`)} />
            ))}
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title={`Nada para “${query}”`}
            body="Puede ser un error de escritura, o el producto no se vende en línea."
          >
            <View>
              <View style={{ backgroundColor: colors.accentSoft, borderColor: colors.accent }} className="flex-row items-center gap-2.5 rounded-card border p-4">
                <SpellCheck2 color={colors.accentText} size={20} />
                <Text style={{ color: colors.textPrimary }} className="flex-1 text-[12.5px] leading-[19px]">
                  ¿Quisiste decir <Text className="font-bold">Amoxicilina 500 mg</Text>?
                </Text>
              </View>

              <Text style={{ color: colors.textSecondary }} className="mt-6 font-bold text-[9.5px] tracking-[1.8px]">
                PRUEBA CON
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    accessibilityRole="button"
                    accessibilityLabel={`Buscar ${s}`}
                    onPress={() => setQuery(s)}
                    style={{ borderColor: colors.border }}
                    className="min-h-[38px] justify-center rounded-full border px-3.5"
                  >
                    <Text style={{ color: colors.textPrimary }} className="font-medium text-xs">{s}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Preguntar a un farmacéutico"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="mt-6 min-h-touch flex-row items-center gap-3 rounded-card border p-4"
              >
                <Headset color={colors.info} size={20} />
                <View className="flex-1">
                  <Text style={{ color: colors.textPrimary }} className="font-medium text-[13px]">Pregúntale a un farmacéutico</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px]">Responde en minutos · gratis</Text>
                </View>
              </Pressable>
            </View>
          </EmptyState>
        )}
      </ScrollView>
    </View>
  );
}
