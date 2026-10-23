import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { ApiError, datecitos, safety, SafeSession, TrustedContact } from '../../api';
import { Body, Button, Chip, ErrorNotice, Eyebrow, H1, Loading, Notice, Screen, ToggleRow, TopBar } from '../../components/ui';
import { formatLeft, useNow } from '../../hooks/useNow';
import { useRemote } from '../../hooks/useRemote';
import { sendWhatsApp } from '../../lib/whatsapp';
import { colors, fonts, radius, space } from '../../theme';

// Mismos valores que el servidor (datecito.limits.safe_check_in_minutes).
const checkIns = [15, 30, 45, 60].map((minutes) => ({ label: minutes === 60 ? 'En 1 hora' : `En ${minutes} min`, minutes }));

/**
 * Avisa al primer contacto por WhatsApp con el mensaje listo (sin APIs: enlace wa.me).
 * Los demás contactos tienen su propio botón en la pantalla activa.
 */
const notifyContacts = (contacts: TrustedContact[], message: string) =>
  contacts[0] ? sendWhatsApp(contacts[0].phone, message) : Share.share({ message }).catch(() => undefined);

export default function DateMode() {
  const current = useRemote(safety.currentSession);

  if (current.loading && current.data === undefined) {
    return (
      <Screen>
        <TopBar title="Datecito Seguro" />
        <Loading />
      </Screen>
    );
  }

  return current.data ? (
    <Active session={current.data} onChange={(s) => current.setData(s.status === 'ended' ? null : s)} />
  ) : (
    <Setup onStarted={(s) => current.setData(s)} />
  );
}

