import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import { Providers } from "./providers";
import BottomNav from "@/components/BottomNav";
import AppInstallBanner from "@/components/AppInstallBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "LifeDeal Yvelines — Bons plans & offres locales",
  description: "Découvrez les meilleures offres locales en Yvelines : restaurants, spa, beauté, artisans, plombiers et plus encore. Économisez jusqu'à -70% avec LifeDeal Yvelines.",
  keywords: ["bons plans", "yvelines", "offres locales", "deals", "restaurants", "spa", "beauté", "plombiers", "78"],
  authors: [{ name: "LifeDeal" }],
  openGraph: {
    title: "LifeDeal Yvelines — Bons plans & offres locales",
    description: "Découvrez les meilleures offres locales en Yvelines. Économisez jusqu'à -70% avec LifeDeal.",
    url: "https://yvelines.life",
    siteName: "LifeDeal Yvelines",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeDeal Yvelines — Bons plans & offres locales",
    description: "Découvrez les meilleures offres locales en Yvelines. Économisez jusqu'à -70%.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://yvelines.life" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${fredoka.variable} font-sans antialiased`}>
        <Providers>
          <AppInstallBanner />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
