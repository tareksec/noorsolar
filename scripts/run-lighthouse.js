const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const routes = [
  { name: "Home (EN)", url: "http://127.0.0.1:3000/" },
  { name: "Home (BN)", url: "http://127.0.0.1:3000/bn" },
  { name: "Products (EN)", url: "http://127.0.0.1:3000/products" },
  { name: "Products (BN)", url: "http://127.0.0.1:3000/bn/products" },
  { name: "Product Detail (EN)", url: "http://127.0.0.1:3000/product/n-type-topcon-bifacial-module-620w" },
  { name: "Product Detail (BN)", url: "http://127.0.0.1:3000/bn/product/n-type-topcon-bifacial-module-620w" },
];

async function runAudit() {
  console.log("================================================================================");
  console.log("RUNNING MOBILE LIGHTHOUSE AUDITS");
  console.log("================================================================================");

  const results = [];
  const tmpOut = path.join(__dirname, "../tmp-lh-report.json");

  for (const r of routes) {
    console.log(`Auditing ${r.name} (${r.url})...`);
    try {
      const cmd = `npx -y lighthouse "${r.url}" --output=json --output-path="${tmpOut}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,seo --form-factor=mobile --screenEmulation.mobile=true --throttling-method=provided --quiet`;
      execSync(cmd, { stdio: "pipe", timeout: 120000 });
      
      const report = JSON.parse(fs.readFileSync(tmpOut, "utf8"));
      const perf = Math.round((report.categories.performance.score || 0) * 100);
      const a11y = Math.round((report.categories.accessibility.score || 0) * 100);
      const seo = Math.round((report.categories.seo.score || 0) * 100);

      results.push({
        Route: r.name,
        URL: r.url,
        Performance: perf,
        Accessibility: a11y,
        SEO: seo,
        Status: perf >= 90 && a11y >= 95 && seo >= 95 ? "PASS" : "WARN",
      });
    } catch (err) {
      console.error(`Error auditing ${r.name}:`, err.message);
      results.push({
        Route: r.name,
        URL: r.url,
        Performance: "ERR",
        Accessibility: "ERR",
        SEO: "ERR",
        Status: "FAIL",
      });
    }
  }

  if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);

  console.log("\n================================================================================");
  console.log("LIGHTHOUSE MOBILE AUDIT RESULTS");
  console.log("================================================================================");
  console.table(results);
}

runAudit();
