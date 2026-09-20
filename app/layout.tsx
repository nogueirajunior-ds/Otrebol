import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SITE_URL } from "@/lib/config";
import { pt } from "@/lib/i18n/pt";
import "./globals.css";

// Two clearly distinct families: an elegant, high-contrast serif for headlines (architectural,
// editorial) and a clean geometric sans for everything functional. Both cover PT/ES accents.
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pt.meta.title,
  description: pt.meta.description,
  openGraph: {
    title: pt.meta.title,
    description: pt.meta.description,
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US", "es_ES"],
    siteName: "Otrebol",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A365D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
