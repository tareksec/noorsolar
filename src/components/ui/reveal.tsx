"use client";

import React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Y displacement in pixels (default: 28) */
  y?: number;
  /** X displacement in pixels (default: 0) */
  x?: number;
  /** Animation duration in seconds (default: 0.65) */
  duration?: number;
  /** Initial delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Easing curve (default: [0.16, 1, 0.3, 1] custom smooth expoOut) */
  ease?: [number, number, number, number] | readonly [number, number, number, number] | string;
  /** Whether to animate only once when entering viewport (default: true) */
  once?: boolean;
  /** Viewport intersection amount (default: 0.1) */
  amount?: number | "some" | "all";
  /** Viewport root margin (default: "0px 0px -40px 0px") */
  margin?: any;
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
  y = 28,
  x = 0,
  duration = 0.65,
  delay = 0,
  ease = motionTokens.ease.expoOut,
  once = true,
  amount = 0.1,
  margin = "0px 0px -40px 0px",
  as: Component = "div",
  style,
  id,
}: RevealProps) {
  const ref = React.useRef<any>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once, amount: amount as any, margin });

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
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
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

interface RevealGroupContextValue {
  isInView: boolean;
  stagger: number;
  baseDelay: number;
  getItemIndex: () => number;
}

const RevealGroupContext = React.createContext<RevealGroupContextValue | null>(null);

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
  /** Viewport amount (default: 0.1) */
  amount?: number | "some" | "all";
  /** Viewport root margin (default: "0px 0px -40px 0px") */
  margin?: any;
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
  amount = 0.1,
  margin = "0px 0px -40px 0px",
  as: Component = "div",
  style,
  id,
}: RevealGroupProps) {
  const ref = React.useRef<any>(null);
  const shouldReduceMotion = useReducedMotion();
  const effectiveStagger = staggerDelay !== undefined ? staggerDelay : stagger;
  const isInView = useInView(ref, { once, amount: amount as any, margin });

  const itemIndexRef = React.useRef(0);
  itemIndexRef.current = 0;
  const getItemIndex = React.useCallback(() => {
    const idx = itemIndexRef.current;
    itemIndexRef.current += 1;
    return idx;
  }, []);

  const ctxValue = React.useMemo(() => ({
    isInView,
    stagger: effectiveStagger,
    baseDelay: delay,
    getItemIndex,
  }), [isInView, effectiveStagger, delay, getItemIndex]);

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
    <RevealGroupContext.Provider value={ctxValue}>
      <MotionComponent
        ref={ref}
        id={id}
        className={className}
        style={style}
      >
        {children}
      </MotionComponent>
    </RevealGroupContext.Provider>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
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
  y = 28,
  x = 0,
  duration = 0.65,
  delay: explicitDelay,
  ease = motionTokens.ease.expoOut,
  as: Component = "div",
  style,
  id,
}: RevealItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const groupCtx = React.useContext(RevealGroupContext);
  const ownRef = React.useRef<any>(null);
  const ownInView = useInView(ownRef, { once: true, amount: 0.1, margin: "0px 0px -40px 0px" });

  const isInView = groupCtx ? groupCtx.isInView : ownInView;

  const itemIndex = React.useRef<number | null>(null);
  if (itemIndex.current === null && groupCtx) {
    itemIndex.current = groupCtx.getItemIndex();
  }
  const computedDelay = explicitDelay !== undefined
    ? explicitDelay
    : (groupCtx && itemIndex.current !== null
        ? groupCtx.baseDelay + itemIndex.current * groupCtx.stagger
        : 0);

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
      ref={groupCtx ? undefined : ownRef}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{
        duration,
        delay: computedDelay,
        ease,
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
