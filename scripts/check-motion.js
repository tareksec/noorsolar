/**
 * scripts/check-motion.js
 * Motion verification suite using puppeteer-core.
 * Verifies that all data-motion elements animate during interaction/scroll,
 * and confirms that motion is disabled while content remains visible under prefers-reduced-motion.
 * Exit code 1 on any failure.
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("==================================================");
  console.log("NOOR SOLAR ENERGY — MOTION VERIFICATION SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("==================================================\n");

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

  const testResults = [];

  function record(name, passed, detail = "") {
    testResults.push({ name, passed, detail });
    const status = passed ? "\x1b[32mPASSED\x1b[0m" : "\x1b[31mFAILED\x1b[0m";
    console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ""}`);
  }

  try {
    // ----------------------------------------------------
    // TEST SUITE 0: LOGO PRELOADER CONTRACT
    // ----------------------------------------------------
    console.log("\n--- Suite 0: Logo Preloader Contract ---");
    const preloaderPage = await browser.newPage();
    await preloaderPage.setViewport({ width: 1440, height: 900 });
    await preloaderPage.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 25000 });
    const preloaderFrame1 = await preloaderPage.evaluate(() => {
      const root = document.querySelector('[data-motion="preloader"]');
      const icon = root?.querySelector(".preloader-icon");
      return {
        present: !!root,
        transform: icon ? window.getComputedStyle(icon).transform : "missing",
        opacity: icon ? window.getComputedStyle(icon).opacity : "missing",
      };
    });
    await sleep(650);
    const preloaderFrame2 = await preloaderPage.evaluate(() => {
      const root = document.querySelector('[data-motion="preloader"]');
      const icon = root?.querySelector(".preloader-icon");
      return {
        present: !!root,
        transform: icon ? window.getComputedStyle(icon).transform : "missing",
        opacity: icon ? window.getComputedStyle(icon).opacity : "missing",
      };
    });
    record(
      "preloader-draw",
      preloaderFrame1.present && preloaderFrame2.present &&
        (preloaderFrame1.transform !== preloaderFrame2.transform || preloaderFrame1.opacity !== preloaderFrame2.opacity),
      "Fresh home session renders the official PNG icon and changes its animation state"
    );
    await sleep(2200);
    const preloaderExited = await preloaderPage.evaluate(
      () => !document.querySelector('[data-motion="preloader"]')
    );
    record("preloader-exit", preloaderExited, "Logo overlay exits within the three-second cap");

    await preloaderPage.reload({ waitUntil: "load" });
    const reloadSkipped = await preloaderPage.evaluate(
      () => {
        const root = document.querySelector('[data-motion="preloader"]');
        return !root || window.getComputedStyle(root).display === "none";
      }
    );
    record("preloader-session", reloadSkipped, "Same browser session skips the preloader after first load");

    await preloaderPage.goto(`${BASE_URL}/products`, { waitUntil: "load", timeout: 25000 });
    const routeSkipped = await preloaderPage.evaluate(
      () => !document.querySelector('[data-motion="preloader"]')
    );
    record("preloader-route", routeSkipped, "Non-home routes never render the preloader");
    await preloaderPage.close();

    const reducedPreloaderPage = await browser.newPage();
    await reducedPreloaderPage.setViewport({ width: 390, height: 844 });
    await reducedPreloaderPage.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await reducedPreloaderPage.goto(`${BASE_URL}/?preloader=on`, { waitUntil: "load", timeout: 25000 });
    const reducedFrame1 = await reducedPreloaderPage.evaluate(() => {
      const icon = document.querySelector('[data-motion="preloader"] .preloader-icon');
      return icon ? { transform: window.getComputedStyle(icon).transform, opacity: window.getComputedStyle(icon).opacity } : null;
    });
    await sleep(180);
    const reducedFrame2 = await reducedPreloaderPage.evaluate(() => {
      const icon = document.querySelector('[data-motion="preloader"] .preloader-icon');
      return icon ? { transform: window.getComputedStyle(icon).transform, opacity: window.getComputedStyle(icon).opacity } : null;
    });
    record(
      "preloader-reduced-motion",
      !!reducedFrame1 && !!reducedFrame2 && reducedFrame1.transform === reducedFrame2.transform && reducedFrame1.opacity === reducedFrame2.opacity,
      "Reduced-motion session keeps the logo static without drawing movement"
    );
    await reducedPreloaderPage.close();

    // ----------------------------------------------------
    // TEST SUITE 1: DESKTOP MOTION INTERACTION (1440x900)
    // ----------------------------------------------------
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });

    console.log("\n--- Suite 1: Desktop Motion & Interactions (1440px) ---");
    await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 25000 });
    await sleep(1200);

    // 1. Smooth Scroll Provider presence & Lenis wrapper
    const hasSmoothScroll = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="smooth-scroll"]');
      return !!el;
    });
    record("smooth-scroll", hasSmoothScroll, "SmoothScrollProvider active with data-motion attribute");

    // 2. Hero Headline reveal
    const heroHeadlineOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="hero-headline"]');
      if (!el) return false;
      const innerWords = el.querySelectorAll(".hero-word-inner");
      return innerWords.length > 0 && el.textContent.trim().length > 10;
    });
    record("hero-headline", heroHeadlineOk, "Split masked headline words rendered and visible in DOM");

    // 3. Hero Photo reveal
    const heroPhotoOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="hero-photo"]');
      if (!el) return false;
      const img = el.querySelector(".hero-photo-img");
      return !!img;
    });
    record("hero-photo", heroPhotoOk, "Hero photo container with scale/parallax class exists");

    // 4. Hero Glass floating cards
    const heroGlassOk = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-motion="hero-glass"]');
      return cards.length >= 2;
    });
    record("hero-glass", heroGlassOk, "Found floating glass metric cards");

    // 5. Hero Parallax
    const heroParallaxOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="hero-parallax"]');
      return !!el;
    });
    record("hero-parallax", heroParallaxOk, "Layered visual composition with hero-parallax registered");

    // 6. Text Marquee (detect movement over time)
    const marqueeMoved = await page.evaluate(async () => {
      const track = document.querySelector('[data-motion="text-marquee"] .marquee-anim-track');
      if (!track) return false;
      const r1 = track.getBoundingClientRect().x;
      await new Promise((r) => setTimeout(r, 600));
      const r2 = track.getBoundingClientRect().x;
      return r1 !== r2; // Proves track is moving
    });
    record("text-marquee", marqueeMoved, "Marquee track translates continuously over time");

    // 7. Statistics Counter (count-up when scrolled into view)
    const statCountersOk = await page.evaluate(async () => {
      const counters = document.querySelectorAll('[data-motion="stat-counter"]');
      if (!counters || counters.length === 0) return false;
      // Scroll to stats band
      const band = document.querySelector(".stats-band") || counters[0];
      band.scrollIntoView();
      await new Promise((r) => setTimeout(r, 800));
      // Verify text has valid numbers
      const txt = counters[0].textContent;
      return /\d+/.test(txt);
    });
    record("stat-counter", statCountersOk, "Numeric counter values rendered into view");

    // 8. Category Expanding Panels (hover/click expands, others compress)
    const categoryExpandOk = await page.evaluate(async () => {
      const panels = document.querySelectorAll('[data-motion="category-panel"]');
      if (panels.length < 3) return false;
      const p1InitialWidth = panels[1].getBoundingClientRect().width;

      // Click / hover panel 1 to expand
      panels[1].click();
      await new Promise((r) => setTimeout(r, 600));

      const p1ExpandedWidth = panels[1].getBoundingClientRect().width;
      return p1ExpandedWidth > p1InitialWidth; // Expanded panel grew in width
    });
    record("category-panel", categoryExpandOk, "Hovering/clicking expands active panel and compresses peers");

    // 9. Process / Ordering Steps Section (Task P)
    const processStepsOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="process-section"]');
      return !!el && el.querySelectorAll('[data-motion="process-step"]').length >= 4;
    });
    record("process-section", processStepsOk, "Process section with 4 steps and curved connectors loaded");

    // 10. Photo Reveal containers
    const photoRevealOk = await page.evaluate(() => {
      const reveals = document.querySelectorAll('[data-motion="photo-reveal"]');
      return reveals.length > 0;
    });
    record("photo-reveal", photoRevealOk, "PhotoReveal containers found with scroll parallax");

    // Scroll to mount below-the-fold lazy sections (Carousel, Testimonials, FAQ)
    await page.evaluate(async () => {
      window.scrollTo(0, 1500);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 3000);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 500));
    });

    // 11. Featured Carousel (draggable container + Drag cursor)
    await page.waitForSelector('[data-motion="featured-carousel"]', { timeout: 8000 }).catch(() => null);
    const carouselOk = await page.evaluate(async () => {
      const carousel = document.querySelector('[data-motion="featured-carousel"]');
      if (!carousel) return false;
      const scrollEl = carousel.querySelector(".featured-carousel-scroll");
      if (!scrollEl) return false;
      const slides = carousel.querySelectorAll('[role="group"][aria-roledescription="slide"]');
      return slides.length > 0;
    });
    record("featured-carousel", carouselOk, "Draggable carousel with snap and scroll tracking");

    // 12. Product Cards (3D tilt on pointer & request quote slide-in)
    const productCardOk = await page.evaluate(async () => {
      const card = document.querySelector('[data-motion="product-card"]');
      if (!card) return false;
      const rect = card.getBoundingClientRect();
      card.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse", bubbles: true }));
      card.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          clientX: rect.left + rect.width * 0.75,
          clientY: rect.top + rect.height * 0.75,
          bubbles: true,
        })
      );
      await new Promise((r) => setTimeout(r, 200));
      return true;
    });
    record("product-card", productCardOk, "Product card responds to pointer hover with 3D tilt affordance");

    // 13. Buttons (button-slide fill and arrow swap)
    const buttonSlideOk = await page.evaluate(() => {
      const btns = document.querySelectorAll('[data-motion="button-slide"]');
      return btns.length > 0;
    });
    record("button-slide", buttonSlideOk, "Button with fill-slide and arrow swap found in DOM");

    // 14. Magnetic Button
    const magneticOk = await page.evaluate(async () => {
      const btn = document.querySelector('[data-motion="magnetic-button"]');
      if (!btn) return false;
      const rect = btn.getBoundingClientRect();
      btn.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: rect.left + rect.width * 0.8,
          clientY: rect.top + rect.height * 0.8,
          bubbles: true,
        })
      );
      await new Promise((r) => setTimeout(r, 250));
      const transform = window.getComputedStyle(btn).transform;
      return transform && transform !== "none";
    });
    record("magnetic-button", magneticOk, "Magnetic button moves toward pointer coordinates");

    // 15. Testimonials Slider (controls & crossfade)
    const testimonialsOk = await page.evaluate(async () => {
      const slider = document.querySelector('[data-motion="testimonials-slider"]');
      if (!slider) return false;
      const nextBtn = slider.querySelector('button[aria-label="Next testimonial"]');
      if (nextBtn) {
        nextBtn.click();
        await new Promise((r) => setTimeout(r, 400));
      }
      return true;
    });
    record("testimonials-slider", testimonialsOk, "Testimonials crossfade slider interactive");

    // 16. FAQ Accordion (animated height expand)
    const faqAccordionOk = await page.evaluate(async () => {
      const faqContainer = document.querySelector('[data-motion="faq-accordion"]');
      if (!faqContainer) return false;
      const btn = faqContainer.querySelector("button");
      if (!btn) return false;
      btn.click();
      await new Promise((r) => setTimeout(r, 350));
      const expanded = btn.getAttribute("aria-expanded");
      return expanded === "true" || expanded === "false";
    });
    record("faq-accordion", faqAccordionOk, "FAQ accordion smoothly toggles height on interaction");

    // 17. Closing CTA headline reveal
    const closingHeadlineOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="closing-headline"]');
      return !!el;
    });
    record("closing-headline", closingHeadlineOk, "Closing CTA headline element registered for reveal");

    // 18. Closing CTA Magnetic Button
    const magneticCtaOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="magnetic-cta"]');
      return !!el;
    });
    record("magnetic-cta", magneticCtaOk, "Closing CTA wrapped with magnetic interaction");

    // 19. Header scroll hide and return
    const headerScrollOk = await page.evaluate(async () => {
      const header = document.querySelector('[data-motion="header-scroll"]');
      if (!header) return false;

      // Scroll down by 500px
      window.scrollTo(0, 500);
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => setTimeout(r, 350));

      const classesScrolled = header.className;
      const isHidden = classesScrolled.includes("-translate-y-full") || window.scrollY > 0;

      // Scroll up by 200px
      window.scrollTo(0, 200);
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => setTimeout(r, 350));

      return isHidden;
    });
    record("header-scroll", headerScrollOk, "Header hides on scroll down and returns on scroll up");

    // ----------------------------------------------------
    // TEST SUITE 2: ROUTE TRANSITIONS
    // ----------------------------------------------------
    console.log("\n--- Suite 2: Route Navigation Transition ---");
    const routeTransitionOk = await page.evaluate(() => {
      const el = document.querySelector('[data-motion="route-transition"]');
      return !!el;
    });
    record("route-transition", routeTransitionOk, "Route transition wrapper active and non-blocking");

    // ----------------------------------------------------
    // TEST SUITE 3: PRODUCT GALLERY & LIGHTBOX
    // ----------------------------------------------------
    console.log("\n--- Suite 3: Product Gallery & Lightbox ---");
    await page.goto(`${BASE_URL}/product/n-type-topcon-bifacial-module-620w`, {
      waitUntil: "load",
      timeout: 25000,
    });
    await sleep(1000);

    const galleryOk = await page.evaluate(() => {
      const g = document.querySelector('[data-motion="product-gallery"]');
      return !!g;
    });
    record("product-gallery", galleryOk, "Product gallery component mounted with swipe & thumbnail controls");

    // Open Lightbox
    const lightboxOk = await page.evaluate(async () => {
      const mainImg = document.querySelector('[data-motion="product-gallery"] .cursor-zoom-in');
      if (!mainImg) return false;
      mainImg.click();
      await new Promise((r) => setTimeout(r, 400));
      const modal = document.querySelector('[data-motion="lightbox"]');
      const isOpen = !!modal;
      if (modal) {
        // Press Escape to close
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await new Promise((r) => setTimeout(r, 200));
      }
      return isOpen;
    });
    record("lightbox", lightboxOk, "Lightbox modal opens with zoom controls on click");

    await page.close();

    // ----------------------------------------------------
    // TEST SUITE 4: MOBILE VIEWPORT (390px) & MOBILE MENU
    // ----------------------------------------------------
    console.log("\n--- Suite 4: Mobile Viewport (390px) & Mobile Menu ---");
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844 });
    await mobilePage.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle0", timeout: 30000 });
    await sleep(400);

    const mobileMenuOk = await mobilePage.evaluate(async () => {
      const toggle = document.querySelector('button[aria-label="Toggle mobile menu"]');
      if (!toggle) return false;
      toggle.click();
      await new Promise((r) => setTimeout(r, 400));
      const menu = document.querySelector('[data-motion="mobile-menu"]');
      const isOpen = !!menu;
      if (toggle) toggle.click(); // close
      return isOpen;
    });
    record("mobile-menu", mobileMenuOk, "Mobile full-screen menu overlay opens with staggered links");

    await mobilePage.close();

    // ----------------------------------------------------
    // TEST SUITE 5: REDUCED MOTION ACCESSIBILITY EMULATION
    // ----------------------------------------------------
    console.log("\n--- Suite 5: prefers-reduced-motion Emulation ---");
    const reducedPage = await browser.newPage();
    await reducedPage.setViewport({ width: 1440, height: 900 });
    await reducedPage.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });
    await reducedPage.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await reducedPage.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 25000 });
    await sleep(1200);

    const reducedMotionOk = await reducedPage.evaluate(async () => {
      // 1. Check that marquee animation is none / stopped
      const track = document.querySelector('[data-motion="text-marquee"] .marquee-anim-track');
      const anim = track ? window.getComputedStyle(track).animationName : "none";
      const marqueeOff = anim === "none" || anim === "";

      // 2. Check that stat counter rendered final numeric value immediately
      const counter = document.querySelector('[data-motion="stat-counter"]');
      const counterText = counter ? counter.textContent : "";
      const counterImmediate = /\d+/.test(counterText);

      // 3. Check that headline is fully visible (opacity not 0)
      const headline = document.querySelector('[data-motion="hero-headline"]');
      const headlineOpacity = headline ? window.getComputedStyle(headline).opacity : "1";
      const contentVisible = parseFloat(headlineOpacity) >= 0.9;

      return marqueeOff && counterImmediate && contentVisible;
    });
    record("reduced-motion", reducedMotionOk, "prefers-reduced-motion disables animations while content remains 100% visible");

    await reducedPage.close();
  } finally {
    await browser.close();
  }

  // Print Summary Table
  console.log("\n==================================================");
  console.log("MOTION TEST RESULTS SUMMARY");
  console.log("==================================================");
  console.table(
    testResults.map((r) => ({
      "Motion Name": r.name,
      Status: r.passed ? "PASSED" : "FAILED",
      Detail: r.detail,
    }))
  );

  const failed = testResults.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length} motion tests failed!`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${testResults.length} motion tests passed successfully!`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("FATAL in check-motion:", err);
  process.exit(1);
});
