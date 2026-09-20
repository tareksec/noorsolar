"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface CategoryDockProps {
  categories?: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }>;
}

interface EquipmentCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  specPill: string;
  link: string;
}

const EQUIPMENT_ITEMS: EquipmentCard[] = [
  {
    id: "solar-panels",
    slug: "solar-panels",
    title: "Solar Panels",
    description:
      "Monocrystalline and polycrystalline panels with full technical specs and datasheets.",
    image: "/solar-images/solar-panel-3d-isolated.webp",
    alt: "High-efficiency monocrystalline solar panels under clear sky",
    specPill: "Tier-1 N-Type TOPCon · Bifacial",
    link: "/category/solar-panels",
  },
  {
    id: "inverters-controllers",
    slug: "solar-inverters",
    title: "Inverters & Controllers",
    description:
      "On-grid, off-grid and hybrid inverters plus MPPT/PWM charge controllers.",
    image: "/Inverter/white-inverter-of-solar-cell-power-generation-system.jpg",
    alt: "High-power commercial hybrid solar inverter unit",
    specPill: "Hybrid & Grid-Tie · IP65 Telecom Grade",
    link: "/category/solar-inverters",
  },
  {
    id: "batteries-storage",
    slug: "lithium-batteries",
    title: "Batteries & Storage",
    description:
      "Lithium batteries and UPS units that store energy for night-time use or power cuts.",
    image: "/bettry/500_F_2090872600_mpL6CKZulRNh7R8OMe31iD00cXQpEpR7.jpg",
    alt: "LiFePO4 lithium battery energy storage system",
    specPill: "LiFePO4 · 6000+ Cycles · Grade-A",
    link: "/category/lithium-batteries",
  },
];

export function CategoryDock({}: CategoryDockProps) {
  return (
    <section className="relative z-10 py-16 sm:py-24 bg-[#E4E7E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matches User Reference Image) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          
          {/* Top Kicker with Accent Lines */}
          <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-[#85580F] uppercase mb-4">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#85580F]/70 rounded-full" />
            <span>What We Offer</span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#85580F]/70 rounded-full" />
          </div>

          {/* Main Heading with Contrasting Solar Equipment */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111311] leading-tight">
            A Complete Range of{" "}
            <span className="text-[#485244] font-extrabold">Solar Equipment</span>
          </h2>

          {/* Subheading */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#5C605C] leading-relaxed max-w-2xl mx-auto">
            From single products to full home and commercial kits — genuine equipment, technical support, and dual retail/wholesale pricing.
          </p>
        </div>

        {/* 3 Equipment Cards Grid with Overlapping White Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 lg:gap-10">
          {EQUIPMENT_ITEMS.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                data-motion="category-panel"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 0.999, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col cursor-pointer"
              >
                <Link href={item.link} className="block relative">
                  
                  {/* Top Image Container with Smooth Zoom Effect */}
                  <div className="relative w-full h-64 sm:h-72 rounded-[28px] overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shadow-xs">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Subtle Gradient Shadow at bottom of image to blend with overlap */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>

                  {/* Overlapping White Content Card */}
                  <div className="relative z-10 -mt-16 sm:-mt-20 mx-4 sm:mx-5 p-6 sm:p-7 rounded-[24px] bg-white border border-[#DDE1DC] shadow-[0_10px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] group-hover:border-[#111311]/20 transition-all duration-500">
                    
                    {/* Floating Circular Arrow Badge Button */}
                    <div className="absolute -top-6 right-6 w-12 h-12 rounded-full bg-[#C49335] group-hover:bg-[#CEF23E] text-white group-hover:text-[#111311] flex items-center justify-center shadow-[0_4px_14px_rgba(196,147,53,0.35)] group-hover:shadow-[0_6px_20px_rgba(206,242,62,0.4)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#111311] group-hover:text-black mb-2.5 tracking-tight">
                      {item.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Spec Pill Tag */}
                    <div className="pt-3 border-t border-[#F0F2EF] flex items-center justify-between">
                      <span className="text-[11px] font-mono font-medium text-[#646C5F] bg-[#F5F7F3] border border-[#E2E6DF] px-2.5 py-1 rounded-full">
                        {item.specPill}
                      </span>
                      <span className="text-xs font-semibold text-[#111311] group-hover:underline underline-offset-4">
                        Explore &rarr;
                      </span>
                    </div>

                  </div>

                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Centered Bottom CTA Button: "View All Products" */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#111311] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-98"
          >
            <span>View All Products</span>
          </Link>
        </div>

      </div>
    </section>
  );
}