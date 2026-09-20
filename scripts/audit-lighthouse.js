const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const phase = process.argv[2] || 'after';
if (!/^[a-z0-9-]+$/.test(phase)) throw new Error('Use a simple report directory name.');
const output = path.resolve('.audit', phase);
fs.mkdirSync(output, { recursive: true });
const targets = [
  { name: 'home', route: '/' },
  { name: 'products', route: '/products' },
  { name: 'product', route: '/product/n-type-topcon-bifacial-module-620w' },
];
const results = [];
for (const target of targets) {
  const report = path.join(output, `lighthouse-${target.name}`);
  console.log(`Mobile Lighthouse: ${target.route}`);
  execSync(`npx --yes lighthouse@13.5.0 "http://localhost:3000${target.route}" --output=json --output=html --output-path="${report}" --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile --only-categories=performance,accessibility,seo --quiet`, {
    stdio: 'pipe', timeout: 180000,
    env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      npm_config_cache: path.resolve('.cache/npm'), TEMP: path.resolve('.cache/tmp'), TMP: path.resolve('.cache/tmp') },
  });
  const data = JSON.parse(fs.readFileSync(`${report}.report.json`, 'utf8'));
  const result = { route: target.route, version: data.lighthouseVersion,
    performance: Math.round(data.categories.performance.score * 100),
    accessibility: Math.round(data.categories.accessibility.score * 100),
    seo: Math.round(data.categories.seo.score * 100),
    lcp: data.audits['largest-contentful-paint'].numericValue,
    cls: data.audits['cumulative-layout-shift'].numericValue,
    tbt: data.audits['total-blocking-time'].numericValue };
  results.push(result);
  console.log(JSON.stringify(result));
}
fs.writeFileSync(path.join(output, 'lighthouse-summary.json'), JSON.stringify(results, null, 2));
if (phase === 'after' && results.some(r => r.performance < 90 || r.accessibility < 95 || r.seo < 95)) process.exitCode = 1;
