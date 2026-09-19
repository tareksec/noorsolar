import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Package, Layers, MessageSquare, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, newQuoteCount, latestQuotes] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.quoteRequest.count({ where: { status: "NEW" } }),
    db.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111311] tracking-tight">
          Admin Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#5C605C] mt-1">
          Catalog summary and incoming quotation requests
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C]">NEW QUOTES</span>
            <div className="w-8 h-8 rounded-full bg-[#CEF23E]/30 flex items-center justify-center text-[#111311]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {newQuoteCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            Requiring follow-up
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C]">ACTIVE PRODUCTS</span>
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {productCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            Catalog models listed
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#5C605C]">CATEGORIES</span>
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold font-mono text-[#111311]">
            {categoryCount}
          </span>
          <span className="text-xs text-[#5C605C] block mt-1">
            Product lines
          </span>
        </div>
      </div>

      {/* Latest Quotes Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#111311]">
              Recent Quote Inquiries
            </h2>
            <p className="text-xs text-[#5C605C]">
              Incoming requests from commercial buyers and solar contractors
            </p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-mono text-[#111311] hover:underline flex items-center gap-1"
          >
            <span>View All Inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestQuotes.length > 0 ? (
          <div className="divide-y divide-[#EDEDED] border-t border-b border-[#EDEDED]">
            {latestQuotes.map((q) => (
              <div
                key={q.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111311]">{q.name}</span>
                    {q.company && (
                      <span className="text-xs text-[#5C605C]">({q.company})</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        q.status === "NEW"
                          ? "bg-[#CEF23E] text-[#111311]"
                          : "bg-[#EDEDED] text-[#5C605C]"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#5C605C] font-mono">
                    <span>{q.phone}</span>
                    {q.product && (
                      <span>&bull; Interested in: {q.product.name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311] hover:bg-[#DDE1DC]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${q.phone}`}
                    className="px-3 py-1.5 rounded-full bg-[#111311] text-[11px] font-mono text-white hover:bg-black"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5C605C] py-4 text-center">
            No quote requests received yet.
          </p>
        )}
      </div>

    </div>
  );
}
