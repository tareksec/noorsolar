"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@prisma/client";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function StatCard({ stat }: { stat: Stat }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      if (numberRef.current) {
        numberRef.current.textContent = stat.value.toLocaleString();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const target = stat.value;
          const duration = 1600;
          let start: number | null = null;

          if (numberRef.current) {
            numberRef.current.textContent = "0";
          }

          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * target);

            if (numberRef.current) {
              numberRef.current.textContent = current.toLocaleString();
            }

            if (progress < 1) {
              rafId = requestAnimationFrame(step);
            } else if (numberRef.current) {
              numberRef.current.textContent = target.toLocaleString();
            }
          };

          rafId = requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [stat.value]);

  return (
    <div
      ref={containerRef}
      className="bg-white/95 backdrop-blur-xs border border-[#DDE1DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#CEF23E] hover:shadow-md transition-all duration-300"
    >
      <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#5C605C] mb-3 font-medium">
        {stat.label}
      </div>
      <div>
        <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111311] tracking-tight font-mono flex items-baseline">
          {stat.prefix && <span>{stat.prefix}</span>}
          <span ref={numberRef} className="tabular-nums">
            {stat.value.toLocaleString()}
          </span>
          {stat.suffix && (
            <span className="text-[#325343] ml-0.5">{stat.suffix}</span>
          )}
        </div>
        {stat.description && (
          <p className="mt-2 text-xs text-[#5C605C] leading-snug">
            {stat.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  if (!stats || stats.length === 0) return null;

  return (
    <section
      aria-label="Company at a glance"
      className="stats-band py-12 bg-[#EDEDED] border-y border-[#DDE1DC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
