import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ComponentProps, ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, radius, shadow, space, type } from '../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export const tap = () => Haptics.selectionAsync().catch(() => {});

/* ---------- Layout ---------- */

export function Screen({
  children,
  scroll = false,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
  bg = colors.bg,
  avoidKeyboard = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  bg?: string;
  /** Sube el contenido cuando aparece el teclado (con edge-to-edge Android ya no lo hace solo). */
  avoidKeyboard?: boolean;
}) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: bg }, style]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={avoidKeyboard}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Barra superior con botón de regreso y título centrado. */
export function TopBar({ title, right, onBack }: { title?: string; right?: ReactNode; onBack?: () => void }) {
  return (
    <View style={styles.topBar}>
      <IconButton
        icon="chevron-back"
        label="Volver"
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      />
      <Text style={styles.topTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/* ---------- Texto ---------- */

export const Display = (p: { children: ReactNode; light?: boolean; center?: boolean }) => (
  <Text style={[type.display, p.light && { color: colors.crema }, p.center && { textAlign: 'center' }]}>{p.children}</Text>
);
export const H1 = (p: { children: ReactNode; center?: boolean; style?: object }) => (
  <Text style={[type.h1, p.center && { textAlign: 'center' }, p.style]}>{p.children}</Text>
);
export const H2 = (p: { children: ReactNode; style?: object }) => <Text style={[type.h2, p.style]}>{p.children}</Text>;
export const Body = (p: { children: ReactNode; muted?: boolean; center?: boolean; style?: object }) => (
  <Text style={[type.body, p.muted && { color: colors.muted }, p.center && { textAlign: 'center' }, p.style]}>{p.children}</Text>
);
export const Caption = (p: { children: ReactNode; style?: object; center?: boolean }) => (
  <Text style={[type.caption, p.center && { textAlign: 'center' }, p.style]}>{p.children}</Text>
);
export const Eyebrow = (p: { children: ReactNode; style?: object }) => <Text style={[type.label, p.style]}>{p.children}</Text>;

export function SectionTitle({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={type.h2}>{children}</Text>
      {action ? (
        <Pressable hitSlop={10} onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- Botones ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'light' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={19} color={v.fg} /> : null}
          {/* key: Android no vuelve a medir el texto cuando cambia y lo corta (p. ej. "Ver" en vez de "Ver personas"). */}
          <Text key={label} numberOfLines={1} style={[type.cta, { color: v.fg }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const buttonVariants: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.coralStrong, fg: colors.white, border: colors.coralStrong },
  secondary: { bg: colors.surface, fg: colors.verde, border: colors.verde },
  ghost: { bg: 'transparent', fg: colors.verde, border: 'transparent' },
  dark: { bg: colors.verde, fg: colors.crema, border: colors.verde },
  light: { bg: colors.crema, fg: colors.verde, border: colors.crema },
  danger: { bg: colors.surface, fg: colors.danger, border: '#F1C9C9' },
};

export function IconButton({
  icon,
  onPress,
  label,
  tone = 'plain',
  size = 44,
  badge,
}: {
  icon: IconName;
  onPress?: () => void;
  label: string;
  tone?: 'plain' | 'soft' | 'glass';
  size?: number;
  badge?: boolean;
}) {
  const bg = tone === 'soft' ? colors.surface : tone === 'glass' ? 'rgba(255,255,255,0.9)' : 'transparent';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
        tone === 'soft' && styles.softBorder,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={colors.verde} />
      {badge ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

/* ---------- Formularios ---------- */

export function Field({
  label,
  icon,
  error,
  secure,
  ...props
}: TextInputProps & { label?: string; icon?: IconName; error?: string; secure?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && { borderColor: colors.verde, borderWidth: 1.5 },
          !!error && { borderColor: colors.danger },
          props.multiline && { height: 110, alignItems: 'flex-start', paddingTop: 12 },
        ]}
      >
        {icon ? <Ionicons name={icon} size={18} color={colors.muted} /> : null}
        <TextInput
          placeholderTextColor={colors.subtle}
          {...props}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[styles.input, props.multiline && { textAlignVertical: 'top', height: '100%' }]}
        />
        {secure ? (
          <Pressable hitSlop={10} onPress={() => setHidden(!hidden)} accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={19} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
  tone = 'light',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: 'light' | 'glass';
}) {
  const glass = tone === 'glass';
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        tap();
        onPress?.();
      }}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        glass && styles.chipGlass,
        selected && { backgroundColor: colors.verde, borderColor: colors.verde },
      ]}
    >
      {icon ? <Ionicons name={icon} size={14} color={selected ? colors.crema : glass ? colors.white : colors.verde} /> : null}
      <Text style={[styles.chipText, glass && { color: colors.white }, selected && { color: colors.crema }]}>{label}</Text>
    </Pressable>
  );
}

export function Option({ label, description, selected, onPress, icon }: { label: string; description?: string; selected: boolean; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={() => {
        tap();
        onPress();
      }}
      style={[styles.option, selected && styles.optionOn]}
    >
      {icon ? (
        <View style={[styles.optionIcon, selected && { backgroundColor: colors.coral }]}>
          <Ionicons name={icon} size={18} color={selected ? colors.white : colors.verde} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={type.bodyStrong}>{label}</Text>
        {description ? <Text style={type.caption}>{description}</Text> : null}
      </View>
      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.coralStrong : colors.arena} />
    </Pressable>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tap();
              onChange(o.value);
            }}
            style={[styles.segment, on && styles.segmentOn]}
          >
            <Text style={[styles.segmentText, on && { color: colors.verde }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.progress, i < step && { backgroundColor: colors.coral }]} />
      ))}
    </View>
  );
}

