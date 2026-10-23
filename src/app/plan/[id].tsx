import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, datecitos, safety } from '../../api';
import { Avatar, Button, EmptyState, ErrorNotice, IconName, Loading, Screen, TopBar } from '../../components/ui';
import { planKinds } from '../../data/mock';
import { useRemote } from '../../hooks/useRemote';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

export default function PlanDetail() {
  const { id, created } = useLocalSearchParams<{ id: string; created?: string }>();
  const { me } = useMe();
  const datecito = useRemote(() => datecitos.get(id));
  const safe = useRemote(safety.currentSession);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const d = datecito.data;

  if (!d) {
    return (
      <Screen>
        <TopBar />
        {datecito.loading ? (
          <Loading />
        ) : (
          <EmptyState icon="calendar-outline" title="Este datecito ya no existe." text="Puede que se haya cancelado." action="Ir a Conexiones" onAction={() => router.navigate('/matches')} />
        )}
      </Screen>
    );
  }

  const person = d.person;
  const confirmed = d.status === 'confirmed';
  const cancelled = d.status === 'cancelled';
  const kind = planKinds.find((k) => k.key === d.kind);
  const safeActive = safe.data?.datecito.id === d.id;

  const act = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      if (after) after();
      else await datecito.reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Tu datecito" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {created ? (
          <View style={styles.sent}>
            <Ionicons name="paper-plane" size={18} color={colors.verde} />
            <Text style={styles.sentText}>Propuesta enviada a {person.name}. Te avisaremos cuando responda.</Text>
          </View>
        ) : null}

        {/* Tarjeta compartida */}
        <View style={[styles.ticket, cancelled && { opacity: 0.6 }]}>
          <View style={styles.ticketHead}>
            <View style={styles.kindIcon}>
              <Ionicons name={(kind?.icon ?? 'calendar-outline') as IconName} size={26} color={colors.coral} />
            </View>
            <View style={styles.faces}>
              <Avatar uri={me.photos[0]?.urls.sm ?? ''} size={44} />
              <View style={{ marginLeft: -12 }}>
                <Avatar uri={person.photos?.[0]?.urls.sm ?? ''} size={44} />
              </View>
            </View>
          </View>
          <View style={styles.ticketBody}>
            <Text style={styles.kindLabel}>
              {kind?.label} con {person.name}
            </Text>
            <Text style={styles.title}>{d.place}</Text>
            <Row icon="time-outline" text={d.when_label} />
            <Row icon="location-outline" text={`${d.zone} · zona general`} />
            {d.note ? <Row icon="chatbubble-outline" text={`“${d.note}”`} /> : null}
            <View style={styles.cut} />
            <View style={styles.statusRow}>
              {cancelled ? (
                <Status ok={false} label="Cancelado" />
              ) : (
                <>
                  <Status ok={d.proposed_by_me || confirmed} label={d.proposed_by_me ? 'Tú lo propusiste' : confirmed ? 'Tú confirmaste' : 'Falta tu confirmación'} />
                  <Status ok={!d.proposed_by_me || confirmed} label={d.proposed_by_me ? (confirmed ? `${person.name} confirmó` : `Esperando a ${person.name}`) : `${person.name} lo propuso`} />
                </>
              )}
            </View>
          </View>
        </View>

        <ErrorNotice message={error} />

        {cancelled ? null : d.is_past ? (
          <Button label={d.feedback_sent ? 'Gracias por contarnos' : '¿Cómo te fue? Cuéntanos'} icon="chatbox-ellipses-outline" disabled={d.feedback_sent || !confirmed} onPress={() => router.push({ pathname: '/plan/feedback', params: { id: d.id } })} />
        ) : (
          <Pressable style={[styles.safe, safeActive && styles.safeOn]} onPress={() => router.push({ pathname: '/safety/date-mode', params: { id: d.id } })}>
            <Ionicons name="shield-checkmark" size={26} color={safeActive ? colors.crema : colors.verde} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.safeTitle, safeActive && { color: colors.crema }]}>{safeActive ? 'Datecito Seguro activo' : 'Activar Datecito Seguro'}</Text>
              <Text style={[styles.safeText, safeActive && { color: 'rgba(249,243,236,0.8)' }]}>
                {safeActive ? 'Tu contacto de confianza está al pendiente.' : 'Avisa a alguien de confianza y recibe un check-in durante tu cita.'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeActive ? colors.crema : colors.verde} />
          </Pressable>
        )}

        <View style={{ gap: space.md }}>
          {d.can_confirm ? <Button label="Confirmar datecito" icon="checkmark-done-outline" variant="dark" loading={busy} onPress={() => act(() => datecitos.confirm(d.id))} /> : null}
          <Button label="Ir al chat" icon="chatbubble-ellipses-outline" variant="secondary" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: d.connection_id } })} />
          {!d.is_past && !cancelled ? (
            <Button label="Cancelar datecito" variant="danger" disabled={busy} onPress={() => act(() => datecitos.cancel(d.id), () => router.back())} />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={17} color={colors.coralStrong} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={[styles.status, ok && { backgroundColor: colors.verde }]}>
      <Ionicons name={ok ? 'checkmark-circle' : 'time-outline'} size={14} color={ok ? colors.crema : colors.verde} />
      <Text style={[styles.statusText, ok && { color: colors.crema }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl },
  sent: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.durazno },
  sentText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  ticket: { borderRadius: radius.xxl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  ticketHead: { height: 110, backgroundColor: colors.verde, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: space.xl },
  kindIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(255,107,107,0.18)', alignItems: 'center', justifyContent: 'center' },
  faces: { flexDirection: 'row' },
  ticketBody: { padding: space.xl, gap: space.md },
  kindLabel: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 0.8, color: colors.coralStrong, textTransform: 'uppercase' },
  title: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.verde, marginTop: -6 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  rowText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  cut: { height: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colors.arena, marginVertical: space.xs },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.durazno },
  statusText: { fontFamily: fonts.bold, fontSize: 12, color: colors.verde },
  safe: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: '#E6EFEB', borderWidth: 1, borderColor: '#CFE0D8' },
  safeOn: { backgroundColor: colors.verde, borderColor: colors.verde },
  safeTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  safeText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.text },
});
