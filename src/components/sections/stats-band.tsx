import React from "react";
import type { Stat } from "@prisma/client";

interface StatsBandProps {
  stats: Stat[];
}

export function StatsBand({ stats }: StatsBandProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#EDEDED] border-y border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 backdrop-blur-xs border border-[#DDE1DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#CEF23E]/80 transition-colors"
            >
              <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#5C605C] mb-2 font-medium">
                {item.label}
              </div>
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111311] tracking-tight font-mono">
                  {item.prefix && <span className="text-[#CEF23E] mr-0.5">{item.prefix}</span>}
                  <span>{item.value}</span>
                  {item.suffix && <span className="text-[#CEF23E] ml-0.5">{item.suffix}</span>}
                </div>
                {item.description && (
                  <p className="mt-2 text-xs text-[#5C605C] leading-snug">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}