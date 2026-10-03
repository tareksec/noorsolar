/**
 * scripts/check-provide-steps.js
 * Regression suite for the WE PROVIDE pinned scroll-step interaction
 * (#services-solutions, desktop 1-gesture-to-1-card capture).
 *
 * Guards the fast-scroll fix: a fast wheel flick / trackpad burst must never
 * skip steps or escape the section — at most one step per gesture while steps
 * remain, with the page position locked until the last card releases it.
 * Also covers the mobile sticky-deck fallback (must stay free of any lock).
 *
 * Run:  npm run check:provide-steps   (needs the app serving BASE_URL)
 * Exit code 1 on any failure.
 *
 * NOTE: headless Chrome reports no fine pointer, which would disable Lenis
 * and test a different code path than production desktops. The matchMedia
 * shim below emulates a real desktop (pointer:fine) so Lenis activates,
 * exactly as it does for desktop users in production.
 */

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const fs = require("fs");
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

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNoise(msg) {
  return /ws:\/\/|wss:\/\/|hmr|fonts\.googleapis|No link element|__next|turbopack/i.test(
    msg
  );
}

async function run() {
  console.log("==================================================");
  console.log("WE PROVIDE — PINNED STEP INTERACTION CHECKS");
  console.log(`Target: ${BASE_URL}`);
  console.log("==================================================\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const testResults = [];
  function record(name, passed, detail = "") {
    testResults.push({ name, passed, detail });
    const status = passed ? "\x1b[32mPASSED\x1b[0m" : "\x1b[31mFAILED\x1b[0m";
    console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ""}`);
  }

  async function state(page) {
    return page.evaluate(() => {
      const sec = document.querySelector("#services-solutions");
      if (!sec) return { missing: true };
      const badge = sec.querySelector("span.ml-2");
      const rect = sec.getBoundingClientRect();
      return {
        step: badge ? badge.textContent.trim() : "nobadge",
        y: Math.round(window.scrollY),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        vh: window.innerHeight,
        lenis: document.documentElement.className.includes("lenis"),
      };
    });
  }

  function inZone(s) {
    return s.top <= 140 && s.bottom >= s.vh * 0.4;
  }

  async function enterZone(page, retries = 3) {
    for (let i = 0; i < retries; i++) {
      await page.evaluate(() => {
        const sec = document.querySelector("#services-solutions");
        window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 60);
      });
      await sleep(1700); // let any in-flight Lenis glide finish, then settle
      const s = await state(page);
      if (inZone(s)) {
        const cy = Math.min(Math.max(s.top + 200, 120), s.vh - 120);
        await page.mouse.move(720, cy);
        return state(page);
      }
    }
    await page.mouse.move(720, 450);
    return state(page);
  }

  async function wheelBurst(page, deltas, gapMs) {
    for (const d of deltas) {
      await page.mouse.wheel({ deltaY: d });
      if (gapMs) await sleep(gapMs);
    }
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
      const orig = window.matchMedia.bind(window);
      window.matchMedia = (q) =>
        q === "(pointer: fine)" ? { ...orig(q), matches: true } : orig(q);
    });
    const errors = [];
    page.on("pageerror", (e) => {
      if (!isNoise(String(e))) errors.push(String(e).slice(0, 160));
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 30000 });
    await sleep(2500);

    let s = await state(page);
    record(
      "section-hydrated-lenis",
      !s.missing && s.step !== "nobadge" && s.lenis,
      `step=${s.step} lenis=${s.lenis}`
    );

    // Deterministic start at step 01.
    await page.evaluate(() => {
      const btns = [
        ...document.querySelectorAll(
          '#services-solutions button[aria-label^="Jump to step"]'
        ),
      ];
      if (btns[0]) btns[0].click();
    });
    await sleep(800);

    // 1. Slow deliberate scroll: exactly one step, page pinned.
    s = await enterZone(page);
    record("enter-zone", inZone(s), JSON.stringify({ top: s.top, y: s.y }));
    const ySlow = s.y;
    await page.mouse.wheel({ deltaY: 100 });
    await sleep(900);
    s = await state(page);
    record("slow-one-step", s.step === "02 / 03", `step=${s.step}`);
    record("slow-page-pinned", Math.abs(s.y - ySlow) <= 8, `dy=${s.y - ySlow}`);

    // 2. Three aggressive fast flicks: one step per flick, then release.
    const trace = [];
    for (let i = 1; i <= 3; i++) {
      await wheelBurst(page, Array(8).fill(400), 15);
      await sleep(850);
      s = await state(page);
      trace.push({ flick: i, step: s.step, y: s.y });
    }
    record("flick-one-step", trace[0].step === "03 / 03", JSON.stringify(trace[0]));
    record(
      "flick-holds-then-releases",
      trace.slice(1).every((t) => t.step === "03 / 03") &&
        trace[2].y > trace[0].y + 200,
      `y0=${trace[0].y} y2=${trace[2].y}`
    );

    // Exact regression: after 03 is committed, the release burst must not show 02.
    const boundaryTrace = [];
    await page.evaluate(() => {
      const btns = [
        ...document.querySelectorAll(
          '#services-solutions button[aria-label^="Jump to step"]'
        ),
      ];
      if (btns[0]) btns[0].click();
    });
    await sleep(800);
    await enterZone(page);
    await wheelBurst(page, Array(8).fill(400), 15);
    await sleep(900);
    await wheelBurst(page, Array(8).fill(400), 15);
    await sleep(900);
    for (const delta of Array(8).fill(400)) {
      await page.mouse.wheel({ deltaY: delta });
      await sleep(15);
      boundaryTrace.push((await state(page)).step);
    }
    record(
      "forward-boundary-no-bounce",
      boundaryTrace[0] === "03 / 03" &&
        boundaryTrace.every((step) => step !== "02 / 03"),
      boundaryTrace.join(",")
    );

    // Repeat the boundary transition 15 times with alternating fast/slow bursts.
    const repeatedBoundaryTraces = [];
    for (let run = 0; run < 15; run++) {
      await page.evaluate(() => {
        const btns = [
          ...document.querySelectorAll(
            '#services-solutions button[aria-label^="Jump to step"]'
          ),
        ];
        if (btns[0]) btns[0].click();
      });
      await sleep(500);
      await enterZone(page);
      const gap = run % 2 === 0 ? 15 : 90;
      await wheelBurst(page, Array(8).fill(400), gap);
      await sleep(900);
      await wheelBurst(page, Array(8).fill(400), gap);
      await sleep(900);
      const releaseTrace = [];
      for (const delta of Array(run % 2 === 0 ? 8 : 4).fill(400)) {
        await page.mouse.wheel({ deltaY: delta });
        await sleep(15);
        releaseTrace.push((await state(page)).step);
      }
      repeatedBoundaryTraces.push(releaseTrace);
    }
    record(
      "forward-boundary-no-bounce-15x",
      repeatedBoundaryTraces.every(
        (run) => run[0] === "03 / 03" && run.every((step) => step !== "02 / 03")
      ),
      repeatedBoundaryTraces.map((run) => run.join(",")).join(" | ")
    );

    // 3. Reverse flick steps back exactly one step with the page pinned.
    await sleep(2200);
    s = await enterZone(page);
    const revZoneOk = s.step === "03 / 03" && inZone(s);
    record("reenter-zone", revZoneOk, JSON.stringify({ step: s.step, top: s.top }));
    const yRev = s.y;
    await wheelBurst(page, Array(8).fill(-400), 15);
    await sleep(850);
    s = await state(page);
    record("reverse-one-step", s.step === "02 / 03", `step=${s.step}`);
    record("reverse-page-pinned", Math.abs(s.y - yRev) <= 15, `dy=${s.y - yRev}`);
    const yFirst = s.y;
    await wheelBurst(page, Array(8).fill(-400), 15);
    await sleep(850);
    s = await state(page);
    record("reverse-to-first", s.step === "01 / 03", `step=${s.step}`);
    await wheelBurst(page, Array(8).fill(-400), 15);
    await sleep(850);
    s = await state(page);
    record("reverse-boundary-releases", s.step === "01 / 03" && s.y < yFirst - 200, `step=${s.step} y=${s.y}`);

    // 4. Gentle trackpad micro-deltas inside one cooldown from step 01:
    // exactly one step with the page pinned.
    await page.evaluate(() => {
      const btns = [
        ...document.querySelectorAll(
          '#services-solutions button[aria-label^="Jump to step"]'
        ),
      ];
      if (btns[0]) btns[0].click();
    });
    await sleep(800);
    s = await enterZone(page);
    const yMicro = s.y;
    await wheelBurst(page, Array(6).fill(9), 8);
    await sleep(900);
    s = await state(page);
    record("micro-delta-one-step", s.step === "02 / 03", `step=${s.step}`);
    record("micro-page-pinned", Math.abs(s.y - yMicro) <= 15, `dy=${s.y - yMicro}`);

    // 5. Nonstop 40-event stream: monotonic 01->02->03, pinned until last step.
    await page.evaluate(() => {
      const btns = [
        ...document.querySelectorAll(
          '#services-solutions button[aria-label^="Jump to step"]'
        ),
      ];
      if (btns[0]) btns[0].click();
    });
    await sleep(800);
    s = await enterZone(page);
    const yStream = s.y;
    const samples = await page.evaluate(async () => {
      const out = [];
      const sec = document.querySelector("#services-solutions");
      const badge = () =>
        document.querySelector("#services-solutions span.ml-2")?.textContent.trim();
      for (let i = 0; i < 40; i++) {
        sec.dispatchEvent(
          new WheelEvent("wheel", { deltaY: 240, bubbles: true, cancelable: true })
        );
        if (i % 4 === 0) out.push({ i, step: badge(), y: Math.round(window.scrollY) });
        await new Promise((r) => setTimeout(r, 20));
      }
      return out;
    });
    await sleep(900);
    const seenSteps = samples.map((x) => x.step);
    const first03 = seenSteps.findIndex((x) => x === "03 / 03");
    record(
      "stream-no-skip",
      seenSteps.includes("02 / 03") &&
        (first03 === -1 || seenSteps.slice(0, first03).includes("02 / 03")),
      seenSteps.join(",")
    );
    record(
      "stream-pinned-until-last",
      samples
        .filter((x) => x.step !== "03 / 03")
        .every((x) => Math.abs(x.y - yStream) <= 15),
      `yStream=${yStream}`
    );

    // 6. Keyboard PageDown: exactly one step, page pinned.
    await page.evaluate(() => {
      const btns = [
        ...document.querySelectorAll(
          '#services-solutions button[aria-label^="Jump to step"]'
        ),
      ];
      if (btns[0]) btns[0].click();
    });
    await sleep(800);
    s = await enterZone(page);
    const yKb = s.y;
    await page.keyboard.press("PageDown");
    await sleep(900);
    s = await state(page);
    record("keyboard-one-step", s.step === "02 / 03", `step=${s.step}`);
    record("keyboard-page-pinned", Math.abs(s.y - yKb) <= 40, `dy=${s.y - yKb}`);

    record("desktop-no-errors", errors.length === 0, errors.join(" | ").slice(0, 200));

    // 7. Mobile fallback: sticky deck renders, page scrolls freely (no lock).
    const mob = await browser.newPage();
    await mob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mob.evaluateOnNewDocument(() => {
      sessionStorage.setItem("noor-preloader-seen", "1");
    });
    const merr = [];
    mob.on("pageerror", (e) => {
      if (!isNoise(String(e))) merr.push(String(e).slice(0, 160));
    });
    await mob.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 30000 });
    await sleep(2000);
    const deck = await mob.evaluate(() => {
      const sec = document.querySelector("#services-solutions");
      if (!sec) return null;
      return { cards: [...sec.querySelectorAll("article.sticky")].length };
    });
    record("mobile-deck", !!deck && deck.cards === 3, JSON.stringify(deck));
    const my0 = await mob.evaluate(() => window.scrollY);
    await mob.evaluate(() => window.scrollBy(0, 600));
    await sleep(600);
    const my1 = await mob.evaluate(() => window.scrollY);
    record("mobile-free-scroll", my1 - my0 > 200, `${my0} -> ${my1}`);
    record("mobile-no-errors", merr.length === 0, merr.join(" | ").slice(0, 200));
    await mob.close();

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n==================================================");
  console.log("PROVIDE-STEPS RESULTS SUMMARY");
  console.log("==================================================");
  console.table(
    testResults.map((r) => ({ Check: r.name, Status: r.passed ? "PASSED" : "FAILED" }))
  );
  const failed = testResults.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.log(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll WE PROVIDE step checks passed.");
}

run().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(2);
});
