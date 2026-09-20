const { spawn, execSync } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 3006;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  { name: "Home (EN)", path: "/" },
  { name: "Home (BN)", path: "/bn" },
  { name: "Products (BN)", path: "/bn/products" },
  { name: "Product (BN)", path: "/bn/product/n-type-topcon-bifacial-module-620w" },
  { name: "Blog (BN)", path: "/bn/blog" },
];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) resolve(true);
          else reject(new Error(`Status ${res.statusCode}`));
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

async function runAudit() {
  console.log("Starting production Next.js server on port", PORT, "...");
  const nextBin = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
  const server = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    cwd: path.join(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: "production",
    },
    stdio: ["ignore", "ignore", "inherit"],
  });

  try {
    await waitForServer(`${BASE_URL}/`);
    console.log("Server ready. Running Mobile Lighthouse audits...\n");

    const results = [];

    for (const r of ROUTES) {
      console.log(`Auditing ${r.name} (${r.path})...`);
      const targetUrl = `${BASE_URL}${r.path}`;
      const tempReportPath = path.join(__dirname, `lh-${r.name.toLowerCase().replace(/\s+/g, "_")}.json`);
      
      const cmd = `npx lighthouse ${targetUrl} --output=json --output-path=${tempReportPath} --form-factor=mobile --screenEmulation.mobile=true --throttling-method=provided --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo`;
      
      try {
        execSync(cmd, { stdio: "ignore" });
        if (fs.existsSync(tempReportPath)) {
          const report = JSON.parse(fs.readFileSync(tempReportPath, "utf-8"));
          const perf = Math.round((report.categories.performance?.score || 0) * 100);
          const a11y = Math.round((report.categories.accessibility?.score || 0) * 100);
          const bp = Math.round((report.categories["best-practices"]?.score || 0) * 100);
          const seo = Math.round((report.categories.seo?.score || 0) * 100);
          results.push({ name: r.name, path: r.path, perf, a11y, bp, seo });
          fs.unlinkSync(tempReportPath);
        } else {
          results.push({ name: r.name, path: r.path, error: "No report generated" });
        }
      } catch (err) {
        results.push({ name: r.name, path: r.path, error: err.message });
      }
    }

    console.log("\n================================================================================");
    console.log("MOBILE LIGHTHOUSE AUDIT RESULTS");
    console.log("================================================================================");
    console.log("Route            | Perf | A11y | Best Practices | SEO ");
    console.log("-----------------+------+------+----------------+-----");
    for (const res of results) {
      if (res.error) {
        console.log(`${res.name.padEnd(16)} | ERROR: ${res.error}`);
      } else {
        console.log(
          `${res.name.padEnd(16)} | ${String(res.perf).padStart(4)} | ${String(res.a11y).padStart(4)} | ${String(res.bp).padStart(14)} | ${String(res.seo).padStart(3)}`
        );
      }
    }
    console.log("================================================================================\n");

  } finally {
    if (server && server.pid) {
      try {
        execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
      } catch {}
    }
  }
}

runAudit();
