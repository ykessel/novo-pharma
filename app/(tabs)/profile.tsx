import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Bell, ChevronRight, Globe, HelpCircle, LogOut, ShieldCheck, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTabBarContentInset } from '../../hooks/useTabBarInset';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { mockAuth } from '../../services/mockAuth';

interface PreferenceRow {
  key: string;
  label: string;
  value: string;
  icon: typeof Globe;
}

const PREFERENCES: PreferenceRow[] = [
  { key: 'language', label: 'Idioma', value: 'Español', icon: Globe },
  { key: 'privacy', label: 'Privacidad y seguridad', value: '', icon: ShieldCheck },
  { key: 'help', label: 'Centro de ayuda', value: '', icon: HelpCircle },
];

export default function ProfileScreen() {
  const { user } = useAuth();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [prescriptionReminders, setPrescriptionReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const tabBarInset = useTabBarContentInset();

  const fullName = user?.user_metadata.full_name ?? user?.email ?? 'Usuario';

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: tabBarInset }}
    >
      <View className="flex-row items-center justify-between rounded-card border border-slate-100 bg-white p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-secondary">
            <User color="#0F766E" size={24} />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900">{fullName}</Text>
            <Text className="text-sm text-slate-500">{user?.email}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button">
          <Text className="text-sm font-medium text-brand">Editar</Text>
        </Pressable>
      </View>

      <View className="gap-4 rounded-card border border-slate-100 bg-white p-4">
        <View className="flex-row items-center gap-2">
          <Bell color="#0F766E" size={20} />
          <Text className="text-base font-bold text-slate-900">Notificaciones</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-base text-slate-900">Actualizaciones de pedido</Text>
            <Text className="text-sm text-slate-500">Estado de entrega y rastreo</Text>
          </View>
          <Switch value={orderUpdates} onValueChange={setOrderUpdates} trackColor={{ true: '#0F766E' }} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-base text-slate-900">Recordatorios de receta</Text>
            <Text className="text-sm text-slate-500">Alertas de dosis y renovación</Text>
          </View>
          <Switch value={prescriptionReminders} onValueChange={setPrescriptionReminders} trackColor={{ true: '#0F766E' }} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-base text-slate-900">Promociones</Text>
            <Text className="text-sm text-slate-500">Ofertas y novedades</Text>
          </View>
          <Switch value={promotions} onValueChange={setPromotions} trackColor={{ true: '#0F766E' }} />
        </View>
      </View>

      <View className="rounded-card border border-slate-100 bg-white p-2">
        <Text className="px-3 pt-2 text-xs font-bold uppercase tracking-wide text-slate-500">Preferencias</Text>
        {PREFERENCES.map(({ key, label, value, icon: Icon }) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            className="min-h-touch flex-row items-center justify-between px-3 py-3"
          >
            <View className="flex-row items-center gap-3">
              <Icon color="#0F766E" size={20} />
              <Text className="text-base text-slate-900">{label}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              {value ? <Text className="text-sm text-slate-500">{value}</Text> : null}
              <ChevronRight color="#94A3B8" size={18} />
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={async () => {
          await (isSupabaseConfigured ? supabase.auth.signOut() : mockAuth.signOut());
          router.replace('/(auth)/login');
        }}
        className="min-h-touch flex-row items-center justify-center gap-2 rounded-card bg-rx/10 p-4"
      >
        <LogOut color="#DC2626" size={18} />
        <Text className="text-base font-bold text-rx">Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
