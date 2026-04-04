'use client'
import { useState, useRef } from 'react'
import { Plus, FileText, Trash2, PenLine, LayoutTemplate } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  title: string
  file_url: string | null
  fields_json: any[] | null
  created_at: string
}

export default function TemplatesClient({ templates: initial, userId }: { templates: Template[]; userId: string }) {
  const [templates, setTemplates] = useState(initial)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleCreate = async () => {
    if (!newTitle.trim()) { setError('Title required'); return }
    setError('')
    setCreating(true)
    try {
      const res = await fetch('/api/documents/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, user_id: userId }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      const tmpl = await res.json()

      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('template_id', tmpl.id)
        await fetch('/api/documents/templates/upload', { method: 'POST', body: fd })
      }

      setTemplates(prev => [tmpl, ...prev])
      setShowModal(false)
      setNewTitle('')
      setFile(null)
      router.push(`/templates/${tmpl.id}/fields`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/documents/templates/${id}`, { method: 'DELETE' })
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-[#888] text-sm mt-0.5">Reusable document templates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-[#111] border border-[#222] border-dashed rounded-2xl p-16 text-center">
          <LayoutTemplate size={32} className="text-[#444] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No templates yet</h3>
          <p className="text-[#888] text-sm mb-6">Create reusable document templates to speed up your workflow</p>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors">
            <Plus size={16} /> New Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div key={tmpl.id} className="bg-[#111] border border-[#222] rounded-2xl p-5 hover:border-[#7c3aed]/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-[#7c3aed]" />
                </div>
                <button onClick={() => handleDelete(tmpl.id)} className="text-[#555] hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className="text-white font-medium mb-1 truncate">{tmpl.title}</h3>
              <p className="text-[#888] text-xs mb-1">{(tmpl.fields_json ?? []).length} fields &middot; {tmpl.file_url ? 'PDF attached' : 'No PDF'}</p>
              <p className="text-[#555] text-xs mb-4">{formatDate(tmpl.created_at)}</p>
              <Link
                href={`/templates/${tmpl.id}/fields`}
                className="block text-center border border-[#333] hover:border-[#7c3aed]/50 text-[#888] hover:text-white py-2 rounded-xl text-xs transition-colors"
              >
                <PenLine size={11} className="inline mr-1" /> Edit Fields
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#222]">
              <h3 className="text-white font-medium">New Template</h3>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">Template Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Standard NDA"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">PDF (Optional)</label>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`w-full border border-dashed rounded-xl py-4 text-sm text-center transition-colors ${file ? 'border-[#7c3aed]/60 text-[#7c3aed]' : 'border-[#333] text-[#888] hover:border-[#7c3aed]/40 hover:text-white'}`}
                >
                  {file ? file.name : 'Click to upload PDF (optional)'}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
              >
                {creating ? 'Creating…' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
