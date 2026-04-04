export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'
import { triggerZapierWebhook } from '@/lib/zapier'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { document_id } = body

  if (!document_id) return Response.json({ error: 'document_id required' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: doc, error } = await supabase
    .from('zd_documents')
    .select('*, zd_recipients(*)')
    .eq('id', document_id)
    .single()

  if (error || !doc) return Response.json({ error: 'Document not found' }, { status: 404 })
  if (!doc.token) return Response.json({ error: 'Document has no signing token' }, { status: 400 })

  const allRecipients = doc.zd_recipients as Array<{ id: string; name: string; email: string; token: string; signing_order: number }>
  if (!allRecipients || allRecipients.length === 0) return Response.json({ error: 'No recipients' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const expiresAt = doc.expires_at
    ? new Date(doc.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '30 days from now'

  // Sequential signing: only notify recipients at the lowest signing_order
  const recipientsToNotify = doc.sequential_signing
    ? (() => {
        const minOrder = Math.min(...allRecipients.map(r => r.signing_order))
        return allRecipients.filter(r => r.signing_order === minOrder)
      })()
    : allRecipients

  const emailResults = await Promise.allSettled(
    recipientsToNotify.map(r =>
      resend.emails.send({
        from: 'ZiggyDocs <noreply@ziggydocs.com>',
        to: r.email,
        subject: `Please sign: ${doc.title}`,
        html: documentSigningEmailHtml({
          recipientName: r.name,
          documentTitle: doc.title,
          signingLink: `${appUrl}/sign/${r.token}`,
          expiresAt,
        }),
      })
    )
  )

  await supabase
    .from('zd_documents')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', document_id)

  await supabase.from('zd_audit_log').insert({
    document_id,
    event: 'sent',
    metadata: {
      recipients: recipientsToNotify.map(r => r.email),
      sequential: doc.sequential_signing ?? false,
    },
  })

  triggerZapierWebhook(doc.user_id, 'document.sent', { document: doc })

  const sent = emailResults.filter(r => r.status === 'fulfilled').length
  return Response.json({ success: true, sent })
}
