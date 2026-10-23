import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, safety } from '../../api';
import { Body, Button, ErrorNotice, Field, H1, Loading, Notice, Screen, TopBar } from '../../components/ui';
import { useRemote } from '../../hooks/useRemote';
import { colors, fonts, radius, space } from '../../theme';

const MAX = 3;

export default function Contacts() {
  const contacts = useRemote(safety.contacts);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10;
  const list = contacts.data ?? [];

  const add = async () => {
    setSaving(true);
    setError(null);
    try {
      const created = await safety.addContact(name.trim(), phone.trim());
      contacts.setData((prev) => [...(prev ?? []), created]);
      setName('');
      setPhone('');
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError(0, 'No pudimos guardar el contacto.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    contacts.setData((prev) => (prev ?? []).filter((c) => c.id !== id));
    await safety.removeContact(id).catch(() => contacts.reload());
  };

  return (
    <Screen>
      <TopBar title="Contactos de confianza" />
      {!contacts.data ? (
        <Loading error={contacts.error?.message} onRetry={contacts.reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <H1>¿A quién avisamos?</H1>
          <Body muted>Hasta {MAX} personas. Sólo reciben avisos cuando tú activas Datecito Seguro o pides ayuda.</Body>

          {list.map((c) => (
            <View key={c.id} style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.initial}>{c.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
              </View>
              <Pressable onPress={() => remove(c.id)} hitSlop={8} accessibilityLabel={`Quitar a ${c.name}`}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>
          ))}

          {list.length < MAX ? (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Agregar contacto</Text>
              <Field placeholder="Nombre (ej. Fer, mi hermana)" icon="person-outline" value={name} onChangeText={setName} maxLength={60} error={error?.field('name')} />
              <Field placeholder="Teléfono a 10 dígitos" icon="call-outline" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={20} error={error?.field('phone')} />
              <ErrorNotice message={error && !error.field('name') && !error.field('phone') ? error.message : null} />
              <Button label="Agregar" icon="person-add-outline" variant="secondary" loading={saving} disabled={!valid} onPress={add} />
            </View>
          ) : null}

          <Notice icon="lock-closed-outline">Guardamos nombre y teléfono cifrados. Tus contactos no necesitan tener Datecito y nunca ven tu perfil ni tus chats.</Notice>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.md, paddingBottom: space.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.durazno, alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.extrabold, fontSize: 18, color: colors.verde },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  phone: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  form: { gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surfaceAlt },
  formTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
});
