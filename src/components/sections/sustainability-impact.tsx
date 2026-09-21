import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

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

interface SustainabilityImpactProps {
  locale?: string;
}

export function SustainabilityImpact({ locale }: SustainabilityImpactProps = {}) {
  const isBn = locale === "bn";

  const impactItems: ImpactItem[] = [
    {
      badge: isBn ? "পরিবেশ ও রপ্তানি কমপ্লায়েন্স" : "ESG & Export Compliance",
      title: isBn
        ? "পোশাক ও রপ্তানিমুখী শিল্পের জন্য টেকসই শক্তি"
        : "Lowering Industrial Carbon Footprints for Global Compliance",
      description: isBn
        ? "আন্তর্জাতিক বায়ারদের ESG কমপ্লায়েন্স মানদণ্ড পূরণ করতে শিল্প কারখানার রুফটপ সোলার এখন অপরিহার্য। অন-সাইট গ্রিন এনার্জি ব্যবহার করে কারখানার কার্বন ফুটপ্রিন্ট কমান এবং বৈশ্বিক বাজারে এগিয়ে থাকুন।"
        : "Meeting international export standards and buyer ESG audits requires documented clean energy adoption. Industrial rooftop PV directly cuts factory Scope 2 emissions while satisfying global supply chain sustainability mandates.",
      buttonText: isBn ? "বিশেষজ্ঞের সাথে কথা বলুন" : "Talk to an expert",
      buttonHref: "/contact",
      imageSrc: "/photos/impact-future-ready.webp",
      imageAlt: isBn ? "পরিবেশবান্ধব নবায়নযোগ্য বিদ্যুৎ প্রকল্প" : "Industrial clean energy solar and wind installations",
      reverse: false,
    },
    {
      badge: isBn ? "দীর্ঘমেয়াদী LCOE সাশ্রয়" : "Levelized Cost of Energy",
      title: isBn
        ? "পিক আওয়ার ট্যারিফ হ্রাস ও অপারেশনাল খরচ নিয়ন্ত্রণ"
        : "Mitigate Grid Tariff Spikes & Unpredictable Generator Costs",
      description: isBn
        ? "গ্রিড বিদ্যুতের মূল্যবৃদ্ধি এবং ডিজেল জেনারেটরের জ্বালানি খরচ কমাতে অন-সাইট সোলার বিদ্যুৎ সবচেয়ে কার্যকরী সমাধান। দ্রুত পে-ব্যাক পিরিয়ডে দীর্ঘ ২৫ বছর পর্যন্ত কারখানার বিদ্যুৎ খরচ কমিয়ে রাখুন।"
        : "High peak commercial utility tariffs and volatile diesel fuel expenses directly impact operating margins. High-yield commercial solar arrays stabilize manufacturing kilowatt-hour costs with predictable 3 to 4 year capital payback timelines.",
      buttonText: isBn ? "পরামর্শ নিন" : "Talk to an expert",
      buttonHref: "/contact",
      imageSrc: "/photos/impact-cost-efficiency.webp",
      imageAlt: isBn ? "বাণিজ্যিক সোলার প্যানেল ইনস্টলেশন" : "Solar photovoltaic panels installed for cost efficiency",
      reverse: true,
    },
  ];

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
