import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Blocks } from '../../components/LegalText';
import { Body, EmptyState, H1, Screen, TopBar } from '../../components/ui';
import { legalDoc, legalUpdated } from '../../lib/legal';
import { space, type } from '../../theme';

export default function LegalDocument() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const doc = legalDoc(slug);

  if (!doc) {
    return (
      <Screen>
        <TopBar />
        <EmptyState icon="document-text-outline" title="No encontramos ese documento." text="Vuelve a la lista de documentos legales." />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={{ gap: space.sm }}>
          <H1>{doc.title}</H1>
          <Body muted>Última actualización: {legalUpdated}</Body>
        </View>
        <Blocks blocks={doc.intro} />
        {doc.sections.map((s) => (
          <View key={s.id} style={styles.section}>
            <Text style={type.h2}>{s.h}</Text>
            <Blocks blocks={s.blocks} />
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl },
  section: { gap: space.md, marginTop: space.sm },
});
