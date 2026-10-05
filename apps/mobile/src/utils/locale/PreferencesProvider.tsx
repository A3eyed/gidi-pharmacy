import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { useAuth } from '@/utils/auth/useAuth';
import { authFetch } from '@/utils/auth/getSession';
import { setFormattingLocale } from '@/utils/format';
import { DEFAULT_COUNTRY, currencyForCountry } from '@/utils/locale/countries';
import { DARK, LIGHT, setActivePalette, type Palette } from '@/utils/locale/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'gidi.preferences';
const BUNDLE_KEY = 'gidi.i18n.';

/** Shipped English strings so the UI is never blank before the fetch lands. */
const EN: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  sales: 'Sales',
  analytics: 'Analytics',
  reports: 'Reports',
  azara: 'Azara AI',
  knowledge: 'Knowledge',
  staff: 'Staff',
  settings: 'Settings',
  signIn: 'Sign in',
  signOut: 'Sign out',
  createAccount: 'Create an account',
  tagline: 'Track inventory, record sales, and see your top performing medications.',
  createNew: 'Create New',
  joinExisting: 'Join Existing',
  createPharmacy: 'Create Pharmacy',
  joinPharmacy: 'Join Pharmacy',
  pharmacyName: 'Pharmacy name',
  enterCode: 'Enter your pharmacy invitation code',
  joinedSuccess: "You've successfully joined {name}.",
  invalidCode:
    'Invalid or expired pharmacy code. Please check the code with your pharmacy administrator.',
  cancel: 'Cancel',
  appearance: 'Appearance',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  region: 'Region & Language',
  country: 'Country',
  language: 'Language',
  currency: 'Currency',
  save: 'Save',
  saved: 'Saved',
  loading: 'Loading…',
  admin: 'Admin',
  staffRole: 'Staff',
  team: 'Team',
  joinCode: 'Pharmacy join code',
  copied: 'Copied',
};

export type LanguageOption = { code: string; name: string; native: string; rtl?: boolean };

type Preferences = { theme: ThemeMode; country: string; language: string };

const DEFAULTS: Preferences = { theme: 'system', country: DEFAULT_COUNTRY, language: 'en' };

type ContextValue = Preferences & {
  resolvedTheme: 'light' | 'dark';
  colors: Palette;
  currency: string;
  locale: string;
  languages: LanguageOption[];
  setTheme: (theme: ThemeMode) => void;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const PreferencesContext = createContext<ContextValue | null>(null);

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return ctx;
}

/** Shortcut for screens that only need colours. */
export function useTheme() {
  return usePreferences().colors;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const systemScheme = useColorScheme();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [bundle, setBundle] = useState<Record<string, string>>(EN);
  const [languages, setLanguages] = useState<LanguageOption[]>([
    { code: 'en', name: 'English', native: 'English' },
  ]);

  // 1. Restore saved preferences from the device
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          setPrefs({
            theme: parsed.theme ?? DEFAULTS.theme,
            country: parsed.country ?? DEFAULTS.country,
            language: parsed.language ?? DEFAULTS.language,
          });
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // 2. Once signed in, the account copy wins so web and mobile stay in sync
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await authFetch('/api/preferences');
        if (!response.ok) {
          throw new Error(
            `When fetching /api/preferences, the response was [${response.status}] ${response.statusText}`
          );
        }
        const data = await response.json();
        if (cancelled || !data.preferences) return;
        const next: Preferences = {
          theme: data.preferences.theme ?? DEFAULTS.theme,
          country: data.preferences.country ?? DEFAULTS.country,
          language: data.preferences.language ?? DEFAULTS.language,
        };
        setPrefs(next);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // 3. Load the translation bundle for the chosen language (cached on device)
  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${BUNDLE_KEY}${prefs.language}`;

    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached && !cancelled) {
          const parsed = JSON.parse(cached);
          setBundle({ ...EN, ...parsed.bundle });
          if (parsed.languages) setLanguages(parsed.languages);
        }
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await fetch(`/api/i18n?lang=${encodeURIComponent(prefs.language)}`);
        if (!response.ok) {
          throw new Error(
            `When fetching /api/i18n, the response was [${response.status}] ${response.statusText}`
          );
        }
        const data = await response.json();
        if (cancelled) return;
        setBundle({ ...EN, ...data.bundle });
        if (Array.isArray(data.languages)) setLanguages(data.languages);
        AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ bundle: data.bundle, languages: data.languages })
        ).catch(() => {});
      } catch (error) {
        // Offline is fine — we keep the cached or built-in English strings.
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [prefs.language]);

  const persist = useCallback(
    (next: Preferences) => {
      setPrefs(next);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((error) =>
        console.error(error)
      );
      if (isAuthenticated) {
        authFetch('/api/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        }).catch((error) => console.error(error));
      }
    },
    [isAuthenticated]
  );

  const resolvedTheme: 'light' | 'dark' =
    prefs.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : prefs.theme;

  const colors = resolvedTheme === 'dark' ? DARK : LIGHT;
  const currency = currencyForCountry(prefs.country);
  const locale = `${prefs.language}-${prefs.country}`;

  // Keep the module-level helpers in sync before children render
  setActivePalette(colors);
  setFormattingLocale(locale, currency);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let value = bundle[key] ?? EN[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [bundle]
  );

  const value = useMemo<ContextValue>(
    () => ({
      ...prefs,
      resolvedTheme,
      colors,
      currency,
      locale,
      languages,
      t,
      setTheme: (theme) => persist({ ...prefs, theme }),
      setCountry: (country) => persist({ ...prefs, country }),
      setLanguage: (language) => persist({ ...prefs, language }),
    }),
    [prefs, resolvedTheme, colors, currency, locale, languages, t, persist]
  );

  /**
   * Children stay mounted for the life of the app. Preferences flow through
   * context, so every screen re-renders (and re-formats) on a locale or theme
   * change — remounting here would tear down the navigator mid-session and
   * leave a blank screen.
   */
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
