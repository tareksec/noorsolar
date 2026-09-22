"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
  tag?: string;
}

interface ServicesSolutionsProps {
  locale?: string;
}

export function ServicesSolutions({ locale }: ServicesSolutionsProps = {}) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const scrollRef = useRef<HTMLDivElement>(null);

  const services: ServiceCard[] = [
    {
      id: "container-indent",
      title: isBn ? "সরাসরি কন্টেইনার ইনডেন্ট" : "Direct Container Indent",
      description: isBn
        ? "লার্জ-স্কেল ইউটিলিটি ও ফ্যাক্টরি রুফটপ প্রজেক্টের জন্য সরাসরি প্রস্তুতকারক থেকে কন্টেইনার আমদানির পূর্ণাঙ্গ লজিস্টিকস ও কাস্টমস ক্লিয়ারেন্স সুবিধা।"
        : "Factory-direct container shipments for large EPC developers and industrial plants, with complete bill of lading and customs clearance support.",
      image: "/photos/b2b-container-indent.webp",
      alt: isBn ? "বাংলাদেশে সরাসরি কন্টেইনার সোলার মডিউল আমদানি ও বন্দর লজিস্টিকস" : "Direct container solar module imports and seaport logistics in Bangladesh",
      link: "/contact",
      tag: isBn ? "ফুল কন্টেইনার লোড (FCL)" : "Full Container Load (FCL)",
    },
    {
      id: "warehouse-stock",
      title: isBn ? "ঢাকা বাফার ডিপো স্টক" : "Dhaka Buffer Warehouse Stock",
      description: isBn
        ? "জরুরি প্রজেক্টের জন্য আমাদের ঢাকা ডিপোতে প্রস্তুত প্যালেট সোলার প্যানেল, LiFePO4 ব্যাটারি ও ইনভার্টারের রেডি স্টক থেকে তাৎক্ষণিক সাইট সরবরাহ।"
        : "Immediate dispatch from ready pallet inventory in our Dhaka distribution depot, avoiding project downtime and overseas shipping lead times.",
      image: "/photos/b2b-warehouse-stock.webp",
      alt: isBn ? "ঢাকায় বাফার স্টক ওয়্যারহাউস ও রেডি প্যালেট সরবরাহ" : "Warehouse buffer stock and ready pallet dispatch in Dhaka",
      link: "/products",
      tag: isBn ? "রেডি প্যালেট স্টক" : "Ready Pallet Stock",
    },
    {
      id: "compliance-verification",
      title: isBn ? "ইঞ্জিনিয়ারিং ও কমপ্লায়েন্স ফাইল" : "Engineering & Compliance Files",
      description: isBn
        ? "ব্যাংক-ফাইন্যান্সড ও কমপ্লায়েন্স প্রজেক্টের জন্য ফ্যাক্টরি ফ্ল্যাশ টেস্ট রিপোর্ট, সান-সিমুলেটর ডেটাশিট ও প্রস্তুতকারকের অফিসিয়াল ওয়ারেন্টি সনদ।"
        : "Complete compliance dossiers including original factory flash test reports, EL inspection data, and manufacturer warranty certificates for bankable installations.",
      image: "/photos/b2b-compliance-testing.webp",
      alt: isBn ? "বাণিজ্যিক সোলার ইঞ্জিনিয়ারিং ল্যাব টেস্টিং ও সার্টিফিকেশন ফাইল" : "Solar engineering QA testing and compliance certification files",
      link: "/certifications",
      tag: isBn ? "ফ্ল্যাশ টেস্ট ও EL সনদ" : "Flash Test & EL Reports",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 380;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="services" className="pt-16 lg:pt-24 pb-8 lg:pb-10 bg-[#F1F4F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row: Eyebrow + Split Headline & Value Proposition */}
        <div className="mb-12 lg:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full border-2 border-[#074031] inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#17251F] font-semibold">
              {isBn ? "সরবরাহ চ্যানেল ও লজিস্টিকস" : "B2B Supply Channels & Fulfillment"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#074031] max-w-xl leading-[1.08]">
              {isBn ? "EPC ঠিকাদার ও প্রজেক্টের জন্য সুনির্দিষ্ট সরবরাহ ব্যবস্থা" : "Structured Supply Channels for EPCs & Contractors"}
            </h2>

            {/* Accent Description Box */}
            <div className="border-l-2 border-[#074031] pl-4 sm:pl-5 max-w-md">
              <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed">
                {isBn
                  ? "সরাসরি কন্টেইনার আমদানি হোক কিংবা ঢাকা ডিপো থেকে জরুরি প্যালেট সরবরাহ — আমাদের দ্রুত লজিস্টিকস আপনার প্রজেক্টের কাজ রাখবে নির্বিঘ্ন।"
                  : "Whether importing container consignments directly or pulling urgent buffer pallets from our Dhaka warehouse, our procurement channels keep projects on schedule."}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Service Cards Grid / Carousel */}
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory"
        >
          {services.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[350px] lg:w-auto shrink-0 snap-start bg-white rounded-[28px] p-6 sm:p-7 border border-[#DCE4E0] shadow-xs hover:border-[#074031] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251F]">
                    {item.title}
                  </h3>
                  <Link
                    href={item.link}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#F1F4F1] text-[#074031] group-hover:bg-[#FEBE16] group-hover:text-[#052F25] transition-colors shrink-0"
                    aria-label={isBn ? `${item.title} দেখুন` : `View ${item.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs sm:text-[13px] text-[#62706A] leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Card Photo Below Text */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#F1F4F1]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {item.tag && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#074031] bg-white/95 backdrop-blur-md shadow-xs border border-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#074031]" />
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows (Desktop & Mobile) */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={() => handleScroll("left")}
            className="w-11 h-11 rounded-full bg-white border border-[#DCE4E0] text-[#074031] hover:border-[#074031] hover:bg-[#074031] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] cursor-pointer"
            aria-label={isBn ? "পূর্ববর্তী সমাধান" : "Previous service"}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-11 h-11 rounded-full bg-white border border-[#DCE4E0] text-[#074031] hover:border-[#074031] hover:bg-[#074031] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] cursor-pointer"
            aria-label={isBn ? "পরবর্তী সমাধান" : "Next service"}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
