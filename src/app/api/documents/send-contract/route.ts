export const dynamic = 'force-dynamic';
// Called by ZiggyPitch on proposal acceptance
// POST /api/documents/send-contract
// Accepts: { proposal_id, template_id, client_email, client_name?, webhook_url? }
// Creates a contract from a template, sends to client for signature.

import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'

export async function POST(req: NextRequest) {
  // Verify caller via shared secret (set ZIGGYPITCH_WEBHOOK_SECRET in env)
  const authHeader = req.headers.get('authorization')
  const secret = process.env.ZIGGYPITCH_WEBHOOK_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { proposal_id, template_id, client_email, client_name, webhook_url } = body as {
    proposal_id: string
    template_id: string
    client_email: string
    client_name?: string
    webhook_url?: string
  }

  if (!proposal_id || !template_id || !client_email) {
    return Response.json(
      { error: 'proposal_id, template_id, and client_email are required' },
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

  const recipientName = client_name ?? client_email
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const signingToken = crypto.randomUUID()

  // Create contract document from template
  const { data: doc, error: docErr } = await supabase
    .from('zd_documents')
    .insert({
      user_id: template.user_id,
      title: `${template.title} -- ${recipientName}`,
      file_url: template.file_url,
      fields_json: template.fields_json,
      status: 'sent',
      sent_at: new Date().toISOString(),
      expires_at: expiresAt,
      sequential_signing: false,
      metadata: { source: 'ziggypitch', proposal_id, webhook_url: webhook_url ?? null },
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
    email: client_email,
    token: signingToken,
    signing_order: 1,
  })

  // Audit log
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'sent',
    actor: 'ziggypitch',
    metadata: { proposal_id, template_id },
  })

  // Send email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const expiresDisplay = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  await resend.emails.send({
    from: 'ZiggyDocs <noreply@ziggydocs.com>',
    to: client_email,
    subject: `Please sign: ${template.title}`,
    html: documentSigningEmailHtml({
      recipientName,
      documentTitle: `${template.title} -- ${recipientName}`,
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
