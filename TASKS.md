# TASKS.md — Remaining work to a publishable site

These are the prompts for the local agent, in order. Give **one task at a time**. Each task ends with a short chat report; the detailed evidence goes into `WORKED.md`.
This list **replaces** the task plan in `TRD.md` section 12.

| Task | Goal |
|---|---|
| B | Foundation: images, security, secrets, admin protection, mobile layout |
| C | Trust content system (statistics, certifications, partners, testimonials, FAQ), demo data to full spec |
| D | Animation and visual polish (the interactive, impressive layer) |
| E | Admin completion, production readiness, final audit and fixes, deployment guide |

---

## TASK B — Foundation: images, security, admin protection, mobile layout

```
Read AGENT.md, PRD.md, TRD.md, DESIGN.md and WORKED.md first.

TASK B — Foundation fixes.
Create branch `task-b-foundation` from the current branch. Do ONLY the items below. Do not add, remove or upgrade dependencies.

1. IMAGES (blocker)
- /_next/image rejects SVG files with 400. Do NOT enable dangerouslyAllowSVG.
- Create src/components/ui/app-image.tsx: a thin wrapper around next/image that sets `unoptimized` when the src ends with .svg and passes everything else through unchanged.
- Use it for all product, category and hero images. Confirm no 400 errors in the network tab, the hero visual renders, and every product card shows its image.

2. SECURITY HEADERS (next.config.ts)
- poweredByHeader: false.
- headers() for all routes:
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' (add 'unsafe-eval' ONLY when NODE_ENV is development); font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  Strict-Transport-Security: only when NODE_ENV === "production".
- Verify with curl -I on / and /admin/login, and load the main pages in a headless browser to confirm there are no CSP violations in the console. If something legitimately breaks, make the smallest change and explain it.

3. SECRETS
- In production (NODE_ENV=production) auth must refuse to run if AUTH_SECRET is missing, shorter than 32 characters, or equal to the placeholder in .env.example. The dev fallback may exist only when NODE_ENV is not production.
- Seed script: read ADMIN_EMAIL and ADMIN_PASSWORD from env. In production, abort with a clear message if the password is the placeholder or shorter than 12 characters. Never print passwords.

4. SERVER-SIDE AUTH ON EVERY ADMIN ENTRY POINT
- List every admin server action, and every route handler under /admin and any write or export route. Confirm each calls getSession() itself before doing any work. Add the check wherever it is missing.
- Write a table in WORKED.md: file, function, checks session (yes/no) before and after your change. Test at least one function from each file with no session.

5. MOBILE LAYOUT (must work at 360, 390, 768, 1024, 1440)
Fix these known problems:
- Header: the "Quote" pill is clipped and the menu button is pushed off-screen.
- Hero: the "Browse Catalog" button is cut off and the top pill text overflows.
- Products page: the category filter dock overflows. Make it horizontally scrollable with scroll-snap, or wrap it.
- Product detail: breadcrumbs and the product title clip. Use wrapping and min-w-0.
- Contact page: the title clips.
- Admin login card: too wide at 360px. Reduce padding and let the footer line wrap.
- Floating WhatsApp button overlaps buttons and cards. Make it smaller on mobile, respect safe-area insets, and add bottom padding on pages so it never covers a primary action.
- Hero glass badge text has low contrast. Raise it to at least WCAG AA.
Then write a script (puppeteer) that opens every public route and every admin route at 360px, 390px, 768px and 1440px and checks `document.documentElement.scrollWidth <= window.innerWidth`. All must pass.

6. INACCURATE CLAIMS
- Replace the hero badge "24-48h Wholesale dispatch across Bangladesh" and the "Tier 1" counter label (`totalTier1Models`) with neutral wording ("Bulk orders", "Custom quotes", "Datasheets", and "Product models"). Delivery times, warranty, years and awards must never be invented; read them from site settings or leave them out.
- Search src/, prisma/seed.ts and the database for similar statements of fact about the company and report what you changed.

7. FINISH
- `npm run lint` and `npm run build` must pass.
- Update WORKED.md (status board, Task log, Open issues). Do not write a long audit.
- Chat report: maximum 25 lines: what works now, anything you could not do, decisions you need from me.
Commit in small commits. Do not continue to the next task.
```

