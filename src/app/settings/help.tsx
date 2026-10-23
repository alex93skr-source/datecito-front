import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Screen, TopBar } from '../../components/ui';
import { colors, fonts, radius, space, type } from '../../theme';

const faqs = [
  { q: '¿Cómo funciona un match?', a: 'Cuando tú y otra persona se dan like, se abre un chat entre ustedes. Nadie puede escribirte sin match.' },
  { q: '¿Qué es un datecito?', a: 'Es una propuesta de plan dentro del chat: tipo de plan, zona general y horario. Ambos confirman antes de que sea un plan.' },
  { q: '¿Quién ve mi ubicación?', a: 'Nadie ve tu ubicación exacta. Sólo mostramos la zona general y una distancia aproximada.' },
  { q: '¿Cómo reporto a alguien?', a: 'Desde el chat o el perfil, toca ••• y elige “Reportar”. Tu reporte es confidencial.' },
  { q: '¿Puedo pausar mi cuenta?', a: 'Sí. En Ajustes › Tu cuenta puedes pausar tu perfil sin perder tus matches.' },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Screen>
      <TopBar title="Ayuda" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.md }}>
        {faqs.map((f, i) => (
          <Pressable key={f.q} onPress={() => setOpen(open === i ? null : i)} style={styles.item}>
            <View style={styles.head}>
              <Text style={styles.q}>{f.q}</Text>
              <Ionicons name={open === i ? 'remove' : 'add'} size={20} color={colors.coralStrong} />
            </View>
            {open === i ? <Text style={type.body}>{f.a}</Text> : null}
          </Pressable>
        ))}
        <Button label="Escribir a soporte" icon="mail-outline" variant="secondary" style={{ marginTop: space.md }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: colors.border },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  q: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.verde },
});
