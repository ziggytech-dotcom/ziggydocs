export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { fields_json } = body

  if (!Array.isArray(fields_json)) {
    return Response.json({ error: 'fields_json must be an array' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('zd_documents')
    .update({ fields_json })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
