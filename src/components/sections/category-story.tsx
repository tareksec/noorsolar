"use client";

import React, { useState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowUpRight, Check, Zap, BatteryCharging, Cpu } from "lucide-react";

interface CategoryStoryProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
  }>;
}

export function CategoryStory({ categories }: CategoryStoryProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.slug || "solar-panels");

  const storyDetails: Record<
    string,
    {
      kicker: string;
      title: string;
      highlight: string;
      body: string;
      icon: React.ComponentType<{ className?: string }>;
      specs: Array<{ label: string; value: string }>;
      bullets: string[];
      previewImage: string;
    }
  > = {
    "solar-panels": {
      kicker: "Power Generation",
      title: "N-Type TOPCon & Bifacial Panels",
      highlight: "Up to 700W Peak Module Ratings",
      body: "We import advanced dual-glass bifacial modules designed for extreme ambient humidity and solar irradiance. Higher bifaciality factor ensures significant rear-side harvest for industrial factories, rooftop garments, and EPC utility plants.",
      icon: Zap,
      previewImage: "/demo/panel-620w-topcon.svg",
      specs: [
        { label: "Efficiency", value: "22.6% - 23.1%" },
        { label: "Bifacial Gain", value: "Up to +25%" },
        { label: "Degradation", value: "<0.4% Annual" },
      ],
      bullets: [
        "Anti-PID & low temperature coefficient for tropical climate",
        "Dual-glass 2.0mm + 2.0mm tempered glass protection",
        "Pallet and full container containerized consignments",
      ],
    },
    "lithium-batteries": {
      kicker: "Energy Storage",
      title: "LiFePO4 Server Rack & Modular ESS",
      highlight: "6,000+ Cycles @ 80% Depth of Discharge",
      body: "Safe, durable Lithium Iron Phosphate (LiFePO4) storage batteries. Available in standard 3U/4U 51.2V rack-mountable units as well as high-voltage modular systems for three-phase commercial hybrid solar backups.",
      icon: BatteryCharging,
      previewImage: "/demo/battery-51v-100ah-rack.svg",
      specs: [
        { label: "Nominal Voltage", value: "51.2V / High-Voltage" },
        { label: "Cycle Rating", value: "> 6,000 Cycles" },
        { label: "BMS Protocols", value: "CAN / RS485 / RS232" },
      ],
      bullets: [
        "Intelligent multi-tier Battery Management System (BMS)",
        "Parallel expansion up to 15 modules without external controller",
        "Zero maintenance sealed prismatic Grade-A cells",
      ],
    },
    "solar-inverters": {
      kicker: "Power Conversion",
      title: "Commercial Grid-Tied & Hybrid Inverters",
      highlight: "Up to 100kW Industrial Units & 98.8% Efficiency",
      body: "High-efficiency pure sine wave solar inverters engineered for high uptime and grid stability. Featuring dual and multi-channel MPPT tracking, IP66 outdoor enclosures, and sub-10ms automatic transfer switch for mission-critical backup power.",
      icon: Cpu,
      previewImage: "/demo/inverter-10kw-hybrid.svg",
      specs: [
        { label: "Peak Efficiency", value: "98.8% Max" },
        { label: "Backup Switching", value: "< 10ms (UPS class)" },
        { label: "Grid Standard", value: "Three Phase 380/400V" },
      ],
      bullets: [
        "Smart string monitoring and real-time remote telemetry",
        "Built-in DC/AC Type II surge arresters",
        "Seamless compatibility with leading lithium battery protocols",
      ],
    },
  };

  const currentCategory = categories.find((c) => c.slug === activeTab) || categories[0];
  const story = storyDetails[currentCategory?.slug || "solar-panels"] || storyDetails["solar-panels"];
  const IconComponent = story.icon;

  return (
    <section className="py-20 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
                Product Line Showcase
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111311]">
              Three Pillars of Clean Energy .
            </h2>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#EDEDED] border border-[#DDE1DC] self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const isSelected = cat.slug === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
                    isSelected
                      ? "bg-[#111311] text-[#CEF23E] shadow-sm"
                      : "text-[#5C605C] hover:text-[#111311]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Story Showcase Card */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DDE1DC] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Story Text & Specs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311] w-fit mb-4">
                <IconComponent className="w-3.5 h-3.5 text-[#111311]" />
                <span>{story.kicker}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#111311] tracking-tight mb-3">
                {story.title}
              </h3>

              <div className="text-sm font-mono font-medium text-[#111311] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CEF23E]"></span>
                <span>{story.highlight}</span>
              </div>

              <p className="text-[#5C605C] text-sm sm:text-base leading-relaxed mb-8">
                {story.body}
              </p>

              {/* Specs Metric Badges */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {story.specs.map((sp, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC]">
                    <span className="block text-[10px] font-mono text-[#5C605C] uppercase">
                      {sp.label}
                    </span>
                    <span className="block text-xs sm:text-sm font-bold text-[#111311] mt-1 font-mono">
                      {sp.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bullet Features */}
              <ul className="space-y-2.5 mb-8">
                {story.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#111311]">
                    <div className="w-4 h-4 rounded-full bg-[#CEF23E] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#111311]" />
                    </div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#EDEDED]">
                <Link
                  href={`/category/${currentCategory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111311] text-white text-xs font-semibold tracking-tight hover:bg-[#222622] transition-colors"
                >
                  <span>View All {currentCategory.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#CEF23E]" />
                </Link>

                <Link
                  href={`/#quote-section?category=${currentCategory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-semibold tracking-tight transition-colors"
                >
                  <span>Request Category Quote</span>
                </Link>
              </div>
            </div>

            {/* Story Visual Presentation */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] p-3 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={story.previewImage}
                  alt={story.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
