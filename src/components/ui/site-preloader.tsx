"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Activity,
  Cpu,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const PIPELINE_STAGES = [
  {
    id: "pv_modules",
    step: "01",
    short: "Modules",
    title: "Solar Photovoltaics",
    tech: "TOPCon 620W N-Type",
    icon: Sun,
    threshold: 25,
  },
  {
    id: "inverters",
    step: "02",
    short: "Inverters",
    title: "Hybrid Inverters",
    tech: "3-Phase MPPT 99.2%",
    icon: Zap,
    threshold: 55,
  },
  {
    id: "bess_storage",
    step: "03",
    short: "Storage",
    title: "BESS Storage",
    tech: "LiFePO4 51.2V Rack",
    icon: BatteryCharging,
    threshold: 85,
  },
  {
    id: "grid_sync",
    step: "04",
    short: "Grid Sync",
    title: "Grid Interconnect",
    tech: "50.00 Hz Synchronized",
    icon: ShieldCheck,
    threshold: 100,
  },
];

export function SitePreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  // Active stage based on progress
  const activeIdx = useMemo(() => {
    if (progress < 25) return 0;
    if (progress < 55) return 1;
    if (progress < 85) return 2;
    return 3;
  }, [progress]);

  // Smooth futuristic progression (~1.3s total)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Dynamic easing: slightly slower at milestones, fast charging through
      const stepInc = current < 30 ? 3 : current < 75 ? 4 : 3;
      current = Math.min(100, current + stepInc);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 320);
      }
    }, 36);

    return () => clearInterval(interval);
  }, []);

  // Subtle route change indicator
  useEffect(() => {
    setNavigating(true);
    const timer = setTimeout(() => setNavigating(false), 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  const ActiveIcon = PIPELINE_STAGES[activeIdx].icon;
  const currentVoltage = Math.round((progress / 100) * 840);
  const currentPowerKw = ((progress / 100) * 620).toFixed(1);

  return (
    <>
      {/* ================= TOP NAVIGATION PROGRESS INDICATOR ================= */}
      <AnimatePresence>
        {navigating && !loading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "0%" }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-[#CEF23E] to-[#B8DC2F] z-[9999] shadow-[0_0_20px_rgba(206,242,62,0.9)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ================= UPGRADED SOLAR REACTOR PRELOADER ================= */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="site-preloader"
            initial={{ opacity: 1 }}
            exit={{
              y: "-100%",
              transition: {
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#060806] text-white select-none overflow-hidden"
          >
            {/* Ambient Background Solar Flares & Ion Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CEF23E]/12 rounded-full blur-[200px] pointer-events-none z-0" />
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[180px] pointer-events-none z-0" />
            <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-[#CEF23E]/8 rounded-full blur-[170px] pointer-events-none z-0" />

            {/* High-Tech Laser Mesh Background Grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
              style={{
                backgroundImage: `radial-gradient(#CEF23E 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            {/* HUD Corner Tech Brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#CEF23E]/40 pointer-events-none z-10" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#CEF23E]/40 pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#CEF23E]/40 pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#CEF23E]/40 pointer-events-none z-10" />

            {/* ================= TOP TELEMETRY BAR ================= */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-5 sm:pt-7 flex items-center justify-between">
              {/* Brand & System Status */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E] shadow-[0_0_12px_#CEF23E]" />
                  <span className="absolute w-5 h-5 rounded-full bg-[#CEF23E]/40 animate-ping" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                      Noor Solar Energy
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#CEF23E]/15 text-[#CEF23E] border border-[#CEF23E]/30">
                      LIVE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    B2B Commercial & Industrial Importer BD
                  </span>
                </div>
              </div>

              {/* Real-time Grid Telemetry Chips (Desktop) */}
              <div className="hidden md:flex items-center gap-3 text-[11px] font-mono">
                <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 flex items-center gap-2 backdrop-blur-sm">
                  <Activity className="w-3.5 h-3.5 text-[#CEF23E] animate-pulse" />
                  <span>GRID SYNC: <strong className="text-white">50.00 Hz</strong></span>
                </div>
                <div className="px-3 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 flex items-center gap-2 backdrop-blur-sm">
                  <Radio className="w-3.5 h-3.5" />
                  <span>DC BUS: <strong className="text-white tabular-nums">{currentVoltage} V</strong></span>
                </div>
                <div className="px-3 py-1.5 rounded-full border border-[#CEF23E]/30 bg-[#CEF23E]/10 text-[#CEF23E] flex items-center gap-2 backdrop-blur-sm font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>CAPACITY: <strong className="text-white tabular-nums">{currentPowerKw} kW</strong></span>
                </div>
              </div>

              {/* Digital Percentage Readout */}
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-3xl sm:text-4xl font-black text-[#CEF23E] tracking-tight tabular-nums drop-shadow-[0_0_18px_rgba(206,242,62,0.6)]">
                  {String(progress).padStart(2, "0")}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">
                  %
                </span>
              </div>
            </header>

            {/* ================= CENTER: SOLAR REACTOR CORE & PIPELINE ================= */}
            <main className="relative z-20 flex flex-col items-center justify-center my-auto px-4 text-center max-w-xl mx-auto w-full py-2">
              
              {/* Kinetic Multi-Layer Solar Reactor Core */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3 sm:mb-4 flex items-center justify-center">
                {/* 1. Outermost Orbital Ring with Cardinal HUD Ticks */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#CEF23E]/40"
                >
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#CEF23E] bg-[#060806] px-1 font-bold">
                    000°
                  </span>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-500 bg-[#060806] px-1">
                    180°
                  </span>
                  <span className="absolute top-1/2 -left-2 -translate-y-1/2 text-[8px] font-mono text-slate-500 bg-[#060806] px-0.5">
                    270°
                  </span>
                  <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-[8px] font-mono text-slate-500 bg-[#060806] px-0.5">
                    090°
                  </span>
                </motion.div>

                {/* 2. Counter-Rotating Dual-Tone Photon Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-2 sm:inset-2.5 rounded-full border-2 border-transparent border-t-[#CEF23E] border-r-[#CEF23E]/50 border-b-sky-400"
                />

                {/* 3. Orbiting Photon Spark */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="absolute inset-1 sm:inset-1.5"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CEF23E] shadow-[0_0_12px_#CEF23E] absolute -top-1 left-1/2 -translate-x-1/2" />
                </motion.div>

                {/* 4. Radial Magnetic Energy Halo */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    opacity: [0.35, 0.75, 0.35],
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-4 sm:inset-5 rounded-full bg-gradient-to-tr from-[#CEF23E]/20 to-sky-400/20 blur-md"
                />

                {/* 5. Central High-Voltage Core Sphere */}
                <motion.div
                  animate={{ scale: [0.98, 1.03, 0.98] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#CEF23E] text-[#111311] flex items-center justify-center shadow-[0_0_45px_rgba(206,242,62,0.85)] border border-white/50"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={PIPELINE_STAGES[activeIdx].id}
                      initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.4, rotate: 25, opacity: 0 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <ActiveIcon className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2] text-[#111311]" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Main Title & Slogan */}
              <div className="mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-1.5 sm:gap-2">
                  <span>Noor Solar</span>
                  <span className="bg-gradient-to-r from-[#CEF23E] via-[#D8F65E] to-sky-400 bg-clip-text text-transparent">
                    Energy
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1 text-[11px] sm:text-sm font-mono text-slate-300">
                  <span className="text-[#CEF23E] font-bold">Bangladesh</span>
                  <span className="text-slate-600">|</span>
                  <span>Industrial Solar Equipment Supply & EPC</span>
                </div>
              </div>

              {/* 4-Step Interactive Equipment Pipeline Display */}
              <div className="w-full grid grid-cols-4 gap-1.5 sm:gap-3 max-w-lg mb-2.5 sm:mb-3">
                {PIPELINE_STAGES.map((item, idx) => {
                  const isDone = progress >= item.threshold;
                  const isCurrent = activeIdx === idx;
                  const StepIcon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      animate={isCurrent ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                      transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.4 }}
                      className={`relative flex flex-col items-center p-1.5 sm:p-2.5 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? "border-[#CEF23E] bg-[#CEF23E]/12 shadow-[0_0_18px_rgba(206,242,62,0.3)] ring-1 ring-[#CEF23E]/50"
                          : isDone
                          ? "border-sky-400/40 bg-white/[0.04] opacity-90"
                          : "border-white/10 bg-white/[0.02] opacity-40"
                      }`}
                    >
                      {/* Top micro badge */}
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[8px] sm:text-[9px] font-mono font-bold text-slate-400">
                          {item.step}
                        </span>
                        {isDone ? (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#CEF23E] shadow-[0_0_6px_#CEF23E]" />
                        ) : isCurrent ? (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#CEF23E] animate-ping" />
                        ) : (
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-700" />
                        )}
                      </div>

                      {/* Icon */}
                      <div className="my-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#CEF23E]" />
                        ) : (
                          <StepIcon
                            className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                              isCurrent ? "text-[#CEF23E]" : "text-slate-400"
                            }`}
                          />
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-[9px] sm:text-[11px] font-bold text-white truncate max-w-full mt-0.5">
                        {item.short}
                      </span>

                      {/* Micro status pill */}
                      <span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-wider mt-0.5 text-slate-400 truncate max-w-full">
                        {isDone ? "Active" : isCurrent ? "Loading" : "Wait"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dynamic Live Subtitle / Telemetry Banner */}
              <div className="h-6 sm:h-7 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={PIPELINE_STAGES[activeIdx].tech}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.04] border border-[#CEF23E]/30 text-[10px] sm:text-xs font-mono"
                  >
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CEF23E] animate-spin" />
                    <span className="text-[#CEF23E] font-bold">
                      {PIPELINE_STAGES[activeIdx].title}:
                    </span>
                    <span className="text-white font-medium truncate max-w-[180px] sm:max-w-none">
                      {PIPELINE_STAGES[activeIdx].tech}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

            </main>

            {/* ================= BOTTOM HIGH-TECH ENERGY BAR ================= */}
            <footer className="relative z-20 w-full max-w-md mx-auto px-6 pb-8 sm:pb-8 flex flex-col items-center gap-2.5">
              {/* Dual-Glow Progress Track */}
              <div className="w-full h-2 sm:h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 relative border border-white/15 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-[#CEF23E] to-[#B8DC2F] relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                >
                  {/* Leading Laser Spark Flare */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-[0_0_12px_#CEF23E,0_0_24px_#CEF23E]" />
                </motion.div>
              </div>

              {/* Live Status Footnotes */}
              <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-slate-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CEF23E]" />
                  <span>Direct Port-to-Plant</span>
                </span>
                <span className="text-[#CEF23E] font-semibold flex items-center gap-1">
                  <span>Chattogram & Dhaka Hubs</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

