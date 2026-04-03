import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, user_id, recipients, template_id, sequential_signing, notarization_required } = body

  if (!title || !user_id) {
    return Response.json({ error: 'title and user_id required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const token = crypto.randomUUID()

  const { data: doc, error } = await supabase
    .from('zd_documents')
    .insert({
      user_id,
      title,
      token,
      status: 'draft',
      template_id: template_id ?? null,
      sequential_signing: sequential_signing === true,
      notarization_required: notarization_required === true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Copy template fields/pdf if template_id provided
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

  // Insert recipients
  if (Array.isArray(recipients) && recipients.length > 0) {
    const recipientRows = recipients.map((r: { name: string; email: string; signing_order?: number }, i: number) => ({
      document_id: doc.id,
      name: r.name,
      email: r.email,
      token: crypto.randomUUID(),
      signing_order: r.signing_order ?? i + 1,
    }))
    await supabase.from('zd_recipients').insert(recipientRows)
  }

  // Audit log
  await supabase.from('zd_audit_log').insert({
    document_id: doc.id,
    event: 'created',
    actor: user_id,
  })

  return Response.json(doc, { status: 201 })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const user_id = url.searchParams.get('user_id')
  if (!user_id) return Response.json({ error: 'user_id required' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('zd_documents')
    .select('*, zd_recipients(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
