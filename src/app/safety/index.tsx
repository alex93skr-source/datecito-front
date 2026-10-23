import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { me as meApi, safety, Settings } from '../../api';
import { Body, Group, IconName, ListRow, Screen, ToggleRow, TopBar } from '../../components/ui';
import { safetyTips } from '../../data/mock';
import { useRemote } from '../../hooks/useRemote';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const verificationLabel = { none: 'Pendiente', pending: 'En revisión', approved: 'Verificado', rejected: 'Inténtalo de nuevo' } as const;

export default function Safety() {
  const { me, setMe, refreshMe } = useMe();
  const contacts = useRemote(safety.contacts);
  const session = useRemote(safety.currentSession);

  useFocusEffect(
    useCallback(() => {
      void refreshMe();
    }, [refreshMe]),
  );

  const setPref = async (key: keyof Settings, value: boolean) => {
    setMe({ ...me, settings: { ...me.settings, [key]: value } });
    try {
      setMe(await meApi.settings({ [key]: value }));
    } catch {
      void refreshMe();
    }
  };

  const contactCount = contacts.data?.length ?? 0;
  const steps = [
    { done: me.verification.verified, label: 'Verifica tu perfil', to: '/safety/verify' as const },
    { done: contactCount > 0, label: 'Agrega un contacto de confianza', to: '/safety/contacts' as const },
    { done: me.settings.only_verified_messages || me.settings.i_write_first, label: 'Elige quién puede escribirte', to: null },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <Screen>
      <TopBar title="Centro de seguridad" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="shield-checkmark" size={34} color={colors.coral} />
          <Text style={styles.heroTitle}>Tú decides con quién hablar y cuándo parar.</Text>
          <Body style={{ color: 'rgba(249,243,236,0.85)' }}>Herramientas para que cada datecito se sienta tranquilo, antes, durante y después.</Body>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHead}>
            <Text style={styles.progressTitle}>Tu configuración de seguridad</Text>
            <Text style={styles.progressCount}>
              {doneCount}/{steps.length}
            </Text>
          </View>
          {steps.map((s) => (
            <Pressable key={s.label} style={styles.step} disabled={!s.to} onPress={() => s.to && router.push(s.to)}>
              <Ionicons name={s.done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={s.done ? colors.success : colors.arena} />
              <Text style={[styles.stepText, s.done && { color: colors.muted, textDecorationLine: 'line-through' }]}>{s.label}</Text>
              {s.to && !s.done ? <Ionicons name="chevron-forward" size={16} color={colors.subtle} /> : null}
            </Pressable>
          ))}
        </View>

        <Group title="Antes de conocerse">
          <ListRow icon="checkmark-circle-outline" label="Verificación con selfie" value={verificationLabel[me.verification.status]} onPress={() => router.push('/safety/verify')} />
          <ToggleRow icon="ribbon-outline" label="Sólo me escriben perfiles verificados" value={me.settings.only_verified_messages} onChange={(v) => setPref('only_verified_messages', v)} />
          <ToggleRow icon="hand-left-outline" label="Yo escribo primero" description="Al hacer match, sólo tú puedes iniciar la conversación." value={me.settings.i_write_first} onChange={(v) => setPref('i_write_first', v)} />
          <ToggleRow icon="warning-outline" label="Avisar antes de mensajes ofensivos" value={me.settings.offensive_warning} onChange={(v) => setPref('offensive_warning', v)} last />
        </Group>

        <Group title="El día del datecito">
          <ListRow icon="shield-checkmark-outline" label="Datecito Seguro" value={session.data ? 'Activo' : undefined} onPress={() => router.push('/safety/date-mode')} />
          <ListRow icon="people-outline" label="Contactos de confianza" value={`${contactCount}`} onPress={() => router.push('/safety/contacts')} />
          <ListRow icon="call-outline" label="Llamada de salida" onPress={() => router.push('/safety/fake-call')} last />
        </Group>

        <Group title="Si algo no está bien">
          <ListRow icon="flag-outline" label="Reportar a alguien" onPress={() => router.push('/safety/report')} />
          <ListRow icon="ban-outline" label="Personas bloqueadas" onPress={() => router.push('/settings/blocked')} last />
        </Group>

        <Text style={styles.section}>Consejos para tu datecito</Text>
        {safetyTips.map((t) => (
          <View key={t.title} style={styles.tip}>
            <View style={styles.tipIcon}>
              <Ionicons name={t.icon as IconName} size={20} color={colors.verde} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.tipTitle}>{t.title}</Text>
              <Text style={styles.tipText}>{t.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl },
  hero: { backgroundColor: colors.verde, borderRadius: radius.xl, padding: space.xl, gap: space.sm },
  heroTitle: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.crema },
  progressCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: colors.border },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xs },
  progressTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  progressCount: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.coralStrong },
  step: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 6 },
  stepText: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  section: { fontFamily: fonts.semibold, fontSize: 19, color: colors.verde, marginTop: space.sm },
  tip: { flexDirection: 'row', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tipIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  tipText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
});
