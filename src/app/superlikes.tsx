import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApiError, membership } from '../api';
import { Body, Button, ErrorNotice, H1, Notice, Screen, TopBar } from '../components/ui';
import { useMe } from '../store/Session';
import { colors, fonts, radius, shadow, space } from '../theme';

/** "en 2 días", "mañana" o "en 5 h". */
const nextFree = (iso: string | null) => {
  if (!iso) return 'Disponible';
  const hours = Math.max(1, Math.ceil((new Date(iso).getTime() - Date.now()) / 3600000));
  if (hours < 24) return `en ${hours} h`;
  const days = Math.ceil(hours / 24);
  return days === 1 ? 'mañana' : `en ${days} días`;
};

export default function SuperLikes() {
  const { me, setMe } = useMe();
  const [loading, setLoading] = useState(false);
  const [bought, setBought] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pack = me.membership.pricing.super_like_pack;
  const currency = me.membership.pricing.currency;
  const balance = me.membership.super_likes;

  const buy = async () => {
    setLoading(true);
    setError(null);
    try {
      // Desarrollo: compra simulada validada por el servidor. Producción: Google Play Billing / App Store.
      const updated = await membership.purchase(pack.product_id, `dev-${Date.now()}`, 'fake');
      setMe({ ...me, membership: updated });
      setBought(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos completar la compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Super likes" />
      <View style={styles.body}>
        <View style={{ alignItems: 'center', gap: space.md }}>
          <View style={styles.star}>
            <Ionicons name="star" size={44} color={colors.white} />
          </View>
          <H1 center>{bought ? '¡Listo! Ya tienes más Super likes.' : 'Destaca entre todos.'}</H1>
          <Body muted center>
            Con un Super like, la otra persona ve tu perfil destacado antes que los demás y sabe que de verdad te interesa.
          </Body>
        </View>

        <View style={styles.balance}>
          <Row icon="gift-outline" label={`Gratis (1 cada ${balance.every_days} días)`} value={balance.free_today ? 'Disponible' : nextFree(balance.next_free_at)} />
          <Row icon="star-outline" label="Comprados" value={`${balance.purchased}`} />
        </View>

        <View style={styles.packCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.packQty}>{pack.quantity} Super likes</Text>
            <Text style={styles.packNote}>No caducan · se usan cuando no tienes uno gratis</Text>
          </View>
          <Text style={styles.packPrice}>
            ${Number.isInteger(pack.price) ? pack.price : pack.price.toFixed(2)} {currency}
          </Text>
        </View>

        <View style={{ gap: space.md }}>
          <ErrorNotice message={error} />
          <Button
            label={`Comprar ${pack.quantity} por $${Number.isInteger(pack.price) ? pack.price : pack.price.toFixed(2)} ${currency}`}
            icon="star"
            loading={loading}
            onPress={buy}
          />
          <Button label={bought ? 'Volver a Descubrir' : 'Ahora no'} variant="ghost" onPress={() => router.back()} />
          <Notice icon="information-circle-outline">Pago único con Google Play o App Store. Tu tienda muestra el precio en tu moneda antes de pagar.</Notice>
        </View>
      </View>
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: 'gift-outline' | 'star-outline'; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.verde} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: space.xl, paddingTop: space.sm, justifyContent: 'space-between', gap: space.lg },
  star: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center', ...shadow },
  balance: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.md, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  rowLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  rowValue: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.verde },
  packCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.coral, backgroundColor: '#FFF6F3' },
  packQty: { fontFamily: fonts.extrabold, fontSize: 18, color: colors.verde },
  packNote: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  packPrice: { fontFamily: fonts.extrabold, fontSize: 22, color: colors.coralStrong },
});
