import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, safety } from '../../api';
import { Body, Button, ErrorNotice, Eyebrow, Field, H1, Notice, Option, Screen, TopBar } from '../../components/ui';
import { colors, fonts, space } from '../../theme';

const reasons = [
  { label: 'Comportamiento inapropiado', icon: 'warning-outline' as const },
  { label: 'Perfil falso o spam', icon: 'person-remove-outline' as const },
  { label: 'Me preocupa mi seguridad', icon: 'alert-circle-outline' as const },
  { label: 'Es menor de edad', icon: 'body-outline' as const },
];

export default function Report() {
  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      await safety.report({ user_id: id, reason, details: details.trim() || undefined, also_block: !!id && alsoBlock });
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos enviar tu reporte. Inténtalo otra vez.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <Screen>
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <Ionicons name="checkmark" size={40} color={colors.white} />
          </View>
          <H1 center>Gracias por avisarnos.</H1>
          <Body muted center>
            Revisaremos tu reporte con cuidado y discreción. {id && alsoBlock ? `${name || 'Esa persona'} ya no podrá verte ni escribirte.` : ''}
          </Body>
          <Button label="Volver a Datecito" style={{ alignSelf: 'stretch', marginTop: space.lg }} onPress={() => router.dismissTo('/discover')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Reportar" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Eyebrow>CENTRO DE SEGURIDAD</Eyebrow>
        <H1>Tu tranquilidad es prioridad.</H1>
        <Body muted>Cuéntanos qué ocurrió. Tu reporte es confidencial: nunca le diremos quién lo envió.</Body>
        {id && name ? <Text style={styles.whoText}>Reportando a {name}</Text> : null}
        <View style={{ gap: space.sm }}>
          {reasons.map((r) => (
            <Option key={r.label} label={r.label} icon={r.icon} selected={reason === r.label} onPress={() => setReason(r.label)} />
          ))}
        </View>
        <Field label="Detalles (opcional)" placeholder="Qué pasó, cuándo, y cualquier dato concreto que nos ayude." multiline maxLength={2000} value={details} onChangeText={setDetails} />
        {id ? (
          <Pressable style={styles.check} onPress={() => setAlsoBlock(!alsoBlock)} accessibilityRole="checkbox" accessibilityState={{ checked: alsoBlock }}>
            <Ionicons name={alsoBlock ? 'checkbox' : 'square-outline'} size={22} color={alsoBlock ? colors.verde : colors.arena} />
            <Text style={styles.checkText}>También bloquear a {name || 'esta persona'}</Text>
          </Pressable>
        ) : null}
        <Notice icon="call-outline">Si estás en peligro inmediato, llama al 911.</Notice>
        <ErrorNotice message={error} />
        <Button label="Enviar reporte" disabled={!reason} loading={sending} onPress={send} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.md, paddingBottom: space.xxxl },
  whoText: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  checkText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  done: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl, gap: space.md },
  doneIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
});
