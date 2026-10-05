'use client';

import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSession } from '@/lib/auth-client';
import { setFormattingLocale } from '@/utils/format';
import { DEFAULT_COUNTRY, currencyForCountry } from '@/utils/locale/countries';
import { RTL_LANGUAGES, translate, type TranslationKey } from '@/utils/locale/translations';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'gidi.preferences';

type Preferences = {
  theme: ThemeMode;
  country: string;
  language: string;
};

const DEFAULTS: Preferences = {
  theme: 'system',
  country: DEFAULT_COUNTRY,
  language: 'en',
};

type PreferencesContextValue = Preferences & {
  /** 'light' | 'dark' after resolving 'system' against the OS setting. */
  resolvedTheme: 'light' | 'dark';
  currency: string;
  locale: string;
  isRTL: boolean;
  setTheme: (theme: ThemeMode) => void;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return ctx;
}

/** Convenience hook for components that only need translations. */
export function useT() {
  return usePreferences().t;
}

function readStored(): Preferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme ?? DEFAULTS.theme,
      country: parsed.country ?? DEFAULTS.country,
      language: parsed.language ?? DEFAULTS.language,
    };
  } catch {
    return null;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [systemDark, setSystemDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 1. Load from localStorage (instant, works signed-out and offline)
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setPrefs(stored);
    }
    setHydrated(true);
  }, []);

  // 2. Track the OS colour scheme for 'system' mode
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(query.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // 3. Once signed in, the server copy wins so preferences follow the account
  //    across devices (web <-> mobile).
  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/preferences');
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  const persist = useCallback(
    (next: Preferences) => {
      setPrefs(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error(error);
      }
      if (session?.user) {
        fetch('/api/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        }).catch((error) => console.error(error));
      }
    },
    [session?.user]
  );

  const resolvedTheme: 'light' | 'dark' =
    prefs.theme === 'system' ? (systemDark ? 'dark' : 'light') : prefs.theme;

  const currency = currencyForCountry(prefs.country);
  const locale = `${prefs.language}-${prefs.country}`;
  const isRTL = RTL_LANGUAGES.has(prefs.language);

  // 4. Apply theme + direction to the document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
    root.setAttribute('lang', prefs.language);
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [resolvedTheme, prefs.language, isRTL]);

  // Set formatting during render so children format with the right locale on
  // their very first paint (no flash of the wrong currency).
  setFormattingLocale(locale, currency);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(prefs.language, key, vars),
    [prefs.language]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      resolvedTheme,
      currency,
      locale,
      isRTL,
      t,
      setTheme: (theme) => persist({ ...prefs, theme }),
      setCountry: (country) => persist({ ...prefs, country }),
      setLanguage: (language) => persist({ ...prefs, language }),
    }),
    [prefs, resolvedTheme, currency, locale, isRTL, t, persist]
  );

  // Remounting on locale change guarantees every screen re-formats its
  // currency, dates and labels — including pages that don't read this context.
  const remountKey = hydrated ? `${prefs.language}-${prefs.country}` : 'initial';

  return (
    <PreferencesContext.Provider value={value}>
      <Fragment key={remountKey}>{children}</Fragment>
    </PreferencesContext.Provider>
  );
}
