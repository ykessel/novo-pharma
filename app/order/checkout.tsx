import { Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';

export default function CheckoutScreen() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="mb-4 text-xl font-bold text-slate-900">Confirmar pedido</Text>
      <Button label="Pagar" />
    </View>
  );
}
