export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { event_type, target_url } = body as { event_type: string; target_url: string }

  if (!event_type || !target_url) {
    return Response.json({ error: 'event_type and target_url required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('zapier_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('event_type', event_type)
    .eq('target_url', target_url)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
