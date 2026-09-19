# TRD — Noor Solar Energy website

Companion to `PRD.md`. This file says **how** to build. Follow it unless the lead approves a change.

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable), App Router, TypeScript strict |
| Runtime | Node.js 20 or newer (Hostinger supports 18, 20, 22, 24; target 20 or 22) |
| Styling | Tailwind CSS with theme variables from `DESIGN.md` |
| UI kit | shadcn/ui (public forms, admin panel) |
| Icons | lucide-react |
| Animation | GSAP (`gsap`, `@gsap/react`, ScrollTrigger) and Motion (`motion`); see `AGENT.md` section 4 |
| 3D (optional) | react-three-fiber + drei, procedural geometry only, lazy loaded |
| Database | Prisma ORM with **SQLite** for v1 (schema kept portable so MySQL is a small change) |
| Validation | zod |
| Auth | Own simple admin auth: `bcryptjs` password hash, `jose` signed JWT in an httpOnly cookie |
| Images | Upload handling with `sharp` (resize and convert to WebP) |
| Package manager | npm |

Do not add other dependencies without approval. Remove packages that stay unused.

## 2. Architecture

- One Next.js app serves the public site and the admin panel.
- Pages are **Server Components** that read from Prisma through a **data layer** (`src/lib/data/*`). Components never call Prisma directly.
- Mutations (quote submit, admin CRUD, uploads) use **Server Actions** or route handlers with zod validation and auth checks.
- The data layer exposes functions such as `getCategories()`, `getProductsByCategory(slug)`, `getProduct(slug)`, `getFeaturedProducts()`, `getSiteSettings()`. If an ERP is added later, only this layer changes.
- Site-wide values (company name, phone, WhatsApp, address, hours, socials, hero text, FAQ) live in the `SiteSetting` table, with defaults in `src/lib/site-config.ts` used as fallback.

```
src/
  app/
    (public)/            layout with header, footer, WhatsApp button
      page.tsx           home
      products/page.tsx
      category/[slug]/page.tsx
      product/[slug]/page.tsx
      about/page.tsx
      contact/page.tsx
    admin/
      login/page.tsx
      (protected)/       layout with auth check and admin shell
        page.tsx         dashboard
        categories/
        products/        list, new, [id]
        quotes/          list, [id]
        settings/
    uploads/[...path]/route.ts   serves uploaded files
    sitemap.ts  robots.ts  not-found.tsx  error.tsx
  components/
    ui/                  shadcn primitives
    layout/              header, footer, whatsapp button, admin shell
    sections/            home sections
    product/             card, gallery, spec table, quote dialog
    motion/              animation helpers and signature scenes
  lib/
    db.ts                Prisma client singleton
    data/                data layer functions
    auth.ts              session helpers
    validation.ts        zod schemas
    uploads.ts           image processing and storage
    site-config.ts       default settings
    rate-limit.ts
  styles/                globals, tokens
prisma/
  schema.prisma
  seed.ts                demo data and first admin user
public/demo/             procedural placeholder images
```

## 3. Data model (Prisma)

Keep types portable to MySQL: use `String` with zod-checked values instead of database enums, and no JSON columns.

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String?
  image       String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id               String         @id @default(cuid())
  slug             String         @unique
  name             String
  categoryId       String
  category         Category       @relation(fields: [categoryId], references: [id])
  shortDescription String?
  description      String?
  brand            String?
  model            String?
  stockStatus      String         @default("ON_REQUEST") // IN_STOCK | INCOMING | ON_REQUEST
  moq              String?
  leadTime         String?
  priceBdt         Int?
  showPrice        Boolean        @default(false)
  datasheetUrl     String?
  isFeatured       Boolean        @default(false)
  isActive         Boolean        @default(true)
  isDemo           Boolean        @default(true)
  sortOrder        Int            @default(0)
  images           ProductImage[]
  specs            ProductSpec[]
  quotes           QuoteRequest[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  alt       String
  sortOrder Int     @default(0)
}

model ProductSpec {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  label     String
  value     String
  sortOrder Int     @default(0)
}

