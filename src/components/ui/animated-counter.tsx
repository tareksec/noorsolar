"use client";

import React, { useRef, useEffect } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { prefersReducedMotion, motionTokens } from "@/lib/motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  decimals?: number;
  className?: string;
}

/**
 * Scroll-triggered count-up number.
 *
 * - Triggers once when scrolled into view, using the same controlled
 *   `useInView` pattern as `Reveal` (never `whileInView`, avoiding the
 *   SSR/hydration mismatch it caused there).
 * - SSR renders the final value immediately: no layout shift, no empty box,
 *   and crawlers/JS-disabled clients still see the real number.
 * - Only the numeric part animates; prefix/suffix stay fixed.
 * - ease-out (power2.out): fast start that settles slowly.
 * - prefers-reduced-motion: final number shown immediately, no counting.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hookReduceMotion = useReducedMotion();
  // Once-only trigger: mirrors reveal.tsx (amount + negative bottom margin so
  // the count starts just before the number is fully on screen).
  const isInView = useInView(spanRef, {
    once: true,
    amount: 0.4,
    margin: "0px 0px -40px 0px",
  });

  const finalText = `${prefix || ""}${value.toFixed(decimals)}${suffix || ""}`;

  useEffect(() => {
    const el = spanRef.current;
    if (!el || typeof window === "undefined") return;
    if (!isInView) return;

    if (hookReduceMotion || prefersReducedMotion()) {
      el.innerText = finalText;
      return;
    }

    const counter = { val: 0 };
    let rafId = 0;
    const durationMs = motionTokens.duration.countUp * 1000;
    const start = performance.now();

    // Ease-out cubic: fast start, settles slowly (matches power2.out feel
    // without pulling GSAP into this component's bundle path).
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      counter.val = value * eased;
      el.innerText = `${prefix || ""}${counter.val.toFixed(decimals)}${suffix || ""}`;
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        el.innerText = finalText;
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, prefix, suffix, decimals, finalText, hookReduceMotion]);

  return (
    <span
      ref={spanRef}
      className={className}
      data-motion="stat-counter"
    >
      {finalText}
    </span>
  );
}
