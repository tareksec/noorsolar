# AGENT.md — Noor Solar Energy website

You are the **junior developer**. The **lead developer** (Claude, via the owner) writes your tasks as prompts.
Read this file, `PRD.md`, `TRD.md` and `DESIGN.md` **before every task**. Priority when they conflict:

1. The task prompt you were given
2. `DESIGN.md` (visual system) — wins over your own taste and over skills
3. `TRD.md` (how to build) and `PRD.md` (what to build)
4. This file

If two documents conflict or something is unclear, **stop and ask in your report**. Do not guess silently.

---

## 1. Project in one paragraph

Noor Solar Energy is a Bangladeshi B2B importer and seller of exactly three product types: **solar panels, lithium-ion batteries, inverters**. The site is a catalog with quote requests. There is **no cart, no payment, no customer accounts**. The owner edits everything later from an **admin panel**, so all products, categories, images and text start as **demo data** that you generate.

Goal of the design: an **interactive, modern, impressive** site with excellent animation, while staying fast on mid-range phones.

---

## 2. Working rules

- Do **only** the current task. Do not start the next one. Do not add features that were not requested.
- Work on a git branch per task (`task-NN-short-name`). Commit small, meaningful commits. Never commit `.env`, databases, or uploads.
- After the task, run and report: `npm run lint`, `npm run build`, and the manual checks listed in the task.
- **Update `WORKED.md` at the end of every task**: set the task's row in the status board, add a Task log entry (newest first), and record any decisions, open issues, known gaps and environment notes. Only write what is true and verified. Never delete old entries. Your chat report and the `WORKED.md` entry must match.
- Report format (always): **1) What I did, 2) Files created/changed, 3) Commands run, 4) Problems, warnings, deviations, 5) What I need from the lead.**
- If a skill or MCP listed below is **not available** in your environment, say so at the top of your report, continue using the guidance in this file, and never pretend you used it.
- Do not add a new dependency that is not in `TRD.md` without asking first. Propose it in the report with the reason.
- Never put secrets, passwords, FTP or hosting credentials in code, docs or chat. Use `.env` and keep `.env.example` updated.
- Do not edit `PRD.md`, `TRD.md`, `DESIGN.md` or this file unless the task tells you to.
- `npm run check:motion` must pass before any branch is merged, and no animation may be removed unless the owner asks.

---

## 3. Skills and tools you must use

Use these deliberately, in this order for any UI work: **plan → pick components → build → animate → critique**.

| Skill / tool | Use it for | Rules |
|---|---|---|
| `frontend-design` | Design thinking: subject-grounded choices, type, layout, restraint, self-critique | Write a short design plan (colors, type, layout, principles) before coding each major section. Where `DESIGN.md` already decides something, follow `DESIGN.md`. |
| `ui-ux-pro-max` | UX flows, spacing, hierarchy, accessibility, interaction states | Every interactive element needs hover, focus-visible, active, disabled and loading states. |
| `design-taste-frontend` and https://www.tasteskill.dev/ | Taste calibration, avoiding generic AI-looking UI | Read before designing each section. If its advice conflicts with `DESIGN.md`, `DESIGN.md` wins. |
| `shadcn-ui-mcp-server` | Fetching accurate shadcn/ui components (forms, dialog, table, tabs, accordion, sheet, toast) | Use for the **admin panel** and for form controls. Restyle to `DESIGN.md` tokens on the public site. |
| `21st.dev Magic MCP` | Component inspiration and generation | Treat output as a **starting point**. Adapt to our tokens, remove unused code, check it is accessible. Do not paste large components unchanged. |
| `vercel-react-best-practices` | React and Next.js quality and performance | See section 5. |
| `gsap-master` and https://gsap.com/ | Scroll-driven and timeline animation | See section 4. |
| `motion-framer` | Component-level animation (Motion, formerly Framer Motion) | See section 4. |

**Installed but not applicable to this project — do not use unless the lead approves in writing:**

- `convex-create-component`: we do **not** use Convex. Our backend is Prisma + SQLite (see `TRD.md`).
- `vercel-react-native-skills`: this is a **web** project, not React Native.

---

## 4. Design and animation direction

### 4.1 Source of truth

`DESIGN.md` defines colors, typography, radii, shadows and components (eco-futuristic minimalism with glass surfaces, volt-lime accent, pill buttons). It was written for an EV-charger dashboard. **Reuse the visual system, replace the content**:

- Hero and dock content become Noor Solar content (solar panel, lithium-ion battery, inverter). See `PRD.md` section 5.
- **Do not put CE, ISO or other certification icons into the hero, the feature row or product data.** Certifications appear only in the editable Certifications section, as sample content (see `PRD.md` section 7). The hero feature row uses neutral icons (Bulk orders, Custom quotes, Datasheets).
- Statistics, certifications, partners and testimonials follow the **sample content policy** in `PRD.md` section 7: editable, flagged `isSample`, generic, never presented as verified fact in code comments or docs. Anything else about the company (delivery times, warranty terms, years, awards, guarantees) must not be invented: read it from site settings or leave it out.
- Any brand color from the earlier setup task (dark green `#031E17`, amber `#F5A623`) is **replaced** by the `DESIGN.md` tokens. Migrate tokens into Tailwind theme variables and delete unused ones.
- `DESIGN.md` defines a light theme only. Keep the site light. The dark-mode toggle from the earlier setup task is removed in the design-migration task; add a dark theme later only if a task asks for it.

### 4.2 Reference sites (inspiration for interaction patterns only)

- https://progress-template.framer.website/
- https://energypower.framer.website/
- https://polariyon.framer.website/

