import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, me as meApi, ProfileUpdate } from '../../api';
import { ActionSheet } from '../../components/ActionSheet';
import { Body, Button, Caption, Chip, ErrorNotice, Eyebrow, Field, H1, IconButton, Notice, Option, ProgressBar, Screen } from '../../components/ui';
import { InterestPicker } from '../../components/InterestPicker';
import { intents, musicGenres, relationshipTypes } from '../../data/mock';
import { currentLocation, LocationDeniedError, LocationUnavailableError, pickImage } from '../../lib/device';
import { homeFor, useMe, useSession } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const TOTAL = 6;
const genders = ['Mujer', 'Hombre', 'No binarie', 'Prefiero describirlo'];
const audiences = ['Mujeres', 'Hombres', 'Todas las personas'];
const intentOptions = [
  { label: intents[0], description: 'Abierto a algo bonito si se da', icon: 'heart-outline' as const },
  { label: intents[1], description: 'Busco una relación estable', icon: 'home-outline' as const },
  { label: intents[2], description: 'Primero la conversación', icon: 'chatbubbles-outline' as const },
  { label: intents[3], description: 'Y está bien', icon: 'compass-outline' as const },
];

/** DD/MM/AAAA → AAAA-MM-DD (o null si no es una fecha válida). */
function parseBirthdate(value: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(`${y}-${mo}-${d}T00:00:00`);
  return Number.isNaN(date.getTime()) || date.getDate() !== Number(d) ? null : `${y}-${mo}-${d}`;
}

const formatBirthdate = (iso: string | null) => (iso ? iso.split('-').reverse().join('/') : '');

