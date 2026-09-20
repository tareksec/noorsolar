import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/lib/env";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Noor Solar Energy — Solar Panels, Batteries & Inverters",
    template: "%s | Noor Solar Energy",
  },
  description:
    "Direct importer and bulk supplier of solar panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
  keywords: [
    "Solar Panels Bangladesh",
    "Lithium Battery Bangladesh",
    "Solar Inverter Bangladesh",
    "Noor Solar Energy",
    "B2B Solar Importer",
  ],
  authors: [{ name: "Noor Solar Energy" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Noor Solar Energy — Solar Panels, Batteries & Inverters",
    description:
      "Direct importer and bulk supplier of solar panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
    type: "website",
    locale: "en_BD",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Noor Solar Energy" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "#preloader{display:none!important}" }} />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if (sessionStorage.getItem("noor-preloader-seen") === "1" || new URLSearchParams(location.search).get("preloader") === "off") document.documentElement.dataset.preloader = "skip"; } catch (_) {}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#E4E7E4] text-[#111311] antialiased selection:bg-[#CEF23E] selection:text-[#111311]">
        {children}
      </body>
    </html>
  );
}
