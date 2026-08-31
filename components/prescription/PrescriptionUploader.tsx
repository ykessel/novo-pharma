import { Image, Pressable, Text, View } from 'react-native';
import { Camera, FileText, ImagePlus, X } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import type { PrescriptionFile } from '../../hooks/usePrescriptionUpload';

interface PrescriptionUploaderProps {
  file: PrescriptionFile | null;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickDocument: () => void;
  onClear: () => void;
}

export function PrescriptionUploader({ file, onPickCamera, onPickGallery, onPickDocument, onClear }: PrescriptionUploaderProps) {
  const { colors } = useTheme();

  if (file) {
    return (
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="rounded-card border p-3">
        <View className="relative">
          {file.type === 'image' ? (
            <Image source={{ uri: file.uri }} className="h-48 w-full rounded-xl" resizeMode="cover" />
          ) : (
            <View style={{ backgroundColor: colors.elevated }} className="h-24 w-full flex-row items-center gap-2 rounded-xl px-4">
              <FileText color={colors.accentText} size={22} />
              <Text numberOfLines={1} style={{ color: colors.textPrimary }} className="flex-1 text-sm">
                {file.name}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eliminar archivo adjunto"
            onPress={onClear}
            style={{ backgroundColor: colors.textPrimary }}
            className="absolute -right-2 -top-2 h-9 w-9 items-center justify-center rounded-full"
          >
            <X color={colors.surface} size={18} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.accentSoft, borderColor: colors.border }} className="items-center gap-4 rounded-card border-2 border-dashed p-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tomar foto o subir archivo de la receta"
        onPress={onPickGallery}
        style={{ backgroundColor: colors.accent }}
        className="h-16 w-16 items-center justify-center rounded-full"
      >
        <ImagePlus color={colors.accentInk} size={28} />
      </Pressable>

      <View className="items-center gap-1">
        <Text style={{ color: colors.textPrimary }} className="text-center text-lg font-bold">Toma una foto o sube el PDF de tu receta</Text>
        <Text style={{ color: colors.textSecondary }} className="text-center text-sm">Asegúrate de que todos los datos sean legibles.</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onPickCamera}
          style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
          className="min-h-touch flex-row items-center gap-2 rounded-full border px-4"
        >
          <Camera color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">Cámara</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onPickDocument}
          style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
          className="min-h-touch flex-row items-center gap-2 rounded-full border px-4"
        >
          <FileText color={colors.accentText} size={18} />
          <Text style={{ color: colors.accentText }} className="text-sm font-medium">PDF</Text>
        </Pressable>
      </View>
    </View>
  );
}
