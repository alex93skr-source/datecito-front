import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError, discover, Filters, me as meApi, Person } from '../../api';
import { Logo } from '../../components/Brand';
import { SwipeCard, SwipeCardHandle } from '../../components/SwipeCard';
import { EmptyState, IconButton, Loading, Screen } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { currentLocation, LocationDeniedError } from '../../lib/device';
import { markSuperLikesSeen, seenSuperLikes } from '../../lib/seen';
import { useMe } from '../../store/Session';
import { colors, fonts, shadow, space } from '../../theme';

const activeFilters = (f: Filters) =>
  [f.intents, f.interests].filter((l) => l.length).length + (f.verifiedOnly ? 1 : 0) + (f.meet !== 'Todas las personas' ? 1 : 0);

export default function Discover() {
  const { me, setMe } = useMe();
  const deck = useRemote(discover.deck, { refetchOnFocus: false });
  const [index, setIndex] = useState(0);
  const card = useRef<SwipeCardHandle>(null);
  const superPending = useRef(false);
  const [toast, setToast] = useState('');
  const [toastAnim] = useState(() => new Animated.Value(0));
  const people = deck.data?.data ?? [];
  const meta = deck.data?.meta;
  // Likes de hoy: vienen con el mazo y se actualizan con cada swipe.
  const [likesOverride, setLikesOverride] = useState<number | null>(null);
  const likesLeft = likesOverride ?? meta?.likes_left ?? null;
  const person: Person | undefined = people[index];
  const superLeft = me.membership.super_likes.free_today + me.membership.super_likes.purchased;
  const [locating, setLocating] = useState(false);

  // Sin ubicación no podemos mostrar distancias ni personas cerca: se invita a activarla.
  const enableLocation = async () => {
    setLocating(true);
    try {
      const loc = await currentLocation();
      await meApi.location(loc.lat, loc.lng, loc.zone);
      setMe(await meApi.get());
      await reload();
    } catch (e) {
      setToast(e instanceof LocationDeniedError ? 'Activa el permiso de ubicación en los ajustes del teléfono.' : 'No logramos ubicarte. Inténtalo en un momento.');
    } finally {
      setLocating(false);
    }
  };

  // Celebra los Super likes nuevos (una vez por persona en este teléfono).
  useEffect(() => {
    const fans = people.filter((p) => p.super_liked_me).map((p) => p.id);
    if (!fans.length) return;
    let cancelled = false;
    (async () => {
      const seen = await seenSuperLikes();
      const fresh = fans.filter((id) => !seen.includes(id));
      if (!fresh.length || cancelled) return;
      await markSuperLikesSeen(fresh);
      router.push({ pathname: '/superlike', params: { id: fresh[0] } });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.data]);

  useEffect(() => {
    if (!toast) return;
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(''));
  }, [toast, toastAnim]);

  const reload = async () => {
    setIndex(0);
    setLikesOverride(null);
    await deck.reload();
  };

  const onSwiped = async (dir: 'left' | 'right') => {
    if (!person) return;
    const isSuper = superPending.current;
    superPending.current = false;
    setIndex((i) => i + 1);

    try {
      const type = dir === 'left' ? 'pass' : isSuper ? 'super' : 'like';
      const result = await discover.swipe(person.id, type);
      setMe({ ...me, membership: { ...me.membership, super_likes: result.super_likes } });
      setLikesOverride(result.likes_left);

      if (dir === 'right') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (result.matched && result.connection_id) {
        router.push({ pathname: '/match', params: { connectionId: result.connection_id } });
      } else if (dir === 'right') {
        setToast(isSuper ? `⭐ Super like enviado: ${person.name} verá tu perfil destacado` : `Le diste like a ${person.name}`);
      } else {
        setToast('Sin problema, seguimos');
      }
      // Al terminar el grupo actual se pide el siguiente (o el motivo de que ya no haya más).
      if (index + 1 >= people.length) void reload();
    } catch (e) {
      // Si falla, la persona vuelve al mazo para no perder la decisión.
      setIndex((i) => Math.max(0, i - 1));
      if (e instanceof ApiError && e.code === 'no_super_likes') router.push('/superlikes');
      else if (e instanceof ApiError && e.code === 'no_likes_left') {
        setLikesOverride(0);
        setToast(e.message);
      }
      else setToast(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
    }
  };

  if (deck.loading && !deck.data) {
    return (
      <Screen edges={['top']}>
        <Header filters={activeFilters(me.filters) > 0} />
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <Header filters={activeFilters(me.filters) > 0} />

      {!me.has_location ? (
        <Pressable style={styles.locBanner} onPress={enableLocation} disabled={locating}>
          <Ionicons name="location-outline" size={18} color={colors.verde} />
          <Text style={styles.locText}>{locating ? 'Buscando tu zona…' : 'Activa tu ubicación para ver personas cerca de ti'}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.verde} />
        </Pressable>
      ) : null}

      <View style={styles.deck}>
        {deck.error && !deck.data ? (
          <Loading error={deck.error.message} onRetry={reload} />
        ) : person ? (
          <>
            {people[index + 1] ? <View style={styles.behind} /> : null}
            <SwipeCard
              key={person.id}
              ref={card}
              person={person}
              myInterests={me.interests}
              onSwiped={onSwiped}
              onOpen={() => router.push({ pathname: '/person/[id]', params: { id: person.id, from: 'discover' } })}
            />
          </>
        ) : meta?.empty_reason === 'daily_limit' ? (
          <View style={styles.empty}>
            <EmptyState
              icon="moon-outline"
              title="Ya viste a tus personas de hoy."
              text={`A medianoche llegan ${meta.profiles_per_day} nuevas. Mientras, quizá ya tienes una conversación esperando.`}
              action="Ir a mis matches"
              onAction={() => router.navigate('/matches')}
            />
          </View>
        ) : (
          <View style={styles.empty}>
            <EmptyState
              icon="sparkles-outline"
              title="Por ahora no hay más personas cerca."
              text="Prueba ampliar la distancia o la edad en tus filtros, o descubre quién está en el mismo lugar que tú con Aquí y ahora."
              action="Ajustar filtros"
              onAction={() => router.push('/filters')}
            />
            <Pressable onPress={() => router.navigate('/here')} hitSlop={10}>
              <Text style={styles.link}>Probar Aquí y ahora</Text>
            </Pressable>
            <Pressable onPress={reload} hitSlop={10}>
              <Text style={styles.reset}>Buscar de nuevo</Text>
            </Pressable>
          </View>
        )}
        {toast ? (
          <Animated.View style={[styles.toast, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        ) : null}
      </View>

      {person ? (
        <View style={styles.actions}>
          <Action icon="close" label="No me interesa" onPress={() => card.current?.swipe('left')} />
          <Action
            icon="star"
            label={`Super like (${superLeft} disponibles)`}
            small
            color={colors.verde}
            count={superLeft}
            onPress={() => {
              if (!superLeft) return router.push('/superlikes');
              superPending.current = true;
              card.current?.swipe('right');
            }}
          />
          <Action
            icon="heart"
            label="Dar like"
            primary
            onPress={() => (likesLeft === 0 ? setToast(`Ya usaste tus ${meta?.likes_per_day ?? ''} likes de hoy. Vuelven a medianoche.`) : card.current?.swipe('right'))}
          />
        </View>
      ) : null}
      {person && likesLeft !== null ? (
        <Text style={styles.pace}>
          {likesLeft === 0 ? 'Sin likes por hoy · vuelven a medianoche' : `Te quedan ${likesLeft} ${likesLeft === 1 ? 'like' : 'likes'} hoy`}
        </Text>
      ) : null}
    </Screen>
  );
}

function Header({ filters }: { filters: boolean }) {
  return (
    <View style={styles.header}>
      <Logo size={24} />
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <IconButton icon="notifications-outline" label="Actividad" tone="soft" onPress={() => router.push('/activity')} />
        <IconButton icon="options-outline" label="Filtros" tone="soft" onPress={() => router.push('/filters')} badge={filters} />
      </View>
    </View>
  );
}

function Action({ icon, label, onPress, primary, small, color, count }: { icon: 'close' | 'heart' | 'star'; label: string; onPress: () => void; primary?: boolean; small?: boolean; color?: string; count?: number }) {
  const size = primary ? 68 : small ? 50 : 60;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.action, { width: size, height: size, borderRadius: size / 2 }, primary && { backgroundColor: colors.coralStrong }, pressed && { transform: [{ scale: 0.92 }] }]}
    >
      <Ionicons name={icon} size={size * 0.45} color={primary ? colors.white : color ?? colors.muted} />
      {count !== undefined ? (
        <View style={[styles.count, !count && { backgroundColor: colors.arena }]}>
          <Text style={styles.countText}>{count || '+'}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, height: 60 },
  locBanner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: space.lg, marginBottom: space.sm, padding: space.md, borderRadius: 14, backgroundColor: '#E6EFEB' },
  locText: { flex: 1, fontFamily: fonts.semibold, fontSize: 13, color: colors.verde },
  deck: { flex: 1, marginHorizontal: space.lg, marginTop: space.xs },
  behind: { position: 'absolute', left: 14, right: 14, top: 10, bottom: -8, borderRadius: 32, backgroundColor: colors.durazno, opacity: 0.6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: space.md },
  reset: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 13, textDecorationLine: 'underline' },
  link: { fontFamily: fonts.bold, color: colors.coralStrong, fontSize: 14 },
  pace: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: -space.sm, marginBottom: space.sm },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xxl, paddingTop: space.lg, paddingBottom: space.md },
  count: { position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: colors.coralStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  countText: { fontFamily: fonts.extrabold, fontSize: 10, color: colors.white },
  action: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow },
  toast: { position: 'absolute', bottom: 16, left: space.lg, right: space.lg, alignItems: 'center' },
  toastText: { fontFamily: fonts.bold, color: colors.crema, fontSize: 13, backgroundColor: colors.verde, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, overflow: 'hidden', textAlign: 'center' },
});
