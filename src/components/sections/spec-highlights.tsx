"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sun, BatteryCharging, Cpu, CheckCircle2 } from "lucide-react";

interface SpecHighlightsProps {
  highlights: {
    maxPanelWatt: number;
    maxBatteryKwh: number;
    maxInverterKw: number;
    totalTier1Models: number;
  };
}

export function SpecHighlights({ highlights }: SpecHighlightsProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const metrics = [
    {
      label: "Highest Panel Rating",
      value: highlights.maxPanelWatt,
      suffix: "W",
      subtext: "N-Type TOPCon & HJT High-Yield Modules",
      icon: Sun,
    },
    {
      label: "Largest Battery Unit",
      value: highlights.maxBatteryKwh,
      suffix: "kWh",
      subtext: "High-Voltage Modular LiFePO4 ESS",
      icon: BatteryCharging,
    },
    {
      label: "Industrial Inverter Rating",
      value: highlights.maxInverterKw,
      suffix: "kW",
      subtext: "Three-Phase 9-MPPT Utility Central Units",
      icon: Cpu,
    },
    {
      label: "Verified Catalog Models",
      value: highlights.totalTier1Models,
      suffix: "+",
      subtext: "Direct Factory Sealed In-Stock Inventory",
      icon: CheckCircle2,
    },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-12 lg:p-16 rounded-[36px] bg-[#111311] text-white shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CEF23E]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono text-[#CEF23E] mb-3">
              <span>Verified Hardware Specs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Data-Backed Engineering Capacity .
            </h2>
            <p className="text-[#A0A4A0] text-sm sm:text-base mt-2">
              Metrics calculated directly from our active warehouse inventory and technical equipment datasheets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CEF23E]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#A0A4A0] uppercase tracking-wider">
                      {m.label}
                    </span>
                    <Icon className="w-5 h-5 text-[#CEF23E]" />
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white">
                      {inView ? m.value : 0}
                    </span>
                    <span className="text-xl font-bold font-mono text-[#CEF23E]">
                      {m.suffix}
                    </span>
                  </div>

                  <p className="text-xs text-[#8A8F8A] leading-relaxed mt-2">
                    {m.subtext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
