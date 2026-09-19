"use client";

import React, { useRef, useState } from "react";
import { Zap, Cpu } from "lucide-react";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<SVGGElement>(null);
  const batteryRef = useRef<SVGGElement>(null);
  const inverterRef = useRef<SVGGElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("@/lib/gsap").then(({ gsap }) => {
      gsap.to(panelRef.current, {
        y: "+=6",
        rotation: "+=0.4",
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(batteryRef.current, {
        y: "-=7",
        rotation: "-=0.5",
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      gsap.to(inverterRef.current, {
        y: "+=5",
        rotation: "+=0.3",
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.1,
      });

      gsap.to(card1Ref.current, {
        y: "-=5",
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2,
      });

      gsap.to(card2Ref.current, {
        y: "+=6",
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });
    });
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // Touch devices do not tilt
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handlePointerLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Parallax transforms per layer depth (Desktop mouse pointer only)
  const panelParallax = {
    transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0px) rotateX(${
      -mousePos.y * 3
    }deg) rotateY(${mousePos.x * 3}deg)`,
    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const batteryParallax = {
    transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0px) rotateX(${
      -mousePos.y * 5
    }deg) rotateY(${mousePos.x * 5}deg)`,
    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const inverterParallax = {
    transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 18}px, 0px) rotateX(${
      -mousePos.y * 7
    }deg) rotateY(${mousePos.x * 7}deg)`,
    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const card1Parallax = {
    transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0px)`,
    transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const card2Parallax = {
    transform: `translate3d(${mousePos.x * 26}px, ${mousePos.y * 26}px, 0px)`,
    transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[560px] aspect-[4/3] mx-auto select-none perspective-[1000px] flex items-center justify-center"
      aria-label="Layered glass composition of high-efficiency solar panel, lithium battery rack, and hybrid inverter"
    >
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(206,242,62,0.18)_0%,transparent_70%)] -z-10 pointer-events-none" />

      {/* Main Layered SVG Canvas */}
      <div className="w-full h-full relative flex items-center justify-center">
        <svg
          viewBox="0 0 680 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Panel Glass Gradients */}
            <linearGradient id="hv-panel-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C2621" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#0E1410" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#070A08" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hv-lime-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CEF23E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#CEF23E" stopOpacity="0.1" />
            </linearGradient>

            {/* Inverter Gloss Gradient */}
            <linearGradient id="hv-inverter-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5F7F5" />
              <stop offset="100%" stopColor="#E2E6E2" />
            </linearGradient>
          </defs>

          {/* LAYER 1: N-Type Solar Panel (Background Layer, angled back right) */}
          <g ref={panelRef} id="hero-layer-panel" style={panelParallax}>
            {/* Panel Aluminum Alloy Frame */}
            <rect
              x="160"
              y="60"
              width="360"
              height="440"
              rx="18"
              fill="#222723"
              stroke="#3A403A"
              strokeWidth="3"
              transform="rotate(6 340 280) skewY(-2)"
            />
            {/* Dark Photovoltaic Monocrystalline Wafer Substrate */}
            <rect
              x="172"
              y="72"
              width="336"
              height="416"
              rx="12"
              fill="url(#hv-panel-glass)"
              transform="rotate(6 340 280) skewY(-2)"
            />
            {/* Subtle Volt-Lime Highlight Trim */}
            <rect
              x="172"
              y="72"
              width="336"
              height="416"
              rx="12"
              fill="none"
              transform="rotate(6 340 280) skewY(-2)"
              stroke="url(#hv-lime-edge)"
              strokeWidth="2.5"
            />
            {/* Grid Busbars (16BB Half-Cut Silicon Cells Pattern) */}
            <g opacity="0.35" stroke="#FFFFFF" strokeWidth="0.75">
              <line x1="256" y1="75" x2="256" y2="485" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="340" y1="75" x2="340" y2="485" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="424" y1="75" x2="424" y2="485" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="172" y1="150" x2="508" y2="150" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="172" y1="230" x2="508" y2="230" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="172" y1="310" x2="508" y2="310" transform="rotate(6 340 280) skewY(-2)" />
              <line x1="172" y1="390" x2="508" y2="390" transform="rotate(6 340 280) skewY(-2)" />
            </g>
          </g>

          {/* LAYER 2: Lithium Battery Server Rack Unit (Middle Layer, angled left-center) */}
          <g ref={batteryRef} id="hero-layer-battery" style={batteryParallax}>
            {/* Rack Chassis Enclosure */}
            <rect
              x="70"
              y="270"
              width="300"
              height="160"
              rx="14"
              fill="#181B18"
              stroke="#2E332E"
              strokeWidth="2"
              transform="rotate(-5 220 350)"
            />
            {/* Front Panel Inset */}
            <rect
              x="82"
              y="282"
              width="276"
              height="136"
              rx="8"
              fill="#111311"
              transform="rotate(-5 220 350)"
            />
            {/* 3U Rack Mount Ears & Handles */}
            <rect x="62" y="310" width="8" height="80" rx="3" fill="#5C605C" transform="rotate(-5 220 350)" />
            <rect x="370" y="310" width="8" height="80" rx="3" fill="#5C605C" transform="rotate(-5 220 350)" />
            {/* Battery Status LED Bar (Volt Lime) */}
            <rect x="100" y="310" width="90" height="6" rx="3" fill="#2E332E" transform="rotate(-5 220 350)" />
            <rect x="100" y="310" width="75" height="6" rx="3" fill="#CEF23E" transform="rotate(-5 220 350)" />
            {/* DC Breaker Switch */}
            <rect x="220" y="302" width="28" height="22" rx="4" fill="#000000" stroke="#3A403A" transform="rotate(-5 220 350)" />
            <rect x="226" y="307" width="16" height="12" rx="2" fill="#CEF23E" transform="rotate(-5 220 350)" />
            {/* Power Terminals (Positive Red & Negative Black) */}
            <circle cx="285" cy="314" r="10" fill="#B91C1C" stroke="#450A0A" strokeWidth="2" transform="rotate(-5 220 350)" />
            <circle cx="325" cy="314" r="10" fill="#1F2937" stroke="#111827" strokeWidth="2" transform="rotate(-5 220 350)" />
            {/* Ventilation Hex Grille Slots */}
            <g opacity="0.4" stroke="#5C605C" strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="100" y1="360" x2="340" y2="360" transform="rotate(-5 220 350)" />
              <line x1="100" y1="380" x2="340" y2="380" transform="rotate(-5 220 350)" />
              <line x1="100" y1="400" x2="340" y2="400" transform="rotate(-5 220 350)" />
            </g>
          </g>

          {/* LAYER 3: Hybrid Solar Inverter (Foreground Layer, front center-right) */}
          <g ref={inverterRef} id="hero-layer-inverter" style={inverterParallax}>
            {/* Clean White Architectural Casing */}
            <rect
              x="250"
              y="170"
              width="220"
              height="330"
              rx="24"
              fill="url(#hv-inverter-body)"
              stroke="#DDE1DC"
              strokeWidth="2"
            />
            {/* Side Cooling Heat Sink Fins */}
            <rect x="238" y="240" width="12" height="180" rx="3" fill="#9FA59F" opacity="0.7" />
            <rect x="470" y="240" width="12" height="180" rx="3" fill="#9FA59F" opacity="0.7" />
            {/* Glossy Black Display Portal */}
            <rect
              x="278"
              y="210"
              width="164"
              height="110"
              rx="16"
              fill="#111311"
              stroke="#2E332E"
              strokeWidth="1.5"
            />
            {/* Glowing Circular State Halo (Volt Lime) */}
            <circle cx="360" cy="255" r="26" stroke="#CEF23E" strokeWidth="3.5" strokeDasharray="120 40" />
            <circle cx="360" cy="255" r="18" fill="#CEF23E" fillOpacity="0.15" />
            {/* Central Power Metric Display Text */}
            {/* Central Power Metric Display LED */}
            <rect x="352" y="251" width="16" height="8" rx="2" fill="#CEF23E" />
            {/* Bottom Status LED Indicators */}
            <circle cx="310" cy="460" r="4" fill="#CEF23E" />
            <circle cx="330" cy="460" r="4" fill="#111311" opacity="0.3" />
            <circle cx="350" cy="460" r="4" fill="#111311" opacity="0.3" />
            {/* DC Switch Disconnector */}
            <rect x="410" y="448" width="32" height="24" rx="6" fill="#111311" />
            <line x1="426" y1="454" x2="426" y2="466" stroke="#CEF23E" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Floating Glass Info Card 1: Panel Metric (Top Left) */}
      <div
        ref={card1Ref}
        style={card1Parallax}
        className="absolute -top-2 left-2 sm:-left-3 p-3 sm:p-3.5 rounded-2xl glass-card bg-white/90 border border-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] backdrop-blur-md max-w-[190px] pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#111311] text-[#CEF23E] flex items-center justify-center shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#111311] tracking-tight">
            TOPCon 620W
          </span>
        </div>
        <p className="text-[11px] text-[#5C605C] font-mono leading-tight">
          22.6% N-Type Bifacial
        </p>
      </div>

      {/* Floating Glass Info Card 2: Battery Metric (Bottom Right) */}
      <div
        ref={card2Ref}
        style={card2Parallax}
        className="absolute -bottom-3 right-2 sm:-right-4 p-3 sm:p-3.5 rounded-2xl glass-card bg-white/90 border border-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] backdrop-blur-md min-w-[180px] pointer-events-none"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#CEF23E] text-[#111311] flex items-center justify-center shrink-0">
              <Zap className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#111311]">
              LiFePO4 ESS
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#111311] bg-[#CEF23E] px-1.5 py-0.5 rounded-full font-bold">
            6000+ CYC
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#EDEDED] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#CEF23E] to-[#B8DC2F] w-[92%]" />
        </div>
        <span className="text-[10px] font-mono text-[#5C605C] mt-1 block">
          48V – 51.2V Prismatic Banks
        </span>
      </div>
    </div>
  );
}
