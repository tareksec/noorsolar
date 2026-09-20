"use client";

import React from "react";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

interface HeaderProps {
  phoneDisplay?: string;
  phoneRaw?: string;
}

export function Header({
  phoneDisplay = "+880 1700-000000",
  phoneRaw = "+8801700000000",
}: HeaderProps) {
  return (
    <AnimatedNavFramer
      brandName="Noor Solar"
      ctaText="Book A Call"
      ctaHref="/#quote-section"
    />
  );
}
