import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePreferences } from '@/utils/locale/PreferencesProvider';

const LETTERS = ['G', 'i', 'D', 'i'];

/** Spells GiDi quickly. Background follows the resolved theme. */
export default function SplashScene({ onDone }: { onDone: () => void }) {
  const { colors } = usePreferences();
  const [count, setCount] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let step = 0;
    const tick = setInterval(() => {
      step += 1;
      setCount(step);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      if (step >= LETTERS.length) {
        clearInterval(tick);
        setTimeout(() => {
          Animated.timing(fade, { toValue: 0, duration: 180, useNativeDriver: true }).start(onDone);
        }, 220);
      }
    }, 90);
    return () => clearInterval(tick);
  }, [fade, onDone]);

  return (
    <Animated.View style={[styles.screen, { backgroundColor: colors.bg, opacity: fade }]}>
      <View style={styles.row}>
        {LETTERS.slice(0, count).map((letter, index) => (
          <Text key={index} style={[styles.letter, { color: colors.text }]}>
            {letter}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  letter: { fontFamily: 'Inter_600SemiBold', fontSize: 56, letterSpacing: -1 },
});
