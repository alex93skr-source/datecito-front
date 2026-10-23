import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ApiError, auth } from '../../api';
import { Body, Button, ErrorNotice, Field, H1, Notice, Screen, TopBar } from '../../components/ui';
import { space } from '../../theme';

/** Recuperación en dos pasos: correo → código + contraseña nueva. */
export default function Forgot() {
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  // Puede llegar con el correo ya escrito (por ejemplo, desde Crear cuenta).
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const run = async (fn: () => Promise<unknown>, next: typeof step) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
      setStep(next);
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, 'Eso no salió. Inténtalo otra vez.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TopBar />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {step === 'email' && (
          <View style={{ gap: space.lg }}>
            <H1>Recupera tu acceso.</H1>
            <Body muted>Escribe el correo de tu cuenta y te mandamos un código seguro.</Body>
            <Field label="Correo electrónico" icon="mail-outline" placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} error={error?.field('email')} />
            <ErrorNotice message={error && !error.field('email') ? error.message : null} />
            <Button label="Enviar código" loading={loading} disabled={!/^\S+@\S+\.\S+$/.test(email.trim())} onPress={() => run(() => auth.forgot(email.trim()), 'reset')} />
          </View>
        )}

        {step === 'reset' && (
          <View style={{ gap: space.lg }}>
            <H1>Elige una contraseña nueva.</H1>
            <Notice icon="mail-outline">Si existe una cuenta con ese correo, te enviamos un código de 6 dígitos.</Notice>
            <Field label="Código" icon="keypad-outline" placeholder="123456" keyboardType="number-pad" maxLength={6} value={code} onChangeText={(t) => setCode(t.replace(/\D/g, ''))} error={error?.field('code')} />
            <Field label="Contraseña nueva" icon="lock-closed-outline" placeholder="Mínimo 8 caracteres, con letras y números" secure value={password} onChangeText={setPassword} error={error?.field('password')} />
            <ErrorNotice message={error && !error.field('code') && !error.field('password') ? error.message : null} />
            <Button label="Guardar contraseña" loading={loading} disabled={code.length < 6 || password.length < 8} onPress={() => run(() => auth.reset(email.trim(), code, password), 'done')} />
          </View>
        )}

        {step === 'done' && (
          <View style={{ gap: space.lg }}>
            <H1>Listo.</H1>
            <Body muted>Ya puedes entrar con tu nueva contraseña. Por seguridad cerramos tus sesiones anteriores.</Body>
            <Button label="Iniciar sesión" onPress={() => router.replace('/login')} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.xl, paddingTop: space.sm },
});
