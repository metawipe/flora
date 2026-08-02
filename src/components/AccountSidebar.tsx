"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/LocaleProvider";

const LINKS = [
  { href: "/account", labelKey: "account.navCabinet" },
  { href: "/account/profile", labelKey: "account.navProfile" },
  { href: "/account/orders", labelKey: "account.navOrders" },
  { href: "/favorites", labelKey: "account.navFavorites" },
  { href: "/faq", labelKey: "account.navHelp" },
] as const;

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="account-sidebar">
      <ul className="account-sidebar__list">
        {LINKS.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/account" && pathname.startsWith(link.href));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`account-sidebar__link${active ? " is-active" : ""}`}
              >
                {t(link.labelKey)}
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" className="account-sidebar__link">
            {t("account.logout")}
          </button>
        </li>
      </ul>
    </aside>
  );
}
