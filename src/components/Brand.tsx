import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

/** Wordmark "Datecito" con el corazón y los destellos de la marca. */
export function Logo({ size = 26, light = false }: { size?: number; light?: boolean }) {
  const color = light ? colors.crema : colors.verde;
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Datecito">
      <Text style={[styles.word, { fontSize: size, lineHeight: size * 1.15, color }]}>Datecito</Text>
      <View style={{ marginLeft: size * 0.06, marginTop: -size * 0.35 }}>
        <Ionicons name="heart" size={size * 0.48} color={colors.coral} />
      </View>
      <Sparks size={size * 0.55} color={color} />
    </View>
  );
}

function Sparks({ size, color }: { size: number; color: string }) {
  const w = size * 0.45;
  const h = Math.max(2, size * 0.12);
  return (
    <View style={{ marginLeft: size * 0.05, marginTop: -size * 0.3, gap: h * 0.9 }}>
      <View style={[styles.spark, { width: w * 0.7, height: h, backgroundColor: color, transform: [{ rotate: '-30deg' }] }]} />
      <View style={[styles.spark, { width: w, height: h, backgroundColor: color }]} />
      <View style={[styles.spark, { width: w * 0.7, height: h, backgroundColor: color, transform: [{ rotate: '30deg' }] }]} />
    </View>
  );
}

/** Ícono de app: "d" crema sobre coral. */
export function AppMark({ size = 72 }: { size?: number }) {
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Text style={[styles.d, { fontSize: size * 0.72, lineHeight: size * 0.86 }]}>d</Text>
      <View style={{ position: 'absolute', top: size * 0.16, right: size * 0.16 }}>
        <Ionicons name="heart" size={size * 0.26} color={colors.crema} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  word: { fontFamily: fonts.extrabold, letterSpacing: -0.8 },
  spark: { borderRadius: 4 },
  mark: { backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  d: { fontFamily: fonts.extrabold, color: colors.crema, marginTop: -4, marginRight: 6 },
});
