import { forwardRef, ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, icon, rightElement, className = '', onFocus, onBlur, ...props },
  ref,
) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? colors.danger : isFocused ? colors.accent : colors.border;

  return (
    <View className="mb-3">
      {label ? <Text style={{ color: colors.textPrimary }} className="mb-1 text-sm font-medium">{label}</Text> : null}

      <View className="relative justify-center">
        {icon ? <View className="absolute left-4 z-10">{icon}</View> : null}

        <TextInput
          ref={ref}
          accessibilityLabel={label ?? props.placeholder}
          accessibilityState={{ disabled: Boolean(props.editable === false) }}
          placeholderTextColor={colors.textDim}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          style={{ backgroundColor: colors.surface, borderColor, color: colors.textPrimary }}
          className={`min-h-touch rounded-xl border-2 text-base ${icon ? 'pl-11' : 'pl-4'} ${
            rightElement ? 'pr-11' : 'pr-4'
          } ${className}`}
          {...props}
        />

        {rightElement ? <View className="absolute right-4 z-10">{rightElement}</View> : null}
      </View>

      {error ? <Text style={{ color: colors.danger }} className="mt-1 text-xs">{error}</Text> : null}
    </View>
  );
});
