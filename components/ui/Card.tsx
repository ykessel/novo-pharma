import { View, ViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function Card({ className = '', style, children, ...props }: ViewProps & { className?: string }) {
  const { colors } = useTheme();
  return (
    <View
      className={`rounded-card border p-4 ${className}`}
      style={[{ backgroundColor: colors.surface, borderColor: colors.border }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
