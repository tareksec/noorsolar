import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500"],
});

// Scoutie Sans variable font from Google Fonts (weights 200..800, normal & italic)
export const scoutieSans = localFont({
  src: [
    {
      path: "../../public/fonts/ScoutieSans[wght].ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/ScoutieSans-Italic[wght].ttf",
      style: "italic",
    },
  ],
  variable: "--font-scoutie",
  display: "swap",
});

// Official Tiro Bangla font from Google Fonts (normal & italic) - Default Bangla Font
export const tiroBangla = localFont({
  src: [
    {
      path: "../../public/fonts/TiroBangla-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TiroBangla-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-bengali",
  display: "swap",
});

// Backward compatibility alias for legacy imports
export const hindSiliguri = tiroBangla;
