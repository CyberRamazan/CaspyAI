import { en } from "@/lib/i18n/dictionaries/en";
import { ru } from "@/lib/i18n/dictionaries/ru";
import { kk } from "@/lib/i18n/dictionaries/kk";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
  kk,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
