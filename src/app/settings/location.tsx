import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, me as meApi } from '../../api';
import { Chip, ErrorNotice, Group, ListRow, Notice, Screen, TopBar } from '../../components/ui';
import { currentLocation, LocationDeniedError } from '../../lib/device';
import { useMe } from '../../store/Session';
import { colors, fonts, radius, space } from '../../theme';

const distances = [5, 10, 15, 25, 50, 100];

export default function Location() {
  const { me, setMe } = useMe();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const km = me.filters.km;

  const setKm = async (value: number) => {
    setError(null);
    try {
      setMe(await meApi.filters({ ...me.filters, km: value }));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos guardar la distancia.');
    }
  };

  const updateLocation = async () => {
    setUpdating(true);
    setError(null);
    try {
      const loc = await currentLocation();
      await meApi.location(loc.lat, loc.lng, loc.zone);
      setMe(await meApi.get());
    } catch (e) {
      setError(e instanceof LocationDeniedError ? 'Activa el permiso de ubicación en los ajustes del teléfono.' : 'No pudimos actualizar tu ubicación.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Ubicación y distancia" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.xl }}>
        <View style={styles.map}>
          <View style={[styles.ring, { width: 80 + Math.min(km, 50) * 3, height: 80 + Math.min(km, 50) * 3, borderRadius: (80 + Math.min(km, 50) * 3) / 2 }]} />
          <View style={styles.pin}>
            <Ionicons name="location" size={22} color={colors.white} />
          </View>
          <Text style={styles.zone}>{me.zone ?? 'Sin ubicación'} · zona aproximada</Text>
        </View>
        <View style={{ gap: space.sm }}>
          <Text style={styles.label}>Distancia máxima: {km} km</Text>
          <View style={styles.wrap}>
            {distances.map((d) => (
              <Chip key={d} label={`${d} km`} selected={km === d} onPress={() => setKm(d)} />
            ))}
          </View>
        </View>
        <Group title="Ubicación">
          <ListRow icon="navigate-outline" label={updating ? 'Actualizando…' : 'Actualizar mi ubicación'} value={me.has_location ? me.zone ?? undefined : 'Sin activar'} onPress={updating ? undefined : updateLocation} last />
        </Group>
        <ErrorNotice message={error} />
        <Notice>Guardamos una ubicación redondeada (alrededor de 1 km). Nunca mostramos tu dirección y las distancias son aproximadas.</Notice>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: { height: 220, borderRadius: radius.xl, backgroundColor: '#E6EFEB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ring: { position: 'absolute', backgroundColor: 'rgba(255,107,107,0.15)', borderWidth: 2, borderColor: 'rgba(255,107,107,0.5)' },
  pin: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.coralStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  zone: { position: 'absolute', bottom: space.md, fontFamily: fonts.bold, fontSize: 13, color: colors.verde, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, overflow: 'hidden' },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
