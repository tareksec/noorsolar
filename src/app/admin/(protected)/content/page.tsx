import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getLiveSampleContentSummary } from "@/lib/data/content";
import { ContentTabs } from "@/components/admin/content-tabs";
import { BarChart3, Award, Handshake, Quote, HelpCircle, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function ContentOverviewPage() {
  const summary = await getLiveSampleContentSummary();

  const [statTotal, certTotal, partnerTotal, testimonialTotal, faqTotal] = await Promise.all([
    db.stat.count(),
    db.certification.count(),
    db.partner.count(),
    db.testimonial.count(),
    db.faqItem.count(),
  ]);

  const cards = [
    {
      title: "Key Business Statistics",
      href: "/admin/content/stats",
      icon: BarChart3,
      total: statTotal,
      samples: summary.statsCount,
      desc: "Metric counters displayed in the statistics band on the homepage",
    },
    {
      title: "Certifications & Badges",
      href: "/admin/content/certifications",
      icon: Award,
      total: certTotal,
      samples: summary.certificationsCount,
      desc: "Accreditations, standards, and safety certifications grid",
    },
    {
      title: "Partners & Clients",
      href: "/admin/content/partners",
      icon: Handshake,
      total: partnerTotal,
      samples: summary.partnersCount,
      desc: "Logos and links shown in the partner strip on the homepage",
    },
    {
      title: "Client Testimonials",
      href: "/admin/content/testimonials",
      icon: Quote,
      total: testimonialTotal,
      samples: summary.testimonialsCount,
      desc: "Commercial customer quotes, buyer roles, and photos",
    },
    {
      title: "FAQ Knowledge Base",
      href: "/admin/content/faq",
      icon: HelpCircle,
      total: faqTotal,
      samples: summary.faqCount,
      desc: "Frequently asked questions regarding quotes, MOQ, and terms",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
          Trust & Marketing Content
        </h1>
        <p className="text-xs text-[#5C605C] mt-1">
          Manage company statistics, certifications, partners, client reviews, and FAQ items.
        </p>
      </div>

      <ContentTabs sampleCounts={summary} />

      {summary.totalLiveSamples > 0 ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-950">
            <p className="font-bold font-mono text-sm">
              {summary.totalLiveSamples} sample {summary.totalLiveSamples === 1 ? "item is" : "items are"} currently live
            </p>
            <p className="text-amber-800">
              Sample items show generic placeholder data to visitors. Replace them with real company data, or click Mark-as-real once verified.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#CEF23E]/10 border border-[#CEF23E]/30 flex items-center gap-3 text-xs text-[#111311]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All live trust content is verified real data. Zero placeholder sample items are live.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="p-5 rounded-2xl bg-white border border-[#DDE1DC] hover:border-[#111311] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDEDED] group-hover:bg-[#CEF23E] flex items-center justify-center text-[#111311] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  {c.samples > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700">
                      {c.samples} sample live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#5C605C] bg-[#EDEDED]">
                      All real
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-sm text-[#111311]">{c.title}</h2>
                <p className="text-xs text-[#5C605C] mt-1 line-clamp-2">{c.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDEDED] flex items-center justify-between text-xs font-mono">
                <span className="text-[#5C605C]">{c.total} total rows</span>
                <span className="text-[#111311] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}