/* ---------- Listas y tarjetas ---------- */

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ListRow({
  icon,
  label,
  value,
  onPress,
  danger,
  right,
  last,
}: {
  icon?: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && { backgroundColor: colors.surfaceAlt }]}
    >
      {icon ? (
        <View style={[styles.rowIcon, danger && { backgroundColor: '#FCE8E8' }]}>
          <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.verde} />
        </View>
      ) : null}
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.subtle} /> : null)}
    </Pressable>
  );
}

/** Fila con interruptor; maneja su propio estado en la maqueta. */
export function ToggleRow({
  icon,
  label,
  description,
  initial = true,
  last,
  value,
  onChange,
}: {
  icon?: IconName;
  label: string;
  description?: string;
  initial?: boolean;
  last?: boolean;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [local, setLocal] = useState(initial);
  const on = value ?? local;
  const setOn = (v: boolean) => (onChange ? onChange(v) : setLocal(v));
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      {icon ? (
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={18} color={colors.verde} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={type.bodyStrong}>{label}</Text>
        {description ? <Text style={type.caption}>{description}</Text> : null}
      </View>
      <Switch value={on} onValueChange={setOn} trackColor={{ true: colors.verde, false: colors.arena }} thumbColor={colors.white} />
    </View>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

export function Avatar({ uri, size = 52, ring }: { uri: string; size?: number; ring?: boolean }) {
  return (
    <View style={ring && { padding: 2.5, borderRadius: size, borderWidth: 2, borderColor: colors.coral }}>
      <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.durazno }} contentFit="cover" transition={200} />
    </View>
  );
}

export function EmptyState({ icon, title, text, action, onAction }: { icon: IconName; title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={30} color={colors.coralStrong} />
      </View>
      <H2 style={{ textAlign: 'center' }}>{title}</H2>
      <Body muted center>
        {text}
      </Body>
      {action ? <Button label={action} onPress={onAction} variant="secondary" style={{ alignSelf: 'stretch', marginTop: space.sm }} /> : null}
    </View>
  );
}

/** Mensaje de error con ícono + texto (nunca sólo color). */
export function ErrorNotice({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View style={[styles.notice, { backgroundColor: '#FCE8E8' }]} accessibilityRole="alert">
      <Ionicons name="alert-circle" size={18} color={colors.danger} />
      <Text style={[type.caption, { color: colors.danger, flex: 1 }]}>{message}</Text>
    </View>
  );
}

/** Pantalla de carga o error mientras llegan datos de la API. */
export function Loading({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md }}>
      {error ? (
        <>
          <ErrorNotice message={error} />
          {onRetry ? <Button label="Intentar otra vez" variant="secondary" onPress={onRetry} /> : null}
        </>
      ) : (
        <ActivityIndicator color={colors.coralStrong} size="large" />
      )}
    </View>
  );
}

export function Notice({ icon = 'shield-checkmark-outline', children }: { icon?: IconName; children: ReactNode }) {
  return (
    <View style={styles.notice}>
      <Ionicons name={icon} size={18} color={colors.verde} />
      <Text style={[type.caption, { color: colors.verde, flex: 1 }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: space.xl, paddingBottom: space.xxxl, gap: space.lg },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.sm },
  topTitle: { ...type.h3, flex: 1, textAlign: 'center' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionAction: { fontFamily: fonts.bold, fontSize: 14, color: colors.coralStrong },
  button: {
    height: 54,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  softBorder: { borderWidth: 1, borderColor: colors.border },
  dot: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.coral, borderWidth: 1.5, borderColor: colors.white },
  fieldLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.verde },
  field: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.text, paddingVertical: 0 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.duraznoSoft,
    borderWidth: 1,
    borderColor: colors.durazno,
  },
  chipGlass: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.verde },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionOn: { borderColor: colors.coral, backgroundColor: '#FFF6F3' },
  optionIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  segmented: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, padding: 3 },
  segment: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill },
  segmentOn: { backgroundColor: colors.surface, ...shadow },
  segmentText: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted },
  progress: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.border },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 14, paddingHorizontal: space.lg },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { ...type.bodyStrong, flex: 1 },
  rowValue: { ...type.caption },
  groupTitle: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.muted, textTransform: 'uppercase', marginLeft: space.xs },
  group: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  empty: { alignItems: 'center', gap: space.md, padding: space.xxl },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.duraznoSoft, alignItems: 'center', justifyContent: 'center' },
  notice: { flexDirection: 'row', gap: space.sm, alignItems: 'center', padding: space.md, borderRadius: radius.md, backgroundColor: '#E6EFEB' },
});
