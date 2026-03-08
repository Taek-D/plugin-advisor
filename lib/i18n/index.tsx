"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale, Translations } from "./types";
import { ko } from "./ko";
import { en } from "./en";

const dictionaries: Record<Locale, Translations> = { ko, en };

type I18nContextType = {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType>({
  locale: "ko",
  t: ko,
  setLocale: () => {},
});

const STORAGE_KEY = "plugin-advisor-locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === "ko" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
