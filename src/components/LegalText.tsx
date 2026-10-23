import { Linking, StyleSheet, Text, View } from 'react-native';

import type { Block } from '../lib/legal';
import { colors, fonts, radius, space, type } from '../theme';

/**
 * Texto con el mismo formato que el sitio: **negritas**, correos @datecito.com
 * que abren el correo y [datos pendientes] resaltados.
 */
export function Rich({ text, style }: { text: string; style?: object }) {
  const parts = text.split(/(\[[^\]]+\]|[\w.-]+@datecito\.com|\*\*[^*]+\*\*)/g);
  return (
    <Text style={[styles.body, style]}>
      {parts.map((p, i) => {
        if (/^\[[^\]]+\]$/.test(p)) return <Text key={i} style={styles.pending}>{p}</Text>;
        if (/@datecito\.com$/.test(p))
          return (
            <Text key={i} style={styles.link} onPress={() => Linking.openURL(`mailto:${p}`)}>
              {p}
            </Text>
          );
        if (/^\*\*.+\*\*$/.test(p)) return <Text key={i} style={styles.strong}>{p.slice(2, -2)}</Text>;
        return p;
      })}
    </Text>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === 'string') return <Rich key={i} text={b} />;
        if ('ul' in b || 'ol' in b) {
          const items = 'ul' in b ? b.ul : b.ol;
          return (
            <View key={i} style={{ gap: space.sm }}>
              {items.map((t, n) => (
                <View key={n} style={styles.item}>
                  <Text style={styles.bullet}>{'ul' in b ? '•' : `${n + 1}.`}</Text>
                  <Rich text={t} style={{ flex: 1 }} />
                </View>
              ))}
            </View>
          );
        }
        if ('h3' in b) return <Text key={i} style={styles.h3}>{b.h3}</Text>;
        if ('note' in b)
          return (
            <View key={i} style={styles.note}>
              <Rich text={b.note} />
            </View>
          );
        return (
          <View key={i} style={styles.table}>
            {[b.table.head, ...b.table.rows].map((row, r) => (
              <View key={r} style={[styles.tableRow, r > 0 && styles.tableBorder]}>
                {row.map((cell, c) => (
                  <Rich key={c} text={cell} style={[styles.cell, r === 0 && styles.strong]} />
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  body: { ...type.body, fontSize: 14, lineHeight: 21 },
  strong: { fontFamily: fonts.bold, color: colors.ink },
  link: { fontFamily: fonts.semibold, color: colors.coralStrong },
  pending: { backgroundColor: colors.duraznoSoft, color: colors.coralStrong },
  item: { flexDirection: 'row', gap: space.sm, paddingRight: space.sm },
  bullet: { ...type.body, fontSize: 14, color: colors.coralStrong, minWidth: 14 },
  h3: { ...type.h3, marginTop: space.sm },
  note: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.lg },
  table: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', gap: space.sm, padding: space.md },
  tableBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  cell: { flex: 1, fontSize: 13, lineHeight: 18 },
});
