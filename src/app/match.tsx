import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FocusStatusBar } from '../components/FocusStatusBar';
import { Logo } from '../components/Brand';
import { Button } from '../components/ui';
import { connections } from '../api';
import { useRemote } from '../hooks/useRemote';
import { useMe } from '../store/Session';
import { colors, fonts, space } from '../theme';

export default function Match() {
  const { connectionId } = useLocalSearchParams<{ connectionId: string }>();
  const { me } = useMe();
  const connection = useRemote(() => connections.get(connectionId), { refetchOnFocus: false });
  const person = connection.data?.person;
  const [pop] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
  }, [pop]);

  if (!person) return <View style={styles.bg} />;
  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <View style={styles.bg}>
      <FocusStatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <View style={{ alignItems: 'center' }}>
          <Logo light size={22} />
        </View>

        <Animated.View style={[styles.center, { opacity: pop, transform: [{ scale }] }]}>
          <View style={styles.faces}>
            <Image source={{ uri: me.photos[0]?.urls.md }} style={[styles.face, { transform: [{ rotate: '-8deg' }] }]} />
            <Image source={{ uri: person.photos?.[0]?.urls.md }} style={[styles.face, { marginLeft: -30, transform: [{ rotate: '8deg' }] }]} />
            <View style={styles.heart}>
              <Ionicons name="heart" size={30} color={colors.white} />
            </View>
          </View>
          <Text style={styles.title}>¡Hay match!</Text>
          <Text style={styles.copy}>
            A ti y a {person.name} les gustó conocerse. Ahora sí: ¿quién manda el primer mensaje?
          </Text>
        </Animated.View>

        <View style={{ gap: space.md }}>
          <Button label={`Escribirle a ${person.name}`} icon="chatbubble-ellipses-outline" onPress={() => router.replace({ pathname: '/chat/[id]', params: { id: connectionId } })} />
          <Button label="Seguir descubriendo" variant="ghost" style={{ borderColor: 'transparent' }} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.verde },
  safe: { flex: 1, padding: space.xl, justifyContent: 'space-between' },
  center: { alignItems: 'center', gap: space.lg },
  faces: { flexDirection: 'row', alignItems: 'center', marginBottom: space.md },
  face: { width: 140, height: 180, borderRadius: 28, borderWidth: 4, borderColor: colors.crema, backgroundColor: colors.durazno },
  heart: { position: 'absolute', bottom: -22, alignSelf: 'center', left: '50%', marginLeft: -28, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.verde },
  title: { fontFamily: fonts.extrabold, fontSize: 42, color: colors.crema, letterSpacing: -1, marginTop: space.lg },
  copy: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: 'rgba(249,243,236,0.85)', textAlign: 'center', maxWidth: 300 },
});
