export const locales = ["ru", "uz", "en"] as const;
export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "zg_locale";
export const LOCALE_STORAGE_KEY = "zg_locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeLabels: Record<Locale, string> = {
  ru: "Русский",
  uz: "Oʻzbekcha",
  en: "English",
};

export const localeCodes: Record<Locale, string> = {
  ru: "RU",
  uz: "UZ",
  en: "EN",
};

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

/** Pick locale from Accept-Language: uz* → uz, en* → en, else ru. */
export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";");
      const q = qPart?.startsWith("q=") ? Number(qPart.slice(2)) : 1;
      return { tag: (tag || "").toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    if (tag.startsWith("uz")) return "uz";
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("ru")) return "ru";
  }

  return DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
  if (locale === "uz") return "uz";
  if (locale === "en") return "en";
  return "ru";
}
