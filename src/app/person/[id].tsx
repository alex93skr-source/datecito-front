import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { FocusStatusBar } from '../../components/FocusStatusBar';
import { ApiError, discover, safety } from '../../api';
import { ActionSheet } from '../../components/ActionSheet';
import { PersonDetail } from '../../components/PersonDetail';
import { Button, EmptyState, Loading, Screen } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { useMe } from '../../store/Session';

export default function PersonScreen() {
  const { id, from, connectionId } = useLocalSearchParams<{ id: string; from?: string; connectionId?: string }>();
  const { me } = useMe();
  const person = useRemote(() => discover.person(id), { refetchOnFocus: false });
  const [sheet, setSheet] = useState(false);
  const [busy, setBusy] = useState(false);

  if (person.loading && !person.data) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  if (!person.data) {
    return (
      <Screen>
        <EmptyState icon="person-outline" title="Este perfil ya no está disponible." text="Puede que la persona haya pausado su cuenta." action="Volver" onAction={() => router.back()} />
      </Screen>
    );
  }

  const p = person.data;

  const swipe = async (type: 'like' | 'pass') => {
    setBusy(true);
    try {
      const result = await discover.swipe(p.id, type);
      if (result.matched && result.connection_id) router.replace({ pathname: '/match', params: { connectionId: result.connection_id } });
      else router.back();
    } catch (e) {
      if (e instanceof ApiError) router.back();
    } finally {
      setBusy(false);
    }
  };

  const block = async () => {
    await safety.block(p.id).catch(() => undefined);
    router.dismissTo('/discover');
  };

  return (
    <>
      <FocusStatusBar style="light" />
      <PersonDetail
        person={p}
        myInterests={me.interests}
        myTeams={me.teams}
        onClose={() => router.back()}
        onMore={() => setSheet(true)}
        footer={
          connectionId ? (
            <Button label="Enviar mensaje" icon="chatbubble-ellipses-outline" style={{ flex: 1 }} onPress={() => router.replace({ pathname: '/chat/[id]', params: { id: connectionId } })} />
          ) : from === 'discover' || from === 'likes' ? (
            <>
              <Button label="No me interesa" variant="secondary" style={{ flex: 1 }} disabled={busy} onPress={() => swipe('pass')} />
              <Button label={from === 'likes' ? 'Hacer match' : 'Dar like'} icon="heart" style={{ flex: 1 }} loading={busy} onPress={() => swipe('like')} />
            </>
          ) : undefined
        }
      />
      <ActionSheet
        visible={sheet}
        title={p.name ?? undefined}
        subtitle="Tú decides con quién hablar y cuándo parar."
        onClose={() => setSheet(false)}
        actions={[
          { label: 'Reportar perfil', icon: 'flag-outline', danger: true, onPress: () => router.push({ pathname: '/safety/report', params: { id: p.id, name: p.name ?? '' } }) },
          { label: 'Bloquear', icon: 'ban-outline', danger: true, onPress: block },
        ]}
      />
    </>
  );
}
