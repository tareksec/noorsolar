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

const PAGES = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "category", path: "/category/solar-panels" },
  { name: "product-detail", path: "/product/n-type-topcon-bifacial-module-620w" },
];

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
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
        await page.goto(`http://127.0.0.1:3000${p.path}`, {
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
