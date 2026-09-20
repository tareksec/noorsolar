"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  phoneDisplay?: string;
  phoneRaw?: string;
}

export function Header({
  phoneDisplay = "+880 1700-000000",
  phoneRaw = "+8801700000000",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      // Hide header when scrolling down more than 100px, return when scrolling up
      if (currentY > 100 && currentY > lastScrollY.current && !mobileMenuOpen) {
        setHidden(true);
      } else if (currentY < lastScrollY.current || currentY <= 50) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: "Solar Panels", href: "/category/solar-panels" },
    { label: "Batteries", href: "/category/lithium-batteries" },
    { label: "Inverters", href: "/category/solar-inverters" },
    { label: "All Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      data-motion="header-scroll"
      className={`fixed top-0 left-0 right-0 z-40 transition-[transform,padding,background-color] duration-300 ease-out will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "py-2 bg-[rgba(228,231,228,0.9)] backdrop-blur-md border-b border-[rgba(255,255,255,0.7)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          : "py-4 sm:py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between px-3 sm:px-6 rounded-full glass-panel transition-[height,padding] duration-300 min-w-0 ${
            scrolled ? "h-12 sm:h-13" : "h-14"
          }`}
        >
          {/* Brand Logo & Avatar */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] rounded-full pr-1 sm:pr-2 min-w-0 shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#CEF23E] flex items-center justify-center font-bold text-[#111311] shadow-[0_2px_10px_rgba(206,242,62,0.4)] transition-transform group-hover:scale-105">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#111311]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-base tracking-tight text-[#111311] leading-none truncate">
                NOOR SOLAR
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#5C605C] mt-0.5">
                ENERGY BD
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] ${
                    isActive
                      ? "bg-[#111311] text-white shadow-sm"
                      : "text-[#111311] hover:text-black hover:bg-[rgba(255,255,255,0.6)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Phone & Quote CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-1.5 text-xs font-mono text-[#5C605C] hover:text-[#111311] transition-colors px-2 py-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#111311]" />
              <span>{phoneDisplay}</span>
            </a>

            <Link
              href="/#quote-section"
              data-motion="button-slide"
              className="btn-slide-fill group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111311] text-white text-[13px] font-medium tracking-tight transition-all duration-200 hover:bg-[#222622] hover:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.2)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E]"
            >
              <span>Request Quote</span>
              <span className="btn-arrow-swap">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#CEF23E] arrow-primary" />
                <ArrowUpRight className="w-3.5 h-3.5 text-[#CEF23E] arrow-secondary" />
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <Link
              href="/#quote-section"
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#CEF23E] text-[#111311] text-[11px] sm:text-xs font-semibold tracking-tight shrink-0 whitespace-nowrap sm:hidden"
            >
              Quote
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-full text-[#111311] hover:bg-[rgba(255,255,255,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEF23E] shrink-0 cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Full-Screen Overlay with Staggered Link Reveals */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            data-motion="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-x-4 top-20 z-50 p-6 rounded-3xl glass-card bg-white/98 backdrop-blur-2xl border border-white shadow-2xl overflow-hidden"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                },
                closed: {
                  transition: { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
              className="flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 8 },
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 rounded-2xl text-base font-semibold text-[#111311] hover:bg-[#EDEDED] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 8 },
                }}
                className="pt-4 border-t border-[#DDE1DC] mt-2 flex flex-col gap-3"
              >
                <a
                  href={`tel:${phoneRaw}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EDEDED] text-xs font-mono text-[#111311]"
                >
                  <Phone className="w-4 h-4 text-[#111311]" />
                  <span>{phoneDisplay}</span>
                </a>
                <Link
                  href="/#quote-section"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#111311] text-white text-sm font-medium"
                >
                  <span>Request Commercial Quote</span>
                  <ArrowUpRight className="w-4 h-4 text-[#CEF23E]" />
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
