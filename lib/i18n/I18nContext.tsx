"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  LOCALE_STORAGE_KEY,
  type Dictionary,
  type Locale,
} from "@/lib/i18n/types";

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  isHydrated: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string): value is Locale {
  return value === "en" || value === "ru" || value === "kk";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) {
      setLocaleState(stored);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, isHydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
      isHydrated,
    }),
    [locale, setLocale, isHydrated]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