These are commercial templates. **Do not copy their layout, images, text or code.** Study the patterns and build our own:

- Full-bleed hero with a confident headline and one clear call to action
- Animated number counters that count up when scrolled into view
- Horizontally scrolling text marquee band
- Horizontal card carousel with arrow buttons and drag
- Sticky, scroll-linked sections (image stays, steps change)
- Hover-reveal lists (row expands or an image follows the cursor)
- Accordion FAQ
- Large closing call-to-action section with a background image and a compact footer

### 4.2b How to use the references well

- If the task names a reference section (for example "the counter section from the Progress site"), **open the URL in a browser tool if you have one** and study how it behaves: timing, easing, what triggers it, what happens on mobile. Text descriptions alone lose this.
- If the owner attaches screenshots, match the **structure and feel**, then make it ours with `DESIGN.md` tokens and Noor Solar content.
- In your report, say which reference pattern you used and how your version differs.

### 4.3 Animation principles

Aim for **a few memorable moments, not motion everywhere**.

Signature moments for this site (build these well):

1. **Hero entrance:** one orchestrated timeline on load (headline lines, glass cards, product visual settle in).
2. **Hero visual:** interactive glass illustration of solar panel, battery and inverter that responds to pointer or device tilt (subtle parallax and rotation). Procedural only (CSS/SVG or react-three-fiber primitives), no downloaded 3D models.
3. **Category dock:** three pill cards with a magnetic or lift hover and a smooth expand into the category page.
4. **Scroll-linked category story:** pinned section where each category (panels, batteries, inverters) takes its turn with its visual and key specs.
5. **Spec counters** that count up, driven by real product data (see `PRD.md`).
6. **Product cards:** image tilt or parallax on hover, quick "Request quote" affordance.
7. **Page transitions and route feedback:** simple, fast, no blocking.

Everything else: keep quiet. Do not fade-and-slide-up every section. Do not add hover effects to every card.

### 4.4 Which library does what

- **GSAP** (`gsap`, `@gsap/react`, ScrollTrigger): timelines, scroll-linked and pinned sections, counters, marquee, hero sequence.
  - Use the `useGSAP` hook with a `scope` ref. Register plugins once in a client module. Clean up on unmount.
  - Use `gsap.matchMedia()` for responsive and reduced-motion variants.
- **Motion** (`motion`, import from `motion/react`): component-level animation: hover/tap, layout animations, `AnimatePresence` for menus, dialogs, accordions and the mobile nav, drag carousel.
- **Never animate the same element property with both libraries.** One owner per element.
- Animate only `transform` and `opacity` where possible. Avoid animating layout properties (`width`, `height`, `top`) on large areas.

### 4.5 Quality floor for animation

- Respect `prefers-reduced-motion`: replace movement with instant or fade states. Disable parallax, pinning and marquee motion.
- Heavy visuals (canvas/WebGL) must be **lazy loaded**, only when near the viewport, and disabled on small or low-power devices with a static fallback image.
- No layout shift caused by animation. Reserve space for animated elements.
- Target 60 fps on a mid-range Android phone. If a scene janks, simplify it.
- All content must be readable and usable with animation disabled.

---

## 5. Code standards (Next.js and React)

- Next.js App Router, TypeScript strict, Tailwind, shadcn/ui where useful.
- **Server Components by default.** Add `"use client"` only to small interactive leaf components.
- Fetch data on the server (Prisma) and pass plain props down. No client-side fetching for page content.
- Avoid request waterfalls; use `Promise.all` and `Suspense` boundaries with skeletons.
- Dynamic-import heavy client code (`three`, large GSAP scenes, carousels) with `next/dynamic`.
- Use `next/image` (with correct `sizes`), `next/font`, the Metadata API, and route-level `loading.tsx` / `error.tsx` / `not-found.tsx`.
- Validate all external input (forms, admin input, uploads) on the server with `zod`.
- Keep components small, typed, and named by what they are. No dead code, no commented-out blocks, no `any`.
- Accessibility is required: semantic HTML, labels for inputs, `alt` text, visible `:focus-visible`, color contrast AA, keyboard navigation for menu, carousel, accordion and dialogs.

---

## 6. Content rules (demo data)

- Everything on the site is **demo** until the owner edits it. Mark demo products with the `isDemo` flag in the database, and show a small "Demo" tag only inside the admin.
- Product names must be generic and clearly fictional or generic-spec style (for example "N-Type TOPCon 620W Bifacial Module", "48V 100Ah LiFePO4 Rack Battery", "10kW Hybrid Inverter"). **No real brand names or logos.** Certifications, statistics, partners and testimonials follow the sample content policy in `PRD.md` section 7.
- Product specs must be plausible and internally consistent (a 620W panel has a realistic voltage/current, a 5kWh battery has a realistic capacity, and so on).
- Images: use **owner-supplied photos** from `public/demo/photos/` when they exist. Otherwise generate **procedural placeholder images** (SVG or gradient-based illustrations that fit the design). Do not download images from the internet yourself. Every image needs meaningful `alt` text.
- The full demo product list and per-product requirements are in `PRD.md` section 7.
- Copy: short, plain, specific. Active voice. Sentence case. Buttons say what they do ("Request quote", not "Submit").
- All text that the owner may change must come from the database or `site-settings`, not be hard-coded in components.

---

## 7. Definition of done (every task)

- [ ] Matches the task prompt exactly and nothing extra
- [ ] `npm run lint` and `npm run build` pass with no errors
- [ ] Works at 360px, 768px and 1440px widths
- [ ] Keyboard usable, visible focus, reduced-motion respected
- [ ] No hard-coded secrets, no unused dependencies, no console errors
- [ ] Report written in the format from section 2
