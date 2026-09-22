import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "lucide-react";

export function HeroVisual() {
  return (
    <div
      className="relative w-full max-w-[620px] mx-auto select-none flex flex-col items-center justify-center"
      data-motion="hero-parallax"
      aria-label="Next-generation solar architecture model with real-time grid telemetry"
    >
      {/* 3D Isometric Solar Architecture Visual Container */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center">
        {/* Soft Ambient Gold/Green Halo Glow behind model */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(254,190,22,0.22)_0%,rgba(7,64,49,0.12)_40%,transparent_70%)] blur-2xl -z-10 pointer-events-none" />

        {/* 3D Isometric Station Model */}
        <div className="relative w-full h-full max-h-[380px] rounded-3xl overflow-hidden flex items-center justify-center">
          <Image
            src="/photos/solar-3d-station.jpg"
            alt="Futuristic solar power station and green roof architecture"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 620px"
            className="object-contain object-center transition-transform duration-700 hover:scale-[1.03] will-change-transform"
          />
        </div>

        {/* Floating Glass Card 1: Circuit / Grid Map (Station n. 3456) */}
        <div
          data-motion="hero-glass"
          className="absolute top-10 right-28 sm:right-36 z-20 backdrop-blur-xl bg-[#052F25]/85 border border-white/20 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.25)] rounded-2xl p-3 sm:p-4 w-[130px] sm:w-[150px] transition-transform duration-500 hover:-translate-y-1.5"
        >
          {/* Schematic Circuit Graph SVG */}
          <div className="w-full h-12 mb-2 flex items-center justify-center opacity-85">
            <svg
              viewBox="0 0 100 45"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              {/* Circuit nodes and interconnected route lines */}
              <circle cx="18" cy="32" r="3" fill="#FEBE16" stroke="#052F25" strokeWidth="1.5" />
              <line x1="18" y1="29" x2="35" y2="15" />
              <line x1="35" y1="15" x2="60" y2="15" />
              <circle cx="60" cy="15" r="2.5" fill="#FFFFFF" />
              <line x1="60" y1="15" x2="78" y2="30" />
              <circle cx="78" cy="30" r="2.5" fill="#FFFFFF" />
              <line x1="35" y1="15" x2="52" y2="34" />
              <circle cx="52" cy="34" r="3.5" fill="#FEBE16" stroke="#052F25" strokeWidth="1.5" />
              <line x1="52" y1="34" x2="88" y2="34" />
              <circle cx="88" cy="34" r="2.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="text-[11px] font-semibold text-white leading-tight">
            Station n. 3456
          </div>
          <div className="text-[9.5px] font-mono text-white/70 mt-0.5">
            (4 km - 12000 v)
          </div>
        </div>

        {/* Floating Glass Card 2: Glowing Energy Pill Capsule */}
        <div
          data-motion="hero-glass"
          className="absolute top-14 right-2 sm:right-6 z-20 backdrop-blur-xl bg-white/70 border border-white/80 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.12)] rounded-2xl p-3 w-[84px] sm:w-[96px] aspect-square flex flex-col items-center justify-center transition-transform duration-500 hover:-translate-y-1.5"
        >
          {/* Vertical Energy Tube Capsule */}
          <div className="relative w-5 h-16 rounded-full bg-[#E5E9E0] p-[2px] shadow-inner flex flex-col justify-end overflow-hidden">
            {/* Liquid Glow Level */}
            <div
              className="w-full rounded-full transition-all duration-1000"
              style={{
                height: "82%",
                background: "linear-gradient(180deg, #FFFFFF 0%, #FEBE16 40%, #E4A900 80%, #074031 100%)",
                boxShadow: "0 0 10px rgba(254,190,22,0.8)",
              }}
            />
            {/* Glass shine line */}
            <div className="absolute top-1 left-1.5 w-[2px] h-8 bg-white/70 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Location / Hub Pin Indicator below model */}
      <div className="w-full flex items-start justify-end pr-4 sm:pr-8 -mt-2 z-20">
        <div className="flex items-start gap-3 text-left">
          {/* Round navigation compass button */}
          <div className="w-8 h-8 rounded-full bg-white/90 border border-[#DCE4E0] shadow-sm flex items-center justify-center shrink-0 text-[#074031] transition-transform hover:scale-110">
            <Navigation className="w-3.5 h-3.5 fill-[#074031] rotate-45" />
          </div>

          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#17251F] leading-tight">
              Tejgaon Industrial Area
            </span>
            <span className="text-[11px] text-[#62706A] leading-tight">
              Dhaka, Bangladesh
            </span>
            <Link
              href="/contact"
              className="text-[11px] font-medium text-[#074031] underline underline-offset-2 decoration-[#074031] hover:text-[#0B513E] transition-colors mt-0.5"
            >
              Closest station to you
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
