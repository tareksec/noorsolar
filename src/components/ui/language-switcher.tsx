"use client";

import React, { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { motionTokens, prefersReducedMotion } from "@/lib/motion";

interface LanguageSwitcherProps {
  currentLocale?: string;
  hasBanglaContent?: boolean;
  className?: string;
  idPrefix?: string;
}

function LanguageSwitcherInner({
  currentLocale,
  hasBanglaContent = true,
  className = "",
  idPrefix = "hdr",
  searchParamsString = "",
}: LanguageSwitcherProps & { searchParamsString?: string }) {
  const pathname = usePathname() || "/";

  // Determine current locale from prop or pathname (Bangla is now default)
  const isBn = currentLocale === "bn" || (!pathname.startsWith("/en/") && pathname !== "/en");
  const activeLocale = isBn ? "bn" : "en";

  // Build target paths while preserving query params
  const queryString = searchParamsString ? `?${searchParamsString}` : "";

  // Strip /en or /bn from pathname to get base path
  let basePath = pathname;
  if (basePath.startsWith("/en")) {
    basePath = basePath.slice(3);
    if (!basePath.startsWith("/")) {
      basePath = "/" + basePath;
    }
    if (!basePath) basePath = "/";
  } else if (basePath.startsWith("/bn")) {
    basePath = basePath.slice(3);
    if (!basePath.startsWith("/")) {
      basePath = "/" + basePath;
    }
    if (!basePath) basePath = "/";
  }

  // Bangla URL is default / unprefixed
  const bnHref = `${basePath}${queryString}`;

  // English URL is prefixed with /en
  const enHref = basePath === "/" ? `/en${queryString}` : `/en${basePath}${queryString}`;

  const setLocaleCookie = (locale: "en" | "bn") => {
    try {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore in environments where document.cookie is unavailable
    }
  };

  const isReduced = prefersReducedMotion();

  return (
    <nav
      data-motion="lang-switch"
      aria-label="Language selector"
      className={`relative inline-flex items-center gap-1.5 p-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono select-none ${className}`}
    >
      {/* English Pill */}
      <a
        href={enHref}
        hrefLang="en"
        lang="en"
        aria-label="EN - Switch to English"
        aria-current={activeLocale === "en" ? "true" : undefined}
        onClick={() => setLocaleCookie("en")}
        className={`relative z-10 min-h-[38px] min-w-[38px] inline-flex items-center justify-center px-3 py-1.5 rounded-full font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] ${
          activeLocale === "en"
            ? "text-[#052F25] font-extrabold"
            : "text-white/80 hover:text-white"
        }`}
      >
        {activeLocale === "en" && (
          <motion.span
            layoutId={`${idPrefix}-lang-indicator`}
            transition={
              isReduced
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: motionTokens.ease.springQuick.stiffness,
                    damping: motionTokens.ease.springQuick.damping,
                  }
            }
            className="absolute inset-0 z-[-1] rounded-full bg-[#FEBE16] shadow-xs"
          />
        )}
        <span>EN</span>
      </a>

      {/* Bangla Pill */}
      <a
        href={bnHref}
        hrefLang="bn"
        lang="bn"
        aria-label="বাংলা - বাংলায় দেখুন (BN)"
        aria-current={activeLocale === "bn" ? "true" : undefined}
        onClick={() => setLocaleCookie("bn")}
        className={`relative z-10 min-h-[38px] min-w-[38px] inline-flex items-center justify-center px-3 py-1.5 rounded-full font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] ${
          activeLocale === "bn"
            ? "text-[#052F25] font-extrabold"
            : "text-white/80 hover:text-white"
        }`}
      >
        {activeLocale === "bn" && (
          <motion.span
            layoutId={`${idPrefix}-lang-indicator`}
            transition={
              isReduced
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: motionTokens.ease.springQuick.stiffness,
                    damping: motionTokens.ease.springQuick.damping,
                  }
            }
            className="absolute inset-0 z-[-1] rounded-full bg-[#FEBE16] shadow-xs"
          />
        )}
        {/* Adapts at narrow width (360px) to prevent any clipping */}
        <span className="hidden min-[380px]:inline">বাংলা</span>
        <span className="inline min-[380px]:hidden">বাং</span>
      </a>
    </nav>
  );
}

function LanguageSwitcherWithParams(props: LanguageSwitcherProps) {
  const searchParams = useSearchParams();
  return <LanguageSwitcherInner {...props} searchParamsString={searchParams?.toString() || ""} />;
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense fallback={<LanguageSwitcherInner {...props} />}>
      <LanguageSwitcherWithParams {...props} />
    </Suspense>
  );
}
