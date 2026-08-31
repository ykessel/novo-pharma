import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export interface PrescriptionFile {
  uri: string;
  name: string;
  mimeType: string;
  type: 'image' | 'pdf';
}

export function usePrescriptionUpload() {
  const [file, setFile] = useState<PrescriptionFile | null>(null);

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;

    const asset = result.assets[0];
    setFile({ uri: asset.uri, name: asset.fileName ?? 'receta.jpg', mimeType: asset.mimeType ?? 'image/jpeg', type: 'image' });
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (result.canceled) return;

    const asset = result.assets[0];
    setFile({ uri: asset.uri, name: asset.fileName ?? 'receta.jpg', mimeType: asset.mimeType ?? 'image/jpeg', type: 'image' });
  }

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.canceled) return;

    const asset = result.assets[0];
    setFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? 'application/pdf', type: 'pdf' });
  }

  function clear() {
    setFile(null);
  }

  return { file, pickFromCamera, pickFromGallery, pickDocument, clear };
}
