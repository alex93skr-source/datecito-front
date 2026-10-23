import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { safety } from '../../api';
import { Avatar, Button, EmptyState, Loading, Screen, TopBar } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { colors, fonts, radius, space } from '../../theme';

export default function Blocked() {
  const blocks = useRemote(safety.blocks);

  const unblock = async (id: string) => {
    blocks.setData((list) => (list ?? []).filter((p) => p.id !== id));
    await safety.unblock(id).catch(() => blocks.reload());
  };

  return (
    <Screen>
      <TopBar title="Personas bloqueadas" />
      {!blocks.data ? (
        <Loading error={blocks.error?.message} onRetry={blocks.reload} />
      ) : blocks.data.length ? (
        <ScrollView contentContainerStyle={{ padding: space.xl, gap: space.md }}>
          {blocks.data.map((p) => (
            <View key={p.id} style={styles.row}>
              <Avatar uri={p.photos?.[0]?.urls.sm ?? ''} size={48} />
              <Text style={styles.name}>{p.name}</Text>
              <Button label="Desbloquear" variant="secondary" style={styles.btn} onPress={() => unblock(p.id)} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="ban-outline" title="No has bloqueado a nadie." text="Si bloqueas a alguien, no podrá verte ni escribirte. Esa persona no recibe aviso." />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  name: { flex: 1, fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  btn: { height: 40, paddingHorizontal: space.md },
});
