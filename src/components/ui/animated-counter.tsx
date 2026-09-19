"use client";

import React, { useRef, useEffect } from "react";

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.innerText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;
      return;
    }

    // Load GSAP dynamically only when component mounts in browser
    import("@/lib/gsap").then(({ gsap }) => {
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
  }, [value, prefix, suffix, decimals]);

  return (
    <span ref={spanRef} className={className}>
      {prefix || ""}
      {value.toFixed(decimals)}
      {suffix || ""}
    </span>
  );
}