function Setup({ onStarted }: { onStarted: (s: SafeSession) => void }) {
  const params = useLocalSearchParams<{ id?: string }>();
  const dates = useRemote(() => datecitos.list().then((l) => l.filter((d) => !d.is_past && d.status !== 'cancelled')));
  const contacts = useRemote(safety.contacts);
  const [dateId, setDateId] = useState(params.id);
  const [selected, setSelected] = useState<string[] | null>(null);
  const [minutes, setMinutes] = useState(120);
  const [share, setShare] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!dates.data || !contacts.data) {
    return (
      <Screen>
        <TopBar title="Datecito Seguro" />
        <Loading error={dates.error?.message ?? contacts.error?.message} />
      </Screen>
    );
  }

  const upcoming = dates.data;
  const d = upcoming.find((x) => x.id === (dateId ?? upcoming[0]?.id));
  const chosen = selected ?? contacts.data.slice(0, 1).map((c) => c.id);
  const names = contacts.data.filter((c) => chosen.includes(c.id)).map((c) => c.name.split(' ')[0]);

  const start = async () => {
    if (!d) return;
    setLoading(true);
    setError(null);
    try {
      const session = await safety.startSession({ datecito_id: d.id, contact_ids: chosen, check_in_minutes: minutes, share_location: share });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onStarted(session);
      await notifyContacts(session.contacts, session.share_message);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos activar Datecito Seguro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Datecito Seguro" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Eyebrow>ANTES DE SALIR</Eyebrow>
        <H1>Que alguien de confianza sepa dónde estás.</H1>
        <Body muted>Compartimos tu plan con tu contacto, te preguntamos si todo va bien y tienes un botón de ayuda a la mano.</Body>

        {!params.id && upcoming.length > 1 ? (
          <>
            <Text style={styles.label}>¿Qué datecito?</Text>
            <View style={styles.wrap}>
              {upcoming.map((x) => (
                <Chip key={x.id} label={`${x.place} · ${x.person.name}`} selected={d?.id === x.id} onPress={() => setDateId(x.id)} />
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.label}>¿A quién avisamos?</Text>
        {contacts.data.length ? (
          <View style={styles.wrap}>
            {contacts.data.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                icon="person-outline"
                selected={chosen.includes(c.id)}
                onPress={() => setSelected(chosen.includes(c.id) ? chosen.filter((x) => x !== c.id) : [...chosen, c.id])}
              />
            ))}
            <Chip label="Agregar" icon="add" onPress={() => router.push('/safety/contacts')} />
          </View>
        ) : (
          <Button label="Agregar contacto de confianza" icon="person-add-outline" variant="secondary" onPress={() => router.push('/safety/contacts')} />
        )}

        <Text style={styles.label}>¿Cuándo te preguntamos si todo va bien?</Text>
        <View style={styles.wrap}>
          {checkIns.map((c) => (
            <Chip key={c.minutes} label={c.label} icon="alarm-outline" selected={minutes === c.minutes} onPress={() => setMinutes(c.minutes)} />
          ))}
        </View>

        <View style={styles.box}>
          <ToggleRow icon="navigate-outline" label="Compartir mi ubicación durante la cita" description="Sólo con tu contacto, y sólo mientras esté activo." value={share} onChange={setShare} last />
        </View>

        {d ? (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Mensaje para {names.join(' y ') || 'tu contacto'}</Text>
            <Text style={styles.previewText}>
              Tu nombre tiene un datecito con {d.person.name} en {d.place} ({d.zone}), {d.when_label.toLowerCase()}.
            </Text>
            <Text style={styles.previewHint}>
              Al activar se abre WhatsApp con este mensaje listo para {names[0] ?? 'tu contacto'}. Nada se envía sin que tú lo mandes.
            </Text>
          </View>
        ) : (
          <Notice icon="calendar-outline">Primero propón un datecito desde un chat para poder activar Datecito Seguro.</Notice>
        )}

        <ErrorNotice message={error} />
        <Button label="Activar y avisar" icon="shield-checkmark-outline" loading={loading} disabled={!d || !chosen.length} onPress={start} />
      </ScrollView>
    </Screen>
  );
}

function Active({ session, onChange }: { session: SafeSession; onChange: (s: SafeSession) => void }) {
  const now = useNow();
  const [error, setError] = useState<string | null>(null);
  const names = session.contacts.map((c) => c.name.split(' ')[0]).join(' y ');
  const due = now >= new Date(session.check_in_at).getTime();
  const help = session.status === 'help';

  const run = async (fn: () => Promise<SafeSession>) => {
    setError(null);
    try {
      const updated = await fn();
      onChange(updated);
      return updated;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
      return null;
    }
  };

  const askHelp = () =>
    Alert.alert('¿Necesitas ayuda?', `Prepararemos un mensaje urgente para ${names}.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Avisar ahora',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          const updated = await run(() => safety.help(session.id));
          if (updated) await notifyContacts(updated.contacts, updated.share_message);
        },
      },
    ]);

  return (
    <Screen bg={help ? '#FBEAEA' : colors.bg}>
      <TopBar title="Datecito Seguro" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, help && { backgroundColor: colors.danger }]}>
          <Ionicons name={help ? 'alert-circle' : 'shield-checkmark'} size={40} color={colors.crema} />
          <Text style={styles.heroTitle}>{help ? 'Pediste ayuda' : 'Datecito Seguro activo'}</Text>
          <Text style={styles.heroText}>
            {help ? `Asegúrate de enviar el mensaje a ${names}. Si estás en peligro, llama al 911.` : `${names} sabe que estás en ${session.datecito.place} con ${session.datecito.person.name}.`}
          </Text>
        </View>

        {!help ? (
          <View style={[styles.checkCard, due && { borderColor: colors.coral, backgroundColor: '#FFF4F0' }]}>
            <Ionicons name="alarm-outline" size={24} color={due ? colors.coralStrong : colors.verde} />
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>{due ? '¿Todo bien?' : 'Próximo check-in'}</Text>
              <Text style={styles.checkText}>{due ? 'Confírmalo para que tu contacto esté tranquilo.' : `En ${formatLeft(new Date(session.check_in_at).getTime() - now)}`}</Text>
            </View>
          </View>
        ) : null}

        <ErrorNotice message={error} />
        <Button label="Estoy bien" icon="checkmark-circle-outline" variant="dark" onPress={() => run(() => safety.checkIn(session.id))} />
        <Text style={styles.label}>{help ? 'Manda el aviso urgente' : 'Avisa a tus contactos'}</Text>
        {session.contacts.map((c) => (
          <Tool key={c.id} icon="logo-whatsapp" title={`WhatsApp a ${c.name}`} text="Se abre el chat con el mensaje listo; tú lo envías." onPress={() => sendWhatsApp(c.phone, session.share_message)} />
        ))}
        <Tool icon="share-social-outline" title="Enviar por otro medio" text="SMS, Telegram o lo que uses." onPress={() => Share.share({ message: session.share_message }).catch(() => undefined)} />
        <Tool icon="call-outline" title="Llamada de salida" text="Recibe una llamada falsa para irte sin dar explicaciones." onPress={() => router.push('/safety/fake-call')} />
        <Tool danger icon="alert-circle-outline" title="Necesito ayuda" text="Prepara un mensaje urgente para tu contacto." onPress={askHelp} />
        <Tool danger icon="call" title="Llamar al 911" text="Emergencias." onPress={() => Alert.alert('Llamar al 911', 'En la versión final este botón marca directamente al 911.')} />

        <Button label="Terminar: ya estoy en casa" variant="ghost" onPress={async () => (await run(() => safety.endSession(session.id))) && router.back()} />
      </ScrollView>
    </Screen>
  );
}

function Tool({ icon, title, text, onPress, danger }: { icon: 'share-social-outline' | 'logo-whatsapp' | 'call-outline' | 'alert-circle-outline' | 'call'; title: string; text: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable style={[styles.tool, danger && styles.toolDanger]} onPress={onPress}>
      <View style={[styles.toolIcon, danger && { backgroundColor: '#FCE8E8' }]}>
        <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.verde} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toolTitle, danger && { color: colors.danger }]}>{title}</Text>
        <Text style={styles.toolText}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.md, paddingBottom: space.xxxl },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde, marginTop: space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  preview: { backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  previewLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  previewText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.text },
  previewHint: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 19, color: colors.verde },
  hero: { backgroundColor: colors.verde, borderRadius: radius.xxl, padding: space.xl, alignItems: 'center', gap: space.sm },
  heroTitle: { fontFamily: fonts.extrabold, fontSize: 22, color: colors.crema, textAlign: 'center' },
  heroText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: 'rgba(249,243,236,0.88)', textAlign: 'center' },
  checkCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  checkTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  checkText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  tool: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  toolDanger: { borderColor: '#F1C9C9' },
  toolIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  toolTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  toolText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
});
