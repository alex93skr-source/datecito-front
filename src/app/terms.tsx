import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { Body, Card, H1, ListRow, Screen, TopBar } from '../components/ui';
import { legalDocs, legalUpdated } from '../lib/legal';
import { space } from '../theme';

/** Índice de documentos legales; el contenido es el mismo que publica datecito.com. */
export default function Terms() {
  return (
    <Screen>
      <TopBar title="Términos y privacidad" />
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.sm, gap: space.lg, paddingBottom: space.xxxl }}>
        <H1>Lo legal, claro.</H1>
        <Body muted>Los mismos documentos que publicamos en datecito.com. Última actualización: {legalUpdated}.</Body>
        <Card style={{ paddingVertical: 0 }}>
          {legalDocs.map((doc, i) => (
            <ListRow
              key={doc.slug}
              icon="document-text-outline"
              label={doc.title}
              onPress={() => router.push({ pathname: '/legal/[slug]', params: { slug: doc.slug } })}
              last={i === legalDocs.length - 1}
            />
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
