"use client";

import React, { useState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  togglePublishProjectAction,
} from "@/app/admin/actions/projects";
import { Plus, Eye, EyeOff, Edit2, Trash2, X, AlertCircle, Building2, MapPin, Zap } from "lucide-react";
import type { Project } from "@prisma/client";

export function ProjectsClient({ items }: { items: Project[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createProjectAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setIsCreating(false);
    } else {
      setError(res.error || "Failed to create project");
    }
  }

  async function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await updateProjectAction(id, null, fd);
    setIsPending(false);
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || "Failed to update project");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111311]">
            Verified Project Supply References ({items.length})
          </h2>
          <p className="text-xs text-[#5C605C]">
            Completed commercial rooftop, factory, and MW supply references shown on the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setError(null);
          }}
          className="px-4 py-2 rounded-xl bg-[#111311] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-black transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project Record</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isCreating && (
        <div className="p-6 rounded-2xl bg-white border border-[#111311] shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#111311]">New Project Record</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-[#5C605C] hover:text-[#111311]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Project Title (EN) *</label>
              <input
                name="title"
                required
                placeholder="e.g. 500 kWp Rooftop Solar Supply"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Project Title (BN)</label>
              <input
                name="titleBn"
                placeholder="e.g. ৫০০ কিলোওয়াট রুফটপ সোলার সরবরাহ"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Client / Facility Name</label>
              <input
                name="clientName"
                placeholder="e.g. Apex Spinning & Weaving Mills"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Location</label>
              <input
                name="location"
                placeholder="e.g. Gazipur, Bangladesh"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Project Type</label>
              <input
                name="projectType"
                placeholder="e.g. Industrial Rooftop"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Capacity</label>
              <input
                name="capacity"
                placeholder="e.g. 500 kWp"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Products Supplied</label>
              <input
                name="productsSupplied"
                placeholder="e.g. 620W N-Type TOPCon Panels (810 pcs)"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Completion Date / Year</label>
              <input
                name="completionDate"
                placeholder="e.g. Q3 2024"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Image URL</label>
              <input
                name="image"
                placeholder="e.g. /photos/about-commercial-plant.webp"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-[11px] font-mono text-[#5C605C] mb-1">Short Summary (EN)</label>
              <textarea
                name="summary"
                rows={2}
                placeholder="Brief project details, equipment supply scope, and EPC partner info"
                className="w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isPublished" id="new_isPublished" defaultChecked />
              <label htmlFor="new_isPublished" className="text-xs font-mono text-[#111311]">
                Publish on Live Site
              </label>
            </div>
            <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl border border-[#DDE1DC] text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-[#111311] text-white text-xs font-bold"
              >
                {isPending ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#DDE1DC] space-y-2">
          <Building2 className="w-8 h-8 text-[#5C605C] mx-auto opacity-50" />
          <p className="text-sm font-bold text-[#111311]">Zero projects currently registered</p>
          <p className="text-xs text-[#5C605C] max-w-sm mx-auto">
            The public website cleanly hides the project section until real project references are added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white border flex flex-col justify-between ${
                p.isPublished ? "border-[#DDE1DC]" : "border-amber-300 opacity-75"
              }`}
            >
              <div>
                {p.image && (
                  <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden mb-3 bg-[#EDEDED]">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDEDED] text-[#111311]">
                    {p.projectType || "Commercial Supply"}
                  </span>
                  {p.capacity && (
                    <span className="text-[10px] font-mono font-bold text-[#111311] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#CEF23E]" />
                      {p.capacity}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#111311] mb-1">{p.title}</h4>
                {p.clientName && (
                  <p className="text-xs text-[#5C605C] flex items-center gap-1 mb-1">
                    <Building2 className="w-3 h-3" />
                    <span>{p.clientName}</span>
                  </p>
                )}
                {p.location && (
                  <p className="text-xs text-[#5C605C] flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{p.location}</span>
                  </p>
                )}
                {p.summary && <p className="text-xs text-[#5C605C] line-clamp-2">{p.summary}</p>}
              </div>

              <div className="pt-4 mt-3 border-t border-[#EDEDED] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePublishProjectAction(p.id, p.isPublished)}
                  className={`text-xs font-mono flex items-center gap-1 ${
                    p.isPublished ? "text-emerald-700 font-bold" : "text-amber-700"
                  }`}
                >
                  {p.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{p.isPublished ? "Published" : "Draft"}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteProjectAction(p.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
