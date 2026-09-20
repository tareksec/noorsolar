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

  // Determine current locale from prop or pathname
  const isBn = currentLocale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const activeLocale = isBn ? "bn" : "en";

  // Build target paths while preserving query params
  const queryString = searchParamsString ? `?${searchParamsString}` : "";

  // Strip /bn from pathname to get base path
  let basePath = pathname;
  if (basePath.startsWith("/bn")) {
    basePath = basePath.slice(3);
    if (!basePath.startsWith("/")) {
      basePath = "/" + basePath;
    }
    if (!basePath) basePath = "/";
  }

  // English URL is always unprefixed
  const enHref = `${basePath}${queryString}`;

  // Bangla URL
  let bnHref: string;
  // If viewing a blog post without Bangla translation, redirect to the blog list /bn/blog
  if (basePath.startsWith("/blog/") && !hasBanglaContent) {
    bnHref = `/bn/blog${queryString}`;
  } else {
    bnHref = basePath === "/" ? `/bn${queryString}` : `/bn${basePath}${queryString}`;
  }

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
      className={`relative inline-flex items-center p-1 rounded-full bg-[#111311]/5 border border-[#111311]/10 text-xs font-mono select-none ${className}`}
    >
      {/* English Pill */}
      <a
        href={enHref}
        hrefLang="en"
        lang="en"
        aria-label="Switch to English language"
        aria-current={activeLocale === "en" ? "true" : undefined}
        onClick={() => setLocaleCookie("en")}
        className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
          activeLocale === "en"
            ? "text-[#111311]"
            : "text-[#5C605C] hover:text-[#111311]"
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
            className="absolute inset-0 z-[-1] rounded-full bg-[#CEF23E] shadow-xs"
          />
        )}
        <span>EN</span>
      </a>

      {/* Bangla Pill */}
      <a
        href={bnHref}
        hrefLang="bn"
        lang="bn"
        aria-label="Switch to Bangla language"
        aria-current={activeLocale === "bn" ? "true" : undefined}
        onClick={() => setLocaleCookie("bn")}
        className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
          activeLocale === "bn"
            ? "text-[#111311]"
            : "text-[#5C605C] hover:text-[#111311]"
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
            className="absolute inset-0 z-[-1] rounded-full bg-[#CEF23E] shadow-xs"
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
