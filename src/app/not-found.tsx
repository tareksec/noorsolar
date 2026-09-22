import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { NotFoundIllustration } from "@/components/illustrations/not-found-illustration";
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

export default function NotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#F7F8F5] text-[#17251F] antialiased">
        <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border border-[#DCE4E0] text-center shadow-xl">
            <Image
              src="/brand/logo-icon.png"
              alt="Noor Solar Energy"
              width={48}
              height={48}
              className="mx-auto mb-5 h-12 w-12 object-contain"
            />
            <NotFoundIllustration className="w-48 h-40 mx-auto mb-4" />

            <span className="text-xs font-mono font-bold text-[#FEBE16] bg-[#052F25] px-3 py-1 rounded-full">
              ERROR 404
            </span>

            <h1 className="text-2xl font-bold text-[#074031] mt-4 mb-2">
              Page or Equipment Not Found
            </h1>

            <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-8">
              The page or product specification you requested could not be located or may have been updated.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#FEBE16] text-[#052F25] text-xs font-bold hover:bg-[#E4A900] transition-colors shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-full bg-[#F1F4F1] text-[#074031] text-xs font-semibold hover:bg-[#DCE4E0] transition-colors border border-[#DCE4E0]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
