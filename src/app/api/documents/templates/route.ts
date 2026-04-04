export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const user_id = url.searchParams.get('user_id')
  const supabase = createAdminClient()

  let query = supabase.from('zd_templates').select('*').order('created_at', { ascending: false })
  if (user_id) query = query.eq('user_id', user_id)

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, user_id } = body

  if (!title || !user_id) return Response.json({ error: 'title and user_id required' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('zd_templates')
    .insert({ title, user_id, fields_json: [] })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
