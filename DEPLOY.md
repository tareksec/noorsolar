# NOOR SOLAR ENERGY — PRODUCTION DEPLOYMENT GUIDE (HOSTINGER NODE.JS)

This guide provides complete, step-by-step instructions for deploying Noor Solar Energy (`noorsolaren.com`) on **Hostinger Business or Cloud Hosting** using the built-in **Node.js Web App** manager (Node.js LTS 20.x or 22.x).

> [!IMPORTANT]
> **Owner Responsibility Notice:**
> - Steps marked with **[OWNER]** must be performed by the business owner in their Hostinger hPanel account and domain registrar.
> - Steps marked with **[DEPLOYER / CLI]** can be run via SSH or Hostinger Terminal.
> - **NEVER** commit real credentials, database passwords, or auth secrets to Git.

---

## 1. Prerequisites & Hostinger Environment Verification

Hostinger supports Node.js applications natively on Business Web Hosting and Cloud Hosting tiers via hPanel:
- **Verified Node.js versions:** Node.js 20.x LTS or Node.js 22.x LTS.
- **Deployment methods supported:**
  1. **GitHub Integration (Automated Deployments):** Connects directly to your GitHub repository and automatically pulls and rebuilds when you push to `main`.
  2. **Uploaded ZIP File (Manual File Manager Deployment):** Uploading a clean `.zip` archive via Hostinger File Manager.
- **Process Manager:** Hostinger's internal containerized Node.js manager handles process supervision, automatic restart on failure, and environment binding.

---

## 2. Setting Up Persistent Storage (Critical Step 0)

> [!CAUTION]
> **Why Persistent Directories Are Mandatory:**
> Every time you pull a new Git commit or upload a new ZIP file, Hostinger replaces files in the application deployment root. If your SQLite database file (`production.db`) or user uploads directory (`/uploads`) are inside the code repository, **THEY WILL BE WIPED ON REDEPLOYMENT**.
> You must create a persistent directory **outside** the application root.

### [OWNER or SSH] Create Persistent Folders
Connect via SSH or use Hostinger File Manager:
```bash
# Navigate to user home directory (above public_html)
cd /home/YOUR_HOSTINGER_USERNAME/

# Create a dedicated persistent storage folder
mkdir -p persistent_data/uploads
chmod -R 775 persistent_data
```

Your persistent paths will be:
- **Database file:** `/home/YOUR_HOSTINGER_USERNAME/persistent_data/production.db`
- **Uploads directory:** `/home/YOUR_HOSTINGER_USERNAME/persistent_data/uploads`

---

## 3. Configuring the Node.js Web App in Hostinger hPanel

### [OWNER] Step-by-Step hPanel Setup:
1. Log in to **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Websites** → Select or add `noorsolaren.com` (or your temporary staging subdomain).
3. Navigate to **Advanced** → **Node.js**.
4. Click **Create Application** (or Edit Application):
   - **Node.js Version:** Select **Node.js 20.x** or **Node.js 22.x**.
   - **Application Root:** Set to your site root (e.g. `public_html` or `/domains/noorsolaren.com/public_html`).
   - **Application Startup File:** Set to `node_modules/next/dist/bin/next` (with argument `start` in scripts) or create a root `server.js` wrapper if required by your specific hPanel prompt.
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`

---

## 4. Environment Variables Configuration

### [OWNER] Enter Environment Variables in hPanel:
In the **Environment Variables** section of the Node.js settings, add each key-value pair:

| Variable | Recommended Production Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production optimizations |
| `DATABASE_URL` | `file:/home/YOUR_USERNAME/persistent_data/production.db` | Absolute path to persistent SQLite DB |
| `UPLOAD_DIR` | `/home/YOUR_USERNAME/persistent_data/uploads` | Absolute path to persistent uploads |
| `AUTH_SECRET` | `openssl rand -hex 32` (generate a unique 64-char string) | Session encryption key |
| `ADMIN_EMAIL` | `owner@noorsolaren.com` | Primary admin login email |
| `ADMIN_PASSWORD` | Strong password (>= 12 characters, symbols/numbers) | Initial admin password for seeding |
| `NEXT_PUBLIC_SITE_URL` | `https://noorsolaren.com` (or preview URL) | Canonical URL for SEO and OG images |
| `HIDE_SAMPLE_CONTENT` | `false` (or `true` if keeping sample stats hidden) | Sample content display policy |
| `SEED_DEMO` | `false` | Production creates only admin user |

