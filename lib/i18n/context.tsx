"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import arTranslations from "./translations/ar.json";
import enTranslations from "./translations/en.json";

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

interface TranslationContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, unknown>> = {
  ar: arTranslations,
  en: enTranslations,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if not found
    }
  }

  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [mounted, setMounted] = useState(false);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("nabd_locale") as Locale | null;
    if (savedLocale && (savedLocale === "ar" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  // Update document direction when locale changes
  useEffect(() => {
    if (mounted) {
      const dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("nabd_locale", newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(translations[locale], key);
  }, [locale]);

  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  // Prevent hydration mismatch by not rendering children until mounted
  if (!mounted) {
    return null;
  }

  return (
    <TranslationContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a LanguageProvider");
  }
  return context;
}
