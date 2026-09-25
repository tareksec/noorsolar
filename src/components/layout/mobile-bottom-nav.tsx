"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { AnimatedTabBar, type TabItem } from "@/components/ui/animated-tab-bar";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const isBn = locale === "bn";

  const tabItems: TabItem[] = useMemo(
    () => [
      {
        color: "#FEBE16",
        label: isBn ? "হোম" : "Home",
        icon: (
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        color: "#CEF23E",
        label: isBn ? "পণ্যসমূহ" : "Products",
        icon: (
          <svg className="icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        color: "#f54888",
        label: isBn ? "হট ডিলস" : "Deals",
        icon: (
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        ),
      },
      {
        color: "#38BDF8",
        label: isBn ? "ব্লগ ও গাইড" : "Blog",
        icon: (
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="9" y1="7" x2="16" y2="7" />
            <line x1="9" y1="11" x2="14" y2="11" />
          </svg>
        ),
      },
      {
        color: "#25D366",
        label: isBn ? "যোগাযোগ" : "Contact",
        icon: (
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        ),
      },
    ],
    [isBn],
  );

  const activeIndex = useMemo(() => {
    if (pathname.includes("/products") || pathname.includes("/product/") || pathname.includes("/category/")) {
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

  const handleTabChange = (index: number) => {
    if (index === 0) {
      if (pathname === "/" || pathname === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else if (index === 1) {
      if (pathname === "/products") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/products");
      }
    } else if (index === 2) {
      if (pathname === "/deals") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/deals");
      }
    } else if (index === 3) {
      if (pathname === "/blog") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/blog");
      }
    } else if (index === 4) {
      if (pathname === "/contact") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/contact");
      }
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
      <div className="pointer-events-auto w-full max-w-lg mx-auto">
        <AnimatedTabBar
          items={tabItems}
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
