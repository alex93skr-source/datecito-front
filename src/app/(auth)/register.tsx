import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError, auth } from '../../api';
import { Body, Button, Caption, ErrorNotice, Field, H1, Screen, TopBar } from '../../components/ui';
import { useSession } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

export default function Register() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const rules = [
    { ok: password.length >= 8, text: 'Mínimo 8 caracteres' },
    { ok: /\d/.test(password), text: 'Al menos un número' },
    { ok: /[a-zA-Z]/.test(password), text: 'Al menos una letra' },
  ];
  const taken = error?.code === 'email_taken';
  const valid = isEmail(email) && rules.every((r) => r.ok) && accepted;

  const submit = async () => {
    setTried(true);
    setError(null);
    if (!valid) return;
    setLoading(true);
    try {
      const res = await auth.register(email.trim(), password);
      await signIn(res.token, res.user);
      router.replace({ pathname: '/verify', params: { sent: '1' } });
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, 'Eso no salió. Inténtalo otra vez.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll contentStyle={{ paddingTop: 0 }}>
      <View style={{ marginHorizontal: -space.md }}>
        <TopBar />
      </View>
      <View style={{ gap: space.sm }}>
        <H1>Empieza algo que valga la pena.</H1>
        <Body muted>Crear tu cuenta toma un minuto. Tú decides qué mostrar y a quién.</Body>
      </View>
      <Field
        label="Correo electrónico"
        icon="mail-outline"
        placeholder="tu@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (taken) setError(null);
        }}
        error={error?.field('email') ?? (tried && !isEmail(email) ? 'Escribe un correo válido.' : undefined)}
      />
      <Field label="Contraseña" icon="lock-closed-outline" placeholder="Crea una contraseña" secure autoComplete="new-password" value={password} onChangeText={setPassword} error={error?.field('password')} />
      <View style={{ gap: 6 }}>
        {rules.map((r) => (
          <View key={r.text} style={styles.rule}>
            <Ionicons name={r.ok ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={r.ok ? colors.success : colors.subtle} />
            <Caption style={r.ok ? { color: colors.success } : undefined}>{r.text}</Caption>
          </View>
        ))}
      </View>
      <Pressable style={styles.check} onPress={() => setAccepted(!accepted)} accessibilityRole="checkbox" accessibilityState={{ checked: accepted }}>
        <Ionicons name={accepted ? 'checkbox' : 'square-outline'} size={22} color={accepted ? colors.verde : colors.arena} />
        <Text style={styles.checkText}>
          Tengo 18 años o más y acepto los <Text style={styles.link} onPress={() => router.push('/terms')}>Términos y Aviso de privacidad</Text>.
        </Text>
      </Pressable>
      {tried && !accepted ? <ErrorNotice message="Necesitas aceptar los términos para continuar." /> : null}
      {taken ? (
        <View style={styles.taken}>
          <Text style={styles.takenTitle}>Ya tienes una cuenta con este correo.</Text>
          <Text style={styles.takenText}>Inicia sesión con tu contraseña o, si no la recuerdas, te ayudamos a crear una nueva.</Text>
          <View style={{ gap: space.sm, marginTop: space.xs }}>
            <Button label="Iniciar sesión" onPress={() => router.replace({ pathname: '/login', params: { email: email.trim() } })} />
            <Button label="Recuperar mi contraseña" variant="ghost" onPress={() => router.push({ pathname: '/forgot', params: { email: email.trim() } })} />
          </View>
        </View>
      ) : error && !error.field('email') && !error.field('password') ? (
        <ErrorNotice message={error.message} />
      ) : null}
      {taken ? null : <Button label="Crear mi cuenta" onPress={submit} loading={loading} />}
      <Caption center>
        ¿Ya tienes cuenta?{' '}
        <Text style={styles.link} onPress={() => router.replace('/login')}>
          Inicia sesión
        </Text>
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rule: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  check: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  checkText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text },
  link: { fontFamily: fonts.bold, color: colors.coralStrong },
  taken: { gap: space.xs, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  takenTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  takenText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
});
