import React from "react";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
          Equipment Categories
        </h1>
        <p className="text-xs text-[#5C605C]">
          The three primary B2B product lines ({categories.length} lines configured)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#EDEDED] mb-4 border border-[#DDE1DC]">
                <Image
                  src={cat.image || "/demo/category-panels.svg"}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-[#111311]">{cat.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#111311]">
                  Order: {cat.sortOrder}
                </span>
              </div>

              <p className="text-xs text-[#5C605C] line-clamp-2 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#EDEDED] flex items-center justify-between text-xs">
              <span className="font-mono text-[#5C605C]">
                {cat._count.products} Products Active
              </span>

              <Link
                href={`/category/${cat.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 font-mono text-[#111311] hover:underline"
              >
                <span>Live Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