---

## TASK C — Trust content system and full demo data

```
Read AGENT.md, PRD.md, TRD.md, DESIGN.md and WORKED.md first. PRD.md section 5.2 and section 7 (sample content policy) changed, so re-read them carefully.

TASK C — Trust content system and full demo data.
Create branch `task-c-content` from the task-b branch (or from main if task-b is merged).

1. DATABASE (Prisma migration; keep it portable to MySQL: no enums, no JSON columns)
Add models, each with `id`, `sortOrder Int @default(0)`, `isActive Boolean @default(true)`, `isSample Boolean @default(true)`, `createdAt`, `updatedAt`:
- Stat: label, value Float, prefix String?, suffix String?, description String?
- Certification: name, issuer String?, description String?, image String?
- Partner: name, logo String?, url String?
- Testimonial: quote, authorName, authorRole String?, company String?, photo String?
- FaqItem: question, answer
Append these models to TRD.md section 3 (this is the one allowed edit of TRD.md).

2. DATA LAYER
- get functions for each type return only active rows, ordered by sortOrder.
- If process.env.HIDE_SAMPLE_CONTENT === "true", exclude rows where isSample is true.
- Public sections render nothing when they have no rows.

3. ADMIN
- New "Content" area with pages for statistics, certifications, partners, testimonials and FAQ: list, create, edit, delete, reorder (up/down buttons are fine), show/hide toggle, image upload for logos and photos through the existing upload pipeline.
- Rows with isSample=true show a "SAMPLE" badge. Saving an edit that changes any content field sets isSample=false. Also add a "Mark as real" button for rows the owner keeps unchanged.
- Dashboard shows a warning card: "N sample items are still live" with links to each list.
- Every action checks getSession() first and validates input with zod.

4. SEED SAMPLE CONTENT (all isSample=true; generic and plausible; no real companies, people, logos or named standards)
- Stats (4): Years in business, Projects supplied, Happy clients, Success rate (98%). Choose plausible values.
- Certifications (4): "Quality management certificate", "Product testing certificate", "Safety compliance certificate", "Trade license". Each with a procedural badge image.
- Partners (6): "Partner company 1" to "6", each with a simple procedural monogram logo in the design style.
- Testimonials (3): natural, short quotes, authors written as "Sample customer", role "Procurement manager", company "Sample company" (and similar), so it is obvious they are placeholders in the admin.
- FAQ (6): quote process, minimum order, datasheets, delivery, payment, after-sales support. Write answers that do not promise specifics; use wording like "Contact our sales team for current terms".
The public site must NOT show any "sample" label. Only the admin does.

5. PRODUCT DEMO DATA TO FULL PRD SPEC (PRD.md section 7)
- 15 products, 5 per category, with the exact names listed in the PRD.
- 3 procedural images per product (front, angled, detail) in a consistent, high quality illustration style that matches DESIGN.md (glass surfaces, volt-lime accents). Meaningful alt text. If the owner has added photos to public/demo/photos/, use them instead.
- 8 to 12 realistic, internally consistent spec rows per product.
- Short and long descriptions, mixed stock statuses, MOQ and lead time on some products, 3 to 4 featured products spread across categories.
- Category images and the hero images updated to match.
- Reseed cleanly: provide `npm run seed:demo` that wipes only demo rows and recreates them, without touching real rows (isDemo=false) or the admin user.

6. PUBLIC SECTIONS (layout and static design only; motion comes in Task D)
Add these sections to the home page in the PRD 5.2 order: statistics band, certifications, partners strip, testimonials, FAQ (now from the database). Style them with DESIGN.md tokens. Product-data counters stay in the category story.

7. SETTINGS
Make the hero headline, hero sub-text, the CTA labels and the closing CTA text editable in Settings, with sensible defaults.

8. FINISH
- Lint and build pass. Check 360, 768 and 1440 for the new sections (no horizontal overflow).
- Update WORKED.md. Chat report: maximum 25 lines.
```

