import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: doc } = await supabase
    .from('zd_documents')
    .select('title, signed_pdf_url, file_url')
    .eq('id', id)
    .single()

  if (!doc) return Response.json({ error: 'Document not found' }, { status: 404 })

  const path = doc.signed_pdf_url ?? doc.file_url
  if (!path) return Response.json({ error: 'No PDF available' }, { status: 404 })

  const { data: fileData, error } = await supabase.storage.from('zd-documents').download(path)
  if (error || !fileData) return Response.json({ error: 'File not found' }, { status: 404 })

  const bytes = await fileData.arrayBuffer()
  const filename = `${doc.title.replace(/[^a-z0-9]/gi, '_')}_signed.pdf`

  await supabase.from('zd_audit_log').insert({
    document_id: id,
    event: 'downloaded',
  })

  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-cache',
    },
  })
}
