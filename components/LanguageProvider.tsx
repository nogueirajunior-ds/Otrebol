"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, dictionaries, type Dictionary, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "otrebol:locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * PT-BR is always the initial state (server and first client render agree, so no hydration
 * mismatch). A previously chosen language is restored right after mount.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (LOCALES as string[]).includes(saved)) setLocaleState(saved as Locale);
    } catch {
      /* storage unavailable (private mode): keep default */
    }
  }, []);

  // Keep <html lang>, <title> and meta description in sync with the active language.
  useEffect(() => {
    const dict = dictionaries[locale];
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
    document.title = dict.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dict.meta.description);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale, t: dictionaries[locale] }), [locale, setLocale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
