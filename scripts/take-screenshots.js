const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT_DIR = path.join(__dirname, "..", "docs", "task-screenshots");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

const PAGES = [
  { name: "home-bn", path: "/bn" },
  { name: "products-bn", path: "/bn/products" },
  { name: "product-detail-bn", path: "/bn/product/n-type-topcon-bifacial-module-620w" },
  { name: "category-bn", path: "/bn/category/solar-panels" },
  { name: "blog-bn", path: "/bn/blog" },
  { name: "about-bn", path: "/bn/about" },
  { name: "contact-bn", path: "/bn/contact" },
  { name: "home-en", path: "/" },
  { name: "products-en", path: "/products" },
];

const VIEWPORTS = [
  { name: "360", width: 360, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

async function run() {
  console.log("Taking screenshots into:", OUT_DIR);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  try {
    for (const p of PAGES) {
      for (const vp of VIEWPORTS) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.evaluateOnNewDocument(() => {
          sessionStorage.setItem("noor-preloader-seen", "1");
        });
        await page.goto(`${BASE_URL}${p.path}`, {
          waitUntil: "domcontentloaded",
          timeout: 25000,
        });

        // Trigger scroll for lazy elements
        await page.evaluate(async () => {
          window.scrollBy(0, 800);
          await new Promise((r) => setTimeout(r, 200));
          window.scrollTo(0, 0);
        });
        await new Promise((r) => setTimeout(r, 600));

        const fileName = `${p.name}-${vp.name}.png`;
        const filePath = path.join(OUT_DIR, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`Saved screenshot: ${fileName}`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
