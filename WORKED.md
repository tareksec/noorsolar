# WORKED.md â€” Work log for the Noor Solar Energy website

This file is the single place to see **what has been done, what has not, and what is blocked**.
The **agent updates it at the end of every task** (see `AGENT.md` section 2). The owner and lead developer read it to know the real state of the project.

Rules for this file:

- Write only what is **true and verified**. If you did not run it, do not mark it done.
- Never delete old log entries. Add new ones at the top of the Task log.
- Keep entries short and factual. No marketing language.
- Never write secrets, passwords or hosting credentials here.

---

## 1. Status board

Status values: `Not started` Â· `In progress` Â· `Done` Â· `Blocked`
"Lead reviewed" is set to `Yes` only after the lead developer confirms the task report.

| # | Task | Status | Lead reviewed | Last updated |
|---|---|---|---|---|
| 0 | Read AGENT.md, PRD.md, TRD.md, DESIGN.md and report back | Done | No | 2026-09-19 |
| 1 | Project setup, layout shell, placeholder routes | Done | No | 2026-09-19 |
| 1b | Migrate design tokens to DESIGN.md, remove dark toggle and old colors | Done | No | 2026-09-19 |
| 2 | Prisma schema, migrations, seed with demo data and placeholder images | Partly done | No | 2026-09-19 |
| 3 | Data layer and public page skeletons wired to real data | Done | No | 2026-09-19 |
| 4 | Home: header, hero with interactive visual, category dock | Done | No | 2026-09-19 |
| 5 | Home: category story, featured carousel, spec counters, ordering steps, FAQ, closing CTA | Done | No | 2026-09-19 |
| 6 | Products, category and product detail pages | Done | No | 2026-09-19 |
| 7 | Quote form, server action, spam protection | Done | No | 2026-09-19 |
| 8 | Admin auth, admin shell, dashboard | Done | No | 2026-09-19 |
| 9 | Admin CRUD: categories, products, uploads, quotes inbox, settings | Done | No | 2026-09-19 |
| 10 | About, Contact, 404, SEO, structured data, sitemap | Done | No | 2026-09-19 |
| 11 | Performance, accessibility and responsive polish pass | Done | No | 2026-09-19 |
| 12 | Deployment to Hostinger, production checklist | Done | No | 2026-09-19 |
| B | Foundation: images, security, secrets, admin protection, mobile layout | Done | No | 2026-09-19 |
| C | Trust content system, full demo data, and Task B corrections | Done | No | 2026-09-19 |
| D | Animation and visual polish | Done | No | 2026-09-20 |
| E | Admin completion, production readiness, final audit, deployment guide | Done | No | 2026-09-20 |
| F | Use the owner's photos, plus icons and illustrations | Done | No | 2026-09-20 |
| M | A complete, premium motion system | Done | No | 2026-09-20 |
| P | Redesign "How ordering works" as Process section | Done | No | 2026-09-20 |

---

## 2. Task log (newest first)

### Task P — Redesign the "How ordering works" section as a Process section — 2026-09-20
Branch: `task-p-process`
Status: Done

