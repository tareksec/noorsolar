const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

process.env.CHROME_PATH = CHROME_PATH;

const TARGETS = [
  { name: "Home (/)", url: "http://127.0.0.1:3000/" },
  { name: "Products (/products)", url: "http://127.0.0.1:3000/products" },
  {
    name: "Detail (/product/n-type-topcon-bifacial-module-620w)",
    url: "http://127.0.0.1:3000/product/n-type-topcon-bifacial-module-620w",
  },
];

const tmpReportPath = path.join(__dirname, "temp-lh-report.json");

console.log("==================================================");
console.log("Running Mobile Lighthouse on Production Build");
console.log("==================================================");

const results = [];

for (const target of TARGETS) {
  console.log(`\nAuditing: ${target.name} (${target.url})...`);
  try {
    if (fs.existsSync(tmpReportPath)) {
      fs.unlinkSync(tmpReportPath);
    }

    const cmd = `npx lighthouse "${target.url}" --output=json --output-path="${tmpReportPath}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,seo --quiet`;
    
    execSync(cmd, {
      stdio: "pipe",
      timeout: 120000,
      env: { ...process.env, CHROME_PATH },
    });

    if (fs.existsSync(tmpReportPath)) {
      const data = JSON.parse(fs.readFileSync(tmpReportPath, "utf8"));
      const perf = Math.round((data.categories.performance?.score || 0) * 100);
      const a11y = Math.round((data.categories.accessibility?.score || 0) * 100);
      const seo = Math.round((data.categories.seo?.score || 0) * 100);
      const lcp = data.audits["largest-contentful-paint"]?.displayValue || "N/A";
      const fcp = data.audits["first-contentful-paint"]?.displayValue || "N/A";
      const tbt = data.audits["total-blocking-time"]?.displayValue || "N/A";
      const cls = data.audits["cumulative-layout-shift"]?.displayValue || "0";

      results.push({
        name: target.name,
        perf,
        a11y,
        seo,
        lcp,
        fcp,
        tbt,
        cls,
      });

      console.log(`  Performance:   ${perf}`);
      console.log(`  Accessibility: ${a11y}`);
      console.log(`  SEO:           ${seo}`);
      console.log(`  LCP:           ${lcp}`);
      console.log(`  FCP:           ${fcp}`);
      console.log(`  TBT:           ${tbt}`);
      console.log(`  CLS:           ${cls}`);
    }
  } catch (err) {
    console.error(`  Error running Lighthouse on ${target.name}:`, err.message);
  }
}

if (fs.existsSync(tmpReportPath)) {
  fs.unlinkSync(tmpReportPath);
}

console.log("\n==================================================");
console.log("Lighthouse Audit Results Summary (Mobile):");
console.table(results);
console.log("==================================================");
