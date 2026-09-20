// Production screenshot inventory. Artifacts and browser profiles stay in this repo.
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const { PrismaClient } = require('@prisma/client');
process.loadEnvFile('.env');
const db = new PrismaClient();
const base = process.env.BASE_URL || 'http://localhost:3000';
const phase = process.argv[2] || 'after';
const out = path.resolve('.audit', phase);
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, userDataDir: path.resolve('.audit', 'browser-visual'),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const results = [];
  try {
    const products = await db.product.findMany({ where: { isActive: true }, select: { id: true, slug: true } });
    const categories = await db.category.findMany({ where: { isActive: true }, select: { slug: true } });
    const routes = ['/', '/products', ...categories.map(c => `/category/${c.slug}`),
      ...products.map(p => `/product/${p.slug}`), '/about', '/contact', '/page-not-found', '/admin/login'];
    const admin = ['/admin', '/admin/categories', '/admin/products', '/admin/products/new',
      ...products.map(p => `/admin/products/${p.id}`), '/admin/quotes', '/admin/settings',
      '/admin/settings/password', '/admin/content', ...['stats', 'certifications', 'partners', 'testimonials', 'faq'].map(s => `/admin/content/${s}`)];
    const page = await browser.newPage();
    await page.goto(`${base}/admin/login`, { waitUntil: 'networkidle0' });
    await page.locator('input[name=email]').fill(process.env.ADMIN_EMAIL);
    await page.locator('input[name=password]').fill(process.env.ADMIN_PASSWORD);
    await page.click('button[type=submit]');
    await page.waitForFunction(() => !location.pathname.includes('/login'));
    console.log('Authenticated through admin login.');
    for (const width of [360, 768, 1440]) {
      await page.setViewport({ width, height: width === 768 ? 1024 : 900 });
      for (const route of [...routes, ...admin]) {
        const file = `${width}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png`;
        if (process.env.AUDIT_RESUME === 'true' && fs.existsSync(path.join(out, file))) continue;
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await pause(300);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 650) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 80));
          }
        });
        await pause(250);
        await page.evaluate(async () => {
          await Promise.all([...document.images].map(async i => { i.loading = 'eager'; try { await i.decode(); } catch {} }));
          window.scrollTo(0, 0);
          await document.fonts.ready;
        });
        await pause(350);
        const check = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src')),
          title: document.querySelector('h1')?.textContent, finalPath: location.pathname,
        }));
        await page.screenshot({ path: path.join(out, file), fullPage: true });
        results.push({ route, width, status: response.status(), ...check, errors, screenshot: file });
        fs.writeFileSync(path.join(out, 'screenshots.json'), JSON.stringify(results, null, 2));
        page.off('pageerror', onError);
        console.log(`${width} ${route}: ${check.overflow ? 'OVERFLOW' : 'ok'} ${errors.length ? JSON.stringify(errors) : ''}`);
      }
    }
    fs.writeFileSync(path.join(out, 'screenshots.json'), JSON.stringify(results, null, 2));
    const unexpected = results.filter(r => r.overflow || r.brokenImages.length || r.errors.length || (r.status >= 400 && r.route !== '/page-not-found') || (r.route.startsWith('/admin/') && r.route !== '/admin/login' && r.finalPath === '/admin/login'));
    console.log(`${results.length} screenshots; ${unexpected.length} findings.`);
  } finally { await browser.close(); await db.$disconnect(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
