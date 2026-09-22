"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Award, Handshake, Quote, HelpCircle, Briefcase } from "lucide-react";
import type { SampleContentSummary } from "@/lib/data/content";

export function ContentTabs({
  sampleCounts,
}: {
  sampleCounts?: SampleContentSummary | Record<string, number>;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Statistics", href: "/admin/content/stats", icon: BarChart3, key: "stats", countKey: "statsCount" },
    { label: "Certifications", href: "/admin/content/certifications", icon: Award, key: "certifications", countKey: "certificationsCount" },
    { label: "Partners", href: "/admin/content/partners", icon: Handshake, key: "partners", countKey: "partnersCount" },
    { label: "Testimonials", href: "/admin/content/testimonials", icon: Quote, key: "testimonials", countKey: "testimonialsCount" },
    { label: "FAQ Items", href: "/admin/content/faq", icon: HelpCircle, key: "faq", countKey: "faqCount" },
    { label: "Projects & Proof", href: "/admin/content/projects", icon: Briefcase, key: "projects", countKey: "projectsCount" },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-[#DDE1DC] pb-4 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        let samples = 0;
        if (sampleCounts) {
          const rec = sampleCounts as Record<string, number>;
          samples = rec[tab.key] ?? rec[tab.countKey] ?? 0;
        }

        const activeClass = isActive
          ? "bg-[#111311] text-white font-bold"
          : "bg-white text-[#5C605C] hover:bg-[#EDEDED] hover:text-[#111311] border border-[#DDE1DC]";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={"flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors " + activeClass}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {samples > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-700 font-bold">
                {samples} sample
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}