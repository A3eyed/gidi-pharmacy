/**
 * Themed drop-in replacements for React Native primitives.
 *
 * Why this exists
 * ---------------
 * GiDi is a strictly two-tone app, and dark mode is a precise inversion of the
 * light palette. Screens were written with literal hex colours inline. Rather
 * than hand-editing every literal on every screen (which is how colours get
 * missed), these wrappers map any known palette colour found in a `style` prop
 * through the active theme at render time.
 *
 * Usage: import { View, Text, TouchableOpacity, ... } from '@/components/Themed'
 * instead of from 'react-native'. Everything else about the component — props,
 * refs, behaviour — is unchanged.
 *
 * Colours that are NOT part of the palette are passed through untouched, so a
 * deliberate one-off colour still works.
 */
import { forwardRef, useMemo } from 'react';
import {
  ActivityIndicator as RNActivityIndicator,
  FlatList as RNFlatList,
  Modal as RNModal,
  Pressable as RNPressable,
  RefreshControl as RNRefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import KeyboardAvoidingAnimatedViewBase from '@/components/KeyboardAvoidingAnimatedView';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import { DARK, LIGHT } from '@/utils/locale/theme';

/** Every colour used across the mobile screens, light value -> palette key. */
const PALETTE_KEYS = {
  '#FFFFFF': 'bg',
  '#ffffff': 'bg',
  '#FAFAFA': 'subtle',
  '#F5F5F5': 'divider',
  '#E5E5E5': 'border',
  '#D4D4D4': 'borderStrong',
  '#A3A3A3': 'placeholder',
  '#737373': 'textMuted',
  '#404040': 'textSoft',
  '#262626': 'border',
  '#171717': 'divider',
  '#000000': 'text',
  '#000': 'text',
  '#fff': 'bg',
} as const;

type PaletteKey = (typeof PALETTE_KEYS)[keyof typeof PALETTE_KEYS];

/**
 * Light-mode colours map straight to the palette key. In dark mode the palette
 * itself is inverted, so the same lookup produces the inverted colour.
 */
function mapColor(value: string, dark: boolean): string {
  const key = PALETTE_KEYS[value as keyof typeof PALETTE_KEYS] as PaletteKey | undefined;
  if (!key) return value;
  return (dark ? DARK : LIGHT)[key];
}

const COLOR_PROPS = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderEndColor',
  'shadowColor',
  'textDecorationColor',
  'textShadowColor',
  'tintColor',
  'placeholderTextColor',
]);

function mapStyleObject(style: Record<string, unknown>, dark: boolean) {
  let changed = false;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    if (COLOR_PROPS.has(key) && typeof value === 'string') {
      const mapped = mapColor(value, dark);
      next[key] = mapped;
      if (mapped !== value) changed = true;
    } else {
      next[key] = value;
    }
  }
  return changed ? next : style;
}

/** Recursively maps colours inside a style prop (object, array, or nested). */
function mapStyle(style: unknown, dark: boolean): unknown {
  if (!style) return style;
  if (Array.isArray(style)) {
    return style.map((entry) => mapStyle(entry, dark));
  }
  if (typeof style === 'object') {
    return mapStyleObject(style as Record<string, unknown>, dark);
  }
  // Registered StyleSheet IDs (numbers) are left alone.
  return style;
}

function useDark() {
  return usePreferences().resolvedTheme === 'dark';
}

/** Wraps a component so its `style` prop is theme-mapped. */
function themed<P extends { style?: unknown }>(Component: React.ComponentType<P>, name: string) {
  const Wrapped = forwardRef<unknown, P>((props, ref) => {
    const dark = useDark();
    const style = useMemo(() => mapStyle(props.style, dark), [props.style, dark]);
    return <Component {...(props as P)} style={style} ref={ref as never} />;
  });
  Wrapped.displayName = `Themed(${name})`;
  return Wrapped as unknown as React.ComponentType<P>;
}

export const View = themed(RNView, 'View');
export const Text = themed(RNText, 'Text');
export const ScrollView = themed(RNScrollView, 'ScrollView');
export const TouchableOpacity = themed(RNTouchableOpacity, 'TouchableOpacity');
export const Pressable = themed(RNPressable, 'Pressable');
// Cast back to the original component type so generic <ItemT> inference
// (renderItem's `item`) still works at call sites.
export const FlatList = themed(RNFlatList, 'FlatList') as unknown as typeof RNFlatList;
export const Modal = themed(RNModal, 'Modal');

/**
 * TextInput additionally maps `placeholderTextColor`, which is a top-level
 * prop rather than a style key.
 */
export const TextInput = forwardRef<RNTextInput, React.ComponentProps<typeof RNTextInput>>(
  (props, ref) => {
    const dark = useDark();
    const style = useMemo(() => mapStyle(props.style, dark), [props.style, dark]);
    const placeholderTextColor = props.placeholderTextColor
      ? mapColor(String(props.placeholderTextColor), dark)
      : undefined;
    const selectionColor = props.selectionColor
      ? mapColor(String(props.selectionColor), dark)
      : undefined;
    return (
      <RNTextInput
        {...props}
        ref={ref}
        style={style as never}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
      />
    );
  }
);
TextInput.displayName = 'Themed(TextInput)';

/** ActivityIndicator takes `color` as a prop. */
export const ActivityIndicator = (props: React.ComponentProps<typeof RNActivityIndicator>) => {
  const dark = useDark();
  const color = props.color ? mapColor(String(props.color), dark) : undefined;
  return <RNActivityIndicator {...props} color={color} />;
};

/** RefreshControl takes `tintColor` / `colors` as props. */
export const RefreshControl = (props: React.ComponentProps<typeof RNRefreshControl>) => {
  const dark = useDark();
  const tintColor = props.tintColor ? mapColor(String(props.tintColor), dark) : undefined;
  const colors = props.colors?.map((c) => mapColor(String(c), dark));
  return <RNRefreshControl {...props} tintColor={tintColor} colors={colors} />;
};

/**
 * Status bar that always contrasts with the active theme. Screens can still
 * override by passing an explicit `style`.
 */
export const StatusBar = (props: React.ComponentProps<typeof ExpoStatusBar>) => {
  const dark = useDark();
  return <ExpoStatusBar {...props} style={props.style ?? (dark ? 'light' : 'dark')} />;
};

/** Keyboard-avoiding wrapper with theme-mapped styles (no ref forwarding). */
export const KeyboardAvoidingAnimatedView = (
  props: React.ComponentProps<typeof KeyboardAvoidingAnimatedViewBase>
) => {
  const dark = useDark();
  const style = mapStyle(props.style, dark);
  return <KeyboardAvoidingAnimatedViewBase {...props} style={style as never} />;
};

/**
 * Maps a single colour for props that are not styles — e.g. lucide icon
 * `color`, or chart stroke colours.
 */
export function useThemedColor() {
  const dark = useDark();
  return useMemo(() => (value: string) => mapColor(value, dark), [dark]);
}
