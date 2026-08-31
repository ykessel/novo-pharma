import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FLOATING_TAB_BAR_HEIGHT = 68;
export const FLOATING_TAB_BAR_GAP = 8;

export function useFloatingTabBarOffset(): number {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, 12) + FLOATING_TAB_BAR_GAP;
}

export function useTabBarContentInset(additionalSpacing = 16): number {
  const bottomOffset = useFloatingTabBarOffset();
  return bottomOffset + FLOATING_TAB_BAR_HEIGHT + additionalSpacing;
}
