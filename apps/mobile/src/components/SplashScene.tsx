import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePreferences } from '@/utils/locale/PreferencesProvider';

const LETTERS = ['G', 'i', 'D', 'i'];

/** Spells GiDi in the center of the screen. Background follows the resolved theme. */
export default function SplashScene({ onDone }: { onDone: () => void }) {
  const { colors } = usePreferences();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(true);
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
          Animated.timing(fade, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
            setOpen(false);
            onDone();
          });
        }, 180);
      }
    }, 80);
    return () => clearInterval(tick);
  }, [fade, onDone]);

  return (
    <Modal visible={open} animationType="none" statusBarTranslucent transparent={false}>
      <Animated.View style={[styles.screen, { backgroundColor: colors.bg, opacity: fade }]}>
        <Text style={[styles.word, { color: colors.text }]}>{LETTERS.slice(0, count).join('')}</Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  word: { fontFamily: 'Inter_600SemiBold', fontSize: 56, letterSpacing: -1, textAlign: 'center' },
});
