"use client";

import React, { useRef, useEffect } from "react";
import { prefersReducedMotion, motionTokens } from "@/lib/motion";

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

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    if (prefersReducedMotion()) {
      el.innerText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          import("@/lib/gsap").then(({ gsap }) => {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: value,
              duration: motionTokens.duration.countUp,
              ease: "power2.out",
              onUpdate: () => {
                if (el) {
                  el.innerText = `${prefix || ""}${counter.val.toFixed(decimals)}${suffix || ""}`;
                }
              },
              onComplete: () => {
                if (el) {
                  el.innerText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;
                }
              },
            });
          });
        }
      },
      { rootMargin: "60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, prefix, suffix, decimals]);

  return (
    <span
      ref={spanRef}
      className={className}
      data-motion="stat-counter"
    >
      {prefix || ""}
      {value.toFixed(decimals)}
      {suffix || ""}
    </span>
  );
}