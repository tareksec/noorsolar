"use client";

import React from "react";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

interface HeaderProps {
  phoneDisplay?: string;
  phoneRaw?: string;
  showBlog?: boolean;
}

export function Header({
  showBlog = false,
}: HeaderProps) {
  return (
    <AnimatedNavFramer
      brandName="Noor Solar"
      ctaText="Book A Call"
      ctaHref="/#quote-section"
      showBlog={showBlog}
    />
  );
}
