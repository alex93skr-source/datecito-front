import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, me as meApi } from '../../api';
import { Button, Caption, ErrorNotice, Field, Group, ListRow, Notice, Screen, TopBar } from '../../components/ui';
import { useMe, useSession } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

export default function Account() {
  const { me, setMe } = useMe();
  const { signOut } = useSession();
  const [panel, setPanel] = useState<'none' | 'password' | 'delete'>('none');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reset = (p: typeof panel) => {
    setPanel(p);
    setCurrent('');
    setNext('');
    setError(null);
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, 'Eso no salió. Inténtalo otra vez.'));
    } finally {
      setBusy(false);
    }
  };

  const changePassword = () =>
    run(async () => {
      await meApi.password(current, next);
      reset('none');
      setNotice('Listo. Cambiamos tu contraseña y cerramos tus otras sesiones.');
    });

  const deleteAccount = () =>
    run(async () => {
      await meApi.remove(current);
      await signOut();
      router.dismissTo('/welcome');
    });

  const pause = () =>
    run(async () => {
      setMe(await meApi.settings({ show_in_discover: !me.settings.show_in_discover }));
    });

  return (
    <Screen>
      <TopBar title="Tu cuenta" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.xl }} keyboardShouldPersistTaps="handled">
        <Group title="Datos">
          <ListRow icon="mail-outline" label="Correo" value={me.email} />
          <ListRow icon="key-outline" label="Cambiar contraseña" onPress={() => reset(panel === 'password' ? 'none' : 'password')} last />
        </Group>

        {panel === 'password' ? (
          <View style={styles.panel}>
            <Field label="Contraseña actual" secure value={current} onChangeText={setCurrent} error={error?.field('current_password')} />
            <Field label="Contraseña nueva" secure value={next} onChangeText={setNext} placeholder="Mínimo 8 caracteres, con letras y números" error={error?.field('password')} />
            <Button label="Guardar contraseña" loading={busy} disabled={!current || next.length < 8} onPress={changePassword} />
          </View>
        ) : null}
        {notice ? <Notice icon="checkmark-circle-outline">{notice}</Notice> : null}

        <Group title="Verificación">
          <ListRow icon="checkmark-circle-outline" label="Verificar con selfie" value={me.verification.verified ? 'Verificado' : 'Pendiente'} onPress={() => router.push('/safety/verify')} last />
        </Group>

        <Group title="Pausar o eliminar">
          <ListRow
            icon={me.settings.show_in_discover ? 'pause-circle-outline' : 'play-circle-outline'}
            label={me.settings.show_in_discover ? 'Pausar mi perfil' : 'Reactivar mi perfil'}
            value={me.settings.show_in_discover ? undefined : 'Pausado'}
            onPress={pause}
            last
          />
        </Group>
        <Caption>Al pausar, nadie nuevo te verá en Descubrir. Tus matches y chats se conservan.</Caption>

        {panel === 'delete' ? (
          <View style={[styles.panel, { borderColor: '#F1C9C9' }]}>
            <Text style={styles.danger}>Se borrarán para siempre tu perfil, fotos, matches y conversaciones. Esta acción no se puede deshacer.</Text>
            <Field label="Escribe tu contraseña para confirmar" secure value={current} onChangeText={setCurrent} error={error?.field('password')} />
            <Button label="Eliminar mi cuenta definitivamente" variant="danger" loading={busy} disabled={!current} onPress={deleteAccount} />
            <Button label="Cancelar" variant="ghost" onPress={() => reset('none')} />
          </View>
        ) : (
          <Button label="Eliminar mi cuenta" variant="danger" onPress={() => reset('delete')} />
        )}
        <ErrorNotice message={error && !error.field('password') && !error.field('current_password') ? error.message : null} />
        <Caption center>Si sólo necesitas un respiro, pausar tu perfil es mejor opción.</Caption>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.danger },
});
