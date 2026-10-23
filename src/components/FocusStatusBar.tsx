import { useFocusEffect } from 'expo-router';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { useCallback, useState } from 'react';

/**
 * Barra de estado que sólo aplica mientras la pantalla está visible.
 * Evita que una pantalla oscura deje los íconos blancos en las siguientes.
 */
export function FocusStatusBar({ style }: { style: StatusBarStyle }) {
  const [focused, setFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  return focused ? <StatusBar style={style} /> : null;
}
