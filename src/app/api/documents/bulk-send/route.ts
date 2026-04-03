import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, user_id, file_url, recipients } = body

  if (!title || !user_id || !file_url) {
    return Response.json({ error: 'title, user_id, and file_url required' }, { status: 400 })
  }
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return Response.json({ error: 'At least one recipient required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const expiresAtFormatted = new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Create bulk send record
  const { data: bulkSend, error: bsErr } = await supabase
    .from('zd_bulk_sends')
    .insert({ user_id, title, document_count: recipients.length })
    .select()
    .single()

  if (bsErr || !bulkSend) {
    return Response.json({ error: 'Failed to create bulk send' }, { status: 500 })
  }

  const results: { email: string; doc_id: string; success: boolean }[] = []

  for (const r of recipients as Array<{ name: string; email: string }>) {
    try {
      const token = crypto.randomUUID()
      const recipientToken = crypto.randomUUID()

      // Create individual document for this recipient
      const { data: doc, error: docErr } = await supabase
        .from('zd_documents')
        .insert({
          user_id,
          title,
          file_url,
          token,
          status: 'sent',
          bulk_send_id: bulkSend.id,
          expires_at: expiresAt,
          sent_at: now.toISOString(),
        })
        .select()
        .single()

      if (docErr || !doc) {
        results.push({ email: r.email, doc_id: '', success: false })
        continue
      }

      // Create recipient
      await supabase.from('zd_recipients').insert({
        document_id: doc.id,
        name: r.name,
        email: r.email,
        token: recipientToken,
        signing_order: 1,
      })

      // Audit log
      await supabase.from('zd_audit_log').insert({
        document_id: doc.id,
        event: 'sent',
        actor: user_id,
        metadata: { bulk_send_id: bulkSend.id, recipient: r.email },
      })

      // Send email
      await resend.emails.send({
        from: 'ZiggyDocs <noreply@ziggydocs.com>',
        to: r.email,
        subject: `Please sign: ${title}`,
        html: documentSigningEmailHtml({
          recipientName: r.name,
          documentTitle: title,
          signingLink: `${appUrl}/sign/${recipientToken}`,
          expiresAt: expiresAtFormatted,
        }),
      })

      results.push({ email: r.email, doc_id: doc.id, success: true })
    } catch {
      results.push({ email: r.email, doc_id: '', success: false })
    }
  }

  const sent = results.filter(r => r.success).length
  return Response.json({ success: true, bulk_send_id: bulkSend.id, sent, total: recipients.length, results }, { status: 201 })
}
