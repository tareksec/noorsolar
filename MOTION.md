# MOTION.md — Noor Solar Energy Motion Architecture

This document catalogs the complete motion design layer for Noor Solar Energy, detailing all 16 animation moments, token mappings, library ownership, interaction triggers, and accessibility fallbacks.

## 1. Core Principles

- **Library Ownership**: GSAP + ScrollTrigger controls scroll-driven sequences, pinned sections, and multi-step timelines via `@gsap/react` `useGSAP`. Motion (`motion/react`) controls layout, enter/exit presence, hover springs, and draggable interactions. One library owns each DOM element to avoid style thrashing.
- **Hardware Acceleration**: Only `transform`, `opacity`, and `clip-path` are animated. Layout properties (`width`, `height`, `margin`, `padding`) are never animated during scroll or hover.
- **Instant LCP**: All above-the-fold headline and kicker text is rendered in server-generated HTML without `opacity: 0`. Masked slide-ups and scale reveals enhance the presentation after hydration on desktop.
- **Accessibility & Reduced Motion**: Full compliance with `prefers-reduced-motion: reduce`. When active:
  - Smooth scrolling is disabled (native instant scrolling).
  - Pinned sections unpin and render clean stacked cards.
  - Infinite marquees are paused/static.
  - Counters render final values immediately without counting up.
  - Hover parallax and 3D tilts are disabled.
- **Input Grounding**: Pointer-only effects (3D card tilt, magnetic CTA attraction, custom Drag cursor) only activate on `(pointer: fine)` devices and never hijack touch events.

---

## 2. Motion Tokens (`src/lib/motion.ts`)

All animations reference the centralized tokens in `src/lib/motion.ts`:

| Category | Token | Value | Purpose |
|---|---|---|---|
| **Duration** | `fast` | 0.20s | Micro-interactions, arrows, button states |
| | `base` | 0.40s | Panel transitions, dialog entrances |
| | `slow` | 0.80s | Hero line reveals, section photo entrances |
| | `hero` | 1.20s | Initial hero entrance timeline |
| | `countUp` | 1.80s | Metric counter numeric interpolations |
| | `routeTransition` | 0.25s | Fast non-blocking page navigation |
| **Easing** | `expoOut` | `[0.16, 1, 0.3, 1]` | Framer-style crisp deceleration |
| | `inOutSoft` | `[0.4, 0, 0.2, 1]` | Crossfade and drawer easing |
| | `gsapExpoOut` | `"expo.out"` | GSAP timeline snap easing |
| | `gsapPower2Out` | `"power2.out"` | Smooth count-up and entrance |
| **Springs** | `springQuick` | `{ stiffness: 400, damping: 30 }` | Magnetic button rebound |
| | `springSmooth` | `{ stiffness: 260, damping: 25 }` | Carousel drag momentum |

---

## 3. The 16 Motion Moments Catalog

