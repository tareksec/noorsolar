import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryDockProps {
  categories: Array<{ id: string; slug: string; name: string; image?: string | null; _count?: { products: number } }>;
}
export function CategoryDock({ categories }: CategoryDockProps) {
  if (!categories.length) return null;
  return (
    <section id="equipment" className="page-shell category-dock" aria-label="Shop by equipment type">
      {categories.map((cat, index) => (
        <Link key={cat.id} href={"/category/" + cat.slug} className="category-link">
          <div className="category-thumb">{cat.image && <AppImage src={cat.image} alt="" width={160} height={160} sizes="72px" className="object-contain" />}</div>
          <div className="min-w-0"><span className="eyebrow">0{index + 1} / {cat._count?.products ?? 0} models</span><h2>{cat.name}</h2></div>
          <ArrowUpRight size={20} className="shrink-0 category-arrow" />
        </Link>
      ))}
    </section>
  );
}

