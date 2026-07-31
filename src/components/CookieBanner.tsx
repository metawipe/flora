"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem("uzflora-cookies");
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    window.localStorage.setItem("uzflora-cookies", "1");
    setVisible(false);
  };

  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <div className="cookie__top">
        <p className="cookie__title">Используем куки</p>
        <button className="cookie__close" aria-label="Закрыть" onClick={accept}>
          ×
        </button>
      </div>
      <p className="cookie__text">
        Чтобы сайт работал лучше. Подробнее в{" "}
        <a href="/privacy">политике</a> использования{" "}
        <a href="/privacy">файлов куки</a>.
      </p>
      <button type="button" className="cookie__ok" onClick={accept}>
        OK
      </button>
    </div>
  );
}
