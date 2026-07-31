"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Мой кабинет" },
  { href: "/account/profile", label: "Личные данные" },
  { href: "/account/orders", label: "Заказы" },
  { href: "/favorites", label: "Избранные товары" },
  { href: "/faq", label: "Помощь" },
];

export function AccountSidebar() {
  const pathname = usePathname();

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
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" className="account-sidebar__link">
            Выйти
          </button>
        </li>
      </ul>
    </aside>
  );
}
