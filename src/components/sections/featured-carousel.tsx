import Link from "next/link";
import { ProductCard, type ProductCardProps } from "@/components/product/product-card";
import { ProductRail } from "@/components/ui/product-rail";
export function FeaturedCarousel({ products }: { products: ProductCardProps["product"][] }) {
  if (!products.length) return null;
  return <section className="section-space bg-[#EDEDED]"><div className="page-shell">
    <div className="section-heading"><div><p className="eyebrow">Explore the catalog</p><h2>Equipment worth a closer look.</h2></div><Link href="/products" className="text-link">View all products ↗</Link></div>
    <ProductRail label="Featured equipment">{products.map(product => <div key={product.id}><ProductCard product={product} /></div>)}</ProductRail>
  </div></section>;
}

