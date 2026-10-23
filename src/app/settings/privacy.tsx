import { ScrollView } from 'react-native';

import { me as meApi, Settings } from '../../api';
import { Group, Notice, Screen, ToggleRow, TopBar } from '../../components/ui';
import { useMe } from '../../store/Session';
import { space } from '../../theme';

export default function Privacy() {
  const { me, setMe, refreshMe } = useMe();

  const set = async (key: keyof Settings, value: boolean) => {
    setMe({ ...me, settings: { ...me.settings, [key]: value } });
    try {
      setMe(await meApi.settings({ [key]: value }));
    } catch {
      void refreshMe();
    }
  };

  return (
    <Screen>
      <TopBar title="Privacidad" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.xl }}>
        <Group title="Visibilidad">
          <ToggleRow icon="eye-outline" label="Mostrar mi perfil en Descubrir" description="Si lo desactivas, sólo tus matches te verán." value={me.settings.show_in_discover} onChange={(v) => set('show_in_discover', v)} last />
        </Group>
        <Group title="Tu información">
          <ToggleRow icon="male-female-outline" label="Mostrar mi género en el perfil" value={me.settings.show_gender} onChange={(v) => set('show_gender', v)} />
          <ToggleRow icon="briefcase-outline" label="Mostrar mi ocupación" value={me.settings.show_job} onChange={(v) => set('show_job', v)} />
          <ToggleRow icon="heart-half-outline" label="Mostrar mi tipo de relación" value={me.settings.show_relationship} onChange={(v) => set('show_relationship', v)} last />
        </Group>
        <Notice>Datecito nunca muestra si estás en línea, tu última conexión ni si leíste un mensaje. Tu ubicación exacta nunca se comparte.</Notice>
      </ScrollView>
    </Screen>
  );
}
