import React from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import type { Project } from "@prisma/client";
import { MapPin, Zap, Calendar, Building2, PackageCheck } from "lucide-react";

interface ProjectsShowcaseProps {
  projects: Project[];
  locale: string;
}

export function ProjectsShowcase({ projects, locale }: ProjectsShowcaseProps) {
  // Hide cleanly if no real published project records exist
  if (!projects || projects.length === 0) {
    return null;
  }

  const isBn = locale === "bn";

  return (
    <section className="py-20 sm:py-28 bg-[#F1F4F1] border-t border-[#DCE4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DCE4E0] text-xs font-mono text-[#17251F] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FEBE16]"></span>
              <span>{isBn ? "প্রকল্প সরঞ্জাম সরবরাহ রেফারেন্স" : "Supply & Project References"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#074031]">
              {isBn ? "বাস্তবায়িত সৌর বিদ্যুৎ প্রকল্পসমূহ" : "Verified Project Supply References"}
            </h2>
            <p className="text-sm sm:text-base text-[#62706A] max-w-2xl mt-2">
              {isBn
                ? "বাংলাদেশে বিভিন্ন শিল্প কারখানা, বাণিজ্যিক ছাদ ও মেগাওয়াট প্রকল্পে সরবরাহকৃত আসল সরঞ্জামের রেফারেন্স।"
                : "Real commercial rooftop, industrial facility, and utility arrays supplied with engineering-grade solar equipment."}
            </p>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-[32px] bg-white border border-[#DCE4E0] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
            >
              {/* Image Container */}
              {project.image && (
                <div className="relative aspect-16/10 w-full bg-[#F7F8F5] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.capacity && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#052F25]/90 backdrop-blur-xs text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
                      <Zap className="w-3.5 h-3.5 text-[#FEBE16]" />
                      <span>{project.capacity}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {project.projectType && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F1F4F1] text-[11px] font-mono text-[#074031]">
                        {project.projectType}
                      </span>
                    )}
                    {project.location && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#62706A]">
                        <MapPin className="w-3 h-3 text-[#074031]" />
                        <span>{project.location}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#17251F] mb-2 leading-snug">
                    {project.title}
                  </h3>

                  {project.clientName && (
                    <div className="flex items-center gap-1.5 text-xs text-[#62706A] mb-3">
                      <Building2 className="w-3.5 h-3.5 text-[#074031]" />
                      <span>{project.clientName}</span>
                    </div>
                  )}

                  {project.summary && (
                    <p className="text-xs sm:text-sm text-[#62706A] leading-relaxed line-clamp-3 mb-4">
                      {project.summary}
                    </p>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-[#DCE4E0] flex items-center justify-between text-xs font-mono">
                  {project.productsSupplied ? (
                    <div className="flex items-center gap-1.5 text-[#17251F] truncate max-w-[70%]">
                      <PackageCheck className="w-3.5 h-3.5 shrink-0 text-[#074031]" />
                      <span className="truncate">{project.productsSupplied}</span>
                    </div>
                  ) : (
                    <span />
                  )}
                  {project.completionDate && (
                    <div className="flex items-center gap-1 text-[#62706A] shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{project.completionDate}</span>
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
