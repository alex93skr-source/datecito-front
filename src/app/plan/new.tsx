import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, connections, datecitos, PlanKind } from '../../api';
import { CalendarPicker, TimePicker, timeLabel, toIso } from '../../components/DatePicker';
import { Avatar, Body, Button, Chip, ErrorNotice, Field, H1, IconName, Loading, Notice, Screen, TopBar } from '../../components/ui';
import { planKinds } from '../../data/mock';
import { useRemote } from '../../hooks/useRemote';
import { colors, fonts, radius, space } from '../../theme';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export default function NewPlan() {
  const params = useLocalSearchParams<{ connectionId?: string }>();
  const list = useRemote(connections.list, { refetchOnFocus: false });
  const [connectionId, setConnectionId] = useState(params.connectionId);
  const [kind, setKind] = useState<PlanKind>('cafe');
  const [place, setPlace] = useState('');
  const [zone, setZone] = useState('');
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Agenda: los días que ya tienes un datecito se marcan con un punto en el calendario.
  const agenda = useRemote(datecitos.list, { refetchOnFocus: false });
  const active = (agenda.data ?? []).filter((d) => d.status !== 'cancelled' && !d.is_past);
  const marked = active.map((d) => d.scheduled_on).filter((d): d is string => !!d);

  if (!list.data) return <Screen><TopBar title="Proponer datecito" /><Loading error={list.error?.message} onRetry={list.reload} /></Screen>;

  const selected = list.data.find((c) => c.id === (connectionId ?? list.data?.[0]?.id));
  const label = planKinds.find((k) => k.key === kind)?.label.toLowerCase();

  const submit = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const d = await connections.propose(selected.id, {
        kind,
        place: place.trim(),
        zone: zone.trim() || selected.person.zone || 'Por definir',
        scheduled_at: toIso(day as Date, time as string),
        note: note.trim() || null,
      });
      await connections.send(selected.id, `📅 Te propuse un datecito: ${d.place}, ${d.when_label.toLowerCase()}.${note.trim() ? ` ${note.trim()}` : ''}`).catch(() => undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace({ pathname: '/plan/[id]', params: { id: d.id, created: '1' } });
    } catch (e) {
      setError(e instanceof ApiError ? (Object.values(e.errors)[0]?.[0] ?? e.message) : 'Eso no salió. Inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Proponer datecito" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <H1>¿Se arma?</H1>
          <Body muted>Propón un plan sencillo. Es una invitación, no un compromiso: ambos confirman antes de que sea un plan.</Body>
        </View>

        {!params.connectionId ? (
          <>
            <Text style={styles.label}>¿Con quién?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.md }}>
              {list.data.map((c) => {
                const on = c.id === selected?.id;
                return (
                  <Pressable key={c.id} onPress={() => setConnectionId(c.id)} style={{ alignItems: 'center', gap: 4, opacity: on ? 1 : 0.55 }}>
                    <Avatar uri={c.person.photos?.[0]?.urls.sm ?? ''} size={56} ring={on} />
                    <Text style={styles.small}>{c.person.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        ) : selected ? (
          <View style={styles.with}>
            <Avatar uri={selected.person.photos?.[0]?.urls.sm ?? ''} size={44} />
            <Text style={styles.withText}>Datecito con {selected.person.name}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>1. ¿Qué plan?</Text>
        <View style={styles.wrap}>
          {planKinds.map((k) => (
            <Chip key={k.key} label={k.label} icon={k.icon as IconName} selected={kind === k.key} onPress={() => setKind(k.key)} />
          ))}
        </View>

        <Text style={styles.label}>2. ¿Dónde?</Text>
        <Field icon="storefront-outline" placeholder={`Nombre del lugar (${label})`} value={place} onChangeText={setPlace} maxLength={80} />
        <Field icon="map-outline" placeholder="Zona o colonia (ej. Roma Norte)" value={zone} onChangeText={setZone} maxLength={60} />

        <Text style={styles.label}>3. ¿Cuándo?</Text>
        <CalendarPicker
          value={day}
          marked={marked}
          onChange={(d) => {
            setDay(d);
            setTime(null);
          }}
        />
        {marked.length ? <Text style={styles.small}>● Días en los que ya tienes un datecito.</Text> : null}
        {day ? (
          <>
            <Text style={styles.sub}>¿A qué hora?</Text>
            <TimePicker date={day} value={time} onChange={setTime} />
          </>
        ) : null}
        {day && time ? (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              📅 {DAYS[day.getDay()]} {day.getDate()} de {MONTHS[day.getMonth()]}, {timeLabel(time)}
            </Text>
          </View>
        ) : null}

        <Field label="Mensaje (opcional)" placeholder="Ej. Yo invito el primer café ☕" value={note} onChangeText={setNote} multiline maxLength={200} />
        <Notice>Para los primeros datecitos, elige un lugar público y concurrido.</Notice>
        <ErrorNotice message={error} />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Enviar propuesta" icon="paper-plane-outline" loading={loading} disabled={place.trim().length < 2 || !day || !time || !selected} onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.md, paddingBottom: space.xxl },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde, marginTop: space.sm },
  small: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  sub: { fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  summary: { backgroundColor: colors.duraznoSoft, borderRadius: radius.md, padding: space.md },
  summaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.verde },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  with: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  withText: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  footer: { padding: space.xl, paddingTop: space.md, borderTopWidth: 1, borderTopColor: colors.border },
});
