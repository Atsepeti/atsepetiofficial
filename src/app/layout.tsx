import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lilita_One, Sora } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin-ext"],
  variable: "--font-lilita",
});

const sora = Sora({
  subsets: ["latin-ext"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "At Sepeti — At mı istiyorsun? 30 dakikada kapında!",
  description:
    "Türkiye'nin ilk ve tek at e-ticaret platformu. Atını seç, sepete ekle, 30 dakikada kapında. Kargo ücretsiz çünkü at kendi yürüyor.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${lilita.variable} ${sora.variable}`}>
      <body className="texture-noise bg-cream font-sans text-ink antialiased">
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
