import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import { cookies } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import { StoreProvider } from "@/context/StoreContext";
import {
  DEFAULT_LOCALE,
  htmlLang,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
  display: "swap",
});

const siteTitle = "Цветы и букеты с доставкой в Ташкенте | Zamin Gullari";
const siteDescription =
  "Заказать свежие букеты, VIP-композиции и комнатные растения с доставкой по Ташкенту. Zamin Gullari — поддержка 24/7.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://flora-weld.vercel.app"),
  ),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Zamin Gullari",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Zamin Gullari",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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
  manifest: "/manifest.webmanifest",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const cookieLocale = jar.get(LOCALE_COOKIE)?.value;
  const initialLocale: Locale = isLocale(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE;

  return (
    <html lang={htmlLang(initialLocale)} className={golos.variable}>
      <body>
        <LocaleProvider initialLocale={initialLocale}>
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
