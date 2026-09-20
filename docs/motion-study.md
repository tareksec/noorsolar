# Motion Study: EnergyPower & Polariyon Reference Analysis

This study evaluates the interaction design and motion choreography of two commercial clean-tech Framer references (`https://energypower.framer.website/` and `https://polariyon.framer.website/`) at desktop (`1440px`) and mobile (`390px`) viewports, formulating the core architectural foundation for Noor Solar Energy's custom motion system.

---

## 1. Reference Analysis: EnergyPower (`https://energypower.framer.website/`)

### Viewport: 1440px Desktop
* **Page Scrolling**: Smooth inertial scroll (Lenis-style damping, duration ~1.0s, lerp 0.08) synced seamlessly with scroll-triggered animations.
* **Header & Navigation**: Fixed floating header with backdrop-filter blur (`blur(16px)`). Hides via `translateY(-100%)` on scroll-down, returns smoothly (`translateY(0%)`, duration 0.35s, `expo.out`) on scroll-up. Compacts padding from 20px to 12px after passing 80px scroll depth.
* **Hero Entrance**:
  * **Trigger**: On load (`window.onload` / hydration).
  * **Headline**: Split into lines/phrases with masked slide-up (`translateY(100% -> 0%)`, duration 1.1s, easing `cubic-bezier(0.16, 1, 0.3, 1)`, stagger 0.12s). Text remains present in server HTML for SEO/LCP.
  * **Hero Image**: Scale-in reveal (`scale(1.15 -> 1.0)`, duration 1.4s, ease `power2.out`), overlaid with subtle scroll parallax (8% speed delta).
  * **Floating Badges**: Enter with 0.15s stagger delay, hovering with subtle continuous CSS floating animation (`translateY(±6px)`).
* **Marquee Band**: Horizontal continuous looping ticker (`SOLAR • INVERTERS • STORAGE`) at 30px/s base speed. Speed increases proportionally with scroll velocity (`deltaY`), and pauses on `:hover`.
* **Statistics Section**: Viewport entrance trigger (`IntersectionObserver`, threshold 0.25). Numbers count up from 0 to target (duration 1.8s, `expo.out`), preserving suffixes (`+`, `%`) and tabular numeral alignment (`tabular-nums`).
* **Process / How It Works**: Pinned ScrollTrigger layout on desktop: Left panel remains sticky with current step indicator and progress line, while right image and copy swap sequentially.
* **Product Cards**: Pointer hover triggers subtle 3D tilt (`perspective(1000px) rotateX/Y(±4deg)`), image scale (`1.05`), and arrow icon diagonal swap.

### Viewport: 390px Mobile
* **Scroll**: 100% native scrolling. Inertial smooth scrolling is strictly disabled for touch responsiveness.
* **Header**: Compact mobile navigation bar. Menu trigger opens a full-screen glass overlay with staggered slide-in links (`stagger: 0.06s`, `translateY(20px -> 0)`).
* **Pinned Sections**: Pinned desktop scroll stories convert to natural vertically stacked cards with simple scroll-triggered fade/slide reveals.
* **Marquee & Carousels**: Marquee slows down slightly for legibility on small screens. Carousel supports native touch-swipe with snap points.

---

## 2. Reference Analysis: Polariyon (`https://polariyon.framer.website/`)

### Viewport: 1440px Desktop
* **Category Expanding Showcase**: Three-column horizontal layout. Hovering or focusing a panel expands its flex ratio (`flex: 1` to `flex: 2.5`), smoothly revealing full photograph, spec breakdown, and CTA link, while neighboring panels compress.
* **Draggable Product Carousel**: Draggable horizontal track with bounding drag constraints, snap-to-card physics, custom floating "Drag" pill cursor that follows pointer, and real-time scroll progress indicator line.
* **Buttons & CTAs**:
  * Primary CTA features a subtle magnetic pull towards the cursor (max 8px displacement, resets on pointer leave with spring damping).
  * Hover fill effect: subtle background highlight sliding up from bottom (`translateY(100% -> 0%)`).
* **FAQ Accordion**: Height transition from `0` to `auto` powered by layout animation / spring physics (`stiffness: 350, damping: 32`), with 180° rotation on chevron icon and full keyboard/ARIA synchronization.
* **Testimonials**: Auto-advancing testimonial crossfade slider with pause-on-hover/focus, bullet indicators, and prev/next controls.

### Viewport: 390px Mobile
* **Expanding Panels**: Replaced with clean tap-to-expand accordion cards or horizontal swipe cards.
* **Magnetic Effects**: Completely disabled on touch devices (`pointer: coarse`).
* **Draggable Carousel**: Native touch gesture swipe with kinetic decay and snap.

---

## 3. Shared Motion Patterns & Architecture for Noor Solar

1. **Strict Separation of Concerns**:
   * **GSAP + ScrollTrigger (`@gsap/react`)**: Scroll-driven pinned sequences (Ordering steps), velocity-reactive text marquee, image parallax, and hero load timeline.
   * **Motion (`motion/react`)**: Component-level state transitions (drag carousel, hover tilt, accordion expansion, mobile menu, and magnetic button attraction).
2. **Motion Tokens**: All animations share unified tokens (`src/lib/motion.ts`) for durations, easing curves, and stagger intervals to ensure aesthetic cohesion.
3. **Accessibility First (`prefers-reduced-motion`)**:
   * Smooth scroll is disabled.
   * Pinning and parallax are disabled.
   * Counters immediately display final values.
   * Opacity transitions are instant or subtle fades.
   * Marquee remains static or slow accessible scroll.
4. **Performance Floor**:
   * Only `transform`, `opacity`, and `clip-path` are animated on compositor layers.
   * Zero layout shifts.
   * LCP text is visible in initial SSR HTML with zero initial `opacity: 0` blocking.
   * Automatic cleanup on unmount: `ScrollTrigger.kill()`, GSAP ticker removal, and Lenis destruction.
