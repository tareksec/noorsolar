"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export interface NavSubItem {
  name: string;
  nameBn?: string;
  href: string;
  description?: string;
  descriptionBn?: string;
}

export interface NavItem {
  name: string;
  nameBn?: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  badgeBn?: string;
  isThreeIconMenu?: boolean;
  children?: NavSubItem[];
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    name: "Products",
    nameBn: "পণ্য",
    href: "/products",
    children: [
      {
        name: "All Products",
        nameBn: "সকল পণ্য",
        href: "/products",
        description: "Explore complete B2B equipment catalog & specs",
        descriptionBn: "সম্পূর্ণ B2B সরঞ্জাম ক্যাটালগ ও স্পেসিফিকেশন",
      },
      {
        name: "Solar Panels",
        nameBn: "সোলার প্যানেল",
        href: "/category/solar-panels",
        description: "N-Type TOPCon & Bifacial modules (585W–620W)",
        descriptionBn: "এন-টাইপ টপকন ও বাইফেসিয়াল সোলার মডিউল",
      },
      {
        name: "Solar Inverters",
        nameBn: "সোলার ইনভার্টার",
        href: "/category/solar-inverters",
        description: "Industrial three-phase on-grid & hybrid inverters",
        descriptionBn: "থ্রি-ফেজ বাণিজ্যিক অন-গ্রিড ও হাইব্রিড ইনভার্টার",
      },
      {
        name: "Lithium Batteries",
        nameBn: "লিথিয়াম ব্যাটারি",
        href: "/category/lithium-batteries",
        description: "High-voltage LiFePO4 energy storage systems",
        descriptionBn: "হাই-ভোল্টেজ LiFePO4 ব্যাটারি স্টোরেজ সিস্টেম",
      },
    ],
  },
  {
    name: "About",
    nameBn: "আমাদের সম্পর্কে",
    href: "/about",
    children: [
      {
        name: "About Us",
        nameBn: "কোম্পানি পরিচিতি",
        href: "/about",
        description: "Leading Tier-1 solar equipment importer in Bangladesh",
        descriptionBn: "বাংলাদেশের শীর্ষস্থানীয় সোলার সরঞ্জাম আমদানিকারক",
      },
      {
        name: "Certifications",
        nameBn: "সার্টিফিকেশন ও অনুমোদন",
        href: "/certifications",
        description: "BSREA Member, IDCOL approved & ISO certified",
        descriptionBn: "বিএসআরইএ সদস্য, ইডকল ও আন্তর্জাতিক টেস্ট সনদ",
      },
    ],
  },
  {
    name: "More",
    nameBn: "অন্যান্য",
    href: "#",
    isThreeIconMenu: true,
    children: [
      {
        name: "Blog",
        nameBn: "কারিগরি ব্লগ",
        href: "/blog",
        description: "Latest solar technology updates, guides & B2B insights",
        descriptionBn: "সোলার প্রযুক্তির আপডেট, গাইড ও পাইকারি বাজার বিশ্লেষণ",
      },
      {
        name: "Certifications",
        nameBn: "সার্টিফিকেশন ও অনুমোদন",
        href: "/certifications",
        description: "BSREA Member, IDCOL approved & ISO certified",
        descriptionBn: "বিএসআরইএ সদস্য, ইডকল ও আন্তর্জাতিক টেস্ট সনদ",
      },
      {
        name: "Ordering Process",
        nameBn: "অর্ডার প্রক্রিয়া",
        href: "/#process",
        description: "From indent inquiry to safe site delivery",
        descriptionBn: "কোটেশন থেকে ৬৪ জেলায় সরাসরি ডেলিভারি ধাপসমূহ",
      },
      {
        name: "FAQ & Support",
        nameBn: "প্রশ্নোত্তর ও সহায়তা",
        href: "/#faq",
        description: "Frequently asked questions & technical support",
        descriptionBn: "ওয়ারেন্টি, পাইকারি MOQ ও পেমেন্ট সংক্রান্ত প্রশ্নোত্তর",
      },
      {
        name: "Contact Sales Desk",
        nameBn: "সেলস ডেস্কে যোগাযোগ",
        href: "/contact",
        description: "Dhaka headquarters, direct desk & warehouse visits",
        descriptionBn: "উত্তরা হেড অফিস, সেলস ডেস্ক ও সরাসরি ইনভেন্টরি পরিদর্শন",
      },
    ],
  },
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
  ctaText = "Request a Quote",
  ctaHref = "/quote",
  showBlog = false,
  currentLocale,
}: AnimatedNavFramerProps) {
  const [isExpanded, setExpanded] = React.useState(true);
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = React.useState<string | null>("Products");
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  // Close dropdown on outside pointerdown
  React.useEffect(() => {
    const handleOutside = () => setActiveDropdown(null);
    window.addEventListener("pointerdown", handleOutside);
    return () => window.removeEventListener("pointerdown", handleOutside);
  }, []);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setActiveDropdown(null);
  }

  const isBn = currentLocale === "bn" || pathname.startsWith("/bn/") || pathname === "/bn";

  const defaultItems = [
    ...DEFAULT_NAV_ITEMS,
  ];

  const rawNavItems = items || defaultItems;

  const BN_NAV_NAMES: Record<string, string> = {
    "Product": "পণ্য",
    "Products": "পণ্য",
    "All Products": "সকল পণ্য",
    "Solar Panels": "সোলার প্যানেল",
    "Solar Inverters": "সোলার ইনভার্টার",
    "Inverters": "ইনভার্টার",
    "Lithium Batteries": "লিথিয়াম ব্যাটারি",
    "Batteries": "ব্যাটারি",
    "BSREA & Compliance": "বিএসআরইএ সনদ",
    "Certifications": "সার্টিফিকেশন",
    "About": "আমাদের সম্পর্কে",
    "About Us": "কোম্পানি পরিচিতি",
    "More": "অন্যান্য",
    "Blog": "কারিগরি ব্লগ",
    "Ordering Process": "অর্ডার প্রক্রিয়া",
    "FAQ & Support": "প্রশ্নোত্তর ও সহায়তা",
    "Contact Sales Desk": "সেলস ডেস্কে যোগাযোগ",
    "Services": "সেবাসমূহ",
    "Contact": "যোগাযোগ",
    "Quote": "কোটেশন",
    "Quotation": "কোটেশন",
  };

  // Localize hrefs and names for current locale
  const navItems = rawNavItems.map((item) => {
    let href = item.href;
    const name = isBn && item.nameBn ? item.nameBn : (isBn && BN_NAV_NAMES[item.name] ? BN_NAV_NAMES[item.name] : item.name);
    if (isBn) {
      if (href.startsWith("/#")) {
        href = `/bn${href.slice(1)}`;
      } else if (href.startsWith("/") && !href.startsWith("/bn")) {
        href = `/bn${href}`;
      }
    }

    const children = item.children?.map((child) => {
      let childHref = child.href;
      const childName = isBn && child.nameBn ? child.nameBn : (isBn && BN_NAV_NAMES[child.name] ? BN_NAV_NAMES[child.name] : child.name);
      const childDesc = isBn && child.descriptionBn ? child.descriptionBn : child.description;
      if (isBn) {
        if (childHref.startsWith("/#")) {
          childHref = `/bn${childHref.slice(1)}`;
        } else if (childHref.startsWith("/") && !childHref.startsWith("/bn")) {
          childHref = `/bn${childHref}`;
        }
      }
      return {
        ...child,
        name: childName,
        href: childHref,
        description: childDesc,
      };
    });

    return { ...item, name, href, children };
  });

  const displayCtaText = isBn
    ? (ctaText === "Request a Quote" ? "কোটেশন নিন" : ctaText === "Contact Sales" || ctaText === "Book A Call" || !ctaText ? "যোগাযোগ করুন" : ctaText)
    : ctaText;
  const finalCtaHref = isBn && !ctaHref.startsWith("/bn") ? `/bn${ctaHref}` : ctaHref;
  const brandHref = isBn ? "/bn" : "/";

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const userExpandedManually = React.useRef(false);
  const [isManuallyOpen, setIsManuallyOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  // Gentle, calm dynamic rotation responsive to mouse scroll
  const rawRotate = useTransform(scrollY, (v) => v * 0.45);
  const smoothRotate = useSpring(rawRotate, {
    stiffness: 180,
    damping: 25,
    mass: 0.4,
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

  // Mobile menu: body scroll lock and Escape key listener
  React.useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

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
      <div data-motion="header-scroll" className="fixed top-[calc(0.25rem+env(safe-area-inset-top,0px))] sm:top-[calc(0.375rem+env(safe-area-inset-top,0px))] inset-x-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
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
            "pointer-events-auto relative flex items-center rounded-full border border-white/15 bg-[#052F25]/90 backdrop-blur-xl shadow-[0_12px_36px_rgba(5,47,37,0.35)] transition-colors duration-150 shrink-0 max-w-full",
            !isExpanded
              ? "cursor-pointer justify-center p-0 border-white/20 bg-[#052F25]/95 shadow-[0_8px_28px_rgba(5,47,37,0.45)] hover:border-[#FEBE16]/50 overflow-hidden"
              : "px-2 sm:px-2.5 py-1 sm:py-1.5 overflow-visible"
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
                className="flex items-center shrink-0 min-w-0 relative"
              >
                {/* Brand Logo in Header Navbar */}
                <div className="flex-shrink-0 flex items-center pl-1 sm:pl-2 pr-1.5 sm:pr-2.5">
                  <Link href={brandHref} className="flex items-center gap-2 group min-w-[44px] min-h-[44px]">
                    {/* Mobile: compact brand icon */}
                    <div className="flex min-[480px]:hidden items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px]">
                      <Image
                        src="/brand/logo-icon.png"
                        alt={brandName}
                        width={36}
                        height={36}
                        className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
                        unoptimized
                        priority
                      />
                    </div>
                    {/* Desktop / Tablet: full horizontal brand logo */}
                    <div className="hidden min-[480px]:flex items-center min-h-[44px]">
                      <Image
                        src="/brand/logo-white.png"
                        alt="Noor Solar Energy"
                        width={140}
                        height={36}
                        className="h-7 sm:h-8 w-auto object-contain group-hover:opacity-95 transition-opacity"
                        unoptimized
                        priority
                      />
                    </div>
                  </Link>
                </div>

                {/* Navigation Links (Desktop & Landscape) */}
                <div className="flex items-center gap-1 lg:gap-2 pr-1 sm:pr-2">
                  {navItems.map((item) => {
                    const isDirectActive = pathname === item.href || (item.href !== "/" && item.href !== "/bn" && pathname.startsWith(item.href));
                    const isChildActive = item.children?.some(
                      (c) => pathname === c.href || (c.href !== "/" && c.href !== "/bn" && pathname.startsWith(c.href))
                    );
                    const isActive = isDirectActive || isChildActive;
                    const hasChildren = Boolean(item.children && item.children.length > 0);

                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => hasChildren && handleMouseEnter(item.name)}
                        onMouseLeave={() => hasChildren && handleMouseLeave()}
                      >
                        {item.isThreeIconMenu ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === item.name ? null : item.name);
                            }}
                            className={cn(
                              "hidden md:inline-flex items-center min-h-[40px] text-xs lg:text-[13px] font-medium transition-all px-2.5 lg:px-3 py-1.5 rounded-full whitespace-nowrap gap-1.5 cursor-pointer border",
                              isActive || activeDropdown === item.name
                                ? "text-[#FEBE16] font-semibold bg-white/15 border-[#FEBE16]/50 shadow-[0_0_12px_rgba(254,190,22,0.2)]"
                                : "text-slate-200 hover:text-white hover:bg-white/10 border-white/10"
                            )}
                            title={isBn ? "অন্যান্য পেজসমূহ" : "Extra Pages"}
                          >
                            {/* 3-Icon Menu Symbol */}
                            <div className="flex flex-col justify-center items-center gap-[3px] w-4 h-4 text-current">
                              <span className="w-3.5 h-[1.8px] rounded-full bg-current transition-colors" />
                              <span className="w-2.5 h-[1.8px] rounded-full bg-[#FEBE16] transition-colors" />
                              <span className="w-3.5 h-[1.8px] rounded-full bg-current transition-colors" />
                            </div>
                            <span>{item.name}</span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 opacity-70 transition-transform duration-200",
                                activeDropdown === item.name && "rotate-180 opacity-100 text-[#FEBE16]"
                              )}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(null);
                            }}
                            className={cn(
                              "hidden md:inline-flex items-center min-h-[40px] text-xs lg:text-[13px] font-medium transition-all px-3 lg:px-3.5 py-1.5 rounded-full whitespace-nowrap gap-1.5 cursor-pointer",
                              item.highlight
                                ? "font-bold text-[#FEBE16] bg-gradient-to-r from-[#FEBE16]/25 via-[#FEBE16]/15 to-[#FEBE16]/20 border border-[#FEBE16]/50 shadow-[0_0_14px_rgba(254,190,22,0.28)] hover:shadow-[0_0_22px_rgba(254,190,22,0.45)] hover:border-[#FEBE16] hover:scale-[1.02] active:scale-95"
                                : isActive
                                ? "text-[#FEBE16] font-semibold bg-white/10"
                                : "text-slate-200 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {item.highlight && (
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEBE16] opacity-85" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FEBE16]" />
                              </span>
                            )}
                            <span>{item.name}</span>
                            {item.highlight && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FEBE16] text-[#052F25] leading-none shadow-xs">
                                {isBn ? (item.badgeBn || "ক্যাটালগ") : (item.badge || "Catalog")}
                              </span>
                            )}
                            {hasChildren && (
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 opacity-70 transition-transform duration-200",
                                  activeDropdown === item.name && "rotate-180 opacity-100 text-[#FEBE16]"
                                )}
                              />
                            )}
                          </Link>
                        )}

                        {/* Desktop Dropdown Flyout Card */}
                        {hasChildren && (
                          <AnimatePresence>
                            {activeDropdown === item.name && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className={cn(
                                  "absolute top-[calc(100%+8px)] z-50 min-w-[290px] p-2 rounded-2xl bg-[#052F25]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-1",
                                  item.highlight ? "left-0" : item.isThreeIconMenu ? "right-0" : "left-1/2 -translate-x-1/2"
                                )}
                              >
                                {item.children!.map((child) => {
                                  const isSelected = pathname === child.href;
                                  return (
                                    <Link
                                      key={child.name}
                                      href={child.href}
                                      onClick={() => setActiveDropdown(null)}
                                      className={cn(
                                        "group/sub flex flex-col p-2.5 rounded-xl transition-all",
                                        isSelected
                                          ? "bg-white/15 text-[#FEBE16]"
                                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                                      )}
                                    >
                                      <div className="flex items-center justify-between text-xs lg:text-[13px] font-bold">
                                        <span className="group-hover/sub:text-[#FEBE16] transition-colors">{child.name}</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-[#FEBE16]" />
                                      </div>
                                      {child.description && (
                                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 group-hover/sub:text-slate-300 font-normal">
                                          {child.description}
                                        </span>
                                      )}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>

                  {/* Desktop Language Switcher */}
                  <div className="hidden md:flex items-center pl-1 pr-1.5 shrink-0">
                    <LanguageSwitcher idPrefix="hdr" currentLocale={currentLocale} />
                  </div>

                  {/* Right CTA Button in Brand Solar Gold */}
                  <div className="pl-1 shrink-0 flex items-center gap-1">
                    <Link
                      href={finalCtaHref}
                      onClick={(e) => e.stopPropagation()}
                      data-motion="button-slide"
                      className="btn-slide-fill group inline-flex items-center min-h-[44px] gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] text-xs font-bold tracking-tight shadow-[0_4px_14px_rgba(254,190,22,0.35)] transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                    >
                      <span>{displayCtaText}</span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#052F25] flex items-center justify-center text-[#FEBE16] group-hover:translate-x-0.5 transition-transform shadow-2xs shrink-0">
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
                        className="w-11 h-11 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
                        title={isBn ? "মেনু বন্ধ করুন" : "Close menu"}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Hamburger Toggle Button - min 44x44px tap target */}
                  <button
                    type="button"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileOpen((prev) => !prev);
                    }}
                    className="md:hidden ml-1 w-11 h-11 flex items-center justify-center rounded-full text-white hover:text-[#FEBE16] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBE16]"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
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
                {/* Real-time scroll rotating brand mark without color distortion */}
                <motion.div
                  style={{ rotate: smoothRotate }}
                  className="w-8 h-8 flex items-center justify-center will-change-transform pointer-events-none relative z-10"
                >
                  <Image
                    src="/brand/logo-icon.png"
                    alt="Noor Solar Energy"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    unoptimized
                    priority
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Menu Backdrop for Tap Outside */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay with data-motion="mobile-menu" */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-motion="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-50 md:hidden p-5 rounded-3xl bg-[#052F25]/95 backdrop-blur-2xl border border-white/15 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FEBE16]">
                {isBn ? "ন্যাভিগেশন" : "Navigation"}
              </span>
              <LanguageSwitcher idPrefix="mob" currentLocale={currentLocale} />
            </div>

            <div className="flex flex-col gap-2 pt-4 max-h-[calc(80vh-8rem)] overflow-y-auto no-scrollbar">
              {navItems.map((item, idx) => {
                const isDirectActive = pathname === item.href || (item.href !== "/" && item.href !== "/bn" && pathname.startsWith(item.href));
                const isChildActive = item.children?.some(
                  (c) => pathname === c.href || (c.href !== "/" && c.href !== "/bn" && pathname.startsWith(c.href))
                );
                const isActive = isDirectActive || isChildActive;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpandedMobile = mobileAccordion === item.name;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 + 0.05 }}
                    className="flex flex-col"
                  >
                    {hasChildren ? (
                      <div className="flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <div
                          onClick={() => setMobileAccordion((prev) => (prev === item.name ? null : item.name))}
                          className={cn(
                            "flex items-center justify-between min-h-[46px] px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer select-none",
                            item.highlight
                              ? "text-[#FEBE16] bg-gradient-to-r from-[#FEBE16]/20 via-[#FEBE16]/10 to-transparent"
                              : isActive
                              ? "text-[#FEBE16]"
                              : "text-slate-200 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {item.isThreeIconMenu && (
                              <div className="flex flex-col justify-center items-center gap-[2.5px] w-3.5 h-3.5 text-current shrink-0">
                                <span className="w-3.5 h-[1.6px] rounded-full bg-current" />
                                <span className="w-2.5 h-[1.6px] rounded-full bg-[#FEBE16]" />
                                <span className="w-3.5 h-[1.6px] rounded-full bg-current" />
                              </div>
                            )}
                            {item.highlight && (
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEBE16] opacity-85" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FEBE16]" />
                              </span>
                            )}
                            <span className={item.highlight ? "font-bold text-[#FEBE16]" : ""}>{item.name}</span>
                            {item.highlight && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FEBE16] text-[#052F25] shadow-xs">
                                {isBn ? (item.badgeBn || "ক্যাটালগ") : (item.badge || "Catalog")}
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
                              isExpandedMobile && "rotate-180 text-[#FEBE16]"
                            )}
                          />
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpandedMobile && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col px-2.5 pb-2.5 pt-1 gap-1 border-t border-white/10"
                            >
                              {item.children!.map((child) => {
                                const isSelected = pathname === child.href;
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                      "flex flex-col py-2 px-3 rounded-xl transition-colors",
                                      isSelected
                                        ? "bg-[#FEBE16]/20 text-[#FEBE16]"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs sm:text-sm">{child.name}</span>
                                      <ArrowRight className="w-3 h-3 text-[#FEBE16] opacity-60" />
                                    </div>
                                    {child.description && (
                                      <span className="text-[10px] text-slate-400 mt-0.5">{child.description}</span>
                                    )}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all",
                          isActive
                            ? "bg-white/10 text-[#FEBE16]"
                            : "text-slate-200 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                href={finalCtaHref}
                onClick={() => setMobileOpen(false)}
                data-motion="button-slide"
                className="btn-slide-fill flex items-center justify-center gap-2 w-full min-h-[48px] py-3 rounded-full bg-[#FEBE16] hover:bg-[#E4A900] text-[#052F25] font-bold text-sm shadow-md"
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
