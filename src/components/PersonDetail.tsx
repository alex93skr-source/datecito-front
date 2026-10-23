import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Person } from '../api';
import { basicQuestions, emojiFor, withEmoji } from '../data/mock';
import { colors, fonts, radius, space, type } from '../theme';
import { Chip, IconButton, IconName } from './ui';

const { width } = Dimensions.get('window');

/** Perfil completo: foto dominante, información progresiva y bloques de intereses. */
export function PersonDetail({ person, myInterests = [], myTeams = {}, onClose, onMore, footer, own }: { person: Person; myInterests?: string[]; myTeams?: Record<string, string[]>; onClose: () => void; onMore?: () => void; footer?: ReactNode; own?: boolean }) {
  const insets = useSafeAreaInsets();
  const common = own ? [] : person.interests.filter((i) => myInterests.includes(i));
  const teams = Object.entries(person.teams ?? {}).filter(([, list]) => list.length);
  const mine = Object.values(myTeams).flat();
  const sameTeams = own ? [] : teams.flatMap(([, list]) => list).filter((t) => mine.includes(t));
  const photos = (person.photos ?? []).map((p) => p.urls.lg);
  const meta = [person.job, person.zone, !own && person.distance_km ? `a ${person.distance_km} km` : null].filter(Boolean).join(' · ');
  const basics = basicQuestions.filter((q) => person.basics[q.key]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: footer ? 130 : space.xxxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: photos[0] }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={['rgba(0,0,0,0.25)', 'transparent', 'rgba(15,61,50,0.9)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={[styles.heroBar, { top: insets.top + space.sm }]}>
            <IconButton icon="chevron-down" label="Cerrar" tone="glass" onPress={onClose} />
            {onMore ? <IconButton icon="ellipsis-horizontal" label="Más opciones" tone="glass" onPress={onMore} /> : null}
          </View>
          <View style={styles.heroInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.name}>
                {person.name}
                {person.age ? <Text style={{ fontFamily: fonts.regular }}>, {person.age}</Text> : null}
              </Text>
              {person.verified ? <Ionicons name="checkmark-circle" size={24} color={colors.durazno} /> : null}
              {!person.verified && person.verification_pending ? (
                <View style={styles.pendingPill}>
                  <Ionicons name="time-outline" size={12} color={colors.crema} />
                  <Text style={styles.pendingText}>En verificación</Text>
                </View>
              ) : null}
            </View>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.intentCard}>
            <Ionicons name="heart-circle" size={26} color={colors.coral} />
            <View style={{ flex: 1 }}>
              <Text style={type.caption}>Busca</Text>
              <Text style={styles.intent}>{person.intent ?? 'Lo está descubriendo'}</Text>
              {person.relationship_type ? <Text style={styles.relationship}>Tipo de relación: {person.relationship_type}</Text> : null}
            </View>
          </View>

          {common.length || sameTeams.length ? (
            <View style={styles.common}>
              <Ionicons name="sparkles" size={18} color={colors.verde} />
              <Text style={styles.commonText}>
                {common.length ? `Tienen ${common.length} ${common.length === 1 ? 'interés' : 'intereses'} en común: ${common.join(', ')}.` : ''}
                {sameTeams.length ? `${common.length ? ' ' : ''}¡Los dos le van a ${sameTeams.join(' y ')}!` : ''}
              </Text>
            </View>
          ) : null}

          <Block title="Sobre mí">
            <Text style={[type.body, { fontSize: 16, lineHeight: 25 }]}>{person.bio || 'Todavía no escribe nada aquí.'}</Text>
          </Block>

          {basics.length ? (
            <Block title="Lo básico">
              <View style={styles.wrap}>
                {basics.map((q) => (
                  <View key={q.key} style={styles.basic}>
                    <Ionicons name={q.icon as IconName} size={15} color={colors.verde} />
                    <Text style={styles.basicText}>{person.basics[q.key]}</Text>
                  </View>
                ))}
              </View>
            </Block>
          ) : null}

          {person.prompts[0] ? <Prompt q={person.prompts[0].q} a={person.prompts[0].a} /> : null}

          {photos[1] ? <Image source={{ uri: photos[1] }} style={styles.photo} contentFit="cover" transition={200} /> : null}

          <Block title="Intereses">
            <View style={styles.wrap}>
              {person.interests.map((i) => (
                <Chip key={i} label={withEmoji(i)} selected={common.includes(i)} />
              ))}
            </View>
          </Block>

          {teams.length ? (
            <Block title="Le va a">
              <View style={{ gap: space.sm }}>
                {teams.map(([sport, list]) => (
                  <Text key={sport} style={type.body}>
                    {emojiFor(sport)} <Text style={{ fontFamily: fonts.bold, color: colors.ink }}>{list.join(' y ')}</Text>
                  </Text>
                ))}
              </View>
            </Block>
          ) : null}

          {person.music.genres.length || person.music.anthem ? (
          <Block title="Música">
            {person.music.anthem ? (
              <View style={styles.anthem}>
                <View style={styles.anthemIcon}>
                  <Ionicons name="musical-notes" size={20} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={type.caption}>La canción de mi vida</Text>
                  <Text style={styles.anthemText}>{person.music.anthem}</Text>
                </View>
              </View>
            ) : null}
            <View style={styles.wrap}>
              {person.music.genres.map((g) => (
                <Chip key={g} label={g} icon="musical-note-outline" />
              ))}
            </View>
            {person.music.artists.length ? <Text style={type.body}>Escucha mucho a {person.music.artists.join(' y ')}.</Text> : null}
          </Block>
          ) : null}

          {person.prompts[1] ? <Prompt q={person.prompts[1].q} a={person.prompts[1].a} /> : null}

          {photos.slice(2).map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.photo} contentFit="cover" transition={200} />
          ))}

          {person.languages.length ? (
            <Block title="Idiomas">
              <View style={styles.wrap}>
                {person.languages.map((l) => (
                  <Chip key={l} label={l} icon="language-outline" />
                ))}
              </View>
            </Block>
          ) : null}

          <View style={styles.privacy}>
            <Ionicons name="location-outline" size={16} color={colors.muted} />
            <Text style={type.caption}>Zona aproximada. Datecito nunca muestra ubicaciones exactas.</Text>
          </View>
        </View>
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>{footer}</View> : null}
    </View>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Prompt({ q, a }: { q: string; a: string }) {
  return (
    <View style={[styles.block, { backgroundColor: colors.duraznoSoft, borderColor: colors.durazno }]}>
      <Text style={styles.blockTitle}>{q}</Text>
      <Text style={styles.answer}>{a}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width, height: width * 1.25, backgroundColor: colors.durazno },
  heroBar: { position: 'absolute', left: space.lg, right: space.lg, flexDirection: 'row', justifyContent: 'space-between' },
  heroInfo: { position: 'absolute', left: space.xl, right: space.xl, bottom: space.xxxl, gap: 4 },
  name: { fontFamily: fonts.extrabold, fontSize: 34, color: colors.white, letterSpacing: -0.5 },
  meta: { fontFamily: fonts.semibold, fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  body: { padding: space.lg, gap: space.md },
  intentCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, borderWidth: 1, borderColor: colors.border, marginTop: -space.xxl },
  intent: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  relationship: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  common: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: '#E6EFEB' },
  commonText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.verde },
  pendingPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(249,243,236,0.25)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  pendingText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.crema },
  block: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.md, borderWidth: 1, borderColor: colors.border },
  blockTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.coralStrong, letterSpacing: 0.3 },
  answer: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 27, color: colors.verde },
  basic: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.surfaceAlt },
  basicText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.verde },
  anthem: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  anthemIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center' },
  anthemText: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  photo: { width: '100%', aspectRatio: 0.85, borderRadius: radius.xl, backgroundColor: colors.durazno },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: space.md },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.xl, paddingTop: space.md, backgroundColor: 'rgba(249,243,236,0.96)', borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', gap: space.md },
});
