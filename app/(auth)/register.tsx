import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Check, Eye, EyeOff, Lock, Mail, Phone, Stethoscope, User } from 'lucide-react-native';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';

export default function RegisterScreen() {
  const { colors } = useTheme();
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
    <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center px-6 py-8">
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-6">
        <View className="mb-6 items-center gap-1">
          <View style={{ backgroundColor: colors.accentSoft }} className="mb-2 h-12 w-12 items-center justify-center rounded-full">
            <Stethoscope color={colors.accentText} size={24} />
          </View>
          <Text style={{ color: colors.textPrimary }} className="text-xl font-bold">Crear cuenta</Text>
          <Text style={{ color: colors.textSecondary }} className="text-center text-sm">Únete a Nova Pharma para atención médica sin fricciones.</Text>
        </View>

        <Input
          label="Nombre completo"
          placeholder="Jane Doe"
          value={fullName}
          onChangeText={setFullName}
          icon={<User color={colors.textDim} size={20} />}
        />

        <Input
          label="Correo electrónico"
          placeholder="jane@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          icon={<Mail color={colors.textDim} size={20} />}
        />

        <Input
          label="Teléfono"
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          icon={<Phone color={colors.textDim} size={20} />}
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
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
        <Text style={{ color: colors.textSecondary }} className="-mt-2 mb-4 text-xs">Debe tener al menos 8 caracteres.</Text>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
          onPress={() => setAcceptedTerms((v) => !v)}
          className="mb-4 min-h-touch flex-row items-center gap-3"
        >
          <View
            style={{
              borderColor: acceptedTerms ? colors.accent : colors.border,
              backgroundColor: acceptedTerms ? colors.accent : 'transparent',
            }}
            className="h-5 w-5 items-center justify-center rounded border-2"
          >
            {acceptedTerms ? <Check color={colors.accentInk} size={14} /> : null}
          </View>
          <Text style={{ color: colors.textSecondary }} className="flex-1 text-sm">
            Acepto los <Text style={{ color: colors.accentText }} className="font-medium">Términos y Condiciones</Text> y la{' '}
            <Text style={{ color: colors.accentText }} className="font-medium">Política de Privacidad</Text>.
          </Text>
        </Pressable>

        {error ? <Text style={{ color: colors.danger }} className="mb-3 text-sm">{error}</Text> : null}

        <Button label="Registrarme" loading={loading} disabled={!canSubmit} onPress={handleRegister} />

        <View className="mt-4 flex-row justify-center">
          <Text style={{ color: colors.textSecondary }} className="text-sm">¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" style={{ color: colors.accentText }} className="text-sm font-medium">
            Inicia sesión
          </Link>
        </View>
      </View>
    </View>
  );
}