---

## TASK D — Animation and visual polish

```
Read AGENT.md (especially section 4), PRD.md, TRD.md, DESIGN.md and WORKED.md first.

TASK D — Animation and visual polish.
Create branch `task-d-motion` from the task-c branch.
The owner is disappointed that the site currently shows no visible animation. Make it feel interactive, modern and impressive, while staying fast. Use GSAP (with @gsap/react and ScrollTrigger) and Motion (`motion/react`) as described in AGENT.md section 4.4. Do NOT add three.js or any 3D library: build the hero visual with layered SVG/CSS.
If the listed design skills are not installed, take screenshots with puppeteer or chrome-devtools after each major effect and critique your own result; remove anything that feels cluttered.

Build these, in this order:

1. HERO ENTRANCE (GSAP timeline on load, about 1.2 s total)
Headline lines reveal with masked slide-up, sub-text and buttons follow, glass cards settle in with a slight stagger.

2. HERO VISUAL (replaces the single image)
A layered glass composition made of three products: a solar panel, a lithium battery rack unit and an inverter, drawn as SVG with frosted glass surfaces, volt-lime highlights and soft shadows in the DESIGN.md style.
- Idle: slow floating motion with different phases per layer.
- Desktop: pointer parallax and slight tilt per layer depth.
- Touch devices: gentle automatic float only.
- Small floating glass info cards (product type and key spec) with their own parallax.

3. CATEGORY DOCK
Three pill cards with a magnetic hover (Motion), a lift and glow, and a smooth transition when navigating to the category.

4. SCROLL STORY (desktop, 1024px and wider)
A pinned ScrollTrigger section where the three categories take turns: large product visual, key specs and counters change as the user scrolls. On smaller screens it becomes stacked cards with a simple reveal.

5. COUNTERS
Count-up (GSAP) for the statistics band and the product-data counters, triggered once when entering the viewport. Support prefix, suffix and decimals.

6. PARTNERS MARQUEE
Smooth infinite marquee, pauses on hover and focus, duplicated content for seamless looping.

7. FEATURED CAROUSEL
Motion drag carousel with scroll-snap, arrow buttons, keyboard support and progress indicator.

8. PRODUCT CARDS
On pointer devices only: subtle image tilt and parallax on hover, and a "Request quote" affordance that slides in.

9. TESTIMONIALS
Crossfade slider with AnimatePresence, autoplay that pauses on hover and focus, dots and arrow controls.

10. FAQ ACCORDION
Animated height with correct aria attributes and keyboard support.

11. HEADER
Glass header that hides when scrolling down and returns when scrolling up, and compacts slightly after the first scroll. Animated mobile menu.

12. PRODUCT GALLERY
Swipe on touch, arrow keys, thumbnails, click or pinch to zoom in a lightbox. Works with the 3 images per product.

13. ROUTE TRANSITIONS
Subtle, fast fade or slide between pages. Never block navigation.

RULES AND QUALITY
- prefers-reduced-motion: no movement, no pinning, no marquee scroll, counters show final values, carousels use plain scrolling. Use gsap.matchMedia() and Motion's useReducedMotion.
- One library owns each element. Animate transform and opacity only where possible.
- Register GSAP plugins once in a client module. Use the useGSAP hook with a scope ref. Clean up ScrollTriggers on unmount. Call ScrollTrigger.refresh() after fonts and images load.
- Load below-the-fold animated components with next/dynamic. No layout shift from animation.
- Do not fade-and-slide every section. Motion belongs to the moments listed above only.
- Test at 360, 768 and 1440. Simulate a slow phone (4x CPU throttle) and report whether the hero stays smooth.
- Report how much first-load JS for / grew, and how the production build (npm run build && npm start) performs in mobile Lighthouse for / (Performance, LCP, CLS). Fix regressions you caused.
- No console errors or hydration warnings.

FINISH
Lint and build pass. Update WORKED.md. Chat report: maximum 25 lines.
```

