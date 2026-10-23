import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Logo } from '../components/Brand';
import { ApiError, membership as membershipApi } from '../api';
import { Button, ErrorNotice, IconName, Screen, TopBar } from '../components/ui';
import { useMe, useSession } from '../store/Session';
import { colors, fonts, radius, shadow, space } from '../theme';

const benefits: { icon: IconName; text: string }[] = [
  { icon: 'infinite-outline', text: 'Likes ilimitados en Descubrir' },
  { icon: 'chatbubbles-outline', text: 'Chats y datecitos sin límite' },
  { icon: 'radio-outline', text: 'Aquí y ahora en cualquier lugar' },
  { icon: 'options-outline', text: 'Todos los filtros, en modo “Prefiero” o “Sólo”' },
  { icon: 'heart-outline', text: 'Ve quién te dio like y hazle match directo' },
  { icon: 'star-outline', text: '1 Super like gratis cada 3 días' },
  { icon: 'shield-checkmark-outline', text: 'Datecito Seguro y verificación incluidos' },
];

const money = (n: number, cur: string) => `${Number.isInteger(n) ? n.toLocaleString('es-MX') : n.toFixed(2)} ${cur}`;
type PlanKey = 'yearly' | 'monthly';

export default function Membership() {
  const { gate } = useLocalSearchParams<{ gate?: string }>();
  const locked = gate === '1';
  const { signOut } = useSession();
  const { me, setMe, refreshMe } = useMe();
  const [plan, setPlan] = useState<PlanKey>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no hay membresía, el botón "atrás" de Android no debe saltarse esta pantalla.
  useEffect(() => {
    if (!locked) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [locked]);

  if (!me) return null;
  const m = me.membership;
  const pricing = m.pricing;
  const monthlyEquivalent = pricing.yearly.price / 12;

  const buy = async () => {
    setLoading(true);
    setError(null);
    try {
      // Desarrollo: compra simulada validada por el servidor. Producción: Google Play Billing / App Store.
      const membership = await membershipApi.purchase(pricing[plan].product_id, `dev-${Date.now()}`, 'fake');
      setMe({ ...me, membership });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert('¡Listo, ya eres miembro!', 'Tu membresía está activa.', [
        { text: 'Continuar', onPress: () => (locked ? router.replace('/discover') : router.back()) },
      ]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos completar el pago. Inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    const fresh = await refreshMe();
    if (fresh && fresh.membership.status !== 'inactive' && locked) router.replace('/discover');
    else Alert.alert('Restaurar compra', fresh?.membership.status === 'active' ? 'Tu membresía está activa.' : 'No encontramos una membresía activa en tu cuenta.');
  };

  const subtitle = locked
    ? 'Para seguir conociendo personas y armando datecitos, activa tu membresía. Tu perfil, tus matches y tus conversaciones se conservan.'
    : m.status === 'active'
      ? `Tu membresía ${m.plan === 'yearly' ? 'anual' : 'mensual'} está activa.`
      : 'Durante el lanzamiento Datecito es gratis. Cuando empiece el cobro, ésta será tu membresía.';

  return (
    <Screen>
      <Stack.Screen options={{ gestureEnabled: !locked }} />
      {locked ? <View style={{ height: space.lg }} /> : <TopBar title="Membresía" />}
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Logo size={28} />
          <Text style={styles.title}>{locked ? 'Activa tu membresía' : 'Una sola membresía, todo incluido'}</Text>
          <Text style={styles.sub}>{subtitle}</Text>
        </View>

        <View style={{ gap: space.md }}>
          <PlanCard
            selected={plan === 'yearly'}
            onPress={() => setPlan('yearly')}
            title="Anual"
            price={money(pricing.yearly.price, pricing.currency)}
            period="al año"
            note={`Equivale a ${money(monthlyEquivalent, pricing.currency)} al mes · 2 meses gratis`}
            badge="Mejor precio"
            extra="Incluye 1 Boost cada semana"
          />
          <PlanCard
            selected={plan === 'monthly'}
            onPress={() => setPlan('monthly')}
            title="Mensual"
            price={money(pricing.monthly.price, pricing.currency)}
            period="al mes"
            note="Cancela cuando quieras"
          />
        </View>

        <View style={styles.benefits}>
          <Text style={styles.benefitsTitle}>Todo incluido en tu membresía</Text>
          {benefits.map((b) => (
            <View key={b.text} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon} size={17} color={colors.coralStrong} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {!locked ? (
          <Pressable style={styles.pack} onPress={() => router.push('/superlikes')}>
            <Ionicons name="star" size={22} color={colors.coral} />
            <View style={{ flex: 1 }}>
              <Text style={styles.packTitle}>¿Quieres más Super likes?</Text>
              <Text style={styles.packText}>
                Paquete de {pricing.super_like_pack.quantity} por {money(pricing.super_like_pack.price, pricing.currency)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.verde} />
          </Pressable>
        ) : null}

        <Text style={styles.legal}>
          Precios en pesos mexicanos; fuera de México tu tienda muestra el equivalente en tu moneda antes de pagar. El pago se hace con tu cuenta de Google Play o App Store y se renueva automáticamente al final de cada periodo, salvo que lo canceles al menos 24 h antes desde la tienda.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <ErrorNotice message={error} />
        <Button
          label={m.status === 'active' && !locked ? 'Cambiar de plan' : `Continuar con ${plan === 'yearly' ? 'Anual' : 'Mensual'} · ${money(pricing[plan].price, pricing.currency)}`}
          loading={loading}
          onPress={buy}
        />
        <View style={styles.links}>
          <Text style={styles.link} onPress={restore}>
            Restaurar compra
          </Text>
          {locked ? (
            <Text
              style={styles.link}
              onPress={async () => {
                await signOut();
                router.replace('/welcome');
              }}
            >
              Cerrar sesión
            </Text>
          ) : (
            <Text style={styles.link} onPress={() => router.push('/terms')}>
              Términos
            </Text>
          )}
        </View>
      </View>
    </Screen>
  );
}

function PlanCard({ selected, onPress, title, price, period, note, badge, extra }: { selected: boolean; onPress: () => void; title: string; price: string; period: string; note: string; badge?: string; extra?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.plan, selected && styles.planOn]}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={24} color={selected ? colors.coralStrong : colors.arena} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.planTitle}>{title}</Text>
        <Text style={styles.planNote}>{note}</Text>
        {extra ? (
          <View style={styles.extra}>
            <Ionicons name="flash" size={12} color={colors.verde} />
            <Text style={styles.extraText}>{extra}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.planNote}>{period}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.xl, paddingBottom: space.xxl },
  head: { alignItems: 'center', gap: space.sm },
  title: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: colors.verde, textAlign: 'center', marginTop: space.md },
  sub: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, paddingTop: space.xl, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  planOn: { borderColor: colors.coral, backgroundColor: '#FFF6F3', ...shadow },
  badge: { position: 'absolute', top: -11, left: space.lg, backgroundColor: colors.verde, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, color: colors.crema },
  planTitle: { fontFamily: fonts.extrabold, fontSize: 18, color: colors.verde },
  planNote: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  price: { fontFamily: fonts.extrabold, fontSize: 18, color: colors.verde },
  extra: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 4, backgroundColor: colors.durazno, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  extraText: { fontFamily: fonts.bold, fontSize: 11, color: colors.verde },
  benefits: { gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  benefitsTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  benefitIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  pack: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: '#E6EFEB' },
  packTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  packText: { fontFamily: fonts.regular, fontSize: 13, color: colors.text },
  legal: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, color: colors.subtle, textAlign: 'center' },
  footer: { padding: space.xl, paddingTop: space.md, gap: space.md, borderTopWidth: 1, borderTopColor: colors.border },
  links: { flexDirection: 'row', justifyContent: 'center', gap: space.xxl },
  link: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
});
