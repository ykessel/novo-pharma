import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Home, Pill, FileText, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingTabBar } from '../../components/navigation/FloatingTabBar';
import type { TabItem } from '../../types/navigation';

const TAB_ITEMS: TabItem[] = [
  { key: 'index', label: 'Inicio', icon: Home },
  { key: 'catalog', label: 'Catálogo', icon: Pill },
  { key: 'prescriptions', label: 'Recetas', icon: FileText },
  { key: 'profile', label: 'Perfil', icon: User },
];

function renderTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  function handlePress(key: string) {
    const route = state.routes.find((r) => r.name === key);
    if (!route) return;

    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (state.routes[state.index].key !== route.key && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }

  return <FloatingTabBar tabs={TAB_ITEMS} activeTab={activeRoute.name} onTabPress={handlePress} />;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { paddingTop: insets.top } }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="catalog" options={{ title: 'Catálogo' }} />
      <Tabs.Screen name="prescriptions" options={{ title: 'Recetas' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
