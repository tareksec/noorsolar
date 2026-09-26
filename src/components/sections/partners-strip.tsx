"use client";

import React from "react";
import type { Partner } from "@prisma/client";
import { AppImage } from "@/components/ui/app-image";
import { Reveal } from "@/components/ui/reveal";

import { usePathname } from "next/navigation";

interface PartnersStripProps {
  partners: Partner[];
  locale?: string;
}

export function PartnersStrip({ partners, locale }: PartnersStripProps) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";

  const validPartners = (partners || []).filter(
    (p) => p && typeof p.name === "string" && p.name.trim().length > 0
  );

  if (validPartners.length === 0) {
    return null;
  }

  // Duplicate for seamless 50% loop
  const duplicated = [...validPartners, ...validPartners];

  const isValidUrl = (url?: string | null) => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (trimmed === "" || trimmed === "#" || trimmed === "/#" || trimmed.toLowerCase().includes("example.com")) {
      return false;
    }
    return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/");
  };

  return (
    <section className="py-16 bg-[#F1F4F1] border-y border-[#DCE4E0] overflow-hidden">
      <Reveal y={18} duration={0.6}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#62706A] font-semibold">
            {isBn
              ? "সরঞ্জাম ব্র্যান্ডসমূহ ও সরাসরি আমদানি লাইন | Brands We Source"
              : "Brands We Source & Equipment Available"}
          </p>
        </div>
      </Reveal>

      {/* Marquee viewport with gradient mask edges */}
      <Reveal y={20} delay={0.1} duration={0.65}>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track flex items-center gap-4 py-2">
          {duplicated.map((p, idx) => {
            const isDuplicate = idx >= validPartners.length;
            const cardContent = (
              <div className="rounded-2xl bg-white/90 backdrop-blur-xs border border-[#DCE4E0] px-6 py-4 flex flex-col items-center justify-center min-w-[190px] h-[96px] hover:border-[#FEBE16] hover:shadow-xs transition-all group shrink-0">
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
                  <div className="text-xs font-mono font-bold text-[#17251F] mb-1">
                    {p.name}
                  </div>
                )}
                <span className="text-[11px] font-mono text-[#62706A] text-center line-clamp-1 group-hover:text-[#074031] transition-colors">
                  {p.name}
                </span>
              </div>
            );

            if (isValidUrl(p.url)) {
              return (
                <a
                  key={`${p.id}-${idx}`}
                  href={p.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isDuplicate ? -1 : 0}
                  aria-hidden={isDuplicate}
                  className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16] rounded-2xl"
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
      </Reveal>
    </section>
  );
}