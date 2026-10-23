import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityItem, discover } from '../api';
import { Button, EmptyState, IconName, Loading, Screen, TopBar } from '../components/ui';
import { useRemote } from '../hooks/useRemote';
import { colors, fonts, radius, space } from '../theme';

const icons: Record<ActivityItem['type'], IconName> = { match: 'heart', message: 'chatbubble', datecito: 'calendar', super_like: 'star' };

const ago = (iso: string) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'Ayer' : `Hace ${days} días`;
};

export default function Activity() {
  // De 10 en 10: la primera página se recarga al entrar; 'Ver más' agrega la siguiente.
  const feed = useRemote(() => discover.activity(1));
  const [loadingMore, setLoadingMore] = useState(false);
  const items = feed.data?.data;

  const more = async () => {
    if (!feed.data) return;
    setLoadingMore(true);
    try {
      const next = await discover.activity(feed.data.meta.page + 1);
      feed.setData((prev) => ({ data: [...(prev?.data ?? []), ...next.data], meta: next.meta }));
    } catch {
      // Si falla, el botón sigue ahí para intentarlo de nuevo.
    } finally {
      setLoadingMore(false);
    }
  };

  const open = (item: ActivityItem) => {
    if (item.type === 'super_like' && item.person_id) router.push({ pathname: '/person/[id]', params: { id: item.person_id, from: 'discover' } });
    else if (item.connection_id) router.push({ pathname: '/chat/[id]', params: { id: item.connection_id } });
    else if (item.datecito_id) router.push({ pathname: '/plan/[id]', params: { id: item.datecito_id } });
  };

  return (
    <Screen>
      <TopBar title="Actividad" />
      {!items ? (
        <Loading error={feed.error?.message} onRetry={feed.reload} />
      ) : !items.length ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="notifications-outline" title="Todo tranquilo por aquí." text="Cuando tengas matches, mensajes o datecitos nuevos aparecerán aquí." />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.sm }}>
          {items.map((n, i) => {
            // Un Super like se ve distinto a todo lo demás: tarjeta coral con estrella.
            const superLike = n.type === 'super_like';
            return (
              <Pressable key={`${n.type}-${n.created_at}-${i}`} onPress={() => open(n)} style={({ pressed }) => [styles.item, superLike && styles.superItem, pressed && { opacity: 0.85 }]}>
                <View style={[styles.iconWrap, superLike && styles.superIcon]}>
                  <Ionicons name={icons[n.type]} size={superLike ? 24 : 20} color={superLike ? colors.white : colors.coralStrong} />
                </View>
                <View style={{ flex: 1 }}>
                  {superLike ? <Text style={styles.superEyebrow}>SUPER LIKE</Text> : null}
                  <Text style={[styles.title, superLike && { color: colors.white }]}>{n.title}</Text>
                  <Text style={[styles.text, superLike && { color: 'rgba(255,255,255,0.9)' }]}>{n.text}</Text>
                  <Text style={[styles.time, superLike && { color: 'rgba(255,255,255,0.75)' }]}>{ago(n.created_at)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={superLike ? colors.white : colors.subtle} />
              </Pressable>
            );
          })}
          {feed.data?.meta.has_more ? <Button label="Ver más" variant="secondary" loading={loadingMore} onPress={more} style={{ marginTop: space.sm }} /> : null}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  text: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  time: { fontFamily: fonts.regular, fontSize: 12, color: colors.subtle, marginTop: 2 },
  superItem: { backgroundColor: colors.coralStrong, borderColor: colors.coralStrong },
  superIcon: { backgroundColor: colors.verde, width: 48, height: 48, borderRadius: 24 },
  superEyebrow: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: 1.5, color: colors.durazno, marginBottom: 2 },
});
