import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Chip, IconButton, IconName, ListRow, Screen, SectionTitle } from '../../components/ui';
import { basicQuestions } from '../../data/mock';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space, type } from '../../theme';

const planLabel = { monthly: 'mensual', yearly: 'anual' } as const;

export default function Profile() {
  const { me, refreshMe } = useMe();

  useFocusEffect(
    useCallback(() => {
      void refreshMe();
    }, [refreshMe]),
  );

  const basics = basicQuestions.filter((q) => me.basics[q.key]);
  const verified = me.verification.verified;
  const m = me.membership;
  const memberTitle = m.status === 'active' && m.plan ? `Membresía ${planLabel[m.plan]}` : m.status === 'launch' ? 'Gratis durante el lanzamiento' : 'Activa tu membresía';
  const memberText = m.status === 'active' ? 'Gracias por ser parte de Datecito.' : m.status === 'launch' ? 'Disfruta todo sin costo. Te avisaremos antes de que empiece el cobro.' : 'Tu perfil y tus conversaciones se conservan.';
  const superLeft = m.super_likes.free_today + m.super_likes.purchased;

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={type.h1}>Tu perfil</Text>
          <IconButton icon="settings-outline" label="Ajustes" tone="soft" onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.hero}>
          <View>
            <Image source={{ uri: me.photos[0]?.urls.md }} style={styles.photo} contentFit="cover" />
            {verified ? (
              <View style={styles.verified}>
                <Ionicons name="checkmark" size={14} color={colors.white} />
              </View>
            ) : null}
          </View>
          <Text style={styles.name}>
            {me.name}
            {me.age ? `, ${me.age}` : ''}
          </Text>
          <Text style={styles.meta}>{[me.job, me.zone].filter(Boolean).join(' · ')}</Text>
          <View style={{ flexDirection: 'row', gap: space.md, marginTop: space.sm }}>
            <Button label="Editar perfil" icon="create-outline" variant="secondary" onPress={() => router.push('/profile/edit')} style={{ flex: 1, height: 46 }} />
            <Button label="Vista previa" icon="eye-outline" variant="dark" onPress={() => router.push('/profile/preview')} style={{ flex: 1, height: 46 }} />
          </View>
        </View>

        {!verified ? (
          <Pressable style={styles.verifyBanner} onPress={() => router.push('/safety/verify')}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.verde} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{me.verification.status === 'pending' ? 'Verificación en revisión' : 'Verifica tu perfil'}</Text>
              <Text style={styles.bannerText}>
                {me.verification.status === 'pending' ? 'Te avisaremos en cuanto la revisemos.' : 'Una selfie de 30 segundos. Genera más confianza y recibes más likes.'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.verde} />
          </Pressable>
        ) : null}

        {me.profile_completion < 100 ? (
          <View style={styles.score}>
            <View style={styles.ring}>
              <Text style={styles.ringText}>{me.profile_completion}%</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.scoreTitle}>Tu perfil inspira conexiones</Text>
              <Text style={styles.scoreCopy}>Agrega más fotos, preguntas y detalles para llegar al 100%.</Text>
            </View>
            <IconButton icon="arrow-forward" label="Completar perfil" onPress={() => router.push('/profile/edit')} tone="glass" size={38} />
          </View>
        ) : null}

        <SectionTitle>Sobre mí</SectionTitle>
        <Card style={{ gap: space.md }}>
          {me.bio ? <Text style={type.body}>{me.bio}</Text> : <Text style={type.caption}>Aún no escribes nada sobre ti.</Text>}
          <View style={styles.wrap}>
            {me.interests.map((i) => (
              <Chip key={i} label={i} />
            ))}
          </View>
          {me.intent ? (
            <View style={styles.intent}>
              <Ionicons name="heart-circle-outline" size={18} color={colors.coralStrong} />
              <Text style={styles.intentText}>{me.intent}</Text>
            </View>
          ) : null}
        </Card>

        {me.music.genres.length || me.music.anthem ? (
          <>
            <SectionTitle action="Editar" onAction={() => router.push('/profile/edit')}>
              Música
            </SectionTitle>
            <Card style={{ gap: space.md }}>
              {me.music.anthem ? (
                <View style={styles.anthem}>
                  <View style={styles.anthemIcon}>
                    <Ionicons name="musical-notes" size={18} color={colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.caption}>La canción de mi vida</Text>
                    <Text style={styles.anthemText}>{me.music.anthem}</Text>
                  </View>
                </View>
              ) : null}
              <View style={styles.wrap}>
                {me.music.genres.map((g) => (
                  <Chip key={g} label={g} icon="musical-note-outline" />
                ))}
              </View>
            </Card>
          </>
        ) : null}

        {basics.length ? (
          <>
            <SectionTitle action="Editar" onAction={() => router.push('/profile/edit')}>
              Lo básico
            </SectionTitle>
            <View style={styles.wrap}>
              {basics.map((q) => (
                <View key={q.key} style={styles.basic}>
                  <Ionicons name={q.icon as IconName} size={15} color={colors.verde} />
                  <Text style={styles.basicText}>{me.basics[q.key]}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <SectionTitle>Tu espacio</SectionTitle>
        <View style={styles.group}>
          <ListRow icon="shield-checkmark-outline" label="Centro de seguridad" onPress={() => router.push('/safety')} />
          <ListRow icon="people-outline" label="Contactos de confianza" onPress={() => router.push('/safety/contacts')} />
          <ListRow icon="location-outline" label="Ubicación y distancia" value={`${me.filters.km} km`} onPress={() => router.push('/settings/location')} last />
        </View>

        <Pressable style={styles.premium} onPress={() => router.push('/membership')}>
          <Ionicons name="sparkles" size={22} color={colors.coral} />
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>{memberTitle}</Text>
            <Text style={styles.premiumCopy}>{memberText}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.crema} />
        </Pressable>
        <Pressable style={styles.superRow} onPress={() => router.push('/superlikes')}>
          <Ionicons name="star" size={20} color={colors.verde} />
          <Text style={styles.superText}>Super likes disponibles: {superLeft}</Text>
          <Text style={styles.superLink}>Comprar más</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, gap: space.lg, paddingBottom: space.xxxl },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: 4 },
  photo: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: colors.white, backgroundColor: colors.durazno },
  verified: { position: 'absolute', right: 4, bottom: 6, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.verde, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.verde, marginTop: space.sm },
  meta: { ...type.caption, fontSize: 14 },
  verifyBanner: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: '#E6EFEB', borderWidth: 1, borderColor: '#CFE0D8' },
  bannerTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  bannerText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.text },
  score: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.verde, borderRadius: radius.xl, padding: space.lg },
  ring: { width: 58, height: 58, borderRadius: 29, borderWidth: 4, borderColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  ringText: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.crema },
  scoreTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.crema },
  scoreCopy: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: 'rgba(249,243,236,0.75)' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  intent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  intentText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  anthem: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  anthemIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center' },
  anthemText: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  basic: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  basicText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.verde },
  group: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  premium: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.verdeSoft },
  premiumTitle: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.crema },
  premiumCopy: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(249,243,236,0.8)' },
  superRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  superText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  superLink: { fontFamily: fonts.bold, fontSize: 13, color: colors.coralStrong },
});
