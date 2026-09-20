import React from "react";
import { Sun } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0B0F19] text-white p-6">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Spinning glowing ring in Volt Lime & Cyan */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#CEF23E] border-r-sky-400 animate-spin" />
        <div className="w-12 h-12 rounded-full bg-[#CEF23E] text-[#111311] flex items-center justify-center shadow-[0_0_25px_rgba(206,242,62,0.6)]">
          <Sun className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <span className="text-sm font-bold tracking-wider text-white uppercase font-mono">
        Loading Noor Solar <span className="text-[#CEF23E]">Energy</span>...
      </span>
    </div>
  );
}
