export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'
import { triggerZapierWebhook } from '@/lib/zapier'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()
  const { signer_name, signature_data_url, field_data } = body

  if (!signer_name || !signature_data_url) {
    return Response.json({ error: 'signer_name and signature_data_url required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Look up recipient by token
  const { data: recipient, error: rErr } = await supabase
    .from('zd_recipients')
    .select('*, zd_documents(id, status, file_url, fields_json, user_id, sequential_signing, expires_at, title)')
    .eq('token', token)
    .single()

  if (rErr || !recipient) return Response.json({ error: 'Invalid signing link' }, { status: 404 })
  if (recipient.signed_at) return Response.json({ error: 'Already signed' }, { status: 409 })
  if (recipient.declined_at) return Response.json({ error: 'You have declined to sign this document' }, { status: 409 })

  const doc = recipient.zd_documents as any
  if (!doc) return Response.json({ error: 'Document not found' }, { status: 404 })

  // Server-side expiration enforcement
  if (doc.expires_at && new Date(doc.expires_at) < new Date()) {
    return Response.json({ error: 'This signing link has expired' }, { status: 410 })
  }

  const forwarded = req.headers.get('x-forwarded-for')
  const signer_ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const signer_user_agent = req.headers.get('user-agent') ?? ''
  const now = new Date().toISOString()

  // Mark recipient as signed
  await supabase.from('zd_recipients').update({
    signed_at: now,
    ip_address: signer_ip,
  }).eq('id', recipient.id)

  // Check if all recipients have signed
  const { data: allRecipients } = await supabase
    .from('zd_recipients')
    .select('id, signed_at, signing_order, name, email, token')
    .eq('document_id', doc.id)

  const allSigned = (allRecipients ?? []).every(r => r.id === recipient.id || !!r.signed_at)

  if (allSigned) {
    await supabase.from('zd_documents').update({
      status: 'signed',
      signed_at: now,
      signer_name,
      signer_ip,
      signer_user_agent,
      field_data_json: field_data ?? {},
    }).eq('id', doc.id)
  }

  // Audit log
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'signed',
    actor: recipient.email,
    ip_address: signer_ip,
    metadata: { signer_name, recipient_id: recipient.id },
  })

  // Sequential signing: notify the next-in-order unsigned recipient
  if (!allSigned && doc.sequential_signing) {
    const currentOrder: number = recipient.signing_order ?? 1
    const nextRecipients = (allRecipients ?? [])
      .filter(r => !r.signed_at && r.id !== recipient.id && (r.signing_order ?? 1) > currentOrder)
      .sort((a, b) => (a.signing_order ?? 1) - (b.signing_order ?? 1))

    if (nextRecipients.length > 0) {
      const nextMinOrder = nextRecipients[0].signing_order
      const toNotify = nextRecipients.filter(r => r.signing_order === nextMinOrder)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
      const expiresAt = doc.expires_at
        ? new Date(doc.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '30 days from now'

      await Promise.allSettled(
        toNotify.map(r =>
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

      await supabase.from('zd_audit_log').insert({
        document_id: doc.id,
        event: 'sequential_next_notified',
        metadata: { notified: toNotify.map(r => r.email), after_signer: recipient.email },
      })
    }
  }

  // Fire Zapier triggers (non-blocking)
  triggerZapierWebhook(doc.user_id, 'document.signed', {
    document: { id: doc.id, title: doc.title },
    signer: { name: signer_name, email: recipient.email },
  })
  if (allSigned) {
    triggerZapierWebhook(doc.user_id, 'document.completed', {
      document: { id: doc.id, title: doc.title },
    })
  }

  // Kick off PDF generation async when all signed
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  if (appUrl && allSigned) {
    fetch(`${appUrl}/api/documents/${doc.id}/generate-signed-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      },
      body: JSON.stringify({
        signer_name,
        signer_ip,
        field_data: field_data ?? {},
        recipient_email: recipient.email,
      }),
    }).catch(() => {})
  }

  return Response.json({ success: true })
}
