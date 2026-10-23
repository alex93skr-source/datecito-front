import { ScrollView } from 'react-native';

import { Group, Notice, Screen, ToggleRow, TopBar } from '../../components/ui';
import { space } from '../../theme';

export default function NotificationSettings() {
  return (
    <Screen>
      <TopBar title="Notificaciones" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.xl }}>
        <Group title="Avisos">
          <ToggleRow icon="heart-outline" label="Nuevos matches" description="“Tienes un nuevo match en Datecito.”" />
          <ToggleRow icon="chatbubble-outline" label="Mensajes" description="“Te dejaron un mensaje.”" />
          <ToggleRow icon="calendar-outline" label="Datecitos" description="Propuestas, confirmaciones y cambios de horario." />
          <ToggleRow icon="sparkles-outline" label="Recomendaciones de planes" initial={false} last />
        </Group>
        <Group title="Discreción">
          <ToggleRow icon="eye-off-outline" label="Ocultar contenido en pantalla bloqueada" description="No mostramos nombres ni mensajes en la vista previa." last />
        </Group>
        <Notice icon="information-circle-outline">Nunca te enviaremos avisos insistentes. Tú controlas qué recibes.</Notice>
      </ScrollView>
    </Screen>
  );
}
