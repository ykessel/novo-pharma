import { ActivityIndicator, Pressable, Text, PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import type { ColorTokens } from '../../types/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

function variantStyle(variant: ButtonVariant, colors: ColorTokens) {
  switch (variant) {
    case 'primary':
      return { bg: colors.accent, text: colors.accentInk, border: colors.accent };
    case 'secondary':
      return { bg: colors.accentSoft, text: colors.accentText, border: colors.accentSoft };
    case 'outline':
      return { bg: 'transparent', text: colors.textPrimary, border: colors.border };
    case 'danger':
      return { bg: colors.danger, text: colors.surface, border: colors.danger };
  }
}

export function Button({ label, variant = 'primary', loading = false, disabled = false, icon: Icon, ...props }: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const { bg, text, border } = variantStyle(variant, colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-button px-4"
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: border,
        opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <>
          {Icon ? <Icon color={text} size={20} /> : null}
          <Text style={{ color: text }} className="font-medium text-base">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
