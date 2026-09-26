import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "@/lib/env";
import "../globals.css";

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
      <body suppressHydrationWarning className="min-h-screen bg-[#E4E7E4] text-[#111311] antialiased selection:bg-[#CEF23E] selection:text-[#111311]">
        {children}
      </body>
    </html>
  );
}
