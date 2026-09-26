import React from "react";
import type { Stat } from "@prisma/client";
import { AnimatedCounter } from "@/components/ui/animated-counter";

import { RevealGroup, RevealItem } from "@/components/ui/reveal";

interface StatsBandProps {
  stats: Stat[];
}

export function StatsBand({ stats }: StatsBandProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="stats-band py-12 bg-[#F1F4F1] border-y border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealGroup stagger={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => (
            <RevealItem key={item.id} y={20}>
              <div
                className="bg-white/90 backdrop-blur-xs border border-[#DCE4E0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#FEBE16]/80 transition-colors h-full"
              >
                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#62706A] mb-2 font-medium">
                  {item.label}
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#074031] tracking-tight font-mono">
                    <AnimatedCounter
                      value={item.value}
                      prefix={item.prefix}
                      suffix={item.suffix}
                      decimals={Number.isInteger(item.value) ? 0 : 1}
                    />
                  </div>
                  {item.description && (
                    <p className="mt-2 text-xs text-[#62706A] leading-snug">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

