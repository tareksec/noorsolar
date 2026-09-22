"use client";

import React from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Check, Zap, BatteryCharging, Cpu } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface CategoryStoryProps {
  categories?: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
  }>;
  locale?: string;
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

const STORIES_EN: StoryItem[] = [
  {
    slug: "solar-panels",
    kicker: "Power Generation",
    title: "N-Type TOPCon & Bifacial Panels",
    highlight: "Benchmark Model NS-620TOP-BF • Up to 620W Peak",
    body: "We import advanced dual-glass bifacial modules designed for extreme ambient humidity and solar irradiance. Higher bifaciality factor ensures significant rear-side harvest for industrial factories, rooftop garments, and EPC utility plants.",
    icon: Zap,
    previewImage: "/photos/story-panels.webp",
    counters: [
      { label: "Nominal Max Power (NS-620TOP-BF)", value: 620, prefix: "", suffix: " W", decimals: 0, subtext: "16BB N-Type TOPCon Cell" },
      { label: "Module Efficiency (NS-620TOP-BF)", value: 22.6, prefix: "", suffix: "%", decimals: 1, subtext: "Dual Glass (2.0+2.0mm)" },
      { label: "Rear Bifacial Gain", value: 25, prefix: "Up to +", suffix: "%", decimals: 0, subtext: "Tested on Model NS-620TOP-BF" },
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
    highlight: "Benchmark Model NS-BAT-48100R • 6,000+ Cycles",
    body: "Safe, durable Lithium Iron Phosphate (LiFePO4) storage batteries. Available in standard 3U/4U 51.2V rack-mountable units as well as high-voltage modular systems for three-phase commercial hybrid solar backups.",
    icon: BatteryCharging,
    previewImage: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    counters: [
      { label: "Pack Energy (NS-BAT-48100R)", value: 5.12, prefix: "", suffix: " kWh", decimals: 2, subtext: "51.2V 100Ah Grade-A Prismatic" },
      { label: "Cycle Life (NS-BAT-48100R)", value: 6000, prefix: ">", suffix: " Cycles", decimals: 0, subtext: "@ 80% DoD, 25°C Standard" },
      { label: "Parallel Expansion", value: 15, prefix: "Up to ", suffix: " Units", decimals: 0, subtext: "76.8 kWh Modular Bank" },
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
    highlight: "Tested Across Models NS-INV-5000H1 & NS-INV-30KG3",
    body: "High-efficiency pure sine wave solar inverters engineered for maximum uptime and grid stability. Featuring dual and 3-channel MPPT tracking, IP65/IP66 outdoor enclosures, and sub-10ms automatic UPS transfer for mission-critical industrial loads.",
    icon: Cpu,
    previewImage: "/Inverter/solar-inverter-with-battery-storage.jpg",
    counters: [
      { label: "Output Power (NS-INV-10KH3)", value: 10, prefix: "", suffix: " kW", decimals: 0, subtext: "Three-Phase 380V/400V Grid" },
      { label: "Peak Efficiency (NS-INV-30KG3)", value: 98.7, prefix: "", suffix: "%", decimals: 1, subtext: "30kW Commercial String" },
      { label: "UPS Switchover (NS-INV-5000H1)", value: 8, prefix: "< ", suffix: " ms", decimals: 0, subtext: "Instant Automatic Transfer" },
    ],
    bullets: [
      "Smart string monitoring and real-time telemetry",
      "Built-in DC/AC Type II surge arresters",
      "Seamless compatibility with leading lithium battery protocols",
    ],
  },
];

const STORIES_BN: StoryItem[] = [
  {
    slug: "solar-panels",
    kicker: "পাওয়ার জেনারেশন",
    title: "N-Type TOPCon ও বাইফেসিয়াল সোলার প্যানেল",
    highlight: "বেঞ্চমার্ক মডেল NS-620TOP-BF • সর্বোচ্চ 620W পিক",
    body: "আমরা সরাসরি আমদানি করি ডুয়াল-গ্লাস বাইফেসিয়াল মডিউল, যা বাংলাদেশের উচ্চ তাপমাত্রা ও আর্দ্র পরিবেশেও সর্বোচ্চ বিদ্যুৎ উৎপাদন নিশ্চিত করে। উচ্চ বাইফেসিয়ালিটি ফ্যাক্টরের কারণে শিল্প কারখানা, গার্মেন্টস রুফটপ ও গ্রাউন্ড-মাউন্টেড সোলার প্রজেক্টে ব্যাক-সাইড থেকে উল্লেখযোগ্য অতিরিক্ত বিদ্যুৎ পাওয়া যায়।",
    icon: Zap,
    previewImage: "/photos/story-panels.webp",
    counters: [
      { label: "রেটেড আউটপুট (NS-620TOP-BF)", value: 620, prefix: "", suffix: " W", decimals: 0, subtext: "16BB N-Type TOPCon সেল" },
      { label: "মডিউল কর্মদক্ষতা (NS-620TOP-BF)", value: 22.6, prefix: "", suffix: "%", decimals: 1, subtext: "ডুয়াল গ্লাস (2.0+2.0mm)" },
      { label: "বাইফেসিয়াল গেইন", value: 25, prefix: "সর্বোচ্চ +", suffix: "%", decimals: 0, subtext: "মডেল NS-620TOP-BF পরীক্ষিত" },
    ],
    bullets: [
      "অ্যান্টি-PID ও ট্রপিক্যাল আবহাওয়ার জন্য লো-টেম্পারেচার কোফিসিয়েন্ট",
      "উন্নত 2.0mm + 2.0mm টেম্পার্ড ডুয়াল-গ্লাস সুরক্ষা",
      "সারাদেশে নির্ভরযোগ্য প্যালেট ডেলিভারি ও কন্টেইনার ইনডেন্ট",
    ],
  },
  {
    slug: "lithium-batteries",
    kicker: "এনার্জি স্টোরেজ",
    title: "LiFePO4 সার্ভার র্যাক ও মডুলার ব্যাটারি",
    highlight: "বেঞ্চমার্ক মডেল NS-BAT-48100R • ৬,০০০+ সাইকেল",
    body: "নিরাপদ ও দীর্ঘস্থায়ী লিথিয়াম আয়রন ফসফেট (LiFePO4) স্টোরেজ ব্যাটারি। ইন্ডাস্ট্রিয়াল ব্যাকআপ ও কমার্শিয়াল সোলার সিস্টেমের জন্য স্ট্যান্ডার্ড 51.2V সার্ভার র্যাক এবং হাই-ভোল্টেজ মডুলার সিস্টেমে তাৎক্ষণিক সরবরাহযোগ্য।",
    icon: BatteryCharging,
    previewImage: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    counters: [
      { label: "প্যাক এনার্জি (NS-BAT-48100R)", value: 5.12, prefix: "", suffix: " kWh", decimals: 2, subtext: "51.2V 100Ah গ্রেড-A প্রিজম্যাটিক সেল" },
      { label: "সাইকেল লাইফ (NS-BAT-48100R)", value: 6000, prefix: ">", suffix: " সাইকেল", decimals: 0, subtext: "৮০% DoD, ২৫°C স্ট্যান্ডার্ড" },
      { label: "প্যারালাল এক্সপ্যানশন", value: 15, prefix: "সর্বোচ্চ ", suffix: " ইউনিট", decimals: 0, subtext: "76.8 kWh মডুলার ব্যাংক" },
    ],
    bullets: [
      "ইন্টেলিজেন্ট মাল্টি-স্টেজ ব্যাটারি ম্যানেজমেন্ট সিস্টেম (BMS)",
      "শীর্ষস্থানীয় হাইব্রিড ইনভার্টারের সাথে CAN ও RS485 কমিউনিকেশন",
      "রক্ষণাবেক্ষণমুক্ত জেনুইন গ্রেড-A প্রিজম্যাটিক সেল",
    ],
  },
  {
    slug: "solar-inverters",
    kicker: "পাওয়ার কনভার্সন",
    title: "কমার্শিয়াল হাইব্রিড ও স্ট্রিং ইনভার্টার",
    highlight: "মডেল NS-INV-5000H1 ও NS-INV-30KG3 স্পেসিফিকেশন",
    body: "সর্বোচ্চ আপটাইম ও গ্রিড স্ট্যাবিলিটির জন্য উচ্চ-দক্ষতাসম্পন্ন পিওর সাইন ওয়েভ ইনভার্টার। মাল্টি-চ্যানেল MPPT ট্র্যাকিং, IP65/IP66 আউটডোর প্রটেকশন এবং স্পর্শকাতর লোডের জন্য ১০ মিলি-সেকেন্ডের কম সময়ে স্বয়ংক্রিয় ইউপিএস সুইচওভার।",
    icon: Cpu,
    previewImage: "/Inverter/solar-inverter-with-battery-storage.jpg",
    counters: [
      { label: "রেটেড আউটপুট (NS-INV-10KH3)", value: 10, prefix: "", suffix: " kW", decimals: 0, subtext: "থ্রি-ফেজ 380V/400V গ্রিড" },
      { label: "পিক এফিসিয়েন্সি (NS-INV-30KG3)", value: 98.7, prefix: "", suffix: "%", decimals: 1, subtext: "30kW কমার্শিয়াল স্ট্রিং" },
      { label: "ইউপিএস সুইচওভার (NS-INV-5000H1)", value: 8, prefix: "< ", suffix: " ms", decimals: 0, subtext: "তাৎক্ষণিক স্বয়ংক্রিয় ট্রান্সফার" },
    ],
    bullets: [
      "স্মার্ট স্ট্রিং মনিটরিং ও রিয়েল-টাইম ক্লাউড টেলিমেট্রি",
      "বিল্ট-ইন DC/AC Type II সার্জ অ্যারেস্টার সুরক্ষা",
      "জনপ্রিয় সব লিথিয়াম ব্যাটারি প্রটোকলের সাথে সরাসরি কানেক্টিভিটি",
    ],
  },
];

export function CategoryStory({ locale }: CategoryStoryProps) {
  const isBn = locale === "bn";
  const stories = isBn ? STORIES_BN : STORIES_EN;

  if (!stories || stories.length === 0) {
    return null;
  }

  // Visual Theme Config for the 3 Stacking Cards
  const cardThemes = [
    {
      // Card 1: Solar Panels (Forest Green Theme)
      sectionBg: "bg-[#074031] text-white",
      gridColor: "bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]",
      roundedClass: "",
      shadowClass: "",
      borderClass: "",
      tagBg: "bg-[#FEBE16]/15 text-[#FEBE16] border border-[#FEBE16]/30",
      imageBorder: "border-white/10 bg-white/5",
      counterBg: "bg-white/[0.06] border border-white/10 text-white",
      counterSubtext: "text-[#DCE4E0]/70",
      bulletCheck: "bg-[#FEBE16] text-[#052F25]",
      bulletText: "text-white/90",
      bodyText: "text-white/80",
      ctaBtn: "bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25]",
      indexPill: "bg-white/10 text-[#FEBE16] border border-white/15",
    },
    {
      // Card 2: Lithium Batteries (Soft Surface Theme)
      sectionBg: "bg-[#F1F4F1] text-[#17251F]",
      gridColor: "bg-[linear-gradient(to_right,#07403115_1px,transparent_1px),linear-gradient(to_bottom,#07403115_1px,transparent_1px)]",
      roundedClass: "rounded-tr-2xl rounded-tl-2xl sm:rounded-tr-[40px] sm:rounded-tl-[40px]",
      shadowClass: "shadow-[0_-25px_60px_rgba(7,64,49,0.15)]",
      borderClass: "border-t border-[#DCE4E0]",
      tagBg: "bg-white text-[#074031] border border-[#DCE4E0]",
      imageBorder: "border-[#DCE4E0] bg-white/70",
      counterBg: "bg-white/90 border border-[#DCE4E0] text-[#074031]",
      counterSubtext: "text-[#62706A]",
      bulletCheck: "bg-[#074031] text-[#FEBE16]",
      bulletText: "text-[#17251F]",
      bodyText: "text-[#62706A]",
      ctaBtn: "bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25]",
      indexPill: "bg-[#074031] text-white border border-[#074031]",
    },
    {
      // Card 3: Solar Inverters (Deep Green Theme)
      sectionBg: "bg-[#052F25] text-white",
      gridColor: "bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]",
      roundedClass: "rounded-tr-2xl rounded-tl-2xl sm:rounded-tr-[40px] sm:rounded-tl-[40px]",
      shadowClass: "shadow-[0_-30px_70px_rgba(0,0,0,0.45)]",
      borderClass: "border-t border-[#0B513E]",
      tagBg: "bg-[#FEBE16]/15 text-[#FEBE16] border border-[#FEBE16]/30",
      imageBorder: "border-white/10 bg-white/5",
      counterBg: "bg-white/[0.06] border border-white/10 text-white",
      counterSubtext: "text-[#DCE4E0]/70",
      bulletCheck: "bg-[#FEBE16] text-[#052F25]",
      bulletText: "text-white/90",
      bodyText: "text-white/80",
      ctaBtn: "bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25]",
      indexPill: "bg-white/10 text-[#FEBE16] border border-white/15",
    },
  ];

  return (
    <article className="relative w-full">
      {stories.map((story, idx) => {
        const IconComponent = story.icon;
        const linkHref = isBn ? `/bn/category/${story.slug}` : `/category/${story.slug}`;
        const theme = cardThemes[idx] || cardThemes[0];

        return (
          <section
            key={story.slug}
            data-motion="category-panel"
            className={`${theme.sectionBg} ${theme.roundedClass} ${theme.shadowClass} ${theme.borderClass} min-h-screen w-full grid place-content-center sticky top-0 overflow-hidden py-14 sm:py-20 px-4 sm:px-8 lg:px-12`}
          >
            {/* Subtle High-Tech Blueprint Grid Mask matching user reference */}
            <div
              className={`absolute bottom-0 left-0 right-0 top-0 ${theme.gridColor} bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none`}
            />

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">
              
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-current/15 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEBE16] animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider opacity-75">
                      {isBn ? "প্রোডাক্ট স্টোরি • তিনটি মূল ক্যাটাগরি" : "Scroll Story • Three Core Categories"}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    {isBn ? story.title : `Engineered ${story.kicker} Systems`}
                  </h2>
                </div>

                {/* Step / Category Pill */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold ${theme.indexPill}`}>
                    <span>0{idx + 1} / 0{stories.length}</span>
                    <span className="opacity-40">|</span>
                    <span>{story.kicker}</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Responsive Showcase Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Product Visual Image */}
                <div className="lg:col-span-5 h-[280px] sm:h-[380px] lg:h-[460px] rounded-[28px] sm:rounded-[36px] overflow-hidden relative border p-3 group shadow-xl transition-all duration-500 hover:shadow-2xl">
                  <Link
                    href={linkHref}
                    className="block relative w-full h-full rounded-[22px] sm:rounded-[30px] overflow-hidden cursor-pointer"
                    title={story.title}
                  >
                    <Image
                      src={story.previewImage}
                      alt={story.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out cursor-pointer"
                    />
                    
                    {/* Floating Kicker Badge */}
                    <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md text-[11px] font-mono font-semibold z-10 shadow-sm ${theme.tagBg}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{story.kicker}</span>
                    </div>

                    {/* Hover Hint Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-black text-xs font-bold shadow-md">
                        {isBn ? "ক্যাটাগরি দেখুন →" : "View Category →"}
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Right Column: Copy, Specs, and Live Counters */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Verified Specs Eyebrow */}
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider opacity-70 mb-2">
                      <span>{isBn ? "টেকনিক্যাল বেঞ্চমার্ক" : "Technical Benchmarks"}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
                      {story.title}
                    </h3>

                    {/* Highlight Subtitle */}
                    <p className="text-xs sm:text-sm font-mono font-bold opacity-80 mb-4">
                      {story.highlight}
                    </p>

                    {/* Body */}
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${theme.bodyText}`}>
                      {story.body}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5 mb-6">
                      {story.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2.5 text-xs sm:text-sm">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${theme.bulletCheck}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className={theme.bulletText}>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Live Data Counters */}
                  <div className="pt-5 border-t border-current/15 grid grid-cols-3 gap-3 sm:gap-4">
                    {story.counters.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className={`rounded-2xl p-3 sm:p-4 backdrop-blur-xs transition-all ${theme.counterBg}`}
                      >
                        <span className={`text-xs font-mono uppercase block truncate mb-1 opacity-75`}>
                          {c.label}
                        </span>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono tracking-tight">
                          <AnimatedCounter
                            value={c.value}
                            prefix={c.prefix}
                            suffix={c.suffix}
                            decimals={c.decimals || 0}
                          />
                        </div>
                        <span className={`text-xs font-mono mt-1 block truncate ${theme.counterSubtext}`}>
                          {c.subtext}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Explore Button */}
                  <div className="pt-4 flex items-center">
                    <Link
                      href={linkHref}
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 shadow-md hover:scale-105 active:scale-95 ${theme.ctaBtn}`}
                    >
                      <span>{isBn ? "টেকনিক্যাল তথ্য ও পণ্য দেখুন" : `View ${story.kicker} Products`}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </div>

            </div>
          </section>
        );
      })}
    </article>
  );
}
