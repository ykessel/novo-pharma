import { forwardRef, ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

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
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error ? 'border-rx' : isFocused ? 'border-brand' : 'border-slate-200';

  return (
    <View className="mb-3">
      {label ? <Text className="mb-1 text-sm font-medium text-slate-900">{label}</Text> : null}

      <View className="relative justify-center">
        {icon ? <View className="absolute left-4 z-10">{icon}</View> : null}

        <TextInput
          ref={ref}
          accessibilityLabel={label ?? props.placeholder}
          accessibilityState={{ disabled: Boolean(props.editable === false) }}
          placeholderTextColor="#94A3B8"
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          className={`min-h-touch rounded-xl border-2 bg-white text-base text-slate-900 ${icon ? 'pl-11' : 'pl-4'} ${
            rightElement ? 'pr-11' : 'pr-4'
          } ${borderClass} ${className}`}
          {...props}
        />

        {rightElement ? <View className="absolute right-4 z-10">{rightElement}</View> : null}
      </View>

      {error ? <Text className="mt-1 text-xs text-rx">{error}</Text> : null}
    </View>
  );
});
