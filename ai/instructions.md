# AI Agent Instructions — Noor Solar Energy

> **Document Status:** Active & Authoritative  
> **Target Audience:** Future AI coding agents and automated developers  
> **Source Base:** Extracted and consolidated from `AGENT.md`, `PRD.md`, `TRD.md`, `DESIGN.md`, `rulls-for-2026.md`, `WORKED.md`, and code inspections.

---

## 1. Project Context & Nature of the Application

- **Business Domain:** Noor Solar Energy is a specialized B2B importer and wholesale bulk supplier in Bangladesh dealing strictly in three core product categories: **Solar Panels (N-Type TOPCon/Mono PERC)**, **Lithium-Ion Batteries (LiFePO4)**, and **Solar Inverters (On-Grid/Hybrid)**, plus modular Energy Storage (BESS) solutions.
- **Functional Scope:** This is a **product catalog and quote request generation platform**.
  - **There is NO cart, NO checkout, NO payment processing, and NO customer account portal.**
  - Every CTA leads to a quote form, WhatsApp chat, or direct phone call.
- **Administration:** Content, products, specs, blog posts, reviews, and trust badges are managed via an isolated Admin Panel (`/admin`) reading and writing to a local SQLite database (with automatic MySQL switching on production).

---

## 2. Immutable Project Rules [EXISTING CONVENTION — VERIFIED]

Future agents working on this repository must strictly adhere to the following rules:

### 2.1. Do NOT Redesign the Website (`rulls-for-2026.md`)
- **Strict Prohibition:** You must NOT initiate visual redesigns, rebuild sections from scratch, or replace the UI design language.
- **Preserve:**
  - Header & Navbar visual architecture
  - Hero layout, pill elements, and visual arrangement
  - Interactive category dock (`category-dock.tsx`)
  - Product card layouts and badge styling
  - Existing animation timing, scroll triggers, and transitions
  - Light mode eco-minimalist palette (`#074031`, `#FEBE16`, `#F7F8F5`)
- **What You May Modify:** Copy, typography headings, meta tags, schema structured data, data plumbing, technical bug fixes, responsiveness glitches, and accessibility contrast.

### 2.2. Architecture Separation & Data Layer (`TRD.md` Section 2)
- **Rule:** Public Server Components and Client Components must **NEVER** call the Prisma client (`db`) directly.
- **Standard:** All database interactions must go through the dedicated data abstraction layer in `src/lib/data/*` (`products.ts`, `categories.ts`, `content.ts`, `settings.ts`, `blog.ts`, `projects.ts`, `reviews.ts`).
- **Rationale:** Keeps data querying portable so future migration to external ERPs or headless microservices only requires updating `src/lib/data/`.

### 2.3. Zero Invented Facts / Truthful Content Policy (`PRD.md` Section 7 & `AGENT.md`)
- **Strict Prohibition:** Never invent corporate awards, fake factory affiliations, delivery time guarantees, or official certifications.
- **Sample Data Flagging:** Any non-verified trust content (sample stats, placeholder client logos, sample testimonials) must have `isSample: true` in the database schema.
- **Company Defaults:** Company phone, email, addresses, and hours must always be retrieved from `getSiteSettings()` or fall back to verified constants in `src/lib/site-config.ts`.

### 2.4. Server-Side Authentication Enforcement (`TASKS.md` Task B & `WORKED.md`)
- **Rule:** Never rely solely on middleware/proxy for admin security.
- **Standard:** Every Server Action in `src/app/admin/actions/*` and every administrative route handler must invoke `await getSession()` from `src/lib/auth.ts` at the very beginning before parsing input or querying the database.

### 2.5. Safe Secret & Persistent Data Management (`DEPLOY.md`)
- **Rule:** Never commit `.env`, `.env.production`, database files (`*.db`, `*.db-journal`), or uploaded media files (`storage/uploads/*`).
- **Production Persistence:** In deployment environments (Hostinger / Cloud), SQLite databases and user uploads must be mapped to persistent directories located outside the code deployment root.

### 2.6. Font Handling & Turbopack Protection [VERIFIED IN PRODUCTION FIX]
- **Rule:** Do **NOT** use `next/font/local` or `next/font/google` for custom font generation in this project.
- **Reason:** In Next.js 16 under Turbopack, virtual font CSS modules (`tirobangla_*.module.css`, `scoutiesans_*.module.css`) trigger a PostCSS child-process exit status 0 crash on memory-constrained deployment containers.
- **Standard:** Standard `@font-face` rules in `src/app/globals.css` pointing to static files in `public/fonts/` must be used, with static variable descriptors exported from `src/lib/fonts.ts`.

