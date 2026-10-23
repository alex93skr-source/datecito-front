import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius, space } from '../theme';
import { IconName } from './ui';

export type SheetAction = { label: string; icon: IconName; onPress: () => void; danger?: boolean };

/** Hoja inferior de acciones (Alert en Android sólo admite 3 botones). */
export function ActionSheet({ visible, title, subtitle, actions, onClose }: { visible: boolean; title?: string; subtitle?: string; actions: SheetAction[]; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.handle} />
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={{ marginTop: space.sm }}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceAlt }]}
              onPress={() => {
                onClose();
                // Espera a que la hoja se cierre: abrir cámara/galería sobre un Modal falla en Android.
                setTimeout(a.onPress, 250);
              }}
            >
              <View style={[styles.icon, a.danger && { backgroundColor: '#FCE8E8' }]}>
                <Ionicons name={a.icon} size={19} color={a.danger ? colors.danger : colors.verde} />
              </View>
              <Text style={[styles.label, a.danger && { color: colors.danger }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,61,50,0.45)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.bg, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: space.lg, paddingTop: space.md },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.arena, marginBottom: space.md },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.verde, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, paddingHorizontal: space.sm, borderRadius: radius.md },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.semibold, fontSize: 16, color: colors.verde },
  cancel: { marginTop: space.sm, height: 52, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
});
