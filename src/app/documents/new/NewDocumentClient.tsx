'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, UserPlus, Trash2, ArrowLeft, ArrowRight, Send, PenLine, FileCheck, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface Recipient {
  id: string
  name: string
  email: string
  signing_order: number
}

export default function NewDocumentClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([{ id: crypto.randomUUID(), name: '', email: '', signing_order: 1 }])
  const [sequential, setSequential] = useState(false)
  const [requiresNotarization, setRequiresNotarization] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = useCallback((f: File | null) => {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Only PDF files are supported.'); return }
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10MB.'); return }
    setError('')
    setFile(f)
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0] ?? null
    validateAndSetFile(dropped)
  }

  const addRecipient = () => {
    const nextOrder = recipients.length + 1
    setRecipients(prev => [...prev, { id: crypto.randomUUID(), name: '', email: '', signing_order: nextOrder }])
  }

  const removeRecipient = (id: string) => {
    if (recipients.length === 1) return
    setRecipients(prev => {
      const filtered = prev.filter(r => r.id !== id)
      return filtered.map((r, i) => ({ ...r, signing_order: i + 1 }))
    })
  }

  const updateRecipient = (id: string, field: 'name' | 'email', value: string) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const moveRecipient = (id: string, direction: 'up' | 'down') => {
    setRecipients(prev => {
      const idx = prev.findIndex(r => r.id === id)
      if (idx === -1) return prev
      if (direction === 'up' && idx === 0) return prev
      if (direction === 'down' && idx === prev.length - 1) return prev
      const next = [...prev]
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next.map((r, i) => ({ ...r, signing_order: i + 1 }))
    })
  }

  const handleCreate = async () => {
    setError('')
    const validRecipients = recipients.filter(r => r.name.trim() && r.email.trim())
    if (!title.trim()) { setError('Please enter a document title.'); return }
    if (validRecipients.length === 0) { setError('Add at least one recipient.'); return }
    if (!file) { setError('Please upload a PDF.'); return }

    setCreating(true)
    try {
      const createRes = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          user_id: userId,
          recipients: validRecipients.map((r, i) => ({ name: r.name, email: r.email, signing_order: i + 1 })),
          sequential_signing: sequential,
          notarization_required: requiresNotarization,
        }),
      })
      if (!createRes.ok) throw new Error((await createRes.json()).error ?? 'Failed to create document')
      const doc = await createRes.json()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_id', doc.id)
      const uploadRes = await fetch('/api/documents/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('PDF upload failed')

      router.push(`/documents/${doc.id}/fields`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setCreating(false)
    }
  }

  const steps = ['Upload', 'Recipients', 'Place Fields', 'Send']

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-6 h-6 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <PenLine size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm">New Document</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  i + 1 < step ? 'bg-[#7c3aed] border-[#7c3aed] text-white' :
                  i + 1 === step ? 'border-[#7c3aed] text-[#7c3aed] bg-transparent' :
                  'border-[#333] text-[#555] bg-transparent'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-1 ${i + 1 === step ? 'text-white' : 'text-[#555]'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mt-[-10px] ${i + 1 < step ? 'bg-[#7c3aed]' : 'bg-[#333]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Upload your document</h2>
              <p className="text-[#888] text-sm">Start with a PDF — you&apos;ll place signature fields in the next step</p>
            </div>
            <div>
              <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Service Agreement — Acme Corp"
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">PDF File *</label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => validateAndSetFile(e.target.files?.[0] ?? null)}
              />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer select-none transition-all ${
                  isDragging
                    ? 'border-[#7c3aed] bg-[#7c3aed]/10 scale-[1.01]'
                    : file
                    ? 'border-[#7c3aed]/60 bg-[#7c3aed]/5 hover:border-[#7c3aed]/80'
                    : 'border-[#333] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5'
                }`}
              >
                {isDragging ? (
                  <>
                    <Upload size={28} className="mx-auto mb-3 text-[#7c3aed] animate-bounce" />
                    <p className="text-[#7c3aed] font-semibold text-sm">Drop it here</p>
                  </>
                ) : file ? (
                  <>
                    <FileCheck size={28} className="mx-auto mb-3 text-[#7c3aed]" />
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-[#888] text-xs mt-1">{(file.size / 1024).toFixed(0)} KB · Click or drag to replace</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="mx-auto mb-3 text-[#555]" />
                    <p className="text-white font-medium text-sm">Drag & drop your PDF here</p>
                    <p className="text-[#888] text-xs mt-1.5">or <span className="text-[#7c3aed]">click to browse</span> · PDF only · Max 10MB</p>
                  </>
                )}
              </div>
            </div>
            {/* Requires notarization toggle */}
            <div
              onClick={() => setRequiresNotarization(n => !n)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                requiresNotarization ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-[#222] bg-[#111] hover:border-[#333]'
              }`}
            >
              <div className={`mt-0.5 w-10 h-6 rounded-full relative transition-colors shrink-0 ${requiresNotarization ? 'bg-indigo-500' : 'bg-[#333]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${requiresNotarization ? 'left-5' : 'left-1'}`} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">This document requires notarization</p>
                <p className="text-[#888] text-xs mt-0.5 leading-relaxed">
                  Real estate deeds, powers of attorney, affidavits, loan documents. Enables RON via Proof.com after signing.
                </p>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={() => {
                if (!title.trim()) { setError('Please enter a document title.'); return }
                if (!file) { setError('Please upload a PDF.'); return }
                setError('')
                setStep(2)
              }}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Next: Add Recipients <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Recipients */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Add recipients</h2>
              <p className="text-[#888] text-sm">Who needs to sign this document?</p>
            </div>

            {/* Sequential signing toggle */}
            <div
              onClick={() => setSequential(s => !s)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                sequential ? 'border-[#7c3aed]/60 bg-[#7c3aed]/5' : 'border-[#222] bg-[#111] hover:border-[#333]'
              }`}
            >
              <div className={`mt-0.5 w-10 h-6 rounded-full relative transition-colors shrink-0 ${sequential ? 'bg-[#7c3aed]' : 'bg-[#333]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sequential ? 'left-5' : 'left-1'}`} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sequential signing</p>
                <p className="text-[#888] text-xs mt-0.5">Signers are notified one at a time, in order. Signer 2 is not notified until Signer 1 completes.</p>
              </div>
            </div>

            <div className="space-y-3">
              {recipients.map((r, i) => (
                <div key={r.id} className="bg-[#111] border border-[#222] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {sequential && (
                        <span className="w-6 h-6 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[#7c3aed] text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                      )}
                      <span className="text-xs text-[#888] uppercase tracking-widest">
                        {sequential ? `Signs ${i === 0 ? 'first' : i === 1 ? 'second' : i === 2 ? 'third' : `${i + 1}th`}` : `Recipient ${i + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {sequential && recipients.length > 1 && (
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveRecipient(r.id, 'up')}
                            disabled={i === 0}
                            className="p-0.5 text-[#555] hover:text-white disabled:opacity-30 transition-colors"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveRecipient(r.id, 'down')}
                            disabled={i === recipients.length - 1}
                            className="p-0.5 text-[#555] hover:text-white disabled:opacity-30 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      )}
                      {recipients.length > 1 && (
                        <button onClick={() => removeRecipient(r.id)} className="text-[#555] hover:text-red-400 transition-colors ml-1">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#888] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={r.name}
                        onChange={e => updateRecipient(r.id, 'name', e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#888] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={r.email}
                        onChange={e => updateRecipient(r.id, 'email', e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addRecipient}
                className="w-full border border-dashed border-[#333] hover:border-[#7c3aed]/40 rounded-xl py-3 text-sm text-[#888] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={14} /> Add another recipient
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-[#333] text-[#888] hover:text-white py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {creating ? 'Creating…' : (<><Send size={16} /> Create & Place Fields</>)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