model QuoteRequest {
  id        String   @id @default(cuid())
  productId String?
  product   Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  name      String
  company   String?
  phone     String
  email     String?
  quantity  String?
  location  String?
  message   String?
  status    String   @default("NEW") // NEW | CONTACTED | CLOSED
  note      String?
  createdAt DateTime @default(now())
}

model SiteSetting {
  key   String @id
  value String // plain text or a JSON string
}


  model Stat {
    id          String   @id @default(cuid())
    label       String
    value       Float
    prefix      String?
    suffix      String?
    description String?
    sortOrder   Int      @default(0)
    isActive    Boolean  @default(true)
    isSample    Boolean  @default(true)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }

  model Certification {
    id          String   @id @default(cuid())
    name        String
    issuer      String?
    description String?
    image       String?
    sortOrder   Int      @default(0)
    isActive    Boolean  @default(true)
    isSample    Boolean  @default(true)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }

  model Partner {
    id        String   @id @default(cuid())
    name      String
    logo      String?
    url       String?
    sortOrder Int      @default(0)
    isActive  Boolean  @default(true)
    isSample  Boolean  @default(true)
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
  }

  model Testimonial {
    id         String   @id @default(cuid())
    quote      String
    authorName String
    authorRole String?
    company    String?
    photo      String?
    sortOrder  Int      @default(0)
    isActive   Boolean  @default(true)
    isSample   Boolean  @default(true)
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
  }

  model FaqItem {
    id        String   @id @default(cuid())
    question  String
    answer    String
    sortOrder Int      @default(0)
    isActive  Boolean  @default(true)
    isSample  Boolean  @default(true)
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
  }
```

Spec rows are free-form, so each category can show different specs (panel wattage and efficiency, battery voltage and capacity, inverter rating and MPPT) without schema changes.

## 4. Routes

Public: `/`, `/products`, `/category/[slug]`, `/product/[slug]`, `/about`, `/contact`.
Admin: `/admin/login`, `/admin`, `/admin/categories`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/quotes`, `/admin/quotes/[id]`, `/admin/settings`.
Files: `/uploads/[...path]`.

Only active categories and products appear on the public site. Unknown slugs return `notFound()`.

## 5. Admin authentication

- One admin user is created by the seed script from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. The owner must change the password after first login.
- Passwords hashed with bcrypt (cost 12).
- On login, sign a JWT with `jose` (secret from `AUTH_SECRET`, expiry 7 days) and store it in an `httpOnly`, `sameSite=lax`, `secure` (in production) cookie.
- `middleware.ts` redirects unauthenticated requests for `/admin/*` (except `/admin/login`) to the login page.
- **Every** admin Server Action and route handler verifies the session again on the server. Middleware alone is not enough.
- Login attempts are rate limited.

## 6. Image uploads

- Accept `image/jpeg`, `image/png`, `image/webp` only. Max 5 MB per file. Check the real file signature, not only the extension.
- Process with `sharp`: auto-rotate, strip metadata, resize to max 1600px on the long side, save as WebP. Also create a 480px thumbnail.
- Store files in `UPLOAD_DIR` (env). Locally `./storage/uploads`. In production, **a folder outside the deployed app folder** so redeploys never delete uploads.
- Serve through `/uploads/[...path]` with long cache headers. Reject any path that tries to leave `UPLOAD_DIR`.
- Deleting a product or image removes its files.
- Demo images ship in `public/demo/` and are referenced by URL.

## 7. Quote requests

- Server Action with zod validation (trim, length limits, phone format check for Bangladeshi and international numbers).
- Spam protection: hidden honeypot field plus in-memory rate limit per IP (for example 5 requests per 10 minutes). Note: in-memory limits reset on restart; that is acceptable for v1.
- Save to `QuoteRequest`. Return a clear success or error state to the UI.
- Optional later: email notification. Design the code so a `notifyNewQuote()` function can be added without changing callers.

## 8. SEO and metadata

- Metadata API on every page: unique title and description, Open Graph, canonical URL.
- `sitemap.ts` (static pages, categories, active products) and `robots.ts` (block `/admin` and `/uploads/tmp`).
- JSON-LD: `Organization` on the home page, `Product` on product pages (include price only when `showPrice` is true).
- Semantic headings, one `h1` per page, descriptive `alt` text.

## 9. Security

