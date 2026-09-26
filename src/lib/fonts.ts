import localFont from "next/font/local";

// Inter and JetBrains Mono are loaded via CSS (@import in globals.css)
// This avoids next/font/google internal module resolution failures under Turbopack in Next.js 16.
export const inter = {
  variable: "--font-inter",
  className: "font-sans",
};

export const jetbrainsMono = {
  variable: "--font-jetbrains-mono",
  className: "font-mono",
};

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
