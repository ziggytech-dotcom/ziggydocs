export const dynamic = 'force-dynamic';
// Called by ZiggyHR offer letter flow
// POST /api/documents/send-offer-letter
// Accepts: { employee_id, template_id, signer_email, signer_name?, webhook_url? }
// Creates a document from a template, sends to employee for signature,
// and webhooks back to ZiggyHR when signed.

import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'

export async function POST(req: NextRequest) {
  // Verify caller via shared secret (set ZIGGYHR_WEBHOOK_SECRET in env)
  const authHeader = req.headers.get('authorization')
  const secret = process.env.ZIGGYHR_WEBHOOK_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { employee_id, template_id, signer_email, signer_name, webhook_url } = body as {
    employee_id: string
    template_id: string
    signer_email: string
    signer_name?: string
    webhook_url?: string
  }

  if (!employee_id || !template_id || !signer_email) {
    return Response.json(
      { error: 'employee_id, template_id, and signer_email are required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Load template
  const { data: template } = await supabase
    .from('zd_templates')
    .select('id, title, file_url, fields_json, user_id')
    .eq('id', template_id)
    .single()

  if (!template) {
    return Response.json({ error: 'Template not found' }, { status: 404 })
  }

  const recipientName = signer_name ?? signer_email
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const signingToken = crypto.randomUUID()

  // Create document from template
  const { data: doc, error: docErr } = await supabase
    .from('zd_documents')
    .insert({
      user_id: template.user_id,
      title: `Offer Letter — ${recipientName}`,
      file_url: template.file_url,
      fields_json: template.fields_json,
      status: 'sent',
      sent_at: new Date().toISOString(),
      expires_at: expiresAt,
      sequential_signing: false,
      metadata: { source: 'ziggyhr', employee_id, webhook_url: webhook_url ?? null },
    })
    .select('id')
    .single()

  if (docErr || !doc) {
    return Response.json({ error: docErr?.message ?? 'Failed to create document' }, { status: 500 })
  }

  // Create recipient
  await supabase.from('zd_recipients').insert({
    document_id: doc.id,
    name: recipientName,
    email: signer_email,
    token: signingToken,
    signing_order: 1,
  })

  // Audit log
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'sent',
    actor: 'ziggyhr',
    metadata: { employee_id, template_id },
  })

  // Send email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const expiresDisplay = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  await resend.emails.send({
    from: 'ZiggyDocs <noreply@ziggydocs.com>',
    to: signer_email,
    subject: `Please sign your offer letter`,
    html: documentSigningEmailHtml({
      recipientName,
      documentTitle: `Offer Letter — ${recipientName}`,
      signingLink: `${appUrl}/sign/${signingToken}`,
      expiresAt: expiresDisplay,
    }),
  }).catch(() => {})

  return Response.json({
    success: true,
    document_id: doc.id,
    signing_token: signingToken,
    signing_url: `${appUrl}/sign/${signingToken}`,
  })
}
