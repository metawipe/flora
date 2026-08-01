"use client";

import { useState, type ReactNode } from "react";
import { useStore } from "@/context/StoreContext";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";
import { SearchOverlay } from "./SearchOverlay";
import { Ticker } from "./Ticker";

export function SiteShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, favCount } = useStore();

  return (
    <>
      <ScrollToTop />
      <Header
        onSearch={() => setSearchOpen(true)}
        cartCount={cartCount}
        favCount={favCount}
      />
      <Ticker />
      {children}
      <Footer />
      <CookieBanner />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
