import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Check, Eye, EyeOff, Lock, Mail, Phone, Stethoscope, User } from 'lucide-react-native';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      await mockAuth.signUp(email, fullName, phone);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.replace('/(tabs)');
  }

  const canSubmit = acceptedTerms && fullName.length > 0 && email.length > 0 && password.length >= 8;

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6 py-8">
      <View className="rounded-card border border-slate-100 bg-white p-6">
        <View className="mb-6 items-center gap-1">
          <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-brand-secondary">
            <Stethoscope color="#0F766E" size={24} />
          </View>
          <Text className="text-xl font-bold text-slate-900">Crear cuenta</Text>
          <Text className="text-center text-sm text-slate-500">Únete a Nova Pharma para atención médica sin fricciones.</Text>
        </View>

        <Input
          label="Nombre completo"
          placeholder="Jane Doe"
          value={fullName}
          onChangeText={setFullName}
          icon={<User color="#94A3B8" size={20} />}
        />

        <Input
          label="Correo electrónico"
          placeholder="jane@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color="#94A3B8" size={20} />}
        />

        <Input
          label="Teléfono"
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          icon={<Phone color="#94A3B8" size={20} />}
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
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
        <Text className="-mt-2 mb-4 text-xs text-slate-500">Debe tener al menos 8 caracteres.</Text>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
          onPress={() => setAcceptedTerms((v) => !v)}
          className="mb-4 min-h-touch flex-row items-center gap-3"
        >
          <View className={`h-5 w-5 items-center justify-center rounded border-2 ${acceptedTerms ? 'border-brand bg-brand' : 'border-slate-300'}`}>
            {acceptedTerms ? <Check color="#FFFFFF" size={14} /> : null}
          </View>
          <Text className="flex-1 text-sm text-slate-600">
            Acepto los <Text className="font-medium text-brand">Términos y Condiciones</Text> y la{' '}
            <Text className="font-medium text-brand">Política de Privacidad</Text>.
          </Text>
        </Pressable>

        {error ? <Text className="mb-3 text-sm text-rx">{error}</Text> : null}

        <Button label="Registrarme" loading={loading} disabled={!canSubmit} onPress={handleRegister} />

        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-slate-500">¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" className="text-sm font-medium text-brand">
            Inicia sesión
          </Link>
        </View>
      </View>
    </View>
  );
}
