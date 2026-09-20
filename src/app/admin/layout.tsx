import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/lib/env";
import "../globals.css";

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
  title: "Admin Panel | Noor Solar Energy",
  robots: { index: false, follow: false },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#E4E7E4] text-[#111311] antialiased selection:bg-[#CEF23E] selection:text-[#111311]">
        {children}
      </body>
    </html>
  );
}
