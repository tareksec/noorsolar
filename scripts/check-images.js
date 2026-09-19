/**
 * scripts/check-images.js
 * Comprehensive image quality guard script using puppeteer-core:
 * 1. Checks every <img> on public routes at 360px and 1440px
 * 2. Confirms naturalWidth > 0 (no broken images)
 * 3. Confirms no failed image requests (HTTP >= 400)
 * 4. Confirms no image upscaled more than 1.5x (renderedWidth / naturalWidth <= 1.5)
 * 5. Verifies total image transfer weight on home page at 360px is under 600 KB
 * Exits with code 1 on any failure.
 */

const fs = require("fs");
const path = require("path");

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

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/category/solar-panels",
  "/category/lithium-batteries",
  "/category/solar-inverters",
  "/product/n-type-topcon-bifacial-module-620w",
  "/about",
  "/contact"
];

const VIEWPORTS = [
  { width: 360, height: 800, name: "360px Mobile" },
  { width: 1440, height: 900, name: "1440px Desktop" }
];

async function run() {
  console.log(`[Image Quality Guard] Target: ${BASE_URL}`);
  console.log(`[Image Quality Guard] Launching Chrome...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    protocolTimeout: 60000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  let totalFailures = 0;
  let homeMobileImageBytes = 0;

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n========================================`);
      console.log(`Checking Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`========================================`);

      for (const route of PUBLIC_ROUTES) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.width, height: vp.height });

        const failedRequests = [];
        const imageTransfers = [];

        page.on("requestfailed", (req) => {
          if (req.resourceType() === "image") {
            failedRequests.push({
              url: req.url(),
              errorText: req.failure()?.errorText || "Unknown network error",
            });
          }
        });

        page.on("response", (res) => {
          const req = res.request();
          if (req.resourceType() === "image") {
            if (res.status() >= 400) {
              failedRequests.push({
                url: res.url(),
                errorText: `HTTP ${res.status()}`,
              });
            } else {
              const headers = res.headers();
              const cl = headers["content-length"];
              if (cl) {
                imageTransfers.push({
                  url: res.url(),
                  bytes: parseInt(cl, 10),
                });
              }
            }
          }
        });

        const targetUrl = `${BASE_URL}${route}`;
        try {
          await page.goto(targetUrl, {
            waitUntil: "domcontentloaded",
            timeout: 25000,
          });

          // Scroll down to trigger any IntersectionObservers (e.g. dynamic sections)
          await page.evaluate(async () => {
            await new Promise((resolve) => {
              let totalHeight = 0;
              const distance = 600;
              let steps = 0;
              const maxSteps = 25;
              const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                steps++;

                if (totalHeight >= scrollHeight || steps >= maxSteps) {
                  clearInterval(timer);
                  resolve();
                }
              }, 40);
            });
          });

          // Settle short delay for DOM insertion
          await new Promise((r) => setTimeout(r, 400));

          // Eagerly trigger decode for all images on the page
          await page.evaluate(async () => {
            const imgs = Array.from(document.querySelectorAll("img"));
            await Promise.all(
              imgs.map(async (img) => {
                img.loading = "eager";
                try {
                  if (img.decode) {
                    await img.decode();
                  }
                } catch (e) {
                  // Failed decode will leave naturalWidth === 0
                }
              })
            );
          });

          // Settle short delay for layout
          await new Promise((r) => setTimeout(r, 300));

          // Inspect every <img> element in the DOM
          const imgAnalysis = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll("img"));
            return imgs.map((img) => {
              const rect = img.getBoundingClientRect();
              const style = window.getComputedStyle(img);
              const isVisible =
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== "none" &&
                style.visibility !== "hidden";
              const renderedWidth = rect.width;
              const naturalWidth = img.naturalWidth;
              const upscaleRatio = naturalWidth > 0 ? renderedWidth / naturalWidth : 0;
              return {
                src: img.currentSrc || img.src,
                alt: img.alt,
                naturalWidth,
                naturalHeight: img.naturalHeight,
                renderedWidth: Math.round(renderedWidth),
                renderedHeight: Math.round(rect.height),
                isVisible,
                upscaleRatio: parseFloat(upscaleRatio.toFixed(2)),
                isUpscaledExcessively: isVisible && upscaleRatio > 1.5,
                isBroken: naturalWidth === 0,
              };
            });
          });

          // Check home page 360px image weight
          if (route === "/" && vp.width === 360) {
            homeMobileImageBytes = imageTransfers.reduce((acc, cur) => acc + cur.bytes, 0);
          }

          let routeErrors = 0;

          // 1. Failed requests
          if (failedRequests.length > 0) {
            console.error(`  [FAIL] ${route}: ${failedRequests.length} failed image requests:`);
            failedRequests.forEach((f) => console.error(`    - ${f.url} (${f.errorText})`));
            routeErrors += failedRequests.length;
          }

          // 2. Broken images (naturalWidth === 0)
          const broken = imgAnalysis.filter((i) => i.isBroken);
          if (broken.length > 0) {
            console.error(`  [FAIL] ${route}: ${broken.length} broken <img> (naturalWidth === 0):`);
            broken.forEach((b) => console.error(`    - src: ${b.src}, alt: "${b.alt}"`));
            routeErrors += broken.length;
          }

          // 3. Upscaled more than 1.5x
          const overscaled = imgAnalysis.filter((i) => i.isUpscaledExcessively && i.isVisible);
          if (overscaled.length > 0) {
            console.error(`  [FAIL] ${route}: ${overscaled.length} images upscaled > 1.5x:`);
            overscaled.forEach((o) =>
              console.error(
                `    - src: ${o.src} (Rendered: ${o.renderedWidth}px, Natural: ${o.naturalWidth}px, Ratio: ${o.upscaleRatio}x)`
              )
            );
            routeErrors += overscaled.length;
          }

          if (routeErrors === 0) {
            console.log(`  [PASS] ${route} (${imgAnalysis.length} images evaluated, all verified)`);
          } else {
            totalFailures += routeErrors;
          }
        } catch (err) {
          console.error(`  [ERROR] Failed to audit ${route}: ${err.message}`);
          totalFailures++;
        } finally {
          await page.close();
        }
      }
    }

    // Check Home Mobile Image Weight (< 600 KB)
    const homeMobileKb = Math.round(homeMobileImageBytes / 1024);
    console.log(`\n========================================`);
    console.log(`Home Page (360px) Total Image Weight: ${homeMobileKb} KB / 600 KB limit`);
    console.log(`========================================`);

    if (homeMobileKb > 600) {
      console.error(`[FAIL] Home page image weight (${homeMobileKb} KB) exceeds 600 KB budget!`);
      totalFailures++;
    } else {
      console.log(`[PASS] Home page image weight is within budget (${homeMobileKb} KB < 600 KB).`);
    }

  } finally {
    await browser.close();
  }

  if (totalFailures > 0) {
    console.error(`\n[Image Quality Guard] FAILED with ${totalFailures} total errors.`);
    process.exit(1);
  } else {
    console.log(`\n[Image Quality Guard] ALL CHECKS PASSED SUCCESSFULLY! ✓`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Fatal script error:", err);
  process.exit(1);
});
