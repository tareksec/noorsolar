import React from "react";
import { FileText, SlidersHorizontal, CheckSquare, Truck } from "lucide-react";

export function OrderingSteps() {
  const steps = [
    {
      num: "01",
      title: "Submit Quote Inquiry",
      desc: "Specify your required solar panels, lithium storage, or inverters along with project location and estimated volume.",
      icon: FileText,
    },
    {
      num: "02",
      title: "Technical Consultation",
      desc: "Our sales engineers confirm system voltages, MPPT matching, and verify delivery lead times or in-stock availability.",
      icon: SlidersHorizontal,
    },
    {
      num: "03",
      title: "Commercial Quotation",
      desc: "Receive formal wholesale pricing with tier-1 manufacturer warranty certificates and technical datasheets.",
      icon: CheckSquare,
    },
    {
      num: "04",
      title: "Warehouse Dispatch",
      desc: "Order packaged in containerized pallets and dispatched from our central Dhaka depot to your site or regional hub.",
      icon: Truck,
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
                className="relative flex flex-col p-6 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm hover:border-[#111311]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#CEF23E] bg-[#111311] px-2.5 py-1 rounded-full">
                    STEP {step.num}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#111311]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#111311] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C605C] leading-relaxed">
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
