"use client";

import { locales, localeCodes } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label={t("lang.label")}>
      {locales.map((code, index) => (
        <span key={code} className="lang-switch__item">
          {index > 0 ? <span className="lang-switch__sep" aria-hidden>|</span> : null}
          <button
            type="button"
            className={`lang-switch__btn${locale === code ? " is-active" : ""}`}
            aria-pressed={locale === code}
            onClick={() => setLocale(code)}
          >
            {localeCodes[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
