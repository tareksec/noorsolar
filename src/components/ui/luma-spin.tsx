"use client";

import React from "react";
import Image from "next/image";

export interface LumaSpinProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size in pixels (default: 65) */
  size?: number;
  /** Color theme variant: 'brand' (Noor Solar emerald + energy gold), 'emerald', 'solar', or 'neutral' (original gray) */
  variant?: "brand" | "emerald" | "solar" | "neutral";
  /** Whether to show website logo/icon in the center of the spinner */
  showLogo?: boolean;
  /** Custom logo source (default: '/logo/icon.png') */
  logoSrc?: string;
}

export const Component = ({
  size = 65,
  variant = "brand",
  showLogo = true,
  logoSrc = "/logo/icon.png",
  className = "",
  style,
  ...props
}: LumaSpinProps) => {
  const offset = Math.round((size * 35) / 65);
  const logoSize = Math.max(16, Math.round(size * 0.38));

  // Variant color shadows (Noor Solar website theme)
  const variantStyles = {
    brand: {
      pill1: "shadow-[#108958] dark:shadow-[#22C55E]",
      pill2: "shadow-[#EAB308] dark:shadow-[#CEF23E]",
    },
    emerald: {
      pill1: "shadow-[#108958] dark:shadow-[#22C55E]",
      pill2: "shadow-[#0d6e46] dark:shadow-[#16a34a]",
    },
    solar: {
      pill1: "shadow-[#EAB308] dark:shadow-[#FACC15]",
      pill2: "shadow-[#F59E0B] dark:shadow-[#CEF23E]",
    },
    neutral: {
      pill1: "shadow-gray-800 dark:shadow-gray-100",
      pill2: "shadow-gray-800 dark:shadow-gray-100",
    },
  }[variant];

  return (
    <div
      className={`relative aspect-square flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {/* Primary Pill */}
      <span
        className={`absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] transition-colors duration-300 ${variantStyles.pill1}`}
      />

      {/* Secondary Pill with offset phase */}
      <span
        className={`absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] transition-colors duration-300 ${variantStyles.pill2}`}
      />

      {/* Website Logo / Icon in the center */}
      {showLogo && (
        <div
          className="relative z-10 flex items-center justify-center rounded-full pointer-events-none select-none transition-transform duration-300 animate-pulse"
          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
        >
          <Image
            src={logoSrc}
            alt="Noor Solar"
            width={logoSize}
            height={logoSize}
            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(16,137,88,0.25)]"
            priority={false}
          />
        </div>
      )}

      {/* Scoped Keyframe Animation */}
      <style>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 ${offset}px ${offset}px 0;
          }
          12.5% {
            inset: 0 ${offset}px 0 0;
          }
          25% {
            inset: ${offset}px ${offset}px 0 0;
          }
          37.5% {
            inset: ${offset}px 0 0 0;
          }
          50% {
            inset: ${offset}px 0 0 ${offset}px;
          }
          62.5% {
            inset: 0 0 0 ${offset}px;
          }
          75% {
            inset: 0 0 ${offset}px ${offset}px;
          }
          87.5% {
            inset: 0 0 ${offset}px 0;
          }
          100% {
            inset: 0 ${offset}px ${offset}px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </div>
  );
};

export const LumaSpin = Component;
export default Component;
