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

  return (
    <section className="py-16 bg-[#EDEDED] border-y border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#5C605C] font-semibold">
            Supplying Commercial Contractors, Solar EPCs & Industrial Facilities
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((p) => {
            const Content = (
              <div className="rounded-xl bg-white/90 backdrop-blur-xs border border-[#DDE1DC] p-4 flex flex-col items-center justify-center min-h-[96px] hover:border-[#CEF23E] hover:shadow-xs transition-all group w-full h-full">
                {p.logo ? (
                  <div className="w-full h-10 relative flex items-center justify-center mb-2">
                    <AppImage
                      src={p.logo}
                      alt={p.name}
                      width={120}
                      height={40}
                      className="max-h-10 max-w-[120px] object-contain group-hover:scale-105 transition-transform"
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
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-xl"
                  title={p.name}
                >
                  {Content}
                </a>
              );
            }

            return (
              <div key={p.id} className="block">
                {Content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}