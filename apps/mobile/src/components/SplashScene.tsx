import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePreferences } from '@/utils/locale/PreferencesProvider';

const LETTERS = ['G', 'i', 'D', 'i'];

/** Spells GiDi one letter at a time, with a light tap for each letter. */
export default function SplashScene({ onDone }: { onDone: () => void }) {
  const { colors } = usePreferences();
  const [count, setCount] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let step = 0;
    const tick = setInterval(() => {
      step += 1;
      setCount(step);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      if (step >= LETTERS.length) {
        clearInterval(tick);
        setTimeout(() => done.current(), 420);
      }
    }, 280);
    return () => clearInterval(tick);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text style={[styles.word, { color: colors.text }]}>{LETTERS.slice(0, count).join('')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  word: { fontFamily: 'Inter_600SemiBold', fontSize: 56, letterSpacing: -1 },
});
