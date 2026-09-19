import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { Download, Search } from "lucide-react";

async function updateQuoteStatus(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const note = formData.get("note") as string;

  if (id && status) {
    await db.quoteRequest.update({
      where: { id },
      data: { status, note: note || null },
    });
    revalidatePath("/admin/quotes");
    revalidatePath("/admin");
  }
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;

  const whereClause: Prisma.QuoteRequestWhereInput = {};

  if (q.trim()) {
    const term = q.trim();
    whereClause.OR = [
      { name: { contains: term } },
      { company: { contains: term } },
      { phone: { contains: term } },
      { email: { contains: term } },
      { location: { contains: term } },
      { message: { contains: term } },
    ];
  }

  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  const quotes = await db.quoteRequest.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const totalQuotesCount = await db.quoteRequest.count();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Quote Inbox
          </h1>
          <p className="text-xs text-[#5C605C]">
            Commercial quotation requests received via website ({quotes.length} of {totalQuotesCount} showing)
          </p>
        </div>

        <a
          href="/admin/quotes/export"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:border-[#111311] text-xs font-mono font-medium shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#111311]" />
          <span>Export All CSV</span>
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <form method="GET" className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#5C605C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by customer name, company, phone, email, or site..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none placeholder:text-[#5C605C] focus:ring-1 focus:ring-[#111311]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-mono font-medium shrink-0 transition-colors"
            >
              Filter
            </button>

            {(q || status) && (
              <Link
                href="/admin/quotes"
                className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-[#5C605C] hover:text-[#111311] text-xs font-mono shrink-0 transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {quotes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
            <p className="text-sm font-mono text-[#5C605C] mb-2">No quotes matched your search criteria.</p>
            <Link
              href="/admin/quotes"
              className="text-xs font-mono text-[#111311] underline hover:text-black"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDED]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#111311]">{q.name}</span>
                  {q.company && (
                    <span className="text-xs font-mono text-[#5C605C] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                      {q.company}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      q.status === "NEW"
                        ? "bg-[#CEF23E] text-[#111311]"
                        : q.status === "CONTACTED"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-[#EDEDED] text-[#5C605C]"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-[#5C605C]">
                  {new Date(q.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#5C605C] font-mono block">Phone Number</span>
                  <span className="font-mono font-bold text-[#111311]">{q.phone}</span>
                </div>
                {q.email && (
                  <div>
                    <span className="text-[#5C605C] font-mono block">Email</span>
                    <span className="font-mono text-[#111311]">{q.email}</span>
                  </div>
                )}
                {q.location && (
                  <div>
                    <span className="text-[#5C605C] font-mono block">Project Site</span>
                    <span className="text-[#111311]">{q.location}</span>
                  </div>
                )}
                {q.quantity && (
                  <div>
                    <span className="text-[#5C605C] font-mono block">Volume / Quantity</span>
                    <span className="font-mono text-[#111311]">{q.quantity}</span>
                  </div>
                )}
              </div>

              {q.product && (
                <div className="p-3 rounded-xl bg-[#EDEDED] text-xs font-mono">
                  <span className="text-[#5C605C]">Target Product: </span>
                  <span className="font-bold text-[#111311]">{q.product.name}</span>
                </div>
              )}

              {q.message && (
                <p className="text-xs text-[#5C605C] bg-white border border-[#EDEDED] p-3 rounded-xl">
                  &ldquo;{q.message}&rdquo;
                </p>
              )}

              {/* Actions & Status Updates */}
              <div className="pt-3 border-t border-[#EDEDED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#111311] text-[#CEF23E] text-xs font-mono font-semibold"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${q.phone}`}
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] text-[#111311] text-xs font-mono font-semibold hover:bg-[#DDE1DC]"
                  >
                    Call
                  </a>
                </div>

                <form action={updateQuoteStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={q.id} />
                  <select
                    name="status"
                    defaultValue={q.status}
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="CONTACTED">Status: CONTACTED</option>
                    <option value="CLOSED">Status: CLOSED</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] text-xs font-mono hover:bg-[#111311] hover:text-white transition-colors"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
