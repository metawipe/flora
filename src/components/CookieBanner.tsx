"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";

const COOKIE_KEY = "zamin-cookies";
const LEGACY_COOKIE_KEY = "loveflowers-cookies";

export function CookieBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted =
      window.localStorage.getItem(COOKIE_KEY) ||
      window.localStorage.getItem(LEGACY_COOKIE_KEY);
    if (accepted) {
      if (!window.localStorage.getItem(COOKIE_KEY)) {
        window.localStorage.setItem(COOKIE_KEY, accepted);
      }
      return;
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    window.localStorage.setItem(COOKIE_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="cookie cookie--strip" role="dialog" aria-label="Cookies">
      <p className="cookie__strip-text">
        {t("cookie.title")}.{" "}
        <a href="/privacy">{t("cookie.policy")}</a>
      </p>
      <button type="button" className="cookie__strip-ok" onClick={accept}>
        {t("cookie.ok")}
      </button>
    </div>
  );
}
