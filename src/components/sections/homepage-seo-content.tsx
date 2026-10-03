import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Sun,
  BatteryCharging,
  Cpu,
  Boxes,
  Factory,
  Building2,
  Tractor,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  HelpCircle,
  Award,
} from "lucide-react";

interface HomepageSeoContentProps {
  locale?: string;
}

export function HomepageSeoContent({ locale }: HomepageSeoContentProps) {
  const isBn = locale === "bn";

  const productsList = [
    {
      title: isBn ? "N-Type TOPCon সোলার প্যানেল" : "N-Type TOPCon Solar Panels",
      desc: isBn
        ? "উচ্চ-দক্ষতাসম্পন্ন বাইফেসিয়াল সেল, ২২.৬%+ পর্যন্ত কার্যক্ষমতা, ৩০ বছরের লিনিয়ার পারফরম্যান্স ওয়ারেন্টি এবং চরম গরমেও স্থিতিশীল উৎপাদন।"
        : "Ultra-high efficiency dual-glass bifacial modules with up to 22.6%+ efficiency, 30-year performance warranty, and low temperature coefficient.",
      icon: Sun,
      href: "/category/solar-panels",
      badge: isBn ? "টিয়ার-১ প্রযুক্তি" : "Tier-1 Tech",
    },
    {
      title: isBn ? "LiFePO4 লিথিয়াম ব্যাটারি" : "LiFePO4 Lithium Batteries",
      desc: isBn
        ? "৬,০০০+ সাইকেল লাইফ, ৯০% ব্যবহারযোগ্য DoD, ইন্টেলিজেন্ট BMS সুরক্ষা এবং বাণিজ্যিক র্যাক ও ওয়াল-মাউন্ট স্লিম ডিজাইন।"
        : "6,000+ deep cycles, 90% usable DoD, intelligent BMS safety, available in server rack and wall-mount enclosures.",
      icon: BatteryCharging,
      href: "/category/lithium-batteries",
      badge: isBn ? "দীর্ঘস্থায়ী স্টোরেজ" : "6,000+ Cycles",
    },
    {
      title: isBn ? "অন-গ্রিড ও হাইব্রিড সোলার ইনভার্টার" : "On-Grid & Hybrid Inverters",
      desc: isBn
        ? "থ্রি-ফেজ ইন্ডাস্ট্রিয়াল স্ট্রিং ইনভার্টার, মাল্টিপল MPPT ট্র্যাকিং, IP66 ওয়াটারপ্রুফ রেটিং এবং নেট-মিটারিং কমপ্লায়েন্ট।"
        : "Commercial 3-phase string and hybrid inverters with multiple MPPTs, IP66 protection, and full net-metering compatibility.",
      icon: Cpu,
      href: "/category/solar-inverters",
      badge: isBn ? "নেট মিটারিং রেডি" : "Net-Metering",
    },
    {
      title: isBn ? "বাণিজ্যিক এনার্জি স্টোরেজ (BESS)" : "Commercial Energy Storage (BESS)",
      desc: isBn
        ? "শিল্প কারখানার পিক শেভিং এবং নিরবচ্ছিন্ন ব্যাকআপের জন্য কাস্টম স্কেলেবল হাই-ভোল্টেজ ব্যাটারি সমাধান।"
        : "Scalable high-voltage containerized battery systems for industrial peak-shaving and critical manufacturing backup.",
      icon: Boxes,
      href: "/category/energy-storage",
      badge: isBn ? "প্রজেক্ট সমাধান" : "Turnkey BESS",
    },
  ];

  const industriesList = [
    {
      name: isBn ? "গার্মেন্টস ও টেক্সটাইল শিল্প (RMG)" : "Garments & Textiles (RMG)",
      desc: isBn
        ? "কারখানার সুবিশাল শেডে নেট-মিটারিং সোলার প্যানেল বসিয়ে পিক আওয়ারে গ্রিড বিদ্যুতের খরচ ৩০-৪০% কমিয়ে আনা।"
        : "Deploy rooftop solar to lower peak grid tariff expenses by 30-40% while achieving green building certifications.",
      icon: Factory,
    },
    {
      name: isBn ? "বাণিজ্যিক ভবন ও রিয়েল এস্টেট" : "Commercial Real Estate & Malls",
      desc: isBn
        ? "হসপিটাল, কর্পোরেট হেডকোয়ার্টার ও শপিং মলে হাইব্রিড সোলার সিস্টেমের মাধ্যমে নিরবচ্ছিন্ন পাওয়ার ব্যাকআপ।"
        : "Hybrid solar and battery setups providing uninterrupted daylight power and silent emergency backup.",
      icon: Building2,
    },
    {
      name: isBn ? "কৃষি, ডেইরি ও পোল্ট্রি খামার" : "Agro, Dairy & Solar Irrigation",
      desc: isBn
        ? "লোডশেডিংমুক্ত সোলার পাম্প ও খামারে পরিবেশবান্ধব বিদ্যুৎ উৎপাদন, যা ব্যয়বহুল ডিজেল জেনারেটরের নির্ভরতা দূর করে।"
        : "Off-grid solar pumping and ventilation systems eliminating expensive diesel generator run-time.",
      icon: Tractor,
    },
    {
      name: isBn ? "সোলার EPC ঠিকাদার ও ইনস্টলার" : "EPC Contractors & Installers",
      desc: isBn
        ? "কন্টেইনার-স্কেল পাইকারি সরবরাহ, ফ্যাক্টরি টেস্ট রিপোর্ট, ডেটাশিট ও দ্রুত ঢাকা ডিপো বা সরাসরি সাইট ডেলিভারি।"
        : "Direct container-load procurement, factory flash-test documentation, and verified warehouse dispatch.",
      icon: Truck,
    },
  ];

  const faqs = [
    {
      q: isBn
        ? "TOPCon এবং সাধারণ PERC সোলার প্যানেলের মধ্যে পার্থক্য কী?"
        : "What is the difference between TOPCon and standard Mono PERC solar panels?",
      a: isBn
        ? "N-Type TOPCon সেল প্রযুক্তিতে পি-টাইপ PERC-এর চেয়ে উচ্চ কার্যক্ষমতা (২২.৬%+ বনাম ২১%), কম অবক্ষয় (প্রথম বছরে ১% বনাম ২%) এবং উচ্চ পরিবেষ্টিত তাপমাত্রায় অনেক উন্নত পারফরম্যান্স পাওয়া যায়। বাংলাদেশের গরম আবহাওয়ায় TOPCon প্যানেল বছরে ৩-৫% বেশি ইউনিট বিদ্যুৎ উৎপাদন করে।"
        : "N-Type TOPCon cells provide higher electrical efficiency (>22.6% vs ~21%), lower first-year degradation (1% vs 2%), and a superior temperature coefficient (-0.30%/°C). In Bangladesh's hot and humid climate, TOPCon modules generate 3% to 5% more annual kWh yield than PERC.",
    },
    {
      q: isBn
        ? "বাংলাদেশের আবহাওয়ায় LiFePO4 লিথিয়াম ব্যাটারি কত বছর টেকে?"
        : "How long do LiFePO4 lithium batteries last in Bangladesh?",
      a: isBn
        ? "LiFePO4 (লিথিয়াম আয়রন ফসফেট) ব্যাটারি দৈনিক ৮০% ডিসচার্জে ৬,০০০ থেকে ৮,০০০ সাইকেল সার্ভিস দেয়, যা প্রায় ১০ থেকে ১৫ বছর কার্যকর থাকে। ঐতিহ্যবাহী লেড-অ্যাসিড ব্যাটারি যেখানে প্রতি আড়াই বছরে বদলাতে হয়, সেখানে LiFePO4 দীর্ঘমেয়াদে অনেক বেশি লাভজনক।"
        : "LiFePO4 batteries deliver 6,000 to 8,000 charge cycles at 80% Depth of Discharge, translating to 10–15 years of daily service. Unlike tubular lead-acid batteries that fail within 2–3 years, LiFePO4 offers far lower levelized lifetime storage cost.",
    },
    {
      q: isBn
        ? "নূর সোলার এনার্জি থেকে পাইকারি ক্রয়ে ন্যূনতম পরিমাণ (MOQ) কত?"
        : "What is the minimum order quantity (MOQ) for wholesale purchase?",
      a: isBn
        ? "ইনভার্টার এবং সার্ভার-র্যাক ব্যাটারির ক্ষেত্রে ১টি ইউনিট থেকেও পাইকারি বুকিং দেওয়া যায়। সোলার প্যানেলের ক্ষেত্রে সাধারণত ১টি পূর্ণ প্যালেট (৩১ থেকে ৩৬ পিস) অথবা বড় প্রজেক্টের জন্য ফুল কন্টেইনার (৪০০+ পিস) সরবরাহ করা হয়।"
        : "Core inverters and rack-mounted batteries can be ordered as single units for commercial buyers. For solar panels, the minimum order is typically 1 standard pallet (31–36 modules) or full 20ft/40ft containers for utility and industrial projects.",
    },
    {
      q: isBn
        ? "পণ্যগুলোর অফিসিয়াল প্রস্তুতকারক ওয়ারেন্টি ও লোকাল সাপোর্ট কীভাবে দেওয়া হয়?"
        : "How is manufacturer warranty and local RMA handled?",
      a: isBn
        ? "নূর সোলার এনার্জি সরাসরি উৎপাদকদের অনুমোদিত ডিস্ট্রিবিউশন পার্টনার। সোলার প্যানেলে ১২ বছরের প্রোডাক্ট ও ৩০ বছরের পারফরম্যান্স ওয়ারেন্টি এবং ইনভার্টার ও ব্যাটারিতে ৫ থেকে ১০ বছরের অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি থাকে। যেকোনো প্রয়োজনে আমাদের ঢাকা সার্ভিস ডেস্ক থেকে সরাসরি RMA সমন্বয় করা হয়।"
        : "Noor Solar Energy operates as a direct authorized supplier. All solar panels carry 12-year product and 30-year linear performance warranties. Inverters and batteries carry 5 to 10-year factory warranties with direct local RMA coordination from our Dhaka technical center.",
    },
    {
      q: isBn
        ? "সারা বাংলাদেশে ডেলিভারি ও পরিবহন ব্যবস্থা কেমন?"
        : "What are the transport and logistics options across Bangladesh?",
      a: isBn
        ? "চট্টগ্রাম ও মোংলা বন্দর থেকে সরাসরি প্রজেক্ট সাইটে কন্টেইনার আনলোডিং অথবা আমাদের উত্তরা/ঢাকা ডিপো থেকে যেকোনো জেলায় সুরক্ষিত ট্রাকে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সমন্বয় করা হয়।"
        : "We facilitate nationwide delivery including direct port-to-site container haulage from Chittagong/Mongla ports and pallet freight dispatch within 24–48 hours from our central Dhaka warehouse.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= PART 1: WHO WE ARE & DIRECT IMPORTER AUTHORITY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031]">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "আমরা কে — নূর সোলার এনার্জি" : "Who We Are — Noor Solar Energy"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#074031] leading-tight">
              {isBn
                ? "বাংলাদেশে নির্ভরযোগ্য সোলার ইকুইপমেন্ট আমদানিকারক ও পাইকারি সরবরাহকারী"
                : "Leading Solar Equipment Importer & Bulk Supplier in Bangladesh"}
            </h2>

            <p className="text-sm sm:text-base text-[#62706A] leading-relaxed">
              {isBn
                ? "নূর সোলার এনার্জি (Noor Solar Energy) বাংলাদেশে বাণিজ্যিক ছাদ, শিল্পপ্রতিষ্ঠান, ইউটিলিটি স্কেল এবং ডিলার নেটওয়ার্কের জন্য বিশ্বমানের সৌর বিদ্যুৎ সরঞ্জাম সরাসরি আমদানি করে। আমরা কোনো মধ্যস্বত্বভোগী ছাড়াই আন্তর্জাতিক টিয়ার-১ প্রস্তুতকারকদের কাছ থেকে কন্টেইনার-স্কেলে ইকুইপমেন্ট সংগ্রহ করি।"
                : "Noor Solar Energy is a premier direct importer and wholesale distributor of commercial-grade solar power equipment across Bangladesh. By eliminating intermediate trading layers, we supply genuine Tier-1 PV modules, advanced LiFePO4 batteries, and industrial inverters at competitive container-scale pricing."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]">
                <div className="flex items-center gap-2 text-[#074031] font-bold text-sm mb-1">
                  <Award className="w-4 h-4 text-[#FEBE16]" />
                  <span>{isBn ? "BSREA নিবন্ধিত" : "BSREA Member"}</span>
                </div>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "বাংলাদেশ টেকসই ও নবায়নযোগ্য শক্তি সমিতির সদস্য।" : "Official General Member of BSREA Bangladesh."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0]">
                <div className="flex items-center gap-2 text-[#074031] font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#FEBE16]" />
                  <span>{isBn ? "১০০% জেনুইন ওয়ারেন্টি" : "Verified Warranty"}</span>
                </div>
                <p className="text-xs text-[#62706A]">
                  {isBn ? "অফিসিয়াল প্রস্তুতকারক টেস্ট রিপোর্ট ও লোকাল RMA ব্যাকআপ।" : "Official laboratory flash reports and local RMA coordination."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#074031] hover:underline"
              >
                <span>{isBn ? "আমাদের পটভূমি ও সক্ষমতা সম্পর্কে জানুন" : "Learn more about our company profile"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border border-[#DCE4E0] shadow-sm bg-[#F1F4F1]">
              <Image
                src="/photos/about-commercial-plant.webp"
                alt={isBn ? "বাংলাদেশে বাণিজ্যিক সোলার প্যানেল প্রকল্প" : "Commercial rooftop solar installation project in Bangladesh"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052F25]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md">
                <span className="text-[11px] font-mono text-[#62706A] uppercase tracking-wider block mb-1">
                  {isBn ? "সরাসরি আমদানি লজিস্টিকস" : "Direct Import Logistics"}
                </span>
                <p className="text-sm font-bold text-[#074031]">
                  {isBn
                    ? "চট্টগ্রাম ও মোংলা বন্দর থেকে সরাসরি কারখানা ও প্রজেক্ট সাইটে দ্রুত ডেলিভারি"
                    : "Container-scale direct dispatch from Chittagong & Mongla ports to your project"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PART 2: WHAT PRODUCTS WE SUPPLY ================= */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "আমাদের সরবরাহকৃত যন্ত্রপাতি" : "What Products We Supply"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "বাণিজ্যিক ও শিল্প প্রকল্পের পূর্ণাঙ্গ সোলার সলিউশন"
                : "Commercial & Industrial Solar Equipment Portfolio"}
            </h2>
            <p className="text-sm sm:text-base text-[#62706A] mt-3">
              {isBn
                ? "সর্বোচ্চ দক্ষতা ও দীর্ঘায়ু নিশ্চিত করতে বিশ্বস্ত ব্র্যান্ডের আন্তর্জাতিক মানসম্পন্ন সরঞ্জাম।"
                : "Engineered for maximum reliability and lifetime energy yield in demanding tropical environments."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#F7F8F5] border border-[#DCE4E0] hover:border-[#074031]/30 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE4E0] flex items-center justify-center text-[#074031] group-hover:bg-[#074031] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#DCE4E0] text-[#074031]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#074031] mb-2 group-hover:text-[#0B513E] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#62706A] leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#074031] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{isBn ? "ক্যাটাগরি দেখুন" : "Explore Range"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PART 3: WHO WE SERVE & INDUSTRIES ================= */}
        <div className="p-8 sm:p-12 lg:p-16 rounded-[36px] bg-[#F1F4F1] border border-[#DCE4E0] mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono text-[#62706A] uppercase tracking-wider block mb-2 font-semibold">
              {isBn ? "আমরা কাদের সেবা দিই" : "Who We Serve & Target Sectors"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "বাংলাদেশের প্রধান প্রধান শিল্প ও বাণিজ্যিক সেক্টরের বিদ্যুৎ সাশ্রয়"
                : "Powering Bangladesh's Key Economic & Industrial Sectors"}
            </h2>
            <p className="text-sm text-[#62706A] mt-3 leading-relaxed">
              {isBn
                ? "আমাদের টেকনিক্যাল টিম প্রতিটি শিল্পের নির্দিষ্ট লোড প্রোফাইল, ছাদের গঠন এবং বিদ্যুৎ খরচের প্যাটার্ন পর্যালোচনা করে উপযুক্ত সরঞ্জাম নির্বাচনের পরামর্শ দেয়।"
                : "Our engineering consultants evaluate specific load profiles, roof geometries, and grid interconnects to tailor the optimum equipment bill of materials."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industriesList.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-[#DCE4E0] shadow-2xs hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F1F4F1] flex items-center justify-center text-[#074031] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#074031] mb-2">
                    {ind.name}
                  </h4>
                  <p className="text-xs text-[#62706A] leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-[#DCE4E0] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#074031] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#17251F]">
                {isBn
                  ? "আপনার প্রজেক্টের জন্য উপযুক্ত ক্যাপাসিটি ও স্পেসিফিকেশন জানতে আমাদের ইঞ্জিনিয়ারিং ডেস্কে কথা বলুন।"
                  : "Need assistance matching modules, inverters, and battery capacities for your project?"}
              </span>
            </div>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#074031] text-white text-xs font-bold hover:bg-[#0B513E] transition-colors"
            >
              <span>{isBn ? "প্রজেক্ট কোটেশন পাঠান" : "Request Project Consultation"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ================= PART 4: FAQ SECTION (RICH TOPICAL AUTHORITY) ================= */}
        <div id="faq" className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F4F1] border border-[#DCE4E0] text-xs font-mono text-[#074031] mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#FEBE16]" />
              <span className="font-semibold">
                {isBn ? "সাধারণ প্রশ্নোত্তর" : "Frequently Asked Questions"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn
                ? "সোলার ইকুইপমেন্ট ও সরবরাহ সম্পর্কিত সাধারণ জিজ্ঞাসা"
                : "Everything You Need to Know About Solar Procurement in Bangladesh"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-2xl bg-[#F7F8F5] border border-[#DCE4E0] open:bg-white open:shadow-xs transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-[#074031] list-none select-none">
                  <span>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-white group-open:bg-[#074031] group-open:text-white border border-[#DCE4E0] flex items-center justify-center text-xs font-mono shrink-0 ml-4 transition-colors">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-[#62706A] leading-relaxed pt-2 border-t border-[#DCE4E0]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* FAQ Structured Data Script */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              }),
            }}
          />
        </div>

      </div>
    </section>
  );
}
