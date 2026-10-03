"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useId, type CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export interface FeatureRevealTriggerRange {
  start?: string;
  end?: string;
}

export interface FeatureRevealTriggers {
  no?: FeatureRevealTriggerRange;
  title?: FeatureRevealTriggerRange;
  content?: FeatureRevealTriggerRange;
  img?: FeatureRevealTriggerRange;
}

export interface FeatureRevealProperty {
  image?: string;
  imgClass?: string;
  no?: string | number;
  number?: string | number;
  titleClass?: string;
  title?: string;
  badge?: string;
  link?: string;
  ctaText?: string;
  contentClass?: string;
  paragraphs?: string[];
  triggers?: FeatureRevealTriggers;
}

export const DEFAULT_PROPERTIES_DATA: FeatureRevealProperty[] = [
  {
    number: "01",
    no: "1",
    imgClass: "img-1",
    titleClass: "property-title-1",
    contentClass: "property-content-1",
    title: "TOPCon Solar Panels",
    badge: "30-Year Warranty",
    link: "/category/solar-panels",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-solar-panels.webp",
    paragraphs: [
      "Engineered with advanced N-Type TOPCon technology for ultra-high conversion efficiency and multi-decade commercial durability.",
      "Tier-1 certified high-efficiency panels delivering 580W-720W power output with 30-year performance warranty for solar farms and industrial rooftops.",
    ],
    triggers: {
      img: { start: "-10% top", end: "10% top" },
      no: { start: "-1% top", end: "5% top" },
      title: { start: "-1% top", end: "5% top" },
      content: { start: "-1% top", end: "5% top" },
    },
  },
  {
    number: "02",
    no: "2",
    imgClass: "img-2",
    titleClass: "property-title-2",
    contentClass: "property-content-2",
    title: "Commercial Inverters",
    badge: "98.6% Efficiency",
    link: "/category/solar-inverters",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-solar-inverters.webp",
    paragraphs: [
      "High-efficiency commercial multi-MPPT solar inverters engineered for continuous maximum yield and heavy-duty grid stability.",
      "Features IP65/IP66 weatherproof design, 98.6%+ European efficiency, and intelligent string monitoring for commercial and industrial facilities.",
    ],
    triggers: {
      img: { start: "-5% top", end: "35% top" },
      no: { start: "18% top", end: "23% top" },
      title: { start: "18% top", end: "23% top" },
      content: { start: "18% top", end: "23% top" },
    },
  },
  {
    number: "03",
    no: "3",
    imgClass: "img-3",
    titleClass: "property-title-3",
    contentClass: "property-content-3",
    title: "LiFePO4 Storage (ESS)",
    badge: "6,000+ Cycles",
    link: "/category/lithium-batteries",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-lithium-batteries.webp",
    paragraphs: [
      "Next-generation lithium iron phosphate energy storage systems engineered for continuous zero-downtime industrial backup power.",
      "Offering 6,000+ deep cycles, modular expansion from 50 kWh to 5 MWh, and automotive-grade intelligent battery management system (BMS).",
    ],
    triggers: {
      img: { start: "25% top", end: "65% top" },
      no: { start: "45% top", end: "50% top" },
      title: { start: "45% top", end: "50% top" },
      content: { start: "45% top", end: "50% top" },
    },
  },
  {
    number: "04",
    no: "4",
    imgClass: "img-4",
    titleClass: "property-title-4",
    contentClass: "property-content-4",
    title: "Portable Power Stations",
    badge: "New Release",
    link: "/category/portable-power-stations",
    ctaText: "View Specifications & Stock",
    image: "/photos/cat-portable-power-station.jpg",
    paragraphs: [
      "Plug-and-play portable solar power stations with 1000W AC pure sine wave output and rapid 1.2-hour wall or solar recharging.",
      "Safe, durable LiFePO4 cells with 3000+ cycles, built-in UPS fast transfer, and versatile outputs for field engineering and emergency backup.",
    ],
    triggers: {
      img: { start: "45% top", end: "85% top" },
      no: { start: "65% top", end: "70% top" },
      title: { start: "65% top", end: "70% top" },
      content: { start: "65% top", end: "70% top" },
    },
  },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export interface HorizontalScrollCompProps {
  propertiesData?: FeatureRevealProperty[];
  headerBadge?: string;
  headerTitle?: string;
  bgColor?: string;
  imageParallaxRange?: number;
  cardGap?: number;
}

export function HorizontalScrollComp({
  propertiesData = DEFAULT_PROPERTIES_DATA,
  headerBadge,
  headerTitle,
  bgColor,
  imageParallaxRange = 30,
  cardGap = 15,
}: HorizontalScrollCompProps) {
  const uid = useId().replace(/:/g, "");
  const sectionId = `industries-${uid}`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth <= 1025) return;
      const reducedMotion = prefersReducedMotion();

      gsap.set(
        ".industry-img, .industry-no, .industry-title, .industry-content, .industry-badge, .industry-cta",
        { opacity: 1 },
      );

      gsap.to(".industry-container", {
        xPercent: -79,
        ease: "none",
        scrollTrigger: {
          trigger: `#${sectionId}`,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      if (reducedMotion) {
        ScrollTrigger.refresh();
        return;
      }

      const head = document.querySelector(".industry-head");
      if (head) {
        const headSplit = new SplitText(head, { type: "chars" });

        gsap.from(headSplit.chars, {
          yPercent: () =>
            (Math.random() < 0.5 ? 1 : -1) * (200 * Math.random()),
          xPercent: () => 200 * Math.random(),
          stagger: 0.1,
          duration: 1,
          ease: "back.out",
          scrollTrigger: {
            trigger: `#${sectionId}`,
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }

      const cards = document.querySelectorAll(".industry-card");

      cards.forEach((card, i) => {
        const cfg = propertiesData[i]?.triggers || ({} as FeatureRevealTriggers);
        const startNo = cfg.no?.start || "top 70%";
        const endNo = cfg.no?.end || "top 40%";
        const startTitle = cfg.title?.start || "top 70%";
        const endTitle = cfg.title?.end || "top 40%";
        const startContent = cfg.content?.start || "top 70%";
        const endContent = cfg.content?.end || "top 40%";
        const startImg = cfg.img?.start || "top 70%";
        const endImg = cfg.img?.end || "top 40%";

        const noEl = card.querySelector(`[class*="industry-no-"]`);
        if (noEl) {
          const splitNo = new SplitText(noEl, {
            type: "chars,lines",
            mask: "lines",
          });

          gsap.from(splitNo.chars, {
            y: 150,
            rotate: 10,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startNo,
              end: endNo,
              toggleActions: "play none none reverse",
            },
          });
        }

        const titleEl = card.querySelector(`[class*="property-title-"]`);
        if (titleEl) {
          const titleLines = new SplitText(titleEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.set(titleEl, { lineHeight: 1.2 });
          gsap.set(titleLines.lines, { lineHeight: 1.2 });

          gsap.from(titleLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startTitle,
              end: endTitle,
              toggleActions: "play none none reverse",
            },
          });
        }

        const contentEls = card.querySelectorAll(`[class*="property-content-"]`);
        contentEls.forEach((contentEl) => {
          const contentLines = new SplitText(contentEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.from(contentLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            delay: 0.3,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startContent,
              end: endContent,
              toggleActions: "play none none reverse",
            },
          });
        });

        const propertyImgs = card.querySelectorAll(`[class*="industry-img-"]`);
        propertyImgs.forEach((propertyImg) => {
          gsap.to(propertyImg, {
            translateX: `${imageParallaxRange}%`,
            ease: "none",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startImg,
              end: endImg,
              scrub: true,
            },
          });
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [propertiesData, sectionId, imageParallaxRange]);

  return (
    <section
      className={`w-full h-[550vh] relative z-10 max-[1025px]:mt-0 max-[1025px]:h-fit max-[1025px]:py-16 max-[1025px]:px-6 text-foreground ${
        bgColor ? "" : "bg-[#F8F9F5] dark:bg-[#0B0F0D]"
      }`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      id={sectionId}
    >
      <div className="w-full overflow-hidden h-screen justify-center items-center sticky top-0 max-[1025px]:static max-[1025px]:w-full max-[1025px]:h-fit max-[1025px]:flex max-[1025px]:flex-col max-[1025px]:items-start">
        {/* Floating Top Section Identifier */}
        {(headerBadge || headerTitle) && (
          <div className="absolute top-6 left-8 sm:left-12 lg:left-16 z-30 flex items-center gap-3 max-[1025px]:static max-[1025px]:mb-8">
            <span className="h-2 w-2 rounded-full bg-[#108958] animate-pulse" />
            {headerBadge && (
              <span className="font-mono text-xs font-bold text-[#108958] dark:text-[#22C55E] uppercase tracking-wider">
                {headerBadge}
              </span>
            )}
            {headerTitle && (
              <>
                <span className="text-neutral-300 dark:text-white/20">|</span>
                <h2 className="text-sm sm:text-base font-bold text-[#074031] dark:text-white">
                  {headerTitle}
                </h2>
              </>
            )}
          </div>
        )}

        <div
          className="flex flex-nowrap w-fit industry-container gap-[var(--card-gap)] max-[1025px]:flex-col max-[1025px]:gap-12 px-[10vw] max-[1025px]:px-0"
          style={{ "--card-gap": `${cardGap}vw` } as CSSProperties & Record<`--${string}`, string>}
        >
          {propertiesData.map((property, index) => (
            <div
              key={index}
              className="w-[80vw] h-screen flex items-center gap-[5vw] industry-card max-[1025px]:h-fit max-[1025px]:flex-col-reverse max-[1025px]:w-full"
            >
              {/* Product Visual Showcase Image with Parallax */}
              <div className="w-[40vw] h-[72vh] overflow-hidden max-md:h-[90vw] max-[1025px]:w-full rounded-3xl border border-[#E2E8DF] dark:border-white/10 shadow-[0_16px_40px_rgba(7,64,49,0.08)] bg-white dark:bg-[#131915]">
                <img
                  src={property.image}
                  alt={property.title || `property-img-${index + 1}`}
                  className={`w-full h-full object-cover translate-x-[var(--image-shift-start)] opacity-0 industry-img industry-${property.imgClass} max-[1025px]:translate-x-0 max-[1025px]:object-cover max-[1025px]:opacity-100`}
                  style={
                    {
                      "--image-shift-start": `-${imageParallaxRange}%`,
                    } as CSSProperties & Record<`--${string}`, string | number>
                  }
                  width={800}
                  height={1080}
                />
              </div>

              {/* Text / Specification Details */}
              <div className="flex flex-col gap-[3vh] w-[40vw] max-md:pt-0 max-[1025px]:w-full max-[1025px]:gap-4">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[4.5em] xl:text-[5.5em] font-mono font-bold text-[#108958] dark:text-[#22C55E] leading-none opacity-0 industry-no industry-no-${property.no} max-[1025px]:text-[12vw] max-[1025px]:opacity-100`}
                  >
                    {property.number}
                  </p>

                  {property.badge && (
                    <span className="font-mono text-xs font-bold text-[#074031] dark:text-white bg-[#FEBE16] px-3 py-1 rounded-full uppercase tracking-wider industry-badge opacity-0 max-[1025px]:opacity-100">
                      {property.badge}
                    </span>
                  )}
                </div>

                <div className="w-full h-fit flex flex-col gap-[2.5vh] max-[1025px]:gap-4">
                  <h3
                    className={`text-[2.2em] xl:text-[2.8em] font-black text-[#074031] dark:text-white opacity-0 industry-title max-md:text-[8vw] max-[1025px]:text-[6vw] max-[1025px]:opacity-100 leading-[1.15] tracking-tight ${property.titleClass}`}
                  >
                    {property.title}
                  </h3>

                  <div className="space-y-3 text-neutral-600 dark:text-neutral-300 text-sm xl:text-base leading-relaxed">
                    {(property.paragraphs as string[]).map((para, pIndex) => (
                      <p
                        key={pIndex}
                        className={`opacity-0 industry-content max-[1025px]:opacity-100 ${property.contentClass}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {property.link && (
                    <div className="pt-2 industry-cta opacity-0 max-[1025px]:opacity-100">
                      <Link
                        href={property.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#074031] hover:bg-[#108958] text-white text-xs font-bold transition-all shadow-sm group/btn"
                      >
                        <span>{property.ctaText || "View Specifications & Stock"}</span>
                        <ArrowRight className="w-4 h-4 text-[#FEBE16] transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface HorizontalFeatureRevealProps {
  properties?: FeatureRevealProperty[];
  headerBadge?: string;
  headerTitle?: string;
  /** Optional background override. Falls back to the `bg-background` token. */
  bgColor?: string;
  /** Horizontal parallax travel of each image, in %. */
  imageParallaxRange?: number;
  /** Gap between cards, in vw. */
  cardGap?: number;
}

export default function HorizontalFeatureReveal({
  properties = DEFAULT_PROPERTIES_DATA,
  headerBadge,
  headerTitle,
  bgColor,
  imageParallaxRange = 30,
  cardGap = 15,
}: HorizontalFeatureRevealProps) {
  return (
    <HorizontalScrollComp
      propertiesData={properties}
      headerBadge={headerBadge}
      headerTitle={headerTitle}
      bgColor={bgColor}
      imageParallaxRange={imageParallaxRange}
      cardGap={cardGap}
    />
  );
}
