import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ImpactItem {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

const impactItems: ImpactItem[] = [
  {
    badge: "Future ready",
    title: "Built for a lower impact on your business future",
    description:
      "Sustainability is becoming a business standard, not a trend. Align your operations with regulations, market expectations, and environmental responsibility.",
    buttonText: "Talk to an expert",
    buttonHref: "/contact",
    imageSrc: "/photos/impact-future-ready.webp",
    imageAlt: "Green hillside landscape with clean energy wind turbines",
    reverse: false,
  },
  {
    badge: "Cost efficiency",
    title: "Reduce waste, lower hidden operational and energy costs",
    description:
      "Energy loss, emissions, and resource inefficiencies create real financial impact. Optimising systems helps cut costs while improving performance and stability.",
    buttonText: "Talk to an expert",
    buttonHref: "/contact",
    imageSrc: "/photos/impact-cost-efficiency.webp",
    imageAlt: "Solar photovoltaic panels installed across a green field",
    reverse: true,
  },
];

export function SustainabilityImpact() {
  return (
    <section className="w-full bg-white py-20 lg:py-32 border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 lg:space-y-36">
        {impactItems.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Content Column */}
            <div
              className={`lg:col-span-6 flex flex-col justify-center ${
                item.reverse
                  ? "lg:order-2 lg:pl-4 xl:pl-8"
                  : "lg:order-1 lg:pr-4 xl:pr-8"
              }`}
            >
              {/* Pill Badge */}
              <div className="mb-5">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-[#F4F5F6] border border-[#E5E7EB]">
                  {item.badge}
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-neutral-900 leading-[1.18] mb-5">
                {item.title}
              </h2>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-xl mb-8">
                {item.description}
              </p>

              {/* Action Button */}
              <div>
                <Link
                  href={item.buttonHref}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-[#376e4b] hover:bg-[#2e5d3f] active:scale-[0.98] transition-all duration-200 shadow-xs"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>

            {/* Image Column */}
            <div
              className={`lg:col-span-6 ${
                item.reverse ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/60 group">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                  priority={idx === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
