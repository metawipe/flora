import type { Metadata, Viewport } from "next";
import { Golos_Text, Outfit } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Доставка цветов в Ташкенте | Love Flowers",
  description:
    "Заказать свежие букеты, розы, корзины, коробки и подарки с круглосуточной доставкой по Ташкенту. Love Flowers — бесплатная доставка, работаем 24/7.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Love Flowers",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golos.variable} ${outfit.variable}`}>
      <body>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  );
}
