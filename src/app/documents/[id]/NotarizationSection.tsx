'use client'
import { useState } from 'react'
import { ShieldCheck, ExternalLink, CheckCircle, Clock, Video, X, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Recipient {
  id: string
  name: string
  email: string
}

interface Doc {
  id: string
  status: string
  notarization_required: boolean
  proof_transaction_id: string | null
  notarized_at: string | null
  notarization_certificate_url: string | null
  notarized_by: string | null
}

interface Props {
  doc: Doc
  recipients: Recipient[]
  proofConfigured: boolean
}

export default function NotarizationSection({ doc, recipients, proofConfigured }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(recipients.map(r => r.id))
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sessionUrls, setSessionUrls] = useState<Record<string, string>>({})

  const handleRequest = async () => {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/proof/notarization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id, signerIds: selectedIds, message }),
      })
      const data = await res.json() as { error?: string; sessionUrls?: Record<string, string> }
      if (!res.ok) throw new Error(data.error ?? 'Failed to request notarization')
      setSessionUrls(data.sessionUrls ?? {})
      setTimeout(() => window.location.reload(), 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleSigner = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  // ── Notarized state ──────────────────────────────────────────────
  if (doc.status === 'notarized') {
    return (
      <div className="bg-emerald-500/8 border border-emerald-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Notarized</p>
            {doc.notarized_by && <p className="text-[#888] text-xs">by {doc.notarized_by}</p>}
          </div>
          <span className="ml-auto text-[#555] text-xs">{doc.notarized_at ? formatDate(doc.notarized_at) : ''}</span>
        </div>
        {doc.notarization_certificate_url && (
          <a
            href={doc.notarization_certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
          >
            <ExternalLink size={12} />
            Download Notarization Certificate
          </a>
        )}
      </div>
    )
  }

  // ── Notarization requested / pending ────────────────────────────
  if (doc.status === 'notarization_requested' || doc.proof_transaction_id) {
    return (
      <div className="bg-blue-500/8 border border-blue-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
            <Clock size={16} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <p className="text-blue-400 font-semibold text-sm">Notarization Requested</p>
            <p className="text-[#888] text-xs mt-0.5">Session link has been sent to signers via Proof.com</p>
          </div>
        </div>
        {Object.entries(sessionUrls).length > 0 && (
          <div className="mt-3 space-y-1.5">
            {Object.entries(sessionUrls).map(([email, url]) => (
              <div key={email} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2">
                <p className="text-[#888] text-xs mb-1">{email}</p>
                <a href={url} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  <Video size={10} /> Join Session
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Requires notarization but Proof not configured ───────────────
  if (doc.notarization_required && !proofConfigured) {
    return (
      <div className="bg-amber-500/8 border border-amber-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-400 font-semibold text-sm">Notarization Required</p>
            <p className="text-[#888] text-xs mt-1 leading-relaxed">
              This document type typically requires notarization. Connect Proof to enable Remote Online Notarization &mdash; legally binding, 100% digital.
            </p>
            <a href="/settings" className="inline-flex items-center gap-1.5 mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Set Up Notarization →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Ready to request (signed doc + Proof configured) ─────────────
  if ((doc.status === 'signed' || doc.notarization_required) && proofConfigured) {
    return (
      <>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[#7c3aed]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Remote Online Notarization</p>
              <p className="text-[#888] text-xs mt-0.5">via Proof.com</p>
            </div>
          </div>
          <p className="text-[#888] text-xs leading-relaxed mb-4">
            A certified notary will conduct a live video session with signers to notarize this document.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Video size={14} />
            Request Notarization
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="relative bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
                    <Video size={15} className="text-[#7c3aed]" />
                  </div>
                  <h2 className="text-white font-semibold">Request Notarization</h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-[#555] hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-[#555] uppercase tracking-widest mb-2">Select signers to notarize</p>
                  <div className="space-y-2">
                    {recipients.map(r => (
                      <label key={r.id} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => toggleSigner(r.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            selectedIds.includes(r.id)
                              ? 'bg-[#7c3aed] border-[#7c3aed]'
                              : 'border-[#333] group-hover:border-[#555]'
                          }`}
                        >
                          {selectedIds.includes(r.id) && <CheckCircle size={10} className="text-white" />}
                        </div>
                        <div>
                          <p className="text-white text-sm">{r.name}</p>
                          <p className="text-[#888] text-xs">{r.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#555] uppercase tracking-widest mb-1.5">
                    Optional message to notary
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Any special instructions for the notary session…"
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-2.5 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#7c3aed] transition-colors resize-none"
                  />
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
                  <p className="text-[#888] text-xs leading-relaxed">
                    Signers will receive a link to join a live video session with a certified notary. The notarized document and certificate will appear here once complete.
                  </p>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleRequest}
                    disabled={submitting || !selectedIds.length}
                    className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {submitting ? 'Requesting…' : 'Send for Notarization'}
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-[#888] hover:text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return null
}
