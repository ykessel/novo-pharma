import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, ShieldCheck, Truck } from 'lucide-react-native';
import { usePrescriptionUpload } from '../../hooks/usePrescriptionUpload';
import { PrescriptionUploader } from '../../components/prescription/PrescriptionUploader';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

export default function UploadPrescriptionScreen() {
  const { colors } = useTheme();
  const { file, pickFromCamera, pickFromGallery, pickDocument, clear } = usePrescriptionUpload();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View
        style={{ paddingTop: insets.top, backgroundColor: colors.surface, borderBottomColor: colors.border }}
        className="flex-row items-center border-b px-2 py-3"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
        >
          <ArrowLeft color={colors.textSecondary} size={22} />
        </Pressable>
        <Text style={{ color: colors.accentText }} className="text-lg font-bold">Subir receta</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 p-4 pb-32">
        <View style={{ backgroundColor: colors.accentSoft }} className="flex-row items-center gap-2 self-start rounded-full px-4 py-2">
          <ShieldCheck color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-xs font-bold">Verificado por farmacéuticos licenciados</Text>
        </View>

        <PrescriptionUploader
          file={file}
          onPickCamera={pickFromCamera}
          onPickGallery={pickFromGallery}
          onPickDocument={pickDocument}
          onClear={clear}
        />

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="gap-4 rounded-card border p-5">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Detalles de entrega</Text>
            <Truck color={colors.accentText} size={20} />
          </View>

          <View className="flex-row items-start gap-3">
            <MapPin color={colors.textSecondary} size={18} />
            <View>
              <Text style={{ color: colors.textPrimary }} className="text-base">Calle Bienestar 123, Apt 4B</Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm">Ciudad Metro, NY 10001</Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.elevated }} className="flex-row items-center gap-3 rounded-xl p-3">
            <Clock color={colors.warning} size={18} />
            <Text style={{ color: colors.textPrimary }} className="text-sm font-medium">Entrega estimada: 30-45 min</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="gap-3 rounded-card border p-5">
          <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Resumen de pago</Text>

          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
            <Text style={{ color: colors.textSecondary }}>Pendiente de verificación</Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textSecondary }}>Costo de envío</Text>
            <Text style={{ color: colors.textSecondary }}>$4.99</Text>
          </View>
          <View style={{ borderTopColor: colors.border }} className="flex-row items-center justify-between border-t pt-3">
            <Text style={{ color: colors.textPrimary }} className="text-base font-bold">Total</Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm italic">Se calcula tras la verificación</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ backgroundColor: colors.surface, borderTopColor: colors.border }} className="absolute bottom-0 left-0 w-full border-t p-4">
        <Button
          label="Enviar receta para revisión"
          disabled={!file}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
