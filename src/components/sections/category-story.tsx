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
    previewImage: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
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
    previewImage: "/Inverter/solar-inverter-with-battery-storage.jpg",
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

const STORIES_BN: StoryItem[] = [
  {
    slug: "solar-panels",
    kicker: "বিদ্যুৎ উৎপাদন",
    title: "N-Type TOPCon ও বাইফেসিয়াল সোলার প্যানেল",
    highlight: "সর্বোচ্চ 620W কমার্শিয়াল সক্ষমতা",
    body: "আমরা আমদানি করি উন্নত ডুয়াল-গ্লাস বাইফেসিয়াল মডিউল, যা বাংলাদেশের উচ্চ তাপমাত্রা ও আর্দ্রতায় সর্বোচ্চ বিদ্যুৎ উৎপাদন করে। উভয় পাশ দিয়ে সূর্যালোক শোষণের ফলে শিল্পকারখানা ও রুফটপ প্রকল্পে অতিরিক্ত উৎপাদন পাওয়া যায়।",
    icon: Zap,
    previewImage: "/photos/story-panels.webp",
    counters: [
      { label: "সর্বোচ্চ আউটপুট", value: 620, prefix: "", suffix: " W", decimals: 0, subtext: "16BB N-Type TOPCon" },
      { label: "মডিউল কর্মদক্ষতা", value: 22.6, prefix: "", suffix: "%", decimals: 1, subtext: "Anti-PID ডুয়াল গ্লাস" },
      { label: "বাইফেসিয়াল বৃদ্ধি", value: 25, prefix: "+", suffix: "%", decimals: 0, subtext: "উভয়মুখী আলো শোষণ" },
    ],
    bullets: [
      "উচ্চ তাপমাত্রা সহনশীল ও অ্যান্টি-PID সুরক্ষা",
      "2.0mm + 2.0mm টেম্পার্ড ডুয়াল-গ্লাস স্থায়িত্ব",
      "সারাদেশে নিরাপদ প্যালেট ও কন্টেইনার সরবরাহ",
    ],
  },
  {
    slug: "lithium-batteries",
    kicker: "এনার্জি স্টোরেজ",
    title: "LiFePO4 সার্ভার র্যাক ও মডুলার ব্যাটারি",
    highlight: "৮০% DOD-তে ৬,০০০+ সাইকেল লাইফ",
    body: "নিরাপদ ও দীর্ঘস্থায়ী লিথিয়াম আয়রন ফসফেট (LiFePO4) স্টোরেজ ব্যাটারি। ইন্ডাস্ট্রিয়াল ব্যাকআপ ও সোলার হাইব্রিড সিস্টেমের জন্য 51.2V র্যাক মাউন্ট ও উচ্চ ভোল্টেজ মডুলার সিস্টেমে সরবরাহযোগ্য।",
    icon: BatteryCharging,
    previewImage: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    counters: [
      { label: "ব্যাটারি এনার্জি", value: 14.33, prefix: "", suffix: " kWh", decimals: 2, subtext: "51.2V 280Ah গ্রেড-A" },
      { label: "সাইকেল লাইফ", value: 6000, prefix: "", suffix: "+", decimals: 0, subtext: "৮০% ডিসচার্জ গভীরতায়" },
      { label: "প্যারালাল সংযোগ", value: 16, prefix: "সর্বোচ্চ ", suffix: " প্যাক", decimals: 0, subtext: "229 kWh পর্যন্ত স্কেলযোগ্য" },
    ],
    bullets: [
      "ইন্টেলিজেন্ট মাল্টি-স্টেজ ব্যাটারি ম্যানেজমেন্ট (BMS)",
      "শীর্ষস্থানীয় হাইব্রিড ইনভার্টারের সাথে CAN/RS485 সাপোর্ট",
      "রক্ষণাবেক্ষণমুক্ত সিল্ড গ্রেড-A প্রিজম্যাটিক সেল",
    ],
  },
  {
    slug: "solar-inverters",
    kicker: "পাওয়ার কনভার্সন",
    title: "কমার্শিয়াল হাইব্রিড ও স্ট্রিং ইনভার্টার",
    highlight: "সর্বোচ্চ 30kW ক্যাপাসিটি ও ৯৮.৭% রূপান্তর দক্ষতা",
    body: "উচ্চ-দক্ষতাসম্পন্ন পিওর সাইন ওয়েভ সোলার ইনভার্টার, যা দীর্ঘস্থায়ী এবং গ্রিডের ওঠানামায় নিখুঁত কাজ করে। মাল্টি-চ্যানেল MPPT ট্র্যাকিং, IP65 সুরক্ষা এবং সংবেদনশীল লোডের জন্য তাৎক্ষণিক ইউপিএস সুইচিং।",
    icon: Cpu,
    previewImage: "/Inverter/solar-inverter-with-battery-storage.jpg",
    counters: [
      { label: "রেটেড এসি আউটপুট", value: 10, prefix: "", suffix: " kW", decimals: 0, subtext: "৩-ফেজ ৩৮০V/৪০০V" },
      { label: "সর্বোচ্চ কর্মদক্ষতা", value: 98.7, prefix: "", suffix: "%", decimals: 1, subtext: "মাল্টি-MPPT হাই ইল্ড" },
      { label: "ইউপিএস রূপান্তর", value: 8, prefix: "< ", suffix: " ms", decimals: 0, subtext: "তাত্ক্ষণিক অটো ট্রান্সফার" },
    ],
    bullets: [
      "রিয়েল-টাইম স্ট্রিং মনিটরিং ও রিমোট কন্ট্রোল",
      "অন্তর্নির্মিত DC/AC Type II সার্জ প্রোটেকশন",
      "শীর্ষস্থানীয় লিথিয়াম ব্যাটারি প্রটোকলের সাথে পূর্ণ সামঞ্জস্য",
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
      // Card 1: Solar Panels (Deep Slate Theme)
      sectionBg: "bg-slate-950 text-white",
      gridColor: "bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]",
      roundedClass: "",
      shadowClass: "",
      borderClass: "",
      tagBg: "bg-[#CEF23E]/15 text-[#CEF23E] border border-[#CEF23E]/30",
      imageBorder: "border-white/10 bg-white/5",
      counterBg: "bg-white/[0.06] border border-white/10 text-white",
      counterSubtext: "text-slate-400",
      bulletCheck: "bg-[#CEF23E] text-[#111311]",
      bulletText: "text-slate-200",
      bodyText: "text-slate-300",
      ctaBtn: "bg-[#CEF23E] hover:bg-white text-[#111311]",
      indexPill: "bg-white/10 text-[#CEF23E] border border-white/15",
    },
    {
      // Card 2: Lithium Batteries (Clean Industrial Light Gray Theme)
      sectionBg: "bg-neutral-300 text-black",
      gridColor: "bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]",
      roundedClass: "rounded-tr-2xl rounded-tl-2xl sm:rounded-tr-[40px] sm:rounded-tl-[40px]",
      shadowClass: "shadow-[0_-25px_60px_rgba(0,0,0,0.35)]",
      borderClass: "border-t border-white/70",
      tagBg: "bg-white/90 text-[#111311] border border-slate-300",
      imageBorder: "border-slate-300 bg-white/70",
      counterBg: "bg-white/90 border border-slate-300 text-[#111311]",
      counterSubtext: "text-[#5C605C]",
      bulletCheck: "bg-[#111311] text-[#CEF23E]",
      bulletText: "text-[#111311]",
      bodyText: "text-[#3D423D]",
      ctaBtn: "bg-[#111311] hover:bg-black text-[#CEF23E]",
      indexPill: "bg-[#111311] text-white border border-[#111311]",
    },
    {
      // Card 3: Solar Inverters (Deep Black / Neon Lime Theme)
      sectionBg: "bg-slate-950 text-white",
      gridColor: "bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]",
      roundedClass: "rounded-tr-2xl rounded-tl-2xl sm:rounded-tr-[40px] sm:rounded-tl-[40px]",
      shadowClass: "shadow-[0_-30px_70px_rgba(0,0,0,0.55)]",
      borderClass: "border-t border-[#CEF23E]/30",
      tagBg: "bg-[#CEF23E]/15 text-[#CEF23E] border border-[#CEF23E]/30",
      imageBorder: "border-white/10 bg-white/5",
      counterBg: "bg-white/[0.06] border border-white/10 text-white",
      counterSubtext: "text-slate-400",
      bulletCheck: "bg-[#CEF23E] text-[#111311]",
      bulletText: "text-slate-200",
      bodyText: "text-slate-300",
      ctaBtn: "bg-[#CEF23E] hover:bg-white text-[#111311]",
      indexPill: "bg-white/10 text-[#CEF23E] border border-white/15",
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
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E] animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider opacity-75">
                      {isBn ? "স্ক্রোল স্টোরি • তিনটি মূল ক্যাটাগরি" : "Scroll Story • Three Core Categories"}
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
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 shadow-md hover:scale-105 active:scale-95 ${theme.ctaBtn}`}
                    >
                      <span>{isBn ? "বিস্তারিত দেখুন" : `Explore ${story.kicker}`}</span>
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
