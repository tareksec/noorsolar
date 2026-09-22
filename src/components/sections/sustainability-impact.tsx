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
      badge: isBn ? "পরিবেশ ও ESG কমপ্লায়েন্স" : "ESG & Export Compliance",
      title: isBn
        ? "পোশাক ও রপ্তানিমুখী শিল্পের জন্য টেকসই গ্রিন এনার্জি"
        : "Lowering Industrial Carbon Footprints for Global Compliance",
      description: isBn
        ? "আন্তর্জাতিক বায়ারদের কঠোর ESG কমপ্লায়েন্স অডিট পূরণ করতে শিল্প কারখানার রুফটপ সোলার এখন অত্যন্ত কার্যকরী। অন-সাইট গ্রিন এনার্জি ব্যবহারে কারখানার কার্বন ফুটপ্রিন্ট সরাসরি কমে এবং রপ্তানি সক্ষমতা বৃদ্ধি পায়।"
        : "Meeting international export standards and buyer ESG audits requires documented clean energy adoption. Industrial rooftop PV directly cuts factory Scope 2 emissions while satisfying global supply chain sustainability mandates.",
      buttonText: isBn ? "সেলস টিমের সাথে কথা বলুন" : "Contact Commercial Sales",
      buttonHref: "/contact",
      imageSrc: "/photos/impact-esg-compliance.webp",
      imageAlt: isBn
        ? "রপ্তানিমুখী পোশাক কারখানায় আধুনিক রুফটপ সোলার প্যানেল ও পরিবেশবান্ধব ESG কমপ্লায়েন্স"
        : "Modern industrial rooftop solar installation for ESG export compliance",
      reverse: false,
    },
    {
      badge: isBn ? "দীর্ঘমেয়াদী LCOE বিদ্যুৎ খরচ সাশ্রয়" : "Levelized Cost of Energy",
      title: isBn
        ? "পিক আওয়ার গ্রিড ট্যারিফ ও জেনারেটরের জ্বালানি খরচ হ্রাস"
        : "Mitigate Grid Tariff Spikes & Unpredictable Generator Costs",
      description: isBn
        ? "গ্রিড বিদ্যুতের ক্রমাগত ট্যারিফ বৃদ্ধি এবং ডিজেল জেনারেটরের অতিরিক্ত খরচ কমাতে অন-সাইট সোলার বিদ্যুৎ সবচেয়ে নির্ভরযোগ্য সমাধান। ৩ থেকে ৪ বছরের পে-ব্যাক পিরিয়ডে দীর্ঘ ২৫ বছর পর্যন্ত কারখানার বিদ্যুৎ খরচ কমিয়ে রাখা সম্ভব।"
        : "High peak commercial utility tariffs and volatile diesel fuel expenses directly impact operating margins. High-yield commercial solar arrays stabilize manufacturing kilowatt-hour costs with predictable 3 to 4 year capital payback timelines.",
      buttonText: isBn ? "বাণিজ্যিক কোটেশন নিন" : "Request Commercial Quote",
      buttonHref: "/contact",
      imageSrc: "/photos/impact-lcoe-savings.webp",
      imageAlt: isBn
        ? "শিল্প কারখানার ছাদে সোলার বিদ্যুৎ উৎপাদন মনিটরিং ও LCOE খরচ সাশ্রয় বিশ্লেষণ"
        : "Industrial solar engineer monitoring real-time power generation and LCOE cost savings on tablet",
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
