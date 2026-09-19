import React from "react";
import Image from "next/image";
import { FileText, SlidersHorizontal, CheckSquare, Truck } from "lucide-react";

export function OrderingSteps() {
  const steps = [
    {
      num: "01",
      title: "Submit Quote Inquiry",
      desc: "Specify your required solar panels, lithium storage, or inverters along with project location and estimated volume.",
      icon: FileText,
      image: "/photos/step-1-consultation.webp",
      alt: "Engineer reviewing technical solar procurement specifications",
    },
    {
      num: "02",
      title: "Technical Consultation",
      desc: "Our sales engineers confirm system voltages, MPPT matching, and verify delivery lead times or in-stock availability.",
      icon: SlidersHorizontal,
      image: "/photos/step-2-quotation.webp",
      alt: "Commercial engineers discussing solar system sizing and quotation",
    },
    {
      num: "03",
      title: "Commercial Quotation",
      desc: "Receive formal wholesale pricing with manufacturer certificates and technical datasheets.",
      icon: CheckSquare,
      image: "/photos/step-3-logistics.webp",
      alt: "Quality inspection and container staging for solar equipment",
    },
    {
      num: "04",
      title: "Order Fulfilment",
      desc: "Order packaged in containerized pallets and delivered from our central Dhaka depot to your site or regional hub.",
      icon: Truck,
      image: "/photos/step-4-delivery.webp",
      alt: "Commercial delivery and on-site solar panel handover in Bangladesh",
    },
  ];

  return (
    <section className="py-20 bg-[#EDEDED] border-b border-[#DDE1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CEF23E]"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C605C]">
              Procurement Process
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#111311]">
            How Wholesale Ordering Works .
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm hover:border-[#111311]/40 transition-colors group"
              >
                <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 bg-[#EDEDED] border border-[#E4E7E4]">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] font-mono font-bold text-[#CEF23E] bg-[#111311]/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                      STEP {step.num}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111311] z-10 shadow-xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#111311] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5C605C] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
