/**
 * Font definitions for Noor Solar Energy.
 * Loaded via CSS @font-face and Google Fonts (@import) in globals.css.
 *
 * This completely avoids next/font/local and next/font/google internal module resolution
 * and PostCSS worker child process crashes (e.g. tirobangla_*.module.css, scoutiesans_*.module.css)
 * under Turbopack in Next.js 16.
 */

export const inter = {
  variable: "font-sans",
  className: "font-sans",
};

export const jetbrainsMono = {
  variable: "font-mono",
  className: "font-mono",
};

export const scoutieSans = {
  variable: "font-display",
  className: "font-display",
};

export const tiroBangla = {
  variable: "font-bengali",
  className: "font-bengali",
};

// Backward compatibility alias for legacy imports
export const hindSiliguri = tiroBangla;
