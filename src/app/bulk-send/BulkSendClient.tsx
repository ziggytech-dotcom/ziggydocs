'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileCheck, Trash2, UserPlus, Send, CheckCircle } from 'lucide-react'

interface Recipient {
  id: string
  name: string
  email: string
}

export default function BulkSendClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: crypto.randomUUID(), name: '', email: '' },
  ])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = useCallback((f: File | null) => {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Only PDF files are supported.'); return }
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10MB.'); return }
    setError('')
    setFile(f)
  }, [])

  const addRecipient = () =>
    setRecipients(prev => [...prev, { id: crypto.randomUUID(), name: '', email: '' }])

  const removeRecipient = (id: string) => {
    if (recipients.length === 1) return
    setRecipients(prev => prev.filter(r => r.id !== id))
  }

  const updateRecipient = (id: string, field: 'name' | 'email', value: string) =>
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const parsed: Recipient[] = []
    for (const line of lines) {
      // Support "Name <email>", "Name, email", or "email" formats
      const angleMatch = line.match(/^(.+?)\s*<([^>]+)>$/)
      const commaMatch = line.match(/^(.+?),\s*(.+@.+)$/)
      const emailOnly = line.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      if (angleMatch) {
        parsed.push({ id: crypto.randomUUID(), name: angleMatch[1].trim(), email: angleMatch[2].trim() })
      } else if (commaMatch) {
        parsed.push({ id: crypto.randomUUID(), name: commaMatch[1].trim(), email: commaMatch[2].trim() })
      } else if (emailOnly) {
        parsed.push({ id: crypto.randomUUID(), name: '', email: line })
      }
    }
    if (parsed.length > 0) {
      setRecipients(prev => {
        const existing = prev.filter(r => r.name || r.email)
        return [...existing, ...parsed]
      })
    }
  }

  const handleSend = async () => {
    setError('')
    const valid = recipients.filter(r => r.email.trim())
    if (!title.trim()) { setError('Please enter a document title.'); return }
    if (!file) { setError('Please upload a PDF.'); return }
    if (valid.length === 0) { setError('Add at least one recipient.'); return }

    setSending(true)
    try {
      // Upload PDF first (shared across all documents)
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/documents/bulk-upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('PDF upload failed')
      const { file_url } = await uploadRes.json()

      // Bulk send
      const res = await fetch('/api/documents/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          user_id: userId,
          file_url,
          recipients: valid.map(r => ({ name: r.name || r.email.split('@')[0], email: r.email })),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Bulk send failed')
      const data = await res.json()
      setSentCount(data.sent)
      setDone(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Bulk Send Complete</h2>
          <p className="text-[#b3b3b3]">
            Sent <span className="text-white font-semibold">{sentCount}</span> signing request{sentCount !== 1 ? 's' : ''} successfully.
            Each recipient will receive their own document to sign.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Bulk Send</h1>
        <p className="text-[#888] text-sm">Send the same document to multiple recipients — each gets their own individual copy to sign.</p>
      </div>

      {/* Document title */}
      <div>
        <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">Document Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. NDA — Q2 2026"
          className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
        />
      </div>

      {/* PDF upload */}
      <div>
        <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">PDF File *</label>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => validateAndSetFile(e.target.files?.[0] ?? null)} />
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
          onDrop={e => { e.preventDefault(); setIsDragging(false); validateAndSetFile(e.dataTransfer.files[0] ?? null) }}
          onClick={() => fileRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-[#7c3aed] bg-[#7c3aed]/10' :
            file ? 'border-[#7c3aed]/60 bg-[#7c3aed]/5' :
            'border-[#333] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5'
          }`}
        >
          {file ? (
            <>
              <FileCheck size={24} className="mx-auto mb-2 text-[#7c3aed]" />
              <p className="text-white font-medium text-sm">{file.name}</p>
              <p className="text-[#888] text-xs mt-1">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
            </>
          ) : (
            <>
              <Upload size={24} className="mx-auto mb-2 text-[#555]" />
              <p className="text-white font-medium text-sm">Drop PDF here or click to browse</p>
              <p className="text-[#888] text-xs mt-1">Max 10MB · Shared across all recipients</p>
            </>
          )}
        </div>
      </div>

      {/* Recipients */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-[#888] uppercase tracking-widest">Recipients *</label>
          <span className="text-xs text-[#555]">{recipients.filter(r => r.email).length} added</span>
        </div>

        {/* Paste hint */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-3 mb-3">
          <p className="text-xs text-[#555] mb-1.5">Paste a list of emails or &quot;Name &lt;email&gt;&quot; entries:</p>
          <textarea
            placeholder={'alice@example.com\nBob Smith <bob@example.com>\nCarol, carol@example.com'}
            rows={3}
            onPaste={handlePaste}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-xs resize-none"
          />
        </div>

        <div className="space-y-2">
          {recipients.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2">
              <span className="text-xs text-[#555] w-5 text-right shrink-0">{i + 1}</span>
              <input
                type="text"
                value={r.name}
                onChange={e => updateRecipient(r.id, 'name', e.target.value)}
                placeholder="Name"
                className="flex-1 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
              />
              <input
                type="email"
                value={r.email}
                onChange={e => updateRecipient(r.id, 'email', e.target.value)}
                placeholder="email@example.com"
                className="flex-[1.5] bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
              />
              <button
                onClick={() => removeRecipient(r.id)}
                disabled={recipients.length === 1}
                className="text-[#555] hover:text-red-400 disabled:opacity-30 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addRecipient}
          className="mt-2 w-full border border-dashed border-[#333] hover:border-[#7c3aed]/40 rounded-xl py-2.5 text-sm text-[#888] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={14} /> Add recipient
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {sending ? 'Sending…' : (
          <>
            <Send size={16} />
            Send to {recipients.filter(r => r.email).length || '…'} recipient{recipients.filter(r => r.email).length !== 1 ? 's' : ''}
          </>
        )}
      </button>
    </div>
  )
}
