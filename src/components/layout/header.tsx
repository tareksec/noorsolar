"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sun, Phone } from "lucide-react";
interface HeaderProps { phoneDisplay?: string; phoneRaw?: string }
const links = [
  { label: "All equipment", href: "/products" },
  { label: "Solar panels", href: "/category/solar-panels" },
  { label: "Batteries", href: "/category/lithium-batteries" },
  { label: "Inverters", href: "/category/solar-inverters" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
export function Header({ phoneDisplay, phoneRaw }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  return <header ref={root} className="fixed top-0 inset-x-0 z-40 py-3 sm:py-4 pointer-events-none">
    <div className="page-shell"><div className="pointer-events-auto flex items-center justify-between gap-3 rounded-full border border-white bg-[#F5F6F1]/95 backdrop-blur-xl px-4 sm:px-5 py-3 shadow-[0_8px_32px_-16px_#11131130]">
      <Link href="/" aria-label="Noor Solar Energy home" onClick={() => setOpen(false)} className="flex items-center gap-2.5 shrink-0 rounded-full">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CEF23E]"><Sun size={20} /></span>
        <span><span className="block text-[13px] sm:text-sm font-bold tracking-tight leading-none">NOOR SOLAR</span><span className="block font-mono text-[8px] sm:text-[9px] tracking-[.18em] text-[#5C605C] mt-1">ENERGY · BANGLADESH</span></span>
      </Link>
      <nav aria-label="Main navigation" className="hidden lg:flex gap-1">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
        className={"rounded-full py-2 px-2.5 xl:px-3 text-xs transition-colors " + (pathname === link.href ? "bg-[#E4E7E4]" : "hover:bg-white")}>{link.label}</Link>)}</nav>
      <div className="flex items-center gap-2 shrink-0"><Link href="/contact#quote-section" onClick={() => setOpen(false)} className="button button-dark !min-h-10 !px-3 sm:!px-5 !py-2 !text-xs"><span className="hidden sm:inline">Request a quote</span><span className="sm:hidden">Quote</span><ArrowUpRight size={14} className="text-[#CEF23E] hidden sm:block" /></Link>
      <button ref={toggle} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-full hover:bg-[#E4E7E4]">{open ? <X size={21} /> : <Menu size={21} />}</button></div>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="pointer-events-auto lg:hidden rounded-3xl mt-2 p-4 bg-[#F5F6F1] border border-white shadow-xl max-h-[calc(100dvh-100px)] overflow-y-auto">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined} className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-[#E4E7E4]">{link.label}</Link>)}<a href={"tel:" + phoneRaw} className="flex items-center gap-3 px-4 py-4 border-t border-[#DDE1DC] mt-3 text-sm"><Phone size={16} />{phoneDisplay}</a></nav>}
    </div>
  </header>;
}

