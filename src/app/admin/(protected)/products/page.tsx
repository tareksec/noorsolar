import React from "react";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

async function toggleProductFeatured(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const current = formData.get("current") === "true";

  if (id) {
    await db.product.update({
      where: { id },
      data: { isFeatured: !current },
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
}

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    include: {
      category: true,
      images: { take: 1 },
      specs: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Product Inventory
          </h1>
          <p className="text-xs text-[#5C605C]">
            Manage models, specifications, and featured catalog items ({products.length} total)
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <div className="divide-y divide-[#EDEDED]">
          {products.map((p) => (
            <div
              key={p.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shrink-0">
                  <Image
                    src={p.images[0]?.url || "/demo/category-panels.svg"}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111311]">{p.name}</span>
                    {p.isDemo && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
                        Demo
                      </span>
                    )}
                    {p.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#CEF23E] text-[#111311]">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5C605C] font-mono mt-1">
                    <span>{p.category.name}</span>
                    <span>&bull;</span>
                    <span>{p.model || "No model code"}</span>
                    <span>&bull;</span>
                    <span>{p.specs.length} specs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <form action={toggleProductFeatured}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="current" value={String(p.isFeatured)} />
                  <button
                    type="submit"
                    title="Toggle featured status"
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                      p.isFeatured
                        ? "bg-[#111311] text-[#CEF23E]"
                        : "bg-[#EDEDED] text-[#5C605C] hover:bg-[#DDE1DC]"
                    }`}
                  >
                    ★ {p.isFeatured ? "Featured" : "Make Featured"}
                  </button>
                </form>

                <Link
                  href={`/product/${p.slug}`}
                  target="_blank"
                  className="p-2 rounded-full text-[#5C605C] hover:text-[#111311] hover:bg-[#EDEDED]"
                  title="View live product page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
