import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FocusStatusBar } from '../../components/FocusStatusBar';
import { useNow } from '../../hooks/useNow';
import { fonts, space } from '../../theme';

/** Llamada falsa para salir de una cita incómoda. Imita una llamada entrante genérica. */
export default function FakeCall() {
  const [answeredAt, setAnsweredAt] = useState<number | null>(null);
  const now = useNow();

  useEffect(() => {
    if (answeredAt) return;
    const id = setInterval(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 1200);
    return () => clearInterval(id);
  }, [answeredAt]);

  const secs = answeredAt ? Math.floor((now - answeredAt) / 1000) : 0;
  const elapsed = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <View style={styles.bg}>
      <FocusStatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>M</Text>
          </View>
          <Text style={styles.name}>Mamá</Text>
          <Text style={styles.sub}>{answeredAt ? elapsed : 'Llamada entrante · Móvil'}</Text>
        </View>

        {answeredAt ? (
          <View style={styles.row}>
            <Round icon="mic-off" label="Silenciar" />
            <Round icon="keypad" label="Teclado" />
            <Round icon="volume-high" label="Altavoz" />
          </View>
        ) : null}

        <View style={styles.row}>
          {answeredAt ? (
            <CallButton icon="call" color="#E5484D" rotate label="Colgar" onPress={() => router.back()} />
          ) : (
            <>
              <CallButton icon="call" color="#E5484D" rotate label="Rechazar" onPress={() => router.back()} />
              <CallButton icon="call" color="#30A46C" label="Contestar" onPress={() => setAnsweredAt(Date.now())} />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function Round({ icon, label }: { icon: 'mic-off' | 'keypad' | 'volume-high'; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={styles.round}>
        <Ionicons name={icon} size={26} color="#fff" />
      </View>
      <Text style={styles.btnLabel}>{label}</Text>
    </View>
  );
}

function CallButton({ icon, color, label, onPress, rotate }: { icon: 'call'; color: string; label: string; onPress: () => void; rotate?: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Pressable onPress={onPress} style={[styles.call, { backgroundColor: color }]} accessibilityLabel={label}>
        <Ionicons name={icon} size={30} color="#fff" style={rotate ? { transform: [{ rotate: '135deg' }] } : undefined} />
      </Pressable>
      <Text style={styles.btnLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#1C1C1E' },
  safe: { flex: 1, justifyContent: 'space-between', paddingVertical: space.xxxl },
  top: { alignItems: 'center', gap: space.sm, marginTop: space.xxl },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#3A3A3C', alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  initial: { fontFamily: fonts.bold, fontSize: 40, color: '#fff' },
  name: { fontFamily: fonts.semibold, fontSize: 34, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 16, color: 'rgba(255,255,255,0.7)' },
  row: { flexDirection: 'row', justifyContent: 'space-evenly' },
  round: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  call: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { fontFamily: fonts.regular, fontSize: 14, color: '#fff' },
});
