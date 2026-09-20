import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import type { Dictionary, Locale } from "./types";

export * from "./types";

export const dictionaries: Record<Locale, Dictionary> = { pt, en, es };

/** Short, elegant text indicators for the switcher (no emoji flags: they don't render on Windows). */
export const LOCALE_META: Record<Locale, { code: string; name: string; htmlLang: string }> = {
  pt: { code: "PT", name: "Português", htmlLang: "pt-BR" },
  en: { code: "EN", name: "English", htmlLang: "en" },
  es: { code: "ES", name: "Español", htmlLang: "es" },
};
