import { router } from 'expo-router';

import { FocusStatusBar } from '../../components/FocusStatusBar';
import { PersonDetail } from '../../components/PersonDetail';
import { Button } from '../../components/ui';
import { useMe } from '../../store/Session';

/** Así ven otras personas tu perfil (respeta lo que decidiste mostrar). */
export default function Preview() {
  const { me } = useMe();
  const s = me.settings;

  return (
    <>
      <FocusStatusBar style="light" />
      <PersonDetail
        own
        person={{
          ...me,
          distance_km: null,
          verified: me.verification.verified,
          job: s.show_job ? me.job : null,
          gender: s.show_gender ? me.gender : null,
          relationship_type: s.show_relationship ? me.relationship_type : null,
        }}
        onClose={() => router.back()}
        footer={<Button label="Editar perfil" icon="create-outline" style={{ flex: 1 }} onPress={() => router.replace('/profile/edit')} />}
      />
    </>
  );
}
