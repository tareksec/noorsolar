"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const SESSION_KEY = "noor-preloader-seen";

export function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const shouldSkip =
      html.dataset.preloader === "skip" ||
      sessionStorage.getItem(SESSION_KEY) === "1" ||
      params.get("preloader") === "off";

    if (shouldSkip) {
      root.remove();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    html.dataset.preloaderActive = "true";
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let timeline: { kill: () => void } | undefined;
    let hardStop: number | null = null;
    let exitStarted = false;
    let pageReady = document.readyState !== "loading";
    let animationFinished = false;

    const remove = () => {
      if (cancelled) return;
      cancelled = true;
      timeline?.kill();
      if (hardStop) window.clearTimeout(hardStop);
      delete html.dataset.preloaderActive;
      document.body.style.overflow = "";
      root.remove();
    };

    const maybeExit = () => {
      if (cancelled || exitStarted || !animationFinished || !pageReady) return;
      exitStarted = true;
      window.dispatchEvent(new CustomEvent("noor-preloader-exit"));
      if (reducedMotion) {
        root.classList.add("preloader-reduced-exit");
        window.setTimeout(remove, 320);
        return;
      }
      import("@/lib/gsap").then(({ gsap }) => {
        if (cancelled) return;
        const exit = gsap.timeline({
          defaults: { duration: 0.6, ease: "expo.inOut" },
          onComplete: remove,
        });
        exit.to(root.querySelector(".preloader-panel-top"), { yPercent: -100 }, 0);
        exit.to(root.querySelector(".preloader-panel-bottom"), { yPercent: 100 }, 0);
      });
    };

    const finish = () => {
      animationFinished = true;
      maybeExit();
    };

    const skip = () => {
      if (exitStarted) return;
      animationFinished = true;
      pageReady = true;
      maybeExit();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") skip();
    };
    const onLoad = () => {
      pageReady = true;
      maybeExit();
    };
    const onReady = () => {
      pageReady = true;
      maybeExit();
    };

    root.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);
    window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(onReady);

    hardStop = window.setTimeout(() => {
      if (!exitStarted) {
        exitStarted = true;
        window.dispatchEvent(new CustomEvent("noor-preloader-exit"));
      }
      root.classList.add("preloader-hard-stop");
      window.setTimeout(remove, 120);
    }, 2500);

    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => {
        animationFinished = true;
        maybeExit();
      }, 300);
      return () => {
        window.clearTimeout(reducedTimer);
        root.removeEventListener("click", skip);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("load", onLoad);
        document.body.style.overflow = "";
        if (hardStop) window.clearTimeout(hardStop);
        cancelled = true;
      };
    }

    import("@/lib/gsap").then(({ gsap }) => {
      if (cancelled) return;
      const icons = root.querySelectorAll(".preloader-icon");

      gsap.set(icons, { scale: 0.72, opacity: 0, transformOrigin: "center" });

      const animation = gsap.timeline({ onComplete: finish });
      animation
        .to(icons, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.4)" }, 0.1)
        .to(icons, { filter: "drop-shadow(0 0 18px rgba(205,243,0,0.7))", duration: 0.22, yoyo: true, repeat: 1 }, 0.85)
        .to({}, { duration: 0.3 });
      timeline = animation;

      window.setTimeout(finish, 1800);
    });

    return () => {
      cancelled = true;
      timeline?.kill();
      if (hardStop) window.clearTimeout(hardStop);
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={rootRef} id="preloader" data-motion="preloader" aria-hidden="true" className="preloader-root">
      <div className="preloader-panel preloader-panel-top">
        <PreloaderIcon />
      </div>
      <div className="preloader-panel preloader-panel-bottom">
        <PreloaderIcon />
      </div>
    </div>
  );
}

function PreloaderIcon() {
  return (
    <Image
      className="preloader-icon"
      src="/logo/icon.png"
      alt=""
      width={438}
      height={431}
      unoptimized
    />
  );
}
