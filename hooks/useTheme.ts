// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ColorTokens } from '../types/theme';

export function useTheme(): { colors: ColorTokens; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
