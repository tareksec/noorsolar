import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ProductCardProps {
  product: {
    id: string; slug: string; name: string; brand?: string | null; model?: string | null;
    stockStatus: string; priceBdt?: number | null; showPrice: boolean;
    images: Array<{ url: string; alt: string }>;
    specs: Array<{ label: string; value: string }>;
    category?: { name: string; slug: string } | null;
  };
  priority?: boolean;
}
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const image = product.images[0];
  const detailHref = "/product/" + product.slug;
  const quoteHref = "/contact?product=" + encodeURIComponent(product.slug) + "#quote-section";
  const stock = product.stockStatus === "IN_STOCK" ? "In stock" : product.stockStatus === "INCOMING" ? "Incoming" : "On request";
  return (
    <article className="product-card">
      <Link href={detailHref} className="product-card-image" tabIndex={-1} aria-hidden="true">
        <AppImage src={image?.url || "/demo/category-panels.svg"} alt={image?.alt || product.name} width={640} height={480}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 44vw, 380px" className="product-image" />
        <span className={"stock-badge " + (product.stockStatus === "IN_STOCK" ? "stock-available" : "")}><span />{stock}</span>
        <span className="product-image-arrow"><ArrowUpRight size={19} /></span>
      </Link>
      <div className="product-card-body">
        {product.category && <p className="eyebrow">{product.category.name}</p>}
        <h3><Link href={detailHref}>{product.name}</Link></h3>
        {product.model && <p className="product-model">{product.model}</p>}
        <dl className="card-specs">{product.specs.slice(0, 2).map(spec => (
          <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>
        ))}</dl>
        <div className="product-card-actions">
          <span>{product.showPrice && product.priceBdt != null ? "BDT " + product.priceBdt.toLocaleString() : "Price on request"}</span>
          <Link href={quoteHref} className="button button-dark" aria-label={"Request quote for " + product.name}>Request quote <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  );
}

