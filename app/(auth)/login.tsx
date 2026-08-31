import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, HeartPulse, Lock, Mail } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState(isSupabaseConfigured ? '' : 'demo@Nova Pharma.app');
  const [password, setPassword] = useState(isSupabaseConfigured ? '' : 'demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      await mockAuth.signIn(email);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center px-6">
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-6">
        <View className="mb-6 items-center gap-2">
          <View style={{ backgroundColor: colors.accent }} className="h-16 w-16 items-center justify-center rounded-full">
            <HeartPulse color={colors.accentInk} size={28} />
          </View>
          <Text style={{ color: colors.accentText }} className="text-2xl font-bold">Nova Pharma</Text>
          <Text style={{ color: colors.textPrimary }} className="text-lg font-bold">Bienvenido de nuevo</Text>
          {!isSupabaseConfigured ? (
            <Text style={{ color: colors.warning }} className="text-xs">Modo demo — cualquier contraseña funciona</Text>
          ) : null}
        </View>

        <Input
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color={colors.textDim} size={20} />}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          icon={<Lock color={colors.textDim} size={20} />}
          rightElement={
            <Pressable accessibilityRole="button" accessibilityLabel="Mostrar contraseña" onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color={colors.textDim} size={20} /> : <Eye color={colors.textDim} size={20} />}
            </Pressable>
          }
        />

        <Pressable accessibilityRole="button" className="mb-4 items-end">
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {error ? <Text style={{ color: colors.danger }} className="mb-3 text-sm">{error}</Text> : null}

        <Button label="Entrar" loading={loading} onPress={handleLogin} />

        <View className="mt-4 flex-row justify-center">
          <Text style={{ color: colors.textSecondary }} className="text-sm">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" style={{ color: colors.accentText }} className="text-sm font-medium">
            Regístrate
          </Link>
        </View>
      </View>
    </View>
  );
}
