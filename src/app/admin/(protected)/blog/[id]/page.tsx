import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogFormClient } from "@/components/admin/blog-form-client";

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

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
            Edit: {post.title}
          </h1>
          <p className="text-xs text-[#5C605C]">
            Update article content, metadata, and publication status
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm">
        <BlogFormClient initialPost={post} />
      </div>
    </div>
  );
}
