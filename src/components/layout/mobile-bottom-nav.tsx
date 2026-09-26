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
  MessageCircle,
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

  const whatsappUrl =
    `https://wa.me/8801884611888?text=${encodeURIComponent(isBn ? "আসসালামু আলাইকুম নূর সোলার এনার্জি, আমি সোলার সামগ্রী ও পাইকারি মূল্য সম্পর্কে জানতে চাই।" : "Hello Noor Solar Energy, I would like to inquire about solar equipment and bulk pricing.")}`;
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
      {
        title: "WhatsApp",
        icon: MessageCircle,
        onClick: () => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        },
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
      <div className="pointer-events-auto origin-bottom max-[360px]:scale-90">
        <GlassDock
          items={items}
          activeIndex={activeIndex}
          dockClassName="mobile-dock gap-2.5 rounded-full px-3 py-3"
        />
      </div>
    </nav>
  );
}
