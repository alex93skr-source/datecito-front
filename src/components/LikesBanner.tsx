import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { discover } from '../api';
import { useRemote } from '../hooks/useRemote';
import { colors, fonts, radius, space } from '../theme';
import { Avatar } from './ui';

/** "N personas te dieron like": entrada a la pantalla de likes recibidos. */
export function LikesBanner() {
  const likes = useRemote(discover.likes);
  const count = likes.data?.meta.count ?? 0;
  if (!count) return null;
  const faces = likes.data?.meta.locked ? [] : (likes.data?.data ?? []).slice(0, 3);

  return (
    <Pressable onPress={() => router.push('/likes')} style={({ pressed }) => [styles.banner, pressed && { opacity: 0.9 }]}>
      <View style={styles.faces}>
        {faces.length ? (
          faces.map((p, i) => (
            <View key={p.id} style={[styles.face, i > 0 && { marginLeft: -14 }]}>
              <Avatar uri={p.photos?.[0]?.urls.sm ?? ''} size={40} />
            </View>
          ))
        ) : (
          <View style={styles.heart}>
            <Ionicons name="heart" size={22} color={colors.white} />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {count} {count === 1 ? 'persona te dio like' : 'personas te dieron like'}
        </Text>
        <Text style={styles.text}>{likes.data?.meta.locked ? 'Descubre quiénes con la membresía' : 'Toca para verlas y decidir'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.coralStrong} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.xl, backgroundColor: colors.duraznoSoft, borderWidth: 1, borderColor: colors.durazno },
  faces: { flexDirection: 'row', alignItems: 'center' },
  face: { borderRadius: 22, borderWidth: 2, borderColor: colors.duraznoSoft },
  heart: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.coralStrong, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  text: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
});
