"use client";

import React from "react";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface HeaderProps {
  phoneDisplay?: string;
  phoneRaw?: string;
  showBlog?: boolean;
  currentLocale?: string;
}

export function Header({
  showBlog = false,
  currentLocale,
}: HeaderProps) {
  return (
    <AnimatedNavFramer
      brandName="Noor Solar Energy"
      ctaText={currentLocale === "bn" ? "কোটেশন নিন" : "Request a Quote"}
      ctaHref="/quote"
      showBlog={showBlog}
      currentLocale={currentLocale}
    />
  );
}

export function MobileTopBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(0.5rem+env(safe-area-inset-top,0px))] z-50 flex justify-center px-4 md:hidden">
      <Link
        href="/"
        aria-label="Noor Solar Energy - home"
        className="pointer-events-auto inline-flex items-center rounded-full border border-white/15 bg-[#052F25]/90 px-4 py-2 shadow-[0_8px_24px_rgba(5,47,37,0.4)] backdrop-blur-xl"
      >
        <Image
          src="/brand/logo-white.png"
          alt="Noor Solar Energy"
          width={132}
          height={33}
          priority
          className="h-7 w-auto object-contain"
        />
      </Link>
    </div>
  );
}
