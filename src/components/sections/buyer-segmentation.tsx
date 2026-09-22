import React from "react";
import { Link } from "@/i18n/routing";
import { HardHat, Building2, Store, ArrowRight, Check } from "lucide-react";

interface BuyerSegmentationProps {
  locale?: string;
}

export function BuyerSegmentation({ locale }: BuyerSegmentationProps) {
  const isBn = locale === "bn";

  const segments = [
    {
      id: "epc",
      icon: HardHat,
      title: isBn ? "সোলার EPC ও ইনস্টলেশন ঠিকাদার" : "Solar EPCs & Installers",
      badge: isBn ? "প্রজেক্ট প্রকিউরমেন্ট" : "Project Procurement",
      description: isBn
        ? "বাণিজ্যিক ও ইউটিলিটি স্কেল সোলার প্রজেক্টের জন্য সরাসরি কন্টেইনার ও প্রজেক্ট লট ইকুইপমেন্ট সরবরাহ।"
        : "Engineered equipment procurement and technical matching for commercial & utility projects.",
      points: isBn
        ? [
            "প্রজেক্টভিত্তিক ইকুইপমেন্ট সংগ্রহ ও কন্টেইনার ইনডেন্ট",
            "রেডি স্টক থেকে ১ প্যালেট বা বাল্ক ভলিউম সরবরাহ",
            "অফিসিয়াল টেকনিক্যাল ডেটাশিট ও স্পেসিফিকেশন সাপোর্ট",
          ]
        : [
            "Project procurement & container indent",
            "Pallet and bulk volume supply",
            "Technical product matching & datasheets",
          ],
      ctaText: isBn ? "প্রজেক্ট কোটেশন নিন" : "Request Project Quote",
      href: "/contact?segment=epc",
    },
    {
      id: "commercial",
      icon: Building2,
      title: isBn ? "বাণিজ্যিক ও শিল্প প্রতিষ্ঠান (C&I)" : "Industrial & Commercial Buyers",
      badge: isBn ? "কারখানা ও বাণিজ্যিক রুফটপ" : "Factory & Commercial",
      description: isBn
        ? "কারখানার রুফটপ ও বাণিজ্যিক স্থাপনার জন্য উচ্চ ক্ষমতাসম্পন্ন সোলার প্যানেল, ইনভার্টার ও স্টোরেজ।"
        : "Direct equipment supply for factory rooftops, industrial facilities, and commercial storage.",
      points: isBn
        ? [
            "শিল্প কারখানার রুফটপ সোলার ইকুইপমেন্ট সরবরাহ",
            "হাই-ভোল্টেজ LiFePO4 ব্যাটারি এনার্জি স্টোরেজ (BESS)",
            "কমার্শিয়াল ইনভার্টার ও গ্রিড সিঙ্ক্রোনাইজেশন ইকুইপমেন্ট",
          ]
        : [
            "Factory & commercial solar procurement",
            "High-voltage LiFePO4 battery storage",
            "Inverter and project equipment supply",
          ],
      ctaText: isBn ? "বাণিজ্যিক কোটেশন নিন" : "Request Commercial Quote",
      href: "/contact?segment=commercial",
    },
    {
      id: "resellers",
      icon: Store,
      title: isBn ? "সোলার ডিলার ও রিসেলার" : "Dealers & Resellers",
      badge: isBn ? "পাইকারি রি-সাপ্লাই" : "Wholesale & Volume",
      description: isBn
        ? "সারাদেশের সোলার ইকুইপমেন্ট বিক্রেতা ও ডিলারদের জন্য নিয়মিত ডিপো স্টক ও আকর্ষণীয় পাইকারি মূল্য।"
        : "Reliable wholesale inventory, repeat pallet supply, and volume pricing for regional trade.",
      points: isBn
        ? [
            "১ প্যালেট থেকে সরাসরি পাইকারি ক্রয়ের সুবিধা",
            "ঢাকা সেন্ট্রাল ডিপো থেকে নিয়মিত রিপিট সাপ্লাই",
            "প্রতিযোগিতামূলক B2B মার্জিন ও দ্রুত ডেলিভারি",
          ]
        : [
            "Wholesale purchasing from 1 pallet",
            "Repeat supply from ready warehouse inventory",
            "Volume enquiries & competitive wholesale margins",
          ],
      ctaText: isBn ? "ডিলার কোটেশন নিন" : "Inquire for Dealership",
      href: "/contact?segment=reseller",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#F1F4F1] border-b border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#074031] inline-block" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#62706A] font-semibold">
                {isBn ? "B2B ক্লায়েন্ট ও ক্রেতা" : "B2B Buyer Segmentation"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn ? "প্রতিটি স্তরের B2B সোলার সংগ্রহে নির্ভরযোগ্য পার্টনার" : "Built for Every Scale of B2B Solar Procurement"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#62706A] max-w-md">
            {isBn
              ? "সরাসরি আমদানিকারক হিসেবে আমরা বাংলাদেশের EPC ঠিকাদার, বাণিজ্যিক প্রতিষ্ঠান ও আঞ্চলিক ডিলারদের প্রজেক্ট স্কেলে ইকুইপমেন্ট সরবরাহ করি।"
              : "Direct importer supplying EPC contractors, industrial facilities, and regional wholesale dealers across Bangladesh."}
          </p>
        </div>

        {/* 3 Buyer Segmentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.id}
                className="bg-white rounded-[28px] border border-[#DCE4E0] p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-[#074031]/40 transition-all duration-200 group"
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#F1F4F1] group-hover:bg-[#FEBE16] transition-colors flex items-center justify-center text-[#074031] group-hover:text-[#052F25] shrink-0">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#F1F4F1] text-[#074031] border border-[#DCE4E0]">
                      {seg.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#17251F] mb-2 leading-tight">
                    {seg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed mb-5">
                    {seg.description}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 pt-4 border-t border-[#DCE4E0] mb-6">
                    {seg.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#17251F] leading-snug">
                        <span className="w-4 h-4 rounded-full bg-[#FEBE16]/30 text-[#074031] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Link */}
                <div className="pt-2">
                  <Link
                    href={seg.href}
                    className="inline-flex items-center justify-between w-full px-4 py-3 rounded-full bg-[#F1F4F1] hover:bg-[#074031] hover:text-white text-[#074031] text-xs font-semibold font-mono transition-all duration-200 group/btn"
                  >
                    <span>{seg.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