---

## 3. High-Risk Files & Extra-Caution Modules

When modifying any of the following files, exercise extreme care:

| File Path | Function / Purpose | Risk Factors & Precaution |
|---|---|---|
| `src/proxy.ts` | Edge Request Interception | Handles both JWT authentication redirects for `/admin` and `next-intl` localized routing for `[locale]`. Any uncaught error here takes down the entire site. |
| `src/lib/auth.ts` | Session & Token Security | Uses `jose` HS256 JWT tokens. Cookie encryption and production secret length verification happen here. |
| `src/lib/db.ts` | Prisma Client Singleton | Sanitizes connection strings to prevent malformed URL crashes. Strips accidental quotes added by web hosting dashboards. |
| `scripts/hostinger-setup.js` | Automated Prebuild Runner | Runs migrations, generates Prisma client, and seeds essential admin accounts during deployment. Modifying this can break host deployment. |
| `src/app/globals.css` | Design System Root | Contains Tailwind v4 `@theme` tokens, global CSS variables, and `@font-face` rules. Breaking syntax disables all styling. |
| `src/lib/uploads.ts` | File Upload Processor | Validates magic bytes, converts images to WebP via `sharp`, and prevents path traversal attacks. |
| `src/app/uploads/[...path]/route.ts` | Local Media Serving | Must strictly enforce `targetPath.startsWith(UPLOAD_DIR)` to prevent arbitrary file reading from the host filesystem. |

---

## 4. Coding Conventions & Patterns Discovered in Codebase

### 4.1. Internationalization (`next-intl`)
- **Routing:** Handled via `src/i18n/routing.ts`. English (`en`) is the default and uses unprefixed URLs (`/products`, `/about`). Bangla (`bn`) uses the `/bn` prefix (`/bn/products`, `/bn/about`).
- **Page Convention:** All public pages must be located inside `src/app/[locale]/`. They accept `{ params }: { params: Promise<{ locale: string }> }`.
- **Translations:** UI labels are stored in `messages/en.json` and `messages/bn.json`.
- **Database Content:** Dynamic content is stored in paired database columns (e.g., `name` and `nameBn`, `description` and `descriptionBn`). The data layer automatically selects the correct field based on `locale`.

### 4.2. Form Submissions & Server Actions
- **Forms:** Public forms use standard Server Actions (`src/app/actions/quote.ts`, `src/app/actions/reviews.ts`).
- **Validation:** All inputs must be strictly validated with Zod schemas defined in `src/lib/validation.ts`.
- **Spam Mitigation:** Public forms use honeypot fields (`website_hp`) and IP-based rate limiting via `src/lib/rate-limit.ts`.

### 4.3. Styling & Modern CSS
- **Framework:** Tailwind CSS v4 using `@tailwindcss/postcss` in `postcss.config.mjs`.
- **Color Usage:** Always reference official theme tokens:
  - Brand Primary: `#074031` (`text-brand-green` / `bg-brand-green`)
  - Accent / Gold: `#FEBE16` (`text-solar-gold` / `bg-solar-gold`)
  - Surface: `#F7F8F5` (`bg-warm-white` / `bg-canvas`)
  - Border: `#DCE4E0` (`border-brand-border`)

---

## 5. Testing & Validation Expectations

Before declaring any task or ticket complete, the agent must run the relevant verification commands:

1. **Compilation & Type Safety:**
   ```powershell
   npx tsc --noEmit
   ```
   Must pass with 0 errors.

2. **Linting Check:**
   ```powershell
   npm run lint
   ```
   Must pass without unhandled errors.

3. **Production Build Simulation:**
   ```powershell
   npm run build
   ```
   Must complete static generation and page optimization with exit code 0.

4. **Automated Verification Suites (Run When Touching Relevant Subsystems):**
   - Admin Panel CRUD Integrity: `npm run check:admin`
   - Mobile Responsiveness & Overflow: `npm run check:overflow` and `npm run check:mobile`
   - Animation System Integrity: `npm run check:motion`
   - Internationalization Parity: `npm run check:i18n`
   - Image & Asset Optimization: `npm run check:images`

---

## 6. What Requires Explicit User / Owner Approval

An agent must **STOP and ASK** before:
1. Adding, updating, or removing any external dependency in `package.json`.
2. Changing the database schema in `prisma/schema.prisma` if it involves destructive migrations (`DROP TABLE`, `DROP COLUMN`).
3. Modifying company contact information, business registration numbers, or legal disclaimers.
4. Enabling online transactions, shopping cart features, or customer account models (strictly out of scope for v1).
5. Enabling dark mode (explicitly decided against in v1.0).
