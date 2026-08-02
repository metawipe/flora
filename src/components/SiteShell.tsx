"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/context/StoreContext";
import { BottomChrome } from "./BottomChrome";
import { CatalogBar } from "./CatalogBar";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MessengerFab } from "./MessengerFab";
import { PageTransition } from "./PageTransition";
import { ScrollToTop } from "./ScrollToTop";
import { SearchOverlay } from "./SearchOverlay";
import { ToastStack } from "./ToastStack";
import { Ticker } from "./Ticker";

function footerModeFor(pathname: string): "full" | "compact" | "hidden" {
  if (
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/favorites")
  ) {
    return "compact";
  }
  if (pathname.startsWith("/catalog")) return "compact";
  return "full";
}

function showCatalogBar(pathname: string): boolean {
  if (
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/favorites")
  ) {
    return false;
  }
  return true;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, favCount, hydrated } = useStore();
  const footerMode = footerModeFor(pathname);
  const catalogBar = showCatalogBar(pathname);
  const favs = hydrated ? favCount : 0;
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    document.documentElement.classList.add("is-booting");
    document.documentElement.classList.remove("app-ready");
    const id = window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-booting");
      document.documentElement.classList.add("app-ready");
    });
    return () => {
      window.cancelAnimationFrame(id);
      document.documentElement.classList.remove("is-booting");
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => {
      document.documentElement.classList.toggle("app-dock", mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.documentElement.classList.remove("app-dock");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <div className="shell-top shell-rise">
        <Header
          onSearch={() => setSearchOpen(true)}
          cartCount={hydrated ? cartCount : 0}
          favCount={hydrated ? favCount : 0}
        />
        {catalogBar ? <CatalogBar /> : null}
        <Ticker />
      </div>
      <div
        className={`shell-content${catalogBar ? "" : " shell-content--no-bar"}`}
      >
        <PageTransition>{children}</PageTransition>
      </div>
      <div className="shell-rise shell-rise--late">
        <Footer compact={footerMode === "compact"} />
      </div>
      <BottomChrome
        cartCount={hydrated ? cartCount : 0}
        favCount={favs}
      />
      <MessengerFab />
      <ToastStack />
      <CookieBanner />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
