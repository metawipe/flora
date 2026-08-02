"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";

export function CookieBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem("loveflowers-cookies");
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    window.localStorage.setItem("loveflowers-cookies", "1");
    setVisible(false);
  };

  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <div className="cookie__top">
        <p className="cookie__title">{t("cookie.title")}</p>
        <button
          className="cookie__close"
          aria-label={t("common.close")}
          onClick={accept}
        >
          ×
        </button>
      </div>
      <p className="cookie__text">
        {t("cookie.bodyBefore")}{" "}
        <a href="/privacy">{t("cookie.policy")}</a> {t("cookie.bodyMid")}{" "}
        <a href="/privacy">{t("cookie.cookies")}</a>.
      </p>
      <button type="button" className="cookie__ok" onClick={accept}>
        {t("cookie.ok")}
      </button>
    </div>
  );
}
