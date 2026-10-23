import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, datecitos } from '../../api';
import { Avatar, Body, Button, Chip, ErrorNotice, H1, Loading, Notice, Screen, TopBar } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { colors, fonts, radius, space } from '../../theme';

const questions = [
  { key: 'showed', q: '¿Llegó al datecito?', options: ['Sí', 'Llegó tarde', 'No llegó'] },
  { key: 'photos', q: '¿Se parecía a sus fotos?', options: ['Sí', 'Más o menos', 'No'] },
  { key: 'safe', q: '¿Te sentiste con confianza?', options: ['Sí, todo bien', 'No del todo', 'No'] },
  { key: 'again', q: '¿Te gustaría volver a verle?', options: ['Sí', 'Tal vez', 'No'] },
];

export default function Feedback() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const datecito = useRemote(() => datecitos.get(id), { refetchOnFocus: false });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const d = datecito.data;

  if (!d) return <Screen><TopBar title="¿Cómo te fue?" /><Loading error={datecito.error?.message} onRetry={datecito.reload} /></Screen>;
  const person = d.person;
  const worried = answers.safe === 'No' || answers.safe === 'No del todo';

  if (done) {
    return (
      <Screen>
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <Ionicons name="heart" size={36} color={colors.white} />
          </View>
          <H1 center>Gracias por contarnos.</H1>
          <Body muted center>
            Tus respuestas son privadas. Nos ayudan a que Datecito sea un lugar más seguro para todas las personas.
          </Body>
          {worried ? <Button label={`Reportar a ${person.name}`} variant="danger" style={{ alignSelf: 'stretch' }} onPress={() => router.replace({ pathname: '/safety/report', params: { id: person.id, name: person.name ?? '' } })} /> : null}
          <Button label="Listo" style={{ alignSelf: 'stretch' }} onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="¿Cómo te fue?" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.head}>
          <Avatar uri={person.photos?.[0]?.urls.sm ?? ''} size={64} ring />
          <H1 center>¿Cómo te fue con {person.name}?</H1>
          <Body muted center>
            {d.place} · {d.when_label}
          </Body>
        </View>
        {questions.map((q) => (
          <View key={q.key} style={styles.block}>
            <Text style={styles.q}>{q.q}</Text>
            <View style={styles.wrap}>
              {q.options.map((o) => (
                <Chip key={o} label={o} selected={answers[q.key] === o} onPress={() => setAnswers({ ...answers, [q.key]: o })} />
              ))}
            </View>
          </View>
        ))}
        {worried ? <Notice icon="alert-circle-outline">Lamentamos que no te hayas sentido bien. Al terminar podrás reportar lo que pasó de forma confidencial.</Notice> : null}
        <ErrorNotice message={error} />
        <Notice icon="lock-closed-outline">Nunca mostramos calificaciones en los perfiles. {person.name} no verá tus respuestas.</Notice>
        <Button
          label="Enviar"
          disabled={Object.keys(answers).length < questions.length}
          loading={sending}
          onPress={async () => {
            setSending(true);
            setError(null);
            try {
              await datecitos.feedback(d.id, answers as { showed: string; photos: string; safe: string; again: string });
              setDone(true);
            } catch (e) {
              setError(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
            } finally {
              setSending(false);
            }
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl },
  head: { alignItems: 'center', gap: space.sm },
  block: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.md, borderWidth: 1, borderColor: colors.border },
  q: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  done: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl, gap: space.md },
  doneIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.coralStrong, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
});