export default function Onboarding() {
  const { me, setMe } = useMe();
  const { signOut } = useSession();
  // Retoma en el primer paso pendiente si la persona salió a medias.
  const [step, setStep] = useState(() => {
    if (!me.name || !me.birthdate) return 1;
    if (!me.gender || !me.interested_in.length) return 2;
    if (!me.intent) return 3;
    if (me.photos.length < 2) return 4;
    if (me.interests.length < 3) return 5;
    return 6;
  });
  // Si retoma a medias, se le avisa en qué paso va (sólo en el primer paso que ve).
  const [resumedAt] = useState(step > 1 ? step : 0);
  const [name, setName] = useState(me.name ?? '');
  const [birthdate, setBirthdate] = useState(formatBirthdate(me.birthdate));
  const [gender, setGender] = useState(me.gender ?? '');
  const [looking, setLooking] = useState<string[]>(me.interested_in);
  const [intent, setIntent] = useState(me.intent ?? '');
  const [relationship, setRelationship] = useState(me.relationship_type ?? '');
  const [interests, setInterests] = useState<string[]>(me.interests);
  const [genres, setGenres] = useState<string[]>(me.music.genres);
  const [teams, setTeams] = useState<Record<string, string[]>>(me.teams ?? {});
  const [drink, setDrink] = useState<string | undefined>(me.basics.drink);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);

  const goBack = () => {
    if (step > 1) return setStep(step - 1);
    Alert.alert('¿Salir del registro?', 'Tu avance se guarda. Podrás continuar cuando vuelvas a entrar.', [
      { text: 'Seguir aquí', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          await signOut();
          router.replace('/welcome');
        },
      },
    ]);
  };

  // El botón atrás de Android regresa al paso anterior en lugar de salir.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  });

  const toggle = (list: string[], set: (v: string[]) => void, v: string, max = 99) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : list.length < max ? [...list, v] : list);

  const birthIso = parseBirthdate(birthdate);
  const canContinue =
    (step === 1 && name.trim().length > 1 && !!birthIso) ||
    (step === 2 && !!gender && looking.length > 0) ||
    (step === 3 && !!intent) ||
    (step === 4 && me.photos.length >= 2) ||
    (step === 5 && interests.length >= 3) ||
    step === 6;

  const save = async (data: ProfileUpdate) => {
    const fresh = await meApi.update(data);
    setMe(fresh);
  };

  const finish = async () => {
    const fresh = await meApi.get();
    setMe(fresh);
    router.replace(homeFor(fresh));
  };

  const next = async () => {
    setSaving(true);
    setError(null);
    try {
      if (step === 1) await save({ name: name.trim(), birthdate: birthIso });
      if (step === 2) await save({ gender, interested_in: looking });
      if (step === 3) await save({ intent, relationship_type: relationship || null });
      if (step === 5) {
        const { drink: _old, ...basics } = me.basics;
        await save({ interests, teams, music_genres: genres, basics: drink ? { ...basics, drink } : basics });
      }
      if (step === 6) {
        const loc = await currentLocation();
        await meApi.location(loc.lat, loc.lng, loc.zone);
        return finish();
      }
      setStep(step + 1);
    } catch (e) {
      if (e instanceof LocationDeniedError) setError('Sin permiso de ubicación no podemos mostrarte personas cerca. Puedes activarlo después en Ajustes.');
      else if (e instanceof LocationUnavailableError) setError('No logramos ubicarte. Revisa que el GPS esté encendido e inténtalo de nuevo, o toca "Ahora no".');
      else if (e instanceof ApiError) setError(Object.values(e.errors)[0]?.[0] ?? e.message);
      else setError('Eso no salió. Inténtalo otra vez.');
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
      setMe(await meApi.get());
    } catch (e) {
      setError(e instanceof ApiError ? (e.field('photo') ?? e.message) : 'No pudimos subir la foto.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (id: string) => {
    try {
      await meApi.deletePhoto(id);
      setMe(await meApi.get());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos quitar la foto.');
    }
  };

  return (
    <Screen>
      <View style={styles.head}>
        <IconButton icon="chevron-back" label="Atrás" onPress={goBack} />
        <View style={{ flex: 1 }}>
          <ProgressBar step={step} total={TOTAL} />
        </View>
        <Text style={styles.count}>
          {step}/{TOTAL}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {resumedAt && step === resumedAt ? (
          <Notice icon="bookmark-outline">
            Seguimos donde te quedaste: paso {step} de {TOTAL}. Lo que ya llenaste está guardado.
          </Notice>
        ) : null}
        {step === 1 && (
          <>
            <Eyebrow>UN POCO SOBRE TI</Eyebrow>
            <H1>¿Cómo te gustaría que te llamen?</H1>
            <Body muted>Así aparecerá tu nombre en tu perfil.</Body>
            <Field label="Tu nombre" value={name} onChangeText={setName} placeholder="Tu nombre" maxLength={40} autoCapitalize="words" autoComplete="given-name" autoFocus />
            <Field
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              keyboardType="number-pad"
              value={birthdate}
              maxLength={10}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, '').slice(0, 8);
                setBirthdate([digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/'));
              }}
              error={birthdate.length === 10 && !birthIso ? 'Revisa la fecha.' : undefined}
            />
            <Caption>Sólo mostramos tu edad, nunca tu fecha completa. Debes tener 18 años o más.</Caption>
          </>
        )}

        {step === 2 && (
          <>
            <Eyebrow>TU ESPACIO, TUS REGLAS</Eyebrow>
            <H1>Cuéntanos de ti y a quién te gustaría conocer.</H1>
            <Text style={styles.group}>Me identifico como</Text>
            <View style={styles.wrap}>
              {genders.map((g) => (
                <Chip key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />
              ))}
            </View>
            <Text style={styles.group}>Me interesa conocer a</Text>
            <View style={styles.wrap}>
              {audiences.map((g) => (
                <Chip key={g} label={g} selected={looking.includes(g)} onPress={() => toggle(looking, setLooking, g)} />
              ))}
            </View>
            <Notice icon="eye-off-outline">Puedes cambiar esto cuando quieras y elegir si se muestra en tu perfil.</Notice>
          </>
        )}

        {step === 3 && (
          <>
            <Eyebrow>TU INTENCIÓN IMPORTA</Eyebrow>
            <H1>No hay respuestas correctas. Sólo honestas.</H1>
            <View style={{ gap: space.md }}>
              {intentOptions.map((o) => (
                <Option key={o.label} {...o} selected={intent === o.label} onPress={() => setIntent(o.label)} />
              ))}
            </View>
            <Text style={styles.group}>Tipo de relación (opcional)</Text>
            <View style={styles.wrap}>
              {relationshipTypes.map((r) => (
                <Chip key={r} label={r} selected={relationship === r} onPress={() => setRelationship(relationship === r ? '' : r)} />
              ))}
            </View>
            <Caption>Es privado por defecto. Tú decides si se muestra en tu perfil.</Caption>
          </>
        )}

        {step === 4 && (
          <>
            <Eyebrow>MUESTRA TU ESENCIA</Eyebrow>
            <H1>Una buena foto abre una buena conversación.</H1>
            <Body muted>Agrega al menos 2 fotos claras y recientes. Después podrás subir hasta 7.</Body>
            <View style={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => {
                const photo = me.photos[i];
                return photo ? (
                  <View key={photo.id} style={styles.tile}>
                    <Image source={{ uri: photo.urls.md }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    {i === 0 ? <Text style={styles.mainTag}>Principal</Text> : null}
                    <Pressable style={styles.remove} onPress={() => removePhoto(photo.id)} accessibilityLabel="Quitar foto">
                      <Ionicons name="close" size={14} color={colors.verde} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable key={i} style={[styles.tile, styles.addTile]} disabled={uploading} onPress={() => setSheet(true)} accessibilityLabel="Agregar foto">
                    <View style={styles.center}>{uploading && i === me.photos.length ? <ActivityIndicator color={colors.coralStrong} /> : <Ionicons name="add" size={28} color={colors.coralStrong} />}</View>
                  </Pressable>
                );
              })}
            </View>
            <Caption>Quitamos la ubicación y los datos ocultos de tus fotos antes de guardarlas.</Caption>
          </>
        )}

        {step === 5 && (
          <>
            <Eyebrow>LO QUE TE MUEVE</Eyebrow>
            <H1>Elige tus intereses.</H1>
            <Body muted>Escoge de 3 a 10. Nos ayudan a sugerirte personas afines.</Body>
            <InterestPicker interests={interests} onInterests={setInterests} teams={teams} onTeams={setTeams} drink={drink} onDrink={setDrink} />
            <Text style={styles.group}>¿Qué música te mueve?</Text>
            <View style={styles.wrap}>
              {musicGenres.map((g) => (
                <Chip key={g} label={g} icon="musical-note-outline" selected={genres.includes(g)} onPress={() => toggle(genres, setGenres, g, 6)} />
              ))}
            </View>
          </>
        )}

        {step === 6 && (
          <>
            <View style={styles.locIcon}>
              <Ionicons name="location" size={40} color={colors.coralStrong} />
            </View>
            <Eyebrow style={{ textAlign: 'center' }}>PERSONAS CERCA DE TI</Eyebrow>
            <H1 center>Activa tu ubicación aproximada.</H1>
            <Body muted center>
              La usamos sólo para mostrarte personas cerca. Guardamos una ubicación redondeada (alrededor de 1 km) y nadie verá tu dirección: sólo tu zona general.
            </Body>
            <Notice>Puedes desactivarla cuando quieras desde los ajustes de tu teléfono.</Notice>
          </>
        )}

        <ErrorNotice message={error} />
      </ScrollView>

      <View style={styles.footer}>
        <Button label={step === TOTAL ? 'Permitir ubicación' : 'Continuar'} onPress={next} loading={saving} disabled={!canContinue || uploading} />
        {step === TOTAL ? <Button label="Ahora no" variant="ghost" onPress={finish} /> : null}
      </View>

      <ActionSheet
        visible={sheet}
        title="Agregar foto"
        onClose={() => setSheet(false)}
        actions={[
          { label: 'Elegir de la galería', icon: 'images-outline', onPress: () => addPhoto('library') },
          { label: 'Tomar foto', icon: 'camera-outline', onPress: () => addPhoto('camera') },
        ]}
      />
    </Screen>
  );
}

/** 3 fotos por fila, verticales (4:5) como el recorte. */
const TILE_W = Math.floor((Dimensions.get('window').width - space.xl * 2 - space.md * 2) / 3) - 1;

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.sm, height: 56 },
  count: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted, width: 36, textAlign: 'center' },
  body: { padding: space.xl, gap: space.lg },
  group: { fontFamily: fonts.bold, fontSize: 14, color: colors.verde, marginTop: space.sm },
  cat: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: { width: TILE_W, height: TILE_W * 1.25, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.durazno },
  addTile: { backgroundColor: colors.surface, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  mainTag: { position: 'absolute', left: 6, bottom: 6, backgroundColor: colors.verde, color: colors.crema, fontFamily: fonts.bold, fontSize: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  remove: { position: 'absolute', right: 6, top: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  locIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.duraznoSoft, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: space.xxl },
  footer: { padding: space.xl, paddingTop: space.sm, gap: space.xs },
});
