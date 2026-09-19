"use client";

import React, { useRef } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowUpRight, Check, Zap, BatteryCharging, Cpu } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@/lib/gsap";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface CategoryStoryProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
  }>;
}

interface StoryItem {
  slug: string;
  kicker: string;
  title: string;
  highlight: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  previewImage: string;
  counters: Array<{
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    subtext: string;
  }>;
  bullets: string[];
}

export function CategoryStory({ categories }: CategoryStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stories: StoryItem[] = [
    {
      slug: "solar-panels",
      kicker: "Power Generation",
      title: "N-Type TOPCon & Bifacial Panels",
      highlight: "Up to 620W Peak Commercial Ratings",
      body: "We import advanced dual-glass bifacial modules designed for extreme ambient humidity and solar irradiance. Higher bifaciality factor ensures significant rear-side harvest for industrial factories, rooftop garments, and EPC utility plants.",
      icon: Zap,
      previewImage: "/photos/story-panels.webp",
      counters: [
        { label: "Nominal Max Power", value: 620, prefix: "", suffix: " W", decimals: 0, subtext: "16BB N-Type TOPCon" },
        { label: "Module Efficiency", value: 22.6, prefix: "", suffix: "%", decimals: 1, subtext: "Anti-PID Dual Glass" },
        { label: "Rear Bifacial Gain", value: 25, prefix: "+", suffix: "%", decimals: 0, subtext: "Reflective Yield" },
      ],
      bullets: [
        "Anti-PID & low temperature coefficient for tropical climate",
        "Dual-glass 2.0mm + 2.0mm tempered glass protection",
        "Containerized consignments and pallet deliveries nationwide",
      ],
    },
    {
      slug: "lithium-batteries",
      kicker: "Energy Storage",
      title: "LiFePO4 Server Rack & Modular ESS",
      highlight: "6,000+ Cycles @ 80% Depth of Discharge",
      body: "Safe, durable Lithium Iron Phosphate (LiFePO4) storage batteries. Available in standard 3U/4U 51.2V rack-mountable units as well as high-voltage modular systems for three-phase commercial hybrid solar backups.",
      icon: BatteryCharging,
      previewImage: "/photos/story-batteries.webp",
      counters: [
        { label: "Nominal Pack Energy", value: 14.33, prefix: "", suffix: " kWh", decimals: 2, subtext: "51.2V 280Ah Grade-A" },
        { label: "Cycle Life Rating", value: 6000, prefix: "", suffix: "+", decimals: 0, subtext: "@ 80% Depth of Discharge" },
        { label: "Parallel Expansion", value: 16, prefix: "Up to ", suffix: " Packs", decimals: 0, subtext: "229 kWh Scalable ESS" },
      ],
      bullets: [
        "Intelligent multi-stage Battery Management System (BMS)",
        "Multi-protocol CAN / RS485 for leading hybrid inverters",
        "Zero maintenance sealed prismatic Grade-A cells",
      ],
    },
    {
      slug: "solar-inverters",
      kicker: "Power Conversion",
      title: "Commercial Hybrid & String Inverters",
      highlight: "Up to 30kW Industrial Units & 98.7% Peak Efficiency",
      body: "High-efficiency pure sine wave solar inverters engineered for maximum uptime and grid stability. Featuring dual and 3-channel MPPT tracking, IP65/IP66 outdoor enclosures, and sub-10ms automatic UPS transfer for mission-critical industrial loads.",
      icon: Cpu,
      previewImage: "/photos/story-inverters.webp",
      counters: [
        { label: "Rated AC Output", value: 10, prefix: "", suffix: " kW", decimals: 0, subtext: "3-Phase 380V/400V" },
        { label: "Max Peak Efficiency", value: 98.7, prefix: "", suffix: "%", decimals: 1, subtext: "Multi-MPPT High Yield" },
        { label: "UPS Switchover Speed", value: 8, prefix: "< ", suffix: " ms", decimals: 0, subtext: "Instant Automatic Transfer" },
      ],
      bullets: [
        "Smart string monitoring and real-time telemetry",
        "Built-in DC/AC Type II surge arresters",
        "Seamless compatibility with leading lithium battery protocols",
      ],
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop pinned sequence (1024px and wider without reduced motion)
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const pinTrigger = containerRef.current?.querySelector(".story-pin-section");
          if (!pinTrigger) return;

          const panels = gsap.utils.toArray<HTMLElement>(".story-desktop-panel");
          if (panels.length < 3) return;

          // Initially show panel 0, hide panels 1 and 2
          gsap.set(panels[0], { opacity: 1, y: 0, pointerEvents: "auto", display: "grid" });
          gsap.set(panels[1], { opacity: 0, y: 30, pointerEvents: "none", display: "grid" });
          gsap.set(panels[2], { opacity: 0, y: 30, pointerEvents: "none", display: "grid" });

          const dots = gsap.utils.toArray<HTMLElement>(".story-step-dot");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinTrigger,
              pin: true,
              start: "top top",
              end: "+=2200",
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          // Transition Step 0 -> Step 1
          tl.to(panels[0], { opacity: 0, y: -25, pointerEvents: "none", duration: 1 })
            .to(dots[0], { opacity: 0.4, scale: 1, duration: 0.5 }, "<")
            .to(dots[1], { opacity: 1, scale: 1.1, duration: 0.5 }, "<")
            .to(panels[1], { opacity: 1, y: 0, pointerEvents: "auto", duration: 1 }, "-=0.3")

            // Pause slightly on step 1
            .to({}, { duration: 0.8 })

            // Transition Step 1 -> Step 2
            .to(panels[1], { opacity: 0, y: -25, pointerEvents: "none", duration: 1 })
            .to(dots[1], { opacity: 0.4, scale: 1, duration: 0.5 }, "<")
            .to(dots[2], { opacity: 1, scale: 1.1, duration: 0.5 }, "<")
            .to(panels[2], { opacity: 1, y: 0, pointerEvents: "auto", duration: 1 }, "-=0.3")

            // Pause slightly on step 2
            .to({}, { duration: 0.5 });
        }
      );
    },
    { scope: containerRef }
  );

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="bg-[#E4E7E4]">
      {/* ========================================================= */}
      {/* DESKTOP PINNED SCROLL STORY (>= 1024px)                     */}
      {/* ========================================================= */}
      <div className="hidden lg:block">
        <div className="story-pin-section min-h-screen w-full flex flex-col justify-center py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Header & Step Dots Indicator */}
            <div className="flex items-end justify-between mb-8 border-b border-[#DDE1DC] pb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]"></span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
                    Scroll Story &bull; Three Core Categories
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111311]">
                  Engineered Clean Energy Systems
                </h2>
              </div>

              {/* Category Step Indicators */}
              <div className="flex items-center gap-3 bg-white/90 border border-[#DDE1DC] px-4 py-2 rounded-full">
                {stories.map((s, idx) => (
                  <div
                    key={s.slug}
                    className={`story-step-dot flex items-center gap-2 text-xs font-mono transition-all ${
                      idx === 0 ? "opacity-100 font-bold text-[#111311]" : "opacity-40 text-[#5C605C]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
                    <span>{s.kicker}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Area (Pinned overlay container) */}
            <div className="relative min-h-[580px] w-full">
              {stories.map((story) => {
                const IconComponent = story.icon;
                return (
                  <div
                    key={story.slug}
                    className={`story-desktop-panel absolute inset-0 grid grid-cols-12 gap-8 items-center bg-[#EDEDED] border border-[#DDE1DC] rounded-[40px] p-10 shadow-sm transition-all will-change-transform`}
                  >
                    {/* Left Column: Product Visual */}
                    <div className="col-span-5 h-[480px] rounded-3xl bg-white/60 border border-white flex items-center justify-center p-3 relative overflow-hidden group">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src={story.previewImage}
                          alt={story.title}
                          fill
                          sizes="40vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDE1DC] text-[11px] font-mono text-[#111311] z-10 shadow-xs">
                        <IconComponent className="w-3.5 h-3.5 text-[#111311]" />
                        <span>{story.kicker}</span>
                      </div>
                    </div>

                    {/* Right Column: Copy, Specs, and Live Counters */}
                    <div className="col-span-7 flex flex-col justify-between h-full py-2">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5C605C] mb-2 uppercase">
                          <span>Verified Specification</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111311] mb-2">
                          {story.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-mono text-[#111311] font-semibold mb-4 text-[#5C605C]">
                          {story.highlight}
                        </p>
                        <p className="text-sm text-[#5C605C] leading-relaxed mb-6">
                          {story.body}
                        </p>

                        {/* Bullets */}
                        <div className="space-y-2 mb-8">
                          {story.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2.5 text-xs text-[#111311]">
                              <div className="w-4 h-4 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Data Counters */}
                      <div className="pt-6 border-t border-[#DDE1DC] grid grid-cols-3 gap-4">
                        {story.counters.map((c, cIdx) => (
                          <div key={cIdx} className="bg-white/80 rounded-2xl p-4 border border-[#DDE1DC]">
                            <span className="text-[10px] font-mono uppercase text-[#5C605C] block mb-1">
                              {c.label}
                            </span>
                            <div className="text-2xl font-bold font-mono text-[#111311] tracking-tight">
                              <AnimatedCounter
                                value={c.value}
                                prefix={c.prefix}
                                suffix={c.suffix}
                                decimals={c.decimals || 0}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-[#5C605C] mt-0.5 block truncate">
                              {c.subtext}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <Link
                          href={`/category/${story.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-semibold tracking-tight transition-colors shadow-xs"
                        >
                          <span>Explore {story.kicker}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE / TABLET STACKED CARDS (< 1024px)                  */}
      {/* ========================================================= */}
      <div className="block lg:hidden py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono text-[#111311] mb-3 border border-[#DDE1DC]">
              <span className="w-2 h-2 rounded-full bg-[#CEF23E]"></span>
              <span>Category Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111311]">
              Three Pillars of Clean Energy
            </h2>
          </div>

          <div className="space-y-8">
            {stories.map((story) => {
              const IconComponent = story.icon;
              return (
                <div
                  key={story.slug}
                  className="rounded-3xl bg-[#EDEDED] border border-[#DDE1DC] p-6 shadow-sm flex flex-col space-y-6"
                >
                  <div className="relative w-full aspect-4/3 rounded-2xl bg-white/60 border border-white overflow-hidden">
                    <Image
                      src={story.previewImage}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDE1DC] text-[10px] font-mono text-[#111311] z-10 shadow-xs">
                      <IconComponent className="w-3 h-3 text-[#111311]" />
                      <span>{story.kicker}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#111311] mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs font-mono text-[#5C605C] mb-3">
                      {story.highlight}
                    </p>
                    <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed mb-4">
                      {story.body}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {story.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-xs text-[#111311]">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#CEF23E] flex items-center justify-center text-[#111311] shrink-0">
                            <Check className="w-2 h-2" />
                          </div>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#DDE1DC] mb-6">
                      {story.counters.map((c, cIdx) => (
                        <div key={cIdx} className="bg-white/80 rounded-xl p-2.5 border border-[#DDE1DC] text-center">
                          <span className="text-[9px] font-mono uppercase text-[#5C605C] block truncate">
                            {c.label}
                          </span>
                          <div className="text-base font-bold font-mono text-[#111311] tracking-tight">
                            <AnimatedCounter
                              value={c.value}
                              prefix={c.prefix}
                              suffix={c.suffix}
                              decimals={c.decimals || 0}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/category/${story.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-semibold tracking-tight"
                    >
                      <span>Explore {story.kicker}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

