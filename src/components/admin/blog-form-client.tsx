"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  uploadBlogInlineImageAction,
  BlogActionResult,
} from "@/app/admin/actions/blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import {
  Save,
  AlertCircle,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Eye,
  Edit3,
} from "lucide-react";

interface BlogFormClientProps {
  initialPost?: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    coverAlt?: string | null;
    tags?: string | null;
    status: string;
    authorName?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
}

const initialState: BlogActionResult = {
  success: false,
};

export function BlogFormClient({ initialPost }: BlogFormClientProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost);

  const actionFn = isEditing ? updateBlogPostAction : createBlogPostAction;
  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [titleVal, setTitleVal] = useState(initialPost?.title || "");
  const [slugVal, setSlugVal] = useState(initialPost?.slug || "");
  const [contentVal, setContentVal] = useState(
    initialPost?.content || "## Overview\n\nWrite your article here in Markdown..."
  );
  const [metaTitleVal, setMetaTitleVal] = useState(initialPost?.metaTitle || "");
  const [metaDescVal, setMetaDescVal] = useState(initialPost?.metaDescription || "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSuccess = state.success;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !saveSuccess) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveSuccess]);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/blog");
        router.refresh();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleTitleChange = (val: string) => {
    setTitleVal(val);
    markDirty();
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
      setSlugVal(generated);
    }
  };

  // Markdown Toolbar helper to insert syntax around selection
  const insertSyntax = (before: string, after: string = "", placeholder: string = "") => {
    markDirty();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const selectedText = currentText.substring(start, end) || placeholder;
    const replacement = `${before}${selectedText}${after}`;

    const nextText = currentText.substring(0, start) + replacement + currentText.substring(end);
    setContentVal(nextText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadBlogInlineImageAction(fd);
      if (res.success && res.imageUrl) {
        insertSyntax(`\n![${file.name.replace(/\.[^/.]+$/, "")}](${res.imageUrl})\n`, "");
      } else {
        alert(res.error || "Failed to upload image.");
      }
    } catch {
      alert("Error uploading image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form
      action={(fd) => {
        setIsDirty(false);
        formAction(fd);
      }}
      encType="multipart/form-data"
      className="space-y-8"
      onChange={markDirty}
    >
      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-bold">Validation Error</p>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          Post saved successfully. Redirecting to blog dashboard...
        </div>
      )}

      {isDirty && !isPending && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>You have unsaved changes in this post.</span>
          <span className="font-mono text-[10px] text-amber-700 uppercase tracking-wider">Unsaved</span>
        </div>
      )}

      {isEditing && <input type="hidden" name="id" value={initialPost?.id} />}

      {/* Basic Post Metadata */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          1. Article Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Post Title *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              value={titleVal}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Choose Industrial Solar Inverters for Bangladeshi Factories"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none focus:ring-1 focus:ring-[#111311]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              value={slugVal}
              onChange={(e) => {
                setSlugVal(e.target.value);
                markDirty();
              }}
              placeholder="how-to-choose-industrial-solar-inverters"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] font-mono outline-none focus:ring-1 focus:ring-[#111311]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Publication Status *
            </label>
            <select
              name="status"
              defaultValue={initialPost?.status || "DRAFT"}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none font-mono"
            >
              <option value="DRAFT">DRAFT (Hidden from Public)</option>
              <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Author Name
            </label>
            <input
              type="text"
              name="authorName"
              defaultValue={initialPost?.authorName || "Noor Solar Engineering Team"}
              placeholder="e.g. Eng. Tarek Rahman"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Tags (Comma-Separated)
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={initialPost?.tags || "Solar, Inverters, Commercial"}
              placeholder="Inverters, TOPCon, Battery"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
            Excerpt / Summary (Article Preview)
          </label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={initialPost?.excerpt || ""}
            placeholder="A concise summary explaining the engineering factors when sizing solar inverters for high-load commercial facilities."
            className="w-full px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          2. Cover Artwork
        </h2>

        <div className="p-5 rounded-3xl bg-[#EDEDED]/60 border border-[#DDE1DC] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Upload New Cover Image (JPEG, PNG, WebP)
              </label>
              <input
                type="file"
                name="coverFile"
                accept="image/jpeg,image/png,image/webp"
                className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#111311] file:text-[#CEF23E] hover:file:bg-[#222622] file:cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
                Or Cover Image URL
              </label>
              <input
                type="text"
                name="coverImageUrl"
                defaultValue={initialPost?.coverImage || ""}
                placeholder="/photos/hero_commercial_rooftop_solar.jpg"
                className="w-full px-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-[#111311] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#111311] mb-1.5">
              Cover Alt Text
            </label>
            <input
              type="text"
              name="coverAlt"
              defaultValue={initialPost?.coverAlt || ""}
              placeholder="Rooftop solar installation at industrial facility"
              className="w-full px-4 py-2 rounded-2xl bg-white text-xs text-[#111311] outline-none"
            />
          </div>

          {initialPost?.coverImage && (
            <div className="flex items-center gap-3 pt-2 border-t border-[#DDE1DC]">
              <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-white border border-[#DDE1DC]">
                <Image
                  src={initialPost.coverImage}
                  alt={initialPost.coverAlt || "Current cover"}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-mono text-[#5C605C]">Current Cover Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Markdown Content Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDEDED]">
          <h2 className="text-sm font-mono font-bold uppercase text-[#111311]">
            3. Article Content (Markdown)
          </h2>

          {/* Edit / Preview Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#EDEDED] rounded-xl border border-[#DDE1DC]">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "edit"
                  ? "bg-white text-[#111311] font-bold shadow-xs"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "preview"
                  ? "bg-white text-[#111311] font-bold shadow-xs"
                  : "text-[#5C605C] hover:text-[#111311]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>

        {activeTab === "edit" ? (
          <div className="rounded-3xl border border-[#DDE1DC] overflow-hidden bg-white shadow-xs">
            {/* Toolbar */}
            <div className="p-2.5 bg-[#EDEDED] border-b border-[#DDE1DC] flex flex-wrap items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => insertSyntax("## ", "", "Heading 2")}
                title="Heading 2"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax("### ", "", "Heading 3")}
                title="Heading 3"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-[#DDE1DC] mx-1" />
              <button
                type="button"
                onClick={() => insertSyntax("**", "**", "bold text")}
                title="Bold"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax("*", "*", "italic text")}
                title="Italic"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-[#DDE1DC] mx-1" />
              <button
                type="button"
                onClick={() => insertSyntax("- ", "", "List item")}
                title="Bullet List"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax("1. ", "", "Ordered item")}
                title="Numbered List"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertSyntax("> ", "", "Quote text")}
                title="Blockquote"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <Quote className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-[#DDE1DC] mx-1" />
              <button
                type="button"
                onClick={() => insertSyntax("[", "](https://example.com)", "Link text")}
                title="Insert Link"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              {/* Upload image and insert URL into markdown */}
              <label
                title="Upload image into article"
                className="p-1.5 rounded-lg hover:bg-white text-[#111311] cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[11px] font-mono">
                  {isUploadingImage ? "Uploading..." : "Insert Image"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Markdown Textarea */}
            <textarea
              ref={textareaRef}
              name="content"
              required
              rows={14}
              value={contentVal}
              onChange={(e) => {
                setContentVal(e.target.value);
                markDirty();
              }}
              placeholder="Write your article in Markdown..."
              className="w-full p-4 text-sm font-mono text-[#111311] outline-none resize-y leading-relaxed bg-white"
            />
          </div>
        ) : (
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#DDE1DC] shadow-xs min-h-[350px]">
            <MarkdownRenderer content={contentVal} />
          </div>
        )}
      </div>

      {/* SEO Fields */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-[#111311] pb-2 border-b border-[#EDEDED]">
          4. Search Engine Optimization (SEO)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Custom Meta Title
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaTitleVal.length}/60
              </span>
            </div>
            <input
              type="text"
              name="metaTitle"
              value={metaTitleVal}
              onChange={(e) => {
                setMetaTitleVal(e.target.value);
                markDirty();
              }}
              placeholder={titleVal ? `${titleVal} | Noor Solar Energy` : "Title for search engines"}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-medium text-[#111311]">
                Meta Description
              </label>
              <span className="text-[10px] font-mono text-[#5C605C]">
                {metaDescVal.length}/160
              </span>
            </div>
            <textarea
              name="metaDescription"
              rows={2}
              value={metaDescVal}
              onChange={(e) => {
                setMetaDescVal(e.target.value);
                markDirty();
              }}
              placeholder="Search snippet summary..."
              className="w-full px-4 py-2 rounded-2xl bg-[#EDEDED] text-xs sm:text-sm text-[#111311] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[#EDEDED] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          id="btn-save-blog"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111311] hover:bg-[#222622] text-[#CEF23E] font-semibold text-xs tracking-tight transition-all disabled:opacity-60 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving Article..." : isEditing ? "Update Article" : "Save Article"}</span>
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to delete "${initialPost?.title}"? This cannot be undone.`
                )
              ) {
                const fd = new FormData();
                fd.append("id", initialPost!.id);
                deleteBlogPostAction(fd);
              }
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-mono text-red-600 hover:bg-red-50 transition-colors text-center"
          >
            Delete Article
          </button>
        )}
      </div>
    </form>
  );
}
