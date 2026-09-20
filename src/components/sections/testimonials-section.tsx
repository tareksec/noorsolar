import Image from "next/image";
import type { Testimonial } from "@prisma/client";

const DEMO_TESTIMONIALS: Array<{
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  photo: string | null;
  quote: string;
}> = [
  {
    id: "demo-1",
    authorName: "Arif Hossain",
    authorRole: "Business Owner",
    company: "EcoPower",
    photo: "/photos/testimonial-arif.jpg",
    quote:
      "“EcoPower helped us seamlessly transition to both solar and wind energy. Our costs have dropped significantly, and we’re now operating more sustainably than ever.”",
  },
  {
    id: "demo-2",
    authorName: "Mahmud Karim",
    authorRole: "Property Developer",
    company: "Apex Developments",
    photo: "/photos/testimonial-mahmud.jpg",
    quote:
      "“The hybrid wind and solar systems installed on our commercial properties cut grid reliance by 65%. Highly recommended team.”",
  },
  {
    id: "demo-3",
    authorName: "Farhana Ahmed",
    authorRole: "Industrial Plant Director",
    company: "Delta Manufacturing",
    photo: "/photos/testimonial-farhana.jpg",
    quote:
      "“From initial engineering assessment through commissioning, the experience was flawless. Our production plant achieved ROI faster than projected.”",
  },
];

export function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  const displayItems = testimonials && testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS;

  return (
    <section className="py-20 lg:py-28 bg-[#f5f6f5] border-t border-b border-black/[0.05]">
      <div className="page-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Eyebrow & Bold Heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#00897B] uppercase block">
              TESTIMONIALS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#111311] leading-[1.12]">
              Here’s the value we’ve brought to our clients.
            </h2>
          </div>

          {/* Right Column: Stacked Testimonial Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {displayItems.map((item, index) => {
              const photoSrc =
                item.photo ||
                (index === 0
                  ? "/photos/testimonial-arif.jpg"
                  : index === 1
                  ? "/photos/testimonial-mahmud.jpg"
                  : "/photos/testimonial-farhana.jpg");

              const roleText = [item.authorRole, item.company].filter(Boolean).join(", ");

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-black/[0.06] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
                >
                  {/* User Avatar */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden mb-4 bg-neutral-100 flex-shrink-0 shadow-sm">
                    <Image
                      src={photoSrc}
                      alt={item.authorName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  {/* User Name & Role */}
                  <div className="text-sm text-neutral-600 mb-3">
                    <span className="font-semibold text-neutral-900">{item.authorName}</span>
                    {roleText && (
                      <>
                        <span className="text-neutral-400">, </span>
                        <span>{roleText}</span>
                      </>
                    )}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-base sm:text-lg font-semibold text-neutral-900 leading-snug tracking-tight">
                    {item.quote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
