"use client";

import React, { useState, useTransition, useActionState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Edit2,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  X,
} from "lucide-react";
import {
  createAdminReviewAction,
  updateReviewAction,
  setReviewStatusAction,
  deleteReviewAction,
  bulkApproveReviewsAction,
  AdminReviewActionResult,
} from "@/app/admin/actions/reviews";

interface ReviewItem {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  source: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    model: string | null;
  };
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
}

interface ReviewListClientProps {
  reviews: ReviewItem[];
  products: ProductOption[];
}

export function ReviewListClient({ reviews, products }: ReviewListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const [createState, createAction, isCreating] = useActionState<
    AdminReviewActionResult,
    FormData
  >(async (_prev, fd) => {
    const res = await createAdminReviewAction(_prev, fd);
    if (res.success) {
      setIsAddModalOpen(false);
    }
    return res;
  }, { success: false });

  const [updateState, updateAction, isUpdating] = useActionState<
    AdminReviewActionResult,
    FormData
  >(async (_prev, fd) => {
    const res = await updateReviewAction(_prev, fd);
    if (res.success) {
      setEditingReview(null);
    }
    return res;
  }, { success: false });

  const allSelected = reviews.length > 0 && selectedIds.length === reviews.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviews.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      const fd = new FormData();
      selectedIds.forEach((id) => fd.append("selectedIds[]", id));
      await bulkApproveReviewsAction(fd);
      setSelectedIds([]);
    });
  };

  const handleStatusChange = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("status", status);
      await setReviewStatusAction(fd);
    });
  };

  const handleDelete = (id: string, authorName: string) => {
    if (confirm(`Are you sure you want to permanently delete the review by "${authorName}"?`)) {
      startTransition(async () => {
        const fd = new FormData();
        fd.append("id", id);
        await deleteReviewAction(fd);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Bulk Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#EDEDED] border border-[#DDE1DC] text-xs font-mono">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            className="rounded text-[#111311] cursor-pointer"
            id="selectAllReviews"
          />
          <label htmlFor="selectAllReviews" className="cursor-pointer font-medium text-[#111311]">
            Select all on page ({selectedIds.length} selected)
          </label>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleBulkApprove}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            type="button"
            id="btn-open-add-review"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Review Cards / List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-8 h-8 text-[#5C605C] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-mono text-[#5C605C] mb-2">No reviews match your filter.</p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-mono text-[#111311] underline hover:text-black"
          >
            Add an authentic client review
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#EDEDED]">
          {reviews.map((review) => {
            const isSelected = selectedIds.includes(review.id);
            return (
              <div
                key={review.id}
                className={`py-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4 rounded-2xl px-3 transition-colors ${
                  isSelected ? "bg-[#EDEDED]/60" : ""
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectOne(review.id)}
                    className="rounded text-[#111311] cursor-pointer mt-1 shrink-0"
                  />

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {review.title && (
                        <span className="font-bold text-sm text-[#111311]">
                          {review.title}
                        </span>
                      )}

                      {/* Status badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          review.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : review.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {review.status}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EDEDED] text-[#5C605C] border border-[#DDE1DC]">
                        {review.source}
                      </span>
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm text-[#383D38] leading-relaxed break-words whitespace-pre-line">
                      {review.body}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-[#5C605C] pt-1">
                      <span className="font-medium text-[#111311]">
                        {review.authorName}
                        {review.authorRole && `, ${review.authorRole}`}
                        {review.company && ` @ ${review.company}`}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <Link
                        href={`/product/${review.product.slug}`}
                        target="_blank"
                        className="text-emerald-700 underline hover:text-emerald-900 inline-flex items-center gap-0.5"
                      >
                        <span>{review.product.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                  {review.status !== "APPROVED" && (
                    <button
                      type="button"
                      id={`btn-approve-review-${review.id}`}
                      data-testid="btn-approve-review"
                      disabled={isPending}
                      onClick={() => handleStatusChange(review.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono inline-flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {review.status !== "REJECTED" && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusChange(review.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-mono inline-flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => setEditingReview(review)}
                    className="p-1.5 rounded-full bg-[#EDEDED] hover:bg-[#DDE1DC] text-[#111311] transition-colors"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(review.id, review.authorName)}
                    className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative border border-[#DDE1DC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEDED]">
              <div>
                <h2 className="text-lg font-bold text-[#111311]">Add Product Review</h2>
                <p className="text-xs text-[#5C605C]">
                  Admin-created reviews are approved and published immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-[#5C605C] hover:bg-[#EDEDED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createState.error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{createState.error}</span>
              </div>
            )}

            <form action={createAction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono font-medium text-[#111311] mb-1">
                  Target Product *
                </label>
                <select
                  name="productId"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <select
                    name="rating"
                    defaultValue="5"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-mono"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Date of Review
                  </label>
                  <input
                    type="date"
                    name="createdAt"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs font-mono text-[#111311] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    required
                    placeholder="e.g. Engr. Shafiqul Islam"
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    name="authorRole"
                    placeholder="Chief Engineer"
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Apex Textile Mills"
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-medium text-[#111311] mb-1">
                  Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Outstanding low-light yield on Gazipur factory roof"
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-[#111311] mb-1">
                  Review Text *
                </label>
                <textarea
                  name="body"
                  required
                  rows={4}
                  placeholder="Detailed technical feedback on performance, delivery compliance, and durability..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EDEDED]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-[#5C605C] hover:bg-[#EDEDED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-publish-review"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs transition-colors disabled:opacity-60"
                >
                  {isCreating ? "Saving..." : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative border border-[#DDE1DC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEDED]">
              <div>
                <h2 className="text-lg font-bold text-[#111311]">Edit Review</h2>
                <p className="text-xs text-[#5C605C]">{editingReview.product.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1.5 rounded-full text-[#5C605C] hover:bg-[#EDEDED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateState.error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{updateState.error}</span>
              </div>
            )}

            <form action={updateAction} className="space-y-3.5 text-xs">
              <input type="hidden" name="id" value={editingReview.id} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <select
                    name="rating"
                    defaultValue={editingReview.rating}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-mono"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Moderation Status *
                  </label>
                  <select
                    name="status"
                    defaultValue={editingReview.status}
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none font-mono"
                  >
                    <option value="APPROVED">APPROVED (Visible)</option>
                    <option value="PENDING">PENDING (Hidden)</option>
                    <option value="REJECTED">REJECTED (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    required
                    defaultValue={editingReview.authorName}
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    name="authorRole"
                    defaultValue={editingReview.authorRole || ""}
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono font-medium text-[#111311] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingReview.company || ""}
                    className="w-full px-3 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-medium text-[#111311] mb-1">
                  Title / Headline
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingReview.title || ""}
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-[#111311] mb-1">
                  Review Text *
                </label>
                <textarea
                  name="body"
                  required
                  rows={4}
                  defaultValue={editingReview.body}
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#EDEDED] text-xs text-[#111311] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EDEDED]">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-[#5C605C] hover:bg-[#EDEDED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs transition-colors disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Update Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
