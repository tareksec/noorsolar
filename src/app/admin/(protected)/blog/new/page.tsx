import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogFormClient } from "@/components/admin/blog-form-client";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="p-2 rounded-full bg-white border border-[#DDE1DC] text-[#111311] hover:bg-[#EDEDED]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Create Blog Article
          </h1>
          <p className="text-xs text-[#5C605C]">
            Compose educational engineering content with markdown and inline images
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm">
        <BlogFormClient />
      </div>
    </div>
  );
}
