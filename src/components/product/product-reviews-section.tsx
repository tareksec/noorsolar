"use client";

import React, { useState, useActionState } from "react";
import { Star, MessageSquare, CheckCircle2, AlertCircle, Send, ChevronDown } from "lucide-react";
import { submitPublicReviewAction, ReviewActionResult } from "@/app/actions/reviews";
import { useLocale } from "next-intl";

interface ReviewItem {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
}

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  reviews: ReviewItem[];
  totalReviews: number;
  averageRating: number;
  publicSubmissionEnabled: boolean;
}

const initialSubmitState: ReviewActionResult = {
  success: false,
};

export function ProductReviewsSection({
  productId,
  productName,
  reviews,
  totalReviews,
  averageRating,
  publicSubmissionEnabled,
}: ProductReviewsSectionProps) {
  let locale = "en";
  try {
    const l = useLocale();
    if (l) locale = l;
  } catch {
    // fallback
  }
  const isBn = locale === "bn";

  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [state, formAction, isPending] = useActionState(
    submitPublicReviewAction,
    initialSubmitState
  );

  const isFormVisible = showForm && !state.success;

  // Section only rendered when at least one approved review exists or public submission is enabled
  if (totalReviews === 0 && !publicSubmissionEnabled) {
    return null;
  }

  return (
    <section className="mb-20">
      <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#DDE1DC] shadow-sm">
        
        {/* Section Header with Aggregates & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[#EDEDED]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#EDEDED] text-[11px] font-mono text-[#111311]">
                {isBn ? "গ্রাহকদের মতামত" : "Customer Feedback"}
              </span>
              {totalReviews > 0 && (
                <span className="text-xs font-mono text-[#5C605C]">
                  {isBn ? `${totalReviews}টি যাচাইকৃত রিভিউ` : `${totalReviews} Verified ${totalReviews === 1 ? "Review" : "Reviews"}`}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111311]">
              {isBn ? "কর্মক্ষমতা ও গ্রাহক রেটিং" : "Performance & Client Ratings"}
            </h2>

            {totalReviews > 0 ? (
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-[#111311] font-mono">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-[#5C605C] font-mono">{isBn ? "৫.০ এর মধ্যে" : "out of 5.0"}</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-[#5C605C] mt-2">
                {isBn
                  ? "এখনও কোনো গ্রাহক রিভিউ নেই। আপনার অভিজ্ঞতা শেয়ার করতে প্রথম রিভিউ দিন।"
                  : "No customer reviews yet. Be the first partner or client to submit feedback."}
              </p>
            )}
          </div>

          {publicSubmissionEnabled && (
            <button
              type="button"
              id="btn-write-review"
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all self-start sm:self-auto shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showForm ? (isBn ? "বাতিল করুন" : "Cancel Review") : (isBn ? "রিভিউ লিখুন" : "Write a Review")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showForm ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Success Alert Banner */}
        {state.success && (
          <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-bold">{isBn ? "আপনার মতামতের জন্য ধন্যবাদ!" : "Thank you for your feedback!"}</p>
              <p>{state.message || (isBn ? "আপনার রিভিউ জমা হয়েছে। যাচাইয়ের পর এটি প্রদর্শিত হবে।" : "Your review has been submitted for moderation and will appear once verified.")}</p>
            </div>
          </div>
        )}

        {/* Public Review Submission Form */}
        {publicSubmissionEnabled && isFormVisible && (
          <form action={formAction} className="my-8 p-6 sm:p-8 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-4">
            <h3 className="text-base font-bold text-[#111311]">
              {isBn ? `${productName}-এর জন্য রিভিউ দিন` : `Submit Feedback for ${productName}`}
            </h3>

            {state.error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{state.error}</span>
              </div>
            )}

            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="locale" value={locale} />

            {/* Honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Leave empty</label>
              <input
                type="text"
                id="website_hp"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-2">
                {isBn ? "আপনার সামগ্রিক রেটিং *" : "Your Overall Rating *"}
              </label>
              <input type="hidden" name="rating" value={selectedRating} />
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:bg-white transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || selectedRating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-[#5C605C] ml-2">
                  {isBn ? `৫ তারকার মধ্যে ${selectedRating}` : `${selectedRating} of 5 Stars`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  {isBn ? "আপনার পূর্ণ নাম *" : "Your Full Name *"}
                </label>
                <input
                  type="text"
                  name="authorName"
                  required
                  placeholder={isBn ? "যেমন: প্রকৌশলী তানভীর আহমেদ" : "e.g. Engr. Tanvir Ahmed"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  {isBn ? "পদবী / ভূমিকা (ঐচ্ছিক)" : "Role / Designation (Optional)"}
                </label>
                <input
                  type="text"
                  name="authorRole"
                  placeholder={isBn ? "প্রকল্প পরিচালক / লিড ইঞ্জিনিয়ার" : "Project Director / EPC Engineer"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                  {isBn ? "প্রতিষ্ঠান / সংস্থা (ঐচ্ছিক)" : "Company / Organization (Optional)"}
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder={isBn ? "সোলার ইপিসি বাংলাদেশ লি." : "Solar EPC Bangladesh Ltd."}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                {isBn ? "রিভিউ শিরোনাম (ঐচ্ছিক)" : "Headline / Summary (Optional)"}
              </label>
              <input
                type="text"
                name="title"
                placeholder={isBn ? "উন্নত বিদ্যুৎ ফলন ও টেকসই মডিউল ফ্রেম" : "High generation yield and sturdy module frames"}
                className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                {isBn ? "বিস্তারিত রিভিউ *" : "Detailed Review *"}
              </label>
              <textarea
                name="body"
                required
                rows={4}
                minLength={10}
                maxLength={2000}
                placeholder={
                  isBn
                    ? "পণ্যের কর্মক্ষমতা, বিল্ড কোয়ালিটি ও ইনস্টলেশনের অভিজ্ঞতা শেয়ার করুন..."
                    : "Share your experience with product efficiency, build quality, and installation performance..."
                }
                className="w-full px-4 py-3 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#5C605C]">
                {isBn
                  ? "সব রিভিউ প্রকাশের আগে প্রকৌশলী দ্বারা যাচাই করা হয়। কেবল আসল প্রকল্পের মতামত গ্রহণযোগ্য।"
                  : "Submissions are screened by engineers before publishing. Only genuine project feedback is accepted."}
              </span>
              <button
                type="submit"
                id="btn-submit-public-review"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all disabled:opacity-60 shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPending ? (isBn ? "জমা হচ্ছে..." : "Submitting...") : (isBn ? "রিভিউ জমা দিন" : "Submit Review")}</span>
              </button>
            </div>
          </form>
        )}

        {/* Approved Reviews List */}
        {reviews.length > 0 && (
          <div className="divide-y divide-[#EDEDED] mt-6">
            {reviews.map((review) => (
              <div key={review.id} className="py-6 first:pt-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-[#5C605C]">
                    {new Date(review.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {review.title && (
                  <h4 className="text-sm sm:text-base font-bold text-[#111311] mb-1.5">
                    {review.title}
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-[#383D38] leading-relaxed mb-3 whitespace-pre-line">
                  {review.body}
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-[#5C605C]">
                  <span className="font-semibold text-[#111311]">{review.authorName}</span>
                  {review.authorRole && <span>&bull; {review.authorRole}</span>}
                  {review.company && <span>@ {review.company}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
