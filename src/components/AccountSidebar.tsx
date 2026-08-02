"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import { isAdminLogin } from "@/lib/adminAccess";
import {
  loadUserProfile,
  logoutAccount,
  refreshSessionProfile,
} from "@/lib/userProfile";

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
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    void (async () => {
      const profile = (await refreshSessionProfile()) ?? loadUserProfile();
      setShowAdmin(
        profile?.role === "admin" || isAdminLogin(profile?.login),
      );
    })();
  }, []);

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
        {showAdmin ? (
          <li>
            <Link
              href="/admin"
              className={`account-sidebar__link${
                pathname.startsWith("/admin") ? " is-active" : ""
              }`}
            >
              {t("account.navAdmin")}
            </Link>
          </li>
        ) : null}
        <li>
          <button
            type="button"
            className="account-sidebar__link"
            onClick={() => {
              void logoutAccount().then(() => {
                window.location.href = "/account";
              });
            }}
          >
            {t("account.logout")}
          </button>
        </li>
      </ul>
    </aside>
  );
}
