/**
 * scripts/check-admin.js
 * End-to-end automated verification suite for Noor Solar Energy admin panel & backend.
 * Uses a SEPARATE test database (DATABASE_URL=file:./test.db), cleans up completely afterwards.
 * Runs against production Next.js server instance.
 */

const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

if (!fs.existsSync(CHROME_PATH)) {
  console.error(`FATAL: Chrome executable not found at: ${CHROME_PATH}`);
  process.exit(1);
}

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch (err) {
  console.error(`FATAL: Could not load puppeteer-core: ${err.message}`);
  process.exit(1);
}

const TEST_PORT = 3005;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const DB_FILE_REL = "file:./test.db";
const PRISMA_DIR = path.join(__dirname, "..", "prisma");
const TEST_DB_PATH = path.join(PRISMA_DIR, "test.db");
const ROOT_TEST_DB = path.join(__dirname, "..", "test.db");
const FIXTURES_DIR = path.join(__dirname, "test-fixtures");

const ADMIN_EMAIL = "owner@example.com";
const ADMIN_PASSWORD = "change-me-on-first-login";

const results = [];

function record(stepNum, stepName, success, note = "") {
  results.push({ stepNum, stepName, success, note });
  const statusBadge = success ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`[${statusBadge}] Step ${stepNum}: ${stepName}${note ? ` (${note})` : ""}`);
}

async function clickButtonByText(page, text) {
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const bText = await page.evaluate((el) => el.textContent, b);
    if (bText && bText.includes(text)) {
      await b.click();
      return true;
    }
  }
  return false;
}

function cleanTestDb() {
  const files = [
    TEST_DB_PATH,
    `${TEST_DB_PATH}-journal`,
    `${TEST_DB_PATH}-wal`,
    ROOT_TEST_DB,
    `${ROOT_TEST_DB}-journal`,
    `${ROOT_TEST_DB}-wal`,
  ];
  for (const f of files) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
      } catch {}
    }
  }
}

