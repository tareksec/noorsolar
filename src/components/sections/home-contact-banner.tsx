"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";

interface HomeContactBannerProps {
  phoneDisplay?: string;
  whatsappNumber?: string;
  headline?: string;
  subheadline?: string;
}

export function HomeContactBanner({}: HomeContactBannerProps = {}) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/contact?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push("/contact");
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-[#E4E7E4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden shadow-2xl border border-white/50 min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center">
          
          {/* Background Panoramic Solar Artwork */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/banners/clean-energy-banner.jpg"
              alt="Clean Energy for a Brighter Tomorrow"
              fill
              priority
              className="object-cover object-[75%_center] sm:object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Subtle soft gradient overlay on left for razor-sharp text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent sm:via-white/50 lg:via-white/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent sm:hidden" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 w-full p-6 sm:p-12 lg:p-16 max-w-2xl">
            
            {/* Logo Lockup */}
            <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                <Image
                  src="/logo/icon.png"
                  alt="Noor Solar Energy"
                  fill
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] leading-none">
                  Noor Solar
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.38em] text-[#84CC16] uppercase mt-1 leading-none">
                  ENERGY
                </span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-[#0F172A] leading-[1.14] mb-3.5">
              Clean Energy for a <br />
              <span className="text-[#84CC16]">Brighter Tomorrow</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-700/90 leading-relaxed max-w-lg mb-6 sm:mb-8 font-medium">
              We provide high-quality solar solutions to power homes, businesses and a sustainable future.
            </p>

            {/* Interactive Email Pill Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 p-1.5 sm:p-2 flex items-center justify-between gap-2 max-w-md mb-6 sm:mb-8 transition-all focus-within:ring-2 focus-within:ring-[#84CC16] focus-within:shadow-[0_8px_30px_rgba(132,204,22,0.25)]"
            >
              <div className="flex items-center gap-2.5 pl-3 sm:pl-3.5 flex-grow min-w-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#CEF23E] hover:bg-[#D8FA45] text-[#111311] font-bold px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shrink-0 shadow-sm transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Join Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden py-1">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden shadow-xs">
                  <Image
                    src="/photos/testimonial-arif.jpg"
                    alt="Customer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden shadow-xs">
                  <Image
                    src="/photos/testimonial-farhana.jpg"
                    alt="Customer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden shadow-xs">
                  <Image
                    src="/photos/testimonial-mahmud.jpg"
                    alt="Customer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-[#84CC16] text-[#111311] font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs">
                  +
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                8,650+ happy customers
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
