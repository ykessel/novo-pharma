import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { FLOATING_TAB_BAR_HEIGHT, useFloatingTabBarOffset } from '../../hooks/useTabBarInset';
import type { FloatingTabBarProps, TabItem } from '../../types/navigation';

interface TabBarTheme {
  surface: string;
  border: string;
  iconInactive: string;
  iconActive: string;
  pillBg: string;
  labelInactive: string;
  labelActive: string;
}

const LIGHT_THEME: TabBarTheme = {
  surface: '#FFFFFF',
  border: '#E2E8F0',
  iconInactive: '#475569',
  iconActive: '#FFFFFF',
  pillBg: '#0F766E',
  labelInactive: '#475569',
  labelActive: '#0F766E',
};

const DARK_THEME: TabBarTheme = {
  surface: '#1E293B',
  border: 'rgba(255,255,255,0.12)',
  iconInactive: '#CBD5E1',
  iconActive: '#FFFFFF',
  pillBg: '#14B8A6',
  labelInactive: '#CBD5E1',
  labelActive: '#5EEAD4',
};

interface TabButtonProps {
  tab: TabItem;
  active: boolean;
  theme: TabBarTheme;
  onPress: (key: string) => void;
  onLongPress?: (key: string) => void;
}

const TabButton = memo(function TabButton({ tab, active, theme, onPress, onLongPress }: TabButtonProps) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 240, easing: Easing.out(Easing.cubic) });
  }, [active, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.7 + progress.value * 0.3 }],
  }));

  const iconWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.06 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 0.75 + progress.value * 0.25,
    color: interpolateColor(progress.value, [0, 1], [theme.labelInactive, theme.labelActive]),
  }));

  const Icon = tab.icon;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      hitSlop={8}
      onPress={() => onPress(tab.key)}
      onLongPress={onLongPress ? () => onLongPress(tab.key) : undefined}
      className="flex-1 items-center justify-center"
      style={styles.tabButton}
    >
      <View style={styles.iconSlot}>
        <Animated.View style={[styles.pill, pillStyle, { backgroundColor: theme.pillBg }]} />
        <Animated.View style={iconWrapperStyle}>
          <Icon color={active ? theme.iconActive : theme.iconInactive} size={22} strokeWidth={2} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
        {tab.label}
      </Animated.Text>
    </Pressable>
  );
});

export const FloatingTabBar = memo(function FloatingTabBar({ tabs, activeTab, onTabPress, onTabLongPress }: FloatingTabBarProps) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  const bottomOffset = useFloatingTabBarOffset();

  const entrance = useSharedValue(0);
  useEffect(() => {
    entrance.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [entrance]);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 16 }],
  }));

  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrapper, entranceStyle, { bottom: bottomOffset }]}>
      <View style={[styles.bar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={tab.key === activeTab}
            theme={theme}
            onPress={onTabPress}
            onLongPress={onTabLongPress}
          />
        ))}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
    zIndex: 50,
  },
  bar: {
    height: FLOATING_TAB_BAR_HEIGHT,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    minHeight: 44,
  },
  iconSlot: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
});