---

## 5. Deployment Methods (Choose A or B)

### Method A: Deploy from GitHub Repository (Recommended)
1. **[OWNER]** In Hostinger hPanel Node.js dashboard, choose **Git Deployment**.
2. Connect your GitHub account and select repository: `hasanshibly90/biniyog` (or your dedicated repository).
3. Select branch: `main`.
4. Click **Deploy**. Hostinger pulls the repository, installs packages with `npm install` / `npm ci`, and triggers the build.

### Method B: Deploy from Uploaded ZIP
1. **[DEPLOYER]** On your local machine, create a clean release archive (excluding `node_modules`, `.git`, `.next`, and local `.env`):
   ```bash
   git archive --format=zip --output=release-v1.0-rc1.zip main
   ```
2. **[OWNER]** In Hostinger hPanel → **File Manager**, upload `release-v1.0-rc1.zip` to the application root.
3. Extract the ZIP file in place and delete the archive file.
4. Open the Hostinger SSH console or Web Terminal in the application directory:
   ```bash
   npm ci
   npm run build
   ```

---

## 6. Database Initialization & Admin User Setup

### [DEPLOYER / SSH] Run Prisma Migrations and Seed
Execute the following commands inside the application root via SSH or Hostinger Terminal:

```bash
# 1. Apply Prisma migrations to the production database
npx prisma migrate deploy

# 2. Run the production database seed
# This safely creates the initial admin user and core categories.
npm run db:seed
```

The output should confirm:
```
✓ Admin user ensured: owner@noorsolaren.com
✓ Core site settings ensured.
✓ Core categories ensured.
ℹ️ Production environment: creating admin user and core settings only.
```

---

## 7. Testing on Hostinger Temporary URL (Preview Domain)

### [OWNER] Pre-Launch Verification on Preview URL:
1. Hostinger provides a preview URL (e.g. `https://noorsolaren-com.preview-domain.com`).
2. Test the following on the temporary URL:
   - Browse Home, Products, Categories, About, Contact.
   - Go to `/admin/login` and log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
   - **Immediately change password:** Go to `/admin/settings/password`, enter current password and set a new personal password (at least 12 characters).
   - Test commercial quotation form submission on `/` or `/contact`.
   - In `/admin/quotes`, verify the quote appears in the inbox.
   - In `/admin/products`, upload a test product image to verify that persistent uploads work.

---

## 8. Automated Backups & Disaster Recovery

### [OWNER] Backups in Hostinger:
1. **Hostinger Automated Backups:** Hostinger automatically takes daily or weekly snapshots of your hosting files and database.
2. **Manual SQLite Backup Command:**
   You can take a backup of the persistent database at any time using:
   ```bash
   sqlite3 /home/YOUR_USERNAME/persistent_data/production.db ".backup '/home/YOUR_USERNAME/persistent_data/backups/backup-$(date +%Y%m%d).db'"
   ```
   Download this `.db` file to secure offsite storage regularly.

---

## 9. DNS Switch to Go Live (Final Step)

> [!IMPORTANT]
> Perform this step ONLY after the preview URL tests pass completely.

### [OWNER] Point Domain to Hostinger:
1. Log in to your domain registrar where `noorsolaren.com` is registered.
2. **Option 1 (Hostinger Nameservers - Recommended):**
   - Change nameservers to:
     - `ns1.dns-parking.com`
     - `ns2.dns-parking.com`
3. **Option 2 (A Record pointing):**
   - Set `@` (Apex) A record to Hostinger Server IP (found in hPanel Dashboard).
   - Set `www` CNAME to `noorsolaren.com`.
4. In hPanel → **Security** → **SSL**, click **Install Free SSL** (Let's Encrypt).
5. Ensure **Force HTTPS** is enabled.
6. Verify live site over HTTPS: `https://noorsolaren.com`.
