import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiError, auth } from '../../api';
import { Body, ErrorNotice, H1, Screen, TopBar } from '../../components/ui';
import { homeFor, useSession } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const RESEND_SECONDS = 60;

export default function Verify() {
  const { me, setMe, signOut } = useSession();
  // 'sent' = venimos del registro, que ya mandó el código.
  const { sent } = useLocalSearchParams<{ sent?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const input = useRef<TextInput>(null);

  // Si llegas aquí al iniciar sesión o al reabrir la app, el código anterior pudo vencer:
  // se pide uno nuevo (el servidor no lo repite si ya mandó uno hace menos de un minuto).
  useEffect(() => {
    if (sent) return;
    auth
      .resendCode()
      .then(() => setNotice('Te enviamos un código nuevo. Revisa también tu carpeta de spam.'))
      .catch(() => setCooldown(0));
  }, [sent]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const verify = async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await auth.verifyEmail(value);
      setMe(fresh);
      router.replace(homeFor(fresh));
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('code') ?? e.message) : 'Eso no salió. Inténtalo otra vez.');
      setCode('');
      input.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const onChange = (t: string) => {
    const digits = t.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    setError(null);
    // Al completar los 6 dígitos se verifica solo.
    if (digits.length === 6 && !loading) void verify(digits);
  };

  const resend = async () => {
    setError(null);
    setNotice(null);
    try {
      await auth.resendCode();
      setNotice('Te enviamos un código nuevo. Revisa también tu carpeta de spam.');
      setCooldown(RESEND_SECONDS);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Eso no salió. Inténtalo otra vez.');
    }
  };

  return (
    <Screen>
      <TopBar
        onBack={async () => {
          await signOut();
          router.replace('/welcome');
        }}
      />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={{ gap: space.sm }}>
          {sent ? null : (
            <View style={styles.pending}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.coralStrong} />
              <Text style={styles.pendingText}>Tu cuenta aún no está verificada</Text>
            </View>
          )}
          <H1>{sent ? 'Revisa tu correo.' : 'Confirma tu correo para continuar.'}</H1>
          <Body muted>
            {sent ? null : 'Es un paso único: después sólo entrarás con tu correo y contraseña. '}
            Te enviamos un código de 6 dígitos a <Text style={styles.email}>{me?.email ?? 'tu correo'}</Text>. Vence en 10 minutos.
          </Body>
        </View>

        {/* El campo real cubre los cuadros: al tocarlos, Android abre el teclado de forma nativa
            (con un campo oculto aparte, algunos teléfonos como Xiaomi no lo volvían a abrir). */}
        <View style={styles.boxes}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.box, i === code.length && !loading && styles.boxActive, !!error && styles.boxError]}>
              <Text style={styles.digit}>{code[i] ?? ''}</Text>
            </View>
          ))}
          <TextInput
            ref={input}
            value={code}
            onChangeText={onChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            editable={!loading}
            caretHidden
            selectionColor="transparent"
            accessibilityLabel="Código de 6 dígitos"
            style={styles.overlay}
            autoFocus
          />
        </View>

        {loading ? (
          <View style={styles.row}>
            <ActivityIndicator color={colors.coralStrong} />
            <Text style={styles.status}>Verificando…</Text>
          </View>
        ) : null}
        <ErrorNotice message={error} />
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <View style={styles.row}>
          <Text style={styles.status}>¿No te llegó?</Text>
          {cooldown > 0 ? (
            <Text style={styles.status}>Reenviar en {cooldown} s</Text>
          ) : (
            <Text style={styles.link} onPress={resend}>
              Reenviar código
            </Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.xl, paddingTop: space.sm, gap: space.xl },
  email: { fontFamily: fonts.bold, color: colors.verde },
  pending: { flexDirection: 'row', alignItems: 'center', gap: space.xs, alignSelf: 'flex-start', backgroundColor: colors.duraznoSoft, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: space.xs },
  pendingText: { fontFamily: fonts.bold, fontSize: 12, color: colors.coralStrong },
  // Casi invisible (no 0): así Android sigue entregándole los toques.
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: 'transparent', fontSize: 1 },
  boxes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  box: { width: 48, height: 58, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  boxActive: { borderColor: colors.verde },
  boxError: { borderColor: colors.danger },
  digit: { fontFamily: fonts.extrabold, fontSize: 24, color: colors.verde },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  status: { fontFamily: fonts.semibold, fontSize: 14, color: colors.muted },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.coralStrong },
  notice: { fontFamily: fonts.semibold, fontSize: 13, color: colors.success, textAlign: 'center' },
});