- Never expose secrets to the client. Only `NEXT_PUBLIC_*` variables reach the browser, and none are secrets.
- Validate all input with zod on the server. Escape output (React does this by default). Never use `dangerouslySetInnerHTML` with user content.
- Security headers in `next.config` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options or frame-ancestors, and a reasonable Content-Security-Policy that allows our own assets and WhatsApp links).
- CSRF: use Server Actions (built-in origin checks) and `sameSite=lax` cookies.
- Uploads: see section 6.
- `.env`, database files and `storage/` are in `.gitignore`. Provide `.env.example`.
- Do not log personal data (phones, emails) in production logs.

`.env.example`:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-long-random-string"
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="change-me-on-first-login"
UPLOAD_DIR="./storage/uploads"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 10. Performance requirements

- Server-render pages; keep client JavaScript small. Target home route first-load JS under about 200 KB gzipped, excluding lazy chunks.
- Lazy load `three`, GSAP-heavy scenes and carousels with `next/dynamic`. Load only when near the viewport.
- Disable WebGL and heavy scenes on small screens, low-power devices and reduced-motion settings. Provide a static fallback.
- Images through `next/image` with correct `sizes`. Set explicit width and height to prevent layout shift.
- Fonts through `next/font` with `display: swap` and only needed weights.
- Cache public pages sensibly (`revalidate` or on-demand revalidation when the admin saves changes, using `revalidatePath`).
- Targets (mobile, home page): LCP under 2.5 s, CLS under 0.1, INP under 200 ms.

## 11. Deployment (Hostinger)

- Hostinger web hosting with Node.js apps supports Next.js. Use Node 20 or 22.
- Deploy from a **GitHub repository** using Hostinger's Node.js app deployment. Build command `npm run build`, start command `npm start`. Set environment variables in the hosting panel, not in the repo.
- Production database: SQLite file in a persistent folder **outside** the deployed code, set through `DATABASE_URL`. Run `npx prisma migrate deploy` on deploy. If write volume or hosting limits become a problem, move to MySQL by changing the Prisma datasource and `DATABASE_URL`.
- Uploads folder is also outside the deployed code (`UPLOAD_DIR`).
- Backups: the database file and the uploads folder. The owner or lead sets up a periodic copy. Hostinger's backups do not replace this.
- Domain: keep DNS changes for last. Test on a temporary URL first. The owner decides when to switch `noorsolaren.com`.
- Never ask for or store hosting or FTP passwords in this repository or in chat.

## 12. Task plan

The lead sends one prompt per task. Do not start a task before you receive its prompt.

| # | Task | Result |
|---|---|---|
| 1 | Project setup, layout shell, placeholder routes | Done first (earlier prompt) |
| 1b | Migrate design tokens to `DESIGN.md`, remove dark toggle and old color tokens, set up fonts and glass utilities | Site shell matches the design system |
| 2 | Prisma schema, migrations, seed script with demo data and procedural demo images | Database with demo content |
| 3 | Data layer and public page skeletons wired to real data | Pages render real demo data |
| 4 | Home: header, hero with interactive visual, category dock | Signature first screen |
| 5 | Home: category story, featured carousel, spec counters, ordering steps, FAQ, closing CTA | Full home page |
| 6 | Products, category and product detail pages | Complete catalog |
| 7 | Quote form, server action, spam protection | Requests saved |
| 8 | Admin auth, admin shell, dashboard | Secure admin |
| 9 | Admin CRUD: categories, products, uploads, quotes inbox, settings | Owner can manage all content |
| 10 | About, Contact, 404, SEO, structured data, sitemap | Complete public site |
| 11 | Performance, accessibility and responsive polish pass | Targets in section 10 met |
| 12 | Deployment to Hostinger, production checklist | Live on temporary URL |

## 13. Testing and verification

- Every task: `npm run lint`, `npm run build`, manual check at 360px, 768px and 1440px.
- Add automated tests only where the lead asks (for example zod schemas and the data layer).
- Before deployment: Lighthouse mobile run on Home, Products and a Product page; keyboard-only walkthrough of the quote form and admin login; test uploads with oversized and wrong-type files; test that unauthenticated requests to `/admin/*` are redirected and that admin Server Actions reject requests without a session.
