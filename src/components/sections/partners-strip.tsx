"use client";

import React from "react";
import type { Partner } from "@prisma/client";
import { AppImage } from "@/components/ui/app-image";

interface PartnersStripProps {
  partners: Partner[];
}

export function PartnersStrip({ partners }: PartnersStripProps) {
  if (!partners || partners.length === 0) {
    return null;
  }

  // Duplicate for seamless 50% loop
  const duplicated = [...partners, ...partners];

  return (
    <section className="py-16 bg-[#EDEDED] border-y border-[#DDE1DC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#5C605C] font-semibold">
          Supplying Commercial Contractors, Solar EPCs & Industrial Facilities
        </p>
      </div>

      {/* Marquee viewport with gradient mask edges */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex items-center gap-4 py-2">
          {duplicated.map((p, idx) => {
            const isDuplicate = idx >= partners.length;
            const cardContent = (
              <div className="rounded-2xl bg-white/90 backdrop-blur-xs border border-[#DDE1DC] px-6 py-4 flex flex-col items-center justify-center min-w-[190px] h-[96px] hover:border-[#CEF23E] hover:shadow-xs transition-all group shrink-0">
                {p.logo ? (
                  <div className="w-full h-9 relative flex items-center justify-center mb-1.5">
                    <AppImage
                      src={p.logo}
                      alt={isDuplicate ? "" : p.name}
                      width={120}
                      height={36}
                      className="max-h-9 max-w-[120px] object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="text-xs font-mono font-bold text-[#111311] mb-1">
                    {p.name}
                  </div>
                )}
                <span className="text-[11px] font-mono text-[#5C605C] text-center line-clamp-1 group-hover:text-[#111311] transition-colors">
                  {p.name}
                </span>
              </div>
            );

            if (p.url) {
              return (
                <a
                  key={`${p.id}-${idx}`}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isDuplicate ? -1 : 0}
                  aria-hidden={isDuplicate}
                  className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-2xl"
                  title={p.name}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div
                key={`${p.id}-${idx}`}
                aria-hidden={isDuplicate}
                className="shrink-0"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}