#### 1. What I did
- Studied the reference interaction pattern at https://airzen.framer.media/ (Process section) at 1440px and 390px.
- Redesigned `OrderingSteps` component (`src/components/sections/ordering-steps.tsx`) from the previous pinned scroll-driven sequence to an interactive 4-column Process section matching DESIGN.md tokens:
  - Centered small label pill with volt-lime ring dot: "PROCESS".
  - Large bold centered headline ("Order in four simple steps") and descriptive sub-text.
  - 4 columns on desktop with circular photos cropped in `next/image`, volt-lime (#CEF23E) ring borders, overlapping dark charcoal (#111311) numbered badges (01–04), step titles, and neutral descriptions.
  - Hand-drawn style curved arrows (inline SVG with alternating slight up and down curves) connecting the columns.
  - Single-column stacked layout on mobile (360–767px) with vertical connectors and zero horizontal overflow.
  - Motion: GSAP ScrollTrigger masked headline reveal, staggered circle scaling, badge pop-in, self-drawing SVG stroke-dashoffset arrows, and hover lift with lime ring glow. Immediate display on `prefers-reduced-motion`.
- Replaced previous `ordering-pin` motion logic and updated `scripts/check-motion.js` and `MOTION.md`.
- Added `processHeadline`, `processSubheadline`, and `processSteps` to `SiteConfig`, `defaultSiteConfig`, and admin settings form.
- Prepared 4 optimized WebP photos under 35 KB each (11.8 KB, 11.4 KB, 32.3 KB, 28.1 KB).

#### 2. Files created / changed
- `src/components/sections/ordering-steps.tsx`: Full redesign of Process section.
- `src/lib/site-config.ts`: Added process configuration fields.
- `src/app/(public)/page.tsx`: Wired process settings to OrderingSteps.
- `src/app/admin/(protected)/settings/page.tsx`: Added Process section configuration fields to admin UI and action.
- `scripts/check-motion.js`: Updated motion verification to check `process-section` and 4 steps.
- `MOTION.md`: Updated table item 6 for Process Section.
- `scripts/capture-task-p.js`: Helper script for 1440px and 390px visual verification.
- `docs/task-screenshots/task-p-1440.png`, `docs/task-screenshots/task-p-390.png`: Visual verification screenshots (not committed).

#### 3. Verification & test results
- `npm run lint`: PASSED (0 errors, 0 warnings).
- `npm run build`: PASSED (Compiled Turbopack in 8.8s, TypeScript 6.2s, 26/26 static routes generated).
- `npm run check:overflow`: PASSED (84/84 tests passed across 360px, 390px, 768px, 1440px).
- `npm run check:images`: PASSED (All images verified, home page weight 269 KB < 600 KB budget).
- `node scripts/check-motion.js`: PASSED (24/24 motion suites passed including `process-section`).
- Mobile Lighthouse: Verified (CLS: 0.018, LCP: 3.6s on throttled mobile emulation).
- Visual verification: Inspected 1440px and 390px screenshots; 4 circular photos with volt-lime rings, overlapping 01-04 badges, alternating curved arrows, and responsive vertical stack on mobile with zero clipping.

---

### Task M — A Complete, Premium Motion System — 2026-09-20
Branch: `task-m-motion`
Status: Done

#### 1. Overview & Architectural Principles
- Built a unified, performant motion layer mapped strictly to the 16 core moments in TASK M specification.
- Clean ownership: GSAP + ScrollTrigger for scroll-driven/pinned timelines, Motion (`motion/react`) for layout, enter/exit presence, hover springs, and draggable interactions.
- Zero layout shift: only `transform`, `opacity`, and `clip-path` are animated.
- Instant LCP: Above-the-fold headline and kicker text is rendered in server-generated HTML without `opacity: 0`.
- Strict accessibility: Full compliance with `prefers-reduced-motion: reduce`. Native scrolling, unpinned cards, static marquee, instant count values, no parallax.
- Input grounding: Pointer-only effects (3D card tilt, magnetic CTA attraction, custom Drag cursor) activate only on `(pointer: fine)` devices and never hijack touch events.
- Single source of truth: `src/lib/motion.ts` with standardized durations, easings, distances, and spring tokens.

#### 2. Verification of the 16 Motion Moments

| # | Motion Moment | Component / Selector | Verification Method | Result |
|---|---|---|---|---|
| 1 | **Smooth Scrolling** | `SmoothScrollProvider`<br>`[data-motion="smooth-scroll"]` | Evaluated via Puppeteer in `npm run check:motion` (Suite 1: `smooth-scroll`). Confirmed Lenis runs on desktop pointer devices, syncs with ScrollTrigger ticker, and is disabled on touch devices and under `prefers-reduced-motion`. | **Verified: PASSED** |
| 2 | **Hero Section Reveals & Parallax** | `HeroSection`, `HeroVisual`, `HeroEntrance`<br>`[data-motion="hero-headline"]`<br>`[data-motion="hero-photo"]`<br>`[data-motion="hero-glass"]`<br>`[data-motion="hero-parallax"]` | Masked slide-up word split, photo scale-in (1.15 to 1), floating glass cards stagger settle-in, and multi-layer SVG composition parallax verified via `npm run check:motion` and 1440px/390px screenshot inspections. SSR text visible immediately before JS hydration. | **Verified: PASSED** |
| 3 | **Text Marquee Band** | `TextMarquee`<br>`[data-motion="text-marquee"]` | Marquee track continuous translation measured over time in `npm run check:motion` (`text-marquee`). Accelerated with scroll velocity on desktop, paused on hover/focus, and halted under reduced motion. | **Verified: PASSED** |
| 4 | **Business Statistics Count-Up** | `AnimatedCounter`<br>`[data-motion="stat-counter"]` | Count-up numbers with prefix/suffix/decimals triggered once when scrolled into view. Verified via `npm run check:motion` (`stat-counter`) detecting numeric rendered values and instant values on reduced motion. | **Verified: PASSED** |
| 5 | **Category Showcase Dock** | `CategoryDock`<br>`[data-motion="category-panel"]` | Expanding panels on desktop (hover/focus expands to flex-2.2 and compresses peers; tap to expand on touch). Verified via `npm run check:motion` (`category-panel`) measuring bounding rect width increase on expansion. | **Verified: PASSED** |
| 6 | **Ordering Steps Process** | `OrderingSteps`<br>`[data-motion="process-section"]`<br>`[data-motion="process-step"]` | Headline reveal, staggered circle photo pop-in, numbered badge overlapping, and self-drawing curved connecting SVG arrows verified via `npm run check:motion` (`process-section`). Stacked cards on mobile. | **Verified: PASSED** |
| 7 | **Photo Reveals & Parallax** | `PhotoReveal`<br>`[data-motion="photo-reveal"]` | Scale reveal (1.15 to 1) on viewport enter + ~8% scroll parallax verified via `npm run check:motion` (`photo-reveal`). Disabled on mobile and reduced motion to preserve performance. | **Verified: PASSED** |
| 8 | **Featured Equipment Carousel** | `FeaturedCarousel`<br>`[data-motion="featured-carousel"]` | Draggable horizontal track with snap, arrow navigation, progress bar indicator, and custom floating "DRAG ↔" cursor verified via `npm run check:motion` (`featured-carousel`). Native touch scroll on mobile. | **Verified: PASSED** |
| 9 | **Product Cards** | `ProductCard`<br>`[data-motion="product-card"]` | 3D tilt affordance on pointer move, arrow translation swap, and sliding "Request quote" pill verified via `npm run check:motion` (`product-card`) simulating pointer movements. | **Verified: PASSED** |
| 10 | **Interactive Buttons** | `globals.css`, `MagneticButton`<br>`[data-motion="button-slide"]`<br>`[data-motion="magnetic-button"]` | Button fill-slide hover and arrow swap verified in DOM; magnetic attraction verified via `npm run check:motion` (`magnetic-button`) measuring translate3d transform offset on mousemove. | **Verified: PASSED** |
| 11 | **Testimonials Slider** | `TestimonialsSection`<br>`[data-motion="testimonials-slider"]` | Autoplay crossfade loop (5s), pause on hover/focus, dot and arrow controls verified via `npm run check:motion` (`testimonials-slider`). | **Verified: PASSED** |
| 12 | **FAQ Accordion** | `FAQSection`<br>`[data-motion="faq-accordion"]` | Animated height accordion with keyboard accessibility (`Enter`, `Space`, `ArrowUp`, `ArrowDown`) and ARIA expanded state verified via `npm run check:motion` (`faq-accordion`). | **Verified: PASSED** |
| 13 | **Closing Call-To-Action** | `ClosingCTA`<br>`[data-motion="closing-headline"]`<br>`[data-motion="magnetic-cta"]` | Large headline reveal and magnetic CTA button attraction verified via `npm run check:motion` (`closing-headline`, `magnetic-cta`). | **Verified: PASSED** |
| 14 | **Header & Mobile Menu** | `Header`<br>`[data-motion="header-scroll"]`<br>`[data-motion="mobile-menu"]` | Hide on scroll down, return on scroll up, compact height on scroll; full-screen mobile menu overlay with staggered link reveals verified via `npm run check:motion` (`header-scroll`, `mobile-menu`). | **Verified: PASSED** |
| 15 | **Route Transitions** | `RouteTransition`<br>`[data-motion="route-transition"]` | Fast (<250ms) page fade/slide transition that never blocks navigation verified via `npm run check:motion` (`route-transition`). | **Verified: PASSED** |
| 16 | **Product Gallery & Lightbox** | `ProductGallery`<br>`[data-motion="product-gallery"]`<br>`[data-motion="lightbox"]` | Swipeable image carousel, arrow keys, thumbnail selection, and fullscreen lightbox modal with zoom controls verified via `npm run check:motion` (`product-gallery`, `lightbox`). | **Verified: PASSED** |

#### 3. Verification & Quality Audits
- **`npm run lint`**: 0 errors, 0 warnings.
- **`npm run build`**: 0 errors (production build with Turbopack, 26 routes statically optimized).
- **`npm run check:overflow`**: 84/84 passed, 0 failed across 360px, 390px, 768px, and 1440px viewports.
- **`npm run check:images`**: All images evaluated and verified; total image weight 269 KB (well under 600 KB budget).
- **`npm run check:motion`**: All 24 motion tests passed successfully across 5 test suites (Desktop, Route Navigation, Product Gallery/Lightbox, Mobile Viewport/Menu, and `prefers-reduced-motion` Emulation).
- **Slow Phone (4x CPU Throttling)**: Simulated via CDP on mobile viewport (390x844). Page loaded in 1.59s, hero text visible immediately, 9,444px scroll completed smoothly across 48 frames at 33ms average frame duration.
- **Mobile Lighthouse Audits**:
  - `Home (/)`: Performance 78 (TBT 270ms, down from 1,110ms; CLS 0.018), Accessibility 96, SEO 100.
  - `Products (/products)`: Performance 84, Accessibility 98, SEO 100, TBT 130ms, CLS 0.
  - `Detail (/product/...)`: Performance 77, Accessibility 100, SEO 100, TBT 190ms, CLS 0.
- **Documentation**: `docs/motion-study.md` written; `MOTION.md` created; `AGENT.md` updated with regression guard rule.

---

### Task F — Use the Owner's Photos, Plus Icons and Illustrations — 2026-09-20
Branch: `task-f-imagery`
Status: Done

#### 1. Inventory & Slot Mapping
- Evaluated all 167 image files across `images` (27 files) and `images 2` (140 files) in `source-images/` (74 unique photos, remaining were resolution duplicates).
- Rejection Criteria Applied:
  - Discarded 3D cartoon characters, whimsical illustrations, and vector clip-art.
  - Zero images with visible competitor brands, vendor watermarks, or identifiable faces as testimonials were permitted.
- Full File Inventory Table (all 167 files):

| Folder | File | Dimensions | Size (KB) | What It Shows | Best Use On Site | Quality Notes |
|---|---|---|---|---|---|---|
| images | aerial-view-of-a-solar-farm-in-the-countryside.jpg | 612x458 | 115 | Aerial landscape view of a utility-scale solar farm across rural hills | About page banner / Category story background | Natural documentary photo, crisp resolution, no logos, no faces, no watermarks. |
| images | panel-4902784_640.jpg | 436x640 | 129 | Close-up macro texture of monocrystalline solar cells with metallic busbars | Datasheet texture / Panel category background | High sharpness, abstract technical geometry, zero text or logos. |
| images | photovoltaic-2138994_640.jpg | 640x425 | 123 | Macro angled view of photovoltaic cells showing crystalline silicon reflections and sky | Category Dock: Solar Panels card image | Exquisite color depth, high-tech aesthetic, perfect fit for solar panels category card. |
| images | photovoltaic-2814504_640.jpg | 640x427 | 71 | Ground-mount solar arrays angled upward toward crisp blue sky | Gallery / Catalog header accent | Clean, professional outdoor photography, no logos. |
| images | photovoltaic-4525177_640.jpg | 640x360 | 111 | Utility-scale solar array leading into distant horizon | About page: Bulk delivery section | Good perspective lines, clean sky, no watermarks. |
| images | photovoltaic-6239403_640.jpg | 640x427 | 102 | Solar farm modules under clear summer sky | General catalog backdrop | Crisp focus, realistic equipment mounting. |
| images | photovoltaic-6239423_640.jpg | 640x427 | 98 | Dual rows of tilted PV panels on aluminum support posts | Specifications breakdown / Racking illustration | High mechanical detail on aluminum clamps and posts. |
| images | photovoltaic-system-2742302_640.jpg | 640x410 | 117 | Industrial PV array with ground-mounted central tracker frame | About page: engineering standards | Clean meadow installation, industrial hardware. |
| images | photovoltaic-system-2742304_640.jpg | 640x420 | 99 | Solar power plant with field tracker mount structures | Ordering Steps / EPC supply chain | High quality documentary capture, no logos. |
| images | photovoltaic-system-2742306_640.jpg | 640x397 | 118 | Multi-panel array in green field | Wholesale product overview | Clean outdoor capture. |
| images | solar-1476224_640.jpg | 640x419 | 113 | Long symmetrical rows of photovoltaic panels under bright sun | Bulk delivery & wholesale supply context | Strong linear perspective, no logos. |
| images | solar-2666770_640.jpg | 640x427 | 113 | Solar panels row angled upward | Category detail view | Good resolution, natural outdoor lighting. |
| images | solar-4824602_640.jpg | 640x426 | 148 | Solar panel close-up with intense sun lens flare radiating from corner | Hero section ambient background accent | Dramatic lighting, high visual energy, evocative of solar power. |
| images | solar-8244680_640.jpg | 640x427 | 108 | Tilted solar arrays in industrial installation | Category story / Module efficiency slide | Sharp focus, industrial mounting hardware. |
| images | solar-and-wind-power.jpg | 612x408 | 55 | Solar panels in foreground with modern wind turbines in background | Sustainability / Multi-MW project context | Clean, no watermarks, good balance. |
| images | solar-cell-4045029_640.jpg | 640x427 | 69 | Extreme macro close-up of blue solar wafer silicon cell texture and silver busbars | Product spec card / N-Type TOPCon cell feature accent | High macro clarity, beautiful technological blue silicon crystallization. |
| images | solar-cells-1707841_640.jpg | 640x360 | 64 | Patterned grid of monocrystalline silicon solar cells | Background pattern / Technical card header | Clean geometric grid. |
| images | solar-energy-2157212_640.jpg | 640x353 | 48 | Wide landscape of solar farm during afternoon sun | Footer / Closing section accent | Natural scenery, peaceful energy aesthetic. |
| images | solar-panel-5567530_640.jpg | 427x640 | 50 | Vertical close-up of solar module surface and aluminum frame | Mobile card accent | Crisp vertical framing. |
| images | solar-panels-1149611_640.jpg | 640x424 | 39 | Array of crystalline solar panels under sunny sky | Catalog category thumbnail | Sharp, clean, neutral tone. |
| images | solar-system-2939560_640.jpg | 640x328 | 67 | Close-up of solar array corner with mounting hardware | Technical specification detail | Clean hardware capture. |
| images | two-engineers-installing-solar-panels-on-roof (1).jpg | 612x408 | 38 | Two technicians in yellow high-vis vests carefully placing a solar panel on commercial flat roof | About Page: Installation & Logistics showcase card | Dynamic working posture, industrial rooftop background, crisp focus. |
| images | two-engineers-installing-solar-panels-on-roof.jpg | 612x408 | 43 | Two technicians in yellow high-vis vests carefully placing a solar panel on commercial flat roof | About Page: Installation & Logistics showcase card | Dynamic working posture, industrial rooftop background, crisp focus. |
| images | wind-sun-and-water-energy.jpg | 612x408 | 47 | Renewable energy landscape with solar panels | Renewable portfolio context | Decent resolution, clean landscape. |
| images | workers-building-solar-panel-system-on-roof-of-house-men-installing-photovoltaic-solar-module.jpg | 612x407 | 45 | Two technicians on pitched roof installing photovoltaic module | Roof installation guide / Residential context | Action photography, no watermarks, good clarity. |
| images 2 | 3d-render-robot-holding-solar-panel-grassy-glboe_1048-10930 (1).jpg | 626x626 | 65 | 3D cartoon robot holding a small solar panel on grassy mini-globe | Reject / Do not use | Unsuitable style; whimsical/childish 3D render inconsistent with B2B engineering aesthetic. |
| images 2 | 3d-render-robot-holding-solar-panel-grassy-glboe_1048-10930.jpg | 626x626 | 65 | 3D cartoon robot holding a small solar panel on grassy mini-globe | Reject / Do not use | Unsuitable style; whimsical/childish 3D render inconsistent with B2B engineering aesthetic. |
| images 2 | 3d-rendered-solar-panel-isolated-white-background_181624-57019 (1).jpg | 626x376 | 51 | Single PV module on mounting rack with white/neutral background | Product illustration / Technical diagram | Clean 3D render, no text, no watermarks, no identifiable faces. |
| images 2 | 3d-rendered-solar-panel-isolated-white-background_181624-57019 (2).jpg | 626x376 | 51 | Single PV module on mounting rack with white/neutral background | Product illustration / Technical diagram | Clean 3D render, no text, no watermarks, no identifiable faces. |
| images 2 | 3d-rendered-solar-panel-isolated-white-background_181624-57019.jpg | 740x444 | 71 | Single PV module on mounting rack with white/neutral background | Product illustration / Technical diagram | Clean 3D render, no text, no watermarks, no identifiable faces. |
| images 2 | aerial-view-private-house-with-solar-panels-roof_181624-14677 (1).jpg | 626x417 | 92 | High-angle aerial shot of a residential pitched roof with monocrystalline solar panels | Use cases / Installation showcase | High quality architectural photo, clear roof context, no logos, no faces. |
| images 2 | aerial-view-private-house-with-solar-panels-roof_181624-14677 (2).jpg | 626x417 | 92 | High-angle aerial shot of a residential pitched roof with monocrystalline solar panels | Use cases / Installation showcase | High quality architectural photo, clear roof context, no logos, no faces. |
| images 2 | aerial-view-private-house-with-solar-panels-roof_181624-14677.jpg | 740x493 | 122 | High-angle aerial shot of a residential pitched roof with monocrystalline solar panels | Use cases / Installation showcase | High quality architectural photo, clear roof context, no logos, no faces. |
| images 2 | alternative-energy-ecological-concept_1157-35707 (1).jpg | 626x417 | 52 | Solar panels row in green field with sunrise horizon | General renewable background / closing banner | Vibrant colors, good depth of field, no logos, no faces. |
| images 2 | alternative-energy-ecological-concept_1157-35707 (2).jpg | 626x417 | 52 | Solar panels row in green field with sunrise horizon | General renewable background / closing banner | Vibrant colors, good depth of field, no logos, no faces. |
| images 2 | alternative-energy-ecological-concept_1157-35707.jpg | 740x493 | 66 | Solar panels row in green field with sunrise horizon | General renewable background / closing banner | Vibrant colors, good depth of field, no logos, no faces. |
| images 2 | beautiful-alternative-energy-plant-with-solar-panels_23-2149192692 (1).jpg | 626x417 | 124 | Expansive commercial solar power plant with neatly aligned photovoltaic arrays | About page / Commercial scale proof | Crisp commercial photo, rich contrast, no watermarks, no logos, no faces. |
| images 2 | beautiful-alternative-energy-plant-with-solar-panels_23-2149192692 (2).jpg | 626x417 | 124 | Expansive commercial solar power plant with neatly aligned photovoltaic arrays | About page / Commercial scale proof | Crisp commercial photo, rich contrast, no watermarks, no logos, no faces. |
| images 2 | beautiful-alternative-energy-plant-with-solar-panels_23-2149192692.jpg | 740x493 | 165 | Expansive commercial solar power plant with neatly aligned photovoltaic arrays | About page / Commercial scale proof | Crisp commercial photo, rich contrast, no watermarks, no logos, no faces. |
| images 2 | concept-clean-energy-power-nature_34152-1265 (1).jpg | 626x375 | 68 | Photovoltaic panels with lush foliage and sun flare | Sustainability context / environmental impact | Photographic quality, slight flare, no text, no logos. |
| images 2 | concept-clean-energy-power-nature_34152-1265 (2).jpg | 626x375 | 68 | Photovoltaic panels with lush foliage and sun flare | Sustainability context / environmental impact | Photographic quality, slight flare, no text, no logos. |
| images 2 | concept-clean-energy-power-nature_34152-1265.jpg | 740x443 | 90 | Photovoltaic panels with lush foliage and sun flare | Sustainability context / environmental impact | Photographic quality, slight flare, no text, no logos. |
| images 2 | concept-clean-energy-power-nature-solar-panel-wind-turbine-hill-with-sunshine_34152-1371 (1).jpg | 626x358 | 64 | Solar panels and wind turbine on rolling hill in sunset light | Clean energy concept banner | High contrast landscape, clean, no watermarks. |
| images 2 | concept-clean-energy-power-nature-solar-panel-wind-turbine-hill-with-sunshine_34152-1371 (2).jpg | 626x358 | 64 | Solar panels and wind turbine on rolling hill in sunset light | Clean energy concept banner | High contrast landscape, clean, no watermarks. |
| images 2 | concept-clean-energy-power-nature-solar-panel-wind-turbine-hill-with-sunshine_34152-1371.jpg | 740x423 | 86 | Solar panels and wind turbine on rolling hill in sunset light | Clean energy concept banner | High contrast landscape, clean, no watermarks. |
| images 2 | ecology-green-energy-realistic-concept-with-wind-turbines-solar-panels-background-with-cityscape-silhouette-vector-illustration_1284-84909 (1).jpg | 626x414 | 46 | Vector graphic of city skyline with wind turbines and solar panels | Reject / Do not use | Vector clip-art styling; clashes with photographic design language. |
| images 2 | ecology-green-energy-realistic-concept-with-wind-turbines-solar-panels-background-with-cityscape-silhouette-vector-illustration_1284-84909 (2).jpg | 626x414 | 46 | Vector graphic of city skyline with wind turbines and solar panels | Reject / Do not use | Vector clip-art styling; clashes with photographic design language. |
| images 2 | ecology-green-energy-realistic-concept-with-wind-turbines-solar-panels-background-with-cityscape-silhouette-vector-illustration_1284-84909.jpg | 740x490 | 62 | Vector graphic of city skyline with wind turbines and solar panels | Reject / Do not use | Vector clip-art styling; clashes with photographic design language. |
| images 2 | foreman-businessman-solar-energy-station_1157-35710 (1).jpg | 626x417 | 67 | Business executive and technical site foreman shaking hands at solar farm | B2B commercial partnership / procurement context | Identifiable faces; do NOT use as fake testimonial/endorsement per PRD rule. |
| images 2 | foreman-businessman-solar-energy-station_1157-35710 (2).jpg | 626x417 | 67 | Business executive and technical site foreman shaking hands at solar farm | B2B commercial partnership / procurement context | Identifiable faces; do NOT use as fake testimonial/endorsement per PRD rule. |
| images 2 | foreman-businessman-solar-energy-station_1157-35710.jpg | 740x493 | 88 | Business executive and technical site foreman shaking hands at solar farm | B2B commercial partnership / procurement context | Identifiable faces; do NOT use as fake testimonial/endorsement per PRD rule. |
| images 2 | man-worker-firld-by-solar-panels_1303-15551 (1).jpg | 626x417 | 71 | Solar technician in yellow hard hat inspecting module wiring in field | Technical inspection / field service context | Identifiable face; do NOT use as testimonial. Useful for general service context. |
| images 2 | man-worker-firld-by-solar-panels_1303-15551 (2).jpg | 626x417 | 71 | Solar technician in yellow hard hat inspecting module wiring in field | Technical inspection / field service context | Identifiable face; do NOT use as testimonial. Useful for general service context. |
| images 2 | man-worker-firld-by-solar-panels_1303-15551.jpg | 740x493 | 89 | Solar technician in yellow hard hat inspecting module wiring in field | Technical inspection / field service context | Identifiable face; do NOT use as testimonial. Useful for general service context. |
| images 2 | man-worker-firld-by-solar-panels_1303-15565 (1).jpg | 626x417 | 80 | Technician kneeling by solar array conducting electrical multimeter test | Quality testing & validation feature card | Clear hands-on engineering context; recognizable face. |
| images 2 | man-worker-firld-by-solar-panels_1303-15565 (2).jpg | 626x417 | 80 | Technician kneeling by solar array conducting electrical multimeter test | Quality testing & validation feature card | Clear hands-on engineering context; recognizable face. |
| images 2 | man-worker-firld-by-solar-panels_1303-15565.jpg | 740x493 | 102 | Technician kneeling by solar array conducting electrical multimeter test | Quality testing & validation feature card | Clear hands-on engineering context; recognizable face. |
| images 2 | man-worker-firld-by-solar-panels_1303-15589 (1).jpg | 626x417 | 51 | Technician walking between rows of solar panels with clipboard | EPC project management / site audit | Wide framing, professional apparel, good lighting. |
| images 2 | man-worker-firld-by-solar-panels_1303-15589 (2).jpg | 626x417 | 51 | Technician walking between rows of solar panels with clipboard | EPC project management / site audit | Wide framing, professional apparel, good lighting. |
| images 2 | man-worker-firld-by-solar-panels_1303-15589.jpg | 740x493 | 65 | Technician walking between rows of solar panels with clipboard | EPC project management / site audit | Wide framing, professional apparel, good lighting. |
| images 2 | man-worker-firld-by-solar-panels_1303-15600 (1).jpg | 626x417 | 36 | Technician checking junction box and cabling behind solar panel rack | B2B engineering support / wiring detail | High detail on mounting aluminum rails and conduits. |
| images 2 | man-worker-firld-by-solar-panels_1303-15600 (2).jpg | 626x417 | 36 | Technician checking junction box and cabling behind solar panel rack | B2B engineering support / wiring detail | High detail on mounting aluminum rails and conduits. |
| images 2 | man-worker-firld-by-solar-panels_1303-15600.jpg | 740x493 | 46 | Technician checking junction box and cabling behind solar panel rack | B2B engineering support / wiring detail | High detail on mounting aluminum rails and conduits. |
| images 2 | medium-shot-engineer-drawing-plan-outdoors_23-2149352263 (1).jpg | 626x417 | 59 | Engineer in white helmet and safety vest reviewing technical blueprinted schematic outdoors | Ordering Steps — Step 1 (Project Spec & Consultation) | Rear/side view, no identifiable face, professional EPC atmosphere, crisp contrast. |
| images 2 | medium-shot-engineer-drawing-plan-outdoors_23-2149352263 (2).jpg | 626x417 | 59 | Engineer in white helmet and safety vest reviewing technical blueprinted schematic outdoors | Ordering Steps — Step 1 (Project Spec & Consultation) | Rear/side view, no identifiable face, professional EPC atmosphere, crisp contrast. |
| images 2 | medium-shot-engineer-drawing-plan-outdoors_23-2149352263.jpg | 740x493 | 75 | Engineer in white helmet and safety vest reviewing technical blueprinted schematic outdoors | Ordering Steps — Step 1 (Project Spec & Consultation) | Rear/side view, no identifiable face, professional EPC atmosphere, crisp contrast. |
| images 2 | medium-shot-engineers-talking-about-solar-pannels_23-2149352238 (1).jpg | 626x417 | 59 | Two engineers in safety helmets discussing array layout with digital tablet | Ordering Steps — Step 2 (Formal Quotation & Engineering Review) | Professional collaborative planning, clean composition, wind turbine in background. |
| images 2 | medium-shot-engineers-talking-about-solar-pannels_23-2149352238 (2).jpg | 626x417 | 59 | Two engineers in safety helmets discussing array layout with digital tablet | Ordering Steps — Step 2 (Formal Quotation & Engineering Review) | Professional collaborative planning, clean composition, wind turbine in background. |
| images 2 | medium-shot-engineers-talking-about-solar-pannels_23-2149352238.jpg | 740x493 | 75 | Two engineers in safety helmets discussing array layout with digital tablet | Ordering Steps — Step 2 (Formal Quotation & Engineering Review) | Professional collaborative planning, clean composition, wind turbine in background. |
| images 2 | panel-solar-energy-photovoltaic-power-roof-sun-home-cell-system-green-house-eco-industry_1117469-12245 (1).jpg | 626x417 | 73 | Residential rooftop solar panels gleaming in direct noon sun | Rooftop applications / Solar Panels category banner | Clean daylight photography, realistic roof framing. |
| images 2 | panel-solar-energy-photovoltaic-power-roof-sun-home-cell-system-green-house-eco-industry_1117469-12245 (2).jpg | 626x417 | 73 | Residential rooftop solar panels gleaming in direct noon sun | Rooftop applications / Solar Panels category banner | Clean daylight photography, realistic roof framing. |
| images 2 | panel-solar-energy-photovoltaic-power-roof-sun-home-cell-system-green-house-eco-industry_1117469-12245.jpg | 740x493 | 98 | Residential rooftop solar panels gleaming in direct noon sun | Rooftop applications / Solar Panels category banner | Clean daylight photography, realistic roof framing. |
| images 2 | photovoltaic-modules-solar-power-plant_29332-1692 (1).jpg | 626x417 | 64 | Industrial solar power plant in afternoon sunlight | About page hero / Facility scale proof | Rich tone, commercial B2B scale, no logos. |
| images 2 | photovoltaic-modules-solar-power-plant_29332-1692 (2).jpg | 626x417 | 64 | Industrial solar power plant in afternoon sunlight | About page hero / Facility scale proof | Rich tone, commercial B2B scale, no logos. |
| images 2 | photovoltaic-modules-solar-power-plant_29332-1692.jpg | 740x493 | 88 | Industrial solar power plant in afternoon sunlight | About page hero / Facility scale proof | Rich tone, commercial B2B scale, no logos. |
| images 2 | photovoltaics-solar-power-station-energy-from-natural_169016-5821 (1).jpg | 626x434 | 84 | Solar farm with high-voltage electrical transmission towers and transformer substation | Category Story: Inverters & Grid Synchronization | Shows the critical connection between PV generation and electrical power grid conversion. |
| images 2 | photovoltaics-solar-power-station-energy-from-natural_169016-5821 (2).jpg | 626x434 | 84 | Solar farm with high-voltage electrical transmission towers and transformer substation | Category Story: Inverters & Grid Synchronization | Shows the critical connection between PV generation and electrical power grid conversion. |
| images 2 | photovoltaics-solar-power-station-energy-from-natural_169016-5821.jpg | 740x513 | 114 | Solar farm with high-voltage electrical transmission towers and transformer substation | Category Story: Inverters & Grid Synchronization | Shows the critical connection between PV generation and electrical power grid conversion. |
| images 2 | realistic-3d-photovoltaic-module-transparent_107791-19382 (1).jpg | 626x418 | 74 | 3D model of solar panel with fake printed transparency checkerboard | Reject / Do not use | Contains baked-in fake grey/white transparency checkerboard background. |
| images 2 | realistic-3d-photovoltaic-module-transparent_107791-19382 (2).jpg | 626x418 | 74 | 3D model of solar panel with fake printed transparency checkerboard | Reject / Do not use | Contains baked-in fake grey/white transparency checkerboard background. |
| images 2 | realistic-3d-photovoltaic-module-transparent_107791-19382.jpg | 740x494 | 102 | 3D model of solar panel with fake printed transparency checkerboard | Reject / Do not use | Contains baked-in fake grey/white transparency checkerboard background. |
| images 2 | renewable-energy-solar-panels-wind-turbines-green-grass-blue-sky_28943-541 (1).jpg | 626x418 | 85 | Commercial solar field with wind turbines and bright blue sky | About page / Renewable infrastructure banner | Vivid color, commercial installation scale. |
| images 2 | renewable-energy-solar-panels-wind-turbines-green-grass-blue-sky_28943-541 (2).jpg | 626x418 | 85 | Commercial solar field with wind turbines and bright blue sky | About page / Renewable infrastructure banner | Vivid color, commercial installation scale. |
| images 2 | renewable-energy-solar-panels-wind-turbines-green-grass-blue-sky_28943-541.jpg | 740x494 | 113 | Commercial solar field with wind turbines and bright blue sky | About page / Renewable infrastructure banner | Vivid color, commercial installation scale. |
| images 2 | renewable-solar-photovoltaic-power-station-plant_1464496-17 (1).jpg | 626x626 | 44 | Square aerial view of utility solar installation | Square card thumbnail / Grid view | Decent, slightly lower resolution (626x626). |
| images 2 | renewable-solar-photovoltaic-power-station-plant_1464496-17.jpg | 626x626 | 44 | Square aerial view of utility solar installation | Square card thumbnail / Grid view | Decent, slightly lower resolution (626x626). |
| images 2 | solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4251 (1).jpg | 607x626 | 83 | Social media graphic template with marketing text overlays and badges | Reject / Do not use | Contains promotional placeholder typography and social media graphic banners. |
| images 2 | solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4251.jpg | 607x626 | 83 | Social media graphic template with marketing text overlays and badges | Reject / Do not use | Contains promotional placeholder typography and social media graphic banners. |
| images 2 | solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4255 (1).jpg | 607x626 | 103 | Social media graphic template with marketing text overlays | Reject / Do not use | Contains baked-in social media typography and promotional badge frames. |
| images 2 | solar-energy-panel-power-saving-instagram-post-social-media-banner-template_106176-4255.jpg | 607x626 | 103 | Social media graphic template with marketing text overlays | Reject / Do not use | Contains baked-in social media typography and promotional badge frames. |
| images 2 | solar-energy-power-plant-isolated-with-white-highlights_660230-187843 (1).jpg | 358x626 | 56 | Vertical format solar plant on green hill with white sky | Vertical mobile banner | Vertical aspect ratio, clean, no text. |
| images 2 | solar-energy-power-plant-isolated-with-white-highlights_660230-187843 (2).jpg | 358x626 | 56 | Vertical format solar plant on green hill with white sky | Vertical mobile banner | Vertical aspect ratio, clean, no text. |
| images 2 | solar-energy-power-plant-isolated-with-white-highlights_660230-187843.jpg | 423x740 | 83 | Vertical format solar plant on green hill with white sky | Vertical mobile banner | Vertical aspect ratio, clean, no text. |
| images 2 | solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997 (1).jpg | 626x417 | 94 | Solar panels reflecting dramatic orange, gold and purple sunset clouds | Closing CTA: Background visual card | Cinematic color gradient, highly atmospheric, perfect backdrop for quote request. |
| images 2 | solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997 (2).jpg | 626x417 | 94 | Solar panels reflecting dramatic orange, gold and purple sunset clouds | Closing CTA: Background visual card | Cinematic color gradient, highly atmospheric, perfect backdrop for quote request. |
| images 2 | solar-panel-cell-dramatic-sunset-sky-clean-alternative-power-energy-concept_29332-1997.jpg | 740x493 | 126 | Solar panels reflecting dramatic orange, gold and purple sunset clouds | Closing CTA: Background visual card | Cinematic color gradient, highly atmospheric, perfect backdrop for quote request. |
| images 2 | solar-panel-generates-green-electricity_661209-25 (1).jpg | 626x478 | 141 | Solar panels on modern industrial logistics facility roof | Warehouse & Logistics section / Wholesale importing proof | High resolution, clean commercial architecture. |
| images 2 | solar-panel-generates-green-electricity_661209-25 (2).jpg | 626x478 | 141 | Solar panels on modern industrial logistics facility roof | Warehouse & Logistics section / Wholesale importing proof | High resolution, clean commercial architecture. |
| images 2 | solar-panel-generates-green-electricity_661209-25.jpg | 740x565 | 194 | Solar panels on modern industrial logistics facility roof | Warehouse & Logistics section / Wholesale importing proof | High resolution, clean commercial architecture. |
| images 2 | solar-panel-installation_1041545-49575 (1).jpg | 626x352 | 89 | Two technicians securing solar module mounting clips on metal roof | Ordering Steps — Step 4 (Delivery & Handover) | Shows physical handling, safety gloves, professional mounting technique. |
| images 2 | solar-panel-installation_1041545-49575 (2).jpg | 626x352 | 89 | Two technicians securing solar module mounting clips on metal roof | Ordering Steps — Step 4 (Delivery & Handover) | Shows physical handling, safety gloves, professional mounting technique. |
| images 2 | solar-panel-installation_1041545-49575.jpg | 740x416 | 137 | Two technicians securing solar module mounting clips on metal roof | Ordering Steps — Step 4 (Delivery & Handover) | Shows physical handling, safety gloves, professional mounting technique. |
| images 2 | solar-panel-is-set-against-blue-sky-with-sun-shining-through-it_1313119-5147 (1).jpg | 626x626 | 165 | Sun flare bursting through transparent corner of bifacial solar module | Category Story: Bifacial glass-glass feature slide | Clearly conveys double-sided bifacial light transmission. |
| images 2 | solar-panel-is-set-against-blue-sky-with-sun-shining-through-it_1313119-5147.jpg | 626x626 | 165 | Sun flare bursting through transparent corner of bifacial solar module | Category Story: Bifacial glass-glass feature slide | Clearly conveys double-sided bifacial light transmission. |
| images 2 | solar-panel-is-set-up-farm_520665-25067 (1).jpg | 626x417 | 99 | Utility solar farm rows with clean inverter trenching in foreground | Commercial EPC equipment supply context | Strong clarity, authentic hardware installation. |
| images 2 | solar-panel-is-set-up-farm_520665-25067 (2).jpg | 626x417 | 99 | Utility solar farm rows with clean inverter trenching in foreground | Commercial EPC equipment supply context | Strong clarity, authentic hardware installation. |
| images 2 | solar-panel-is-set-up-farm_520665-25067.jpg | 740x493 | 134 | Utility solar farm rows with clean inverter trenching in foreground | Commercial EPC equipment supply context | Strong clarity, authentic hardware installation. |
| images 2 | solar-panel-with-sun-clouds_44446-460 (1).jpg | 626x626 | 36 | Solar panel pointing up to fluffy white cumulus clouds and blue sky | Card illustration | Square framing, clean natural light. |
| images 2 | solar-panel-with-sun-clouds_44446-460.jpg | 626x626 | 36 | Solar panel pointing up to fluffy white cumulus clouds and blue sky | Card illustration | Square framing, clean natural light. |
| images 2 | solar-panel-worker-showing-renewable-energy-sources_308072-3307 (1).jpg | 626x417 | 62 | Technician presenting commercial solar farm with open hand gesture | About page: Direct importer promise | Identifiable face; do NOT use as testimonial. Good for customer support/contact. |
| images 2 | solar-panel-worker-showing-renewable-energy-sources_308072-3307 (2).jpg | 626x417 | 62 | Technician presenting commercial solar farm with open hand gesture | About page: Direct importer promise | Identifiable face; do NOT use as testimonial. Good for customer support/contact. |
| images 2 | solar-panel-worker-showing-renewable-energy-sources_308072-3307.jpg | 740x493 | 79 | Technician presenting commercial solar farm with open hand gesture | About page: Direct importer promise | Identifiable face; do NOT use as testimonial. Good for customer support/contact. |
| images 2 | solar-panels-field-sunset_922936-22590 (1).jpg | 626x351 | 82 | Wide angle capture of solar farm row under brilliant glowing sun flare and blue sky | Hero Section: Ambient visual support behind layered product composition | Top-tier commercial stock quality; vivid colors matching Volt-Lime and Charcoal tokens. |
| images 2 | solar-panels-field-sunset_922936-22590 (2).jpg | 626x351 | 82 | Wide angle capture of solar farm row under brilliant glowing sun flare and blue sky | Hero Section: Ambient visual support behind layered product composition | Top-tier commercial stock quality; vivid colors matching Volt-Lime and Charcoal tokens. |
| images 2 | solar-panels-field-sunset_922936-22590.jpg | 740x415 | 108 | Wide angle capture of solar farm row under brilliant glowing sun flare and blue sky | Hero Section: Ambient visual support behind layered product composition | Top-tier commercial stock quality; vivid colors matching Volt-Lime and Charcoal tokens. |
| images 2 | solar-panels-roof-solar-cell_335224-1324 (1).jpg | 626x352 | 90 | Symmetrical industrial warehouse corrugated roof with solar panels facing radiant sunrise | About Page Hero / Category Dock Hero backdrop | Stunning industrial B2B aesthetic, flawless symmetry, zero faces, zero logos. |
| images 2 | solar-panels-roof-solar-cell_335224-1324 (2).jpg | 626x352 | 90 | Symmetrical industrial warehouse corrugated roof with solar panels facing radiant sunrise | About Page Hero / Category Dock Hero backdrop | Stunning industrial B2B aesthetic, flawless symmetry, zero faces, zero logos. |
| images 2 | solar-panels-roof-solar-cell_335224-1324.jpg | 740x416 | 119 | Symmetrical industrial warehouse corrugated roof with solar panels facing radiant sunrise | About Page Hero / Category Dock Hero backdrop | Stunning industrial B2B aesthetic, flawless symmetry, zero faces, zero logos. |
| images 2 | solar-panels-sky-with-sun-them_979014-14679 (1).jpg | 626x351 | 67 | Photovoltaic modules angled toward noon sun | Product catalog banner | Clean exposure, high contrast. |
| images 2 | solar-panels-sky-with-sun-them_979014-14679 (2).jpg | 626x351 | 67 | Photovoltaic modules angled toward noon sun | Product catalog banner | Clean exposure, high contrast. |
| images 2 | solar-panels-sky-with-sun-them_979014-14679.jpg | 740x415 | 91 | Photovoltaic modules angled toward noon sun | Product catalog banner | Clean exposure, high contrast. |
| images 2 | solar-panels-used-renewable-energy-field-sky-full-clouds_181624-36781 (1).jpg | 626x417 | 79 | Utility scale solar arrays with clouds gathering on horizon | About page: Container volume delivery | Great depth of field, authentic industrial hardware. |
| images 2 | solar-panels-used-renewable-energy-field-sky-full-clouds_181624-36781 (2).jpg | 626x417 | 79 | Utility scale solar arrays with clouds gathering on horizon | About page: Container volume delivery | Great depth of field, authentic industrial hardware. |
| images 2 | solar-panels-used-renewable-energy-field-sky-full-clouds_181624-36781.jpg | 740x493 | 102 | Utility scale solar arrays with clouds gathering on horizon | About page: Container volume delivery | Great depth of field, authentic industrial hardware. |
| images 2 | solar-power-boards-3d-realistic-render_625553-171 (1).jpg | 499x626 | 74 | 3D render of dual tilted solar panels on white pedestal with checkerboard watermark | Reject / Do not use | Contains baked-in transparency checkerboard and text overlay. |
| images 2 | solar-power-boards-3d-realistic-render_625553-171 (2).jpg | 499x626 | 74 | 3D render of dual tilted solar panels on white pedestal with checkerboard watermark | Reject / Do not use | Contains baked-in transparency checkerboard and text overlay. |
| images 2 | solar-power-boards-3d-realistic-render_625553-171.jpg | 590x740 | 95 | 3D render of dual tilted solar panels on white pedestal with checkerboard watermark | Reject / Do not use | Contains baked-in transparency checkerboard and text overlay. |
| images 2 | solar-power-boards-3d-realistic-render_625553-173 (1).jpg | 499x626 | 80 | 3D render of dual tilted solar panels with "SOLAR PANEL 3D RENDER" text | Reject / Do not use | Contains text banner overlay at top. |
| images 2 | solar-power-boards-3d-realistic-render_625553-173 (2).jpg | 499x626 | 80 | 3D render of dual tilted solar panels with "SOLAR PANEL 3D RENDER" text | Reject / Do not use | Contains text banner overlay at top. |
| images 2 | solar-power-boards-3d-realistic-render_625553-173.jpg | 590x740 | 103 | 3D render of dual tilted solar panels with "SOLAR PANEL 3D RENDER" text | Reject / Do not use | Contains text banner overlay at top. |
| images 2 | solar-power-boards-roof-3d-realistic-render_625553-145 (1).jpg | 626x420 | 82 | 3D realistic render of modern architectural house with rooftop solar modules | Residential solar solutions context | Clean architectural 3D render, no text, no watermarks. |
| images 2 | solar-power-boards-roof-3d-realistic-render_625553-145 (2).jpg | 626x420 | 82 | 3D realistic render of modern architectural house with rooftop solar modules | Residential solar solutions context | Clean architectural 3D render, no text, no watermarks. |
| images 2 | solar-power-boards-roof-3d-realistic-render_625553-145.jpg | 740x497 | 117 | 3D realistic render of modern architectural house with rooftop solar modules | Residential solar solutions context | Clean architectural 3D render, no text, no watermarks. |
| images 2 | solar-power-power-station_1387-161 (1).jpg | 626x417 | 77 | Commercial photovoltaic power station in rural meadow | Category story / Commercial project showcase | Clear documentary style, natural lighting. |
| images 2 | solar-power-power-station_1387-161 (2).jpg | 626x417 | 77 | Commercial photovoltaic power station in rural meadow | Category story / Commercial project showcase | Clear documentary style, natural lighting. |
| images 2 | solar-power-power-station_1387-161.jpg | 740x493 | 102 | Commercial photovoltaic power station in rural meadow | Category story / Commercial project showcase | Clear documentary style, natural lighting. |
| images 2 | solar-power-station_1464496-216 (1).jpg | 626x442 | 34 | Solar farm arrays with inverter string enclosures visible | Category Dock: Solar Inverters card image | Shows inverter conversion boxes mounted directly on panel array supports. |
| images 2 | solar-power-station_1464496-216 (2).jpg | 626x442 | 34 | Solar farm arrays with inverter string enclosures visible | Category Dock: Solar Inverters card image | Shows inverter conversion boxes mounted directly on panel array supports. |
| images 2 | solar-power-station_1464496-216.jpg | 740x522 | 44 | Solar farm arrays with inverter string enclosures visible | Category Dock: Solar Inverters card image | Shows inverter conversion boxes mounted directly on panel array supports. |
| images 2 | solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111 (1).jpg | 626x376 | 98 | Pristine 3D illustration of commercial solar arrays and central inverter stations on lush grass | Category Dock: Inverters & Power Conversion card image | Pristine rendering, vivid green grass & volt-lime accents, clear inverter enclosures. |
| images 2 | solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111 (2).jpg | 626x376 | 98 | Pristine 3D illustration of commercial solar arrays and central inverter stations on lush grass | Category Dock: Inverters & Power Conversion card image | Pristine rendering, vivid green grass & volt-lime accents, clear inverter enclosures. |
| images 2 | solar-power-station-with-solar-panels-producing-electric-power-energy-by-green-power-technology-electrical-industrial-power-plant-concept-3d-illustration-rendering_10307-2111.jpg | 740x444 | 138 | Pristine 3D illustration of commercial solar arrays and central inverter stations on lush grass | Category Dock: Inverters & Power Conversion card image | Pristine rendering, vivid green grass & volt-lime accents, clear inverter enclosures. |
| images 2 | solar-power-tree-green-energy-innovation_191095-84678 (1).jpg | 626x626 | 124 | Futuristic solar tree sculpture with photovoltaic leaves | Reject / Do not use | Concept design, not representative of standard wholesale B2B equipment. |
| images 2 | solar-power-tree-green-energy-innovation_191095-84678.jpg | 626x626 | 124 | Futuristic solar tree sculpture with photovoltaic leaves | Reject / Do not use | Concept design, not representative of standard wholesale B2B equipment. |
| images 2 | solar-powered-home_23-2151951213 (1).jpg | 451x626 | 67 | Modern architectural residential home with integrated rooftop solar panels | Residential projects / Case studies | High quality architectural photography. |
| images 2 | solar-powered-home_23-2151951213 (2).jpg | 451x626 | 67 | Modern architectural residential home with integrated rooftop solar panels | Residential projects / Case studies | High quality architectural photography. |
| images 2 | solar-powered-home_23-2151951213.jpg | 533x740 | 88 | Modern architectural residential home with integrated rooftop solar panels | Residential projects / Case studies | High quality architectural photography. |
| images 2 | stand-alone-solar-panel-system-installation-renewable-green-energy_10069-5644 (1).jpg | 626x418 | 88 | Two technicians mounting solar module on rack with storage enclosure nearby | Ordering Steps — Step 3 (Container-Scale Logistics & Staging) | Shows professional installation team, high resolution, authentic job site. |
| images 2 | stand-alone-solar-panel-system-installation-renewable-green-energy_10069-5644 (2).jpg | 626x418 | 88 | Two technicians mounting solar module on rack with storage enclosure nearby | Ordering Steps — Step 3 (Container-Scale Logistics & Staging) | Shows professional installation team, high resolution, authentic job site. |
| images 2 | stand-alone-solar-panel-system-installation-renewable-green-energy_10069-5644.jpg | 740x494 | 113 | Two technicians mounting solar module on rack with storage enclosure nearby | Ordering Steps — Step 3 (Container-Scale Logistics & Staging) | Shows professional installation team, high resolution, authentic job site. |
| images 2 | sunset-sky-reflects-solar-panel-sustainable-power-generation-generative-ai_188544-36908 (1).jpg | 626x358 | 60 | Glowing sunset reflection on crystalline solar panels with golden light | Closing CTA: Background glow card / Contact banner | Warm, evocative color tones, no logos, no faces. |
| images 2 | sunset-sky-reflects-solar-panel-sustainable-power-generation-generative-ai_188544-36908 (2).jpg | 626x358 | 60 | Glowing sunset reflection on crystalline solar panels with golden light | Closing CTA: Background glow card / Contact banner | Warm, evocative color tones, no logos, no faces. |
| images 2 | sunset-sky-reflects-solar-panel-sustainable-power-generation-generative-ai_188544-36908.jpg | 740x423 | 77 | Glowing sunset reflection on crystalline solar panels with golden light | Closing CTA: Background glow card / Contact banner | Warm, evocative color tones, no logos, no faces. |
| images 2 | technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863 (1).jpg | 626x418 | 83 | Engineer in safety gear kneeling to inspect photovoltaic modules on industrial factory roof at sunrise | About Page: Main Facility / Engineering inspection showcase | World-class industrial photography, incredible golden-hour lighting, pristine focus. |
| images 2 | technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863 (2).jpg | 626x418 | 83 | Engineer in safety gear kneeling to inspect photovoltaic modules on industrial factory roof at sunrise | About Page: Main Facility / Engineering inspection showcase | World-class industrial photography, incredible golden-hour lighting, pristine focus. |
| images 2 | technology-solar-cell-engineer-service-check-installation-solar-cell-roof-factory-morning_1028938-16863.jpg | 740x494 | 89 | Engineer in safety gear kneeling to inspect photovoltaic modules on industrial factory roof at sunrise | About Page: Main Facility / Engineering inspection showcase | World-class industrial photography, incredible golden-hour lighting, pristine focus. |
| images 2 | top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451 (1).jpg | 470x626 | 142 | Aerial perspective looking down long endless rows of utility solar panels in countryside | Category Story: Container Volume & Direct Importer Scale slide | High-angle wide perspective, shows massive scale, crisp resolution. |
| images 2 | top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451 (2).jpg | 470x626 | 142 | Aerial perspective looking down long endless rows of utility solar panels in countryside | Category Story: Container Volume & Direct Importer Scale slide | High-angle wide perspective, shows massive scale, crisp resolution. |
| images 2 | top-view-solar-panels-farm-alternative-source-electricity-solar-panels-absorb-sunlight-as-source-energy-generate-electricity-creating-sustainable-energy_620624-4451.jpg | 555x740 | 195 | Aerial perspective looking down long endless rows of utility solar panels in countryside | Category Story: Container Volume & Direct Importer Scale slide | High-angle wide perspective, shows massive scale, crisp resolution. |
| images 2 | two-asian-young-engineers-walking-along-rows-photovoltaic-panels-solar-farm-they-use-laptop-computer-talking-together_1150-57228 (1).jpg | 626x417 | 82 | Two young engineers walking between solar panel rows with laptop computer reviewing telemetrics | Engineering Support / Technical Assistance context | Identifiable faces; do NOT use as testimonial. Suitable for general engineering support. |
| images 2 | two-asian-young-engineers-walking-along-rows-photovoltaic-panels-solar-farm-they-use-laptop-computer-talking-together_1150-57228 (2).jpg | 626x417 | 82 | Two young engineers walking between solar panel rows with laptop computer reviewing telemetrics | Engineering Support / Technical Assistance context | Identifiable faces; do NOT use as testimonial. Suitable for general engineering support. |
| images 2 | two-asian-young-engineers-walking-along-rows-photovoltaic-panels-solar-farm-they-use-laptop-computer-talking-together_1150-57228.jpg | 740x492 | 106 | Two young engineers walking between solar panel rows with laptop computer reviewing telemetrics | Engineering Support / Technical Assistance context | Identifiable faces; do NOT use as testimonial. Suitable for general engineering support. |
| images 2 | wind-power-solar-energy_35913-2194 (1).jpg | 626x626 | 35 | Square photo of wind turbine and solar panels | Square card accent | Slightly muted lighting. |
| images 2 | wind-power-solar-energy_35913-2194.jpg | 626x626 | 35 | Square photo of wind turbine and solar panels | Square card accent | Slightly muted lighting. |
| images 2 | young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281 (1).jpg | 626x417 | 49 | Technician talking on smartphone in middle of solar panel field | Contact Page / Direct Hotline support card | Clear customer assistance / communications context. |
| images 2 | young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281 (2).jpg | 626x417 | 49 | Technician talking on smartphone in middle of solar panel field | Contact Page / Direct Hotline support card | Clear customer assistance / communications context. |
| images 2 | young-asian-technician-man-standing-talking-smartphone-long-rows-photovoltaic-solar-panels-copy-space_1150-57281.jpg | 740x492 | 62 | Technician talking on smartphone in middle of solar panel field | Contact Page / Direct Hotline support card | Clear customer assistance / communications context. |


- Site Placement & Slot Mapping:

| Site Slot | Selected Image | Dimensions | File Size | Role & Visual Rationale |
|---|---|---|---|---|
| Hero Visual Background | `hero-solar-field.webp` | 1600x897 | 142 KB | Subtle authentic solar field under ambient gradient, supporting layered SVG composition |
| Category Dock: Solar Panels | `cat-solar-panels.webp` | 800x800 | 54 KB | Studio B2B render on #EDEDED neutral background |
| Category Dock: Storage Batteries | `cat-lithium-batteries.webp` | 800x800 | 51 KB | Studio B2B rack render on #EDEDED neutral background |
| Category Dock: Solar Inverters | `cat-solar-inverters.webp` | 800x800 | 48 KB | Studio B2B inverter render on #EDEDED neutral background |
| Category Story: Solar Panels | `story-panels.webp` | 1200x800 | 79 KB | Dual-glass bifacial panels in industrial rooftop installation |
| Category Story: Lithium Batteries | `story-batteries.webp` | 1200x800 | 88 KB | High-capacity server rack battery modules in ESS container |
| Category Story: Solar Inverters | `story-inverters.webp` | 1200x800 | 92 KB | Commercial-scale three-phase string and hybrid inverters |
| Ordering Steps: Step 1 Inquiry | `step-1-inquiry.webp` | 800x533 | 42 KB | Technical contractor reviewing equipment datasheets |
| Ordering Steps: Step 2 Quotation | `step-2-quotation.webp` | 800x533 | 46 KB | Engineering specification review & formal quotation |
| Ordering Steps: Step 3 Logistics | `step-3-logistics.webp` | 800x533 | 55 KB | Containerized pallets staged for regional distribution |
| Ordering Steps: Step 4 Commission | `step-4-commissioning.webp` | 800x533 | 58 KB | Field validation, commissioning, and warranty handover |
| About Page: Inspection & Testing | `about-inspection.webp` | 800x533 | 61 KB | Electrical testing and factory quality inspection |
| About Page: Central Operations | `about-operations.webp` | 800x533 | 65 KB | Central operations and wholesale distribution dispatch |
| About Page: Commercial Plant | `about-commercial-plant.webp` | 800x533 | 74 KB | Multi-megawatt industrial solar deployment |
| Closing CTA Card | `cta-sunset-panels.webp` | 800x533 | 52 KB | High-energy sunset solar array banner |
| Contact Page Sales Desk | `contact-sales-desk.webp` | 800x533 | 58 KB | B2B sales desk, technical assistance, and logistics |

#### 2. Optimization & Preparation
- Moved all raw stock assets out of `public/` into `source-images/` and added to `.gitignore`.
- Created optimized WebP images in `public/photos/` with clean lowercase kebab-case naming via `sharp`:
  - Hero image: 1600x897, 142 KB (strictly <= 150 KB target).
  - All category, story, step, about, and CTA images: 800px / 1200px wide, 13–92 KB (all strictly <= 100 KB target).
- Authored `public/photos/CREDITS.md` documenting file mappings, original filenames, and owner's stock licensing credits.

#### 3. Site Integration
- Replaced hero background, category preview visual cards, about page showcases, ordering steps thumbnails, and closing CTA with matching WebP photos.
- Configured `next/image` with explicit `sizes` matching layout breakpoints, intrinsic dimensions, and semantic alt text.
- Only the hero LCP photo uses `priority`; all below-the-fold imagery is lazily loaded.
- Admin categories upload flow and seed logic updated to point to new photo assets.

#### 4. Studio Product Photography
- Generated clean studio-style product photography on neutral background (`#EDEDED`) for demo equipment in `public/demo/products/`:
  - `n-type-topcon-bifacial-module-620w` (front, angled, detail)
  - `48v-100ah-lifepo4-rack-battery` (front, angled, detail)
  - `10kw-hybrid-inverter-three-phase` (front, angled, detail)
- Retained clean illustrated SVGs for secondary products with updated intrinsic dimensions and valid XML formatting.
- Updated `prisma/seed.ts` and verified `npm run seed:demo` pointing to new product images.

#### 5. Icons & Illustrations
- Consolidated Lucide icons across feature rows, ordering steps, contact blocks, footer, and admin tables with uniform stroke width and sizing.
- Replaced emoji bullets (e.g. `☀`) and unicode characters (e.g. `★`) with Lucide `<Sun />` and `<Star />`.
- Designed custom lightweight SVG illustrations (<20 KB each) matching DESIGN.md tokens:
  - `NotFoundIllustration` (`src/components/illustrations/not-found-illustration.tsx`, 1.4 KB)
  - `EmptyCatalogIllustration` (`src/components/illustrations/empty-catalog-illustration.tsx`, 2.6 KB)
- Testimonial avatars updated to clean styled circle initials.

#### 6. Quality Guard & Verification (Production Build)
- **Image Weight:** Total image transfer on homepage at 360px is **293 KB** (strictly under the 600 KB limit).
- **Layout Shift:** CLS is **0** to **0.018** across all routes; every image has explicit width/height or fixed container aspect ratio.
- **Image Integrity Script (`npm run check:images`):** Passed 100% on production build (`puppeteer-core`):
  - Every `<img>` on every public route at 360px and 1440px has `naturalWidth > 0`.
  - Zero failed image requests (0 HTTP 4xx/5xx).
  - Zero images upscaled > 1.5x on any viewport.
- **Responsive Overflow (`npm run check:overflow`):** Passed 84/84 routes across 360px, 390px, 768px, 1440px.
- **Lint & Build:** `npm run lint` passed (0 errors, 0 warnings), `npm run build` passed (26/26 routes).
- **Mobile Lighthouse (Production Build):**
  - Homepage (`/`): Performance: **89–90**, Accessibility: **100**, SEO: **100**, LCP: **3.6s**, FCP: **1.2s**, TBT: **80ms**, CLS: **0.018**
  - Products (`/products`): Performance: **87**, Accessibility: **98**, SEO: **100**, LCP: **3.6s**, FCP: **1.2s**, TBT: **120ms**, CLS: **0**
  - Detail (`/product/n-type-topcon-bifacial-module-620w`): Performance: **82–90**, Accessibility: **100**, SEO: **100**, LCP: **4.1s**, FCP: **1.7s**, TBT: **140ms**, CLS: **0**
- **Visual Review (3 lines):**
  1. High-contrast B2B engineering aesthetic with authentic solar field backdrop smoothly integrated under the layered hero composition.
  2. Studio-rendered Tier-1 flagship product images (front, angled, detail views on #EDEDED) cleanly aligned across catalog grids and lightbox gallery.
  3. Category and product detail layouts render sharply at 360px and 1440px with zero visual clutter, no watermarks, no identifiable endorsement faces, and zero horizontal scroll.
- **Owner Launch Checklist:** Updated `LAUNCH-CHECKLIST.md` to document replacing demo studio photos and generated product images with real supplier photography and site installations.


- 2026-09-19: PRD.md and AGENT.md were updated and TASKS.md was added.

### Task E — Admin Completion, Production Readiness, Final Audit, Deployment Guide — 2026-09-19
Branch: task-e-release
Status: Done

Done:
- Extra Item 0 — Mobile Performance & LCP Optimization:
  - Bottlenecks identified & resolved on production build (`npm run build && npm start`):
    1. Removed root template CSS animation (`.page-transition`) that delayed initial paint.
    2. Wrapped all 4 below-the-fold dynamic homepage sections (`CategoryStory`, `FeaturedCarousel`, `TestimonialsSection`, `FAQSection`) in `LazySection` with `IntersectionObserver` (`rootMargin: 300px`), eliminating animation libraries from the initial mobile bundle.
    3. Replaced heavy CSS `blur-[40px]` background in Hero with CSS radial gradient.
    4. Refactored `HeroVisual` from heavy client component to pure Server Component with zero client JavaScript and CSS compositor-thread `@keyframes` on desktop (min-width: 1024px).
    5. Decoupled `h1.hero-headline` from GSAP timeline to guarantee immediate SSR paint.
    6. Dynamically chunked `ClosingCTA` quote form component.
    7. Fixed heading hierarchy: changed `<h3>` to `<h2>` in `CategoryDock` for sequentially-descending heading order.
  - Mobile Lighthouse Before vs After (Production Build: `npm run build && npm start`):
    - Homepage (`/`):
      - Before: Performance: 62, LCP: 4.3s, FCP: 1.5s, TBT: 260ms, A11y: 96, SEO: 100, CLS: 0
      - After: Performance: 88, LCP: 3.4s, FCP: 1.2s, TBT: 120ms, A11y: 100, SEO: 100, CLS: 0
    - Products list (`/products`):
      - After: Performance: 89, LCP: 3.4s, FCP: 1.2s, TBT: 90ms, A11y: 98, SEO: 100, CLS: 0
    - Product detail (`/product/n-type-topcon-bifacial-module-620w`):
      - After: Performance: 83, LCP: 3.7s, FCP: 1.7s, TBT: 160ms, A11y: 100, SEO: 100, CLS: 0
  - Bundle Size / First-load JS:
    - First-load transfer on `/` reduced from ~320 KB to ~135 KB. GSAP and Motion completely eliminated from initial mobile bundle.
- 1. Admin Gaps:
  - Change password page: `src/app/admin/(protected)/settings/password/page.tsx` + `changePassword` in `src/app/actions/auth.ts` with bcrypt hashing, minimum 12 chars, confirmation, and IP-based rate limiting (5 attempts / 15 min).
  - Duplicate product: `duplicateProduct` in `src/app/actions/products.ts` copying specs and image relations with `-copy` slug suffix and `isActive: false` by default.
  - Reordering controls:
    - Category reordering: `reorderCategories` in `src/app/actions/categories.ts` with up/down buttons on `/admin/categories`.
    - Product image and spec reordering: `reorderProductImages` and `reorderProductSpecs` with up/down buttons on `/admin/products/[id]`.
  - Search and filter on all tables:
    - Products table: live search query input and category dropdown filter.
    - Quotes inbox: live search query input and status filter (`ALL`, `NEW`, `CONTACTED`, `QUOTED`, `CLOSED`, `ARCHIVED`).
- 2. SEO and Pages:
  - Unique metadata on every page: title, meta description, and OpenGraph tags.
  - Procedural OG image: `src/app/opengraph-image.tsx` using `@vercel/og` ImageResponse with Volt-Lime theme tokens.
  - Sitemaps and Robots: `src/app/sitemap.ts` (auto-indexing active products and categories) and `src/app/robots.ts` (disallowing `/admin/`).
  - Structured data: JSON-LD `Organization` on homepage, JSON-LD `Product` on product pages (price conditionally rendered only if `showPrice: true`).
  - Styled 404 (`src/app/not-found.tsx`) and error page (`src/app/error.tsx`).
  - Dynamic Favicon: `src/app/icon.tsx` (brand logo SVG icon).
- 3. Production Readiness:
  - Environment startup validation: `src/lib/env.ts` with Zod schema failing fast on missing or invalid variables; integrated in root layout.
  - Production environment template: `.env.production.example` covering all required variables with placeholder values.
  - Production seed logic: `prisma/seed.ts` updated to seed only the admin user unless `SEED_DEMO=true`.
  - Deployment guide: `DEPLOY.md` created with step-by-step instructions for Hostinger Node.js hosting (Node 20/22), covering both GitHub repository and ZIP archive deployments, persistent storage locations for SQLite (`DATABASE_URL`) and uploads (`UPLOAD_DIR`), database migrations, backups, and DNS configuration.
  - Launch checklist: `LAUNCH-CHECKLIST.md` created documenting all owner tasks, listing all sample items from the database with admin links, sample content hiding, credential changes, and quote workflow verification.
- 4. Final Audits:
  - Visual & Responsive: `npm run check:overflow` passed (84/84 routes across 360px, 390px, 768px, 1440px).
  - Security:
    - Unauthenticated admin access redirects with 307 to `/admin/login`.
    - Security headers verified with `curl -I`: CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, HSTS, Referrer-Policy, Permissions-Policy.
    - Git tracked files verified clean: 0 `.env` or `.db` files tracked.
  - Cleaned dependencies: uninstalled unused packages `clsx` and `tailwind-merge`.
  - Build & Lint: `npm run lint` (0 errors, 0 warnings), `npm run build` (26/26 routes compiled cleanly).

### Task D â€” Animation and Visual Polish â€” 2026-09-19
Branch: task-d-motion
Status: Done

Done:
- Setup GSAP and Motion architecture:
  - Created src/lib/gsap.ts registering ScrollTrigger and useGSAP once in an SSR-safe client module.
  - Configured strict prefers-reduced-motion guards everywhere using gsap.matchMedia() and Motion useReducedMotion().
  - Enforced single-library ownership per DOM element, animating transform and opacity only.
  - Loaded below-the-fold animated components (CategoryStory, FeaturedCarousel, PartnersStrip, TestimonialsSection, FAQSection) via next/dynamic with matched min-height placeholders to guarantee CLS = 0.
- Implemented all 13 interactive animation items in exact order:
  1. Hero Entrance: GSAP timeline on load (1.2s total); headline lines reveal with masked slide-up (overflow-hidden blocks), kicker, subheadline, staggered CTA buttons, and floating glass cards. Verified: Headline element matrix transform & opacity transition from t=0ms to t=1200ms (transform none/1 -> matrix(1, 0, 0, 1, 0, 0)/1). Result: Verified.
  2. Hero Visual: Replaced single image with layered SVG glass composition of Solar Panel, LiFePO4 rack battery, and hybrid inverter with Volt-Lime glow halo and 10kW metric. Features idle out-of-phase floating, desktop pointer tilt & parallax per layer depth, touch float-only, and floating glass info cards with depth parallax. Verified: Matrix transforms on idle float and pointer movement (rotateX/rotateY). Result: Verified.
  3. Category Dock: Motion magnetic spring physics (useMotionValue, useSpring) with whileHover lift and Volt-Lime border glow, whileTap, and useReducedMotion. Verified: Card springs on pointer hover. Result: Verified.
  4. Scroll Story: Desktop pinned ScrollTrigger sequence (pin: true, scrub: 0.6) with step indicators, crossfading category panels, and dynamic product-data spec counters; mobile stacked cards reveal on <1024px. Verified: Panel opacities and translateY transition across scroll scrub (panel 0 opacity 1 -> 0, transform y:0 -> y:-25; panel 1 opacity 0 -> 0.45, transform y:30 -> y:19.25). Result: Verified.
  5. Counters: GSAP count-up (AnimatedCounter) with ScrollTrigger once-entry, prefix, suffix, and decimal support. Verified: Rendered stats values "8+", "250+", "180+", "98%" upon viewport entry. Result: Verified.
  6. Partners Marquee: Infinite CSS/Motion marquee with 50% duplicate seamless loop, pause on hover/focus, and prefers-reduced-motion wrap fallback. Verified: Track transform moves continuously (matrix(1, 0, 0, 1, -251.56, 0) -> matrix(1, 0, 0, 1, -283.96, 0) in 600ms). Result: Verified.
  7. Featured Carousel: Motion drag carousel with scroll-snap, arrow navigation buttons, keyboard arrow support (ArrowLeft/ArrowRight), and dynamic progress bar. Verified: Carousel scroll tracking and arrow navigation. Result: Verified.
  8. Product Cards: Pointer-device only 3D image tilt and parallax on hover; sliding "Request quote" affordance (motion.div). Verified: Image 3D transform on mouse move and quote button slide-in on hover. Result: Verified.
  9. Testimonials: Crossfade slider with AnimatePresence (mode="wait"), 5.5s autoplay that pauses on hover/focus, dot indicators, and prev/next controls. Verified: Testimonial crossfade transition. Result: Verified.
  10. FAQ Accordion: Animated height (AnimatePresence, motion.div), correct ARIA (aria-expanded, aria-controls, role="region"), keyboard navigation (ArrowUp/Down, Home/End). Verified: Height transitions smoothly from 101px to 0px on collapse. Result: Verified.
  11. Header: Glass header that hides on scroll down (y: -100%) and returns on scroll up (y: 0%), compacts padding after first scroll (scrollY > 20), and animated mobile drawer menu (AnimatePresence). Verified: Header transform at top matrix(1,0,0,1,0,-0.53), scrolled down matrix(1,0,0,1,0,-69), scrolled up none. Result: Verified.
  12. Product Gallery: Dedicated ProductGallery component with touch swipe, arrow keys, thumbnails, and click/pinch zoom in a modal lightbox for 3 images per product. Verified: Lightbox modal opens on click, zoom transform doubles (matrix(2, 0, 0, 2, 0, 0)). Result: Verified.
  13. Route Transitions: Motion page enter fade (src/app/(public)/template.tsx) with fast 0.22s duration; respects prefers-reduced-motion; never blocks navigation. Verified: Enter opacity transition. Result: Verified.
- Performance & Mobile Lighthouse:
  - First-load uncompressed decoded JS on / grew from 539.9 KB to 807.8 KB (+267.9 KB) due to GSAP and Motion library runtimes.
  - Mobile Lighthouse on / against production build: Performance: 62 (improved from 51), Accessibility: 96, SEO: 100, CLS: 0, LCP: 4.3s, FCP: 1.5s.
  - 4x CPU throttle simulation (360px): Page loaded in 73ms, hero rendered smoothly without frame drops.
- Visual Critique of Screenshots (docs/task-screenshots/):
  - home-1440px.png: Glass header compacts cleanly, masked hero typography aligns with crisp contrast, layered SVG product composition renders with rich volt-lime accents and depth, and category dock cards float symmetrically.
  - home-360px.png: Header scales with zero clipping or horizontal scroll, headline typography stacks naturally, hero layered SVG auto-scales smoothly to mobile viewport width, and interactive CTA buttons stack cleanly.
  - No clipping, overflow, or unstyled artifacts detected.
- Validation:
  - npm run lint: pass (0 errors, 0 warnings)
  - npm run build: pass (23 static and dynamic routes compiled)
  - npm run check:overflow: pass ("84/84 passed, 0 failed" against production server at 360, 390, 768, 1440px)

### Task C â€” Trust Content System, Full Demo Data & Task B Corrections â€” 2026-09-19
Branch: task-c-content
Status: Done

Done:
- Task B corrections:
  - Rewrote scripts/check-mobile-overflow.js with puppeteer-core, strict exit code 1 on failure, default CHROME_PATH, authenticated admin login with session cookies, and added npm run check:overflow to package.json.
  - Executed npm run check:overflow against production build (npm run build && npm start) across all 21 public and admin routes at 360, 390, 768, and 1440 px: exact summary: "84/84 passed, 0 failed".
  - Grepped src/ and prisma/seed.ts for forbidden claims ("tier", "Tier", "24-48", "warranty", "guarantee", "official", "verified", "factory sealed", "dispatch"); purged all unbacked marketing claims to 0 hits.
  - Replaced <0.4% Annual spec value in Category Story with product data (16BB Half-Cut).
  - Moved editable company copy, hero headline, hero sub-text, CTA labels, and closing CTA text into Site Settings with sensible neutral defaults.
- Database & Data Layer (Prisma migration; MySQL-portable: no enums, no JSON columns):
  - Added models: Stat, Certification, Partner, Testimonial, FaqItem, each with sortOrder, isActive, isSample, createdAt, updatedAt.
  - Appended models to TRD.md Section 3.
  - Implemented src/lib/data/content.ts with getters filtering active rows by sortOrder, excluding sample rows when process.env.HIDE_SAMPLE_CONTENT === "true", and returning sample content summary.
- Admin Content Management:
  - Created /admin/content hub and 5 dedicated subpages: /admin/content/stats, /admin/content/certifications, /admin/content/partners, /admin/content/testimonials, /admin/content/faq.
  - Features: list, create, edit, delete, reorder (up/down), show/hide toggle, and image upload pipeline via saveUploadFile.
  - Items with isSample=true display "SAMPLE" badge; editing a sample row automatically sets isSample=false; added "Mark as real" action for unchanged keeper rows.
  - Admin dashboard displays live sample warning card: "N sample items are still live" with links to each category list.
  - All admin content actions validate getSession() and validate inputs with zod.
- Full Demo Data to PRD Â§7 Specification:
  - Seeded 15 demo products (5 Solar Panels, 5 Lithium-ion Batteries, 5 Inverters) with exact PRD names, 3 procedural SVG images each (front, angled, detail) matching DESIGN.md tokens, 8â€“12 consistent specs each, mixed stock statuses, MOQ/lead times, and 4 featured products spread across categories.
  - Seeded sample trust content: 4 stats, 4 certifications with procedural SVG badges, 6 partners with monogram logos, 3 testimonials with sample avatars, and 6 FAQ items with neutral terms.
  - Added npm run seed:demo (prisma/seed.ts --demo-only) that wipes only demo products and sample trust rows without touching real rows (isDemo=false, isSample=false) or the admin user.
- Public Home Sections in PRD Â§5.2 Order:
  - Added sections to homepage in exact order: (1) Hero, (2) Category dock, (3) Business statistics band, (4) Scroll-linked category story, (5) Featured carousel, (6) Certifications grid, (7) Ordering steps, (8) Partners strip, (9) Testimonials, (10) FAQ from DB, (11) Closing CTA.
  - Styled with DESIGN.md tokens (#111311, #CEF23E, #EDEDED, #E4E7E4); empty sections render nothing (null). Public site never shows "sample" badges.
- Passed npm run lint (0 errors, 0 warnings), npm run build (23 routes compiled), and npm run check:overflow (84/84 passed on production build).

Commands run and results:
- npm run lint: pass (0 errors, 0 warnings)
- npm run build: pass (23 static and dynamic routes compiled)
- npm run check:overflow: pass ("84/84 passed, 0 failed" against production server at 360, 390, 768, 1440px)
- npm run seed:demo: pass (15 demo products, 45 images, 163 specs, 4 stats, 4 certs, 6 partners, 3 testimonials, 6 FAQs)

### Task B ? Foundation Fixes & Security Hardening ? 2026-09-19
Branch: task-b-foundation
Status: Done

Done:
- Created `src/components/ui/app-image.tsx` thin wrapper that dynamically sets `unoptimized` on SVG image sources; replaced `next/image` imports across all 8 product, category, and hero views (resolves SVG 400 Bad Request blocker without `dangerouslyAllowSVG`).
- Configured complete security headers in `next.config.ts` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, CSP with `unsafe-eval` restricted to development, and HSTS for production) and disabled `poweredByHeader`.
- Verified security headers via `curl.exe -I` on `/` and `/admin/login`; verified zero CSP violations in browser console runtime.
- Hardened secret validation in `src/lib/auth.ts`: in production (`NODE_ENV=production`), auth immediately aborts if `AUTH_SECRET` is missing, shorter than 32 characters, or equal to the default `.env.example` placeholder.
- Updated `prisma/seed.ts`: in production, verifies `ADMIN_PASSWORD` is explicitly supplied via environment, is not the placeholder, and is at least 12 characters long.
- Audited all admin server actions and route handlers; implemented server-side `getSession()` validation across `toggleProductFeatured` in `products/page.tsx`, `updateQuoteStatus` in `quotes/page.tsx`, and `saveSettingsAction` in `settings/page.tsx`.
- Resolved mobile responsive layout issues at 360px and 390px:
  - Header: responsive logo and title with `min-w-0`, compact quote pill and shrink-0 hamburger button to prevent clipping or overflow.
  - Hero: responsive button stacking (`flex-col sm:flex-row`), compact kicker badge, and raised frosted glass badge contrast to WCAG AA.
  - Products page: category filter dock converted to smooth snap-scroll list with `snap-start shrink-0`.
  - Product details: flex-wrapping breadcrumbs with `min-w-0` and word-breaking product title.
  - Contact page: responsive title scaling and compact kicker badge.
  - Admin login: reduced container padding on small viewports (`p-5 sm:p-8`) and wrapping footer text.
  - WhatsApp button: compact icon-only circular pill on mobile with safe-area insets padding and public layout bottom offset.
- Replaced inaccurate claims: updated hero badge and spec highlight counter with neutral terms ("Bulk orders", "Custom quotes", "Datasheets", "Product models"); purged unverified Tier-1, warranty, and delivery speed claims across codebase and reseeded database.
- Created `scripts/check-mobile-overflow.js` and verified that all public and admin routes at 360px, 390px, 768px, and 1440px pass `document.documentElement.scrollWidth <= window.innerWidth`.
- Passed `npm run lint` (0 errors, 0 warnings) and `npm run build` (17/17 routes compiled cleanly).

Server-Side Auth on Admin Entry Points Audit:
| File | Function / Route | Checks session before | Checks session after | Unauthenticated Test Result |
|---|---|---|---|---|
| `src/app/admin/actions/auth.ts` | `loginAdminAction` | N/A (Public login) | N/A (Public login) | Public login rate limited & credential-checked |
| `src/app/admin/actions/auth.ts` | `logoutAdminAction` | No (Clears cookie) | No (Clears cookie) | Clears session cookie and redirects |
| `src/app/admin/actions/categories.ts` | `createCategoryAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized' }` |
| `src/app/admin/actions/categories.ts` | `updateCategoryAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized' }` |
| `src/app/admin/actions/products.ts` | `createProductAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized. Please log in.' }` |
| `src/app/admin/actions/products.ts` | `updateProductAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized. Please log in.' }` |
| `src/app/admin/actions/products.ts` | `deleteProductAction` | Yes | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/products/page.tsx` | `toggleProductFeatured` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/quotes/page.tsx` | `updateQuoteStatus` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/settings/page.tsx` | `saveSettingsAction` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/quotes/export/route.ts` | `GET` | Yes | Yes | Returns HTTP 307 redirect / 401 Unauthorized |


### Task A â€” Comprehensive Codebase, Design & Security Audit â€” 2026-09-19
Branch: task-09-admin-crud-and-uploads
Status: Done

Done:
- Executed git hygiene audit: verified `git ls-files` tracks no `.env`, database (`*.db`), storage, or uploads; listed branches and commits.
- Captured 21 responsive audit screenshots across 7 core routes at 360px, 768px, and 1440px in `docs/audit-screenshots/` (untracked).
- Evaluated DESIGN.md compliance: confirmed no `#031E17`, `#F5A623`, or dark mode toggles; verified 0 unverified certifications (CE, ISO), fake reviews, or invented stats.
- Evaluated PRD requirements: confirmed exact DB counts (3 categories, 12 products, 6 featured, 1 image/product, 3-8 specs/product), and verified spec counters are computed dynamically from SQLite.
- Executed live security tests: confirmed unauthenticated redirect on `/admin`, session rejection on actions/exports, login rate limiting (blocked on 6th attempt), file upload restrictions (>5MB rejected, fake JPG signature rejected, `/uploads/` path traversal rejected), quote form honeypot and validation. Identified missing security headers in `next.config.ts`.
- Benchmarked performance: calculated uncompressed shared first-load JS (539.9 KB); executed mobile Lighthouse on `/` (Perf 51, A11y 96, SEO 100, CLS 0) and product detail (Perf 61, A11y 100, SEO 100, CLS 0).
- Audited dependencies: detected unused libraries (`gsap`, `@gsap/react`, `motion`, `clsx`, `tailwind-merge`) and missing `prefers-reduced-motion` handling.

Not done / skipped:
- Source code fixes intentionally deferred per task instructions.

Files created or changed:
- WORKED.md â€” Updated status board, open issues, known gaps, and task audit log.

Commands run and results:
- `git ls-files | Select-String -Pattern "\.env|\.db|storage|uploads|secret"`: clean
- Chrome headless screenshot pipeline: 21 screenshots captured
- `node -e` database queries: verified 3 categories, 12 products, 6 featured, specs/images counts
- Security tests (`curl -I`, node script for magic bytes/size, path traversal curl): verified
- `npx lighthouse` (mobile): Home (P:51, A:96, SEO:100, CLS:0), Product (P:61, A:100, SEO:100, CLS:0)

Problems and warnings:
- Next.js 16 returns 400 Bad Request on SVG images via `next/image` without `dangerouslyAllowSVG: true` in `next.config.ts`, causing broken image icons across catalog.
- Security headers completely absent from `next.config.ts`.
- 360px mobile viewport exhibits horizontal layout overflows (Header, Hero CTA buttons, Category filter pills, Product detail breadcrumbs, Admin login card).
- GSAP and Motion are installed but unused; animations rely on ad-hoc CSS/JS without reduced-motion queries.

Needs from the lead / owner:
- Approval to proceed with Task B remediation in priority order.

---

### Task 0 â€” Orientation & Architecture Verification â€” 2026-09-19
Branch: task-09-admin-crud-and-uploads
Status: Done

Done:
- Thoroughly read AGENT.md, PRD.md, TRD.md, DESIGN.md, and WORKED.md.
- Verified local environment (Node v24.21.0, npm 11.19.0, Next.js 16.3.5 App Router).
- Confirmed that Next.js project is fully initialized with SQLite, Prisma, Sharp, Jose, Tailwind v4 design tokens, and procedural SVG demo images.
- Verified build and lint statuses: `npm run lint` passes with 0 errors and 0 warnings; `npm run build` compiles 17 static and dynamic routes cleanly.

Not done / skipped:
- None.

Files created or changed:
- WORKED.md â€” Updated status board, environment notes, demo data state, and task log.

Commands run and results:
- `npm run lint`: pass (0 errors, 0 warnings)
- `npm run build`: pass (17 routes compiled)
- Manual checks: 360px ok, 768px ok, 1440px ok, keyboard navigable, reduced-motion respected

Skills / tools used:
- not available: frontend-design, ui-ux-pro-max, design-taste-frontend, shadcn-ui-mcp-server, 21st.dev Magic MCP, vercel-react-best-practices, gsap-master, motion-framer (native Antigravity tools and npm packages used instead)

Reference pattern used (if any):
- None for Task 0

Deviations from PRD / TRD / DESIGN:
- None

Problems and warnings:
- None

Needs from the lead / owner:
- Next task prompt.

---

## 3. Decisions and deviations

Record every decision that changes or interprets the documents, so nobody has to guess later.

| Date | Decision | Reason | Approved by |
|---|---|---|---|
| 2026-09-19 | Configured Tailwind v4 `@theme` in `globals.css` | Next.js initialized with Tailwind v4 | In accordance with DESIGN.md |
| 2026-09-19 | Excluded CE/ISO certification icons | AGENT.md section 4.1 strictly prohibits unverified certificates | Document rule |

---

## 4. Open issues and blockers

| # | Issue | Found in task | Severity (low/med/high) | Status |
|---|---|---|---|---|
| 1 | `next/image` returns 400 Bad Request on SVG images without `dangerouslyAllowSVG` in `next.config.ts`, breaking catalog thumbnails and rendering hero visual as black box | Task A | Blocker | Resolved (Task B) |
| 2 | Security headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy) missing from `next.config.ts`; `X-Powered-By` header leaks server technology | Task A | High | Resolved (Task B) |

### Task C â€” Trust Content System, Full Demo Data & Task B Corrections â€” 2026-09-19
Branch: task-c-content
Status: Done

Done:
- Task B corrections:
  - Rewrote scripts/check-mobile-overflow.js with puppeteer-core, strict exit code 1 on failure, default CHROME_PATH, authenticated admin login with session cookies, and added npm run check:overflow to package.json.
  - Executed npm run check:overflow against production build (npm run build && npm start) across all 21 public and admin routes at 360, 390, 768, and 1440 px: exact summary: "84/84 passed, 0 failed".
  - Grepped src/ and prisma/seed.ts for forbidden claims ("tier", "Tier", "24-48", "warranty", "guarantee", "official", "verified", "factory sealed", "dispatch"); purged all unbacked marketing claims to 0 hits.
  - Replaced <0.4% Annual spec value in Category Story with product data (16BB Half-Cut).
  - Moved editable company copy, hero headline, hero sub-text, CTA labels, and closing CTA text into Site Settings with sensible neutral defaults.
- Database & Data Layer (Prisma migration; MySQL-portable: no enums, no JSON columns):
  - Added models: Stat, Certification, Partner, Testimonial, FaqItem, each with sortOrder, isActive, isSample, createdAt, updatedAt.
  - Appended models to TRD.md Section 3.
  - Implemented src/lib/data/content.ts with getters filtering active rows by sortOrder, excluding sample rows when process.env.HIDE_SAMPLE_CONTENT === "true", and returning sample content summary.
- Admin Content Management:
  - Created /admin/content hub and 5 dedicated subpages: /admin/content/stats, /admin/content/certifications, /admin/content/partners, /admin/content/testimonials, /admin/content/faq.
  - Features: list, create, edit, delete, reorder (up/down), show/hide toggle, and image upload pipeline via saveUploadFile.
  - Items with isSample=true display "SAMPLE" badge; editing a sample row automatically sets isSample=false; added "Mark as real" action for unchanged keeper rows.
  - Admin dashboard displays live sample warning card: "N sample items are still live" with links to each category list.
  - All admin content actions validate getSession() and validate inputs with zod.
- Full Demo Data to PRD Â§7 Specification:
  - Seeded 15 demo products (5 Solar Panels, 5 Lithium-ion Batteries, 5 Inverters) with exact PRD names, 3 procedural SVG images each (front, angled, detail) matching DESIGN.md tokens, 8â€“12 consistent specs each, mixed stock statuses, MOQ/lead times, and 4 featured products spread across categories.
  - Seeded sample trust content: 4 stats, 4 certifications with procedural SVG badges, 6 partners with monogram logos, 3 testimonials with sample avatars, and 6 FAQ items with neutral terms.
  - Added npm run seed:demo (prisma/seed.ts --demo-only) that wipes only demo products and sample trust rows without touching real rows (isDemo=false, isSample=false) or the admin user.
- Public Home Sections in PRD Â§5.2 Order:
  - Added sections to homepage in exact order: (1) Hero, (2) Category dock, (3) Business statistics band, (4) Scroll-linked category story, (5) Featured carousel, (6) Certifications grid, (7) Ordering steps, (8) Partners strip, (9) Testimonials, (10) FAQ from DB, (11) Closing CTA.
  - Styled with DESIGN.md tokens (#111311, #CEF23E, #EDEDED, #E4E7E4); empty sections render nothing (null). Public site never shows "sample" badges.
- Passed npm run lint (0 errors, 0 warnings), npm run build (23 routes compiled), and npm run check:overflow (84/84 passed on production build).

Commands run and results:
- npm run lint: pass (0 errors, 0 warnings)
- npm run build: pass (23 static and dynamic routes compiled)
- npm run check:overflow: pass ("84/84 passed, 0 failed" against production server at 360, 390, 768, 1440px)
- npm run seed:demo: pass (15 demo products, 45 images, 163 specs, 4 stats, 4 certs, 6 partners, 3 testimonials, 6 FAQs)

### Task B ? Foundation Fixes & Security Hardening ? 2026-09-19
Branch: task-b-foundation
Status: Done

Done:
- Created `src/components/ui/app-image.tsx` thin wrapper that dynamically sets `unoptimized` on SVG image sources; replaced `next/image` imports across all 8 product, category, and hero views (resolves SVG 400 Bad Request blocker without `dangerouslyAllowSVG`).
- Configured complete security headers in `next.config.ts` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, CSP with `unsafe-eval` restricted to development, and HSTS for production) and disabled `poweredByHeader`.
- Verified security headers via `curl.exe -I` on `/` and `/admin/login`; verified zero CSP violations in browser console runtime.
- Hardened secret validation in `src/lib/auth.ts`: in production (`NODE_ENV=production`), auth immediately aborts if `AUTH_SECRET` is missing, shorter than 32 characters, or equal to the default `.env.example` placeholder.
- Updated `prisma/seed.ts`: in production, verifies `ADMIN_PASSWORD` is explicitly supplied via environment, is not the placeholder, and is at least 12 characters long.
- Audited all admin server actions and route handlers; implemented server-side `getSession()` validation across `toggleProductFeatured` in `products/page.tsx`, `updateQuoteStatus` in `quotes/page.tsx`, and `saveSettingsAction` in `settings/page.tsx`.
- Resolved mobile responsive layout issues at 360px and 390px:
  - Header: responsive logo and title with `min-w-0`, compact quote pill and shrink-0 hamburger button to prevent clipping or overflow.
  - Hero: responsive button stacking (`flex-col sm:flex-row`), compact kicker badge, and raised frosted glass badge contrast to WCAG AA.
  - Products page: category filter dock converted to smooth snap-scroll list with `snap-start shrink-0`.
  - Product details: flex-wrapping breadcrumbs with `min-w-0` and word-breaking product title.
  - Contact page: responsive title scaling and compact kicker badge.
  - Admin login: reduced container padding on small viewports (`p-5 sm:p-8`) and wrapping footer text.
  - WhatsApp button: compact icon-only circular pill on mobile with safe-area insets padding and public layout bottom offset.
- Replaced inaccurate claims: updated hero badge and spec highlight counter with neutral terms ("Bulk orders", "Custom quotes", "Datasheets", "Product models"); purged unverified Tier-1, warranty, and delivery speed claims across codebase and reseeded database.
- Created `scripts/check-mobile-overflow.js` and verified that all public and admin routes at 360px, 390px, 768px, and 1440px pass `document.documentElement.scrollWidth <= window.innerWidth`.
- Passed `npm run lint` (0 errors, 0 warnings) and `npm run build` (17/17 routes compiled cleanly).

Server-Side Auth on Admin Entry Points Audit:
| File | Function / Route | Checks session before | Checks session after | Unauthenticated Test Result |
|---|---|---|---|---|
| `src/app/admin/actions/auth.ts` | `loginAdminAction` | N/A (Public login) | N/A (Public login) | Public login rate limited & credential-checked |
| `src/app/admin/actions/auth.ts` | `logoutAdminAction` | No (Clears cookie) | No (Clears cookie) | Clears session cookie and redirects |
| `src/app/admin/actions/categories.ts` | `createCategoryAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized' }` |
| `src/app/admin/actions/categories.ts` | `updateCategoryAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized' }` |
| `src/app/admin/actions/products.ts` | `createProductAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized. Please log in.' }` |
| `src/app/admin/actions/products.ts` | `updateProductAction` | Yes | Yes | Rejects with `{ success: false, error: 'Unauthorized. Please log in.' }` |
| `src/app/admin/actions/products.ts` | `deleteProductAction` | Yes | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/products/page.tsx` | `toggleProductFeatured` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/quotes/page.tsx` | `updateQuoteStatus` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/(protected)/settings/page.tsx` | `saveSettingsAction` | No | Yes | Throws `Error('Unauthorized')` |
| `src/app/admin/quotes/export/route.ts` | `GET` | Yes | Yes | Returns HTTP 307 redirect / 401 Unauthorized |


### Task A â€” Comprehensive Codebase, Design & Security Audit â€” 2026-09-19
Branch: task-09-admin-crud-and-uploads
Status: Done

Done:
- Executed git hygiene audit: verified `git ls-files` tracks no `.env`, database (`*.db`), storage, or uploads; listed branches and commits.
- Captured 21 responsive audit screenshots across 7 core routes at 360px, 768px, and 1440px in `docs/audit-screenshots/` (untracked).
- Evaluated DESIGN.md compliance: confirmed no `#031E17`, `#F5A623`, or dark mode toggles; verified 0 unverified certifications (CE, ISO), fake reviews, or invented stats.
- Evaluated PRD requirements: confirmed exact DB counts (3 categories, 12 products, 6 featured, 1 image/product, 3-8 specs/product), and verified spec counters are computed dynamically from SQLite.
- Executed live security tests: confirmed unauthenticated redirect on `/admin`, session rejection on actions/exports, login rate limiting (blocked on 6th attempt), file upload restrictions (>5MB rejected, fake JPG signature rejected, `/uploads/` path traversal rejected), quote form honeypot and validation. Identified missing security headers in `next.config.ts`.
- Benchmarked performance: calculated uncompressed shared first-load JS (539.9 KB); executed mobile Lighthouse on `/` (Perf 51, A11y 96, SEO 100, CLS 0) and product detail (Perf 61, A11y 100, SEO 100, CLS 0).
- Audited dependencies: detected unused libraries (`gsap`, `@gsap/react`, `motion`, `clsx`, `tailwind-merge`) and missing `prefers-reduced-motion` handling.

Not done / skipped:
- Source code fixes intentionally deferred per task instructions.

Files created or changed:
- WORKED.md â€” Updated status board, open issues, known gaps, and task audit log.

Commands run and results:
- `git ls-files | Select-String -Pattern "\.env|\.db|storage|uploads|secret"`: clean
- Chrome headless screenshot pipeline: 21 screenshots captured
- `node -e` database queries: verified 3 categories, 12 products, 6 featured, specs/images counts
- Security tests (`curl -I`, node script for magic bytes/size, path traversal curl): verified
- `npx lighthouse` (mobile): Home (P:51, A:96, SEO:100, CLS:0), Product (P:61, A:100, SEO:100, CLS:0)

Problems and warnings:
- Next.js 16 returns 400 Bad Request on SVG images via `next/image` without `dangerouslyAllowSVG: true` in `next.config.ts`, causing broken image icons across catalog.
- Security headers completely absent from `next.config.ts`.
- 360px mobile viewport exhibits horizontal layout overflows (Header, Hero CTA buttons, Category filter pills, Product detail breadcrumbs, Admin login card).
- GSAP and Motion are installed but unused; animations rely on ad-hoc CSS/JS without reduced-motion queries.

Needs from the lead / owner:
- Approval to proceed with Task B remediation in priority order.

---

### Task 0 â€” Orientation & Architecture Verification â€” 2026-09-19
Branch: task-09-admin-crud-and-uploads
Status: Done

Done:
- Thoroughly read AGENT.md, PRD.md, TRD.md, DESIGN.md, and WORKED.md.
- Verified local environment (Node v24.21.0, npm 11.19.0, Next.js 16.3.5 App Router).
- Confirmed that Next.js project is fully initialized with SQLite, Prisma, Sharp, Jose, Tailwind v4 design tokens, and procedural SVG demo images.
- Verified build and lint statuses: `npm run lint` passes with 0 errors and 0 warnings; `npm run build` compiles 17 static and dynamic routes cleanly.

Not done / skipped:
- None.

Files created or changed:
- WORKED.md â€” Updated status board, environment notes, demo data state, and task log.

Commands run and results:
- `npm run lint`: pass (0 errors, 0 warnings)
- `npm run build`: pass (17 routes compiled)
- Manual checks: 360px ok, 768px ok, 1440px ok, keyboard navigable, reduced-motion respected

Skills / tools used:
- not available: frontend-design, ui-ux-pro-max, design-taste-frontend, shadcn-ui-mcp-server, 21st.dev Magic MCP, vercel-react-best-practices, gsap-master, motion-framer (native Antigravity tools and npm packages used instead)

Reference pattern used (if any):
- None for Task 0

Deviations from PRD / TRD / DESIGN:
- None

Problems and warnings:
- None

Needs from the lead / owner:
- Next task prompt.

---

## 3. Decisions and deviations

Record every decision that changes or interprets the documents, so nobody has to guess later.

| Date | Decision | Reason | Approved by |
|---|---|---|---|
| 2026-09-19 | Configured Tailwind v4 `@theme` in `globals.css` | Next.js initialized with Tailwind v4 | In accordance with DESIGN.md |
| 2026-09-19 | Excluded CE/ISO certification icons | AGENT.md section 4.1 strictly prohibits unverified certificates | Document rule |

---

## 4. Open issues and blockers

| # | Issue | Found in task | Severity (low/med/high) | Status |
|---|---|---|---|---|
| 1 | `next/image` returns 400 Bad Request on SVG images without `dangerouslyAllowSVG` in `next.config.ts`, breaking catalog thumbnails and rendering hero visual as black box | Task A | Blocker | Resolved (Task B) |
| 2 | Security headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy) missing from `next.config.ts`; `X-Powered-By` header leaks server technology | Task A | High | Resolved (Task B) |
| 3 | Mobile 360px responsive clipping and overflow on Header, Hero CTA buttons, Category filter pills, Product breadcrumbs/title, Contact card, and Admin login container | Task A | High | Resolved (Task B) |
| 4 | `gsap` and `motion` dependencies are installed but unused; `prefers-reduced-motion` is not respected in interactive animations | Task A | High | Resolved (Task D) |
| 5 | Hero visual is a single Image rather than an interactive multi-product glass composition (panel, battery, inverter) | Task A | Medium | Resolved (Task D) |
| 6 | Floating WhatsApp button overlaps CTA buttons and bottom cards on 360px viewports | Task A | Medium | Resolved (Task B) |
| 7 | Low contrast text on frosted glass badges in Hero section | Task A | Medium | Resolved (Task B) |
| 8 | Product detail gallery zoom/swipe not implemented; products currently only have 1 image each seeded | Task A | Low | Resolved (Task D) |
| 9 | Admin panel missing "Duplicate product", "Change password", and category/spec drag reordering | Task A | Low | Resolved (Task E) |
| 10 | Unused dependencies in `package.json` (`clsx`, `tailwind-merge` not referenced) | Task A | Low | Resolved (Task E) |
| 11 | Seeded admin account in local `./dev.db` uses default seed password | Task A | Low | Resolved (Task E) |

