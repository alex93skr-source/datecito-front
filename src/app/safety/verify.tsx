import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError, safety } from '../../api';
import { Body, Button, ErrorNotice, Eyebrow, H1, IconName, Notice, Screen, TopBar } from '../../components/ui';
import { pickImage } from '../../lib/device';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const benefits: { icon: IconName; text: string }[] = [
  { icon: 'checkmark-circle-outline', text: 'Tu perfil muestra la insignia de verificado.' },
  { icon: 'chatbubbles-outline', text: 'Puedes escribir a quienes sólo aceptan perfiles verificados.' },
  { icon: 'trending-up-outline', text: 'Los perfiles verificados reciben más likes.' },
];

// Mismas poses que el servidor (datecito.catalog.verification_poses). Se pide una al azar:
// quien usa fotos de otra persona no tiene una con esa pose.
const poses: { text: string; emoji: string }[] = [
  { text: 'Levanta la mano derecha junto a tu cara', emoji: '🤚' },
  { text: 'Haz la señal de paz con los dedos', emoji: '✌️' },
  { text: 'Toca tu oreja izquierda', emoji: '👂' },
  { text: 'Pon tu mano sobre tu cabeza', emoji: '🙋' },
  { text: 'Haz un corazón con las manos', emoji: '🫶' },
  { text: 'Muestra el pulgar arriba', emoji: '👍' },
  { text: 'Tápate un ojo con la mano', emoji: '🫣' },
  { text: 'Pon la mano en tu barbilla', emoji: '🤔' },
];
const randomPose = (except?: string) => {
  const options = poses.filter((p) => p.text !== except);
  return options[Math.floor(Math.random() * options.length)];
};

export default function Verify() {
  const { me, refreshMe } = useMe();
  const status = me.verification.status;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pose, setPose] = useState(() => randomPose());

  const takeSelfie = async () => {
    const image = await pickImage('camera', { front: true });
    if (!image) return;
    setUploading(true);
    setError(null);
    try {
      await safety.submitSelfie(image.uri, image.mimeType, pose.text);
      await refreshMe();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('selfie') ?? e.message) : 'No pudimos subir tu selfie.');
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <Screen>
        <TopBar title="Verificar perfil" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.coralStrong} />
          <H1 center>Enviando tu selfie…</H1>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Verificar perfil" />
      <View style={styles.body}>
        {status === 'approved' ? (
          <>
            <View style={styles.center}>
              <View style={[styles.badge, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark" size={44} color={colors.white} />
              </View>
              <H1 center>¡Perfil verificado!</H1>
              <Body muted center>
                Tu perfil muestra la insignia de verificado.
              </Body>
            </View>
            <Button label="Listo" onPress={() => router.back()} />
          </>
        ) : status === 'pending' ? (
          <>
            <View style={styles.center}>
              <View style={[styles.badge, { backgroundColor: colors.durazno }]}>
                <Ionicons name="time-outline" size={40} color={colors.verde} />
              </View>
              <H1 center>Estamos revisando tu selfie.</H1>
              <Body muted center>
                Una persona del equipo la compara con tus fotos; tarda entre 48 y 72 horas. Mientras tanto puedes seguir usando Datecito con normalidad: tu perfil muestra «En verificación».
              </Body>
            </View>
            <Button label="Entendido" onPress={() => router.back()} />
          </>
        ) : (
          <>
            <View style={{ gap: space.md }}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={40} color={colors.white} />
              </View>
              <Eyebrow>SELFIE DE VERIFICACIÓN</Eyebrow>
              <H1>Demuestra que eres tú en 30 segundos.</H1>
              <Body muted>
                {status === 'rejected'
                  ? 'No pudimos confirmar tu selfie anterior. Asegúrate de que tu cara se vea clara y con buena luz.'
                  : 'Tómate una selfie haciendo la pose de abajo. La comparamos con tus fotos: nadie más la ve.'}
              </Body>
              <View style={styles.pose}>
                <Text style={styles.poseEmoji}>{pose.emoji}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.poseLabel}>TU POSE</Text>
                  <Text style={styles.poseText}>{pose.text}</Text>
                </View>
                <Text style={styles.poseChange} onPress={() => setPose(randomPose(pose.text))}>
                  Otra
                </Text>
              </View>
              {benefits.map((b) => (
                <View key={b.text} style={styles.benefit}>
                  <Ionicons name={b.icon} size={20} color={colors.verde} />
                  <Text style={styles.benefitText}>{b.text}</Text>
                </View>
              ))}
            </View>
            <View style={{ gap: space.md }}>
              <ErrorNotice message={error} />
              <Notice icon="lock-closed-outline">Tu selfie se guarda cifrada y en privado, sólo para verificarte.</Notice>
              <Button label="Tomar selfie" icon="camera-outline" onPress={takeSelfie} />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: space.xl, paddingTop: space.sm, justifyContent: 'space-between', gap: space.lg },
  badge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  pose: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.duraznoSoft, borderWidth: 1, borderColor: colors.durazno },
  poseEmoji: { fontSize: 32 },
  poseLabel: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: 1.2, color: colors.coralStrong },
  poseText: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  poseChange: { fontFamily: fonts.bold, fontSize: 14, color: colors.coralStrong, padding: space.sm },
  benefitText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.xl, borderRadius: radius.xl },
});
