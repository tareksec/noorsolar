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
      title: isBn ? "কনটেইনার সরাসরি ইনডেন্ট" : "Direct Container Indent",
      description: isBn
        ? "লার্জ-স্কেল ইউটিলিটি ও ফ্যাক্টরি রুফটপ প্রকল্পের জন্য সরাসরি প্রস্তুতকারক থেকে কনটেইনার আমদানির সম্পূর্ণ লজিস্টিক ও ক্লিয়ারেন্স সুবিধা।"
        : "Factory-direct container shipments for large EPC developers and industrial plants, with complete bill of lading and customs clearance support.",
      image: "/solar-images/solar-panels-arranged-in-a-grid-pattern-on-a-clean-surface-under-bright-lighting-photo.jpeg",
      alt: isBn ? "বাংলাদেশে উচ্চ-দক্ষতাসম্পন্ন সোলার প্যানেল কন্টেইনার আমদানি" : "Direct container solar module imports in Bangladesh",
      link: "/contact",
    },
    {
      id: "warehouse-stock",
      title: isBn ? "ঢাকা ওয়্যারহাউস বাফার স্টক" : "Dhaka Buffer Warehouse Stock",
      description: isBn
        ? "জরুরি প্রকল্পের জন্য আমাদের ঢাকা ওয়্যারহাউসে প্যালেট-রেডি সোলার প্যানেল, লিথিয়াম ব্যাটারি ও ইনভার্টারের রেডি স্টক থেকে তাৎক্ষণিক সরবরাহ।"
        : "Immediate dispatch from ready pallet inventory in our Dhaka distribution depot, avoiding project downtime and overseas shipping lead times.",
      image: "/bettry/500_F_2090872523_bLZOG1F2Gbz4TsCdhboiXNUezn7dTZZI.jpg",
      alt: isBn ? "ঢাকায় বাফার স্টক লিথিয়াম ব্যাটারি ও ইনভার্টার ডিপো" : "Warehouse buffer stock of lithium batteries and solar equipment in Dhaka",
      link: "/products",
    },
    {
      id: "compliance-verification",
      title: isBn ? "প্রকৌশল যাচাই ও কমপ্লায়েন্স" : "Engineering & Compliance Files",
      description: isBn
        ? "ব্যাংক-ফাইন্যান্সড ও কমপ্লায়েন্স প্রকল্পের জন্য ফ্যাক্টরি ফ্ল্যাশ টেস্ট রিপোর্ট, সান-সিমুলেটর ডেটাশিট ও অফিশিয়াল ওয়ারেন্টি ডকুমেন্টেশন।"
        : "Complete compliance dossiers including original factory flash test reports, EL inspection data, and manufacturer warranty certificates for bankable installations.",
      image: "/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg",
      alt: isBn ? "বাণিজ্যিক সোলার ইঞ্জিনিয়ারিং ও কমপ্লায়েন্স যাচাই" : "Solar engineering compliance testing and certification",
      link: "/certifications",
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
    <section id="services" className="pt-16 lg:pt-24 pb-8 lg:pb-10 bg-[#EDEDED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row: Eyebrow + Split Headline & Value Proposition */}
        <div className="mb-12 lg:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full border-2 border-[#111311] inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#111311] font-semibold">
              {isBn ? "সরবরাহ চ্যানেল ও লজিস্টিকস" : "B2B Supply Channels & Fulfillment"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311] max-w-xl leading-[1.08]">
              {isBn ? "ঠিকাদার ও ইপিসি প্রজেক্টের জন্য নির্ধারিত সরবরাহ ব্যবস্থা" : "Structured Supply Channels for EPCs & Contractors"}
            </h2>

            {/* Accent Description Box */}
            <div className="border-l-2 border-[#111311] pl-4 sm:pl-5 max-w-md">
              <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
                {isBn
                  ? "সরাসরি কনটেইনার আমদানি হোক কিংবা ঢাকা ওয়্যারহাউস থেকে জরুরি প্যালেট সংগ্রহ — আমাদের সরবরাহ ব্যবস্থা আপনার প্রকল্পকে রাখবে গতিশীল।"
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
              className="w-[300px] sm:w-[350px] lg:w-auto shrink-0 snap-start bg-white rounded-[28px] p-6 sm:p-7 border border-[#DDE1DC] shadow-xs hover:border-[#111311] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311]">
                    {item.title}
                  </h3>
                  <Link
                    href={item.link}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#EDEDED] text-[#111311] group-hover:bg-[#CEF23E] transition-colors shrink-0"
                    aria-label={isBn ? `${item.title} দেখুন` : `View ${item.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5C605C] leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Card Photo Below Text */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E4E7E4]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows (Desktop & Mobile) */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={() => handleScroll("left")}
            className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] hover:bg-[#111311] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
            aria-label={isBn ? "পূর্ববর্তী সমাধান" : "Previous service"}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-11 h-11 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] hover:bg-[#111311] hover:text-white flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] cursor-pointer"
            aria-label={isBn ? "পরবর্তী সমাধান" : "Next service"}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
