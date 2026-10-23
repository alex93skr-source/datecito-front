import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, connections, datecitos, Message, safety } from '../../api';
import { ActionSheet } from '../../components/ActionSheet';
import { Avatar, ErrorNotice, IconButton, Loading } from '../../components/ui';
import { flaggedWords } from '../../data/mock';
import { useRemote } from '../../hooks/useRemote';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const icebreakers = ['¿Cuál es tu plan perfecto de domingo?', '¿Qué lugar de la ciudad me recomendarías?', '¿Café o mezcal para un primer datecito?'];
const POLL_MS = 5000;

const hhmm = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { me } = useMe();
  const connection = useRemote(() => connections.get(id), { refetchOnFocus: false });
  const dates = useRemote(() => datecitos.list().then((list) => list.filter((d) => d.connection_id === id)));
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const scroll = useRef<ScrollView>(null);
  const lastId = useRef<string | undefined>(undefined);

  const fetchNew = useCallback(async () => {
    try {
      const fresh = await connections.messages(id, lastId.current);
      if (fresh.length) {
        lastId.current = fresh[fresh.length - 1].id;
        setMessages((prev) => [...prev, ...fresh.filter((m) => !prev.some((p) => p.id === m.id))]);
      }
      setLoaded(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setError('Esta conversación ya no está disponible.');
      }
      setLoaded(true);
    }
  }, [id]);

  // Sondeo discreto: sin "escribiendo", "visto" ni "en línea".
  useEffect(() => {
    void fetchNew();
    const timer = setInterval(() => void fetchNew(), POLL_MS);
    return () => clearInterval(timer);
  }, [fetchNew]);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const person = connection.data?.person;

  const deliver = async (value: string) => {
    setSending(true);
    setError(null);
    try {
      const sent = await connections.send(id, value);
      lastId.current = sent.id;
      setMessages((prev) => [...prev, sent]);
      setText('');
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('body') ?? e.message) : 'No se pudo enviar. Inténtalo otra vez.');
    } finally {
      setSending(false);
    }
  };

  const submit = (value = text) => {
    const v = value.trim();
    if (!v || sending) return;
    const lower = v.toLowerCase();
    if (me.settings.offensive_warning && flaggedWords.some((w) => lower.includes(w))) {
      setPending(v);
      return;
    }
    void deliver(v);
  };

  if (!person) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Loading error={connection.error?.status === 404 ? 'Esta conversación ya no está disponible.' : connection.error?.message} onRetry={connection.reload} />
      </SafeAreaView>
    );
  }

  const end = async () => {
    await connections.end(id).catch(() => undefined);
    router.back();
  };
  const block = async () => {
    await safety.block(person.id).catch(() => undefined);
    router.back();
  };

  const actions = [
    { label: 'Ver perfil', icon: 'person-outline' as const, onPress: () => router.push({ pathname: '/person/[id]', params: { id: person.id, connectionId: id } }) },
    { label: 'Proponer datecito', icon: 'calendar-outline' as const, onPress: () => router.push({ pathname: '/plan/new', params: { connectionId: id } }) },
    { label: 'Centro de seguridad', icon: 'shield-checkmark-outline' as const, onPress: () => router.push('/safety') },
    { label: `Reportar a ${person.name}`, icon: 'flag-outline' as const, danger: true, onPress: () => router.push({ pathname: '/safety/report', params: { id: person.id, name: person.name ?? '' } }) },
    { label: 'Quitar match', icon: 'heart-dislike-outline' as const, danger: true, onPress: end },
    { label: 'Bloquear', icon: 'ban-outline' as const, danger: true, onPress: block },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <IconButton icon="chevron-back" label="Volver" onPress={() => router.back()} />
        <Pressable style={styles.who} onPress={() => router.push({ pathname: '/person/[id]', params: { id: person.id, connectionId: id } })}>
          <Avatar uri={person.photos?.[0]?.urls.sm ?? ''} size={40} />
          <Text style={styles.name}>{person.name}</Text>
        </Pressable>
        <IconButton icon="shield-checkmark-outline" label="Centro de seguridad" onPress={() => router.push('/safety')} />
        <IconButton icon="ellipsis-vertical" label="Opciones" onPress={() => setSheet(true)} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView ref={scroll} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
          <View style={styles.matchInfo}>
            <Text style={styles.matchTitle}>Hicieron match con {person.name}</Text>
            <Text style={styles.matchText}>Rompe el hielo con algo que sí quieras saber.</Text>
          </View>

          {loaded && messages.length === 0 ? (
            <View style={{ gap: space.sm }}>
              {icebreakers.map((q) => (
                <Pressable key={q} style={styles.ice} onPress={() => submit(q)}>
                  <Ionicons name="sparkles-outline" size={16} color={colors.coralStrong} />
                  <Text style={styles.iceText}>{q}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {messages.map((m, i) => {
            const lastOfGroup = messages[i + 1]?.from_me !== m.from_me;
            return (
              <View key={m.id} style={[styles.bubble, m.from_me ? styles.mine : styles.theirs, !lastOfGroup && { marginBottom: -4 }]}>
                <Text style={[styles.msg, m.from_me && { color: colors.white }]}>{m.body}</Text>
                {lastOfGroup ? <Text style={[styles.time, m.from_me && { color: 'rgba(255,255,255,0.75)' }]}>{hhmm(m.created_at)}</Text> : null}
              </View>
            );
          })}

          {(dates.data ?? []).map((d) => (
            <Pressable key={d.id} style={styles.dateCard} onPress={() => router.push({ pathname: '/plan/[id]', params: { id: d.id } })}>
              <View style={styles.dateIcon}>
                <Ionicons name="calendar" size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateLabel}>{d.status === 'confirmed' ? 'Datecito confirmado' : d.can_confirm ? 'Te propusieron un datecito' : 'Propusiste un datecito'}</Text>
                <Text style={styles.dateTitle}>
                  {d.place} · {d.when_label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.verde} />
            </Pressable>
          ))}
        </ScrollView>

        {error ? (
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.sm }}>
            <ErrorNotice message={error} />
          </View>
        ) : null}

        {messages.length >= 2 ? (
          <Pressable style={styles.propose} onPress={() => router.push({ pathname: '/plan/new', params: { connectionId: id } })}>
            <Ionicons name="calendar-outline" size={18} color={colors.verde} />
            <Text style={styles.proposeText}>¿Se arma? Propón un datecito</Text>
          </Pressable>
        ) : null}

        <View style={styles.composer}>
          <TextInput value={text} onChangeText={setText} placeholder="Escribe un mensaje…" placeholderTextColor={colors.subtle} style={styles.input} multiline maxLength={1000} />
          <Pressable accessibilityLabel="Enviar mensaje" onPress={() => submit()} disabled={!text.trim() || sending} style={[styles.send, (!text.trim() || sending) && { backgroundColor: colors.arena }]}>
            <Ionicons name="arrow-up" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <ActionSheet
        visible={!!pending}
        title="¿Seguro que quieres enviar esto?"
        subtitle="Tu mensaje podría resultar ofensivo. En Datecito cuidamos que las conversaciones sean respetuosas."
        onClose={() => setPending(null)}
        actions={[
          { label: 'Editar mensaje', icon: 'create-outline', onPress: () => {} },
          { label: 'Enviar de todos modos', icon: 'send-outline', danger: true, onPress: () => pending && void deliver(pending) },
        ]}
      />
      <ActionSheet visible={sheet} title={person.name ?? undefined} subtitle="Tú decides con quién hablar y cuándo parar." actions={actions} onClose={() => setSheet(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.xs, height: 62, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  list: { padding: space.lg, gap: space.sm, flexGrow: 1 },
  matchInfo: { alignItems: 'center', gap: 6, paddingVertical: space.xl },
  matchTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde, marginTop: space.sm },
  matchText: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  ice: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.durazno },
  iceText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.coralStrong, borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 6, borderWidth: 1, borderColor: colors.border },
  msg: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, color: colors.text },
  time: { fontFamily: fonts.regular, fontSize: 10, color: colors.subtle, marginTop: 3, alignSelf: 'flex-end' },
  dateCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.durazno, marginTop: space.sm },
  dateIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center' },
  dateLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.coralStrong, textTransform: 'uppercase', letterSpacing: 0.6 },
  dateTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  propose: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, marginHorizontal: space.lg, marginBottom: space.sm, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.durazno },
  proposeText: { fontFamily: fonts.bold, fontSize: 14, color: colors.verde },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, backgroundColor: colors.surfaceAlt, paddingHorizontal: space.lg, paddingTop: 11, paddingBottom: 11, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.coralStrong, alignItems: 'center', justifyContent: 'center' },
});
