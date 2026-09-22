import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppImage as Image } from "@/components/ui/app-image";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral max-w-none text-base leading-relaxed text-[#17251F]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#074031] mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#074031] mt-8 mb-4 pb-1 border-b border-[#DCE4E0]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#074031] mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 leading-relaxed text-sm sm:text-base text-[#33433C]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-5 pl-2 text-sm sm:text-base text-[#33433C]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-5 pl-2 text-sm sm:text-base text-[#33433C]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#FEBE16] pl-4 py-2 my-6 italic text-[#074031] bg-[#F1F4F1] rounded-r-xl">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-[#DCE4E0]">
              <table className="w-full text-left text-xs sm:text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F1F4F1] text-[#074031] font-mono text-xs uppercase">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="p-3 border-b border-[#DCE4E0] font-semibold">{children}</th>,
          td: ({ children }) => <td className="p-3 border-b border-[#DCE4E0]">{children}</td>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-[#074031] underline font-semibold hover:text-[#0B513E] transition-colors"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <div className="relative w-full h-64 sm:h-96 my-6 rounded-3xl overflow-hidden bg-[#F1F4F1] border border-[#DCE4E0]">
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
            <code className="px-1.5 py-0.5 rounded bg-[#F1F4F1] text-xs font-mono text-[#074031] border border-[#DCE4E0]">
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
