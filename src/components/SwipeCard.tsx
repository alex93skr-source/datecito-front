import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { Person } from '../api';
import { withEmoji } from '../data/mock';
import { colors, fonts, radius, space } from '../theme';
import { Chip } from './ui';

const { width } = Dimensions.get('window');
const THRESHOLD = width * 0.28;

export type SwipeCardHandle = { swipe: (dir: 'left' | 'right') => void };

type Props = { person: Person; myInterests: string[]; onSwiped: (dir: 'left' | 'right') => void; onOpen: () => void };

/** Tarjeta de perfil con gesto de deslizar (Animated + PanResponder, sin dependencias nativas). */
export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard({ person, myInterests, onSwiped, onOpen }, ref) {
  const pos = useState(() => new Animated.ValueXY())[0];
  const [photo, setPhoto] = useState(0);
  const common = person.interests.filter((i) => myInterests.includes(i));
  const photos = (person.photos ?? []).map((p) => p.urls.lg);
  const meta = [person.job, person.zone, person.distance_km ? `a ${person.distance_km} km` : null].filter(Boolean).join(' · ');

  const fling = (dir: 'left' | 'right') => {
    Animated.timing(pos, { toValue: { x: (dir === 'right' ? 1.5 : -1.5) * width, y: 40 }, duration: 220, useNativeDriver: false }).start(() => onSwiped(dir)); // la siguiente tarjeta se monta con su propio estado (key)
  };
  useImperativeHandle(ref, () => ({ swipe: fling }));

  const responder = useMemo(
    () =>
      PanResponder.create({
        // Capture: el arrastre horizontal gana aunque empiece sobre una zona tocable.
        onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, g) => {
          if (g.dx > THRESHOLD) fling('right');
          else if (g.dx < -THRESHOLD) fling('left');
          else Animated.spring(pos, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [person.id],
  );

  const rotate = pos.x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-10deg', '0deg', '10deg'] });
  const likeOpacity = pos.x.interpolate({ inputRange: [20, THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = pos.x.interpolate({ inputRange: [-THRESHOLD, -20], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Animated.View {...responder.panHandlers} style={[styles.card, { transform: [{ translateX: pos.x }, { translateY: pos.y }, { rotate }] }]}>
      <Image source={{ uri: photos[photo] }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />

      {/* Zonas de toque para cambiar de foto */}
      <View style={styles.tapZones}>
        <Pressable style={{ flex: 1 }} onPress={() => setPhoto(Math.max(0, photo - 1))} />
        <Pressable style={{ flex: 1 }} onPress={() => setPhoto(Math.min(photos.length - 1, photo + 1))} />
      </View>

      <View style={styles.bars} pointerEvents="none">
        {photos.map((_, i) => (
          <View key={i} style={[styles.bar, i === photo && { backgroundColor: colors.white }]} />
        ))}
      </View>

      <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]} pointerEvents="none">
        <Text style={[styles.stampText, { color: colors.coral }]}>ME GUSTA</Text>
      </Animated.View>
      <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]} pointerEvents="none">
        <Text style={[styles.stampText, { color: colors.crema }]}>NO ME INTERESA</Text>
      </Animated.View>

      <LinearGradient colors={['transparent', 'rgba(15,61,50,0.55)', 'rgba(15,61,50,0.95)']} locations={[0, 0.45, 1]} style={styles.info}>
        <View style={styles.badges}>
          {person.super_liked_me ? (
            <View style={[styles.compat, { backgroundColor: colors.coralStrong }]}>
              <Ionicons name="star" size={12} color={colors.white} />
              <Text style={[styles.compatText, { color: colors.white }]}>Te dio un Super like</Text>
            </View>
          ) : null}
          {common.length ? (
            <View style={styles.compat}>
              <Ionicons name="sparkles" size={12} color={colors.verde} />
              <Text style={styles.compatText}>{common.length} en común</Text>
            </View>
          ) : null}
          {person.music.genres[0] ? (
            <View style={[styles.compat, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
              <Ionicons name="musical-notes" size={12} color={colors.verde} />
              <Text style={styles.compatText}>{person.music.genres[0]}</Text>
            </View>
          ) : null}
        </View>
        <Pressable onPress={onOpen} style={{ gap: 6 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {person.name}, <Text style={styles.age}>{person.age}</Text>
            </Text>
            {person.verified ? <Ionicons name="checkmark-circle" size={22} color={colors.durazno} /> : null}
            {!person.verified && person.verification_pending ? (
              <View style={styles.pendingPill}>
                <Ionicons name="time-outline" size={11} color={colors.crema} />
                <Text style={styles.pendingText}>En verificación</Text>
              </View>
            ) : null}
            <View style={{ flex: 1 }} />
            <View style={styles.more}>
              <Ionicons name="arrow-up" size={18} color={colors.verde} />
            </View>
          </View>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          {person.intent ? (
            <View style={styles.intent}>
              <Ionicons name="heart-circle-outline" size={16} color={colors.durazno} />
              <Text style={styles.intentText}>{person.intent}</Text>
            </View>
          ) : null}
        </Pressable>
        <View style={styles.chips}>
          {person.interests.slice(0, 3).map((i) => (
            <Chip key={i} label={withEmoji(i)} tone="glass" />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radius.xxl, overflow: 'hidden', backgroundColor: colors.durazno },
  tapZones: { ...StyleSheet.absoluteFill, flexDirection: 'row', bottom: '45%' },
  bars: { position: 'absolute', top: 10, left: 14, right: 14, flexDirection: 'row', gap: 5 },
  bar: { flex: 1, height: 3.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  stamp: { position: 'absolute', top: 44, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 3 },
  stampLike: { left: 22, borderColor: colors.coral, transform: [{ rotate: '-12deg' }], backgroundColor: 'rgba(255,255,255,0.9)' },
  stampNope: { right: 22, borderColor: colors.crema, transform: [{ rotate: '12deg' }], backgroundColor: 'rgba(15,61,50,0.6)' },
  stampText: { fontFamily: fonts.extrabold, fontSize: 20, letterSpacing: 1 },
  info: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.xl, paddingTop: 90, gap: space.md },
  badges: { flexDirection: 'row', gap: 6 },
  pendingPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(249,243,236,0.25)', borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 3 },
  pendingText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.crema },
  compat: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.durazno, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  compatText: { fontFamily: fonts.bold, fontSize: 12, color: colors.verde },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.extrabold, fontSize: 32, color: colors.white, letterSpacing: -0.5 },
  age: { fontFamily: fonts.regular },
  more: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.crema, alignItems: 'center', justifyContent: 'center' },
  meta: { fontFamily: fonts.semibold, fontSize: 14, color: 'rgba(255,255,255,0.88)' },
  intent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  intentText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.durazno },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
