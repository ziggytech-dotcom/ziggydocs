export const dynamic = 'force-dynamic';
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
    .select('file_url')
    .eq('id', id)
    .single()

  if (!doc?.file_url) return Response.json({ error: 'No PDF' }, { status: 404 })

  const { data } = await supabase.storage.from('zd-documents').createSignedUrl(doc.file_url, 3600)
  if (!data?.signedUrl) return Response.json({ error: 'Could not generate URL' }, { status: 500 })

  return Response.json({ url: data.signedUrl })
}