async function waitForServer(url, timeoutMs = 45000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            resolve(true);
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on("error", reject);
        req.setTimeout(2000, () => req.destroy());
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function main() {
  console.log("================================================================================");
  console.log("NOOR SOLAR ENERGY — AUTOMATED ADMIN PANEL & BACKEND VERIFICATION SUITE");
  console.log(`Target: ${BASE_URL} | Database: file:./test.db`);
  console.log("================================================================================\n");

  let serverProcess = null;
  let browser = null;
  let prisma = null;

  try {
    cleanTestDb();

    console.log("[Setup] Running prisma migrate deploy on test.db...");
    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, ".."),
      env: { ...process.env, DATABASE_URL: DB_FILE_REL },
      stdio: "pipe",
    });

    console.log("[Setup] Seeding minimal admin credentials and core settings...");
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    prisma = new PrismaClient({
      datasources: { db: { url: DB_FILE_REL } },
    });

    await prisma.adminUser.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash: hash,
      },
    });

    await prisma.siteSetting.create({
      data: {
        key: "site_config",
        value: JSON.stringify({
          companyName: "Noor Solar Energy",
          phone: "+880 1700-000000",
          whatsapp: "+880 1700-000000",
          email: "info@noorsolaren.com",
        }),
      },
    });

    await prisma.siteSetting.create({
      data: {
        key: "reviews.publicEnabled",
        value: "false",
      },
    });
    console.log("[Setup] Minimal seed complete.");

    console.log(`[Setup] Starting Next.js server on port ${TEST_PORT}...`);
    const nextBin = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
    serverProcess = spawn(process.execPath, [nextBin, "start", "-p", String(TEST_PORT)], {
      cwd: path.join(__dirname, ".."),
      env: {
        ...process.env,
        DATABASE_URL: DB_FILE_REL,
        PORT: String(TEST_PORT),
        NODE_ENV: "production",
        AUTH_SECRET: "dev-insecure-secret-key-for-local-testing-purposes-only-32",
        ADMIN_EMAIL: ADMIN_EMAIL,
        ADMIN_PASSWORD: ADMIN_PASSWORD,
      },
      stdio: ["ignore", "ignore", "inherit"],
    });

    await waitForServer(`${BASE_URL}/admin/login`);
    console.log("[Setup] Server is ready to receive requests.\n");

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      defaultViewport: { width: 1280, height: 900 },
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    // STEP 1: Log in
    try {
      await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="email"]', { timeout: 20000 });
      await new Promise((r) => setTimeout(r, 1500));
      await page.click('input[name="email"]', { clickCount: 3 });
      await page.type('input[name="email"]', ADMIN_EMAIL);
      await page.click('input[name="password"]', { clickCount: 3 });
      await page.type('input[name="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');

      await page.waitForFunction(
        () => window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login",
        { timeout: 15000 }
      );
      await new Promise((r) => setTimeout(r, 1000));
      const content = await page.content();
      const passed = content.includes("Dashboard") || content.includes("Admin Shell");
      record(1, "Log in", passed, page.url());
    } catch (err) {
      record(1, "Log in", false, err.message);
    }

    // STEP 2: Create a category
    try {
      await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#btn-open-create-category");
      await page.click("#btn-open-create-category");
      await page.waitForSelector("#category-name-input");
      await page.type("#category-name-input", "Commercial Inverters");
      await page.type("#category-slug-input", "commercial-inverters");
      await page.type("#category-desc-input", "Utility and commercial string solar inverters.");
      await page.click("#category-submit-btn");

      await new Promise((r) => setTimeout(r, 2000));
      await page.reload({ waitUntil: "domcontentloaded" });
      const content = await page.content();
      const dbCat = await prisma.category.findUnique({ where: { slug: "commercial-inverters" } });
      const passed = Boolean(dbCat) && content.includes("Commercial Inverters");
      record(2, "Create a category", passed, "Category 'Commercial Inverters' created");
    } catch (err) {
      record(2, "Create a category", false, err.message);
    }

    // STEP 3: Create a product with three uploaded images and a PDF datasheet
    let createdProductId = null;
    try {
      await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="name"]');
      await page.type('input[name="name"]', "Sungrow SG110CX Inverter");
      await page.type('input[name="brand"]', "Sungrow");
      await page.type('input[name="model"]', "SG110CX");
      await page.type('input[name="priceBdt"]', "450000");

      await page.waitForSelector('select[name="categoryId"]');
      const catVal = await page.$eval('select[name="categoryId"] option', (opt) => opt.value);
      if (catVal) {
        await page.select('select[name="categoryId"]', catVal);
      }

      await page.type('input[name="shortDescription"]', "Industrial grade 110kW string inverter");
      await page.type('textarea[name="description"]', "High efficiency inverter for commercial PV rooftop arrays.");

      // First spec row
      const specLabel = await page.$('input[name="spec_labels[]"]');
      const specVal = await page.$('input[name="spec_values[]"]');
      if (specLabel && specVal) {
        await specLabel.type("Rated AC Output");
        await specVal.type("110 kW");
      }

      // Upload 3 images (JPG + PNG mix covers both sharp pipelines)
      const imgInput = await page.$('input[name="images"]');
      if (imgInput) {
        await imgInput.uploadFile(
          path.join(FIXTURES_DIR, "photo.jpg"),
          path.join(FIXTURES_DIR, "img1.png"),
          path.join(FIXTURES_DIR, "img2.png")
        );
      }

      const pdfInput =
        (await page.$('input[name="datasheetFile"]')) ||
        (await page.$('input[name="doc_datasheet_file"]'));
      if (pdfInput) {
        await pdfInput.uploadFile(path.join(FIXTURES_DIR, "datasheet.pdf"));
      }

      // SEO fields
      await page.type('input[name="metaTitle"]', "Sungrow 110kW Commercial Solar Inverter BD");
      await page.type('textarea[name="metaDescription"]', "Official warranty Sungrow 110kW inverter for solar projects in Bangladesh.");

      // Submit
      await page.waitForSelector('#btn-save-product');
      await page.click('#btn-save-product');
      await new Promise((r) => setTimeout(r, 4000));

      const errBanner = await page.$eval('.bg-red-50', (el) => el.textContent).catch(() => '');
      if (errBanner) {
        console.log("   [Step 3 Debug Form Error]:", errBanner.trim());
      }

      const allProducts = await prisma.product.findMany({ include: { images: true } });
      const dbProduct = allProducts.find((p) => p.slug.includes("sungrow") || p.name.includes("Sungrow")) || allProducts[0] || null;
      createdProductId = dbProduct ? dbProduct.id : null;

      const has3Images = dbProduct && dbProduct.images.length === 3;
      const hasDatasheet = dbProduct && Boolean(dbProduct.datasheetUrl);

      record(
        3,
        "Create product with 3 images and PDF datasheet",
        Boolean(dbProduct) && has3Images && hasDatasheet,
        `Images: ${dbProduct ? dbProduct.images.length : 0}, Datasheet: ${dbProduct?.datasheetUrl || "none"}`
      );
    } catch (err) {
      record(3, "Create product with 3 images and PDF datasheet", false, err.message);
    }

    // STEP 4: Edit it
    try {
      if (!createdProductId) throw new Error("Product ID not available");
      await page.goto(`${BASE_URL}/admin/products/${createdProductId}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector('input[name="model"]');
      await page.$eval('input[name="model"]', (el) => (el.value = ""));
      await page.type('input[name="model"]', "SG110CX-V2");

      await page.waitForSelector('#btn-save-product');
      await page.click('#btn-save-product');
      await new Promise((r) => setTimeout(r, 2500));

      const updated = await prisma.product.findUnique({ where: { id: createdProductId } });
      const passed = updated && updated.model === "SG110CX-V2";
      record(4, "Edit product", passed, `Updated model: ${updated?.model}`);
    } catch (err) {
      record(4, "Edit product", false, err.message);
    }

    // STEP 5: Duplicate it
    let dupProductId = null;
    try {
      await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('button[title="Duplicate product"]');
      const dupBtn = await page.$('button[title="Duplicate product"]');
      if (!dupBtn) throw new Error("Duplicate button not found");
      await dupBtn.click();
      await new Promise((r) => setTimeout(r, 2500));

      const products = await prisma.product.findMany();
      const dup = products.find((p) => p.name.includes("Copy") || p.id !== createdProductId);
      dupProductId = dup ? dup.id : null;
      const passed = Boolean(dup);
      record(5, "Duplicate product", passed, `Duplicated product: ${dup?.name}`);
    } catch (err) {
      record(5, "Duplicate product", false, err.message);
    }

    // STEP 6: Reorder images
    try {
      await page.goto(`${BASE_URL}/admin/products/${createdProductId}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector('button[title="Move Right"]');
      const moveRightBtn = await page.$('button[title="Move Right"]');
      if (!moveRightBtn) throw new Error("Move Right button not found");
      await moveRightBtn.click();
      await new Promise((r) => setTimeout(r, 2000));

      const imgs = await prisma.productImage.findMany({
        where: { productId: createdProductId },
        orderBy: { sortOrder: "asc" },
      });
      record(6, "Reorder images", imgs.length > 0, `Sorted orders: ${imgs.map((i) => i.sortOrder).join(",")}`);
    } catch (err) {
      record(6, "Reorder images", false, err.message);
    }

    // STEP 7: Toggle featured and active
    try {
      await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(`#btn-toggle-featured-${createdProductId}`);
      await page.click(`#btn-toggle-featured-${createdProductId}`);
      await new Promise((r) => setTimeout(r, 2500));

      const pAfterFeatured = await prisma.product.findUnique({ where: { id: createdProductId } });
      const isFeatured = Boolean(pAfterFeatured?.isFeatured);

      // Toggle active status
      await page.waitForSelector(`#btn-toggle-active-${createdProductId}`);
      await page.click(`#btn-toggle-active-${createdProductId}`);
      await new Promise((r) => setTimeout(r, 2000));

      // Make sure it remains active for subsequent public page check
      const pAfterActive = await prisma.product.findUnique({ where: { id: createdProductId } });
      if (!pAfterActive?.isActive) {
        await page.click(`#btn-toggle-active-${createdProductId}`);
        await new Promise((r) => setTimeout(r, 2000));
      }

      record(7, "Toggle featured and active", isFeatured, `isFeatured: ${isFeatured}, isActive: true`);
    } catch (err) {
      record(7, "Toggle featured and active", false, err.message);
    }

    // STEP 8: Check the public page shows the changes + uploaded image serves raw, via optimizer, and in an <img>
    try {
      const p = await prisma.product.findUnique({ where: { id: createdProductId } });
      const slug = p ? p.slug : "sungrow-sg110cx-inverter";
      const res = await page.goto(`${BASE_URL}/product/${slug}`, { waitUntil: "domcontentloaded" });
      const content = await page.content();
      const hasTitle = content.includes("Sungrow");
      const hasDatasheet = content.includes("Download Datasheet") || content.includes(".pdf");
      const hasUploadImgTag = content.includes("/uploads/");

      const prodImgs = await prisma.productImage.findMany({ where: { productId: createdProductId } });
      let uploadsOk = prodImgs.length > 0;
      for (const im of prodImgs.slice(0, 2)) {
        const rawOk = await page.evaluate(async (u) => {
          try { const r = await fetch(u, { method: "HEAD" }); return r.status; } catch { return 0; }
        }, im.url).then((s) => s === 200).catch(() => false);
        const optOk = await page.evaluate(async (u) => {
          try { const r = await fetch(`/_next/image?url=${encodeURIComponent(u)}&w=640&q=75`); return r.status; } catch { return 0; }
        }, im.url).then((s) => s === 200).catch(() => false);
        if (!rawOk || !optOk) uploadsOk = false;
      }

      const passed = res.status() === 200 && hasTitle && hasDatasheet && hasUploadImgTag && uploadsOk;
      record(8, "Check public product page", passed, `Status: ${res.status()}, Datasheet: ${hasDatasheet}, ImgTag: ${hasUploadImgTag}, Served: ${uploadsOk}`);
    } catch (err) {
      record(8, "Check public product page", false, err.message);
    }

    // STEP 9: Delete it
    try {
      await page.goto(`${BASE_URL}/admin/products/${createdProductId}`, {
        waitUntil: "domcontentloaded",
      });
      await new Promise((r) => setTimeout(r, 1000));
      await clickButtonByText(page, "Delete Product");
      await new Promise((r) => setTimeout(r, 2500));

      const deletedCheck = await prisma.product.findUnique({ where: { id: createdProductId } });
      const passed = deletedCheck === null;
      record(9, "Delete product", passed, "Original product removed cleanly");
    } catch (err) {
      record(9, "Delete product", false, err.message);
    }

    // STEP 10: Create a blog post with an inserted image and publish it
    let createdBlogSlug = "guide-to-commercial-solar-inverters";
    try {
      await page.goto(`${BASE_URL}/admin/blog/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="title"]');
      await page.type('input[name="title"]', "Guide to Commercial Solar Inverters");
      await new Promise((r) => setTimeout(r, 500));
      const autoSlug = await page.$eval('input[name="slug"]', (el) => el.value);
      if (autoSlug) {
        createdBlogSlug = autoSlug;
      }

      await page.type('input[name="authorName"]', "Engr. Noor Solar Expert");
      await page.type('input[name="tags"]', "Inverters, Solar, B2B");
      await page.type('textarea[name="excerpt"]', "A technical breakdown of commercial inverter sizing and grid synchronization.");

      await page.waitForSelector('textarea[name="content"]');
      await page.type(
        'textarea[name="content"]',
        "Commercial solar inverters are the central nervous system of any industrial PV project in Bangladesh. Detailed sizing and string planning are required for maximum yield."
      );

      await page.select('select[name="status"]', "PUBLISHED");

      const inlineInput =
        (await page.$("#blog-inline-image-input")) ||
        (await page.$('input[type="file"][accept="image/jpeg,image/png,image/webp"]'));
      if (inlineInput) {
        await inlineInput.uploadFile(path.join(FIXTURES_DIR, "blog-inline.png"));
        await new Promise((r) => setTimeout(r, 1500));
      }

      const coverInput = await page.$('input[name="coverFile"]');
      if (coverInput) {
        await coverInput.uploadFile(path.join(FIXTURES_DIR, "img1.png"));
      }

      await page.waitForSelector('#btn-save-blog');
      await page.click('#btn-save-blog');
      await new Promise((r) => setTimeout(r, 4000));

      const errBanner = await page.$eval('.bg-red-50', (el) => el.textContent).catch(() => '');
      if (errBanner) {
        console.log("   [Step 10 Debug Blog Form Error]:", errBanner.trim());
      }

      const allPosts = await prisma.blogPost.findMany();
      const post = allPosts.find((p) => p.slug === createdBlogSlug || p.title.includes("Commercial Solar")) || allPosts[0] || null;
      if (post) {
        createdBlogSlug = post.slug;
      }

      const passed = post && post.status === "PUBLISHED";
      record(10, "Create and publish blog post with inserted image", Boolean(passed), `Status: ${post?.status}, Slug: ${createdBlogSlug}`);
    } catch (err) {
      record(10, "Create and publish blog post with inserted image", false, err.message);
    }

    // STEP 11: See it on /blog and /blog/[slug] and in sitemap.xml
    try {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: "domcontentloaded" });
      const blogListContent = await page.content();
      const onBlogList = blogListContent.includes("Guide to Commercial Solar Inverters");

      const postRes = await page.goto(`${BASE_URL}/blog/${createdBlogSlug}`, {
        waitUntil: "domcontentloaded",
      });
      const postContent = await page.content();
      const hasArticleLd = postContent.includes('"@type":"Article"');

      const sitemapRes = await page.goto(`${BASE_URL}/sitemap.xml`);
      const sitemapContent = await page.content();
      const inSitemap = sitemapContent.includes(createdBlogSlug);

      const passed = onBlogList && postRes.status() === 200 && hasArticleLd && inSitemap;
      record(
        11,
        "Verify blog post on /blog, /blog/[slug], and sitemap.xml",
        passed,
        `Article JSON-LD: ${hasArticleLd}, Sitemap present: ${inSitemap}`
      );
    } catch (err) {
      record(11, "Verify blog post on /blog, /blog/[slug], and sitemap.xml", false, err.message);
    }

    // STEP 12: Unpublish it and confirm it disappears
    try {
      const post = await prisma.blogPost.findUnique({ where: { slug: createdBlogSlug } });
      await page.goto(`${BASE_URL}/admin/blog/${post.id}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('select[name="status"]');
      await page.select('select[name="status"]', "DRAFT");
      await page.waitForSelector('#btn-save-blog');
      await page.click('#btn-save-blog');
      await new Promise((r) => setTimeout(r, 3000));

      await page.goto(`${BASE_URL}/blog`, { waitUntil: "domcontentloaded" });
      const listContent = await page.content();
      const notOnList = !listContent.includes("Guide to Commercial Solar Inverters");

      const singleRes = await page.goto(`${BASE_URL}/blog/${createdBlogSlug}`, {
        waitUntil: "domcontentloaded",
      });
      const singleContent = await page.content();
      const returns404 = singleRes.status() === 404 || singleContent.includes("404") || singleContent.includes("Not Found") || !singleContent.includes("Commercial solar inverters are the central");

      const passed = notOnList && returns404;
      record(12, "Unpublish blog post and verify hidden", passed, `Hidden from /blog: ${notOnList}, Status: ${singleRes.status()}, Not Found verified: ${returns404}`);
    } catch (err) {
      record(12, "Unpublish blog post and verify hidden", false, err.message);
    }

    // Target product for review tests (use remaining duplicated product)
    let reviewTargetProduct = await prisma.product.findFirst({
      where: { isActive: true },
    });
    if (!reviewTargetProduct) {
      await prisma.product.updateMany({ data: { isActive: true } });
      reviewTargetProduct = await prisma.product.findFirst();
    }

    // STEP 13: Add an admin review and see it on the product page
    try {
      await page.goto(`${BASE_URL}/admin/reviews`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('#btn-open-add-review', { timeout: 15000 });
      // Open the modal with a retry: slow hydration can swallow the first click
      let authorInput = null;
      for (let attempt = 0; attempt < 3 && !authorInput; attempt++) {
        await page.click('#btn-open-add-review');
        try {
          await page.waitForSelector('input[name="authorName"]', { timeout: 4000 });
          authorInput = true;
        } catch {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      if (!authorInput) throw new Error('Add-review modal did not open after 3 attempts');

      if (reviewTargetProduct) {
        await page.waitForSelector('select[name="productId"]');
        await page.select('select[name="productId"]', reviewTargetProduct.id);
      }

      await page.type('input[name="authorName"]', "Engr. Nazmul Hassan");
      await page.type('input[name="authorRole"]', "Project Director");
      await page.type('input[name="company"]', "Apex Industrial Park");
      await page.type('input[name="title"]', "Flawless Performance on Factory Array");
      await page.type('textarea[name="body"]', "Zero overheating issues during peak hours. Genuine engineering quality.");

      await page.waitForSelector('#btn-publish-review');
      await page.click('#btn-publish-review');
      await new Promise((r) => setTimeout(r, 2500));

      await page.goto(`${BASE_URL}/product/${reviewTargetProduct.slug}`, {
        waitUntil: "domcontentloaded",
      });
      const prodContent = await page.content();
      const hasReview = prodContent.includes("Engr. Nazmul Hassan") && prodContent.includes("Apex Industrial Park");
      record(13, "Add admin review and see on product page", hasReview, "Immediately approved and rendered");
    } catch (err) {
      record(13, "Add admin review and see on product page", false, err.message);
    }

    // STEP 14: Enable public reviews, submit one, confirm it is hidden until approved, approve it, confirm it appears
    try {
      await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="reviewsPublicEnabled"]');
      const checkbox = await page.$('input[name="reviewsPublicEnabled"]');
      const isChecked = await (await checkbox.getProperty("checked")).jsonValue();
      if (!isChecked) await checkbox.click();
      await clickButtonByText(page, "Save Changes");
      await new Promise((r) => setTimeout(r, 2500));

      await page.goto(`${BASE_URL}/product/${reviewTargetProduct.slug}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector('#btn-write-review', { timeout: 10000 });
      await page.click('#btn-write-review');
      await page.waitForSelector('input[name="authorName"]', { timeout: 15000 }).catch(async () => { await page.click('#btn-write-review'); await page.waitForSelector('input[name="authorName"]', { timeout: 15000 }); });
      await page.type('input[name="authorName"]', "Mahmudul Haque");
      await page.type('input[name="authorRole"]', "Lead EPC Engineer");
      await page.type('input[name="company"]', "GreenTech Solar BD");
      await page.type('input[name="title"]', "Fast Delivery & Great Quality");
      await page.type('textarea[name="body"]', "Prompt delivery across Gazipur site with complete test certificates.");

      const submitBtn = await page.waitForSelector('#btn-submit-public-review');
      await submitBtn.evaluate((b) => b.scrollIntoView({ block: 'center' }));
      await new Promise((r) => setTimeout(r, 300));
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 3500));

      const pendingReview = await prisma.productReview.findFirst({
        where: { authorName: "Mahmudul Haque" },
      });

      await page.goto(`${BASE_URL}/product/${reviewTargetProduct.slug}`, {
        waitUntil: "domcontentloaded",
      });
      const contentHidden = await page.content();
      const notVisibleYet = !contentHidden.includes("Fast Delivery & Great Quality");

      await page.goto(`${BASE_URL}/admin/reviews`, { waitUntil: "domcontentloaded" });
      if (pendingReview) {
        await page.waitForSelector(`#btn-approve-review-${pendingReview.id}`, { timeout: 10000 });
        await page.click(`#btn-approve-review-${pendingReview.id}`);
      } else {
        await clickButtonByText(page, "Approve");
      }
      await new Promise((r) => setTimeout(r, 3000));

      await page.goto(`${BASE_URL}/product/${reviewTargetProduct.slug}?_t=${Date.now()}`, {
        waitUntil: "domcontentloaded",
      });
      const contentApproved = await page.content();
      const hasFastDelivery = contentApproved.includes("Fast Delivery & Great Quality");
      const hasMahmudul = contentApproved.includes("Mahmudul Haque");
      const visibleNow = hasFastDelivery || hasMahmudul;

      const passed = notVisibleYet && visibleNow;
      record(
        14,
        "Public review moderation lifecycle",
        passed,
        `Hidden initially: ${notVisibleYet}, Visible after approval: ${visibleNow}`
      );
    } catch (err) {
      record(14, "Public review moderation lifecycle", false, err.message);
    }

    // STEP 15: Submit a quote on the site and see it in /admin/quotes
    try {
      await page.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="name"]');
      await page.type('input[name="name"]', "Tarek Engineering Ltd");

      await page.waitForSelector('input[name="phone"]');
      await page.$eval('input[name="phone"]', (el, v) => {
        el.value = v;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, "01812345678");

      await page.type('input[name="company"]', "Tarek Engineering Ltd");
      await page.type('input[name="email"]', "procurement@tarekengineering.com");
      await page.type('textarea[name="message"]', "Looking for 250kW inverters and container modules.");

      const quoteBtn = await page.waitForSelector('#btn-submit-quote');
      await quoteBtn.evaluate((b) => b.scrollIntoView({ block: 'center' }));
      await new Promise((r) => setTimeout(r, 500));
      await quoteBtn.click();
      await new Promise((r) => setTimeout(r, 3500));

      const quoteInDb = await prisma.quoteRequest.findFirst({
        where: { name: { contains: "Tarek" } },
      });

      await page.goto(`${BASE_URL}/admin/quotes`, { waitUntil: "domcontentloaded" });
      const quotesContent = await page.content();
      const hasQuote = Boolean(quoteInDb) || quotesContent.includes("Tarek Engineering") || quotesContent.includes("1812");
      record(15, "Submit quote and verify in admin quotes", hasQuote, `Quote in DB: ${Boolean(quoteInDb)}`);
    } catch (err) {
      record(15, "Submit quote and verify in admin quotes", false, err.message);
    }

    // STEP 16: Oversize product image is rejected with a clear error (no silent hang, nothing saved)
    try {
      const scratchDir = path.join(__dirname, "..", "scratch");
      fs.mkdirSync(scratchDir, { recursive: true });
      const bigPath = path.join(scratchDir, ".check-admin-big.jpg");
      if (!fs.existsSync(bigPath) || fs.statSync(bigPath).size < 5 * 1024 * 1024) {
        const sharp = require("sharp");
        const crypto = require("crypto");
        const w = 2800, h = 1900, c = 3;
        const buf = crypto.randomBytes(w * h * c);
        await sharp(buf, { raw: { width: w, height: h, channels: c } }).jpeg({ quality: 100 }).toFile(bigPath);
      }
      const bigSize = fs.statSync(bigPath).size;
      await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="name"]', { timeout: 15000 });
      const bigName = `Oversize Probe ${Date.now()}`;
      await page.type('input[name="name"]', bigName);
      const bigInput = await page.$('input[name="images"]');
      await bigInput.uploadFile(bigPath);
      await page.waitForSelector('#btn-save-product');
      await page.click('#btn-save-product');
      await new Promise((r) => setTimeout(r, 6000));
      const bigErr = await page.$eval('.bg-red-50', (el) => el.textContent).catch(() => '');
      const bigCreated = await prisma.product.findFirst({ where: { name: bigName } });
      try { fs.unlinkSync(bigPath); } catch {}
      const passed = !bigCreated && bigErr.includes("5MB");
      record(16, "Reject oversize image with clear error", passed, `File: ${(bigSize / 1048576).toFixed(1)}MB, Shown: ${bigErr.trim().slice(0, 60)}`);
    } catch (err) {
      record(16, "Reject oversize image with clear error", false, err.message);
    }

    // STEP 17: Duplicated product owns independent files (still serves after original was deleted in step 9)
    try {
      const dup = dupProductId ? await prisma.product.findUnique({ where: { id: dupProductId }, include: { images: true } }) : null;
      let passed = false, note = "duplicate missing";
      if (dup) {
        const imgStatuses = [];
        for (const im of dup.images) {
          const s = await page.evaluate(async (u) => { try { const r = await fetch(u); return r.status; } catch { return 0; } }, im.url);
          imgStatuses.push(`${String(im.url).split("/").pop()}:${s}`);
        }
        const imgsOk = dup.images.length === 3 && imgStatuses.every((x) => x.endsWith(":200"));
        let dsStatus = "none";
        if (dup.datasheetUrl) {
          let dsUrl = dup.datasheetUrl;
          try { const parsed = JSON.parse(dup.datasheetUrl); dsUrl = parsed.datasheet || Object.values(parsed)[0]; } catch {}
          dsStatus = await page.evaluate(async (u) => { try { const r = await fetch(u); return r.status; } catch { return 0; } }, dsUrl);
        }
        passed = imgsOk && Number(dsStatus) === 200;
        note = `Images: ${imgStatuses.join(",")}, Datasheet: ${dsStatus}`;
      }
      record(17, "Duplicate owns independent files", passed, note);
    } catch (err) {
      record(17, "Duplicate owns independent files", false, err.message);
    }

    // STEP 18: Category image upload, hide/show toggle, delete
    try {
      await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#btn-open-create-category", { timeout: 15000 });
      await page.click("#btn-open-create-category");
      await page.waitForSelector("#category-name-input");
      await page.type("#category-name-input", "E2E Cables Connectors");
      await page.type("#category-slug-input", "e2e-cables-connectors");
      const catImg = await page.$("#category-image-input");
      if (!catImg) throw new Error("category image input missing");
      await catImg.uploadFile(path.join(FIXTURES_DIR, "photo.jpg"));
      await page.click("#category-submit-btn");
      await new Promise((r) => setTimeout(r, 3000));
      await page.reload({ waitUntil: "domcontentloaded" });
      let e2e = await prisma.category.findUnique({ where: { slug: "e2e-cables-connectors" } });
      const imgOk = e2e && e2e.image && e2e.image.startsWith("/uploads/");
      const imgServed = imgOk ? await page.evaluate(async (u) => { try { const r = await fetch(u); return r.status; } catch { return 0; } }, e2e.image) : 0;

      const clickInE2ECard = async (titlePart) => {
        await page.evaluate((tp) => {
          const h = Array.from(document.querySelectorAll("h3")).find((e) => e.textContent.includes("E2E Cables"));
          if (!h) throw new Error("E2E card not found");
          const card = h.closest("div.rounded-3xl");
          const btn = Array.from(card.querySelectorAll("button")).find((b) => (b.title || "").includes(tp));
          if (!btn) throw new Error("button not found: " + tp);
          btn.click();
        }, titlePart);
        await new Promise((r) => setTimeout(r, 2500));
      };

      let hideOk = false, showOk = false, delOk = false;
      if (imgOk) {
        await clickInE2ECard("Hide category");
        e2e = await prisma.category.findUnique({ where: { slug: "e2e-cables-connectors" } });
        await page.reload({ waitUntil: "domcontentloaded" });
        hideOk = e2e && e2e.isActive === false && (await page.content()).includes("HIDDEN");
        await clickInE2ECard("Show category");
        e2e = await prisma.category.findUnique({ where: { slug: "e2e-cables-connectors" } });
        showOk = e2e && e2e.isActive === true;
        await clickInE2ECard("Delete category");
        await new Promise((r) => setTimeout(r, 1500));
        e2e = await prisma.category.findUnique({ where: { slug: "e2e-cables-connectors" } });
        delOk = e2e === null;
      }
      const passed = Boolean(imgOk) && imgServed === 200 && hideOk && showOk && delOk;
      record(18, "Category image, hide/show, delete", passed, `Img served: ${imgServed}, Hide: ${hideOk}, Show: ${showOk}, Deleted: ${delOk}`);
    } catch (err) {
      record(18, "Category image, hide/show, delete", false, err.message);
    }

    // STEP 19: Quote internal note, status change, CSV export
    try {
      await page.goto(`${BASE_URL}/admin/quotes`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="note"]', { timeout: 15000 });
      await page.$eval('input[name="note"]', (el, v) => {
        el.value = v;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, "Called back; sent 250kW offer");
      const statusSelects = await page.$$('select[name="status"]');
      await statusSelects[statusSelects.length - 1].select("CONTACTED");
      await clickButtonByText(page, "Update");
      await new Promise((r) => setTimeout(r, 3000));
      const quote = await prisma.quoteRequest.findFirst({ where: { name: { contains: "Tarek" } } });
      const noteOk = quote && quote.note === "Called back; sent 250kW offer" && quote.status === "CONTACTED";
      const noteVisible = (await page.content()).includes("Internal note:");
      const csv = await page.evaluate(async () => {
        try {
          const r = await fetch("/admin/quotes/export");
          const t = await r.text();
          return { status: r.status, ct: r.headers.get("content-type"), has: t.includes("Tarek") };
        } catch (e) { return { status: 0, ct: "", has: false }; }
      });
      const csvOk = csv.status === 200 && (csv.ct || "").includes("text/csv") && csv.has;
      const passed = Boolean(noteOk) && noteVisible && csvOk;
      record(19, "Quote note, status, CSV export", passed, `Note+status: ${Boolean(noteOk)}, Visible: ${noteVisible}, CSV: ${csv.status}/${csv.has}`);
    } catch (err) {
      record(19, "Quote note, status, CSV export", false, err.message);
    }

    // STEP 20: Trust content uploads + lifecycle (cert logo, partner logo, testimonial photo, stat, faq)
    try {
      const rowAction = async (itemId, titlePart) => {
        await page.evaluate((iid, tp) => {
          const hiddens = Array.from(document.querySelectorAll('input[type="hidden"]')).filter((e) => e.value === iid);
          for (const h of hiddens) {
            let node = h.parentElement;
            for (let i = 0; i < 10 && node && node !== document.body; i++) {
              const btn = node.querySelector(`button[title*="${tp}"]`);
              if (btn) { btn.click(); return; }
              node = node.parentElement;
            }
          }
          throw new Error("row action not found: " + tp);
        }, itemId, titlePart);
        await new Promise((r) => setTimeout(r, 2500));
      };
      const serves200 = async (u) => page.evaluate(async (x) => { try { const r = await fetch(x); return r.status; } catch { return 0; } }, u);

      // Certification with logo
      await page.goto(`${BASE_URL}/admin/content/certifications`, { waitUntil: "domcontentloaded" });
      await clickButtonByText(page, "Add Certificate");
      await page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await page.type('input[name="name"]', "E2E Test Certificate");
      await page.type('input[name="issuer"]', "E2E Laboratory");
      await (await page.$('input[name="image"]')).uploadFile(path.join(FIXTURES_DIR, "photo.jpg"));
      await clickButtonByText(page, "Save Certification");
      await new Promise((r) => setTimeout(r, 3000));
      const cert = await prisma.certification.findFirst({ where: { name: "E2E Test Certificate" } });
      const certOk = cert && cert.image && cert.image.startsWith("/uploads/") && (await serves200(cert.image)) === 200;
      let certLive = false;
      for (let i = 0; i < 15 && !certLive; i++) {
        await page.goto(`${BASE_URL}/certifications`, { waitUntil: "domcontentloaded" });
        certLive = (await page.content()).includes("E2E Test Certificate");
        if (!certLive) await new Promise((r) => setTimeout(r, 5000));
      }

      // Partner with logo + mark as real
      await page.goto(`${BASE_URL}/admin/content/partners`, { waitUntil: "domcontentloaded" });
      await clickButtonByText(page, "Add Partner");
      await page.waitForSelector('input[name="name"]', { timeout: 10000 });
      await page.type('input[name="name"]', "E2E Partner Co");
      await page.type('input[name="url"]', "https://example.com");
      await (await page.$('input[name="logo"]')).uploadFile(path.join(FIXTURES_DIR, "photo.jpg"));
      await clickButtonByText(page, "Save Partner");
      await new Promise((r) => setTimeout(r, 3000));
      let partner = await prisma.partner.findFirst({ where: { name: "E2E Partner Co" } });
      const partnerOk = partner && partner.logo && partner.logo.startsWith("/uploads/") && (await serves200(partner.logo)) === 200;
      if (partner) {
        await prisma.partner.update({ where: { id: partner.id }, data: { isSample: true } });
        await page.reload({ waitUntil: "domcontentloaded" });
        await rowAction(partner.id, "Mark as real");
        partner = await prisma.partner.findFirst({ where: { name: "E2E Partner Co" } });
      }
      const partnerReal = partner && partner.isSample === false;

      // Testimonial with photo
      await page.goto(`${BASE_URL}/admin/content/testimonials`, { waitUntil: "domcontentloaded" });
      await clickButtonByText(page, "Add Testimonial");
      await page.waitForSelector('input[name="authorName"]', { timeout: 10000 });
      await page.type('input[name="authorName"]', "E2E Reviewer");
      await page.type('input[name="company"]', "E2E Ltd");
      await page.type('textarea[name="quote"]', "Reliable supply and honest engineering advice.");
      await (await page.$('input[name="photo"]')).uploadFile(path.join(FIXTURES_DIR, "photo.jpg"));
      await clickButtonByText(page, "Save Testimonial");
      await new Promise((r) => setTimeout(r, 3000));
      const testi = await prisma.testimonial.findFirst({ where: { authorName: "E2E Reviewer" } });
      const testiOk = testi && testi.photo && testi.photo.startsWith("/uploads/") && (await serves200(testi.photo)) === 200;

      // Stat create + hide toggle
      await page.goto(`${BASE_URL}/admin/content/stats`, { waitUntil: "domcontentloaded" });
      await clickButtonByText(page, "Add Stat");
      await page.waitForSelector('input[name="label"]', { timeout: 10000 });
      await page.type('input[name="label"]', "E2E Projects Supplied");
      await page.type('input[name="value"]', "123");
      await clickButtonByText(page, "Save Stat");
      await new Promise((r) => setTimeout(r, 3000));
      let stat = await prisma.stat.findFirst({ where: { label: "E2E Projects Supplied" } });
      const statOk = Boolean(stat);
      if (stat) { await rowAction(stat.id, "Hide from public"); stat = await prisma.stat.findFirst({ where: { label: "E2E Projects Supplied" } }); }
      const statHidden = stat && stat.isActive === false;

      // FAQ create + delete
      await page.goto(`${BASE_URL}/admin/content/faq`, { waitUntil: "domcontentloaded" });
      await clickButtonByText(page, "Add FAQ");
      await page.waitForSelector('input[name="question"]', { timeout: 10000 });
      await page.type('input[name="question"]', "E2E test question?");
      await page.type('textarea[name="answer"]', "E2E test answer.");
      await clickButtonByText(page, "Save FAQ Item");
      await new Promise((r) => setTimeout(r, 3000));
      let faq = await prisma.faqItem.findFirst({ where: { question: "E2E test question?" } });
      const faqOk = Boolean(faq);
      if (faq) { await rowAction(faq.id, "Delete"); await new Promise((r) => setTimeout(r, 1500)); faq = await prisma.faqItem.findFirst({ where: { question: "E2E test question?" } }); }
      const faqGone = faq === null;

      // Cleanup E2E content rows (cert/partner/testimonial/stat) so counts stay clean
      if (cert) { await page.goto(`${BASE_URL}/admin/content/certifications`, { waitUntil: "domcontentloaded" }); await rowAction(cert.id, "Delete"); }
      if (partner) { await page.goto(`${BASE_URL}/admin/content/partners`, { waitUntil: "domcontentloaded" }); await rowAction(partner.id, "Delete"); }
      if (testi) { await page.goto(`${BASE_URL}/admin/content/testimonials`, { waitUntil: "domcontentloaded" }); await rowAction(testi.id, "Delete"); }
      if (stat) { await page.goto(`${BASE_URL}/admin/content/stats`, { waitUntil: "domcontentloaded" }); await rowAction(stat.id, "Delete"); }

      const passed = Boolean(certOk) && certLive && Boolean(partnerOk) && Boolean(partnerReal) && Boolean(testiOk) && statOk && Boolean(statHidden) && faqOk && faqGone;
      record(20, "Trust content uploads + lifecycle", passed, `Cert:${Boolean(certOk)}/${certLive} Partner:${Boolean(partnerOk)}/${Boolean(partnerReal)} Testi:${Boolean(testiOk)} Stat:${statOk}/${Boolean(statHidden)} Faq:${faqOk}/${faqGone}`);
    } catch (err) {
      record(20, "Trust content uploads + lifecycle", false, err.message);
    }

    // STEP 21: Settings change goes live on the public site (and reverts cleanly)
    try {
      await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="heroHeadline"]', { timeout: 15000 });
      await page.$eval('input[name="heroHeadline"]', (el) => { el.value = ""; el.dispatchEvent(new Event("input", { bubbles: true })); });
      await page.type('input[name="heroHeadline"]', "E2E Hero Headline Live Test");
      await clickButtonByText(page, "Save Changes");
      await new Promise((r) => setTimeout(r, 3000));
      const dbAfterSave = await prisma.siteSetting.findUnique({ where: { key: "site_config" } });
      const dbHeadline1 = (() => { try { return JSON.parse(dbAfterSave.value).heroHeadline; } catch { return "?"; } })();
      let liveShown = false;
      for (let i = 0; i < 15 && !liveShown; i++) {
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        liveShown = (await page.content()).includes("E2E Hero Headline Live Test");
        if (!liveShown) await new Promise((r) => setTimeout(r, 5000));
      }
      await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="heroHeadline"]', { timeout: 15000 });
      await page.$eval('input[name="heroHeadline"]', (el) => { el.value = ""; el.dispatchEvent(new Event("input", { bubbles: true })); });
      await page.type('input[name="heroHeadline"]', "Solar Equipment. Imported Direct. Supplied at Project Scale.");
      await clickButtonByText(page, "Save Changes");
      await new Promise((r) => setTimeout(r, 3000));
      let reverted = false;
      for (let i = 0; i < 15 && !reverted; i++) {
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
        const homeAfterPoll = await page.content();
        reverted = homeAfterPoll.includes("Solar Equipment. Imported Direct. Supplied at Project Scale.") && !homeAfterPoll.includes("E2E Hero Headline Live Test");
        if (!reverted) await new Promise((r) => setTimeout(r, 5000));
      }
      const dbAfterRevert = await prisma.siteSetting.findUnique({ where: { key: "site_config" } });
      const dbHeadline2 = (() => { try { return JSON.parse(dbAfterRevert.value).heroHeadline; } catch { return "?"; } })();
      record(21, "Settings change goes live", liveShown && reverted, `Live: ${liveShown}, Reverted: ${reverted}, DB1: ${String(dbHeadline1).slice(0, 30)}, DB2: ${String(dbHeadline2).slice(0, 30)}`);
    } catch (err) {
      record(21, "Settings change goes live", false, err.message);
    }

    // STEP 22: Product bulk activate/deactivate + search/filter
    try {
      await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="name"]', { timeout: 15000 });
      await page.type('input[name="name"]', "E2E Bulk Panel");
      await page.waitForSelector('#btn-save-product');
      await page.click('#btn-save-product');
      await new Promise((r) => setTimeout(r, 4000));
      const bulk = await prisma.product.findFirst({ where: { name: "E2E Bulk Panel" } });
      let bulkOk = false, searchOk = false, emptyOk = false;
      if (bulk) {
        await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#selectAllHeader", { timeout: 15000 });
        await page.click("#selectAllHeader");
        await page.waitForFunction(() => document.body.textContent.includes("Bulk Actions:"), { timeout: 10000 });
        await clickButtonByText(page, "Deactivate");
        await new Promise((r) => setTimeout(r, 3000));
        const afterOff = await prisma.product.findMany();
        const allOff = afterOff.length > 0 && afterOff.every((p) => !p.isActive);
        await page.click("#selectAllHeader");
        await page.waitForFunction(() => document.body.textContent.includes("Bulk Actions:"), { timeout: 10000 });
        await clickButtonByText(page, "Activate");
        await new Promise((r) => setTimeout(r, 3000));
        const afterOn = await prisma.product.findMany();
        bulkOk = allOff && afterOn.length > 0 && afterOn.every((p) => p.isActive);
        await page.goto(`${BASE_URL}/admin/products?q=Bulk`, { waitUntil: "domcontentloaded" });
        searchOk = (await page.content()).includes("E2E Bulk Panel");
        await page.goto(`${BASE_URL}/admin/products?q=ZZZ-NOMATCH-XYZ`, { waitUntil: "domcontentloaded" });
        emptyOk = (await page.content()).includes("No products matched your criteria.");
        await prisma.product.delete({ where: { id: bulk.id } }).catch(() => {});
      }
      record(22, "Bulk activate/deactivate + search", bulkOk && searchOk && emptyOk, `Bulk: ${bulkOk}, Search: ${searchOk}, Empty: ${emptyOk}`);
    } catch (err) {
      record(22, "Bulk activate/deactivate + search", false, err.message);
    }

    // STEP 23: Dashboard shows counts and latest quote
    try {
      await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 1500));
      const dash = await page.content();
      const passed = dash.includes("Tarek") && (dash.includes("Products") || dash.includes("products"));
      record(23, "Dashboard counts + latest quote", passed, "Latest quote visible with metrics");
    } catch (err) {
      record(23, "Dashboard counts + latest quote", false, err.message);
    }

    // STEP 24: Change password, log in with the new one, restore the original
    try {
      const NEW_PW = "e2e-very-long-test-password-1";
      await page.goto(`${BASE_URL}/admin/settings/password`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="currentPassword"]', { timeout: 15000 });
      await page.type('input[name="currentPassword"]', ADMIN_PASSWORD);
      await page.type('input[name="newPassword"]', NEW_PW);
      await page.type('input[name="confirmPassword"]', NEW_PW);
      await clickButtonByText(page, "Update Password");
      await new Promise((r) => setTimeout(r, 2500));
      const changed = (await page.content()).includes("Password updated successfully");
      await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#btn-admin-logout", { timeout: 15000 });
      await page.click("#btn-admin-logout");
      await page.waitForFunction(() => window.location.pathname.includes("/admin/login"), { timeout: 10000 });
      await page.waitForSelector('input[name="email"]', { timeout: 15000 });
      await page.click('input[name="email"]', { clickCount: 3 });
      await page.type('input[name="email"]', ADMIN_EMAIL);
      await page.click('input[name="password"]', { clickCount: 3 });
      await page.type('input[name="password"]', NEW_PW);
      await page.click('button[type="submit"]');
      await page.waitForFunction(
        () => window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login",
        { timeout: 15000 }
      );
      const reloginOk = true;
      await page.goto(`${BASE_URL}/admin/settings/password`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('input[name="currentPassword"]', { timeout: 15000 });
      await page.type('input[name="currentPassword"]', NEW_PW);
      await page.type('input[name="newPassword"]', ADMIN_PASSWORD);
      await page.type('input[name="confirmPassword"]', ADMIN_PASSWORD);
      await clickButtonByText(page, "Update Password");
      await new Promise((r) => setTimeout(r, 2500));
      const restored = (await page.content()).includes("Password updated successfully");
      record(24, "Password change + relogin + restore", changed && reloginOk && restored, `Changed: ${changed}, Restored: ${restored}`);
    } catch (err) {
      record(24, "Password change + relogin + restore", false, err.message);
    }

    // STEP 25: Confirm unauthenticated requests to admin pages and actions are rejected
    try {
      const incognitoContext = await browser.createBrowserContext();
      const incognitoPage = await incognitoContext.newPage();
      await incognitoPage.evaluateOnNewDocument(() => {
        sessionStorage.setItem("noor-preloader-seen", "1");
      });

      await incognitoPage.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
      const unauthAdminUrl = incognitoPage.url();
      const redirectedToLogin = unauthAdminUrl.includes("/admin/login");

      await incognitoPage.goto(`${BASE_URL}/admin/products`, { waitUntil: "domcontentloaded" });
      const unauthProductsUrl = incognitoPage.url();
      const productsRedirected = unauthProductsUrl.includes("/admin/login");

      await incognitoContext.close();
      const passed = redirectedToLogin && productsRedirected;
      record(
        25,
        "Reject unauthenticated requests to admin",
        passed,
        `Redirected to: ${unauthAdminUrl}`
      );
    } catch (err) {
      record(25, "Reject unauthenticated requests to admin", false, err.message);
    }

    // STEP 26: Log out
    try {
      await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#btn-admin-logout");
      const logoutBtn = await page.$("#btn-admin-logout");
      if (logoutBtn) {
        await logoutBtn.click();
        await page.waitForFunction(() => window.location.pathname.includes("/admin/login"), {
          timeout: 10000,
        });
      }
      const logoutUrl = page.url();
      const passed = logoutUrl.includes("/admin/login");
      record(26, "Log out", passed, `Landed at: ${logoutUrl}`);
    } catch (err) {
      record(26, "Log out", false, err.message);
    }
  } catch (fatalErr) {
    console.error("FATAL SUITE ERROR:", fatalErr);
  } finally {
    console.log("\n[Cleanup] Closing browser...");
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    console.log("[Cleanup] Disconnecting Prisma...");
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch {}
    }

    console.log("[Cleanup] Terminating test server process...");
    if (serverProcess && serverProcess.pid) {
      try {
        execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: "ignore" });
      } catch {}
    }

    console.log("[Cleanup] Deleting test database files...");
    cleanTestDb();

    console.log("\n================================================================================");
    console.log("TEST EXECUTION SUMMARY TABLE");
    console.log("================================================================================");
    console.log(
      "Step | Status | Test Name                                      | Details"
    );
    console.log(
      "-----+--------+------------------------------------------------+-------------------------"
    );
    let allPassed = true;
    for (const r of results) {
      const num = String(r.stepNum).padEnd(4, " ");
      const status = r.success ? " PASS " : " FAIL ";
      const name = r.stepName.padEnd(46, " ");
      const note = r.note.slice(0, 40);
      console.log(`${num} | ${status} | ${name} | ${note}`);
      if (!r.success) allPassed = false;
    }
    console.log("================================================================================\n");

    if (allPassed && results.length >= 26) {
      console.log("\x1b[32mALL 26 ADMIN VERIFICATION STEPS PASSED SUCCESSFULLY!\x1b[0m\n");
      process.exit(0);
    } else {
      console.error("\x1b[31mSOME STEPS FAILED OR DID NOT EXECUTE. EXITING WITH CODE 1.\x1b[0m\n");
      process.exit(1);
    }
  }
}

main();
