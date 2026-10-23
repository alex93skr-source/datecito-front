import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FocusStatusBar } from '../../components/FocusStatusBar';
import { Logo } from '../../components/Brand';
import { Button } from '../../components/ui';
import { colors, fonts, space, type } from '../../theme';

// Imagen incluida en la app: carga al instante y funciona sin internet.
const hero = require('../../../assets/welcome.jpg');

export default function Welcome() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.verde }}>
      <FocusStatusBar style="light" />
      <Image source={hero} style={styles.hero} contentFit="cover" contentPosition="bottom" />
      <LinearGradient
        colors={['rgba(15,61,50,0.35)', 'rgba(15,61,50,0)', 'rgba(15,61,50,0.15)', colors.verde]}
        locations={[0, 0.25, 0.5, 0.66]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <Logo light size={30} />
        <View style={{ gap: space.lg }}>
          <Text style={styles.title}>De match{'\n'}a datecito.</Text>
          <Text style={styles.copy}>Tu próximo datecito puede empezar con un hola. Conoce personas con intención y armen un plan que sí se antoje.</Text>
          <View style={{ gap: space.md, marginTop: space.sm }}>
            <Button label="Crear mi cuenta" onPress={() => router.push('/register')} />
            <Button label="Ya tengo cuenta" variant="light" onPress={() => router.push('/login')} />
          </View>
          <Pressable onPress={() => router.push('/terms')}>
            <Text style={styles.legal}>
              Al continuar confirmas que tienes 18 años o más y aceptas nuestros <Text style={styles.legalLink}>Términos y Aviso de privacidad</Text>.
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // La foto ocupa la parte superior y se ancla abajo: las siluetas quedan sobre el título.
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: '68%' },
  safe: { flex: 1, justifyContent: 'space-between', padding: space.xl, paddingTop: space.lg },
  title: { ...type.display, fontSize: 44, lineHeight: 48, color: colors.crema },
  copy: { ...type.body, fontSize: 16, lineHeight: 24, color: 'rgba(249,243,236,0.88)' },
  legal: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: 'rgba(249,243,236,0.7)', textAlign: 'center' },
  legalLink: { fontFamily: fonts.bold, color: colors.crema },
});
