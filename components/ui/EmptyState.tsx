// components/ui/EmptyState.tsx
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

interface Action {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  /** Say WHY it is empty or what the user gains — never just "no hay nada". */
  body: string;
  primary?: Action;
  secondary?: Action;
  /** Products, recent orders, suggestions — an empty state should still sell. */
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, primary, secondary, children }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View>
      <View className="items-center px-2 pt-9">
        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="h-24 w-24 items-center justify-center rounded-[26px] border"
        >
          <Icon color={colors.textDim} size={42} strokeWidth={1.4} />
        </View>

        <Text style={{ color: colors.textPrimary }} className="mt-6 text-center font-bold text-xl">
          {title}
        </Text>
        <Text style={{ color: colors.textSecondary }} className="mt-2 max-w-[260px] text-center text-sm leading-5">
          {body}
        </Text>

        <View className="mt-5 w-full gap-3">
          {primary ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={primary.label}
              onPress={primary.onPress}
              style={({ pressed }) => ({ backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 })}
              className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-button"
            >
              {primary.icon ? <primary.icon color={colors.accentInk} size={20} /> : null}
              <Text style={{ color: colors.accentInk }} className="font-bold text-base">{primary.label}</Text>
            </Pressable>
          ) : null}

          {secondary ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={secondary.label}
              onPress={secondary.onPress}
              style={({ pressed }) => ({ borderColor: colors.border, opacity: pressed ? 0.7 : 1 })}
              className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-button border"
            >
              {secondary.icon ? <secondary.icon color={colors.textSecondary} size={20} /> : null}
              <Text style={{ color: colors.textSecondary }} className="font-medium text-base">{secondary.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {children ? <View className="mt-8">{children}</View> : null}
    </View>
  );
}
