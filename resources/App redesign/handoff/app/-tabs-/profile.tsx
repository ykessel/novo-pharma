// app/(tabs)/profile.tsx
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  TriangleAlert, HeartPulse, Users, Globe, Moon, Shield, Headset, LogOut, ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { useAuth } from '../../hooks/useAuth';

interface RowProps { icon: LucideIcon; label: string; value?: string; onPress?: () => void }

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const inset = useTabBarContentInset();
  const { signOut } = useAuth();

  function Row({ icon: Icon, label, value, onPress }: RowProps) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className="min-h-touch flex-row items-center gap-3 px-3.5 py-3"
      >
        <Icon color={colors.textSecondary} size={20} />
        <Text style={{ color: colors.textPrimary }} className="flex-1 font-medium text-[13.5px]">{label}</Text>
        {value ? <Text style={{ color: colors.textSecondary }} className="text-xs">{value}</Text> : null}
        <ChevronRight color={colors.textDim} size={18} />
      </Pressable>
    );
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: inset }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3.5 pt-4">
          <View style={{ backgroundColor: colors.accent }} className="h-[60px] w-[60px] items-center justify-center rounded-full">
            <Text style={{ color: colors.accentInk }} className="font-bold text-[19px]">AR</Text>
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.textPrimary }} className="font-bold text-[19px]">Alex Rivera</Text>
            <Text style={{ color: colors.textSecondary }} className="mt-1 font-mono text-xs">alex@correo.do</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Editar perfil" className="min-h-touch justify-center">
            <Text style={{ color: colors.accentText }} className="font-medium text-xs">Editar</Text>
          </Pressable>
        </View>

        <View className="mt-5 flex-row gap-2.5">
          {[['92%', 'adherencia', colors.accentText], ['3', 'medicamentos', colors.textPrimary], ['18', 'pedidos', colors.textPrimary]].map(
            ([value, label, tint]) => (
              <View
                key={label}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="flex-1 rounded-card border p-3.5"
              >
                <Text style={{ color: tint }} className="font-mono text-xl">{value}</Text>
                <Text style={{ color: colors.textSecondary }} className="mt-1.5 text-[11px]">{label}</Text>
              </View>
            ),
          )}
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-5 rounded-card border p-4">
          <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">SALUD</Text>
          <View className="mt-3.5 gap-3.5">
            {[
              [TriangleAlert, 'Alergias', 'Penicilina, sulfas'],
              [HeartPulse, 'Seguro', 'ARS Humano · plan Élite'],
              [Users, 'Cuidador', 'Rosa M. · recibe alertas'],
            ].map(([Icon, label, detail]) => {
              const I = Icon as LucideIcon;
              return (
                <Pressable key={label as string} accessibilityRole="button" accessibilityLabel={label as string} className="min-h-touch flex-row items-center gap-3">
                  <I color={colors.accentText} size={20} />
                  <View className="flex-1">
                    <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">{label}</Text>
                    <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11.5px]">{detail}</Text>
                  </View>
                  <ChevronRight color={colors.textDim} size={18} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 rounded-card border p-4">
          <Text style={{ color: colors.textSecondary }} className="font-bold text-[9.5px] tracking-[1.6px]">AVISOS</Text>
          <View className="mt-3.5 gap-4">
            {[
              ['Estado de recetas', 'al validarse o vencer', true],
              ['Estado de pedidos', 'entrega y rastreo', true],
              ['Ofertas', 'promos y novedades', false],
            ].map(([label, detail, on]) => (
              <View key={label as string} className="flex-row items-center justify-between">
                <View className="flex-1 pr-2.5">
                  <Text style={{ color: colors.textPrimary }} className="font-medium text-[13.5px]">{label}</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-0.5 text-[11px]">{detail}</Text>
                </View>
                <Switch
                  accessibilityLabel={label as string}
                  value={on as boolean}
                  trackColor={{ true: colors.accent, false: colors.elevated }}
                  thumbColor={colors.surface}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mt-3 rounded-card border p-1.5">
          <Row icon={Globe} label="Idioma" value="Español" />
          <Row icon={Moon} label="Tema" value={isDark ? 'Oscuro' : 'Claro'} />
          <Row icon={Shield} label="Privacidad y datos" />
          <Row icon={Headset} label="Hablar con un farmacéutico" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          onPress={() => { signOut(); router.replace('/(auth)/login'); }}
          style={{ borderColor: colors.danger }}
          className="mt-3 min-h-[52px] flex-row items-center justify-center gap-2.5 rounded-button border"
        >
          <LogOut color={colors.danger} size={19} />
          <Text style={{ color: colors.danger }} className="font-medium text-base">Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
