import { Image, Pressable, Text, View } from 'react-native';
import { Camera, FileText, ImagePlus, X } from 'lucide-react-native';
import type { PrescriptionFile } from '../../hooks/usePrescriptionUpload';

interface PrescriptionUploaderProps {
  file: PrescriptionFile | null;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickDocument: () => void;
  onClear: () => void;
}

export function PrescriptionUploader({ file, onPickCamera, onPickGallery, onPickDocument, onClear }: PrescriptionUploaderProps) {
  if (file) {
    return (
      <View className="rounded-card border border-slate-100 bg-white p-3">
        <View className="relative">
          {file.type === 'image' ? (
            <Image source={{ uri: file.uri }} className="h-48 w-full rounded-xl" resizeMode="cover" />
          ) : (
            <View className="h-24 w-full flex-row items-center gap-2 rounded-xl bg-slate-50 px-4">
              <FileText color="#0F766E" size={22} />
              <Text numberOfLines={1} className="flex-1 text-sm text-slate-900">
                {file.name}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eliminar archivo adjunto"
            onPress={onClear}
            className="absolute -right-2 -top-2 h-9 w-9 items-center justify-center rounded-full bg-slate-900 shadow"
          >
            <X color="#FFFFFF" size={18} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center gap-4 rounded-card border-2 border-dashed border-slate-300 bg-brand-secondary p-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tomar foto o subir archivo de la receta"
        onPress={onPickGallery}
        className="h-16 w-16 items-center justify-center rounded-full bg-brand"
      >
        <ImagePlus color="#FFFFFF" size={28} />
      </Pressable>

      <View className="items-center gap-1">
        <Text className="text-center text-lg font-bold text-slate-900">Toma una foto o sube el PDF de tu receta</Text>
        <Text className="text-center text-sm text-slate-500">Asegúrate de que todos los datos sean legibles.</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onPickCamera}
          className="min-h-touch flex-row items-center gap-2 rounded-full border border-brand/30 bg-white px-4"
        >
          <Camera color="#0F766E" size={18} />
          <Text className="text-sm font-medium text-brand">Cámara</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onPickDocument}
          className="min-h-touch flex-row items-center gap-2 rounded-full border border-brand/30 bg-white px-4"
        >
          <FileText color="#0F766E" size={18} />
          <Text className="text-sm font-medium text-brand">PDF</Text>
        </Pressable>
      </View>
    </View>
  );
}
