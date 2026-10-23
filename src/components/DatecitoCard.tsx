import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Datecito } from '../api';
import { planKinds } from '../data/mock';
import { colors, fonts, radius, space } from '../theme';
import { Avatar, IconName } from './ui';

export function DatecitoCard({ d, onPress }: { d: Datecito; onPress: () => void }) {
  const kind = planKinds.find((k) => k.key === d.kind);
  const confirmed = d.status === 'confirmed';
  const label = d.is_past
    ? d.feedback_sent
      ? 'Ya nos contaste cómo te fue'
      : '¿Cómo te fue? Cuéntanos'
    : confirmed
      ? 'Confirmado por ambos'
      : d.can_confirm
        ? 'Te lo propusieron: confirma'
        : 'Esperando confirmación';
  const icon: IconName = d.is_past ? 'chatbox-ellipses-outline' : confirmed ? 'checkmark-circle' : 'time-outline';
  const strong = confirmed && !d.is_past;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, d.is_past && styles.past, pressed && { opacity: 0.92 }]}>
      <View style={styles.kind}>
        <Ionicons name={(kind?.icon ?? 'calendar-outline') as IconName} size={22} color={colors.coralStrong} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.title} numberOfLines={1}>
          {d.place} con {d.person.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {d.when_label} · {d.zone}
        </Text>
        <View style={[styles.status, strong && styles.statusOk]}>
          <Ionicons name={icon} size={13} color={strong ? colors.crema : colors.verde} />
          <Text style={[styles.statusText, strong && { color: colors.crema }]}>{label}</Text>
        </View>
      </View>
      {d.person.photos?.[0] ? <Avatar uri={d.person.photos[0].urls.sm} size={44} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.md, borderWidth: 1, borderColor: colors.border },
  past: { backgroundColor: colors.surfaceAlt },
  kind: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  status: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.durazno },
  statusOk: { backgroundColor: colors.verde },
  statusText: { fontFamily: fonts.bold, fontSize: 11, color: colors.verde },
});
