"use client";

import { useRef, useState, type ReactNode } from "react";
import { useStore } from "@/context/StoreContext";
import { useMobileChrome } from "@/hooks/useMobileChrome";
import { BottomChrome } from "./BottomChrome";
import { CatalogBar } from "./CatalogBar";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Preloader } from "./Preloader";
import { ScrollToTop } from "./ScrollToTop";
import { SearchOverlay } from "./SearchOverlay";
import { Ticker } from "./Ticker";

export function SiteShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const { cartCount, favCount, hydrated } = useStore();
  const chromeAway = useMobileChrome(topRef, false);

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <div ref={topRef} className="shell-top shell-rise">
        <Header
          onSearch={() => setSearchOpen(true)}
          cartCount={hydrated ? cartCount : 0}
          favCount={hydrated ? favCount : 0}
        />
        <CatalogBar />
        <Ticker />
      </div>
      <div className="shell-content">{children}</div>
      <div className="shell-rise shell-rise--late">
        <Footer />
      </div>
      <BottomChrome
        visible={chromeAway}
        cartCount={hydrated ? cartCount : 0}
        onSearch={() => setSearchOpen(true)}
      />
      <CookieBanner />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
