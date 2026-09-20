import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] min-h-screen w-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white p-6">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Spinning glowing ring in Volt Lime & Cyan (3s duration) */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#CEF23E] border-r-sky-400 animate-[spin_3s_linear_infinite]" />
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <Image
            src="/logo/icon.png"
            alt="Noor Solar"
            width={40}
            height={40}
            className="w-10 h-10 object-contain drop-shadow-[0_0_20px_rgba(206,242,62,0.85)] animate-pulse"
            priority
          />
        </div>
      </div>
      <span className="text-sm font-bold tracking-wider text-white uppercase font-mono">
        Loading Noor Solar <span className="text-[#CEF23E]">Energy</span>...
      </span>
    </div>
  );
}
