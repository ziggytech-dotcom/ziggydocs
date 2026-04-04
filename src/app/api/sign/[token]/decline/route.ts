export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { declineNotificationEmailHtml } from '@/lib/emails/documentEmail'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()
  const { decline_reason } = body

  if (!decline_reason?.trim()) {
    return Response.json({ error: 'A reason is required to decline' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: recipient, error: rErr } = await supabase
    .from('zd_recipients')
    .select('*, zd_documents(id, title, status, user_id)')
    .eq('token', token)
    .single()

  if (rErr || !recipient) return Response.json({ error: 'Invalid signing link' }, { status: 404 })
  if (recipient.signed_at) return Response.json({ error: 'Already signed — cannot decline' }, { status: 409 })
  if (recipient.declined_at) return Response.json({ error: 'Already declined' }, { status: 409 })

  const doc = recipient.zd_documents as any
  if (!doc) return Response.json({ error: 'Document not found' }, { status: 404 })

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const now = new Date().toISOString()

  // Mark recipient as declined
  await supabase.from('zd_recipients').update({
    declined_at: now,
    decline_reason: decline_reason.trim(),
  }).eq('id', recipient.id)

  // Mark document as declined
  await supabase.from('zd_documents').update({ status: 'declined' }).eq('id', doc.id)

  // Audit log
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'declined',
    actor: recipient.email,
    ip_address: ip,
    metadata: { decline_reason: decline_reason.trim(), recipient_id: recipient.id },
  })

  // Notify document owner
  const { data: owner } = await supabase.auth.admin.getUserById(doc.user_id)
  const ownerEmail = owner?.user?.email
  if (ownerEmail) {
    await resend.emails.send({
      from: 'ZiggyDocs <noreply@ziggydocs.com>',
      to: ownerEmail,
      subject: `[Declined] ${doc.title}`,
      html: declineNotificationEmailHtml({
        ownerName: owner?.user?.user_metadata?.full_name ?? 'there',
        documentTitle: doc.title,
        recipientName: recipient.name,
        declineReason: decline_reason.trim(),
      }),
    }).catch(() => {})
  }

  return Response.json({ success: true })
}
