'use client';

import React, { useState } from 'react';
import {
  createStatAction,
  updateStatAction,
  deleteStatAction,
  toggleStatActiveAction,
  markStatAsRealAction,
  reorderStatAction,
} from '@/app/admin/actions/content';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Check, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  labelBn?: string | null;
  value: number;

  prefix?: string | null;
  suffix?: string | null;
  description?: string | null;
  descriptionBn?: string | null;
  sortOrder: number;
  isActive: boolean;
  isSample: boolean;
}

export function StatsClient({ items }: { items: StatItem[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createStatAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setIsCreating(false);
    } else {
      setError(res.error || 'Failed to create statistic');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await updateStatAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || 'Failed to update statistic');
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-bold text-[#111311]'>Key Statistics ({items.length})</h2>
          <p className='text-xs text-[#5C605C]'>Ordered metrics shown in the public statistics band.</p>
        </div>
        <button
          type='button'
          onClick={() => { setIsCreating(true); setEditingId(null); setError(null); }}
          className='px-4 py-2 rounded-xl bg-[#111311] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-black transition-colors'
        >
          <Plus className='w-3.5 h-3.5' />
          <span>Add Stat</span>
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
            <h3 className='text-sm font-bold text-[#111311]'>New Metric</h3>
            <button type='button' onClick={() => setIsCreating(false)} className='text-[#5C605C] hover:text-[#111311]'>
              <X className='w-4 h-4' />
            </button>
          </div>
          <form onSubmit={handleCreate} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Label (English) *</label>
              <input name='label' required placeholder='e.g. Years in Business' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Label (বাংলা)</label>
              <input name='labelBn' lang='bn' placeholder='যেমন: ব্যবসায়িক অভিজ্ঞতা' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Numeric Value *</label>
              <input name='value' type='number' step='any' required placeholder='e.g. 10' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Prefix / Suffix</label>
              <div className='flex items-center gap-2'>
                <input name='prefix' placeholder='e.g. >' className='w-1/2 px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
                <input name='suffix' placeholder='e.g. +' className='w-1/2 px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Description (English)</label>
              <input name='description' placeholder='e.g. Continuous commercial operations' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div className='sm:col-span-2'>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Description (বাংলা)</label>
              <input name='descriptionBn' lang='bn' placeholder='যেমন: ধারাবাহিক শিল্প বাণিজ্যিক কার্যক্রম' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div className='flex items-end gap-2 md:col-span-4'>
              <button type='submit' disabled={isPending} className='py-2 px-6 rounded-xl bg-[#111311] text-white text-xs font-bold font-mono hover:bg-black disabled:opacity-50'>
                {isPending ? 'Saving...' : 'Save Stat'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='divide-y divide-[#EDEDED] bg-white rounded-2xl border border-[#DDE1DC] overflow-hidden shadow-sm'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-xs text-[#5C605C]'>No statistics added yet.</p>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
                  <input type='hidden' name='id' value={item.id} />
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Label (English)</label>
                    <input name='label' defaultValue={item.label} required className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Label (বাংলা)</label>
                    <input name='labelBn' lang='bn' defaultValue={item.labelBn || ''} placeholder='বাংলা লেবেল' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Value</label>
                    <input name='value' type='number' step='any' defaultValue={item.value} required className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Prefix / Suffix</label>
                    <div className='flex items-center gap-1.5'>
                      <input name='prefix' defaultValue={item.prefix || ''} placeholder='Prefix' className='w-1/2 px-2 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                      <input name='suffix' defaultValue={item.suffix || ''} placeholder='Suffix' className='w-1/2 px-2 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                    </div>
                  </div>
                  <div className='sm:col-span-2'>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Description (English)</label>
                    <input name='description' defaultValue={item.description || ''} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div className='sm:col-span-2'>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Description (বাংলা)</label>
                    <input name='descriptionBn' lang='bn' defaultValue={item.descriptionBn || ''} placeholder='বাংলা বিবরণ' className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div className='flex items-end gap-2 md:col-span-4'>
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
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col gap-1'>
                      <form action={reorderStatAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='up' />
                        <button disabled={idx === 0} type='submit' title='Move up' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowUp className='w-3.5 h-3.5' />
                        </button>
                      </form>
                      <form action={reorderStatAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='down' />
                        <button disabled={idx === items.length - 1} type='submit' title='Move down' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowDown className='w-3.5 h-3.5' />
                        </button>
                      </form>
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='text-base font-bold font-mono text-[#111311]'>
                          {item.prefix}{item.value}{item.suffix}
                        </span>
                        <span className='text-xs font-bold text-[#111311]'>&bull; {item.label}</span>
                        {item.labelBn && (
                          <span className='text-xs text-[#5C605C]' lang='bn'>({item.labelBn})</span>
                        )}
                        {item.labelBn ? (
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
                      {item.description && (
                        <p className='text-xs text-[#5C605C]'>{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 shrink-0'>
                    {item.isSample && (
                      <form action={markStatAsRealAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <button type='submit' title='Mark as real data' className='px-2.5 py-1.5 rounded-lg border border-emerald-600/30 text-emerald-700 bg-emerald-500/10 text-[11px] font-mono font-bold hover:bg-emerald-500/20 flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          <span>Mark as real</span>
                        </button>
                      </form>
                    )}
                    <form action={toggleStatActiveAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' title={item.isActive ? 'Hide from public site' : 'Show on public site'} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                        {item.isActive ? <Eye className='w-3.5 h-3.5' /> : <EyeOff className='w-3.5 h-3.5' />}
                      </button>
                    </form>
                    <button type='button' onClick={() => setEditingId(item.id)} title='Edit' className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <form action={deleteStatAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' onClick={(e) => { if (!confirm('Delete this statistic?')) e.preventDefault(); }} title='Delete this statistic' className='p-1.5 rounded-lg border border-[#DDE1DC] text-red-500 hover:bg-red-50'>
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