import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeDeal Yvelines — Bons plans & offres locales",
  description: "Découvrez les meilleures offres locales en Yvelines : restaurants, spa, beauté, artisans, plombiers et plus encore. Économisez jusqu'à -70% avec LifeDeal Yvelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
