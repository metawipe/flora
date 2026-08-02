import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Доставка цветов в Ташкенте | Zamin Gullari",
  description:
    "Заказать свежие букеты, розы, корзины, коробки и подарки с круглосуточной доставкой по Ташкенту. Zamin Gullari — бесплатная доставка, работаем 24/7.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zamin Gullari",
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
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  );
}
