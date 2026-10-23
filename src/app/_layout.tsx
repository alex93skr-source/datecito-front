import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito-sans';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { trackScreen } from '../api/analytics';
import { SessionProvider, useSession } from '../store/Session';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <SplashGate>
          <ScreenTracker />
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="match" options={{ presentation: 'transparentModal', animation: 'fade' }} />
            <Stack.Screen name="superlike" options={{ presentation: 'transparentModal', animation: 'fade' }} />
            <Stack.Screen name="filters" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="plan/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="safety/fake-call" options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false }} />
          </Stack>
        </SplashGate>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

/** Registra cada pantalla vista para el CRM (sólo con sesión iniciada). */
function ScreenTracker() {
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'loading') trackScreen(pathname);
  }, [pathname, status]);

  return null;
}

/** Mantiene el splash hasta saber si hay sesión, para no mostrar pantallas equivocadas. */
function SplashGate({ children }: { children: ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync().catch(() => {});
  }, [status]);

  if (status === 'loading') return null;
  return <>{children}</>;
}
