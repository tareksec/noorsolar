"use client";

import React from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

interface HeroTextRevealProps {
  /** Full headline text. Split on whitespace only — words (including Bangla script with ZWJ/ZWNJ sequences) are never broken apart. */
  text: string;
  /** Extra class applied to each word wrapper (e.g. for accent coloring specific words — prefer styling via children instead). */
  wordClassName?: string;
  /** Delay before the first word starts, in seconds (default: 0.15). */
  delay?: number;
  className?: string;
}

/**
 * Load-triggered word-by-word hero headline reveal (fade + slide-up).
 *
 * - SSR-safe: server HTML contains the fully visible text (no opacity:0 in markup,
 *   so LCP is instant). The hidden state is applied imperatively in an isomorphic
 *   layout effect before first paint, then words animate in via animation controls.
 * - Bangla-safe: splits on whitespace runs only; each word keeps its internal
 *   shaping (vowel signs, hasant conjuncts, ZWJ/ZWNJ) intact, and whitespace is
 *   rendered as real text nodes so line-breaking behaves exactly like plain text.
 * - No layout shift: words occupy their final layout boxes at all times; only
 *   transform/opacity animate.
 * - Respects prefers-reduced-motion: renders the text immediately, fully visible.
 */
export function HeroTextReveal({
  text,
  wordClassName = "",
  delay = 0.15,
  className = "",
}: HeroTextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  // Split into words + whitespace runs so spacing/wrapping matches plain text exactly.
  // Precomputed once: each word carries its stable animation index (no mutation during render).
  const parts = React.useMemo(() => {
    const out: Array<{ key: number; word: string; index: number } | { key: number; gap: string }> = [];
    let wordIndex = -1;
    for (const chunk of text.split(/(\s+)/)) {
      if (chunk === "") continue;
      if (/^\s+$/.test(chunk)) {
        out.push({ key: out.length, gap: chunk });
      } else {
        wordIndex += 1;
        out.push({ key: out.length, word: chunk, index: wordIndex });
      }
    }
    return out;
  }, [text]);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

  useIsomorphicLayoutEffect(() => {
    if (shouldReduceMotion) return;
    controls.set("hidden");
    void controls.start("visible");
  }, [controls, shouldReduceMotion, text]);

  if (shouldReduceMotion) {
    return (
      <span className={className}>
        <span className="hero-word-inner">{text}</span>
      </span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {parts.map((part) => {
        if ("gap" in part) {
          // Whitespace runs render as plain text — never animated, never wrapped.
          return <React.Fragment key={part.key}>{part.gap}</React.Fragment>;
        }
        return (
          <span
            key={part.key}
            aria-hidden="true"
            className={`inline-block ${wordClassName}`.trim()}
          >
            <motion.span
              className="hero-word-inner inline-block will-change-transform"
              variants={{
                hidden: { opacity: 0, y: motionTokens.distance.sm },
                visible: { opacity: 1, y: 0 },
              }}
              initial={false}
              animate={controls}
              transition={{
                duration: 0.6,
                delay: delay + part.index * motionTokens.stagger.fast,
                ease: motionTokens.ease.expoOut,
              }}
            >
              {part.word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
