import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { discover } from '../api';
import { Logo } from '../components/Brand';
import { FocusStatusBar } from '../components/FocusStatusBar';
import { Button } from '../components/ui';
import { useRemote } from '../hooks/useRemote';
import { colors, fonts, space } from '../theme';

/** Estrellas que salen disparadas alrededor de la foto. */
const SPARKS = [
  { angle: -90, size: 26 },
  { angle: -40, size: 18 },
  { angle: 0, size: 22 },
  { angle: 40, size: 16 },
  { angle: 90, size: 24 },
  { angle: 140, size: 18 },
  { angle: 180, size: 22 },
  { angle: 220, size: 16 },
];

/** Celebración al recibir un Super like: se muestra una vez por persona. */
export default function SuperLike() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = useRemote(() => discover.person(id), { refetchOnFocus: false }).data;
  const [pop] = useState(() => new Animated.Value(0));
  const [burst] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!person) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.sequence([
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(burst, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [person, pop, burst, pulse]);

  if (!person) return <View style={styles.bg} />;
  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View style={styles.bg}>
      <FocusStatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <View style={{ alignItems: 'center' }}>
          <Logo light size={22} />
        </View>

        <Animated.View style={[styles.center, { opacity: pop, transform: [{ scale }] }]}>
          <View style={styles.stage}>
            {SPARKS.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              const translateX = burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(rad) * 150] });
              const translateY = burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(rad) * 150] });
              const opacity = burst.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });
              return (
                <Animated.View key={i} style={[styles.spark, { opacity, transform: [{ translateX }, { translateY }] }]}>
                  <Ionicons name="star" size={s.size} color={colors.durazno} />
                </Animated.View>
              );
            })}
            <Image source={{ uri: person.photos?.[0]?.urls.md }} style={styles.face} contentFit="cover" />
            <Animated.View style={[styles.star, { transform: [{ scale: pulse }] }]}>
              <Ionicons name="star" size={34} color={colors.white} />
            </Animated.View>
          </View>
          <Text style={styles.eyebrow}>SUPER LIKE</Text>
          <Text style={styles.title}>¡Le gustas a {person.name}!</Text>
          <Text style={styles.copy}>Tu perfil le gustó tanto que usó su Super like contigo. Si le das like, hay match al instante.</Text>
        </Animated.View>

        <View style={{ gap: space.md }}>
          <Button label="Ver su perfil" icon="person-outline" variant="light" onPress={() => router.replace({ pathname: '/person/[id]', params: { id: person.id, from: 'discover' } })} />
          <Button label="Después" variant="ghost" style={{ borderColor: 'transparent' }} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.coralStrong },
  safe: { flex: 1, padding: space.xl, justifyContent: 'space-between' },
  center: { alignItems: 'center', gap: space.sm },
  stage: { width: 220, height: 240, alignItems: 'center', justifyContent: 'center', marginBottom: space.lg },
  spark: { position: 'absolute' },
  face: { width: 170, height: 210, borderRadius: 32, borderWidth: 4, borderColor: colors.crema, backgroundColor: colors.durazno },
  star: { position: 'absolute', bottom: 0, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.coralStrong },
  eyebrow: { fontFamily: fonts.extrabold, fontSize: 13, letterSpacing: 2, color: colors.durazno },
  title: { fontFamily: fonts.extrabold, fontSize: 34, color: colors.crema, letterSpacing: -0.5, textAlign: 'center' },
  copy: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: 'rgba(249,243,236,0.9)', textAlign: 'center', maxWidth: 310 },
});
