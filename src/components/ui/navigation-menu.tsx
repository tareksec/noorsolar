"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Services", href: "/#services" },
  { name: "About", href: "/about" },
  { name: "Why Us", href: "/#why-choose-us" },
  { name: "Process", href: "/#process" },
  { name: "Contact", href: "/contact" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

interface AnimatedNavFramerProps {
  items?: NavItem[];
  brandName?: string;
  ctaText?: string;
  ctaHref?: string;
  showBlog?: boolean;
}

export function AnimatedNavFramer({
  items,
  brandName = "Noor Solar Energy",
  ctaText = "Book A Call",
  ctaHref = "/contact",
  showBlog = false,
}: AnimatedNavFramerProps) {
  const [isExpanded, setExpanded] = React.useState(true);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const defaultItems = isHome
    ? [
        ...DEFAULT_NAV_ITEMS,
        ...(showBlog ? [{ name: "Blog", href: "/blog" }] : []),
      ]
    : [
        { name: "Solar Panels", href: "/category/solar-panels" },
        { name: "Batteries", href: "/category/lithium-batteries" },
        { name: "Inverters", href: "/category/solar-inverters" },
        { name: "All Products", href: "/products" },
        ...(showBlog ? [{ name: "Blog", href: "/blog" }] : []),
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
      ];

  const navItems = items || defaultItems;

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    // Collapse when scrolling down past 150px
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } 
    // Expand when scrolling up by threshold
    else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4">
      <motion.nav
        layout
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          width: isExpanded ? "auto" : "3.25rem",
          height: "3.25rem",
        }}
        transition={{
          type: "spring",
          damping: 22,
          stiffness: 280,
        }}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "pointer-events-auto flex items-center overflow-hidden rounded-full border border-white/15 bg-slate-950/85 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors shrink-0 max-w-full",
          !isExpanded
            ? "cursor-pointer justify-center p-0 border-[#CEF23E]/40 bg-slate-950/95 shadow-[0_0_24px_rgba(206,242,62,0.35)]"
            : "px-2 sm:px-2.5"
        )}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center shrink-0 min-w-0"
            >
              {/* Brand Logo in Header Navbar */}
              <div className="flex-shrink-0 flex items-center pl-1.5 sm:pl-2 pr-2 sm:pr-3">
                <Link href="/" className="flex items-center gap-2 group">
                  {/* Mobile: compact brand icon */}
                  <div className="flex min-[480px]:hidden items-center justify-center w-8 h-8">
                    <Image
                      src="/brand/logo-icon.png"
                      alt={brandName}
                      width={32}
                      height={32}
                      className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                      priority
                    />
                  </div>
                  {/* Desktop / Tablet: full horizontal brand logo */}
                  <div className="hidden min-[480px]:flex items-center">
                    <Image
                      src="/brand/logo-white.png"
                      alt="Noor Solar Energy"
                      width={140}
                      height={36}
                      className="h-7 sm:h-8 w-auto object-contain group-hover:opacity-95 transition-opacity"
                      priority
                    />
                  </div>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 pr-1 sm:pr-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "hidden md:inline-flex text-xs lg:text-sm font-medium transition-colors px-2 lg:px-3 py-1.5 rounded-full whitespace-nowrap",
                        isActive
                          ? "text-[#CEF23E] font-semibold bg-white/10"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Right CTA Button in Brand Volt Lime */}
                <div className="pl-1 sm:pl-2 shrink-0">
                  <Link
                    href={ctaHref}
                    onClick={(e) => e.stopPropagation()}
                    className="group inline-flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-[#CEF23E] hover:bg-[#D4F842] text-[#111311] text-xs font-bold tracking-tight shadow-[0_4px_14px_rgba(206,242,62,0.35)] transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <span>{ctaText}</span>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#111311] flex items-center justify-center text-[#CEF23E] group-hover:translate-x-0.5 transition-transform shadow-2xs shrink-0">
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-icon"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex items-center justify-center p-2"
            >
              <Image
                src="/brand/logo-icon.png"
                alt="Noor Solar Energy"
                width={28}
                height={28}
                className="w-6 h-6 object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

export { AnimatedNavFramer as NavigationMenu };
