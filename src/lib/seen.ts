import * as SecureStore from 'expo-secure-store';

const KEY = 'datecito.superlikes.seen';
// SecureStore guarda hasta ~2 KB por valor: con 40 ids sobra.
const MAX = 40;

/** Ids de personas cuyo Super like ya se celebró en este teléfono. */
export async function seenSuperLikes(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function markSuperLikesSeen(ids: string[]): Promise<void> {
  try {
    const current = await seenSuperLikes();
    const next = [...new Set([...current, ...ids])].slice(-MAX);
    await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  } catch {
    // Si no se puede guardar, sólo se repetiría la animación: no es grave.
  }
}
