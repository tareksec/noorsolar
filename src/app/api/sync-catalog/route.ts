import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensurePortableStationInDb } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensurePortableStationInDb();

    const category = await db.category.findUnique({
      where: { slug: "portable-power-stations" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const products = await db.product.findMany({
      where: { category: { slug: "portable-power-stations" } },
      include: {
        images: true,
        specs: true,
      },
    });

    const totalProducts = await db.product.count({ where: { isActive: true } });
    const totalCategories = await db.category.count({ where: { isActive: true } });

    return NextResponse.json({
      success: true,
      message: "Catalog sync executed successfully",
      stats: {
        totalProducts,
        totalCategories,
        portableStationsInDb: products.length,
      },
      portablePowerStations: {
        categoryExists: Boolean(category),
        categoryDetails: category,
        products: products.map((p) => ({
          slug: p.slug,
          name: p.name,
          imagesCount: p.images.length,
          specsCount: p.specs.length,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
