import React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Trash2,
  BookOpen,
} from "lucide-react";
import {
  toggleBlogPostStatusAction,
  deleteBlogPostAction,
} from "@/app/admin/actions/blog";

interface AdminBlogPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const { q = "", status = "", page = "1" } = await searchParams;

  const pageSize = 10;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const whereClause: Prisma.BlogPostWhereInput = {};

  if (q.trim()) {
    const query = q.trim();
    whereClause.OR = [
      { title: { contains: query } },
      { excerpt: { contains: query } },
      { tags: { contains: query } },
    ];
  }

  if (status === "PUBLISHED") {
    whereClause.status = "PUBLISHED";
  } else if (status === "DRAFT") {
    whereClause.status = "DRAFT";
  }

  const [totalCount, filteredCount, posts] = await Promise.all([
    db.blogPost.count(),
    db.blogPost.count({ where: whereClause }),
    db.blogPost.findMany({
      where: whereClause,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  function buildFilterUrl(newPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return `/admin/blog${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111311] tracking-tight">
            Educational Blog Articles
          </h1>
          <p className="text-xs text-[#5C605C]">
            Manage technical articles, industry guides, and solar equipment education ({filteredCount} of {totalCount} posts)
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-semibold tracking-tight transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C605C]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search posts by title, excerpt, or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none placeholder:text-[#5C605C] focus:ring-1 focus:ring-[#111311]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-[#111311] hover:bg-[#222622] text-[#CEF23E] text-xs font-mono font-medium shrink-0 transition-colors"
            >
              Filter
            </button>

            {(q || status) && (
              <Link
                href="/admin/blog"
                className="px-3 py-2 rounded-2xl bg-[#EDEDED] text-[#5C605C] hover:text-[#111311] text-xs font-mono shrink-0 transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDE1DC] shadow-sm">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-8 h-8 text-[#5C605C] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-mono text-[#5C605C] mb-2">No articles found.</p>
            <Link
              href="/admin/blog/new"
              className="text-xs font-mono text-[#111311] underline hover:text-black"
            >
              Write your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EDEDED]">
            {posts.map((post) => (
              <div
                key={post.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] shrink-0">
                    <Image
                      src={post.coverImage || "/photos/hero_commercial_rooftop_solar.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-sm text-[#111311]">{post.title}</span>

                      {/* Status toggle button */}
                      <form action={toggleBlogPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="currentStatus" value={post.status} />
                        <button
                          type="submit"
                          title="Click to toggle publish status"
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono cursor-pointer transition-colors ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {post.status}
                        </button>
                      </form>

                      {post.isSample && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
                          Sample
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5C605C] font-mono mt-1">
                      <span>By {post.authorName}</span>
                      <span>&bull;</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                      </span>
                      {post.tags && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate max-w-[150px]">{post.tags}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {/* Edit */}
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="px-3 py-1.5 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] text-xs font-mono inline-flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Public Link (if published) */}
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-full text-[#5C605C] hover:text-[#111311] hover:bg-[#EDEDED]"
                      title="View public article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  {/* Delete */}
                  <form action={deleteBlogPostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      title="Delete article"
                      className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-[#EDEDED] flex items-center justify-between text-xs font-mono">
            <span className="text-[#5C605C]">
              Page {currentPage} of {totalPages} ({filteredCount} total)
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={buildFilterUrl(currentPage - 1)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDE1DC] text-[#111311] ${
                  currentPage <= 1
                    ? "opacity-30 pointer-events-none"
                    : "hover:bg-[#EDEDED] transition-colors"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Link>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <Link
                    key={pNum}
                    href={buildFilterUrl(pNum)}
                    className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors ${
                      pNum === currentPage
                        ? "bg-[#111311] text-[#CEF23E] font-bold"
                        : "text-[#5C605C] hover:bg-[#EDEDED]"
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}
              </div>

              <Link
                href={buildFilterUrl(currentPage + 1)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DDE1DC] text-[#111311] ${
                  currentPage >= totalPages
                    ? "opacity-30 pointer-events-none"
                    : "hover:bg-[#EDEDED] transition-colors"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
