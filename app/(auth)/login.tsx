import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, HeartPulse, Lock, Mail } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';

export default function LoginScreen() {
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
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <View className="rounded-card border border-slate-100 bg-white p-6">
        <View className="mb-6 items-center gap-2">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand">
            <HeartPulse color="#FFFFFF" size={28} />
          </View>
          <Text className="text-2xl font-bold text-brand">Nova Pharma</Text>
          <Text className="text-lg font-bold text-slate-900">Bienvenido de nuevo</Text>
          {!isSupabaseConfigured ? (
            <Text className="text-xs text-warning">Modo demo — cualquier contraseña funciona</Text>
          ) : null}
        </View>

        <Input
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color="#94A3B8" size={20} />}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          icon={<Lock color="#94A3B8" size={20} />}
          rightElement={
            <Pressable accessibilityRole="button" accessibilityLabel="Mostrar contraseña" onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
            </Pressable>
          }
        />

        <Pressable accessibilityRole="button" className="mb-4 items-end">
          <Text className="text-sm font-medium text-brand">¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {error ? <Text className="mb-3 text-sm text-rx">{error}</Text> : null}

        <Button label="Entrar" loading={loading} onPress={handleLogin} />

        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-slate-500">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" className="text-sm font-medium text-brand">
            Regístrate
          </Link>
        </View>
      </View>
    </View>
  );
}
