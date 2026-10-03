# Architecture & Technical Decisions Record — Noor Solar Energy

> **Document Status:** Active & Grounded  
> **Source Base:** Extracted from code analysis, commit history (`git log`), `WORKED.md`, `TRD.md`, `PRD.md`, and `DEPLOY.md`.

---

## Chronological Technical Decisions

### Decision 1: SQLite as Default Database with Dynamic MySQL Provider Switching
- **Decision:** Use Prisma ORM with SQLite (`file:./dev.db`) as the standard development and initial production database, but include automated tooling to dynamically switch to MySQL if configured.
- **Why It Was Made:** Allows zero-configuration local development without requiring local Docker or running database daemons, while keeping low-cost single-instance Hostinger deployments simple.
- **Current Implementation:**
  - `prisma/schema.prisma` defaults to `provider = "sqlite"`.
  - `scripts/hostinger-setup.js` inspects `DATABASE_URL`; if it begins with `mysql://`, it dynamically edits `schema.prisma` before generating the client and pushing migrations.
  - `src/lib/db.ts` sanitizes connection strings (removing extraneous quotes from web hosting panels).
- **Files Affected:** `prisma/schema.prisma`, `scripts/hostinger-setup.js`, `src/lib/db.ts`.
- **Known Trade-offs:** SQLite locks the entire database during write operations, which would bottleneck high-concurrency write workloads. However, Noor Solar Energy is a low-frequency write application (quotes and periodic admin content updates).
- **Evidence / Source:** `TRD.md` Section 1, `WORKED.md` Task Admin-Fix, `scripts/hostinger-setup.js`.
- **Reasoning Status:** **VERIFIED** in `TRD.md` & `WORKED.md`.

---

### Decision 2: Architectural Separation of Public Localized Routes and Admin Shell
- **Decision:** Isolate the public bilingual application (`/` and `/bn`) from the admin back-office (`/admin`).
- **Why It Was Made:** Public visitors require dual-language English/Bangla presentation with localized SEO, metadata, and routing via `next-intl`. The admin panel is an internal tool exclusively for the business owner, requiring fast navigation without translation overhead in the UI, but providing dual-language data entry forms.
- **Current Implementation:**
  - Public routes live in `src/app/[locale]/` and wrap pages with `NextIntlClientProvider`.
  - Admin routes live in `src/app/admin/` with an independent HTML shell (`src/app/admin/layout.tsx`) that does not load `next-intl`.
  - Route distinction and admin access control are managed via `src/proxy.ts`.
- **Files Affected:** `src/app/[locale]/layout.tsx`, `src/app/admin/layout.tsx`, `src/proxy.ts`.
- **Known Trade-offs:** Requires two root-level layouts and careful routing exclusion in proxy/middleware.
- **Evidence / Source:** `TRD.md` Section 2, `src/proxy.ts`.
- **Reasoning Status:** **VERIFIED** in `TRD.md` Section 2.

---

### Decision 3: Custom Signed JWT Cookie Authentication over Third-Party Auth Services
- **Decision:** Implement a self-contained authentication system using `bcryptjs` password hashing and `jose` signed HS256 JWTs stored in `httpOnly` cookies, avoiding external auth providers (NextAuth/Auth.js, Clerk, Supabase, Firebase).
- **Why It Was Made:** The website only requires authentication for a single administrative owner. Third-party auth services introduce ongoing subscription fees, external network failure points, and unnecessary architectural complexity.
- **Current Implementation:**
  - Single `AdminUser` model in Prisma.
  - `src/lib/auth.ts` handles JWT creation, verification, and cookie management (`noor_admin_session`, 7-day TTL, `sameSite: lax`, `httpOnly: true`).
  - Passwords hashed with `bcryptjs`.
  - Admin actions invoke `await getSession()` before running queries.
- **Files Affected:** `src/lib/auth.ts`, `src/proxy.ts`, `src/app/api/admin/login/route.ts`, `src/app/admin/actions/auth.ts`.
- **Known Trade-offs:** No built-in password reset emails, multi-tenant roles, or OAuth social logins.
- **Evidence / Source:** `TRD.md` Section 1, `src/lib/auth.ts`, `WORKED.md` Task 8.
- **Reasoning Status:** **VERIFIED** in `TRD.md`.

---

### Decision 4: Local Storage and Sharp Image Processing over Cloudinary / AWS S3
- **Decision:** Store media uploads directly on the local server filesystem and process images using `sharp` (converting to `.webp` with dimensions capped and generating thumbnails), rather than utilizing external cloud storage.
- **Why It Was Made:** Aligns with standard Hostinger Business/Cloud hosting where disk storage is already bundled, avoiding third-party image hosting fees and API rate limits.
- **Current Implementation:**
  - Images processed by `src/lib/uploads.ts` with magic-byte verification (JPEG, PNG, WebP) and converted to WebP.
  - Files saved to `./storage/uploads` (or configurable `UPLOAD_DIR`).
  - Files served through `src/app/uploads/[...path]/route.ts` with directory traversal protection (`targetPath.startsWith(UPLOAD_DIR)`).
- **Files Affected:** `src/lib/uploads.ts`, `src/app/uploads/[...path]/route.ts`, `next.config.ts`.
- **Known Trade-offs:** Requires host deployment to maintain a persistent directory outside the Git deploy root (otherwise redeploying wipes uploaded images).
- **Evidence / Source:** `TRD.md` Section 1, `DEPLOY.md` Section 2, `src/lib/uploads.ts`.
- **Reasoning Status:** **VERIFIED** in `DEPLOY.md` & `TRD.md`.

---

