import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('zd_org_integrations')
    .select('provider, config')
    .eq('user_id', user.id)

  const result: Record<string, Record<string, string>> = {}
  for (const row of data ?? []) {
    result[row.provider] = row.config ?? {}
  }
  return Response.json(result)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { provider, config } = body as { provider: string; config: Record<string, string> }

  if (!provider) return Response.json({ error: 'provider required' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin
    .from('zd_org_integrations')
    .upsert({ user_id: user.id, provider, config }, { onConflict: 'user_id,provider' })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider')
  if (!provider) return Response.json({ error: 'provider required' }, { status: 400 })

  const admin = createAdminClient()
  await admin
    .from('zd_org_integrations')
    .delete()
    .eq('user_id', user.id)
    .eq('provider', provider)

  return Response.json({ success: true })
}
