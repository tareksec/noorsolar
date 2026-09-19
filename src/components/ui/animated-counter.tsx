"use client";

import React, { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@/lib/gsap";

interface AnimatedCounterProps {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = spanRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.innerText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { val: 0 };

        gsap.to(counter, {
          val: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            el.innerText = `${prefix || ""}${counter.val.toFixed(decimals)}${suffix || ""}`;
          },
          onComplete: () => {
            el.innerText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;
          },
        });
      });
    },
    { scope: spanRef, dependencies: [value, prefix, suffix, decimals] }
  );

  return (
    <span ref={spanRef} className={className}>
      {prefix || ""}
      {value.toFixed(decimals)}
      {suffix || ""}
    </span>
  );
}