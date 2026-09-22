"use client";

import React from "react";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

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
