import { View, ViewProps } from 'react-native';

export function Card({ className = '', children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={`rounded-card border border-slate-200 bg-white p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}
