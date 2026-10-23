import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { basicQuestions, emojiFor, interestCatalog, sportTeams, TEAMS_PER_SPORT, withEmoji } from '../data/mock';
import { colors, fonts, radius, space } from '../theme';
import { Caption, Chip } from './ui';

const drinkOptions = basicQuestions.find((q) => q.key === 'drink')?.options ?? [];
const PREVIEW = 8;

type Props = {
  interests: string[];
  onInterests: (next: string[]) => void;
  teams: Record<string, string[]>;
  onTeams: (next: Record<string, string[]>) => void;
  /** Si se pasa, muestra "¿Y tú tomas?" junto a Bebidas (se guarda en Lo básico). */
  drink?: string;
  onDrink?: (value: string | undefined) => void;
  max?: number;
};

/** Intereses por categoría, con equipos para los deportes elegidos. */
export function InterestPicker({ interests, onInterests, teams, onTeams, drink, onDrink, max = 10 }: Props) {
  const toggle = (interest: string) => {
    if (interests.includes(interest)) {
      onInterests(interests.filter((i) => i !== interest));
      // Si deja el deporte, también se quitan sus equipos.
      if (teams[interest]) {
        const { [interest]: _removed, ...rest } = teams;
        onTeams(rest);
      }
    } else if (interests.length < max) {
      onInterests([...interests, interest]);
    }
  };

  return (
    <View style={{ gap: space.lg }}>
      {interestCatalog.map((cat) => (
        <View key={cat.title} style={{ gap: space.sm }}>
          <Text style={styles.cat}>
            {cat.emoji} {cat.title}
          </Text>
          <View style={styles.wrap}>
            {cat.items.map((i) => (
              <Chip key={i} label={withEmoji(i)} selected={interests.includes(i)} onPress={() => toggle(i)} />
            ))}
          </View>

          {cat.title === 'Bebidas' && onDrink ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>¿Y tú tomas?</Text>
              <View style={styles.wrap}>
                {drinkOptions.map((o) => (
                  <Chip key={o} label={o} selected={drink === o} onPress={() => onDrink(drink === o ? undefined : o)} />
                ))}
              </View>
            </View>
          ) : null}

          {cat.title === 'Deportes'
            ? Object.keys(sportTeams)
                .filter((sport) => interests.includes(sport))
                .map((sport) => (
                  <TeamPicker key={sport} sport={sport} selected={teams[sport] ?? []} onChange={(list) => onTeams({ ...teams, [sport]: list })} />
                ))
            : null}
        </View>
      ))}
      <Caption>
        {interests.length}/{max} intereses seleccionados
      </Caption>
    </View>
  );
}

function TeamPicker({ sport, selected, onChange }: { sport: string; selected: string[]; onChange: (list: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const leagues = sportTeams[sport];
  const total = leagues.reduce((n, l) => n + l.teams.length, 0);
  // Cerrado: los equipos elegidos más los primeros de la primera liga.
  const preview = [...selected, ...leagues[0].teams.filter((t) => !selected.includes(t))].slice(0, Math.max(PREVIEW, selected.length));

  const toggle = (team: string) =>
    onChange(selected.includes(team) ? selected.filter((t) => t !== team) : selected.length < TEAMS_PER_SPORT ? [...selected, team] : selected);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{emojiFor(sport)} ¿A qué equipo le vas?</Text>
      <Caption>Opcional · hasta {TEAMS_PER_SPORT}</Caption>
      {open ? (
        leagues.map((l) => (
          <View key={l.league} style={{ gap: space.xs }}>
            <Text style={styles.league}>{l.league}</Text>
            <View style={styles.wrap}>
              {l.teams.map((t) => (
                <Chip key={t} label={t} selected={selected.includes(t)} onPress={() => toggle(t)} />
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.wrap}>
          {preview.map((t) => (
            <Chip key={t} label={t} selected={selected.includes(t)} onPress={() => toggle(t)} />
          ))}
        </View>
      )}
      {total > PREVIEW ? (
        <Pressable onPress={() => setOpen(!open)} hitSlop={8}>
          <Text style={styles.more}>{open ? 'Ver menos' : `Ver todos los equipos (${total})`}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cat: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  card: { gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.verde },
  league: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted },
  more: { fontFamily: fonts.bold, fontSize: 13, color: colors.coralStrong },
});
