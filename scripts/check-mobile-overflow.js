/**
 * scripts/check-mobile-overflow.js
 * Verifies document.documentElement.scrollWidth <= window.innerWidth
 * across 360px, 390px, 768px, and 1440px viewports on all public and admin routes.
 */

const fs = require("fs");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

if (!fs.existsSync(CHROME_PATH)) {
  console.error(`FATAL: Chrome executable not found at: ${CHROME_PATH}`);
  console.error("Please set the CHROME_PATH environment variable to a valid Chrome or Chromium executable.");
  process.exit(1);
}

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch (err) {
  console.error(`FATAL: Could not load puppeteer-core: ${err.message}`);
  console.error("Please run: npm install --save-dev puppeteer-core");
  process.exit(1);
}

const VIEWPORTS = [
  { width: 360, height: 800, name: "360px (Small Mobile)" },
  { width: 390, height: 844, name: "390px (iPhone 12/13/14)" },
  { width: 768, height: 1024, name: "768px (Tablet)" },
  { width: 1440, height: 900, name: "1440px (Desktop)" },
];

const PUBLIC_ROUTES = [
  "/",
  "/bn",
  "/products",
  "/bn/products",
  "/category/solar-panels",
  "/bn/category/solar-panels",
  "/category/lithium-batteries",
  "/category/solar-inverters",
  "/product/n-type-topcon-bifacial-module-620w",
  "/bn/product/n-type-topcon-bifacial-module-620w",
  "/blog",
  "/bn/blog",
  "/about",
  "/bn/about",
  "/contact",
  "/bn/contact",
  "/admin/login",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/products",
  "/admin/products/new",
  "/admin/blog",
  "/admin/blog/new",
  "/admin/reviews",
  "/admin/categories",
  "/admin/quotes",
  "/admin/settings",
  "/admin/content",
  "/admin/content/stats",
  "/admin/content/certifications",
  "/admin/content/partners",
  "/admin/content/testimonials",
  "/admin/content/faq",
];

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "owner@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me-on-first-login";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];

  try {
    // 1. Authenticate admin once and capture session cookies
    let adminCookies = [];
    const authPage = await browser.newPage();
    await authPage.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });
    console.log(`Authenticating admin on ${BASE_URL}/admin/login with ${ADMIN_EMAIL} ...`);
    await authPage.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle0" });
    
    // Fill both credentials (the login action requires a non-empty email)
    await authPage.waitForSelector('input[name="email"]', { timeout: 15000 });
    await authPage.click('input[name="email"]', { clickCount: 3 });
    await authPage.type('input[name="email"]', ADMIN_EMAIL);
    // Wait for password input to be ready
    await authPage.waitForSelector('input[name="password"]', { timeout: 10000 });
    await authPage.type('input[name="password"]', ADMIN_PASSWORD);
    await authPage.click('button[type="submit"]');

    await authPage.waitForFunction(
      () => !window.location.href.includes("/admin/login"),
      { timeout: 10000 }
    );
    adminCookies = await authPage.cookies();
    console.log("Admin authenticated successfully. Session cookies captured.\n");
    await authPage.close();

    // 2. Iterate through viewports
    for (const vp of VIEWPORTS) {
      console.log(`=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem("noor-preloader-seen", "1");
      });

      // Check Public Routes
      for (const route of PUBLIC_ROUTES) {
        totalTests++;
        const url = `${BASE_URL}${route}`;
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
          const result = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            passed: document.documentElement.scrollWidth <= window.innerWidth,
          }));

          if (result.passed) {
            passedTests++;
            console.log(`  [PASS] [${vp.width}px]: ${route} (scrollWidth: ${result.scrollWidth}, innerWidth: ${result.innerWidth})`);
          } else {
            failedTests++;
            failures.push({ vp: vp.name, route, result });
            console.error(`  [FAIL] [${vp.width}px]: ${route} (scrollWidth: ${result.scrollWidth}, innerWidth: ${result.innerWidth})`);
          }
        } catch (err) {
          failedTests++;
          failures.push({ vp: vp.name, route, error: err.message });
          console.error(`  [ERROR] [${vp.width}px]: ${route} - ${err.message}`);
        }
      }

      // Check Admin Routes (set session cookie)
      if (adminCookies.length > 0) {
        await page.setCookie(...adminCookies);
      }

      for (const route of ADMIN_ROUTES) {
        totalTests++;
        const url = `${BASE_URL}${route}`;
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
          const result = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            passed: document.documentElement.scrollWidth <= window.innerWidth,
          }));

          if (result.passed) {
            passedTests++;
            console.log(`  [PASS] [${vp.width}px]: ${route} (scrollWidth: ${result.scrollWidth}, innerWidth: ${result.innerWidth})`);
          } else {
            failedTests++;
            failures.push({ vp: vp.name, route, result });
            console.error(`  [FAIL] [${vp.width}px]: ${route} (scrollWidth: ${result.scrollWidth}, innerWidth: ${result.innerWidth})`);
          }
        } catch (err) {
          failedTests++;
          failures.push({ vp: vp.name, route, error: err.message });
          console.error(`  [ERROR] [${vp.width}px]: ${route} - ${err.message}`);
        }
      }

      await page.close();
      console.log("");
    }
  } finally {
    await browser.close();
  }

  console.log("=========================================");
  console.log(`SUMMARY: ${passedTests}/${totalTests} passed, ${failedTests} failed.`);
  console.log("=========================================");

  if (failedTests > 0) {
    console.error("FAILURES DETAIL:");
    failures.forEach((f) => {
      console.error(`- ${f.vp} | ${f.route}:`, f.result || f.error);
    });
    process.exit(1);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal check-mobile-overflow error:", err);
  process.exit(1);
});