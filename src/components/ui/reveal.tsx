"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Y displacement in pixels (default: 24) */
  y?: number;
  /** X displacement in pixels (default: 0) */
  x?: number;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Initial delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Easing curve (default: [0.16, 1, 0.3, 1] custom smooth expoOut) */
  ease?: [number, number, number, number] | readonly [number, number, number, number] | string;
  /** Whether to animate only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport intersection amount (default: 0.15) */
  amount?: number | "some" | "all";
  /** HTML tag or component to render as (default: "div") */
  as?:
    | "div"
    | "section"
    | "article"
    | "header"
    | "footer"
    | "span"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "ul"
    | "ol"
    | "li";
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Reusable scroll-reveal wrapper component.
 * Smoothly fades in and slides up elements as they enter the viewport.
 * Automatically respects prefers-reduced-motion for accessibility.
 */
export function Reveal({
  children,
  className = "",
  y = 24,
  x = 0,
  duration = 0.6,
  delay = 0,
  ease = motionTokens.ease.expoOut,
  once = true,
  amount = 0.15,
  as: Component = "div",
  style,
  id,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = Component as any;
    return (
      <Tag id={id} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionComponent = (motion as any)[Component] || motion.div;

  return (
    <MotionComponent
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease,
      }}
    >
      {children}
    </MotionComponent>
  );
}

export interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger interval between child items in seconds (default: 0.08) */
  stagger?: number;
  /** Alias for stagger (in seconds) */
  staggerDelay?: number;
  /** Delay before group sequence begins in seconds (default: 0) */
  delay?: number;
  /** Whether to animate only once (default: true) */
  once?: boolean;
  /** Viewport amount (default: 0.15) */
  amount?: number | "some" | "all";
  as?: "div" | "section" | "article" | "header" | "footer" | "ul" | "ol";
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Container for staggered child reveals (e.g., grids of cards or lists of items).
 * Children wrapped in <RevealItem> cascade sequentially as the container enters the viewport.
 */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
  staggerDelay,
  delay = 0,
  once = true,
  amount = 0.15,
  as: Component = "div",
  style,
  id,
}: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveStagger = staggerDelay !== undefined ? staggerDelay : stagger;

  if (shouldReduceMotion) {
    const Tag = Component as any;
    return (
      <Tag id={id} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionComponent = (motion as any)[Component] || motion.div;

  return (
    <MotionComponent
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: effectiveStagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
  ease?: [number, number, number, number] | readonly [number, number, number, number] | string;
  as?: "div" | "article" | "li" | "span";
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Child item inside a <RevealGroup>. Staggers in automatically when parent enters view.
 */
export function RevealItem({
  children,
  className = "",
  y = 24,
  x = 0,
  duration = 0.6,
  ease = motionTokens.ease.expoOut,
  as: Component = "div",
  style,
  id,
}: RevealItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = Component as any;
    return (
      <Tag id={id} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionComponent = (motion as any)[Component] || motion.div;

  return (
    <MotionComponent
      id={id}
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration,
            ease,
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Convenient alias for Reveal
 */
export const FadeInWhenVisible = Reveal;
