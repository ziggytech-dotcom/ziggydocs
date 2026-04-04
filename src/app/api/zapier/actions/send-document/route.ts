export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { documentSigningEmailHtml } from '@/lib/emails/documentEmail'
import { triggerZapierWebhook } from '@/lib/zapier'

export async function POST(req: NextRequest) {
  // Bearer API key auth -- key is the user's Supabase JWT or a service key stored in env
  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Authorization header with Bearer token required' }, { status: 401 })
  }
  const token = authHeader.slice(7)

  // Validate the bearer token as a Supabase user JWT
  const supabase = createAdminClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const body = await req.json()
  const { recipient_email, recipient_name, document_id, template_id, title } = body as {
    recipient_email: string
    recipient_name: string
    document_id?: string
    template_id?: string
    title?: string
  }

  if (!recipient_email || !recipient_name) {
    return Response.json({ error: 'recipient_email and recipient_name required' }, { status: 400 })
  }

  // If document_id provided, add recipient and send that existing document
  if (document_id) {
    const { data: doc, error: docErr } = await supabase
      .from('zd_documents')
      .select('id, title, token, user_id, expires_at, sequential_signing')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (docErr || !doc) {
      return Response.json({ error: 'Document not found or not owned by this user' }, { status: 404 })
    }

    const recipientToken = crypto.randomUUID()
    await supabase.from('zd_recipients').insert({
      document_id: doc.id,
      name: recipient_name,
      email: recipient_email,
      token: recipientToken,
      signing_order: 1,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
    const expiresAt = doc.expires_at
      ? new Date(doc.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '30 days from now'

    await resend.emails.send({
      from: 'ZiggyDocs <noreply@ziggydocs.com>',
      to: recipient_email,
      subject: `Please sign: ${doc.title}`,
      html: documentSigningEmailHtml({
        recipientName: recipient_name,
        documentTitle: doc.title,
        signingLink: `${appUrl}/sign/${recipientToken}`,
        expiresAt,
      }),
    })

    await supabase.from('zd_documents')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', doc.id)

    await supabase.from('zd_audit_log').insert({
      document_id: doc.id,
      event: 'sent',
      metadata: { recipients: [recipient_email], via: 'zapier_action' },
    })

    triggerZapierWebhook(user.id, 'document.sent', { document: doc, recipient: { name: recipient_name, email: recipient_email } })

    return Response.json({ success: true, document_id: doc.id }, { status: 200 })
  }

  // Otherwise create a new document from template_id (or blank) and send
  const docTitle = title ?? `Document for ${recipient_name}`
  const newToken = crypto.randomUUID()

  const { data: doc, error: createErr } = await supabase
    .from('zd_documents')
    .insert({
      user_id: user.id,
      title: docTitle,
      token: newToken,
      status: 'draft',
      template_id: template_id ?? null,
      sequential_signing: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (createErr || !doc) {
    return Response.json({ error: createErr?.message ?? 'Failed to create document' }, { status: 500 })
  }

  // Copy template fields/pdf if provided
  if (template_id) {
    const { data: tmpl } = await supabase
      .from('zd_templates')
      .select('fields_json, file_url')
      .eq('id', template_id)
      .single()
    if (tmpl) {
      await supabase
        .from('zd_documents')
        .update({ fields_json: tmpl.fields_json, file_url: tmpl.file_url })
        .eq('id', doc.id)
    }
  }

  const recipientToken = crypto.randomUUID()
  await supabase.from('zd_recipients').insert({
    document_id: doc.id,
    name: recipient_name,
    email: recipient_email,
    token: recipientToken,
    signing_order: 1,
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const expiresAt = new Date(doc.expires_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  await resend.emails.send({
    from: 'ZiggyDocs <noreply@ziggydocs.com>',
    to: recipient_email,
    subject: `Please sign: ${docTitle}`,
    html: documentSigningEmailHtml({
      recipientName: recipient_name,
      documentTitle: docTitle,
      signingLink: `${appUrl}/sign/${recipientToken}`,
      expiresAt,
    }),
  })

  await supabase.from('zd_documents')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', doc.id)

  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'sent',
    metadata: { recipients: [recipient_email], via: 'zapier_action' },
  })

  triggerZapierWebhook(user.id, 'document.sent', { document: doc, recipient: { name: recipient_name, email: recipient_email } })

  return Response.json({ success: true, document_id: doc.id }, { status: 201 })
}
