import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, space } from '../theme';
import { Chip } from './ui';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
/** Hasta cuántos meses adelante se puede agendar (igual que el servidor). */
const MONTHS_AHEAD = 3;

/** "2026-10-18" en la hora local del teléfono. */
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Calendario de un mes; los días pasados no se pueden elegir. `marked` pinta un punto (datecitos ya agendados). */
export function CalendarPicker({ value, onChange, marked = [] }: { value: Date | null; onChange: (d: Date) => void; marked?: string[] }) {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1));
  const last = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD, today.getDate());

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // la semana empieza en lunes
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  while (cells.length % 7) cells.push(null);

  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Pressable disabled={!canPrev} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} hitSlop={10} accessibilityLabel="Mes anterior">
          <Ionicons name="chevron-back" size={22} color={canPrev ? colors.verde : colors.border} />
        </Pressable>
        <Text style={styles.month}>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </Text>
        <Pressable disabled={!canNext} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} hitSlop={10} accessibilityLabel="Mes siguiente">
          <Ionicons name="chevron-forward" size={22} color={canNext ? colors.verde : colors.border} />
        </Pressable>
      </View>
      <View style={styles.row}>
        {WEEKDAYS.map((w, i) => (
          <Text key={i} style={styles.weekday}>
            {w}
          </Text>
        ))}
      </View>
      {Array.from({ length: cells.length / 7 }, (_, r) => (
        <View key={r} style={styles.row}>
          {cells.slice(r * 7, r * 7 + 7).map((d, i) => {
            if (!d) return <View key={i} style={styles.cell} />;
            const disabled = d < today || d > last;
            const selected = !!value && dayKey(d) === dayKey(value);
            const isToday = dayKey(d) === dayKey(today);
            return (
              <Pressable
                key={i}
                disabled={disabled}
                onPress={() => onChange(d)}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled }}
                accessibilityLabel={`${d.getDate()} de ${MONTHS[d.getMonth()]}`}
                style={styles.cell}
              >
                <View style={[styles.day, isToday && styles.today, selected && styles.selected]}>
                  <Text style={[styles.dayText, disabled && { color: colors.border }, selected && { color: colors.crema }]}>{d.getDate()}</Text>
                </View>
                {marked.includes(dayKey(d)) ? <View style={[styles.dot, selected && { backgroundColor: colors.verde }]} /> : <View style={styles.dotSpace} />}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** Horas cada 30 min (8:00 a 22:30). Si el día es hoy, sólo a partir de una hora desde ahora. */
export function TimePicker({ date, value, onChange }: { date: Date | null; value: string | null; onChange: (t: string) => void }) {
  const now = new Date();
  const isToday = !!date && dayKey(date) === dayKey(now);
  const minMinutes = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : 0;
  const slots = Array.from({ length: 30 }, (_, i) => 8 * 60 + i * 30).filter((m) => m >= minMinutes);

  if (!slots.length) return <Text style={styles.empty}>Ya es tarde para hoy. Elige otro día.</Text>;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {slots.map((m) => {
        const t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        return <Chip key={t} label={timeLabel(t)} selected={value === t} onPress={() => onChange(t)} />;
      })}
    </ScrollView>
  );
}

/** "18:30" → "6:30 p. m." */
export const timeLabel = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
};

/** Día + hora locales → ISO con zona horaria, para el servidor. */
export const toIso = (date: Date, time: string) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  return `${dayKey(d)}T${pad(h)}:${pad(m)}:00${sign}${pad(tz / 60)}:${pad(tz % 60)}`;
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.md, gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xs, marginBottom: space.xs },
  month: { fontFamily: fonts.bold, fontSize: 16, color: colors.verde },
  row: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 12, color: colors.muted },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  today: { borderWidth: 1.5, borderColor: colors.coral },
  selected: { backgroundColor: colors.verde, borderColor: colors.verde },
  dayText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.coralStrong, marginTop: 2 },
  dotSpace: { height: 7 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
});
