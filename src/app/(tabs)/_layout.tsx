import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconName, tap } from '../../components/ui';
import { homeFor, useSession } from '../../store/Session';
import { colors, fonts } from '../../theme';

const tabs: { name: string; title: string; icon: IconName; iconOn: IconName }[] = [
  { name: 'discover', title: 'Descubrir', icon: 'heart-outline', iconOn: 'heart' },
  { name: 'here', title: 'Aquí y ahora', icon: 'radio-outline', iconOn: 'radio' },
  { name: 'matches', title: 'Conexiones', icon: 'chatbubble-ellipses-outline', iconOn: 'chatbubble-ellipses' },
  { name: 'profile', title: 'Perfil', icon: 'person-circle-outline', iconOn: 'person-circle' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { status, me } = useSession();

  // Sin sesión, sin verificar, con perfil incompleto o sin membresía: no se entra a las pestañas.
  if (status !== 'signedIn' || !me) return <Redirect href="/welcome" />;
  const home = homeFor(me);
  if (home === '/membership') return <Redirect href={{ pathname: '/membership', params: { gate: '1' } }} />;
  if (home !== '/discover') return <Redirect href={home} />;

  return (
    <Tabs
      screenListeners={{ tabPress: () => tap() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.coralStrong,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 11, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? t.iconOn : t.icon} size={24} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
