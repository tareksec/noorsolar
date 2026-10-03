# Known Issues, Risks & Technical Debt — Noor Solar Energy

> **Document Status:** Active & Fact-Grounded  
> **Source Base:** Extracted from active codebase analysis, build logs, and project documentation (`WORKED.md`, `DEPLOY.md`, `TRD.md`).  
> **Rule:** Document only; do **NOT** fix issues during this task.

---

## 1. High-Severity Issues & Risks

### Issue 1.1: Production Data Loss Risk with Relative SQLite / Upload Paths
- **Severity:** **High**
- **Evidence:** 
  - `DEPLOY.md` Section 2: *"Every time you pull a new Git commit or upload a new ZIP file, Hostinger replaces files in the application deployment root. If your SQLite database file (`production.db`) or user uploads directory (`/uploads`) are inside the code repository, THEY WILL BE WIPED ON REDEPLOYMENT."*
  - `src/lib/env.ts`: Defaults `DATABASE_URL` to `"file:./dev.db"` and `UPLOAD_DIR` to `"./storage/uploads"`.
- **Affected Area:** `src/lib/db.ts`, `src/lib/uploads.ts`, Hostinger deployment setup.
- **Current Behavior:** If deployed to production without explicitly setting absolute environment variables (`DATABASE_URL=file:/home/<user>/persistent_data/production.db` and `UPLOAD_DIR=/home/<user>/persistent_data/uploads`), the application writes to the local project directory.
- **Expected Behavior:** Database and user-uploaded assets should persist across git pulls, updates, and rebuilds.
- **Possible Impact:** Complete loss of products, admin user accounts, blog articles, and customer quote requests whenever a new version is deployed.
- **Status:** **Active Deployment Risk** (Documented in `DEPLOY.md`).
- **Recommended Next Investigation / Fix:** Verify in Hostinger hPanel environment variables that absolute paths to `/home/<user>/persistent_data/` are set and writable. Consider adding a boot-time check in `scripts/hostinger-setup.js` warning if `NODE_ENV === "production"` and `DATABASE_URL` contains a relative path.

---

### Issue 1.2: Hardcoded Production Fallback Secret in Auth Handler
- **Severity:** **High**
- **Evidence:** `src/lib/auth.ts` lines 7–15:
  ```typescript
  const PROD_FALLBACK_SECRET = "noor_solar_production_fallback_auth_secret_jwt_key_2026_super_secure";
  function getEncodedKey(): Uint8Array {
    const secret = process.env.AUTH_SECRET;
    if (secret && secret.length >= 16 && secret !== PLACEHOLDER_AUTH_SECRET) {
      return new TextEncoder().encode(secret);
    }
    return new TextEncoder().encode(PROD_FALLBACK_SECRET);
  }
  ```
- **Affected Area:** `src/lib/auth.ts`, Admin Session Management.
- **Current Behavior:** If `AUTH_SECRET` is unset or left as the placeholder in production, the code silently falls back to a publicly visible hardcoded secret (`PROD_FALLBACK_SECRET`) rather than refusing to start.
- **Expected Behavior:** Per `TASKS.md` Task B requirements: *"In production (NODE_ENV=production) auth must refuse to run if AUTH_SECRET is missing, shorter than 32 characters, or equal to the placeholder in .env.example."*
- **Possible Impact:** Anyone with read access to this repository can forge signed `noor_admin_session` JWT cookies and gain full unauthorized administrative access if `AUTH_SECRET` is omitted on the host.
- **Status:** **Active Security Debt**.
- **Recommended Next Investigation / Fix:** Modify `src/lib/auth.ts` to throw an explicit error in production when `AUTH_SECRET` is missing, less than 32 characters, or matches default placeholders.

---

## 2. Medium-Severity Issues & Technical Debt

### Issue 2.1: Node.js Engine Pinning vs. Diverse Host Runtime Versions
- **Severity:** **Medium**
- **Evidence:** `package.json` specifies `"node": "22"`. Hostinger and other web hosting environments support both Node.js 20 LTS and Node.js 22 LTS. Running on Node 20 produces:
  ```text
  npm warn EBADENGINE Unsupported engine { package: 'noor-solar-energy@0.1.0', required: { node: '22' }, current: { node: 'v20.x' } }
  ```
