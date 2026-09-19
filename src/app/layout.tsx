import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Noor Solar Energy — Solar Panels, Batteries & Inverters",
    template: "%s | Noor Solar Energy",
  },
  description:
    "Direct importer and bulk supplier of Tier-1 Solar Panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
  keywords: [
    "Solar Panels Bangladesh",
    "Lithium Battery Bangladesh",
    "Solar Inverter Bangladesh",
    "Noor Solar Energy",
    "B2B Solar Importer",
  ],
  authors: [{ name: "Noor Solar Energy" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Noor Solar Energy — Solar Panels, Batteries & Inverters",
    description:
      "Direct importer and bulk supplier of Tier-1 Solar Panels, Lithium-ion Batteries, and Solar Inverters in Bangladesh.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#E4E7E4] text-[#111311] antialiased selection:bg-[#CEF23E] selection:text-[#111311]">
        {children}
      </body>
    </html>
  );
}
