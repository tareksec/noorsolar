"use client";

import React, { useRef } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface CategoryDockProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image?: string | null;
    _count?: { products: number };
  }>;
}

interface DockCardProps {
  cat: {
    id: string;
    slug: string;
    name: string;
    image?: string | null;
    _count?: { products: number };
  };
  meta: {
    subtitle: string;
    spec: string;
  };
}

function MagneticDockCard({ cat, meta }: DockCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth magnetic spring physics
  const springConfig = { stiffness: 180, damping: 18 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull factor (subtle and controlled)
    const pullX = (e.clientX - centerX) * 0.18;
    const pullY = (e.clientY - centerY) * 0.18;
    mouseX.set(pullX);
    mouseY.set(pullY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduceMotion ? {} : { x: springX, y: springY }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              scale: 1.025,
              boxShadow: "0 16px 36px -8px rgba(206, 242, 62, 0.3)",
              borderColor: "rgba(206, 242, 62, 0.8)",
            }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="category-dock-pill rounded-full will-change-transform"
    >
      <Link
        href={`/category/${cat.slug}`}
        className="group flex items-center justify-between p-3.5 sm:p-4 rounded-full glass-dock bg-white/85 hover:bg-white border border-[#DDE1DC] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] transition-colors duration-200"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Circular Photo Thumbnail with subtle hover pop */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#EDEDED] border border-[#DDE1DC] group-hover:border-[#111311] transition-colors">
            <Image
              src={cat.image || "/demo/category-panels.svg"}
              alt={cat.name}
              fill
              sizes="48px"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col truncate">
            <span className="font-bold text-sm text-[#111311] tracking-tight truncate group-hover:text-black">
              {cat.name}
            </span>
            <span className="text-[11px] font-mono text-[#5C605C] truncate">
              {meta.subtitle} &bull;{" "}
              <span className="text-[#111311] font-medium">{meta.spec}</span>
            </span>
          </div>
        </div>

        {/* Pill Button with Volt-Lime glow on hover */}
        <div className="shrink-0 ml-3">
          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#111311] group-hover:bg-[#CEF23E] text-white group-hover:text-[#111311] text-xs font-semibold tracking-tight transition-all duration-200 shadow-xs">
            Explore
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryDock({ categories }: CategoryDockProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const dockMeta: Record<string, { subtitle: string; spec: string }> = {
    "solar-panels": {
      subtitle: "N-Type TOPCon & Bifacial",
      spec: "Up to 620W Modules",
    },
    "lithium-batteries": {
      subtitle: "LiFePO4 Storage & ESS",
      spec: "6000+ Deep Cycles",
    },
    "solar-inverters": {
      subtitle: "Hybrid & Grid-Tie",
      spec: "Dual/Multi MPPT Tech",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]"></span>
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
            Direct Import Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-mono text-[#111311] hover:underline flex items-center gap-1 group"
        >
          <span>View All Equipment</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.slice(0, 3).map((cat) => {
          const meta = dockMeta[cat.slug] || {
            subtitle: "Commercial Wholesale",
            spec: `${cat._count?.products || 5} Available Models`,
          };

          return <MagneticDockCard key={cat.id} cat={cat} meta={meta} />;
        })}
      </div>
    </div>
  );
}