- **Affected Area:** `package.json`, `.node-version`, `.nvmrc`, `.tool-versions`.
- **Current Behavior:** Pinned strictly to Node 22 to align with user's host environment that was running Node 22.
- **Expected Behavior:** Both active LTS versions (Node 20 and Node 22) should ideally be accepted without engine mismatch warnings.
- **Possible Impact:** Environments with strict engine enforcement (`npm install --engine-strict`) will fail to install on Node 20.
- **Status:** **Active Environmental Constraint**.
- **Recommended Next Investigation / Fix:** Test relaxing `package.json` to `"node": ">=20.0.0 <23.0.0"` or `"^20.0.0 || ^22.0.0"` after ensuring Turbopack and font declarations remain 100% stable across both versions.

---

### Issue 2.2: In-Memory IP Rate Limiter Lacks Process Persistence & Cluster Support
- **Severity:** **Medium**
- **Evidence:** `src/lib/rate-limit.ts`:
  ```typescript
  const trackingMap = new Map<string, { count: number; expiresAt: number }>();
  ```
- **Affected Area:** `src/lib/rate-limit.ts`, `src/app/actions/quote.ts`, `src/app/actions/reviews.ts`.
- **Current Behavior:** IP submission tracking for quotes (5 submissions per 10 minutes) and reviews is stored in a simple Node.js in-memory `Map`.
- **Expected Behavior:** Rate limits persist across server process restarts and work consistently if multiple Node worker processes are spawned.
- **Possible Impact:** Restarting the Node server resets the rate limiter immediately. If Hostinger uses a cluster/multi-worker model, requests hitting different workers will have isolated counts.
- **Status:** **Known Architectural Limitation**.
- **Recommended Next Investigation / Fix:** Acceptable for current single-process Node setups. If quote spam becomes an issue, migrate rate limiting to a lightweight SQLite table (`RateLimitBucket`) or Redis.

---

## 3. Low-Severity Issues & Polish Items

### Issue 3.1: Deprecated Prisma Configuration in `package.json`
- **Severity:** **Low**
- **Evidence:** Output during `npm run build`:
  ```text
  warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7.
  Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
  ```
- **Affected Area:** `package.json` line 60 (`"prisma": { "seed": "npx tsx prisma/seed.ts" }`).
- **Current Behavior:** Prisma CLI logs a deprecation warning on every migration and seed run.
- **Expected Behavior:** Clean execution without deprecation warnings.
- **Possible Impact:** When Prisma 7 is released and upgraded, `prisma/seed.ts` execution via `package.json` will no longer work without migration.
- **Status:** **Upstream Deprecation Warning**.
- **Recommended Next Investigation / Fix:** Migrate to a `prisma.config.ts` file when preparing for Prisma 7 upgrade, verifying it does not trigger Next.js Turbopack build conflicts.

---

### Issue 3.2: Missing `metadataBase` Warning on Secondary Routes
- **Severity:** **Low**
- **Evidence:** Build log warning:
  ```text
  ⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000".
  ```
- **Affected Area:** Next.js static page generation on routes lacking explicit `metadataBase` definitions.
- **Current Behavior:** Falls back to `http://localhost:3000` when resolving relative OpenGraph and Twitter image URLs.
- **Expected Behavior:** All routes resolve social sharing image URLs against `NEXT_PUBLIC_SITE_URL` (default `https://noorsolaren.com`).
- **Possible Impact:** Social cards (Facebook/Twitter/LinkedIn) shared for certain secondary pages may have incomplete preview thumbnail URLs.
- **Status:** **Active SEO Warning**.
- **Recommended Next Investigation / Fix:** Ensure `metadataBase: new URL(siteUrl)` is set at the root `src/app/layout.tsx` so all child layouts inherit it.

---

### Issue 3.3: Public Product Reviews Lack Captcha Verification
- **Severity:** **Low**
- **Evidence:** `src/app/actions/reviews.ts` validates submissions via Zod and rate limits by IP, but does not use CAPTCHA (e.g. Cloudflare Turnstile).
- **Affected Area:** `src/app/actions/reviews.ts`, `ProductReview` model.
- **Current Behavior:** All submitted reviews are created with status `PENDING` and must be manually approved by the admin.
- **Expected Behavior:** Public submissions are held in `PENDING` status (working as designed), but could clutter the database if targeted by automated bots.
- **Possible Impact:** Admin moderation queue could fill with spam reviews if a spammer rotates IP addresses.
- **Status:** **Known Design Trade-off**.
- **Recommended Next Investigation / Fix:** Monitor spam volume; integrate Cloudflare Turnstile into `ProductReviewForm` if manual moderation becomes burdensome.
