/**
 * This file is customizable BUT — do not remove:
 *   • `<AuthModal />` render (shipped v2 auth modal; removing it breaks
 *     signin/signup since useAuth().signIn() only flips state, not render)
 *   • `useAuth().initiate()` + `isReady` gate (loads persisted session from
 *     SecureStore — removing causes user to appear signed-out on app launch)
 *
 * Safe to change: the Stack routes, QueryClient config, splash behavior, the
 * wrapping providers, or to add nested providers around <Stack>.
 */
'use client';

import { ErrorBoundary } from '@/__create/ErrorBoundary';
import { useAuth } from '@/utils/auth/useAuth';
import { AuthModal } from '@/utils/auth/useAuthModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider, usePreferences } from '@/utils/locale/PreferencesProvider';
import SplashScene from '@/components/SplashScene';
void SplashScreen.preventAutoHideAsync();

const SPLASH_TIMEOUT_MS = 10_000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Lives inside PreferencesProvider so it can read the resolved theme and keep
 * the navigator background in step with it.
 */
function ThemedShell() {
  const { colors } = usePreferences();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack
        // `(tabs)` owns the dashboard. app/index.tsx only redirects there.
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <AuthModal />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), SPLASH_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  const fontsReady = fontsLoaded || !!fontsError;

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  if ((!isReady || !fontsReady) && !timedOut) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PreferencesProvider>
            <ThemedShell />
            {showIntro ? <SplashScene onDone={() => setShowIntro(false)} /> : null}
          </PreferencesProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
