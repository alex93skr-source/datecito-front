import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export type PickedImage = { uri: string; mimeType: string };

/**
 * Abre la galería o la cámara. Devuelve null si la persona cancela o niega el permiso.
 * Las fotos se recortan en vertical (4:5) y se comprimen antes de subir.
 */
export async function pickImage(source: 'library' | 'camera', { front = false } = {}): Promise<PickedImage | null> {
  const permission = source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.85, exif: false };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ ...options, cameraType: front ? ImagePicker.CameraType.front : ImagePicker.CameraType.back })
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  return { uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' };
}

export class LocationDeniedError extends Error {}

export class LocationUnavailableError extends Error {}

/** Rechaza si la promesa tarda más de `ms` (algunos teléfonos tardan mucho en dar el primer GPS). */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
}

/**
 * Ubicación actual con precisión media. El servidor la redondea; nunca se muestra exacta.
 * Si el GPS tarda, usa la última ubicación conocida del teléfono.
 */
export async function currentLocation(): Promise<{ lat: number; lng: number; zone: string | null }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new LocationDeniedError('Sin permiso de ubicación');

  let position: Location.LocationObject | null = null;
  try {
    position = await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), 12000);
  } catch {
    position = await Location.getLastKnownPositionAsync({ maxAge: 30 * 60 * 1000 }).catch(() => null);
  }
  if (!position) throw new LocationUnavailableError('Sin señal de ubicación');

  const { latitude: lat, longitude: lng } = position.coords;

  // El nombre de la zona es opcional: si el servicio de mapas del teléfono no responde, seguimos sin él.
  let zone: string | null = null;
  try {
    const [place] = await withTimeout(Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }), 5000);
    zone = place?.district ?? place?.subregion ?? place?.city ?? null;
  } catch {
    zone = null;
  }

  return { lat, lng, zone };
}
