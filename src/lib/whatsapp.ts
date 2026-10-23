import { Linking, Share } from 'react-native';

/**
 * Número en formato internacional para WhatsApp. Si viene a 10 dígitos se asume México (52).
 * Devuelve null si no parece un número válido.
 */
export function whatsappNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `52${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

/**
 * Abre WhatsApp con el chat del contacto y el mensaje ya escrito. No usa ninguna API:
 * es el enlace oficial wa.me, que el teléfono abre en WhatsApp si está instalado.
 * Si no se puede, cae al menú de compartir del teléfono (SMS, Telegram…).
 */
export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  const number = whatsappNumber(phone);
  const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
  try {
    if (!url) throw new Error('invalid phone');
    await Linking.openURL(url);
  } catch {
    await Share.share({ message }).catch(() => undefined);
  }
}
