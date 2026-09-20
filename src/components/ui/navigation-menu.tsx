"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

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

interface AnimatedNavFramerProps {
  items?: NavItem[];
  brandName?: string;
  ctaText?: string;
  ctaHref?: string;
  showBlog?: boolean;
  currentLocale?: string;
}

export function AnimatedNavFramer({
  items,
  brandName = "Noor Solar Energy",
  ctaText = "Book A Call",
  ctaHref = "/contact",
  showBlog = false,
  currentLocale,
}: AnimatedNavFramerProps) {
  const [isExpanded, setExpanded] = React.useState(true);
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const isBn = currentLocale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";
  const isHome = pathname === "/" || pathname === "/bn";

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

  const rawNavItems = items || defaultItems;

  const BN_NAV_NAMES: Record<string, string> = {
    "Services": "সেবাসমূহ",
    "About": "আমাদের সম্পর্কে",
    "Why Us": "কেন আমরা",
    "Process": "কার্যপ্রণালী",
    "Contact": "যোগাযোগ",
    "Solar Panels": "সোলার প্যানেল",
    "Batteries": "ব্যাটারি",
    "Inverters": "ইনভার্টার",
    "All Products": "সকল পণ্য",
    "Blog": "ব্লগ",
  };

  // Localize hrefs and names for current locale
  const navItems = rawNavItems.map((item) => {
    let href = item.href;
    const name = isBn && BN_NAV_NAMES[item.name] ? BN_NAV_NAMES[item.name] : item.name;
    if (isBn) {
      if (href.startsWith("/#")) {
        href = `/bn${href.slice(1)}`;
      } else if (href.startsWith("/") && !href.startsWith("/bn")) {
        href = `/bn${href}`;
      }
    }
    return { ...item, name, href };
  });

  const displayCtaText = isBn && (ctaText === "Book A Call" || !ctaText) ? "যোগাযোগ করুন" : ctaText;
  const finalCtaHref = isBn && !ctaHref.startsWith("/bn") ? `/bn${ctaHref}` : ctaHref;
  const brandHref = isBn ? "/bn" : "/";

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const userExpandedManually = React.useRef(false);
  const [isManuallyOpen, setIsManuallyOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  // High-sensitivity dynamic rotation responsive to mouse scroll
  const rawRotate = useTransform(scrollY, (v) => v * 2.2);
  const smoothRotate = useSpring(rawRotate, {
    stiffness: 400,
    damping: 26,
    mass: 0.35,
  });

  // Handle outside clicks when manually opened while scrolled
  React.useEffect(() => {
    if (!isExpanded || !isManuallyOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setIsManuallyOpen(false);
        userExpandedManually.current = false;
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isExpanded, isManuallyOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // If user clicked to expand while scrolled down, keep open until scrolled > 120px away
    if (userExpandedManually.current) {
      if (Math.abs(latest - scrollPositionOnCollapse.current) > 120) {
        userExpandedManually.current = false;
        setIsManuallyOpen(false);
        setExpanded(false);
      }
      lastScrollY.current = latest;
      return;
    }

    // When near top of page, keep expanded
    if (latest <= 60) {
      if (!isExpanded) {
        setExpanded(true);
        setIsManuallyOpen(false);
      }
    } 
    // When scrolled down, collapse into the rotating logo icon
    else if (latest > 100) {
      if (isExpanded) {
        setExpanded(false);
        setIsManuallyOpen(false);
      }
    }

    lastScrollY.current = latest;
  });

  return (
    <>
      <div data-motion="header-scroll" className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
        <motion.nav
          ref={navRef}
          initial={false}
          animate={{
            width: isExpanded ? "auto" : "52px",
            height: isExpanded ? "auto" : "52px",
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 34,
            mass: 0.5,
          }}
          onClick={() => {
            if (!isExpanded) {
              setExpanded(true);
              setIsManuallyOpen(true);
              userExpandedManually.current = true;
              scrollPositionOnCollapse.current = scrollY.get();
            }
          }}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.94 } : {}}
          className={cn(
            "pointer-events-auto relative flex items-center overflow-hidden rounded-full border border-white/20 bg-slate-950/85 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-colors duration-150 shrink-0 max-w-full",
            !isExpanded
              ? "cursor-pointer justify-center p-0 border-[#CEF23E]/60 bg-slate-950/95 shadow-[0_0_24px_rgba(206,242,62,0.45)]"
              : "px-2 sm:px-2.5 py-1 sm:py-1.5"
          )}
        >
          <AnimatePresence initial={false}>
            {isExpanded ? (
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="flex items-center shrink-0 min-w-0"
              >
                {/* Brand Logo in Header Navbar */}
                <div className="flex-shrink-0 flex items-center pl-1 sm:pl-2 pr-1.5 sm:pr-2.5">
                  <Link href={brandHref} className="flex items-center gap-2 group">
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

                {/* Navigation Links (Desktop) */}
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

                  {/* Desktop Language Switcher */}
                  <div className="hidden md:flex items-center pl-1 pr-1.5 shrink-0">
                    <LanguageSwitcher idPrefix="hdr" currentLocale={currentLocale} />
                  </div>

                  {/* Right CTA Button in Brand Volt Lime */}
                  <div className="pl-1 shrink-0 flex items-center gap-1">
                    <Link
                      href={finalCtaHref}
                      onClick={(e) => e.stopPropagation()}
                      className="group inline-flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-[#CEF23E] hover:bg-[#D4F842] text-[#111311] text-xs font-bold tracking-tight shadow-[0_4px_14px_rgba(206,242,62,0.35)] transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                    >
                      <span>{displayCtaText}</span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#111311] flex items-center justify-center text-[#CEF23E] group-hover:translate-x-0.5 transition-transform shadow-2xs shrink-0">
                        <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    </Link>

                    {/* Close button when manually opened while scrolled */}
                    {isManuallyOpen && (
                      <button
                        type="button"
                        aria-label="Close menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                          setIsManuallyOpen(false);
                          userExpandedManually.current = false;
                        }}
                        className="p-1 sm:p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
                        title={isBn ? "মেনু বন্ধ করুন" : "Close menu"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Hamburger Toggle Button */}
                  <button
                    type="button"
                    aria-label="Toggle mobile menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileOpen((prev) => !prev);
                    }}
                    className="md:hidden ml-1.5 p-1.5 rounded-full text-white hover:text-[#CEF23E] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-icon"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="w-[52px] h-[52px] flex items-center justify-center relative cursor-pointer select-none"
                title={isBn ? "মেনু খুলতে ক্লিক করুন" : "Click to open menu"}
              >
                {/* Subtle spinning glow aura ring */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#CEF23E]/25 via-transparent to-[#CEF23E]/45 animate-[spin_8s_linear_infinite] pointer-events-none" />

                {/* Real-time scroll rotating logo */}
                <motion.div
                  style={{ rotate: smoothRotate }}
                  className="w-8 h-8 flex items-center justify-center will-change-transform pointer-events-none relative z-10"
                >
                  <Image
                    src="/brand/logo-icon.png"
                    alt="Noor Solar Energy"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_12px_rgba(206,242,62,0.7)]"
                    priority
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay with data-motion="mobile-menu" */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-motion="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-20 z-40 md:hidden p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#CEF23E]">
                {isBn ? "ন্যাভিগেশন" : "Navigation"}
              </span>
              <LanguageSwitcher idPrefix="mob" currentLocale={currentLocale} />
            </div>

            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 + 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors",
                      pathname === item.href
                        ? "bg-white/10 text-[#CEF23E]"
                        : "text-slate-200 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                href={finalCtaHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#CEF23E] hover:bg-[#D4F842] text-[#111311] font-bold text-sm shadow-md"
              >
                <span>{displayCtaText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { AnimatedNavFramer as NavigationMenu };
