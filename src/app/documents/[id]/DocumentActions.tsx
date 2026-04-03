'use client'
import { useState } from 'react'
import { Send, CheckCircle, Tablet } from 'lucide-react'
import Link from 'next/link'

interface Recipient {
  id: string
  name: string
  email: string
  token: string
  signed_at: string | null
}

interface Doc {
  id: string
  status: string
  file_url: string | null
}

export default function DocumentActions({
  doc,
  recipients,
  appUrl,
}: {
  doc: Doc
  recipients: Recipient[]
  appUrl: string
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/documents/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: doc.id }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to send')
      setSent(true)
      setTimeout(() => window.location.reload(), 1500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const canSend = doc.status === 'draft' && recipients.length > 0 && !!doc.file_url

  if (doc.status === 'notarized') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
        <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
        <p className="text-emerald-400 font-medium text-sm">Document Notarized</p>
        <p className="text-[#888] text-xs mt-1">Signed and notarized via Proof.com</p>
      </div>
    )
  }

  if (doc.status === 'notarization_requested') {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 text-center">
        <p className="text-blue-400 font-medium text-sm">Notarization In Progress</p>
        <p className="text-[#888] text-xs mt-1">Waiting for notary session to complete</p>
      </div>
    )
  }

  if (doc.status === 'signed') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center">
        <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-medium text-sm">Document Signed</p>
        <p className="text-[#888] text-xs mt-1">All parties have signed this document</p>
      </div>
    )
  }

  if (doc.status === 'declined') {
    return (
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 text-center">
        <p className="text-orange-400 font-medium text-sm">Document Declined</p>
        <p className="text-[#888] text-xs mt-1">A recipient has declined to sign</p>
      </div>
    )
  }

  if (doc.status === 'voided') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center">
        <p className="text-red-400 font-medium text-sm">Document Voided</p>
        <p className="text-[#888] text-xs mt-1">This document expired before all parties signed</p>
      </div>
    )
  }

  if (doc.status === 'sent' || doc.status === 'viewed') {
    const unsignedRecipients = recipients.filter(r => !r.signed_at)
    return (
      <div className="space-y-3">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Signing Links</h3>
          <div className="space-y-2">
            {unsignedRecipients.map(r => {
              const link = `${appUrl}/sign/${r.token}`
              return (
                <div key={r.id} className="bg-[#0a0a0a] border border-[#222] rounded-xl p-3">
                  <p className="text-white text-xs font-medium mb-1.5">{r.name}</p>
                  <input
                    readOnly
                    value={link}
                    className="w-full bg-transparent text-[#888] text-xs focus:outline-none"
                    onClick={e => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(link)}
                    className="mt-1.5 text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
                  >
                    Copy link
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        {unsignedRecipients.length > 0 && (
          <Link
            href={`/documents/${doc.id}/inperson`}
            className="flex items-center justify-center gap-2 w-full bg-[#111] border border-[#333] hover:border-[#7c3aed]/50 text-[#888] hover:text-white py-3 rounded-xl text-sm transition-colors"
          >
            <Tablet size={14} />
            Sign In Person
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Send for Signing</h3>
      {!canSend && (
        <p className="text-[#888] text-xs mb-3">
          {!doc.file_url ? 'Upload a PDF first, then place signature fields.' : 'Add recipients before sending.'}
        </p>
      )}
      {sent && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 mb-3">
          <CheckCircle size={14} className="text-green-400" />
          <p className="text-green-400 text-xs font-medium">Emails sent!</p>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      <button
        onClick={handleSend}
        disabled={!canSend || sending}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {sending ? 'Sending…' : (<><Send size={14} /> Send for Signing</>)}
      </button>
    </div>
  )
}
