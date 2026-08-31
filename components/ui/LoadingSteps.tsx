// components/ui/LoadingSteps.tsx
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

export interface LoadingStep {
  label: string;
  state: 'done' | 'active' | 'pending';
  /** Shown right-aligned: an elapsed time or a short detail. */
  meta?: string;
}

function PulseDot({ color }: { color: string }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);

  return (
    <Animated.View
      style={{
        width: 14, height: 14, borderRadius: 999, backgroundColor: color,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
        transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) }],
      }}
    />
  );
}

/** For any wait over ~5 seconds. Naming the step beats a spinner: the user can
 *  tell progress from a hang, and knows whether it is safe to leave. */
export function LoadingSteps({ steps }: { steps: LoadingStep[] }) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      className="gap-4 rounded-card border p-4"
    >
      {steps.map((step) => (
        <View key={step.label} className="flex-row items-center gap-3" style={{ opacity: step.state === 'pending' ? 0.45 : 1 }}>
          {step.state === 'done' ? (
            <CheckCircle2 color={colors.accentText} size={20} fill={colors.accentText} />
          ) : step.state === 'active' ? (
            <PulseDot color={colors.accentText} />
          ) : (
            <Circle color={colors.textSecondary} size={20} />
          )}

          <Text style={{ color: colors.textPrimary }} className="flex-1 font-medium text-sm">
            {step.label}
          </Text>

          {step.meta ? (
            <Text style={{ color: colors.textSecondary }} className="font-mono text-xs">{step.meta}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
