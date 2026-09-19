import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductFormClient } from "@/components/admin/product-form-client";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

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
            Edit: {product.name}
          </h1>
          <p className="text-xs text-[#5C605C]">
            Update specs, stock status, and product images
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm">
        <ProductFormClient categories={categories} initialProduct={product} />
      </div>
    </div>
  );
}
