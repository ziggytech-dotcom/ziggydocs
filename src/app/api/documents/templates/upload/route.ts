import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const template_id = formData.get('template_id') as string | null

  if (!file || !template_id) return Response.json({ error: 'file and template_id required' }, { status: 400 })
  if (file.type !== 'application/pdf') return Response.json({ error: 'Only PDF files allowed' }, { status: 400 })

  const supabase = createAdminClient()
  const path = `templates/${template_id}/original.pdf`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('zd-documents')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: true })

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 })

  await supabase.from('zd_templates').update({ file_url: path }).eq('id', template_id)
  return Response.json({ file_url: path })
}
