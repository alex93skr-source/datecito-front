import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { connections, datecitos } from '../../api';
import { DatecitoCard } from '../../components/DatecitoCard';
import { LikesBanner } from '../../components/LikesBanner';
import { Avatar, Body, EmptyState, ErrorNotice, H1, Loading, Screen, SectionTitle } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { colors, fonts, radius, space } from '../../theme';

const timeLabel = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

export default function Matches() {
  const list = useRemote(connections.list);
  const dates = useRemote(datecitos.list);
  const all = list.data ?? [];
  const fresh = all.filter((c) => !c.last_message);
  const talking = all.filter((c) => c.last_message);
  const refresh = () => {
    void list.reload();
    void dates.reload();
  };

  if (list.loading && !list.data) {
    return (
      <Screen edges={['top']}>
        <Loading />
      </Screen>
    );
  }

  if (list.error && !list.data) {
    return (
      <Screen edges={['top']}>
        <Loading error={list.error.message} onRetry={refresh} />
      </Screen>
    );
  }

  if (!all.length) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: space.xl, gap: space.lg }}>
          <LikesBanner />
          <EmptyState icon="heart-outline" title="Aún no hay matches." text="Cuando alguien que te gusta también te elija, aparecerá aquí." action="Descubrir personas" onAction={() => router.navigate('/discover')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}>
        <View style={{ gap: 4 }}>
          <H1>Tus conexiones</H1>
          <Body muted>Personas que también eligieron conocerte.</Body>
        </View>

        <LikesBanner />

        {dates.data?.length ? (
          <>
            <SectionTitle>Tus datecitos</SectionTitle>
            {dates.data.map((d) => (
              <DatecitoCard
                key={d.id}
                d={d}
                onPress={() => router.push(d.is_past && !d.feedback_sent && d.status === 'confirmed' ? { pathname: '/plan/feedback', params: { id: d.id } } : { pathname: '/plan/[id]', params: { id: d.id } })}
              />
            ))}
          </>
        ) : null}

        {fresh.length ? (
          <>
            <SectionTitle>Nuevos matches</SectionTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.xl }} contentContainerStyle={styles.newRow}>
              {fresh.map((c) => (
                <Pressable key={c.id} style={styles.newItem} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: c.id } })}>
                  <Avatar uri={c.person.photos?.[0]?.urls.sm ?? ''} size={68} ring />
                  <Text style={styles.newName}>{c.person.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : null}

        <SectionTitle>Mensajes</SectionTitle>
        <ErrorNotice message={list.error?.message} />
        <View style={styles.list}>
          {talking.map((c, i) => {
            const last = c.last_message!;
            const theirTurn = !last.from_me;
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: c.id } })}
                style={({ pressed }) => [styles.row, i < talking.length - 1 && styles.rowBorder, pressed && { backgroundColor: colors.surfaceAlt }]}
              >
                <Avatar uri={c.person.photos?.[0]?.urls.sm ?? ''} size={56} />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.rowHead}>
                    <Text style={styles.name}>{c.person.name}</Text>
                    {c.has_active_datecito ? (
                      <View style={styles.datePill}>
                        <Ionicons name="calendar" size={10} color={colors.verde} />
                        <Text style={styles.datePillText}>Datecito</Text>
                      </View>
                    ) : null}
                    <View style={{ flex: 1 }} />
                    <Text style={styles.time}>{timeLabel(last.created_at)}</Text>
                  </View>
                  <Text style={[styles.preview, theirTurn && styles.previewTheirs]} numberOfLines={1}>
                    {last.from_me ? 'Tú: ' : ''}
                    {last.preview}
                  </Text>
                </View>
              </Pressable>
            );
          })}
          {!talking.length ? (
            <View style={{ padding: space.lg }}>
              <Body muted>Rompe el hielo con algo que sí quieras saber. ✨</Body>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, gap: space.lg, paddingBottom: space.xxxl },
  newRow: { paddingHorizontal: space.xl, gap: space.lg },
  newItem: { alignItems: 'center', gap: 6 },
  newName: { fontFamily: fonts.bold, fontSize: 13, color: colors.verde },
  list: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  time: { fontFamily: fonts.regular, fontSize: 12, color: colors.subtle },
  preview: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  previewTheirs: { fontFamily: fonts.semibold, color: colors.text },
  datePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.durazno, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  datePillText: { fontFamily: fonts.bold, fontSize: 10, color: colors.verde },
});
