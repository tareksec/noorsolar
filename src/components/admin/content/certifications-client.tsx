'use client';

import React, { useState } from 'react';
import { AppImage as Image } from '@/components/ui/app-image';
import {
  createCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
  toggleCertificationActiveAction,
  markCertificationAsRealAction,
  reorderCertificationAction,
} from '@/app/admin/actions/content';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Check, Edit2, Trash2, X, AlertCircle, Upload } from 'lucide-react';

interface CertItem {
  id: string;
  name: string;
  issuer?: string | null;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  isSample: boolean;
}

export function CertificationsClient({ items }: { items: CertItem[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createCertificationAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setIsCreating(false);
    } else {
      setError(res.error || 'Failed to create certification');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await updateCertificationAction(null, fd);
    setIsPending(false);
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || 'Failed to update certification');
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-bold text-[#111311]'>Certifications & Accreditations ({items.length})</h2>
          <p className='text-xs text-[#5C605C]'>Certificates and standards displayed on the homepage and about page.</p>
        </div>
        <button
          type='button'
          onClick={() => { setIsCreating(true); setEditingId(null); setError(null); }}
          className='px-4 py-2 rounded-xl bg-[#111311] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-black transition-colors'
        >
          <Plus className='w-3.5 h-3.5' />
          <span>Add Certificate</span>
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
            <h3 className='text-sm font-bold text-[#111311]'>New Certification</h3>
            <button type='button' onClick={() => setIsCreating(false)} className='text-[#5C605C] hover:text-[#111311]'>
              <X className='w-4 h-4' />
            </button>
          </div>
          <form onSubmit={handleCreate} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Name *</label>
              <input name='name' required placeholder='e.g. Quality Management Certificate' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Issuer (optional)</label>
              <input name='issuer' placeholder='e.g. Standard Inspection Board' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Upload Badge Image</label>
              <input name='image' type='file' accept='image/jpeg,image/png,image/webp' className='w-full text-xs text-[#5C605C] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#111311] file:text-white hover:file:bg-black' />
            </div>
            <div className='sm:col-span-2 md:col-span-2'>
              <label className='block text-[11px] font-mono text-[#5C605C] mb-1'>Description (optional)</label>
              <input name='description' placeholder='e.g. ISO 9001 certified commercial operations' className='w-full px-3 py-2 rounded-xl border border-[#DDE1DC] text-xs' />
            </div>
            <div className='flex items-end gap-2'>
              <button type='submit' disabled={isPending} className='w-full py-2 px-4 rounded-xl bg-[#111311] text-white text-xs font-bold font-mono hover:bg-black disabled:opacity-50'>
                {isPending ? 'Saving...' : 'Save Certification'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='divide-y divide-[#EDEDED] bg-white rounded-2xl border border-[#DDE1DC] overflow-hidden shadow-sm'>
        {items.length === 0 ? (
          <p className='p-8 text-center text-xs text-[#5C605C]'>No certifications added yet.</p>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                  <input type='hidden' name='id' value={item.id} />
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Name</label>
                    <input name='name' defaultValue={item.name} required className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Issuer</label>
                    <input name='issuer' defaultValue={item.issuer || ''} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Change Image</label>
                    <input name='image' type='file' accept='image/jpeg,image/png,image/webp' className='w-full text-xs text-[#5C605C] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-[#111311] file:text-white' />
                  </div>
                  <div className='sm:col-span-2'>
                    <label className='block text-[10px] font-mono text-[#5C605C]'>Description</label>
                    <input name='description' defaultValue={item.description || ''} className='w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1DC] text-xs' />
                  </div>
                  <div className='flex items-end gap-2'>
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
                      <form action={reorderCertificationAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='up' />
                        <button disabled={idx === 0} type='submit' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowUp className='w-3.5 h-3.5' />
                        </button>
                      </form>
                      <form action={reorderCertificationAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <input type='hidden' name='direction' value='down' />
                        <button disabled={idx === items.length - 1} type='submit' className='p-1 text-[#5C605C] hover:text-[#111311] disabled:opacity-20'>
                          <ArrowDown className='w-3.5 h-3.5' />
                        </button>
                      </form>
                    </div>

                    <div className='w-12 h-12 rounded-xl bg-[#EDEDED] p-1 flex items-center justify-center shrink-0 border border-[#DDE1DC] relative overflow-hidden'>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className='object-contain p-1' />
                      ) : (
                        <Upload className='w-4 h-4 text-[#A0A4A0]' />
                      )}
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold text-[#111311]'>{item.name}</span>
                        {item.issuer && (
                          <span className='text-xs text-[#5C605C] font-mono'>({item.issuer})</span>
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
                      <form action={markCertificationAsRealAction}>
                        <input type='hidden' name='id' value={item.id} />
                        <button type='submit' title='Mark as real data' className='px-2.5 py-1.5 rounded-lg border border-emerald-600/30 text-emerald-700 bg-emerald-500/10 text-[11px] font-mono font-bold hover:bg-emerald-500/20 flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          <span>Mark as real</span>
                        </button>
                      </form>
                    )}
                    <form action={toggleCertificationActiveAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' title={item.isActive ? 'Hide from public site' : 'Show on public site'} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                        {item.isActive ? <Eye className='w-3.5 h-3.5' /> : <EyeOff className='w-3.5 h-3.5' />}
                      </button>
                    </form>
                    <button type='button' onClick={() => setEditingId(item.id)} className='p-1.5 rounded-lg border border-[#DDE1DC] text-[#5C605C] hover:text-[#111311]'>
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <form action={deleteCertificationAction}>
                      <input type='hidden' name='id' value={item.id} />
                      <button type='submit' onClick={(e) => { if (!confirm('Delete this certification?')) e.preventDefault(); }} className='p-1.5 rounded-lg border border-[#DDE1DC] text-red-500 hover:bg-red-50'>
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