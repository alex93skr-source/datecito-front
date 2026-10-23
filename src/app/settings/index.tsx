import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { Group, ListRow, Screen, TopBar } from '../../components/ui';
import { useMe, useSession } from '../../store/Session';
import { colors, fonts, space } from '../../theme';

const membershipLabel = (status: string, plan: string | null) =>
  status === 'active' ? (plan === 'yearly' ? 'Anual' : 'Mensual') : status === 'launch' ? 'Gratis (lanzamiento)' : 'Inactiva';

export default function Settings() {
  const { me } = useMe();
  const { signOut } = useSession();

  return (
    <Screen>
      <TopBar title="Ajustes" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Group title="Membresía">
          <ListRow icon="sparkles-outline" label="Tu membresía" value={membershipLabel(me.membership.status, me.membership.plan)} onPress={() => router.push('/membership')} />
          <ListRow icon="star-outline" label="Super likes" onPress={() => router.push('/superlikes')} last />
        </Group>
        <Group title="Cuenta">
          <ListRow icon="person-outline" label="Datos de la cuenta" onPress={() => router.push('/settings/account')} />
          <ListRow icon="notifications-outline" label="Notificaciones" onPress={() => router.push('/settings/notifications')} />
          <ListRow icon="location-outline" label="Ubicación y distancia" onPress={() => router.push('/settings/location')} last />
        </Group>
        <Group title="Privacidad y seguridad">
          <ListRow icon="lock-closed-outline" label="Privacidad" onPress={() => router.push('/settings/privacy')} />
          <ListRow icon="shield-checkmark-outline" label="Centro de seguridad" onPress={() => router.push('/safety')} />
          <ListRow icon="checkmark-circle-outline" label="Verificar mi perfil" onPress={() => router.push('/safety/verify')} />
          <ListRow icon="people-outline" label="Contactos de confianza" onPress={() => router.push('/safety/contacts')} />
          <ListRow icon="ban-outline" label="Personas bloqueadas" onPress={() => router.push('/settings/blocked')} last />
        </Group>
        <Group title="Soporte">
          <ListRow icon="help-circle-outline" label="Ayuda" onPress={() => router.push('/settings/help')} />
          <ListRow icon="document-text-outline" label="Términos y privacidad" onPress={() => router.push('/terms')} last />
        </Group>
        <Group title="Sesión">
          <ListRow
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={() =>
              Alert.alert('¿Cerrar sesión?', 'Podrás volver a entrar cuando quieras.', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Cerrar sesión',
                  onPress: async () => {
                    await signOut();
                    router.dismissTo('/welcome');
                  },
                },
              ])
            }
            last
          />
        </Group>
        <Text style={styles.version}>Datecito 1.0.0 · Hecho con cariño en CDMX</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.xl, paddingBottom: space.xxxl },
  version: { fontFamily: fonts.regular, fontSize: 12, color: colors.subtle, textAlign: 'center' },
});
