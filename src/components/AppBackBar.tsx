"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "./Icons";

type AppBackBarProps = {
  href: string;
  title: string;
  backLabel?: string;
};

export function AppBackBar({ href, title, backLabel }: AppBackBarProps) {
  return (
    <div className="app-back">
      <Link
        href={href}
        className="app-back__link"
        aria-label={backLabel || title}
      >
        <span className="app-back__btn" aria-hidden>
          <ChevronLeftIcon />
        </span>
        <span className="app-back__title">{title}</span>
      </Link>
    </div>
  );
}
