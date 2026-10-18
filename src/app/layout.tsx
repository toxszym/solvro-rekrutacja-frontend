import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

// Wyrazisty grotesk do nagłówków i logo. Tekst zostaje w spokojnym Geist.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shaker – przepisy na koktajle",
    template: "%s · Shaker",
  },
  description:
    "Shaker to zbiór przepisów na koktajle: szukaj po nazwie, filtruj i odkładaj ulubione na później.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes dodaje klasę motywu do <html> przed hydratacją.
    // data-scroll-behavior="smooth": przy zmianie strony Next na chwilę wyłącza płynne
    // przewijanie (scroll-smooth), więc nowa strona otwiera się od samej góry. Bez tego
    // animacja nie zdąży dojechać do góry i Next przewija tylko do początku treści strony.
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />
          <main className="page-container flex-1 py-8 sm:py-10">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
