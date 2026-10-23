import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, here, HerePerson, HereSession, Person } from '../../api';
import { ActionSheet } from '../../components/ActionSheet';
import { Body, Button, Chip, ErrorNotice, Eyebrow, Field, H1, IconName, Loading, Notice, Screen, ToggleRow } from '../../components/ui';
import { formatLeft, useNow } from '../../hooks/useNow';
import { useRemote } from '../../hooks/useRemote';
import { currentLocation, LocationDeniedError } from '../../lib/device';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, shadow, space } from '../../theme';

const durations = [
  { label: '1 hora', minutes: 60 },
  { label: '2 horas', minutes: 120 },
  { label: '3 horas', minutes: 180 },
];

const rules: { icon: IconName; text: string }[] = [
  { icon: 'eye-off-outline', text: 'Sólo te ven quienes también activaron Aquí y ahora en el mismo lugar.' },
  { icon: 'location-outline', text: 'Nunca mostramos tu ubicación exacta ni un mapa. Sólo “está en este lugar”.' },
  { icon: 'timer-outline', text: 'Se apaga solo al terminar el tiempo. No guardamos historial de lugares.' },
  { icon: 'heart-outline', text: 'Para platicar, ambos se tienen que saludar.' },
];

export default function Here() {
  const current = useRemote(here.current);

  if (current.loading && current.data === undefined) {
    return (
      <Screen edges={['top']}>
        <Loading />
      </Screen>
    );
  }
  if (current.data) return <HereActive session={current.data} onStopped={() => current.setData(null)} />;
  return <HereSetup onStarted={(s) => current.setData(s)} />;
}

