# Current State of the Project — Noor Solar Energy

> **Document Status:** Active Snapshot  
> **Verification Date:** October 2026  
> **Source Base:** Direct codebase inspection, database schema analysis, and verified production build.

---

## 1. Project Purpose & Business Domain

- **Company:** Noor Solar Energy
- **Location & Market:** Bangladesh (commercial, industrial, and agricultural solar market).
- **Core Business:** Direct importer and B2B wholesale distributor of:
  1. **Solar Panels:** N-Type TOPCon bifacial and high-efficiency Mono PERC modules.
  2. **Solar Batteries:** LiFePO4 (Lithium Iron Phosphate) server-rack, wall-mount, and high-voltage containerized systems.
  3. **Solar Inverters:** Commercial three-phase on-grid string inverters and hybrid storage inverters.
  4. **Energy Storage Systems (BESS):** Commercial turnkey energy storage for factory peak-shaving and backup.
- **Operating Model:** **Catalog & Request For Quote (RFQ)**.
  - The website does NOT conduct online checkout, accept payments, or offer shopping carts.
  - Every conversion pathway directs buyers to submit a detailed quotation request, start a direct WhatsApp inquiry, or phone the Dhaka sales office.

---

## 2. Technology Stack

| Layer | Technology | Version / Configuration | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `16.3.8` (runs on React 19) | Server Components, routing, Server Actions |
| **Language** | TypeScript | `^5.0.0` (Strict mode) | Type safety across models, components, data layer |
| **Runtime Engine** | Node.js | `22` (supports `>=20.0.0`) | Host execution environment |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss` (`^4.0.16`) | Modern utility styling with `@theme` CSS variables |
| **Database ORM** | Prisma | `^6.4.1` | Type-safe ORM for SQLite & MySQL |
| **Database Engine** | SQLite (Default) | `dev.db` / `production.db` | Local file-based transactional storage |
| **Internationalization** | `next-intl` | `^4.14.5` | Subpath routing (`/` English, `/bn` Bangla) |
| **Animation & Motion** | GSAP & Motion | `gsap` `^3.15.0`, `motion` `^13.4.0`, `lenis` `^1.3.26` | ScrollTrigger, smooth scroll, dock interactions |
| **Authentication** | `jose` & `bcryptjs` | `jose` `^6.2.12`, `bcryptjs` `^3.0.3` | Custom HS256 signed JWT session cookies |
| **Image Processing** | `sharp` | `^0.35.4` | Server-side image resizing and WebP conversion |
| **Validation** | Zod | `^4.6.5` | Schema validation for forms, uploads, env vars |
| **Markdown** | `react-markdown` | `^10.1.0` + `remark-gfm` `^4.0.1` | Admin blog rendering with GFM support |

---

## 3. Architecture & Directory Structure

The project uses Next.js App Router with an architectural split between public localized routes and isolated admin management.

```text
noorsolar-main/
├── ai/                          # Universal AI Project Brain (Instructions, Decisions, Known Issues, Current State)
├── docs/                        # Lighthouse reports, motion studies, Bangla glossary
├── messages/                    # Translation catalogs (en.json, bn.json)
├── prisma/
│   ├── schema.prisma            # Database schema definitions (15 models)
│   ├── seed.ts                  # Database seeding script (demo products, categories, admin)
│   └── seed-blog.ts             # Educational blog seed data
├── public/                      # Static assets, logos, brand photos, public fonts
│   └── fonts/                   # Scoutie Sans and Tiro Bangla TTF font files
├── scripts/                     # Operational & verification automation
│   ├── hostinger-setup.js       # Prebuild database synchronization & client generation
│   ├── check-admin.js           # 17-step end-to-end admin panel verification
│   ├── check-mobile.js          # Multi-viewport mobile responsiveness verification
│   ├── check-mobile-overflow.js # DOM scroll width overflow verification
│   ├── check-motion.js          # Animation & GSAP verification
│   └── check-i18n.js            # Translation key parity verification
├── src/
│   ├── proxy.ts                 # Next.js 16 Edge proxy (handles /admin auth & next-intl routing)
│   ├── i18n/
│   │   ├── routing.ts           # Route definitions (en, bn; default en; as-needed prefix)
│   │   └── request.ts           # Request-scoped message loading
│   ├── app/
│   │   ├── layout.tsx           # Global root HTML wrapper
│   │   ├── globals.css          # Design system root, @theme tokens, and @font-face rules
│   │   ├── sitemap.ts           # Dynamic bilingual XML sitemap generator
│   │   ├── robots.ts            # Robots.txt configuration
│   │   ├── [locale]/            # Public localized page tree (with NextIntlClientProvider, Header, Footer)
│   │   │   ├── page.tsx         # Homepage (/ and /bn)
│   │   │   ├── products/        # Filterable product catalog (/products)
│   │   │   ├── category/[slug]/ # Category showcase page
│   │   │   ├── product/[slug]/  # Detailed product specification & RFQ page
│   │   │   ├── blog/            # Educational blog listing and [slug] view
│   │   │   ├── about/           # Corporate about, warehouse info, mission
│   │   │   ├── contact/         # Contact info, map details, inquiry form
│   │   │   ├── quote/           # Dedicated quotation request page
│   │   │   ├── certifications/  # Verified certifications display
│   │   │   ├── deals/           # Wholesale packages & current offers
│   │   │   └── equipment/       # Equipment breakdown overview
│   │   ├── admin/               # Isolated administrative control center
│   │   │   ├── login/           # Admin login interface
│   │   │   ├── actions/         # Admin Server Actions (products, categories, blog, content, auth)
│   │   │   └── (protected)/     # Protected dashboard, CRUD forms, quote inbox, reviews, settings
│   │   ├── actions/             # Public Server Actions (quote.ts, reviews.ts)
│   │   ├── api/admin/login/     # API Route Handler for session cookie assignment
│   │   └── uploads/[...path]/   # Route Handler serving local uploaded media files
│   ├── components/              # Modular UI components
│   │   ├── admin/               # Bilingual admin client forms (product, blog, category, content)
│   │   ├── layout/              # Header, footer, floating WhatsApp button, language switcher
│   │   ├── product/             # Product cards, gallery, specs table, review forms
│   │   ├── quote/               # RFQ modal dialog and inline forms
│   │   ├── sections/            # Homepage sections (Hero, category dock, trust, FAQ, topical SEO)
│   │   └── ui/                  # Primitives (buttons, inputs, dialogs, badges, glass dock)
│   └── lib/                     # Utilities and backend services
│       ├── auth.ts              # JWT creation, verification, and cookie security
│       ├── db.ts                # PrismaClient singleton with URL sanitization
│       ├── env.ts               # Zod environment variable parsing
│       ├── fonts.ts             # Static font class descriptors
│       ├── rate-limit.ts        # In-memory IP rate limiter
│       ├── site-config.ts       # Fallback site-wide constants and brand defaults
│       ├── uploads.ts           # Sharp image processor, thumbnail generator, magic byte validator
│       ├── validation.ts        # Zod schemas for public forms and admin mutations
│       └── data/                # Data Access Layer (products, categories, blog, content, settings)
├── eslint.config.mjs            # ESLint 9 FlatConfig with FlatCompat
├── next.config.ts               # Next.js configuration (security headers, body size limits)
├── package.json                 # Dependency definitions and lifecycle scripts
├── postcss.config.mjs           # PostCSS configuration with worker thread limits
└── tsconfig.json                # Strict TypeScript compiler options
```

---

## 4. Frontend Flow & User Experience

1. **Routing & Locales:**
   - Visitor navigates to `/` (English) or `/bn` (Bangla).
   - Language switchers preserve current path (e.g., `/products` ↔ `/bn/products`).
   - Western Arabic numerals (`0-9`) are consistently used in both locales for engineering clarity.
2. **Homepage Layout:**
   - **Hero:** Confident B2B statement, catalog trigger, RFQ action, and neutral trust pills.
   - **Interactive Category Dock:** Sticky floating navigation allowing instant switching between Solar Panels, Batteries, Inverters, and BESS.
   - **Commercial Value Propositions:** Technical differentiators (Tier-1 sourcing, factory flash testing, local RMA).
   - **Project Supply References:** Highlights completed commercial installs (hidden if DB has no published projects).
   - **Topical Authority SEO:** Educational breakdown of TOPCon vs PERC, BESS sizing, and 2026 Bangladesh price guidelines.
   - **Interactive FAQ Accordion:** Common B2B questions with Schema.org `FAQPage` markup.
   - **Footer:** Direct contact channels, Dhaka office address, WhatsApp link, and copyright.
3. **Product Catalog & Detail Flow:**
   - `/products` features category filtering, search input, and brand badges.
   - `/product/[slug]` displays product gallery, stock status (`IN_STOCK`, `INCOMING`, `ON_REQUEST`), downloadable PDF datasheet button, verified specs table, moderation-approved customer reviews, and persistent "Request Quote" modal trigger.

---

## 5. Backend Flow & Data Persistence

1. **Data Access Layer:**
   - Public pages never interact with the database directly. They call functions in `src/lib/data/*` (e.g. `getProducts()`, `getProductBySlug()`, `getCategories()`).
   - The data layer handles language fallback: if a Bangla field (`nameBn`, `descriptionBn`) is null or empty, it automatically serves the English primary text.
2. **Quote Ingestion Workflow:**
   - User submits quote request form (via modal or `/quote` page).
   - Action `submitQuoteRequest` in `src/app/actions/quote.ts` executes on the server.
   - Verifies IP rate limit (max 5 requests per 10 minutes) via `src/lib/rate-limit.ts`.
   - Checks honeypot field `website_hp` (silently ignores bots).
   - Validates data with Zod schema `quoteRequestSchema`.
   - Persists record into `QuoteRequest` table with status `"NEW"`.
   - Admin receives the lead in `/admin/quotes` with contact info, requested product, and quantity.
3. **Admin Content Management Workflow:**
   - Admin logs in at `/admin/login`.
   - `src/proxy.ts` verifies signed JWT in `noor_admin_session` cookie for all `/admin/*` routes.
   - Admin Server Actions (`src/app/admin/actions/*`) re-verify session before executing mutations.
   - When images or datasheets are uploaded, `src/lib/uploads.ts` verifies file signatures, saves files to disk, and stores local relative URLs (e.g., `/uploads/products/xyz.webp`) in the database.

---

## 6. Database Schema Summary (Prisma)

The schema defines **15 relational models**:

| Model | Purpose | Key Attributes |
|---|---|---|
| `AdminUser` | Back-office credentials | `email`, `passwordHash`, `createdAt` |
| `Category` | Equipment classification | `slug`, `name`, `nameBn`, `image`, `sortOrder`, `isActive` |
| `Product` | Equipment catalog item | `slug`, `name`, `nameBn`, `brand`, `model`, `stockStatus`, `priceBdt`, `showPrice`, `datasheetUrl`, `isFeatured`, `isActive` |
| `ProductImage` | Product photo gallery | `productId`, `url`, `alt`, `altBn`, `sortOrder` (Cascade delete) |
| `ProductSpec` | Key engineering parameters | `productId`, `label`, `labelBn`, `value`, `valueBn`, `sortOrder` (Cascade delete) |
| `QuoteRequest` | Customer sales leads | `productId`, `name`, `company`, `phone`, `email`, `quantity`, `message`, `status` ("NEW", "CONTACTED", "CLOSED") |
| `SiteSetting` | Dynamic key-value store | `key` (id), `value` (plain text or JSON string) |
| `Stat` | Numerical credibility counters | `label`, `labelBn`, `value`, `prefix`, `suffix`, `isSample` |
| `Certification` | Verified standards display | `name`, `nameBn`, `issuer`, `image`, `isSample` |
| `Partner` | Supplier & brand logos | `name`, `logo`, `url`, `isSample` |
| `Testimonial` | Customer reviews / quotes | `quote`, `authorName`, `company`, `photo`, `isSample` |
| `FaqItem` | Help and technical FAQ | `question`, `questionBn`, `answer`, `answerBn`, `isSample` |
| `BlogPost` | Educational solar articles | `slug`, `title`, `content`, `coverImage`, `tags`, `status` ("DRAFT", "PUBLISHED"), `publishedAt` |
| `ProductReview` | Moderated product ratings | `productId`, `authorName`, `rating` (1-5), `body`, `status` ("PENDING", "APPROVED", "REJECTED") |
| `Project` | Commercial case studies | `slug`, `title`, `capacity`, `productsSupplied`, `clientName`, `image`, `gallery`, `isPublished` |

---

## 7. Build, Verification & Deployment Setup

### Lifecycle Scripts (`package.json`)
- `npm run dev`: Starts local Next.js development server.
- `npm run prebuild`: Automatically executes `node scripts/hostinger-setup.js` prior to building.
- `npm run build`: Compiles production build via `next build`.
- `npm start`: Starts production Node.js server.
- `npm run lint`: Runs ESLint 9 checks.
- `npm run db:setup`: Pushes Prisma schema with `--accept-data-loss` and seeds demo data.
- Automated testing scripts: `check:admin`, `check:mobile`, `check:overflow`, `check:motion`, `check:i18n`, `check:images`.

### Hostinger Deployment Architecture
- Deployed to **Hostinger Business/Cloud Node.js Web App container**.
- Supervised by Hostinger's internal container process manager.
- Persistent files (SQLite database and `/uploads`) are mapped outside the Git repository root to prevent data erasure during Git pull deployments.

---

## 8. Current Feature Status Summary

| Subsystem | Implementation Status | Notes |
|---|---|---|
| **Public Catalog** | **Complete** | All 3 categories, products, filtering, and specs working |
| **Bilingual Support** | **Complete** | English and Bangla with route preservation and switcher |
| **Quote Generation** | **Complete** | Modal & page forms, honeypot, IP rate limiting, database persistence |
| **Admin Panel** | **Complete** | 17/17 verified automated CRUD workflows passing (`check:admin`) |
| **Blog System** | **Complete** | Full markdown rendering, image embedding, draft/publish lifecycle |
| **Product Reviews** | **Complete** | Public submission, admin moderation approval workflow |
| **SEO & Structured Data** | **Complete** | BreadcrumbList, Organization, WebSite, Product, and FAQPage JSON-LD schemas |
| **Animations** | **Complete** | GSAP ScrollTrigger, Lenis smooth scrolling, glass dock |
| **E-Commerce Checkout** | **Excluded** | Deliberately out of scope (B2B wholesale model) |
| **Customer Accounts** | **Excluded** | Deliberately out of scope |