### Decision 5: B2B Quote-Only Model (No Cart, Payment Processing, or Customer Accounts)
- **Decision:** Eliminate all e-commerce checkout mechanisms (shopping cart, Stripe/bKash payment gateways, user accounts) in favor of high-touch B2B Request For Quote (RFQ) generation.
- **Why It Was Made:** Noor Solar Energy's primary business is container-scale and pallet-scale wholesale distribution of commercial solar equipment in Bangladesh. These transactions require custom commercial invoices, freight logistics, and bank L/C terms.
- **Current Implementation:**
  - Product detail pages feature quote request dialogs (`src/components/quote/quote-dialog.tsx`) and direct WhatsApp / phone call triggers.
  - Server Action `submitQuoteRequest` in `src/app/actions/quote.ts` validates submissions via Zod, checks IP rate limits, and persists leads into `QuoteRequest`.
  - Admin panel provides a quote management inbox (`/admin/quotes`).
- **Files Affected:** `src/app/actions/quote.ts`, `src/components/quote/quote-dialog.tsx`, `prisma/schema.prisma`.
- **Known Trade-offs:** Consumers cannot purchase single small retail accessories online immediately.
- **Evidence / Source:** `PRD.md` Section 1 & 4.
- **Reasoning Status:** **VERIFIED** in `PRD.md`.

---

### Decision 6: Single-Theme Light Eco-Futuristic Visual System (Removal of Dark Mode)
- **Decision:** Standardize on a bright, eco-futuristic light visual identity and deliberately remove dark mode toggles.
- **Why It Was Made:** `DESIGN.md` established a specific visual identity (dark bottle green `#074031`, solar gold `#FEBE16`, warm canvas `#F7F8F5`). Supporting dark mode in v1 would double QA complexity across animations and responsive viewports without adding value to B2B corporate buyers.
- **Current Implementation:**
  - Hardcoded light-mode theme tokens in `src/app/globals.css`.
  - No `next-themes` provider or dark class toggling.
- **Files Affected:** `DESIGN.md`, `src/app/globals.css`, `WORKED.md` Task 1b.
- **Known Trade-offs:** Users with system-level dark mode preference receive a light-mode site.
- **Evidence / Source:** `DESIGN.md` Section 2, `WORKED.md` Task 1b, `rulls-for-2026.md`.
- **Reasoning Status:** **VERIFIED** in `WORKED.md` Task 1b.

---

### Decision 7: Server Actions Payload Limit Extended to 25MB
- **Decision:** Override Next.js default 1MB Server Action payload limit to 25MB via `experimental.serverActions.bodySizeLimit: "25mb"` in `next.config.ts`.
- **Why It Was Made:** Admin users uploading multi-image product galleries and technical manufacturer PDF datasheets were experiencing silent upload failures due to payload truncation.
- **Current Implementation:**
  - Configured in `next.config.ts`.
- **Files Affected:** `next.config.ts`, `src/app/admin/actions/products.ts`.
- **Known Trade-offs:** Increases memory consumption on the server if multiple large uploads occur simultaneously.
- **Evidence / Source:** `WORKED.md` Task Admin-Fix, `next.config.ts`.
- **Reasoning Status:** **VERIFIED** in `WORKED.md`.

---

### Decision 8: Static `@font-face` Declarations over `next/font/local`
- **Decision:** Bypass `next/font/local` and `next/font/google` for custom font generation, declaring standard `@font-face` rules in `src/app/globals.css` and exporting static font descriptor objects from `src/lib/fonts.ts`.
- **Why It Was Made:** In Next.js 16 with Turbopack, virtual CSS modules generated by `next/font/local` (`tirobangla_*.module.css`, `scoutiesans_*.module.css`) caused child PostCSS worker processes to terminate with exit status 0 on containerized hosting environments (such as Hostinger VPS/Cloud).
- **Current Implementation:**
  - Custom font files (`ScoutieSans[wght].ttf`, `TiroBangla-Regular.ttf`, etc.) reside in `public/fonts/`.
  - `@font-face` declared directly in `src/app/globals.css`.
  - `src/lib/fonts.ts` exports plain objects with `.variable` and `.className` strings matching CSS token classes.
- **Files Affected:** `src/app/globals.css`, `src/lib/fonts.ts`, `src/app/[locale]/layout.tsx`.
- **Known Trade-offs:** Font preloading and sub-setting must be maintained manually rather than automated by Next.js font loader, but eliminates Turbopack build crashes.
- **Evidence / Source:** Git commits `87e289c`, `306d8de`, `src/lib/fonts.ts`.
- **Reasoning Status:** **VERIFIED** from build troubleshooting and git history.

---

### Decision 9: ESLint 9 FlatCompat Configuration for Non-Blocking Production Builds
- **Decision:** Implement ESLint 9 using `@eslint/eslintrc` `FlatCompat` to extend `next/core-web-vitals` while downgrading non-critical stylistic errors (`any`, `@ts-ignore`) to warnings.
- **Why It Was Made:** `eslint-config-next` is historically packaged for legacy ESLint configs. When combined with ESLint 9 Flat Config in Next.js 16, strict rule failures previously halted production builds on minor non-runtime issues.
- **Current Implementation:**
  - `eslint.config.mjs` configures `FlatCompat` and explicitly sets `@typescript-eslint/no-explicit-any: "off"`, `@typescript-eslint/ban-ts-comment: "off"`, and `@typescript-eslint/no-unused-vars: "warn"`.
- **Files Affected:** `eslint.config.mjs`.
- **Known Trade-offs:** ESLint will not reject commits containing explicit `any` types during CI.
- **Evidence / Source:** Git commit `306d8de`, `eslint.config.mjs`.
- **Reasoning Status:** **VERIFIED** in `eslint.config.mjs` and git history.
