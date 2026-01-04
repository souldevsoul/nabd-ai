"use client";

import { useTranslationContext } from "./context";
import type { Locale, Direction } from "./context";

interface UseTranslationReturn {
  t: (key: string) => string;
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
}

export function useTranslation(): UseTranslationReturn {
  const { t, locale, dir, setLocale } = useTranslationContext();
  return { t, locale, dir, setLocale };
}
