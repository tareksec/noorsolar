'use client';

import React, { useState } from 'react';
import {
  createFaqItemAction,
  updateFaqItemAction,
  deleteFaqItemAction,
  toggleFaqItemActiveAction,
  markFaqItemAsRealAction,
  reorderFaqItemAction,
} from '@/app/admin/actions/content';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Check, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface FaqItemData {
  id: string;
  question: string;
  questionBn?: string | null;
  answer: string;
  answerBn?: string | null;
  sortOrder: number;
  isActive: boolean;
  isSample: boolean;
}

export function FaqClient({ items }: { items: FaqItemData[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createFaqItemAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setIsCreating(false);
    } else {
      setError(res.error || 'Failed to create FAQ item');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await updateFaqItemAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || 'Failed to update FAQ item');
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-bold text-[#111311]'>FAQ Knowledge Base ({items.length})</h2>
          <p className='text-xs text-[#5C605C]'>Accordion questions and answers on ordering, delivery, and support.</p>
        </div>
        <button
          type='button'
          onClick={() => { setIsCreating(true); setEditingId(null); setError(null); }}
          className='px-4 py-2 rounded-xl bg-[#111311] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-black transition-colors'
        >
          <Plus className='w-3.5 h-3.5' />
          <span>Add FAQ</span>
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
            <h3 className='text-sm font-bold text-[#111311]'>New FAQ Item</h3>
            <button type='button' onClick={() => setIsCreating(false)} className='text-[#5C605C] hover:text-[#111311]'>
              <X className='w-4 h-4' />
            </button>
          </div>
          <form onSubmit={handleCreate} className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Question (English) *</label>
                <input name='question' required placeholder='e.g. How does the quotation process work?' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Question (বাংলা)</label>
                <input name='questionBn' lang='bn' placeholder='যেমন: কীভাবে কোটেশন প্রক্রিয়া কাজ করে?' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Answer (English) *</label>
                <textarea name='answer' required rows={3} placeholder='Write answer in English...' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
              <div>
                <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Answer (বাংলা)</label>
                <textarea name='answerBn' lang='bn' rows={3} placeholder='বাংলায় উত্তর লিখুন...' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <button type='submit' disabled={isPending} className='py-2 px-6 rounded-xl bg-[#111311] text-white text-xs font-bold font-mono hover:bg-black disabled:opacity-50'>
                {isPending ? 'Saving...' : 'Save FAQ Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='divide-y divide-[#EDEDED] bg-white rounded-2xl border border-[#DDE1DC] overflow-hidden shadow-sm'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-xs text-[#5C605C]'>No FAQ items added yet.</p>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className='w-full space-y-3'>
                  <input type='hidden' name='id' value={item.id} />
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Question (English)</label>
                      <input name='question' defaultValue={item.question} required className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Question (বাংলা)</label>
                      <input name='questionBn' lang='bn' defaultValue={item.questionBn || ''} placeholder='প্রশ্ন (বাংলা)' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Answer (English)</label>
                      <textarea name='answer' defaultValue={item.answer} required rows={3} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                    <div>
                      <label className='block text-[10px] font-mono text-[#5C605C]'>Answer (বাংলা)</label>
                      <textarea name='answerBn' lang='bn' defaultValue={item.answerBn || ''} placeholder='উত্তর (বাংলা)' rows={3} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                  </div>
                  <div className='flex justify-end gap-2'>
                    <button type='submit' disabled={isPending} className='px-3 py-1.5 rounded-lg bg-[#111311] text-white text-xs font-bold'>
                      Save
                    </button>
                    <button type='button' onClick={() => setEditingId(null)} className='px-3 py-1.5 rounded-lg bg-[#EDEDED] text-xs'>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className='flex items-start gap-4'>
                    <div className='flex flex-col gap-1 pt-1'>
                      <form action={reorderFaqItemAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='up' />
                        <button disabled={idx === 0} type='submit' title='Move up' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowUp className='w-3.5 h-3.5' />
                        </button>
                      </form>
                      <form action={reorderFaqItemAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='down' />
                        <button disabled={idx === items.length - 1} type='submit' title='Move down' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowDown className='w-3.5 h-3.5' />
                        </button>
                      </form>
                    </div>

                    <div className='space-y-1.5'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='text-sm font-bold text-[#111311]'>{item.question}</span>
                        {item.questionBn ? (
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
                      {item.questionBn && (
                        <p className='text-xs font-semibold text-[#5C605C]' lang='bn'>{item.questionBn}</p>
                      )}
                      <p className='text-xs text-[#5C605C] leading-relaxed'>{item.answer}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 shrink-0 pt-1'>
                    {item.isSample && (
                      <form action={markFaqItemAsRealAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <button type='submit' title='Mark as real data' className='px-2.5 py-1.5 rounded-lg border border-emerald-600/30 text-emerald-700 bg-emerald-500/10 text-[11px] font-mono font-bold hover:bg-emerald-500/20 flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          <span>Mark as real</span>
                        </button>
                      </form>
                    )}
                    <form action={toggleFaqItemActiveAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' title={item.isActive ? 'Hide from public site' : 'Show on public site'} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                        {item.isActive ? <Eye className='w-3.5 h-3.5' /> : <EyeOff className='w-3.5 h-3.5' />}
                      </button>
                    </form>
                    <button type='button' onClick={() => setEditingId(item.id)} title='Edit' className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <form action={deleteFaqItemAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' onClick={(e) => { if (!confirm('Delete this FAQ item?')) e.preventDefault(); }} title='Delete this FAQ item' className='p-1.5 rounded-lg border border-[#DDE1DC] text-red-500 hover:bg-red-50'>
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