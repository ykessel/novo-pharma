// components/navigation/FloatingTabBar.tsx — 5 commerce tabs, cart badge
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Store, Search, ShoppingBag, ReceiptText, User, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../hooks/useCartStore';
import { useFloatingTabBarOffset, FLOATING_TAB_BAR_HEIGHT } from '../../hooks/useTabBarInset';

const ICONS: Record<string, LucideIcon> = {
  index: Store, search: Search, cart: ShoppingBag, orders: ReceiptText, profile: User,
};
const LABELS: Record<string, string> = {
  index: 'Tienda', search: 'Buscar', cart: 'Carrito', orders: 'Pedidos', profile: 'Yo',
};

export const FloatingTabBar = memo(function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const bottom = useFloatingTabBarOffset();
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));

  return (
    <View
      style={{
        position: 'absolute', left: 16, right: 16, bottom,
        height: FLOATING_TAB_BAR_HEIGHT, borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
        paddingHorizontal: 6, backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.border,
        flexDirection: 'row', alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? Store;
        const tint = focused ? colors.accentText : colors.textSecondary;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={LABELS[route.name] ?? route.name}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            className="min-h-touch flex-1 items-center justify-center gap-[3px]"
          >
            <View>
              <Icon color={tint} size={21} fill={focused ? tint : 'transparent'} />
              {route.name === 'cart' && count > 0 ? (
                <View
                  style={{ backgroundColor: colors.accent, position: 'absolute', top: -5, right: -9 }}
                  className="h-4 min-w-[16px] items-center justify-center rounded-full px-1"
                >
                  <Text style={{ color: colors.accentInk }} className="font-bold text-[9.5px]">{count}</Text>
                </View>
              ) : null}
            </View>
            <Text style={{ color: tint }} className="font-medium text-[9.5px]">{LABELS[route.name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});
