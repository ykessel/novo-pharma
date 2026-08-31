import { ActivityIndicator, Pressable, Text, PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-brand-secondary',
  outline: 'bg-transparent border border-slate-200',
  danger: 'bg-rx',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-brand',
  outline: 'text-slate-900',
  danger: 'text-white',
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#0F766E',
  outline: '#0F172A',
  danger: '#FFFFFF',
};

export function Button({ label, variant = 'primary', loading = false, disabled = false, icon: Icon, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-button px-4 ${variantClasses[variant]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      style={({ pressed }) => ({ opacity: pressed && !isDisabled ? 0.7 : 1 })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor[variant]} />
      ) : (
        <>
          {Icon ? <Icon color={spinnerColor[variant]} size={20} /> : null}
          <Text className={`font-medium text-base ${variantTextClasses[variant]}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
