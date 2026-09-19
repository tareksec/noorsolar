import React from "react";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function updateQuoteStatus(formData: FormData) {
  "use server";
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

export default async function AdminQuotesPage() {
  const quotes = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
          Quote Inbox
        </h1>
        <p className="text-xs text-[#5C605C]">
          Commercial quotation requests received via the website ({quotes.length} total)
        </p>
      </div>

      <div className="space-y-4">
        {quotes.map((q) => (
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
        ))}
      </div>
    </div>
  );
}