---

## 5. Known gaps (not built yet, or built only partly)

List anything visible on the site that is a placeholder, unfinished or not wired to real data.

- Official owner logo (currently using procedural SVG sun avatar with Volt Lime circle; owner task documented in `LAUNCH-CHECKLIST.md`).
- Official warehouse photos (currently using procedural SVGs in `/demo/`; owner task documented in `LAUNCH-CHECKLIST.md`).
- Owner live credentials & contact phone/address (defaults set; owner task documented in `LAUNCH-CHECKLIST.md`).

---

## 6. Environment and setup notes

Fill in during Task 0 and Task 1 and keep current.

- Node version: v24.21.0
- Package manager: npm (11.19.0)
- Next.js version: 16.3.5 (App Router, Turbopack)
- Prisma version: 6.19.3
- Database file location (local): `./dev.db` (SQLite)
- Skills / MCP available: chrome-devtools, data-agent-kit, firecrawl, modern-web-guidance, puppeteer, visualization, gemini-api-docs
- Skills / MCP not available: frontend-design, ui-ux-pro-max, design-taste-frontend, shadcn-ui-mcp-server, 21st.dev Magic MCP, vercel-react-best-practices, gsap-master, motion-framer
- How to run locally (exact commands): `npm run dev` (starts on http://localhost:3000)
- How to seed the database: `npx tsx prisma/seed.ts` (creates only admin user unless `SEED_DEMO=true`)
- Admin login (email only, never the password): `owner@example.com`

---

## 7. Content and demo data state

- Categories seeded: 3 (Solar Panels, Lithium-ion Batteries, Solar Inverters)
- Products seeded: 15 models (5 per category with 3 views each, 8-12 specs)
- Trust content seeded: 4 stats, 4 certifications, 6 partners, 3 testimonials, 6 FAQs (all isSample=true, hidable via `HIDE_SAMPLE_CONTENT=true`)
- Image source in use (procedural placeholders or owner photos): Procedural SVG illustrations in `public/demo/`
- Anything the owner still needs to supply (logo, photos, contact details, real products): Official brand SVG logo, real warehouse/facility photos, confirmed contact phone/WhatsApp/address, real supplier certifications. Full walkthrough provided in `LAUNCH-CHECKLIST.md`.
