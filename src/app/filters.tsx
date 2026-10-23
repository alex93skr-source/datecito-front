import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, Filters as FiltersT, me as meApi } from '../api';
import { Button, Chip, ErrorNotice, Screen, ToggleRow, TopBar } from '../components/ui';
import { intents, withEmoji } from '../data/mock';
import { useMe } from '../store/Session';
import { colors, fonts, radius, space } from '../theme';

const meetOptions = ['Mujeres', 'Hombres', 'Todas las personas'];

/** Intereses populares para ordenar Descubrir; no ocultan a nadie. */
const popularInterests = ['Café', 'Tacos', 'Cine', 'Viajes', 'Conciertos', 'Mascotas', 'Fútbol', 'Gym', 'Senderismo', 'Series', 'Bailar', 'Libros'];

const defaultFilters: FiltersT = {
  meet: 'Todas las personas',
  minAge: 18,
  maxAge: 60,
  km: 25,
  intents: [],
  relationships: [],
  interests: [],
  genres: [],
  lifestyle: [],
  languages: [],
  verifiedOnly: false,
  modes: {},
};

function Stepper({ value, onChange, min, max, step = 1, suffix = '' }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <View style={styles.stepper}>
      <Button label="−" variant="secondary" style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - step))} />
      <Text style={styles.stepValue}>
        {value}
        {suffix}
      </Text>
      <Button label="+" variant="secondary" style={styles.stepBtn} onPress={() => onChange(Math.min(max, value + step))} />
    </View>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <View style={{ gap: 2 }}>
        <Text style={styles.label}>{title}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export default function Filters() {
  const { me, setMe } = useMe();
  // Los filtros que ya no se muestran se limpian para que no sigan aplicándose sin verse.
  const [f, setF] = useState<FiltersT>({ ...defaultFilters, ...me.filters, relationships: [], genres: [], lifestyle: [], languages: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: 'intents' | 'interests', v: string) => setF({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });
  const interestOptions = [...popularInterests, ...f.interests.filter((i) => !popularInterests.includes(i))];
  const count = [f.intents, f.interests].filter((l) => l.length).length + (f.verifiedOnly ? 1 : 0) + (f.meet !== defaultFilters.meet ? 1 : 0);

  const apply = async () => {
    setSaving(true);
    setError(null);
    try {
      // La intención filtra; los intereses sólo ordenan.
      setMe(await meApi.filters({ ...f, modes: { intents: 'only', interests: 'prefer' } }));
      router.back();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos guardar tus filtros.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Filtros" right={<Text style={styles.clear} onPress={() => setF(defaultFilters)}>Limpiar</Text>} />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Section title="Quiero conocer a">
          <View style={styles.wrap}>
            {meetOptions.map((m) => (
              <Chip key={m} label={m} selected={f.meet === m} onPress={() => setF({ ...f, meet: m })} />
            ))}
          </View>
        </Section>

        <Section title="Edad">
          <View style={styles.row2}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.hint}>Desde</Text>
              <Stepper value={f.minAge} onChange={(v) => setF({ ...f, minAge: Math.min(v, f.maxAge) })} min={18} max={80} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.hint}>Hasta</Text>
              <Stepper value={f.maxAge} onChange={(v) => setF({ ...f, maxAge: Math.max(v, f.minAge) })} min={18} max={80} />
            </View>
          </View>
        </Section>

        <Section title="Distancia máxima" hint="Siempre aproximada, nunca exacta.">
          <Stepper value={f.km} onChange={(km) => setF({ ...f, km })} min={1} max={100} step={5} suffix=" km" />
        </Section>

        <Section title="Que busque…" hint="Sólo verás a quienes buscan lo que elijas. Sin elegir, ves a todas.">
          <View style={styles.wrap}>
            {intents.map((i) => (
              <Chip key={i} label={i} selected={f.intents.includes(i)} onPress={() => toggle('intents', i)} />
            ))}
          </View>
        </Section>

        <Section title="Que le guste…" hint="No ocultamos a nadie: te mostramos primero a quienes coinciden.">
          <View style={styles.wrap}>
            {interestOptions.map((i) => (
              <Chip key={i} label={withEmoji(i)} selected={f.interests.includes(i)} onPress={() => toggle('interests', i)} />
            ))}
          </View>
        </Section>

        <View style={[styles.block, { padding: 0, overflow: 'hidden' }]}>
          <ToggleRow icon="checkmark-circle-outline" label="Sólo perfiles verificados" value={f.verifiedOnly} onChange={(v) => setF({ ...f, verifiedOnly: v })} last />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ErrorNotice message={error} />
        <Button label={count ? `Aplicar ${count} ${count === 1 ? 'filtro' : 'filtros'}` : 'Ver personas'} loading={saving} onPress={apply} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.md, paddingBottom: space.xxl },
  clear: { fontFamily: fonts.bold, fontSize: 15, color: colors.coralStrong, paddingHorizontal: space.sm },
  block: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.md, borderWidth: 1, borderColor: colors.border },
  label: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  row2: { flexDirection: 'row', gap: space.lg },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepBtn: { width: 44, height: 42, paddingHorizontal: 0, borderRadius: radius.md },
  stepValue: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.verde },
  footer: { padding: space.xl, paddingTop: space.md, gap: space.sm, borderTopWidth: 1, borderTopColor: colors.border },
});
