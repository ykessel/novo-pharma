import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, ShieldCheck, Truck } from 'lucide-react-native';
import { usePrescriptionUpload } from '../../hooks/usePrescriptionUpload';
import { PrescriptionUploader } from '../../components/prescription/PrescriptionUploader';
import { Button } from '../../components/ui/Button';

export default function UploadPrescriptionScreen() {
  const { file, pickFromCamera, pickFromGallery, pickDocument, clear } = usePrescriptionUpload();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50">
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row items-center border-b border-slate-100 bg-white px-2 py-3"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
        >
          <ArrowLeft color="#3E4949" size={22} />
        </Pressable>
        <Text className="text-lg font-bold text-brand">Subir receta</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 p-4 pb-32">
        <View className="flex-row items-center gap-2 self-start rounded-full bg-brand-secondary px-4 py-2">
          <ShieldCheck color="#0F766E" size={18} />
          <Text className="text-xs font-bold text-brand">Verificado por farmacéuticos licenciados</Text>
        </View>

        <PrescriptionUploader
          file={file}
          onPickCamera={pickFromCamera}
          onPickGallery={pickFromGallery}
          onPickDocument={pickDocument}
          onClear={clear}
        />

        <View className="gap-4 rounded-card border border-slate-100 bg-white p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-slate-900">Detalles de entrega</Text>
            <Truck color="#0F766E" size={20} />
          </View>

          <View className="flex-row items-start gap-3">
            <MapPin color="#3E4949" size={18} />
            <View>
              <Text className="text-base text-slate-900">Calle Bienestar 123, Apt 4B</Text>
              <Text className="text-sm text-slate-500">Ciudad Metro, NY 10001</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Clock color="#D97706" size={18} />
            <Text className="text-sm font-medium text-slate-900">Entrega estimada: 30-45 min</Text>
          </View>
        </View>

        <View className="gap-3 rounded-card border border-slate-100 bg-white p-5">
          <Text className="text-base font-bold text-slate-900">Resumen de pago</Text>

          <View className="flex-row justify-between">
            <Text className="text-slate-500">Subtotal</Text>
            <Text className="text-slate-500">Pendiente de verificación</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500">Costo de envío</Text>
            <Text className="text-slate-500">$4.99</Text>
          </View>
          <View className="flex-row items-center justify-between border-t border-slate-100 pt-3">
            <Text className="text-base font-bold text-slate-900">Total</Text>
            <Text className="text-sm italic text-slate-500">Se calcula tras la verificación</Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 w-full border-t border-slate-100 bg-white p-4">
        <Button
          label="Enviar receta para revisión"
          disabled={!file}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
