import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

const woman = require('../../assets/images/pharmacist-woman.jpg');
const man = require('../../assets/images/pharmacist-man.jpg');

/** Short product intro: two pharmacists pass a phone, Azara answers, a sale is recorded. */
export default function SplashScene({ onDone }: { onDone: () => void }) {
  const womanX = useRef(new Animated.Value(-220)).current;
  const manX = useRef(new Animated.Value(220)).current;
  const answer = useRef(new Animated.Value(0)).current;
  const sale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(womanX, { toValue: -70, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(manX, { toValue: 70, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(answer, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(sale, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(fade, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(onDone);
  }, [answer, fade, manX, onDone, sale, womanX]);

  return (
    <Animated.View style={[styles.screen, { opacity: fade }]}>
      <Text style={styles.mark}>GIDI</Text>
      <View style={styles.stage}>
        <Animated.View style={[styles.person, { transform: [{ translateX: womanX }] }]}>
          <Image source={woman} style={styles.photo} />
          <Animated.View style={[styles.bubble, { opacity: sale, transform: [{ translateY: sale.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
            <Text style={[styles.bubbleText, { color: '#FFFFFF' }]}>Sale recorded</Text>
          </Animated.View>
        </Animated.View>
        <View style={styles.phone}>
          <Text style={styles.phoneLabel}>Azara</Text>
          <Animated.View style={[styles.reply, { opacity: answer, transform: [{ translateY: answer.interpolate({ inputRange: [0, 1], outputRange: [18, -28] }) }, { scale: answer }] }]}>
            <Text style={styles.replyText}>12 in stock. Expires in March.</Text>
          </Animated.View>
        </View>
        <Animated.View style={[styles.person, { transform: [{ translateX: manX }] }]}>
          <Image source={man} style={styles.photo} />
          <View style={styles.ask}>
            <Text style={styles.bubbleText}>Do we have amoxicillin?</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F7F4EE', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  mark: { fontFamily: 'Inter_600SemiBold', letterSpacing: 4, fontSize: 13, color: '#000000', marginBottom: 28 },
  stage: { width: '100%', height: 280, alignItems: 'center', justifyContent: 'center' },
  person: { position: 'absolute', alignItems: 'center' },
  photo: { width: 120, height: 160, borderRadius: 24, backgroundColor: '#EFEAE2' },
  phone: { width: 128, height: 180, borderRadius: 24, backgroundColor: '#111111', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16 },
  phoneLabel: { color: '#FFFFFF', fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 8 },
  reply: { position: 'absolute', top: 36, width: 150, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 8 },
  replyText: { color: '#000000', fontSize: 11, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  ask: { marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 6 },
  bubble: { marginTop: 8, backgroundColor: '#000000', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 6 },
  bubbleText: { color: '#000000', fontSize: 11, fontFamily: 'Inter_500Medium' },
});
