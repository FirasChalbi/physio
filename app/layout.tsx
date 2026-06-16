import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import Script from "next/script";
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
  title: "LifeDeal — Bons plans & offres locales",
  description: "Découvrez les meilleures offres locales en Île-de-France : restaurants, spa, beauté, artisans, plombiers et plus encore. Économisez jusqu'à -70% avec LifeDeal.",
  keywords: ["bons plans", "yvelines", "offres locales", "deals", "restaurants", "spa", "beauté", "plombiers", "78"],
  authors: [{ name: "LifeDeal" }],
  openGraph: {
    title: "LifeDeal — Bons plans & offres locales",
    description: "Découvrez les meilleures offres locales en Île-de-France. Économisez jusqu'à -70% avec LifeDeal.",
    url: "https://life-app.fr",
    siteName: "LifeDeal",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeDeal — Bons plans & offres locales",
    description: "Découvrez les meilleures offres locales en Île-de-France. Économisez jusqu'à -70%.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://life-app.fr" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KHNW844Z');`}
        </Script>
      </head>
      <body className={`${inter.variable} ${fredoka.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KHNW844Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Providers>
          <AppInstallBanner />
          {children}
          <BottomNav />
        </Providers>

        {/* Umami Analytics */}
        <Script
          src="https://umami.srv.tn/script.js"
          data-website-id="c667da64-5209-403a-a378-460f22829832"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