function HereSetup({ onStarted }: { onStarted: (s: HereSession) => void }) {
  const [place, setPlace] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lng } = await currentLocation();
      onStarted(await here.start({ place: place.trim(), lat, lng, minutes, verified_only: verifiedOnly }));
    } catch (e) {
      if (e instanceof LocationDeniedError) setError('Necesitamos tu ubicación para confirmar que estás en el lugar. Actívala en los ajustes del teléfono.');
      else setError(e instanceof ApiError ? e.message : 'No pudimos obtener tu ubicación. Inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.pulse}>
            <View style={styles.pulseInner}>
              <Ionicons name="radio" size={34} color={colors.white} />
            </View>
          </View>
          <Eyebrow style={{ color: colors.durazno }}>AQUÍ Y AHORA</Eyebrow>
          <Text style={styles.heroTitle}>¿Estás en un café o en un bar?</Text>
          <Text style={styles.heroText}>Descubre quién más está en el mismo lugar con ganas de conocer a alguien, en este momento.</Text>
        </View>

        <View style={{ gap: space.md }}>
          <Field label="¿Dónde estás?" icon="storefront-outline" placeholder="Ej. Café Avellaneda" value={place} onChangeText={setPlace} maxLength={80} />
          <Text style={styles.label}>¿Por cuánto tiempo?</Text>
          <View style={styles.wrap}>
            {durations.map((d) => (
              <Chip key={d.minutes} label={d.label} icon="time-outline" selected={minutes === d.minutes} onPress={() => setMinutes(d.minutes)} />
            ))}
          </View>
          <View style={styles.box}>
            <ToggleRow icon="shield-checkmark-outline" label="Sólo me ven perfiles verificados" description="Recomendado para mayor tranquilidad." value={verifiedOnly} onChange={setVerifiedOnly} last />
          </View>
        </View>

        <ErrorNotice message={error} />
        <Button label="Activar Aquí y ahora" icon="radio-outline" loading={loading} disabled={place.trim().length < 2} onPress={start} />
        <Notice icon="information-circle-outline">Usamos tu ubicación sólo al activar este modo, para confirmar que estás en el lugar.</Notice>

        <Text style={styles.section}>Así te cuidamos</Text>
        {rules.map((r) => (
          <View key={r.text} style={styles.rule}>
            <Ionicons name={r.icon} size={20} color={colors.coralStrong} />
            <Text style={styles.ruleText}>{r.text}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function HereActive({ session, onStopped }: { session: HereSession; onStopped: () => void }) {
  const { me } = useMe();
  const now = useNow();
  const people = useRemote(here.people);
  const { reload } = people;
  const [sheetFor, setSheetFor] = useState<Person | null>(null);
  const [toast, setToast] = useState('');
  const left = new Date(session.ends_at).getTime() - now;
  const expired = left <= 0;

  // Sondeo ligero mientras el modo está activo.
  useEffect(() => {
    const id = setInterval(() => void reload(), 20000);
    return () => clearInterval(id);
  }, [reload]);

  useEffect(() => {
    if (expired) onStopped();
  }, [expired, onStopped]);

  const stop = async () => {
    await here.stop().catch(() => undefined);
    onStopped();
  };

  const sayHi = async (p: Person) => {
    try {
      const result = await here.greet(p.id);
      people.setData((list) => (list ?? []).map((h) => (h.person.id === p.id ? { ...h, greeted: true } : h)));
      if (result.matched && result.connection_id) router.push({ pathname: '/match', params: { connectionId: result.connection_id } });
      else setToast(`Saludaste a ${p.name}. Si también te saluda, podrán platicar.`);
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
    }
  };

  const hide = async (p: Person) => {
    await here.hide(p.id).catch(() => undefined);
    people.setData((list) => (list ?? []).filter((h) => h.person.id !== p.id));
  };

  const list: HerePerson[] = people.data ?? [];

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.status}>
          <View style={styles.liveDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>Estás en {session.place}</Text>
            <Text style={styles.statusText}>
              Se apaga en {formatLeft(left)}
              {session.verified_only ? ' · Sólo verificados' : ''}
            </Text>
          </View>
          <Pressable onPress={stop} style={styles.stop} hitSlop={6}>
            <Text style={styles.stopText}>Apagar</Text>
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <H1>{list.length === 1 ? '1 persona aquí' : `${list.length} personas aquí`}</H1>
          <Body muted>Saluda a quien te dé curiosidad. Sólo sabrán que les saludaste si también te saludan.</Body>
        </View>

        {toast ? (
          <View style={styles.toast}>
            <Ionicons name="hand-left-outline" size={18} color={colors.verde} />
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        ) : null}

        {people.error && !people.data ? <ErrorNotice message={people.error.message} /> : null}
        {people.data && !list.length ? <Notice icon="time-outline">Todavía no hay nadie más con el modo activo aquí. Te mostraremos a quien llegue.</Notice> : null}

        <View style={styles.grid}>
          {list.map(({ person: p, greeted }) => {
            const common = p.interests.filter((i) => me.interests.includes(i));
            return (
              <View key={p.id} style={styles.card}>
                <Pressable onPress={() => router.push({ pathname: '/person/[id]', params: { id: p.id } })}>
                  <Image source={{ uri: p.photos?.[0]?.urls.md }} style={styles.photo} contentFit="cover" transition={200} />
                  <Pressable style={styles.more} onPress={() => setSheetFor(p)} hitSlop={8} accessibilityLabel="Opciones">
                    <Ionicons name="ellipsis-horizontal" size={16} color={colors.verde} />
                  </Pressable>
                </Pressable>
                <View style={styles.cardBody}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.name} numberOfLines={1}>
                      {p.name}, {p.age}
                    </Text>
                    {p.verified ? <Ionicons name="checkmark-circle" size={15} color={colors.verde} /> : null}
                  </View>
                  {p.job ? (
                    <Text style={styles.meta} numberOfLines={1}>
                      {p.job}
                    </Text>
                  ) : null}
                  {common.length ? (
                    <Text style={styles.common}>
                      {common.length} en común · {common[0]}
                    </Text>
                  ) : (
                    <Text style={styles.meta} numberOfLines={1}>
                      {p.intent}
                    </Text>
                  )}
                  <Button
                    label={greeted ? 'Saludado' : 'Saludar'}
                    icon={greeted ? 'checkmark' : 'hand-left-outline'}
                    variant={greeted ? 'secondary' : 'primary'}
                    disabled={greeted}
                    style={styles.cardBtn}
                    onPress={() => sayHi(p)}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <Notice>Si alguien te incomoda, ocúltate de esa persona o repórtala desde •••. No recibirá aviso.</Notice>
      </ScrollView>

      <ActionSheet
        visible={!!sheetFor}
        title={sheetFor?.name ?? undefined}
        subtitle="Tú decides con quién hablar y cuándo parar."
        onClose={() => setSheetFor(null)}
        actions={
          sheetFor
            ? [
                { label: 'Ver perfil', icon: 'person-outline', onPress: () => router.push({ pathname: '/person/[id]', params: { id: sheetFor.id } }) },
                { label: `Ocultarme de ${sheetFor.name}`, icon: 'eye-off-outline', onPress: () => hide(sheetFor) },
                { label: 'Reportar', icon: 'flag-outline', danger: true, onPress: () => router.push({ pathname: '/safety/report', params: { id: sheetFor.id, name: sheetFor.name ?? '' } }) },
              ]
            : []
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, gap: space.lg, paddingBottom: space.xxxl },
  hero: { backgroundColor: colors.verde, borderRadius: radius.xxl, padding: space.xl, alignItems: 'center', gap: space.sm },
  pulse: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,107,107,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  pulseInner: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, color: colors.crema, textAlign: 'center' },
  heroText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: 'rgba(249,243,236,0.85)', textAlign: 'center' },
  label: { fontFamily: fonts.bold, fontSize: 13, color: colors.verde },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  section: { fontFamily: fonts.semibold, fontSize: 19, color: colors.verde, marginTop: space.sm },
  rule: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  ruleText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.verde, borderRadius: radius.xl, padding: space.lg },
  liveDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.coral, borderWidth: 3, borderColor: 'rgba(255,107,107,0.35)' },
  statusTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.crema },
  statusText: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(249,243,236,0.8)' },
  stop: { backgroundColor: colors.crema, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  stopText: { fontFamily: fonts.bold, fontSize: 13, color: colors.verde },
  toast: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.durazno },
  toastText: { flex: 1, fontFamily: fonts.semibold, fontSize: 13, color: colors.verde },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  card: { width: '47.5%', backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadow },
  photo: { width: '100%', aspectRatio: 0.9, backgroundColor: colors.durazno },
  more: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: space.md, gap: 2 },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde, flexShrink: 1 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  common: { fontFamily: fonts.semibold, fontSize: 12, color: colors.coralStrong },
  cardBtn: { height: 40, marginTop: space.sm, paddingHorizontal: space.sm },
});
