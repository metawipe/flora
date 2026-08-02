"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/data/products";

function telegramHref() {
  return site.socials.find((s) => s.name.toLowerCase().includes("telegram"))
    ?.href;
}

export function MessengerFab() {
  const pathname = usePathname();
  const hide =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/product/");

  if (hide) return null;

  const tg = telegramHref();
  if (!tg) return null;

  return (
    <div className="messenger-fab" aria-label="Messengers">
      <a
        href={tg}
        target="_blank"
        rel="noreferrer"
        className="messenger-fab__btn messenger-fab__btn--tg"
        aria-label="Telegram"
      >
        <Image
          src="/icons/telegram.png"
          alt=""
          width={26}
          height={26}
          className="messenger-fab__icon"
        />
      </a>
    </div>
  );
}
