import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, me as meApi, Photo } from '../../api';
import { ActionSheet } from '../../components/ActionSheet';
import { Button, Chip, ErrorNotice, Field, IconName, Screen, ToggleRow, TopBar } from '../../components/ui';
import { InterestPicker } from '../../components/InterestPicker';
import { BasicKey, basicQuestions, intents, languages, musicGenres, promptOptions, relationshipTypes } from '../../data/mock';
import { pickImage } from '../../lib/device';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const MAX_PHOTOS = 7;
const MAX_INTERESTS = 10;
const toggle = (list: string[], v: string, max = 99) => (list.includes(v) ? list.filter((x) => x !== v) : list.length < max ? [...list, v] : list);

export default function EditProfile() {
  const { me, setMe } = useMe();
  const [bio, setBio] = useState(me.bio ?? '');
  const [job, setJob] = useState(me.job ?? '');
  const [intent, setIntent] = useState(me.intent ?? '');
  const [relationship, setRelationship] = useState(me.relationship_type ?? '');
  const [showRelationship, setShowRelationship] = useState(me.settings.show_relationship);
  const [interests, setInterests] = useState(me.interests);
  const [genres, setGenres] = useState(me.music.genres);
  const [teams, setTeams] = useState<Record<string, string[]>>(me.teams ?? {});
  const [artists, setArtists] = useState(me.music.artists.join(', '));
  const [anthem, setAnthem] = useState(me.music.anthem ?? '');
  const [basics, setBasics] = useState<Record<string, string>>(me.basics);
  const [langs, setLangs] = useState(me.languages);
  const [prompts, setPrompts] = useState(me.prompts);
  const [openBasic, setOpenBasic] = useState<BasicKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [photoMenu, setPhotoMenu] = useState<Photo | null>(null);

  const refresh = async () => setMe(await meApi.get());

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await meApi.update({
        bio: bio.trim() || null,
        job: job.trim() || null,
        intent: intent || null,
        relationship_type: relationship || null,
        interests,
        teams,
        music_genres: genres,
        music_artists: artists.split(',').map((a) => a.trim()).filter(Boolean).slice(0, 5),
        anthem: anthem.trim() || null,
        basics,
        languages: langs,
        prompts: prompts.filter((p) => p.a.trim()).map((p) => ({ q: p.q, a: p.a.trim() })),
      });
      setMe(await meApi.settings({ show_relationship: showRelationship }));
      router.back();
    } catch (e) {
      setError(e instanceof ApiError ? (Object.values(e.errors)[0]?.[0] ?? e.message) : 'No pudimos guardar tus cambios.');
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = async (source: 'library' | 'camera') => {
    const image = await pickImage(source);
    if (!image) return;
    setUploading(true);
    setError(null);
    try {
      await meApi.uploadPhoto(image.uri, image.mimeType);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('photo') ?? e.message) : 'No pudimos subir la foto.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photo: Photo) => {
    if (me.photos.length <= 2) return setError('Necesitas al menos 2 fotos en tu perfil.');
    try {
      await meApi.deletePhoto(photo.id);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos quitar la foto.');
    }
  };

  const makeMain = async (photo: Photo) => {
    try {
      await meApi.reorderPhotos([photo.id, ...me.photos.filter((p) => p.id !== photo.id).map((p) => p.id)]);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos cambiar la foto principal.');
    }
  };

  return (
    <Screen>
      <TopBar title="Editar perfil" right={<Text style={styles.save} onPress={save}>Guardar</Text>} />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Section title="Fotos" hint={`De 2 a ${MAX_PHOTOS}. Toca una foto para hacerla principal o quitarla.`}>
          <View style={styles.grid}>
            {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
              const photo = me.photos[i];
              return photo ? (
                <Pressable key={photo.id} style={styles.tile} onPress={() => setPhotoMenu(photo)}>
                  <Image source={{ uri: photo.urls.md }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  {i === 0 ? <Text style={styles.main}>Principal</Text> : null}
                </Pressable>
              ) : (
                <Pressable key={i} style={[styles.tile, styles.add]} disabled={uploading} onPress={() => setSheet(true)} accessibilityLabel="Agregar foto">
                  <View style={styles.center}>{uploading && i === me.photos.length ? <ActivityIndicator color={colors.coralStrong} /> : <Ionicons name="add" size={28} color={colors.coralStrong} />}</View>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Sobre mí">
          <Field value={bio} onChangeText={setBio} multiline maxLength={300} placeholder="Cuéntales algo que no esté en tus fotos." />
          <Text style={styles.counter}>{bio.length}/300</Text>
          <Field label="Ocupación" icon="briefcase-outline" value={job} onChangeText={setJob} maxLength={60} />
        </Section>

        <Section title="Preguntas" hint="Elige hasta 3. Son lo que más abre conversaciones.">
          {prompts.map((p, i) => (
            <View key={p.q} style={styles.prompt}>
              <View style={styles.promptHead}>
                <Text style={styles.promptQ}>{p.q}</Text>
                <Pressable onPress={() => setPrompts(prompts.filter((_, x) => x !== i))} hitSlop={8} accessibilityLabel="Quitar pregunta">
                  <Ionicons name="close-circle" size={20} color={colors.subtle} />
                </Pressable>
              </View>
              <Field value={p.a} placeholder="Tu respuesta…" maxLength={160} onChangeText={(a) => setPrompts(prompts.map((x, j) => (j === i ? { ...x, a } : x)))} />
            </View>
          ))}
          {prompts.length < 3 ? (
            <View style={styles.wrap}>
              {promptOptions
                .filter((q) => !prompts.some((p) => p.q === q))
                .map((q) => (
                  <Chip key={q} label={q} icon="add" onPress={() => setPrompts([...prompts, { q, a: '' }])} />
                ))}
            </View>
          ) : null}
        </Section>

        <Section title="Intención">
          <View style={styles.wrap}>
            {intents.map((i) => (
              <Chip key={i} label={i} selected={intent === i} onPress={() => setIntent(i)} />
            ))}
          </View>
        </Section>

        <Section title="Tipo de relación" hint="Opcional. Sirve para encontrar personas compatibles.">
          <View style={styles.wrap}>
            {relationshipTypes.map((r) => (
              <Chip key={r} label={r} selected={relationship === r} onPress={() => setRelationship(relationship === r ? '' : r)} />
            ))}
          </View>
          <View style={styles.box}>
            <ToggleRow icon="eye-outline" label="Mostrar en mi perfil" description="Si lo ocultas, sólo se usa para los filtros." value={showRelationship} onChange={setShowRelationship} last />
          </View>
        </Section>

        <Section title="Intereses">
          <InterestPicker interests={interests} onInterests={setInterests} teams={teams} onTeams={setTeams} max={MAX_INTERESTS} />
        </Section>

        <Section title="Música">
          <Field label="La canción de mi vida" icon="musical-notes-outline" placeholder="Canción — Artista" value={anthem} onChangeText={setAnthem} maxLength={120} />
          <Field label="Artistas favoritos" icon="mic-outline" placeholder="Separados por coma (hasta 5)" value={artists} onChangeText={setArtists} />
          <Text style={styles.subTitle}>Géneros</Text>
          <View style={styles.wrap}>
            {musicGenres.map((g) => (
              <Chip key={g} label={g} selected={genres.includes(g)} onPress={() => setGenres(toggle(genres, g, 6))} />
            ))}
          </View>
        </Section>

        <Section title="Lo básico" hint="Todo es opcional.">
          <View style={styles.box}>
            {basicQuestions.map((q, idx) => (
              <View key={q.key} style={[styles.basicRow, idx < basicQuestions.length - 1 && styles.basicBorder]}>
                <Pressable style={styles.basicHead} onPress={() => setOpenBasic(openBasic === q.key ? null : q.key)}>
                  <Ionicons name={q.icon as IconName} size={18} color={colors.verde} />
                  <Text style={styles.basicLabel}>{q.label}</Text>
                  <Text style={styles.basicValue}>{basics[q.key] ?? 'Agregar'}</Text>
                  <Ionicons name={openBasic === q.key ? 'chevron-up' : 'chevron-down'} size={16} color={colors.subtle} />
                </Pressable>
                {openBasic === q.key ? (
                  <View style={[styles.wrap, { paddingBottom: space.md }]}>
                    {q.options.map((o) => (
                      <Chip
                        key={o}
                        label={o}
                        selected={basics[q.key] === o}
                        onPress={() => {
                          const next = { ...basics };
                          if (next[q.key] === o) delete next[q.key];
                          else next[q.key] = o;
                          setBasics(next);
                        }}
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </Section>

        <Section title="Idiomas">
          <View style={styles.wrap}>
            {languages.map((l) => (
              <Chip key={l} label={l} selected={langs.includes(l)} onPress={() => setLangs(toggle(langs, l))} />
            ))}
          </View>
        </Section>

        <ErrorNotice message={error} />
        <Button label="Guardar cambios" loading={saving} onPress={save} style={{ marginTop: space.md }} />
      </ScrollView>

      <ActionSheet
        visible={sheet}
        title="Agregar foto"
        onClose={() => setSheet(false)}
        actions={[
          { label: 'Elegir de la galería', icon: 'images-outline', onPress: () => addPhoto('library') },
          { label: 'Tomar foto', icon: 'camera-outline', onPress: () => addPhoto('camera') },
        ]}
      />
      <ActionSheet
        visible={!!photoMenu}
        title="Foto"
        onClose={() => setPhotoMenu(null)}
        actions={
          photoMenu
            ? [
                ...(photoMenu.id !== me.photos[0]?.id ? [{ label: 'Hacer principal', icon: 'star-outline' as const, onPress: () => makeMain(photoMenu) }] : []),
                { label: 'Quitar foto', icon: 'trash-outline' as const, danger: true, onPress: () => removePhoto(photoMenu) },
              ]
            : []
        }
      />
    </Screen>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

/** 3 fotos por fila, verticales (4:5) como el recorte. */
const TILE_W = Math.floor((Dimensions.get('window').width - space.xl * 2 - space.md * 2) / 3) - 1;

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.xxl, paddingBottom: space.xxxl },
  save: { fontFamily: fonts.bold, fontSize: 15, color: colors.coralStrong, paddingHorizontal: space.sm },
  section: { gap: space.md },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.verde },
  subTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: -space.sm },
  counter: { fontFamily: fonts.regular, fontSize: 12, color: colors.subtle, alignSelf: 'flex-end', marginTop: -space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: { width: TILE_W, height: TILE_W * 1.25, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.durazno },
  add: { backgroundColor: colors.surface, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  main: { position: 'absolute', left: 6, bottom: 6, backgroundColor: colors.verde, color: colors.crema, fontFamily: fonts.bold, fontSize: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  prompt: { gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.duraznoSoft },
  promptHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  promptQ: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.coralStrong },
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  basicRow: { paddingHorizontal: space.lg },
  basicBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  basicHead: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 14 },
  basicLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  basicValue: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
});
