export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const document_id = formData.get('document_id') as string | null

  if (!file || !document_id) {
    return Response.json({ error: 'file and document_id required' }, { status: 400 })
  }
  if (file.type !== 'application/pdf') {
    return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const path = `${document_id}/original.pdf`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('zd-documents')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: true })

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 })

  await supabase.from('zd_documents').update({ file_url: path }).eq('id', document_id)

  return Response.json({ file_url: path }, { status: 200 })
}
