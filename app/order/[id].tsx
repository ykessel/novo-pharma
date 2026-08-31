import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Badge } from '../../components/ui/Badge';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="mb-2 text-xl font-bold text-slate-900">Pedido #{id}</Text>
      <Badge label="En camino" tone="warning" />
    </View>
  );
}