---

## TASK E — Admin completion, production readiness, final audit, deployment guide

```
Read AGENT.md, PRD.md, TRD.md, DESIGN.md and WORKED.md first.

TASK E — Finish, harden, audit, and prepare deployment.
Create branch `task-e-release` from the task-d branch.

1. ADMIN GAPS
- Change password page (current password, new password of at least 12 characters, confirmation). Rate limited.
- Duplicate product (copies specs and images, new slug, inactive by default).
- Reorder categories, product images and spec rows (up/down buttons are fine).
- Logout works from every admin page; a session that expires redirects to login.
- Every table has search or filter where it helps (products, quotes).

2. SEO AND PAGES
- Unique title, description and Open Graph tags on every page; a default OG image (procedural).
- sitemap.xml includes categories and active products. robots.txt blocks /admin.
- JSON-LD: Organization on home, Product on product pages (price only if showPrice is true).
- Styled 404 and error pages. Favicon from the logo placeholder.

3. PRODUCTION READINESS
- Validate environment variables at startup with zod (fail fast with clear messages).
- `.env.production.example` with every variable and no real values.
- Seed for production creates only the admin user unless SEED_DEMO=true.
- DATABASE_URL and UPLOAD_DIR must point outside the deployed code folder in production; document this.
- `npm run build` and `npm start` work from a clean checkout (`npm ci` first).
- Create DEPLOY.md: step by step for Hostinger Node.js web hosting (Node 20 or 22), covering both ways of deploying (from a GitHub repository, and from an uploaded ZIP if Hostinger supports it; check Hostinger documentation with your web tools and quote what you verified), the build and start commands, environment variables, running `prisma migrate deploy`, creating the admin user, persistent folders for the database and uploads, backups, first login and password change, how to test on a temporary URL, and the DNS steps to switch noorsolaren.com last. State clearly which steps the owner does. Never include real credentials.
- Create LAUNCH-CHECKLIST.md: owner tasks before going public: replace every SAMPLE item (list them from the database at the time of writing, with admin page links), real logo and photos, contact details, real products, change the admin password, set HIDE_SAMPLE_CONTENT if any sample item remains, review all text, test the quote form end to end.

4. FINAL AUDIT ON A PRODUCTION BUILD (npm run build && npm start; never audit the dev server)
Check and FIX everything you find except owner-supplied content:
- Visual check of every public and admin page at 360, 768 and 1440. No overflow, no broken images, no console errors or hydration warnings.
- Mobile Lighthouse on /, /products and one product page. Targets: Performance 90 or higher, Accessibility 95 or higher, SEO 95 or higher, LCP under 2.5 s, CLS under 0.1. If you miss Performance, find the causes (images, JS, fonts, animation) and fix them; report what you changed.
- Keyboard-only walkthrough: header menu, carousel, accordion, gallery, quote form, admin login.
- Security: repeat unauthenticated admin access tests, admin actions without a session, upload tests (oversized, wrong type, disguised file, path traversal), quote form spam tests, security headers with curl -I, no secrets in git (`git ls-files`).
- Quote flow end to end: submit on the site, see it in the admin, change status, export CSV.
- Upload flow end to end: create a product with three uploaded images, view it on the public site.
- Remove unused dependencies and dead code. Confirm the total list of dependencies against TRD.md and note approved additions.

5. GIT
- Merge the task branches into main in order, with the working site on main. Tag it `v1.0-rc1`.

6. FINISH
- Update WORKED.md completely: status board, final audit results (table of what was checked, result, and what you fixed), remaining owner tasks, known limitations.
- Chat report: maximum 30 lines: what is verified, what still needs the owner, and any risk you see for deployment.
```
