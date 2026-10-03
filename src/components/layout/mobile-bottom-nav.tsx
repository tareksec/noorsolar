"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  Home,
  LayoutGrid,
  BadgePercent,
  Newspaper,
  Phone,
} from "lucide-react";
import { GlassDock, type DockItem } from "@/components/ui/glass-dock";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const isBn = locale === "bn";

  const go = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  const items: DockItem[] = useMemo(
    () => [
      { title: isBn ? "হোম" : "Home", icon: Home, onClick: () => go("/") },
      {
        title: isBn ? "পণ্যসমূহ" : "Products",
        icon: LayoutGrid,
        onClick: () => go("/products"),
      },
      {
        title: isBn ? "হট ডিলস" : "Deals",
        icon: BadgePercent,
        onClick: () => go("/deals"),
      },
      {
        title: isBn ? "ব্লগ ও গাইড" : "Blog",
        icon: Newspaper,
        onClick: () => go("/blog"),
      },
      {
        title: isBn ? "যোগাযোগ" : "Contact",
        icon: Phone,
        onClick: () => go("/contact"),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBn, pathname],
  );

  const activeIndex = useMemo(() => {
    if (
      pathname.includes("/products") ||
      pathname.includes("/product/") ||
      pathname.includes("/category/")
    ) {
      return 1;
    }
    if (pathname.includes("/deals")) {
      return 2;
    }
    if (pathname.includes("/blog")) {
      return 3;
    }
    if (pathname.includes("/contact")) {
      return 4;
    }
    return 0; // Home or default
  }, [pathname]);

  return (
    <nav
      aria-label={isBn ? "মোবাইল নেভিগেশন" : "Mobile navigation"}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-40 flex justify-center px-4 lg:hidden"
    >
      <div className="pointer-events-auto">
        <GlassDock
          items={items}
          activeIndex={activeIndex}
          dockClassName="rounded-full border-[#DCE4E0] bg-white/85 px-5 py-3 shadow-[0_12px_32px_rgba(7,64,49,0.18)]"
        />
      </div>
    </nav>
  );
}