| # | Moment Name | `data-motion` Selector | Controlling Library | Trigger / Interaction | Reduced Motion Fallback |
|---|---|---|---|---|---|
| 1 | **Smooth Scrolling** | `[data-motion="smooth-scroll"]` | Lenis + GSAP ticker | Wheel / trackpad scroll on desktop `(pointer: fine)` | Native browser scroll, 0ms lag |
| 2a | **Hero Headline Reveal** | `[data-motion="hero-headline"]` | GSAP + Split words | Hydration entrance on desktop | Static text instantly visible in SSR |
| 2b | **Hero Photo Entrance** | `[data-motion="hero-photo"]` | GSAP | Scale 1.15 to 1 entrance + scroll parallax | Static scale 1.0, 0 parallax |
| 2c | **Hero Floating Glass Cards** | `[data-motion="hero-glass"]` | GSAP + CSS translate3d | Staggered settle-in + gentle continuous float | Static layout cards, no floating |
| 2d | **Hero Scroll Parallax** | `[data-motion="hero-parallax"]` | GSAP ScrollTrigger | Scroll position on desktop | 0 parallax offset |
| 3 | **Text Marquee** | `[data-motion="text-marquee"]` | GSAP ScrollTrigger + CSS | Continuous loop; accelerates with scroll velocity; pauses on hover | Static centered pill items |
| 4 | **Statistics Count-Up** | `[data-motion="stat-counter"]` | GSAP numeric tween | IntersectionObserver (once when in view) | Shows final value immediately |
| 5 | **Category Showcase** | `[data-motion="category-panel"]` | CSS Flex + React State | Desktop hover/focus expands panel to flex-2.2, compressing peers; mobile tap | Equal fixed flex columns |
| 6 | **Process Section** | `[data-motion="process-section"]` | GSAP ScrollTrigger + SVG Dash | Masked headline slide-up, staggered circle pop-in, numbered badges, self-drawing curved arrows | Static stacked cards, arrows visible immediately |
| 7 | **Photo Reveals** | `[data-motion="photo-reveal"]` | GSAP ScrollTrigger | Scale reveal (1.15 to 1) on viewport enter + ~8% scroll parallax | Normal image rendering |
| 8 | **Featured Carousel** | `[data-motion="featured-carousel"]` | Motion / Native Drag | Mouse drag with inertia, navigation arrows, custom floating "DRAG ↔" cursor on desktop | Native touch scroll snap |
| 9 | **Product Cards** | `[data-motion="product-card"]` | React State + CSS 3D | Mouse move 3D tilt, arrow swap on hover, "Request quote" slide-in | Static flat card |
| 10a | **Button Slide Fill** | `[data-motion="button-slide"]` | CSS pseudo-elements | Hover/focus fill slide + dual arrow translation swap | Normal solid button |
| 10b | **Magnetic Button** | `[data-motion="magnetic-button"]` | React State / Pointer | Cursor attraction within bounding box on pointer devices | Static button position |
| 11 | **Testimonials Slider** | `[data-motion="testimonials-slider"]` | Motion AnimatePresence | Autoplay crossfade loop (5s), pause on hover/focus, dot/arrow controls | Static presentation without autoplay |
| 12 | **FAQ Accordion** | `[data-motion="faq-accordion"]` | Motion height animate | Accordion button click / Enter / Space / ArrowUp / ArrowDown | Instant expand/collapse |
| 13a | **Closing CTA Headline** | `[data-motion="closing-headline"]` | GSAP ScrollTrigger | Scroll enter (top 85%) slide-up | Fully visible static headline |
| 13b | **Closing CTA Magnetic** | `[data-motion="magnetic-cta"]` | React State / Pointer | Cursor magnetic pull on desktop | Static button |
| 14a | **Header Scroll Behavior** | `[data-motion="header-scroll"]` | React State / CSS | Hide on scroll down (>100px), return on scroll up, compact height | Fixed header |
| 14b | **Mobile Menu Overlay** | `[data-motion="mobile-menu"]` | Motion AnimatePresence | Hamburger toggle with staggered link slide-ins | Instant menu popup |
| 15 | **Route Transitions** | `[data-motion="route-transition"]` | Motion AnimatePresence | Pathname change (<250ms fade/slide) | Instant route display |
| 16a | **Product Gallery** | `[data-motion="product-gallery"]` | Motion / React State | Thumbnail selection, touch swipe, arrow keys | Instant image swap |
| 16b | **Gallery Lightbox** | `[data-motion="lightbox"]` | Motion AnimatePresence | Click main image for modal zoom (1x to 3x) & keyboard Escape | Standard modal |

---

## 4. Regression Testing Protection

The test suite `npm run check:motion` executes in Puppeteer Core to verify:
1. Every `data-motion` element exists on the rendered page.
2. Motion occurs during interaction or scrolling (measuring transforms, opacities, heights, or text value changes across two time/scroll states).
3. Under `prefers-reduced-motion: reduce`, animations are disabled and final content is visible.
