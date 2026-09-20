'use client';

import React, { useState } from 'react';
import { AppImage as Image } from '@/components/ui/app-image';
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
  markTestimonialAsRealAction,
  reorderTestimonialAction,
} from '@/app/admin/actions/content';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Check, Edit2, Trash2, X, AlertCircle, User } from 'lucide-react';

interface TestimonialItem {
  id: string;
  quote: string;
  quoteBn?: string | null;
  authorName: string;
  authorNameBn?: string | null;
  authorRole?: string | null;
  authorRoleBn?: string | null;
  company?: string | null;
  companyBn?: string | null;
  photo?: string | null;
  sortOrder: number;
  isActive: boolean;
  isSample: boolean;
}

export function TestimonialsClient({ items }: { items: TestimonialItem[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createTestimonialAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setIsCreating(false);
    } else {
      setError(res.error || 'Failed to create testimonial');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await updateTestimonialAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || 'Failed to update testimonial');
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-bold text-[#111311]'>Customer Testimonials ({items.length})</h2>
          <p className='text-xs text-[#5C605C]'>Buyer feedback displayed in the testimonials section.</p>
        </div>
        <button
          type='button'
          onClick={() => { setIsCreating(true); setEditingId(null); setError(null); }}
          className='px-4 py-2 rounded-xl bg-[#111311] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-black transition-colors'
        >
          <Plus className='w-3.5 h-3.5' />
          <span>Add Testimonial</span>
        </button>
      </div>

      {error && (
        <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 shrink-0' />
          <span>{error}</span>
        </div>
      )}

      {isCreating && (
        <div className='p-6 rounded-2xl bg-white border border-[#111311] shadow-md'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-bold text-[#111311]'>New Testimonial</h3>
            <button type='button' onClick={() => setIsCreating(false)} className='text-[#5C605C] hover:text-[#111311]'>
              <X className='w-4 h-4' />
            </button>
          </div>
          <form onSubmit={handleCreate} className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Author Name (English) *</label>
                <input name='authorName' required placeholder='e.g. John Doe' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Author Name (বাংলা)</label>
                <input name='authorNameBn' lang='bn' placeholder='যেমন: জন ডো' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Role (English)</label>
                <input name='authorRole' placeholder='e.g. Procurement Lead' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Role (বাংলা)</label>
                <input name='authorRoleBn' lang='bn' placeholder='যেমন: প্রকিউরমেন্ট লিড' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Company (English)</label>
                <input name='company' placeholder='e.g. Solar EPC Ltd' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Company (বাংলা)</label>
                <input name='companyBn' lang='bn' placeholder='যেমন: সোলার ইপিসি লি:' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Quote (English) *</label>
                <textarea name='quote' required rows={3} placeholder='Write quote text in English...' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Quote (বাংলা)</label>
                <textarea name='quoteBn' lang='bn' rows={3} placeholder='বাংলায় গ্রাহকের মন্তব্য লিখুন...' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-end'>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Photo (optional)</label>
                <input name='photo' type='file' accept='image/jpeg,image/png,image/webp' className='w-full text-xs text-[#5C605C] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#111311] file:text-white hover:file:bg-black' />
              </div>
              <div className='flex justify-end gap-2'>
                <button type='submit' disabled={isPending} className='py-2 px-6 rounded-xl bg-[#111311] text-white text-xs font-bold font-mono hover:bg-black disabled:opacity-50'>
                  {isPending ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className='divide-y divide-[#EDEDED] bg-white rounded-2xl border border-[#DDE1DC] overflow-hidden shadow-sm'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-xs text-[#5C605C]'>No testimonials added yet.</p>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className='w-full space-y-3'>
                  <input type='hidden' name='id' value={item.id} />
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Author Name (English)</label>
                      <input name='authorName' defaultValue={item.authorName} required className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Author Name (বাংলা)</label>
                      <input name='authorNameBn' lang='bn' defaultValue={item.authorNameBn || ''} placeholder='নাম (বাংলা)' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Role (English)</label>
                      <input name='authorRole' defaultValue={item.authorRole || ''} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Role (বাংলা)</label>
                      <input name='authorRoleBn' lang='bn' defaultValue={item.authorRoleBn || ''} placeholder='পদবী (বাংলা)' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Company (English)</label>
                      <input name='company' defaultValue={item.company || ''} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Company (বাংলা)</label>
                      <input name='companyBn' lang='bn' defaultValue={item.companyBn || ''} placeholder='প্রতিষ্ঠান (বাংলা)' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Quote (English)</label>
                      <textarea name='quote' defaultValue={item.quote} required rows={2} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Quote (বাংলা)</label>
                      <textarea name='quoteBn' lang='bn' defaultValue={item.quoteBn || ''} placeholder='মন্তব্য (বাংলা)' rows={2} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 items-end'>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Change Photo</label>
                      <input name='photo' type='file' accept='image/jpeg,image/png,image/webp' className='w-full text-xs text-[#5C605C] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-[#111311] file:text-white' />
                    </div>
                    <div className='flex justify-end gap-2'>
                      <button type='submit' disabled={isPending} className='px-3 py-1.5 rounded-lg bg-[#111311] text-white text-xs font-bold'>
                        Save
                      </button>
                      <button type='button' onClick={() => setEditingId(null)} className='px-3 py-1.5 rounded-lg bg-[#EDEDED] text-xs'>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div className='flex items-start gap-4'>
                    <div className='flex flex-col gap-1 pt-1'>
                      <form action={reorderTestimonialAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='up' />
                        <button disabled={idx === 0} type='submit' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowUp className='w-3.5 h-3.5' />
                        </button>
                      </form>
                      <form action={reorderTestimonialAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='down' />
                        <button disabled={idx === items.length - 1} type='submit' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowDown className='w-3.5 h-3.5' />
                        </button>
                      </form>
                    </div>

                    <div className='w-11 h-11 rounded-full bg-[#EDEDED] flex items-center justify-center shrink-0 border border-[#DDE1DC] relative overflow-hidden'>
                      {item.photo ? (
                        <Image src={item.photo} alt={item.authorName} fill className='object-cover' />
                      ) : (
                        <User className='w-4 h-4 text-[#A0A4A0]' />
                      )}
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='text-sm font-bold text-[#111311]'>{item.authorName}</span>
                        {(item.authorRole || item.company) && (
                          <span className='text-xs text-[#5C605C]'>
                            &bull; {[item.authorRole, item.company].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {item.quoteBn ? (
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300'>
                            BN ✓
                          </span>
                        ) : (
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300'>
                            BN missing
                          </span>
                        )}
                        {item.isSample && (
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700'>
                            SAMPLE
                          </span>
                        )}
                        {!item.isActive && (
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-mono text-[#5C605C] bg-[#EDEDED]'>
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-[#5C605C] italic leading-relaxed'>&ldquo;{item.quote}&rdquo;</p>
                      {item.quoteBn && (
                        <p className='text-xs text-[#5C605C] italic leading-relaxed' lang='bn'>&ldquo;{item.quoteBn}&rdquo;</p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 shrink-0 pt-1'>
                    {item.isSample && (
                      <form action={markTestimonialAsRealAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <button type='submit' title='Mark as real data' className='px-2.5 py-1.5 rounded-lg border border-emerald-600/30 text-emerald-700 bg-emerald-500/10 text-[11px] font-mono font-bold hover:bg-emerald-500/20 flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          <span>Mark as real</span>
                        </button>
                      </form>
                    )}
                    <form action={toggleTestimonialActiveAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' title={item.isActive ? 'Hide from public site' : 'Show on public site'} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                        {item.isActive ? <Eye className='w-3.5 h-3.5' /> : <EyeOff className='w-3.5 h-3.5' />}
                      </button>
                    </form>
                    <button type='button' onClick={() => setEditingId(item.id)} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <form action={deleteTestimonialAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' onClick={(e) => { if (!confirm('Delete this testimonial?')) e.preventDefault(); }} className='p-1.5 rounded-lg border border-[#DDE1DC] text-red-500 hover:bg-red-50'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </form>
                  </div>
                </> 
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}