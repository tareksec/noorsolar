import { Inter, JetBrains_Mono, Hind_Siliguri } from "next/font/google";

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

// Self-hosted Bengali font through next/font/google (weights 400, 500, 600, 700 only)
export const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});
