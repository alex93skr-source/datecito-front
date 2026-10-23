import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { discover, LikeTeaser, Person } from '../api';
import { Body, Button, EmptyState, H1, Loading, Notice, Screen, TopBar } from '../components/ui';
import { useRemote } from '../hooks/useRemote';
import { colors, fonts, radius, space } from '../theme';

const TILE_W = Math.floor((Dimensions.get('window').width - space.xl * 2 - space.md) / 2);
const TILE_H = Math.round(TILE_W * 1.3);

/** Personas que te dieron like y aún no has decidido. Con membresía se ven; sin ella, sólo siluetas. */
export default function Likes() {
  const likes = useRemote(discover.likes);

  if (!likes.data) {
    return (
      <Screen>
        <TopBar title="Quién te dio like" />
        <Loading error={likes.error?.message} onRetry={likes.reload} />
      </Screen>
    );
  }

  const { data: people, meta } = likes.data;

  return (
    <Screen>
      <TopBar title="Quién te dio like" />
      {!meta.count ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="heart-outline" title="Todavía nadie, pero ya llegarán." text="Cuando alguien te dé like aparecerá aquí para que decidas sin adivinar." action="Descubrir personas" onAction={() => router.navigate('/discover')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 4 }}>
            <H1>
              {meta.count} {meta.count === 1 ? 'persona te dio like' : 'personas te dieron like'}.
            </H1>
            <Body muted>{meta.locked ? 'Con la membresía las ves y, si te gustan, hacen match al instante.' : 'Dales like de vuelta y hay match al instante; no gasta tus likes del día.'}</Body>
          </View>

          <View style={styles.grid}>
            {meta.locked
              ? (meta.teasers ?? []).map((t, i) => <Teaser key={i} t={t} />)
              : people.map((p) => <Tile key={p.id} p={p} />)}
          </View>

          {meta.locked ? (
            <>
              <Button label="Ver quién con la membresía" icon="sparkles-outline" onPress={() => router.push('/membership')} />
              <Notice icon="lock-closed-outline">Sin membresía nunca mostramos fotos ni nombres de quien te dio like; sólo cuántas personas son.</Notice>
            </>
          ) : null}
        </ScrollView>
      )}
    </Screen>
  );
}

function Tile({ p }: { p: Person }) {
  return (
    <Pressable style={styles.tile} onPress={() => router.push({ pathname: '/person/[id]', params: { id: p.id, from: 'likes' } })}>
      <Image source={{ uri: p.photos?.[0]?.urls.md }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      <LinearGradient colors={['transparent', 'rgba(15,61,50,0.85)']} style={styles.shade} />
      {p.super_liked_me ? (
        <View style={styles.superTag}>
          <Ionicons name="star" size={12} color={colors.white} />
          <Text style={styles.superText}>Super like</Text>
        </View>
      ) : null}
      <View style={styles.caption}>
        <Text style={styles.name} numberOfLines={1}>
          {p.name}, {p.age} {p.verified ? <Ionicons name="checkmark-circle" size={14} color={colors.durazno} /> : null}
        </Text>
        {p.zone ? <Text style={styles.zone} numberOfLines={1}>{p.zone}</Text> : null}
      </View>
    </Pressable>
  );
}

/** Silueta: sin foto ni nombre, sólo inicial, edad y zona. */
function Teaser({ t }: { t: LikeTeaser }) {
  return (
    <View style={[styles.tile, styles.teaser]}>
      <LinearGradient colors={[colors.durazno, colors.coral]} style={StyleSheet.absoluteFill} />
      <View style={styles.blurCircle}>
        <Text style={styles.initial}>{t.initial || '?'}</Text>
      </View>
      {t.super ? (
        <View style={styles.superTag}>
          <Ionicons name="star" size={12} color={colors.white} />
          <Text style={styles.superText}>Super like</Text>
        </View>
      ) : null}
      <View style={styles.caption}>
        <Text style={styles.name}>
          {t.initial ? `${t.initial}.` : ''} {t.age ?? ''} {t.verified ? <Ionicons name="checkmark-circle" size={14} color={colors.crema} /> : null}
        </Text>
        {t.zone ? <Text style={styles.zone}>{t.zone}</Text> : null}
      </View>
      <View style={styles.lock}>
        <Ionicons name="lock-closed" size={16} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: { width: TILE_W, height: TILE_H, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.durazno, justifyContent: 'flex-end' },
  teaser: { alignItems: 'center', justifyContent: 'center' },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  caption: { position: 'absolute', left: space.md, right: space.md, bottom: space.md, gap: 2 },
  name: { fontFamily: fonts.extrabold, fontSize: 17, color: colors.crema },
  zone: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(249,243,236,0.85)' },
  superTag: { position: 'absolute', top: space.sm, left: space.sm, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.coralStrong, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4 },
  superText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  blurCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center', marginBottom: space.xl },
  initial: { fontFamily: fonts.extrabold, fontSize: 36, color: colors.white },
  lock: { position: 'absolute', top: space.sm, right: space.sm, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(15,61,50,0.55)', alignItems: 'center', justifyContent: 'center' },
});
