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
