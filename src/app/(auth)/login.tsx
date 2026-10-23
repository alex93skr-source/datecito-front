import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError, auth } from '../../api';
import { Body, Button, Caption, ErrorNotice, Field, H1, Screen, TopBar } from '../../components/ui';
import { homeFor, useSession } from '../../store/Session';
import { colors, fonts, space } from '../../theme';

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

export default function Login() {
  const { signIn } = useSession();
  // Puede llegar con el correo ya escrito (por ejemplo, desde Crear cuenta).
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = tried && !isEmail(email) ? 'Escribe un correo válido.' : undefined;
  const passError = tried && password.length < 8 ? 'Mínimo 8 caracteres.' : undefined;

  const submit = async () => {
    setTried(true);
    setError(null);
    if (!isEmail(email) || password.length < 8) return;
    setLoading(true);
    try {
      const res = await auth.login(email.trim(), password);
      await signIn(res.token, res.user);
      router.replace(homeFor(res.user));
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('email') ?? e.message) : 'Eso no salió. Inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TopBar />
      <View style={styles.body}>
          <View style={{ gap: space.sm }}>
            <H1>Qué gusto verte de nuevo.</H1>
            <Body muted>Tu próxima conversación está a un toque.</Body>
          </View>
          <View style={{ gap: space.lg }}>
            <Field label="Correo electrónico" icon="mail-outline" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={setEmail} error={emailError} />
            <Field label="Contraseña" icon="lock-closed-outline" placeholder="Tu contraseña" secure autoComplete="current-password" value={password} onChangeText={setPassword} error={passError} />
            <Pressable onPress={() => router.push('/forgot')} style={{ alignSelf: 'flex-end' }} hitSlop={8}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
            <ErrorNotice message={error} />
            <Button label="Entrar" onPress={submit} loading={loading} />
          </View>
          <Caption center>
            ¿Aún no tienes cuenta?{' '}
            <Text style={styles.link} onPress={() => router.replace('/register')}>
              Crear cuenta
            </Text>
          </Caption>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: space.xl, paddingTop: space.sm, justifyContent: 'space-between' },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.coralStrong },
});
