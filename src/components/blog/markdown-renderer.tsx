import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppImage as Image } from "@/components/ui/app-image";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral max-w-none text-base leading-relaxed text-[#2B302B]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111311] mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111311] mt-8 mb-4 pb-1 border-b border-[#EDEDED]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#111311] mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 leading-relaxed text-sm sm:text-base text-[#383D38]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-5 pl-2 text-sm sm:text-base text-[#383D38]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-5 pl-2 text-sm sm:text-base text-[#383D38]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#CEF23E] pl-4 py-1.5 my-6 italic text-[#111311] bg-[#EDEDED]/50 rounded-r-xl">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-[#DDE1DC]">
              <table className="w-full text-left text-xs sm:text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#EDEDED] text-[#111311] font-mono text-xs uppercase">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="p-3 border-b border-[#DDE1DC] font-semibold">{children}</th>,
          td: ({ children }) => <td className="p-3 border-b border-[#EDEDED]">{children}</td>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-emerald-700 underline font-medium hover:text-emerald-900 transition-colors"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <div className="relative w-full h-64 sm:h-96 my-6 rounded-3xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC]">
                <Image
                  src={src}
                  alt={alt || "Blog image"}
                  fill
                  className="object-cover"
                />
              </div>
            );
          },
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-[#EDEDED] text-xs font-mono text-[#111311]">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
