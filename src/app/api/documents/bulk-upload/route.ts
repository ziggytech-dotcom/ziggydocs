import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return Response.json({ error: 'file required' }, { status: 400 })
  if (file.type !== 'application/pdf') return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: 'File must be under 10MB' }, { status: 400 })

  const supabase = createAdminClient()
  const id = crypto.randomUUID()
  const path = `bulk/${id}/original.pdf`
  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('zd-documents')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ file_url: path }, { status: 200 })
}
