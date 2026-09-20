"use client";
import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
export function ProductRail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(direction: number) {
    const rail = ref.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * .85, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <>
    <div ref={ref} className="featured-rail" role="region" aria-label={label} tabIndex={0}
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>{children}</div>
    <div className="rail-controls"><button type="button" aria-label="Previous items" onClick={() => move(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next items" onClick={() => move(1)}><ArrowRight size={18} /></button></div>
  </>;
}
