import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductFormClient } from "@/components/admin/product-form-client";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:bg-[#EDEDED]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs text-[#5C605C]">
            Create a catalog item with technical specifications and images
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm">
        <ProductFormClient categories={categories} />
      </div>
    </div>
  );
}
