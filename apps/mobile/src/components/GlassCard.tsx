import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePreferences } from '@/utils/locale/PreferencesProvider';

type Props = {
  children: ReactNode;
  /** `gold` tints the panel with the accent colour for emphasis. */
  tone?: 'plain' | 'gold' | 'strong';
  style?: ViewStyle;
  radius?: number;
  padding?: number;
};

/**
 * Frosted glass surface used across the mobile app.
 *
 * A real blur sits behind a translucent fill and a hairline border, which is
 * what gives the panels depth in both light and dark mode. The blur is skipped
 * on web, where the CSS `backdrop-filter` in the web build already handles it
 * and the native BlurView is expensive.
 */
export default function GlassCard({
  children,
  tone = 'plain',
  style,
  radius = 16,
  padding = 16,
}: Props) {
  const { colors, resolvedTheme } = usePreferences();
  const isDark = resolvedTheme === 'dark';

  const fill =
    tone === 'gold' ? colors.goldSoft : tone === 'strong' ? colors.glassStrong : colors.glass;
  const borderColor = tone === 'gold' ? colors.goldLine : colors.glassBorder;

  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor,
          backgroundColor: fill,
          shadowColor: '#000000',
          shadowOpacity: isDark ? 0.4 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 2,
        },
        style,
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={Platform.OS === 'android' ? 60 : 40}
          tint={isDark ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={{ padding }}>{children}</View>
    </View>
  );
}
