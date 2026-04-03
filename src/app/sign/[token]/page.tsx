import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import SigningClient from './SigningClient'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { triggerZapierWebhook } from '@/lib/zapier'

export const dynamic = 'force-dynamic'

export default async function SignPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ inperson?: string }>
}) {
  const { token } = await params
  const { inperson } = await searchParams
  const isInPerson = inperson === '1'
  const supabase = createAdminClient()

  // Look up by recipient token
  const { data: recipient } = await supabase
    .from('zd_recipients')
    .select('*, zd_documents(*)')
    .eq('token', token)
    .single()

  if (!recipient) notFound()

  const doc = recipient.zd_documents as any
  if (!doc) notFound()

  // Get signed PDF URL for rendering
  let pdfSignedUrl: string | null = null
  if (doc.file_url) {
    const { data } = await supabase.storage.from('zd-documents').createSignedUrl(doc.file_url, 3600)
    pdfSignedUrl = data?.signedUrl ?? null
  }

  // Track view
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'viewed',
    actor: recipient.email,
    ip_address: null,
  })
  if (!recipient.signed_at && doc.status === 'sent') {
    await supabase.from('zd_documents').update({ status: 'viewed', viewed_at: new Date().toISOString() }).eq('id', doc.id)
    triggerZapierWebhook(doc.user_id, 'document.viewed', {
      document: { id: doc.id, title: doc.title },
      viewer: { name: recipient.name, email: recipient.email },
    })
  }

  if (isInPerson) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Minimal in-person header */}
        <div className="bg-[#111] border-b border-[#222] px-4 py-3 flex items-center justify-between">
          <ZiggyDocsLogo size="sm" />
          <div className="text-right">
            <p className="text-white text-sm font-medium truncate max-w-48">{doc.title}</p>
            <p className="text-[#555] text-xs">Signing as {recipient.name}</p>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <SigningClient
            doc={doc}
            token={token}
            recipientName={recipient.name}
            recipientEmail={recipient.email}
            recipientSigningOrder={recipient.signing_order ?? 1}
            alreadySigned={!!recipient.signed_at}
            pdfSignedUrl={pdfSignedUrl}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-[#222] bg-[#111] px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ZiggyDocsLogo size="md" />
            <p className="text-[#555] text-xs hidden sm:block">Secure Document Signing</p>
          </div>
          <div className="text-right min-w-0">
            <p className="text-[#b3b3b3] text-sm font-medium truncate">{doc.title}</p>
            <p className="text-[#555] text-xs">For {recipient.name}</p>
          </div>
        </div>
      </div>
      <SigningClient
        doc={doc}
        token={token}
        recipientName={recipient.name}
        recipientEmail={recipient.email}
        recipientSigningOrder={recipient.signing_order ?? 1}
        alreadySigned={!!recipient.signed_at}
        pdfSignedUrl={pdfSignedUrl}
      />
    </div>
  )
}
