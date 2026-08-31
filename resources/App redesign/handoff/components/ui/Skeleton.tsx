// components/ui/Skeleton.tsx
import { useEffect, useRef } from 'react';
import { Animated, Easing, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** A shimmering placeholder. Give it the EXACT size of the content it stands in
 *  for — a skeleton that changes size on load makes the screen jump. */
export function Skeleton({ width = '100%', height = 12, radius = 999, style }: SkeletonProps) {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.45, 1, 0.45],
  });

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.elevated, opacity }, style]}
    />
  );
}

/** Product row placeholder — matches ProductRow's 84px height exactly. */
export function SkeletonProductRow() {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      className="mb-3 flex-row items-center gap-3 rounded-card border p-3"
    >
      <Skeleton width={60} height={60} radius={12} />
      <View className="flex-1 gap-2">
        <Skeleton width="72%" height={13} />
        <Skeleton width="48%" height={10} />
        <Skeleton width="32%" height={9} />
      </View>
      <View className="items-end gap-2">
        <Skeleton width={50} height={14} />
        <Skeleton width={34} height={34} radius={999} />
      </View>
    </View>
  );
}

/** Grid card placeholder for the store's "más vendidos" section. */
export function SkeletonProductCard() {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      className="flex-1 rounded-card border p-3"
    >
      <Skeleton height={96} radius={12} />
      <View className="mt-3 gap-2">
        <Skeleton width="76%" height={12} />
        <Skeleton width="52%" height={9} />
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Skeleton width={56} height={14} />
        <Skeleton width={32} height={32} radius={999} />
      </View>
    </View>
  );
}
