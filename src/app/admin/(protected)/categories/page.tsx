import React from "react";
import { db } from "@/lib/db";
import { CategoryCardClient } from "@/components/admin/category-card-client";
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Equipment Categories
          </h1>
          <p className="text-xs text-[#5C605C]">
            The primary B2B product lines ({categories.length} lines configured).
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <CategoryCardClient
            key={cat.id}
            category={cat}
            isFirst={idx === 0}
            isLast={idx === categories.length - 1}
          />
        ))}
      </div>
    </div>
  );
}